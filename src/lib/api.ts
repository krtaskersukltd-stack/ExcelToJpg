/**
 * Backend API Client for Excel To JPG / PDF / DOCX Converter
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface ConvertSuccessResponse {
  status: "success";
  conv: string;
  filename: string;
  type?: "zip" | "pdf" | "docx";
  first_image?: string;
  total_parts?: number;
}

export interface ConvertErrorResponse {
  status: "error";
  error: string;
}

export type ConvertResult = ConvertSuccessResponse | ConvertErrorResponse;

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
  extension: string = "jpg"
): Promise<ConvertResult> {
  const formData = new FormData();
  formData.append("excel_file", file);
  formData.append("image_extension", extension.toLowerCase().replace(".", ""));

  try {
    const res = await fetch(`${API_BASE_URL}/api/excel_to_img`, {
      method: "POST",
      body: formData,
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
    };
  } catch (err: any) {
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
  extension: string = "jpg"
): Promise<ConvertResult> {
  const formData = new FormData();
  formData.append("url", url);
  formData.append("image_extension", extension.toLowerCase().replace(".", ""));

  try {
    const res = await fetch(`${API_BASE_URL}/api/excel_url`, {
      method: "POST",
      body: formData,
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
    };
  } catch (err: any) {
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
  } catch (e) {
    // Fallback direct window navigation
    window.open(downloadUrl, "_blank");
  }
}
