import type { OutputFormat } from "@/components/LiveConverterModal";
import type { ExcelSourceKind } from "@/lib/api";

export type ConverterToolId =
  | "excel-jpg"
  | "excel-png"
  | "excel-pdf"
  | "excel-csv"
  | "excel-json"
  | "excel-tally"
  | "excel-xls"
  | "excel-xlsx"
  | "jpg-excel"
  | "jpeg-excel"
  | "png-excel"
  | "pdf-excel"
  | "bank-pdf-excel"
  | "csv-excel"
  | "tsv-excel"
  | "json-excel"
  | "xml-excel"
  | "txt-excel"
  | "word-excel"
  | "ods-excel"
  | "vcf-excel"
  | "formula";

/** Shown in the navbar Tools menu — keep index-aligned with translations where possible. */
export const NAV_TOOL_IDS: ConverterToolId[] = [
  "excel-jpg",
  "excel-png",
  "excel-pdf",
  "jpg-excel",
  "png-excel",
  "pdf-excel",
  "csv-excel",
  "word-excel",
  "json-excel",
  "txt-excel",
  "ods-excel",
  "xml-excel",
  "vcf-excel",
  "tsv-excel",
  "bank-pdf-excel",
  "excel-csv",
  "excel-json",
  "excel-tally",
  "excel-xls",
  "excel-xlsx",
  "jpeg-excel",
  "formula",
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
  "excel-json": "json",
  "excel-tally": "tally",
  "excel-xls": "xls",
  "excel-xlsx": "xlsx",
};

export const REVERSE_SOURCES: Partial<Record<ConverterToolId, ExcelSourceKind>> = {
  "jpg-excel": "jpg",
  "jpeg-excel": "jpeg",
  "png-excel": "png",
  "pdf-excel": "pdf",
  "bank-pdf-excel": "bank_statement_pdf",
  "csv-excel": "csv",
  "tsv-excel": "tsv",
  "json-excel": "json",
  "xml-excel": "xml",
  "txt-excel": "txt",
  "word-excel": "word",
  "ods-excel": "ods",
  "vcf-excel": "vcf",
};

export const TOOL_LABELS: Record<ConverterToolId, string> = {
  "excel-jpg": "Excel to JPG",
  "excel-png": "Excel to PNG",
  "excel-pdf": "Excel to PDF",
  "excel-csv": "Excel to CSV",
  "excel-json": "Excel to JSON",
  "excel-tally": "Excel to Tally",
  "excel-xls": "XLSX to XLS",
  "excel-xlsx": "XLS to XLSX",
  "jpg-excel": "JPG to Excel",
  "jpeg-excel": "JPEG to Excel",
  "png-excel": "PNG to Excel",
  "pdf-excel": "PDF to Excel",
  "bank-pdf-excel": "Bank Statement PDF to Excel",
  "csv-excel": "CSV to Excel",
  "tsv-excel": "TSV to Excel",
  "json-excel": "JSON to Excel",
  "xml-excel": "XML to Excel",
  "txt-excel": "Text to Excel",
  "word-excel": "Word to Excel",
  "ods-excel": "ODS to Excel",
  "vcf-excel": "VCF to Excel",
  formula: "Excel Formula Generator",
};
