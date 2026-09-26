/**
 * Backend API Client for Excel To JPG / PDF / DOCX Converter
 */

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "/api/py").replace(/\/$/, "");

export interface ConvertedPart {
  filename: string;
  sheet: string;
  part: number;
}

export interface SheetData {
  columns: string[];
  rows: string[][];
  total_rows?: number;
}

export interface ConvertSuccessResponse {
  status: "success";
  conv: string;
  filename: string;
  type?: "zip" | "pdf" | "docx" | "csv" | "xlsx" | "xls" | "json" | "xml";
  first_image?: string;
  total_parts?: number;
  sheets?: string[];
  outputs?: ConvertedPart[];
  sheet_data?: Record<string, SheetData>;
}

export interface ConvertErrorResponse {
  status: "error";
  error: string;
}

export type ConvertResult = ConvertSuccessResponse | ConvertErrorResponse;

export type ExcelSourceKind =
  | "jpg"
  | "jpeg"
  | "png"
  | "pdf"
  | "bank_statement_pdf"
  | "csv"
  | "tsv"
  | "json"
  | "xml"
  | "txt"
  | "text"
  | "notepad"
  | "word"
  | "ods"
  | "vcf";

export async function convertFileToExcel(file: File, sourceKind: ExcelSourceKind, signal?: AbortSignal): Promise<ConvertResult> {
  const formData = new FormData();
  formData.append("source_file", file);
  formData.append("source_kind", sourceKind);
  try {
    const response = await fetch(`${API_BASE_URL}/api/file_to_excel`, { method: "POST", body: formData, signal });
    const data = await response.json();
    if (!response.ok || data.status === "error") return { status: "error", error: data.error || data.detail || `Conversion failed (HTTP ${response.status})` };
    return { status: "success", conv: data.conv || data.filename, filename: data.filename || data.conv, type: "xlsx", total_parts: data.rows || 1 };
  } catch (error: any) {
    if (error?.name === "AbortError") throw error;
    return { status: "error", error: error?.message || "Network error occurred during conversion" };
  }
}

/**
 * Check if the Python FastAPI backend is currently online and accessible
 */
export async function checkBackendHealth(): Promise<{ online: boolean; message?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return { online: true, message: data.service || "Connected" };
    }
    return { online: false, message: `HTTP ${res.status}` };
  } catch (err: any) {
    return { online: false, message: err?.message || "Backend offline" };
  }
}

/**
 * Upload and convert an Excel file using the Python FastAPI backend
 */
export async function convertExcelFile(
  file: File,
  extension: string = "jpg",
  dpi: string = "300",
  signal?: AbortSignal,
): Promise<ConvertResult> {
  const formData = new FormData();
  formData.append("excel_file", file);
  formData.append("image_extension", extension.toLowerCase().replace(".", ""));
  formData.append("dpi", dpi);

  try {
    const res = await fetch(`${API_BASE_URL}/api/excel_to_img`, {
      method: "POST",
      body: formData,
      signal,
    });

    const data = await res.json();
    if (!res.ok || data.status === "error") {
      return {
        status: "error",
        error: data.error || data.detail || `Conversion failed (HTTP ${res.status})`,
      };
    }

    return {
      status: "success",
      conv: data.conv || data.filename,
      filename: data.filename || data.conv,
      type: data.type || (extension.includes("doc") ? "docx" : extension === "pdf" ? "pdf" : "zip"),
      first_image: data.first_image,
      total_parts: data.total_parts || 1,
      sheets: data.sheets || [],
      outputs: data.outputs || [],
      sheet_data: data.sheet_data,
    };
  } catch (err: any) {
    if (err?.name === "AbortError") throw err;
    return {
      status: "error",
      error:
        err.name === "TypeError" && err.message.includes("fetch")
          ? "Unable to connect to Python backend at " + API_BASE_URL + ". Ensure the backend server is running."
          : err.message || "Network error occurred during conversion",
    };
  }
}

