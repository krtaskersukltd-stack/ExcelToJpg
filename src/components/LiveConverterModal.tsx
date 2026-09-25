"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Download,
  Edit3,
  Eye,
  FileArchive,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Layers,
  Loader2,
  Maximize2,
  Minimize2,
  RefreshCw,
  RotateCcw,
  Search,
  Server,
  Sparkles,
  Undo2,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  checkBackendHealth,
  cleanupFiles,
  ConvertedPart,
  convertExcelFile,
  convertExcelUrl,
  getPreviewUrl,
  renderEditedTable,
  SheetData,
  triggerFileDownload,
} from "@/lib/api";

export type OutputFormat = "jpg" | "png" | "pdf" | "docx" | "csv";
type Dpi = "150" | "300" | "600";
type ConversionStatus = "idle" | "parsing" | "rendering" | "optimizing" | "ready" | "error";
type Settings = { format: OutputFormat; dpi: Dpi };

interface LiveConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  file?: File | null;
  url?: string | null;
  fileName?: string;
  fileSize?: string;
  initialFormat?: OutputFormat;
  toolTitle?: string;
  lockFormat?: boolean;
}

const FORMATS = [
  { id: "jpg", label: "JPG", icon: ImageIcon },
  { id: "png", label: "PNG", icon: Layers },
  { id: "pdf", label: "PDF", icon: FileText },
  { id: "docx", label: "DOCX", icon: FileSpreadsheet },
  { id: "csv", label: "CSV", icon: FileText },
] as const;

