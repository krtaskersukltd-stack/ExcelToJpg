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

export interface ToolColumnItem {
  id: ConverterToolId;
  name: string;
  desc: string;
  badge?: string;
}

export interface ToolColumnGroup {
  title: string;
  subtitle: string;
  tools: ToolColumnItem[];
}

export const NAV_TOOL_COLUMNS: ToolColumnGroup[] = [
  {
    title: "Excel To Formats",
    subtitle: "Export from Excel",
    tools: [
      { id: "excel-jpg", name: "Excel to JPG", desc: "High-DPI raster image export" },
      { id: "excel-png", name: "Excel to PNG", desc: "Lossless transparent output" },
      { id: "excel-pdf", name: "Excel to PDF", desc: "Print-ready vectorized sheets" },
      { id: "excel-csv", name: "Excel to CSV", desc: "Clean comma-separated values" },
      { id: "excel-json", name: "Excel to JSON", desc: "Structured JSON records export" },
      { id: "excel-tally", name: "Excel to Tally", desc: "Tally XML accounting format" },
      { id: "excel-xls", name: "XLSX to XLS", desc: "Legacy 97-2003 workbook" },
      { id: "excel-xlsx", name: "XLS to XLSX", desc: "Modern OpenXML workbook" },
    ],
  },
  {
    title: "Files To Excel",
    subtitle: "OCR & Document Import",
    tools: [
      { id: "jpg-excel", name: "JPG to Excel", desc: "Extract table data via OCR" },
      { id: "jpeg-excel", name: "JPEG to Excel", desc: "Scan receipts & invoice tables" },
      { id: "png-excel", name: "PNG to Excel", desc: "Turn screenshots back to tables" },
      { id: "pdf-excel", name: "PDF to Excel", desc: "Reconstruct PDF tables to XLSX" },
      { id: "bank-pdf-excel", name: "Bank PDF to Excel", desc: "Extract statement transactions" },
      { id: "word-excel", name: "Word to Excel", desc: "Extract docx tables into sheets" },
      { id: "csv-excel", name: "CSV to Excel", desc: "Format comma separated datasets" },
      { id: "tsv-excel", name: "TSV to Excel", desc: "Tab-separated values to sheets" },
    ],
  },
  {
    title: "Data & AI Tools",
    subtitle: "Specialized Conversions",
    tools: [
      { id: "json-excel", name: "JSON to Excel", desc: "Convert API responses to tables" },
      { id: "xml-excel", name: "XML to Excel", desc: "Parse XML feeds into workbook" },
      { id: "txt-excel", name: "Text to Excel", desc: "Delimited text to spreadsheets" },
      { id: "ods-excel", name: "ODS to Excel", desc: "OpenDocument calc to Excel" },
      { id: "vcf-excel", name: "VCF to Excel", desc: "Contact vCards to contact sheets" },
      { id: "formula", name: "Formula Generator", desc: "AI-assisted spreadsheet formulas", badge: "AI" },
    ],
  },
];

export interface ToolConfig {
  id: ConverterToolId;
  label: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  subtitle: string;
  dropzoneTitle: string;
  dropzoneSubtitle: string;
  chooseButtonText: string;
  accept: string;
  badges: string[];
  actionType: "forward_excel" | "reverse_excel" | "formula";
  forwardFormat?: OutputFormat;
  sourceKind?: ExcelSourceKind;
}

