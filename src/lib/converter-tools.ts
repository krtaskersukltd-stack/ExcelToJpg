import type { OutputFormat } from "@/components/LiveConverterModal";
import type { ExcelSourceKind } from "@/lib/api";

export type ConverterToolId =
  | "excel-jpg"
  | "excel-png"
  | "excel-pdf"
  | "excel-csv"
  | "jpg-excel"
  | "png-excel"
  | "pdf-excel"
  | "csv-excel"
  | "formula";

export const NAV_TOOL_IDS: ConverterToolId[] = [
  "excel-jpg", "excel-png", "excel-pdf", "jpg-excel", "png-excel", "pdf-excel", "csv-excel", "formula",
];

export const UTILITY_TOOL_IDS: ConverterToolId[] = [
  "excel-png", "excel-pdf", "jpg-excel", "png-excel", "pdf-excel", "csv-excel",
];

export const PRODUCT_TOOL_IDS: ConverterToolId[] = [
  "png-excel", "excel-jpg", "csv-excel", "pdf-excel", "formula", "jpg-excel",
];

export const FORWARD_FORMATS: Partial<Record<ConverterToolId, OutputFormat>> = {
  "excel-jpg": "jpg",
  "excel-png": "png",
  "excel-pdf": "pdf",
  "excel-csv": "csv",
};

export const REVERSE_SOURCES: Partial<Record<ConverterToolId, ExcelSourceKind>> = {
  "jpg-excel": "jpg",
  "png-excel": "png",
  "pdf-excel": "pdf",
  "csv-excel": "csv",
};

export const TOOL_LABELS: Record<ConverterToolId, string> = {
  "excel-jpg": "Excel to JPG",
  "excel-png": "Excel to PNG",
  "excel-pdf": "Excel to PDF",
  "excel-csv": "Excel to CSV",
  "jpg-excel": "JPG to Excel",
  "png-excel": "PNG to Excel",
  "pdf-excel": "PDF to Excel",
  "csv-excel": "CSV to Excel",
  formula: "Excel Formula Generator",
};