/**
 * Convert an Excel file from a remote URL using the Python FastAPI backend
 */
export async function convertExcelUrl(
  url: string,
  extension: string = "jpg",
  dpi: string = "300",
  signal?: AbortSignal,
): Promise<ConvertResult> {
  const formData = new FormData();
  formData.append("url", url);
  formData.append("image_extension", extension.toLowerCase().replace(".", ""));
  formData.append("dpi", dpi);

  try {
    const res = await fetch(`${API_BASE_URL}/api/excel_url`, {
      method: "POST",
      body: formData,
      signal,
    });

    const data = await res.json();
    if (!res.ok || data.status === "error") {
      return {
        status: "error",
        error: data.error || data.detail || `Conversion failed (HTTP ${res.status})`,
      };
    }

    return {
      status: "success",
      conv: data.conv || data.filename,
      filename: data.filename || data.conv,
      type: data.type || (extension.includes("doc") ? "docx" : extension === "pdf" ? "pdf" : "zip"),
      first_image: data.first_image,
      total_parts: data.total_parts || 1,
      sheets: data.sheets || [],
      outputs: data.outputs || [],
      sheet_data: data.sheet_data,
    };
  } catch (err: any) {
    if (err?.name === "AbortError") throw err;
    return {
      status: "error",
      error:
        err.name === "TypeError" && err.message.includes("fetch")
          ? "Unable to connect to Python backend at " + API_BASE_URL + ". Ensure the backend server is running."
          : err.message || "Network error occurred during conversion",
    };
  }
}

/**
 * Get direct download link for a converted file
 */
export function getDownloadUrl(filename: string): string {
  return `${API_BASE_URL}/download_file?filename=${encodeURIComponent(filename)}`;
}

export function getPreviewUrl(filename: string): string {
  return `${API_BASE_URL}/preview_file?filename=${encodeURIComponent(filename)}`;
}

/**
 * Trigger immediate browser download of the converted file
 */
export async function triggerFileDownload(filename: string, suggestedName?: string) {
  const downloadUrl = getDownloadUrl(filename);
  
  try {
    const res = await fetch(downloadUrl);
    if (!res.ok) {
      throw new Error(`Download failed with status ${res.status}`);
    }
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = suggestedName || filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    throw error instanceof Error ? error : new Error("Download failed");
  }
}

/**
 * Re-render document/image with user-edited table data and typos corrected
 */
export async function renderEditedTable(payload: {
  sheet_name: string;
  columns: string[];
  rows: string[][];
  format: string;
  dpi: string;
}, signal?: AbortSignal): Promise<ConvertResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/render_edited_table`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
    const data = await res.json();
    if (!res.ok || data.status === "error") {
      return {
        status: "error",
        error: data.error || data.detail || `Re-rendering failed (HTTP ${res.status})`,
      };
    }
    return {
      status: "success",
      conv: data.conv || data.filename,
      filename: data.filename || data.conv,
      type: data.type || (payload.format.includes("doc") ? "docx" : payload.format === "pdf" ? "pdf" : "zip"),
      first_image: data.first_image,
      total_parts: data.total_parts || 1,
      sheets: data.sheets || [payload.sheet_name],
      outputs: data.outputs || [],
      sheet_data: data.sheet_data,
    };
  } catch (err: any) {
    if (err?.name === "AbortError") throw err;
    return {
      status: "error",
      error: err?.message || "Failed to update table rendering",
    };
  }
}

/**
 * Immediately purges user's uploaded and converted files from server.
 * Uses navigator.sendBeacon when available to ensure deletion even when page is refreshed or tab closed.
 */
export function cleanupFiles(filenames: string[]) {
  const valid = filenames.filter(Boolean);
  if (!valid.length) return;
  const url = `${API_BASE_URL}/api/cleanup_files`;
  const body = JSON.stringify({ filenames: valid });
  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(url, blob);
    } else {
      void fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch {
    // Ignore unload transport errors
  }
}