export function getToolConfig(toolId: ConverterToolId): ToolConfig {
  switch (toolId) {
    case "excel-jpg":
      return {
        id: toolId,
        label: "Excel to JPG",
        titlePrefix: "Excel To",
        titleHighlight: "JPG",
        titleSuffix: "Converter",
        subtitle: "Convert Excel spreadsheets into clear, high-quality JPG images online. Upload your Excel file, convert it, and download your images in seconds.",
        dropzoneTitle: "Drop your Excel file here",
        dropzoneSubtitle: "or choose a file from your device",
        chooseButtonText: "Choose Excel File",
        accept: ".xls,.xlsx,.csv,.xlsm",
        badges: [".XLS", ".XLSX", ".CSV", ".XLSM"],
        actionType: "forward_excel",
        forwardFormat: "jpg",
      };
    case "excel-png":
      return {
        id: toolId,
        label: "Excel to PNG",
        titlePrefix: "Excel To",
        titleHighlight: "PNG",
        titleSuffix: "Converter",
        subtitle: "Convert Excel spreadsheets into crisp, lossless PNG images online with transparent background support.",
        dropzoneTitle: "Drop your Excel file here",
        dropzoneSubtitle: "or choose a file from your device",
        chooseButtonText: "Choose Excel File",
        accept: ".xls,.xlsx,.csv,.xlsm",
        badges: [".XLS", ".XLSX", ".CSV", ".XLSM"],
        actionType: "forward_excel",
        forwardFormat: "png",
      };
    case "excel-pdf":
      return {
        id: toolId,
        label: "Excel to PDF",
        titlePrefix: "Excel To",
        titleHighlight: "PDF",
        titleSuffix: "Converter",
        subtitle: "Convert Excel spreadsheets into clean, print-ready PDF documents with preserved layout and formatting.",
        dropzoneTitle: "Drop your Excel file here",
        dropzoneSubtitle: "or choose a file from your device",
        chooseButtonText: "Choose Excel File",
        accept: ".xls,.xlsx,.csv,.xlsm",
        badges: [".XLS", ".XLSX", ".CSV", ".XLSM"],
        actionType: "forward_excel",
        forwardFormat: "pdf",
      };
    case "excel-csv":
      return {
        id: toolId,
        label: "Excel to CSV",
        titlePrefix: "Excel To",
        titleHighlight: "CSV",
        titleSuffix: "Converter",
        subtitle: "Convert Excel spreadsheets into clean, comma-separated CSV files for effortless database imports.",
        dropzoneTitle: "Drop your Excel file here",
        dropzoneSubtitle: "or choose a file from your device",
        chooseButtonText: "Choose Excel File",
        accept: ".xls,.xlsx,.csv,.xlsm",
        badges: [".XLS", ".XLSX", ".CSV", ".XLSM"],
        actionType: "forward_excel",
        forwardFormat: "csv",
      };
    case "excel-json":
      return {
        id: toolId,
        label: "Excel to JSON",
        titlePrefix: "Excel To",
        titleHighlight: "JSON",
        titleSuffix: "Converter",
        subtitle: "Export structured JSON records from your Excel sheets directly for APIs, web apps, and databases.",
        dropzoneTitle: "Drop your Excel file here",
        dropzoneSubtitle: "or choose a file from your device",
        chooseButtonText: "Choose Excel File",
        accept: ".xls,.xlsx,.csv,.xlsm",
        badges: [".XLS", ".XLSX", ".CSV"],
        actionType: "forward_excel",
        forwardFormat: "json",
      };
    case "excel-tally":
      return {
        id: toolId,
        label: "Excel to Tally",
        titlePrefix: "Excel To",
        titleHighlight: "Tally",
        titleSuffix: "Converter",
        subtitle: "Convert Excel financial transactions and voucher entries into Tally-compliant XML format.",
        dropzoneTitle: "Drop your Excel file here",
        dropzoneSubtitle: "or choose a file from your device",
        chooseButtonText: "Choose Excel File",
        accept: ".xls,.xlsx,.csv",
        badges: [".XLS", ".XLSX"],
        actionType: "forward_excel",
        forwardFormat: "tally",
      };
    case "excel-xls":
      return {
        id: toolId,
        label: "XLSX to XLS",
        titlePrefix: "XLSX To",
        titleHighlight: "XLS",
        titleSuffix: "Converter",
        subtitle: "Convert modern Excel XLSX files into legacy Excel 97-2003 XLS format for backward compatibility.",
        dropzoneTitle: "Drop your XLSX file here",
        dropzoneSubtitle: "or choose a file from your device",
        chooseButtonText: "Choose XLSX File",
        accept: ".xlsx",
        badges: [".XLSX"],
        actionType: "forward_excel",
        forwardFormat: "xls",
      };
    case "excel-xlsx":
      return {
        id: toolId,
        label: "XLS to XLSX",
        titlePrefix: "XLS To",
        titleHighlight: "XLSX",
        titleSuffix: "Converter",
        subtitle: "Upgrade legacy Excel XLS files into modern OpenXML XLSX format with enhanced performance.",
        dropzoneTitle: "Drop your XLS file here",
        dropzoneSubtitle: "or choose a file from your device",
        chooseButtonText: "Choose XLS File",
        accept: ".xls",
        badges: [".XLS"],
        actionType: "forward_excel",
        forwardFormat: "xlsx",
      };
    case "jpg-excel":
    case "jpeg-excel":
      return {
        id: toolId,
        label: toolId === "jpeg-excel" ? "JPEG to Excel" : "JPG to Excel",
        titlePrefix: toolId === "jpeg-excel" ? "JPEG To" : "JPG To",
        titleHighlight: "Excel",
        titleSuffix: "Converter",
        subtitle: "Extract table data and convert scanned receipts or JPG invoices into editable Excel spreadsheets via OCR.",
        dropzoneTitle: "Drop your JPG image here",
        dropzoneSubtitle: "or choose an image from your device",
        chooseButtonText: "Choose JPG Image",
        accept: ".jpg,.jpeg,image/jpeg",
        badges: [".JPG", ".JPEG"],
        actionType: "reverse_excel",
        sourceKind: "jpg",
      };
    case "png-excel":
      return {
        id: toolId,
        label: "PNG to Excel",
        titlePrefix: "PNG To",
        titleHighlight: "Excel",
        titleSuffix: "Converter",
        subtitle: "Turn screenshots, tables, and infographic data into clean, structured Excel (.xlsx) spreadsheets.",
        dropzoneTitle: "Drop your PNG screenshot here",
        dropzoneSubtitle: "or choose an image from your device",
        chooseButtonText: "Choose PNG Image",
        accept: ".png,image/png",
        badges: [".PNG"],
        actionType: "reverse_excel",
        sourceKind: "png",
      };
    case "pdf-excel":
      return {
        id: toolId,
        label: "PDF to Excel",
        titlePrefix: "PDF To",
        titleHighlight: "Excel",
        titleSuffix: "Converter",
        subtitle: "Extract tables and tabular data from PDF documents directly into clean XLSX workbooks with preserved columns.",
        dropzoneTitle: "Drop your PDF file here",
        dropzoneSubtitle: "or choose a PDF from your device",
        chooseButtonText: "Choose PDF File",
        accept: ".pdf,application/pdf",
        badges: [".PDF"],
        actionType: "reverse_excel",
        sourceKind: "pdf",
      };
    case "bank-pdf-excel":
      return {
        id: toolId,
        label: "Bank Statement PDF to Excel",
        titlePrefix: "Bank PDF To",
        titleHighlight: "Excel",
        titleSuffix: "Converter",
        subtitle: "Parse bank statements and financial summaries into structured Excel spreadsheets with clean dates, debits, and credits.",
        dropzoneTitle: "Drop your Bank Statement PDF here",
        dropzoneSubtitle: "or choose a PDF statement from your device",
        chooseButtonText: "Choose Statement PDF",
        accept: ".pdf,application/pdf",
        badges: [".PDF"],
        actionType: "reverse_excel",
        sourceKind: "bank_statement_pdf",
      };
    case "word-excel":
      return {
        id: toolId,
        label: "Word to Excel",
        titlePrefix: "Word To",
        titleHighlight: "Excel",
        titleSuffix: "Converter",
        subtitle: "Extract tables, lists, and tabular sections from Microsoft Word (.docx) documents into Excel workbooks.",
        dropzoneTitle: "Drop your Word document here",
        dropzoneSubtitle: "or choose a DOCX file from your device",
        chooseButtonText: "Choose Word Document",
        accept: ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        badges: [".DOCX"],
        actionType: "reverse_excel",
        sourceKind: "word",
      };
    case "csv-excel":
      return {
        id: toolId,
        label: "CSV to Excel",
        titlePrefix: "CSV To",
        titleHighlight: "Excel",
        titleSuffix: "Converter",
        subtitle: "Format comma-separated values into beautifully styled Microsoft Excel spreadsheets with auto-detected columns.",
        dropzoneTitle: "Drop your CSV file here",
        dropzoneSubtitle: "or choose a CSV file from your device",
        chooseButtonText: "Choose CSV File",
        accept: ".csv,text/csv",
        badges: [".CSV"],
        actionType: "reverse_excel",
        sourceKind: "csv",
      };
    case "tsv-excel":
      return {
        id: toolId,
        label: "TSV to Excel",
        titlePrefix: "TSV To",
        titleHighlight: "Excel",
        titleSuffix: "Converter",
        subtitle: "Convert tab-separated text files directly into formatted Excel sheets without data truncation.",
        dropzoneTitle: "Drop your TSV file here",
        dropzoneSubtitle: "or choose a TSV file from your device",
        chooseButtonText: "Choose TSV File",
        accept: ".tsv,.txt",
        badges: [".TSV"],
        actionType: "reverse_excel",
        sourceKind: "tsv",
      };
    case "json-excel":
      return {
        id: toolId,
        label: "JSON to Excel",
        titlePrefix: "JSON To",
        titleHighlight: "Excel",
        titleSuffix: "Converter",
        subtitle: "Convert JSON arrays, API outputs, and object hierarchies into organized Excel tables and columns.",
        dropzoneTitle: "Drop your JSON file here",
        dropzoneSubtitle: "or choose a JSON file from your device",
        chooseButtonText: "Choose JSON File",
        accept: ".json,application/json",
        badges: [".JSON"],
        actionType: "reverse_excel",
        sourceKind: "json",
      };
    case "xml-excel":
      return {
        id: toolId,
        label: "XML to Excel",
        titlePrefix: "XML To",
        titleHighlight: "Excel",
        titleSuffix: "Converter",
        subtitle: "Parse XML documents and hierarchical tree records into tidy Excel spreadsheets.",
        dropzoneTitle: "Drop your XML file here",
        dropzoneSubtitle: "or choose an XML file from your device",
        chooseButtonText: "Choose XML File",
        accept: ".xml,text/xml",
        badges: [".XML"],
        actionType: "reverse_excel",
        sourceKind: "xml",
      };
    case "txt-excel":
      return {
        id: toolId,
        label: "Text to Excel",
        titlePrefix: "Text To",
        titleHighlight: "Excel",
        titleSuffix: "Converter",
        subtitle: "Convert plain text files, logs, and notepad notes into rows and columns in Excel.",
        dropzoneTitle: "Drop your Text file here",
        dropzoneSubtitle: "or choose a TXT file from your device",
        chooseButtonText: "Choose Text File",
        accept: ".txt,.text,.log",
        badges: [".TXT"],
        actionType: "reverse_excel",
        sourceKind: "txt",
      };
    case "ods-excel":
      return {
        id: toolId,
        label: "ODS to Excel",
        titlePrefix: "ODS To",
        titleHighlight: "Excel",
        titleSuffix: "Converter",
        subtitle: "Convert OpenDocument Spreadsheet (ODS) files into Microsoft Excel XLSX workbooks smoothly.",
        dropzoneTitle: "Drop your ODS file here",
        dropzoneSubtitle: "or choose an ODS file from your device",
        chooseButtonText: "Choose ODS File",
        accept: ".ods",
        badges: [".ODS"],
        actionType: "reverse_excel",
        sourceKind: "ods",
      };
    case "vcf-excel":
      return {
        id: toolId,
        label: "VCF to Excel",
        titlePrefix: "VCF To",
        titleHighlight: "Excel",
        titleSuffix: "Converter",
        subtitle: "Export contact names, phone numbers, and email addresses from VCF vCard files into Excel.",
        dropzoneTitle: "Drop your VCF file here",
        dropzoneSubtitle: "or choose a VCF file from your device",
        chooseButtonText: "Choose VCF File",
        accept: ".vcf,.vcard",
        badges: [".VCF"],
        actionType: "reverse_excel",
        sourceKind: "vcf",
      };
    case "formula":
      return {
        id: toolId,
        label: "Excel Formula Generator",
        titlePrefix: "AI Excel",
        titleHighlight: "Formula",
        titleSuffix: "Generator",
        subtitle: "Generate complex Excel and Google Sheets formulas instantly with AI assistance. Describe what you need in plain English.",
        dropzoneTitle: "Need a complex Excel formula?",
        dropzoneSubtitle: "Let our AI assistant generate and explain it for you in seconds",
        chooseButtonText: "Generate Formula with AI",
        accept: "",
        badges: [".AI", ".EXCEL", ".SHEETS"],
        actionType: "formula",
      };
    default:
      return {
        id: "excel-jpg",
        label: "Excel to JPG",
        titlePrefix: "Excel To",
        titleHighlight: "JPG",
        titleSuffix: "Converter",
        subtitle: "Convert Excel spreadsheets into clear, high-quality JPG images online.",
        dropzoneTitle: "Drop your Excel file here",
        dropzoneSubtitle: "or choose a file from your device",
        chooseButtonText: "Choose Excel File",
        accept: ".xls,.xlsx,.csv,.xlsm",
        badges: [".XLS", ".XLSX", ".CSV", ".XLSM"],
        actionType: "forward_excel",
        forwardFormat: "jpg",
      };
  }
}