export default function LiveConverterModal({
  isOpen,
  onClose,
  file,
  url,
  fileName = "Spreadsheet.xlsx",
  fileSize = "1.4 MB",
  initialFormat = "jpg",
  toolTitle,
  lockFormat = false,
}: LiveConverterModalProps) {
  const [sourceFile, setSourceFile] = useState<File | null>(file || null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(url || null);
  const [selectedFormat, setSelectedFormat] = useState<OutputFormat>(initialFormat);
  const [dpi, setDpi] = useState<Dpi>("300");
  const [history, setHistory] = useState<Settings[]>([]);
  const [status, setStatus] = useState<ConversionStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [convertedFilename, setConvertedFilename] = useState<string | null>(null);
  const [convertedType, setConvertedType] = useState("zip");
  const [outputs, setOutputs] = useState<ConvertedPart[]>([]);
  const [sheets, setSheets] = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState("");
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadedFiles, setDownloadedFiles] = useState<Set<string>>(() => new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const activeFilesRef = useRef<Set<string>>(new Set());

  // High-Resolution Preview & Zoom state
  const [viewMode, setViewMode] = useState<"preview" | "editor">("preview");
  const [zoom, setZoom] = useState(100);
  const [fitMode, setFitMode] = useState<"width" | "fit" | "actual">("width");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Interactive Table & Spelling Editor state
  const [sheetData, setSheetData] = useState<Record<string, SheetData>>({});
  const [editedSheetData, setEditedSheetData] = useState<Record<string, SheetData>>({});
  const [isUpdatingEdits, setIsUpdatingEdits] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const hasSource = Boolean(sourceFile || sourceUrl);
  const displayFileName =
    sourceFile?.name ||
    (sourceUrl ? decodeURIComponent(sourceUrl.split("/").pop()?.split("?")[0] || "Remote_Spreadsheet.xlsx") : fileName);
  const displayFileSize = sourceFile ? `${Math.max(sourceFile.size / (1024 * 1024), 0.01).toFixed(2)} MB` : fileSize;
  const activeOutput = useMemo(
    () => outputs.find((item) => item.sheet === activeSheet) || outputs[0],
    [activeSheet, outputs]
  );

  const currentSheetData = activeSheet && editedSheetData[activeSheet] ? editedSheetData[activeSheet] : null;
  const originalSheetData = activeSheet && sheetData[activeSheet] ? sheetData[activeSheet] : null;

  const hasEdits = useMemo(() => {
    if (!originalSheetData || !currentSheetData) return false;
    return JSON.stringify(originalSheetData) !== JSON.stringify(currentSheetData);
  }, [originalSheetData, currentSheetData]);

  const filteredRows = useMemo(() => {
    if (!currentSheetData) return [];
    if (!searchQuery.trim()) return currentSheetData.rows.slice(0, 150);
    const q = searchQuery.toLowerCase().trim();
    return currentSheetData.rows
      .filter((row) => row.some((cell) => String(cell).toLowerCase().includes(q)))
      .slice(0, 150);
  }, [currentSheetData, searchQuery]);

  const executeConversion = useCallback(
    async (formatToUse: OutputFormat, dpiToUse: Dpi, fileToUse: File | null, urlToUse: string | null) => {
      if (!fileToUse && !urlToUse) {
        setStatus("idle");
        return;
      }
      requestRef.current?.abort();
      const controller = new AbortController();
      requestRef.current = controller;
      setProgress(10);
      setStatus("parsing");
      setErrorMessage(null);
      setConvertedFilename(null);
      setOutputs([]);
      setSheets([]);
      setDownloadedFiles(new Set());

      // Purge any previously generated files before starting a new conversion
      if (activeFilesRef.current.size > 0) {
        cleanupFiles(Array.from(activeFilesRef.current));
        activeFilesRef.current.clear();
      }

      const health = await checkBackendHealth();
      if (controller.signal.aborted) return;
      setBackendOnline(health.online);
      const progressTimer = window.setInterval(() => {
        setProgress((current) => {
          const next = Math.min(current + (current < 45 ? 9 : current < 75 ? 5 : 2), 92);
          setStatus(next < 45 ? "parsing" : next < 78 ? "rendering" : "optimizing");
          return next;
        });
      }, 350);

      try {
        const result = fileToUse
          ? await convertExcelFile(fileToUse, formatToUse, dpiToUse, controller.signal)
          : await convertExcelUrl(urlToUse!, formatToUse, dpiToUse, controller.signal);
        if (controller.signal.aborted) return;
        if (result.status === "success") {
          const nextSheets = result.sheets || [];
          setProgress(100);
          setStatus("ready");
          setConvertedFilename(result.filename || result.conv);
          setConvertedType(result.type || formatToUse);
          setOutputs(result.outputs || []);
          setSheets(nextSheets);

          // Track generated files for zero-retention auto-purge on refresh or close
          if (result.filename) activeFilesRef.current.add(result.filename);
          if (result.conv) activeFilesRef.current.add(result.conv);
          if (result.first_image) activeFilesRef.current.add(result.first_image);
          (result.outputs || []).forEach((item) => {
            if (item.filename) activeFilesRef.current.add(item.filename);
          });

          const firstSheet = nextSheets[0] || "";
          setActiveSheet(firstSheet);
          if (result.sheet_data) {
            setSheetData(result.sheet_data);
            setEditedSheetData(JSON.parse(JSON.stringify(result.sheet_data)));
          }
        } else {
          setStatus("error");
          setErrorMessage(result.error || "The file could not be converted.");
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setStatus("error");
          setErrorMessage(error instanceof Error ? error.message : "Conversion failed.");
        }
      } finally {
        window.clearInterval(progressTimer);
      }
    },
    []
  );

  useEffect(() => {
    if (!isOpen) {
      requestRef.current?.abort();
      return;
    }
    const incomingFile = file || null;
    const incomingUrl = url || null;
    setSourceFile(incomingFile);
    setSourceUrl(incomingUrl);
    setSelectedFormat(initialFormat);
    setDpi("300");
    setHistory([]);
    setDownloadSuccess(false);
    setDownloadedFiles(new Set());
    setViewMode("preview");
    setFitMode("width");
    setZoom(100);
    setIsFullscreen(false);
    setSearchQuery("");
    setStatus(incomingFile || incomingUrl ? "parsing" : "idle");
    if (incomingFile || incomingUrl) void executeConversion(initialFormat, "300", incomingFile, incomingUrl);
    return () => requestRef.current?.abort();
  }, [isOpen, file, url, initialFormat, executeConversion]);

  const handleClose = useCallback(() => {
    if (activeFilesRef.current.size > 0) {
      cleanupFiles(Array.from(activeFilesRef.current));
      activeFilesRef.current.clear();
    }
    onClose();
  }, [onClose]);

  // Zero-retention auto-purge: purge all user files immediately when refreshing or closing tab
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (activeFilesRef.current.size > 0) {
        cleanupFiles(Array.from(activeFilesRef.current));
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (activeFilesRef.current.size > 0) {
        cleanupFiles(Array.from(activeFilesRef.current));
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          handleClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isFullscreen, handleClose]);

  const applySettings = (next: Settings, remember = true) => {
    if (remember && (next.format !== selectedFormat || next.dpi !== dpi))
      setHistory((items) => [...items, { format: selectedFormat, dpi }].slice(-10));
    setSelectedFormat(next.format);
    setDpi(next.dpi);
    void executeConversion(next.format, next.dpi, sourceFile, sourceUrl);
  };

  const handleUndo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setHistory((items) => items.slice(0, -1));
    applySettings(previous, false);
  };

  const handleRevert = () => {
    setHistory([]);
    applySettings({ format: initialFormat, dpi: "300" }, false);
  };

  const handleFilePicked = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;
    setSourceFile(nextFile);
    setSourceUrl(null);
    setHistory([]);
    void executeConversion(selectedFormat, dpi, nextFile, null);
    event.target.value = "";
  };

  const handleDownload = async (filename = convertedFilename) => {
    if (!filename || downloadedFiles.has(filename)) return;
    setIsDownloading(true);
    setErrorMessage(null);
    try {
      await triggerFileDownload(filename, filename);
      activeFilesRef.current.delete(filename);
      setDownloadedFiles((current) => new Set(current).add(filename));
      setDownloadSuccess(true);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.65 }, colors: ["#355BFF", "#38BDF8", "#10B981"] });
      window.setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Download failed.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    if (!activeSheet || !editedSheetData[activeSheet]) return;
    setEditedSheetData((prev) => {
      const current = prev[activeSheet];
      if (!current) return prev;
      const updatedRows = current.rows.map((row, rIdx) => {
        if (rIdx !== rowIndex) return row;
        const newRow = [...row];
        newRow[colIndex] = value;
        return newRow;
      });
      return {
        ...prev,
        [activeSheet]: {
          ...current,
          rows: updatedRows,
        },
      };
    });
  };

  const handleHeaderChange = (colIndex: number, value: string) => {
    if (!activeSheet || !editedSheetData[activeSheet]) return;
    setEditedSheetData((prev) => {
      const current = prev[activeSheet];
      if (!current) return prev;
      const updatedCols = [...current.columns];
      updatedCols[colIndex] = value;
      return {
        ...prev,
        [activeSheet]: {
          ...current,
          columns: updatedCols,
        },
      };
    });
  };

  const handleResetEdits = () => {
    if (!activeSheet || !sheetData[activeSheet]) return;
    setEditedSheetData((prev) => ({
      ...prev,
      [activeSheet]: JSON.parse(JSON.stringify(sheetData[activeSheet])),
    }));
  };

  const handleApplyEdits = async () => {
    if (!activeSheet || !editedSheetData[activeSheet]) return;
    const current = editedSheetData[activeSheet];
    setIsUpdatingEdits(true);
    setErrorMessage(null);
    try {
      const result = await renderEditedTable({
        sheet_name: activeSheet,
        columns: current.columns,
        rows: current.rows,
        format: selectedFormat,
        dpi: dpi,
      });
      if (result.status === "success") {
        if (activeFilesRef.current.size > 0) {
          cleanupFiles(Array.from(activeFilesRef.current));
          activeFilesRef.current.clear();
        }
        setConvertedFilename(result.filename || result.conv);
        setConvertedType(result.type || selectedFormat);
        setOutputs(result.outputs || []);
        setDownloadedFiles(new Set());
        if (result.filename) activeFilesRef.current.add(result.filename);
        if (result.conv) activeFilesRef.current.add(result.conv);
        if (result.first_image) activeFilesRef.current.add(result.first_image);
        (result.outputs || []).forEach((item) => {
          if (item.filename) activeFilesRef.current.add(item.filename);
        });
        if (result.sheet_data) {
          setSheetData(result.sheet_data);
          setEditedSheetData(JSON.parse(JSON.stringify(result.sheet_data)));
        }
        setViewMode("preview");
        confetti({ particleCount: 65, spread: 65, origin: { y: 0.6 } });
      } else {
        setErrorMessage(result.error || "Failed to re-render table with your changes.");
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to update table rendering");
    } finally {
      setIsUpdatingEdits(false);
    }
  };

  if (!isOpen) return null;
  const isWorking = ["parsing", "rendering", "optimizing"].includes(status);
  const previewImgUrl = activeOutput ? getPreviewUrl(activeOutput.filename) : "";

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto p-3 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label="Spreadsheet converter"
      >
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/65 backdrop-blur-md"
          aria-label="Close converter"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          className="relative z-10 my-auto flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-50 via-white to-slate-50 px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#355BFF] text-white shadow-lg shadow-blue-500/20">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-base font-bold text-slate-950">
                  {toolTitle || (hasSource ? displayFileName : "Convert a spreadsheet")}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  {hasSource && <span>{displayFileName} · {displayFileSize}</span>}
                  {backendOnline === true && (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Backend online
                    </span>
                  )}
                  {backendOnline === false && <span className="font-semibold text-amber-600">Backend unavailable</span>}
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </header>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xls,.xlsx,.xlsm,.csv"
            onChange={handleFilePicked}
            className="hidden"
          />

          {/* Idle screen */}
          {status === "idle" && (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-[#355BFF]">
                <Upload className="h-9 w-9" />
              </div>
              <h3 className="text-2xl font-bold text-slate-950">Choose the spreadsheet to convert</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                XLS, XLSX, XLSM, and CSV files are supported. Choose your spreadsheet to inspect, edit, and convert.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#355BFF] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Choose file
              </button>
            </div>
          )}

          {/* Active Screen */}
          {status !== "idle" && (
            <div className="flex flex-col overflow-hidden">
              {/* Settings Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-2.5 sm:px-6">
                <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
                  {FORMATS.filter(({ id }) => !lockFormat || id === initialFormat).map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      disabled={isWorking || lockFormat}
                      onClick={() => applySettings({ format: id, dpi })}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                        selectedFormat === id ? "bg-[#355BFF] text-white" : "text-slate-600 hover:bg-slate-100"
                      } disabled:opacity-80`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label} output
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {!(["pdf", "docx", "csv"] as OutputFormat[]).includes(selectedFormat) && (
                    <>
                      <span className="text-xs font-semibold text-slate-500">DPI</span>
                      {(["150", "300", "600"] as Dpi[]).map((value) => (
                        <button
                          key={value}
                          disabled={isWorking}
                          onClick={() => applySettings({ format: selectedFormat, dpi: value })}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                            dpi === value
                              ? "bg-slate-900 text-white"
                              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          } disabled:opacity-40`}
                        >
                          {value}
                        </button>
                      ))}
                    </>
                  )}
                  <button
                    onClick={handleUndo}
                    disabled={!history.length || isWorking}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition"
                  >
                    <Undo2 className="h-3.5 w-3.5" />
                    Undo
                  </button>
                  <button
                    onClick={handleRevert}
                    disabled={isWorking || (selectedFormat === initialFormat && dpi === "300")}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Revert
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="overflow-y-auto p-4 sm:p-6">
                {/* Converting Spinner */}
                {isWorking && (
                  <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                    <div className="relative mb-6">
                      <div className="h-20 w-20 animate-spin rounded-full border-4 border-blue-100 border-t-[#355BFF]" />
                      <Sparkles className="absolute inset-0 m-auto h-7 w-7 text-[#355BFF]" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-950">
                      {status === "parsing"
                        ? "Reading spreadsheet data…"
                        : status === "rendering"
                        ? `Rendering crisp ${selectedFormat.toUpperCase()} output…`
                        : "Packaging your download…"}
                    </h3>
                    <div className="mt-6 h-2.5 w-full max-w-md overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                        animate={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs font-semibold text-slate-400">{progress}% complete</p>
                  </div>
                )}

                {/* Error */}
                {status === "error" && (
                  <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                      <AlertCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-950">Conversion failed</h3>
                    <p className="mt-2 max-w-lg rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {errorMessage}
                    </p>
                    <div className="mt-5 flex gap-3">
                      <button
                        onClick={() => void executeConversion(selectedFormat, dpi, sourceFile, sourceUrl)}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#355BFF] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Try again
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
                      >
                        Choose another file
                      </button>
                    </div>
                  </div>
                )}

                {/* Ready: Preview & Editor */}
                {status === "ready" && (
                  <div className="space-y-4">
                    {/* Top Status & Switcher */}
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5">
                      <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                        <CheckCircle2 className="h-5 w-5" />
                        Conversion complete
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:underline"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                          Use another file
                        </button>
                      </div>
                    </div>

                    {/* Sheets tabs & View Mode Selector */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      {sheets.length > 0 && (
                        <div className="flex gap-1.5 overflow-x-auto">
                          {sheets.map((sheet) => (
                            <button
                              key={sheet}
                              onClick={() => setActiveSheet(sheet)}
                              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                                activeSheet === sheet
                                  ? "bg-[#355BFF] text-white shadow-sm"
                                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {sheet}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Toggle: Preview vs Cell Editor */}
                      {currentSheetData && (
                        <div className="ml-auto flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100/80 p-1">
                          <button
                            onClick={() => setViewMode("preview")}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition ${
                              viewMode === "preview"
                                ? "bg-white text-slate-950 shadow-sm"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            <Eye className="h-3.5 w-3.5 text-blue-600" />
                            Image Preview
                          </button>
                          <button
                            onClick={() => setViewMode("editor")}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition ${
                              viewMode === "editor"
                                ? "bg-white text-slate-950 shadow-sm"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            <Edit3 className="h-3.5 w-3.5 text-indigo-600" />
                            Edit Cells & Spelling
                            {hasEdits && (
                              <span className="h-2 w-2 rounded-full bg-amber-500" title="Unapplied edits" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* VIEW MODE 1: IMAGE PREVIEW */}
                    {viewMode === "preview" && (
                      <>
                        {activeOutput ? (
                          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                            {/* Preview Toolbar */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 py-2.5">
                              <div>
                                <p className="text-sm font-bold text-slate-900">{activeOutput.sheet}</p>
                                <p className="text-xs text-slate-500">
                                  Part {activeOutput.part} · {dpi} DPI
                                </p>
                              </div>

                              {/* Zoom & Fit Controls */}
                              <div className="flex flex-wrap items-center gap-1.5">
                                <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5">
                                  <button
                                    onClick={() => setFitMode("width")}
                                    className={`rounded px-2 py-1 text-xs font-semibold transition ${
                                      fitMode === "width"
                                        ? "bg-blue-50 text-blue-700 font-bold"
                                        : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                    title="Fit to full readable width"
                                  >
                                    Fit Width
                                  </button>
                                  <button
                                    onClick={() => setFitMode("fit")}
                                    className={`rounded px-2 py-1 text-xs font-semibold transition ${
                                      fitMode === "fit"
                                        ? "bg-blue-50 text-blue-700 font-bold"
                                        : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                    title="Fit entire page in view"
                                  >
                                    Fit View
                                  </button>
                                  <button
                                    onClick={() => setFitMode("actual")}
                                    className={`rounded px-2 py-1 text-xs font-semibold transition ${
                                      fitMode === "actual"
                                        ? "bg-blue-50 text-blue-700 font-bold"
                                        : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                    title="100% Actual pixel size"
                                  >
                                    100%
                                  </button>
                                </div>

                                <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5">
                                  <button
                                    onClick={() => setZoom((z) => Math.max(z - 25, 40))}
                                    className="rounded p-1 text-slate-600 hover:bg-slate-100 transition"
                                    title="Zoom out"
                                  >
                                    <ZoomOut className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setZoom(100)}
                                    className="px-1.5 text-[11px] font-bold text-slate-700 hover:text-blue-600"
                                    title="Reset zoom"
                                  >
                                    {zoom}%
                                  </button>
                                  <button
                                    onClick={() => setZoom((z) => Math.min(z + 25, 250))}
                                    className="rounded p-1 text-slate-600 hover:bg-slate-100 transition"
                                    title="Zoom in"
                                  >
                                    <ZoomIn className="h-3.5 w-3.5" />
                                  </button>
                                </div>

                                <button
                                  onClick={() => setIsFullscreen(true)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                                  title="Fullscreen high-res inspection"
                                >
                                  <Maximize2 className="h-3.5 w-3.5" />
                                  Full View
                                </button>

                                <button
                                  onClick={() => void handleDownload(activeOutput.filename)}
                                  disabled={downloadedFiles.has(activeOutput.filename)}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 transition"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                  {downloadedFiles.has(activeOutput.filename) ? "Downloaded" : "Download this image"}
                                </button>
                              </div>
                            </div>

                            {/* Image Canvas with Scroll */}
                            <div className="flex max-h-[520px] min-h-[300px] w-full items-start justify-center overflow-auto bg-slate-100/70 p-4">
                              <img
                                src={previewImgUrl}
                                alt={`Preview of ${activeOutput.sheet}`}
                                className={`rounded-xl border border-slate-200 bg-white shadow-md transition-transform duration-150 ${
                                  fitMode === "width"
                                    ? "h-auto w-full max-w-4xl object-contain"
                                    : fitMode === "fit"
                                    ? "max-h-[460px] max-w-full object-contain"
                                    : "max-w-none"
                                }`}
                                style={{
                                  transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
                                  transformOrigin: fitMode === "fit" ? "center" : "top center",
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-center">
                            <FileArchive className="mb-4 h-14 w-14 text-[#355BFF]" />
                            <h3 className="text-lg font-bold text-slate-900">
                              {selectedFormat.toUpperCase()} document is ready
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">All workbook sheets are included in one file.</p>
                          </div>
                        )}
                      </>
                    )}

                    {/* VIEW MODE 2: INTERACTIVE CELL & SPELLING EDITOR */}
                    {viewMode === "editor" && currentSheetData && (
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        {/* Editor Controls Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/90 px-4 py-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="relative">
                              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                              <input
                                type="text"
                                placeholder="Search cell text or typos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-8 rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 sm:w-60"
                              />
                            </div>
                            <span className="text-xs font-semibold text-slate-500">
                              {currentSheetData.columns.length} columns · {currentSheetData.rows.length} rows
                            </span>
                            {hasEdits && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                                Modified
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {hasEdits && (
                              <button
                                onClick={handleResetEdits}
                                disabled={isUpdatingEdits}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Reset edits
                              </button>
                            )}
                            <button
                              onClick={() => void handleApplyEdits()}
                              disabled={isUpdatingEdits || !hasEdits}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50"
                            >
                              {isUpdatingEdits ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Sparkles className="h-3.5 w-3.5" />
                              )}
                              Apply & Re-generate Image
                            </button>
                          </div>
                        </div>

                        {/* Interactive Table Grid */}
                        <div className="max-h-[460px] overflow-auto">
                          <table className="w-full border-collapse text-left text-xs">
                            <thead className="sticky top-0 z-10 bg-slate-100 text-slate-700 shadow-sm">
                              <tr>
                                <th className="border-b border-r border-slate-200 bg-slate-100/90 px-2 py-2 text-center font-bold text-slate-500 w-12">
                                  #
                                </th>
                                {currentSheetData.columns.map((colName, cIdx) => (
                                  <th
                                    key={cIdx}
                                    className="border-b border-r border-slate-200 bg-slate-100/90 px-3 py-2 font-bold text-slate-800 min-w-[120px]"
                                  >
                                    <input
                                      type="text"
                                      value={colName}
                                      onChange={(e) => handleHeaderChange(cIdx, e.target.value)}
                                      className="w-full bg-transparent font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
                                      title="Click to edit column header"
                                    />
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {filteredRows.map((row, rIdx) => (
                                <tr
                                  key={rIdx}
                                  className={rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/50 hover:bg-blue-50/30"}
                                >
                                  <td className="border-b border-r border-slate-100 px-2 py-1.5 text-center font-medium text-slate-400 select-none">
                                    {rIdx + 1}
                                  </td>
                                  {row.map((cellValue, cIdx) => (
                                    <td
                                      key={cIdx}
                                      className="border-b border-r border-slate-100 p-0 hover:bg-blue-50/40"
                                    >
                                      <input
                                        type="text"
                                        value={cellValue}
                                        onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                                        className="h-full w-full bg-transparent px-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                      />
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-500 flex items-center justify-between">
                          <span>
                            Showing {filteredRows.length} of {currentSheetData.rows.length} rows. Click any cell to edit spelling.
                          </span>
                          <span className="font-medium text-slate-600">
                            Press &ldquo;Apply &amp; Re-generate&rdquo; to update the image preview.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Messages */}
                    {errorMessage && (
                      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {errorMessage}
                      </div>
                    )}
                    {downloadSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white"
                      >
                        <Check className="h-4 w-4" />
                        Download started successfully.
                      </motion.div>
                    )}

                    {/* Bottom Action Bar */}
                    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Server className="h-4 w-4 text-emerald-600" />
                        {outputs.length || 1} output part{outputs.length === 1 ? "" : "s"} generated
                      </div>
                      <button
                        onClick={() => void handleDownload()}
                        disabled={isDownloading || Boolean(convertedFilename && downloadedFiles.has(convertedFilename))}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#355BFF] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-60 sm:w-auto transition"
                      >
                        {isDownloading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        {convertedFilename && downloadedFiles.has(convertedFilename)
                          ? "Downloaded (one time)"
                          : `Download ${convertedType === "zip" ? "all as ZIP" : selectedFormat.toUpperCase()}`}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* FULLSCREEN LIGHTBOX FOR HIGH-RESOLUTION INSPECTION */}
      {isFullscreen && activeOutput && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950/92 backdrop-blur-md">
          <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 py-3 text-white">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-bold text-white">{activeOutput.sheet} — Fullscreen Inspection</h3>
              <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                Part {activeOutput.part} · {dpi} DPI
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom((z) => Math.max(z - 25, 40))}
                className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoom(100)}
                className="px-2 text-xs font-bold text-slate-200 hover:text-white"
                title="Reset Zoom"
              >
                {zoom}%
              </button>
              <button
                onClick={() => setZoom((z) => Math.min(z + 25, 250))}
                className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => void handleDownload(activeOutput.filename)}
                disabled={downloadedFiles.has(activeOutput.filename)}
                className="ml-2 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition"
              >
                <Download className="h-3.5 w-3.5" />
                {downloadedFiles.has(activeOutput.filename) ? "Downloaded" : "Download"}
              </button>
              <button
                onClick={() => setIsFullscreen(false)}
                className="ml-3 rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                title="Close Fullscreen (Esc)"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>
          </header>
          <div className="flex flex-1 items-start justify-center overflow-auto p-8">
            <img
              src={previewImgUrl}
              alt={`Fullscreen preview of ${activeOutput.sheet}`}
              className="max-w-4xl rounded-xl border border-slate-800 bg-white shadow-2xl transition-transform duration-150"
              style={{
                transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
                transformOrigin: "top center",
              }}
            />
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
