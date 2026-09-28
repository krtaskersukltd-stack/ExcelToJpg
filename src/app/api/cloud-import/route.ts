import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow sufficient time for cloud file export

/**
 * Clean and extract spreadsheet ID from Google Docs / Drive URLs
 */
function extractGoogleId(urlStr: string): string | null {
  const match1 = urlStr.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match1 && match1[1]) return match1[1];

  const match2 = urlStr.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
  if (match2 && match2[1]) return match2[1];

  const match3 = urlStr.match(/[?&]id=([a-zA-Z0-9-_]+)/);
  if (match3 && match3[1]) return match3[1];

  return null;
}

/**
 * Extract filename from Content-Disposition header
 */
function extractFileNameFromHeader(disposition: string | null): string | null {
  if (!disposition) return null;

  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match && utf8Match[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      return utf8Match[1];
    }
  }

  const standardMatch = disposition.match(/filename=["']?([^"';]+)["']?/i);
  if (standardMatch && standardMatch[1]) {
    return standardMatch[1].trim();
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Please provide a valid URL." },
        { status: 400 }
      );
    }

    const trimmedUrl = url.trim();
    let fetchUrl = trimmedUrl;
    let fallbackFileName = "Spreadsheet.xlsx";
    let detectedSource = "Direct Link";

    // 1. Handle Google Sheets & Google Drive links
    if (trimmedUrl.includes("docs.google.com/spreadsheets") || trimmedUrl.includes("drive.google.com")) {
      const gId = extractGoogleId(trimmedUrl);
      if (!gId) {
        return NextResponse.json(
          { error: "Could not find a valid Google Drive or Google Sheets ID in the URL." },
          { status: 400 }
        );
      }

      detectedSource = "Google Drive";
      fallbackFileName = "Google_Sheet.xlsx";
      // Try official Google Sheets direct XLSX export
      fetchUrl = `https://docs.google.com/spreadsheets/d/${gId}/export?format=xlsx`;
    } 
    // 2. Handle Dropbox links
    else if (trimmedUrl.includes("dropbox.com")) {
      detectedSource = "Dropbox";
      fallbackFileName = "Dropbox_Spreadsheet.xlsx";
      
      // Convert standard Dropbox share URL to direct download URL
      if (fetchUrl.includes("?dl=0")) {
        fetchUrl = fetchUrl.replace("?dl=0", "?dl=1");
      } else if (fetchUrl.includes("&dl=0")) {
        fetchUrl = fetchUrl.replace("&dl=0", "&dl=1");
      } else if (!fetchUrl.includes("dl=1")) {
        fetchUrl += fetchUrl.includes("?") ? "&dl=1" : "?dl=1";
      }
    } 
    // 3. Handle Generic URLs
    else {
      try {
        const parsed = new URL(trimmedUrl);
        const pathSegments = parsed.pathname.split("/").filter(Boolean);
        const last = pathSegments[pathSegments.length - 1];
        if (last && /\.(xlsx|xls|csv|xlsm)$/i.test(last)) {
          fallbackFileName = decodeURIComponent(last);
        }
      } catch {
        // use default fallback
      }
    }

    // Fetch the remote file with realistic browser headers & timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const response = await fetch(fetchUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv,application/octet-stream,*/*",
      },
      redirect: "follow",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "The requested file was not found. Please verify the URL." },
          { status: 404 }
        );
      }
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          {
            error:
              "Permission denied. Please make sure file sharing is set to 'Anyone with the link can view'.",
          },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: `Cloud server returned HTTP ${response.status}.` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type") || "";
    const contentDisposition = response.headers.get("content-disposition");
    
    // Check if Google returned a login HTML page instead of spreadsheet binary
    if (
      contentType.includes("text/html") &&
      (trimmedUrl.includes("google.com") || trimmedUrl.includes("dropbox.com"))
    ) {
      // If it returned HTML from Google, the file is likely private
      return NextResponse.json(
        {
          error:
            "This file requires authentication or is set to private. In Google Drive/Sheets, click 'Share' -> 'Anyone with the link' (Viewer), then try again.",
        },
        { status: 403 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      return NextResponse.json(
        { error: "Downloaded file is empty." },
        { status: 400 }
      );
    }

    // Determine final filename
    let finalFileName = extractFileNameFromHeader(contentDisposition) || fallbackFileName;
    if (!/\.(xlsx|xls|csv|xlsm)$/i.test(finalFileName)) {
      finalFileName += ".xlsx";
    }

    const base64Data = buffer.toString("base64");
    const mimeType =
      contentType ||
      (finalFileName.endsWith(".csv")
        ? "text/csv"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    return NextResponse.json({
      success: true,
      fileName: finalFileName,
      sizeBytes: buffer.length,
      mimeType,
      source: detectedSource,
      base64Data,
    });
  } catch (err: any) {
    if (err.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timed out while downloading the file. Please try again." },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: err.message || "Failed to import remote file." },
      { status: 500 }
    );
  }
}
