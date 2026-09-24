"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Check, CheckCircle2, Download, FileArchive, FileSpreadsheet, FileText, Image as ImageIcon, Layers, Loader2, RefreshCw, RotateCcw, Server, Sparkles, Undo2, Upload, X } from "lucide-react";
import confetti from "canvas-confetti";
import { checkBackendHealth, ConvertedPart, convertExcelFile, convertExcelUrl, getPreviewUrl, triggerFileDownload } from "@/lib/api";

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

export default function LiveConverterModal({ isOpen, onClose, file, url, fileName = "Spreadsheet.xlsx", fileSize = "1.4 MB", initialFormat = "jpg", toolTitle, lockFormat = false }: LiveConverterModalProps) {
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef<AbortController | null>(null);

  const hasSource = Boolean(sourceFile || sourceUrl);
  const displayFileName = sourceFile?.name || (sourceUrl ? decodeURIComponent(sourceUrl.split("/").pop()?.split("?")[0] || "Remote_Spreadsheet.xlsx") : fileName);
  const displayFileSize = sourceFile ? `${Math.max(sourceFile.size / (1024 * 1024), 0.01).toFixed(2)} MB` : fileSize;
  const activeOutput = useMemo(() => outputs.find((item) => item.sheet === activeSheet) || outputs[0], [activeSheet, outputs]);

  const executeConversion = useCallback(async (formatToUse: OutputFormat, dpiToUse: Dpi, fileToUse: File | null, urlToUse: string | null) => {
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
      const result = fileToUse ? await convertExcelFile(fileToUse, formatToUse, dpiToUse, controller.signal) : await convertExcelUrl(urlToUse!, formatToUse, dpiToUse, controller.signal);
      if (controller.signal.aborted) return;
      if (result.status === "success") {
        const nextSheets = result.sheets || [];
        setProgress(100);
        setStatus("ready");
        setConvertedFilename(result.filename || result.conv);
        setConvertedType(result.type || formatToUse);
        setOutputs(result.outputs || []);
        setSheets(nextSheets);
        setActiveSheet(nextSheets[0] || "");
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
  }, []);

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
    setStatus(incomingFile || incomingUrl ? "parsing" : "idle");
    if (incomingFile || incomingUrl) void executeConversion(initialFormat, "300", incomingFile, incomingUrl);
    return () => requestRef.current?.abort();
  }, [isOpen, file, url, initialFormat, executeConversion]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const applySettings = (next: Settings, remember = true) => {
    if (remember && (next.format !== selectedFormat || next.dpi !== dpi)) setHistory((items) => [...items, { format: selectedFormat, dpi }].slice(-10));
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
    if (!filename) return;
    setIsDownloading(true);
    setErrorMessage(null);
    try {
      await triggerFileDownload(filename, filename);
      setDownloadSuccess(true);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.65 }, colors: ["#355BFF", "#38BDF8", "#10B981"] });
      window.setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Download failed.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;
  const isWorking = ["parsing", "rendering", "optimizing"].includes(status);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto p-4 sm:p-6" role="dialog" aria-modal="true" aria-label="Spreadsheet converter">
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-950/65 backdrop-blur-md" aria-label="Close converter" />
        <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }} className="relative z-10 my-auto flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <header className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-50 via-white to-slate-50 px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#355BFF] text-white shadow-lg shadow-blue-500/20"><FileSpreadsheet className="h-5 w-5" /></div>
              <div className="min-w-0"><h2 className="truncate text-base font-bold text-slate-950">{toolTitle || (hasSource ? displayFileName : "Convert a spreadsheet")}</h2><div className="flex items-center gap-2 text-xs text-slate-500">{hasSource && <span>{displayFileName} · {displayFileSize}</span>}{backendOnline === true && <span className="inline-flex items-center gap-1 font-semibold text-emerald-600"><span className="h-2 w-2 rounded-full bg-emerald-500" />Backend online</span>}{backendOnline === false && <span className="font-semibold text-amber-600">Backend unavailable</span>}</div></div>
            </div>
            <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800" aria-label="Close"><X className="h-5 w-5" /></button>
          </header>
          <input ref={fileInputRef} type="file" accept=".xls,.xlsx,.xlsm,.csv" onChange={handleFilePicked} className="hidden" />

          {status === "idle" && <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center"><div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-[#355BFF]"><Upload className="h-9 w-9" /></div><h3 className="text-2xl font-bold text-slate-950">Choose the spreadsheet to convert</h3><p className="mt-2 max-w-md text-sm leading-6 text-slate-500">XLS, XLSX, XLSM, and CSV files are supported. Nothing is converted until you choose a real file.</p><button onClick={() => fileInputRef.current?.click()} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#355BFF] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700"><FileSpreadsheet className="h-4 w-4" />Choose file</button></div>}

          {status !== "idle" && <div className="flex flex-col overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-3 sm:px-6">
              <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">{FORMATS.filter(({ id }) => !lockFormat || id === initialFormat).map(({ id, label, icon: Icon }) => <button key={id} disabled={isWorking || lockFormat} onClick={() => applySettings({ format: id, dpi })} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${selectedFormat === id ? "bg-[#355BFF] text-white" : "text-slate-600 hover:bg-slate-100"} disabled:opacity-80`}><Icon className="h-3.5 w-3.5" />{label} output</button>)}</div>
              <div className="flex flex-wrap items-center gap-2">{!(["pdf", "docx", "csv"] as OutputFormat[]).includes(selectedFormat) && <><span className="text-xs font-semibold text-slate-500">DPI</span>{(["150", "300", "600"] as Dpi[]).map((value) => <button key={value} disabled={isWorking} onClick={() => applySettings({ format: selectedFormat, dpi: value })} className={`rounded-lg px-2.5 py-1.5 text-xs font-bold ${dpi === value ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-600"} disabled:opacity-40`}>{value}</button>)}</>}<button onClick={handleUndo} disabled={!history.length || isWorking} className="ml-1 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-40"><Undo2 className="h-3.5 w-3.5" />Undo</button><button onClick={handleRevert} disabled={isWorking || (selectedFormat === initialFormat && dpi === "300")} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-40"><RotateCcw className="h-3.5 w-3.5" />Revert</button></div>
            </div>
            <div className="overflow-y-auto p-5 sm:p-6">
              {isWorking && <div className="flex min-h-[360px] flex-col items-center justify-center text-center"><div className="relative mb-6"><div className="h-20 w-20 animate-spin rounded-full border-4 border-blue-100 border-t-[#355BFF]" /><Sparkles className="absolute inset-0 m-auto h-7 w-7 text-[#355BFF]" /></div><h3 className="text-xl font-bold text-slate-950">{status === "parsing" ? "Reading every worksheet…" : status === "rendering" ? `Rendering ${selectedFormat.toUpperCase()} output…` : "Packaging your download…"}</h3><div className="mt-6 h-2.5 w-full max-w-md overflow-hidden rounded-full bg-slate-100"><motion.div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" animate={{ width: `${progress}%` }} /></div><p className="mt-2 text-xs font-semibold text-slate-400">{progress}% complete</p></div>}
              {status === "error" && <div className="flex min-h-[360px] flex-col items-center justify-center text-center"><div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600"><AlertCircle className="h-8 w-8" /></div><h3 className="text-xl font-bold text-slate-950">Conversion failed</h3><p className="mt-2 max-w-lg rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p><div className="mt-5 flex gap-3"><button onClick={() => void executeConversion(selectedFormat, dpi, sourceFile, sourceUrl)} className="inline-flex items-center gap-2 rounded-xl bg-[#355BFF] px-5 py-2.5 text-sm font-bold text-white"><RefreshCw className="h-4 w-4" />Try again</button><button onClick={() => fileInputRef.current?.click()} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700">Choose another file</button></div></div>}
              {status === "ready" && <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3"><div className="flex items-center gap-2 text-sm font-bold text-emerald-800"><CheckCircle2 className="h-5 w-5" />Conversion complete</div><button onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:underline"><ArrowLeft className="h-3.5 w-3.5" />Use another file</button></div>
                {sheets.length > 0 && <div className="flex gap-2 overflow-x-auto pb-1">{sheets.map((sheet) => <button key={sheet} onClick={() => setActiveSheet(sheet)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold ${activeSheet === sheet ? "bg-[#355BFF] text-white" : "border border-slate-200 bg-white text-slate-600"}`}>{sheet}</button>)}</div>}
                {activeOutput ? <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm"><div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3"><div><p className="text-sm font-bold text-slate-900">{activeOutput.sheet}</p><p className="text-xs text-slate-500">Part {activeOutput.part} · {dpi} DPI</p></div><button onClick={() => void handleDownload(activeOutput.filename)} className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"><Download className="h-3.5 w-3.5" />Download this image</button></div><div className="flex min-h-[300px] items-center justify-center overflow-auto p-4"><img src={getPreviewUrl(activeOutput.filename)} alt={`Preview of ${activeOutput.sheet}`} className="max-h-[440px] max-w-full rounded-lg border border-slate-200 bg-white object-contain shadow-sm" /></div></div> : <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-center"><FileArchive className="mb-4 h-14 w-14 text-[#355BFF]" /><h3 className="text-lg font-bold text-slate-900">{selectedFormat.toUpperCase()} document is ready</h3><p className="mt-1 text-sm text-slate-500">All workbook sheets are included in one file.</p></div>}
                {errorMessage && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>}{downloadSuccess && <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white"><Check className="h-4 w-4" />Download started successfully.</motion.div>}
                <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row"><div className="flex items-center gap-2 text-xs text-slate-500"><Server className="h-4 w-4 text-emerald-600" />{outputs.length || 1} output part{outputs.length === 1 ? "" : "s"} generated</div><button onClick={() => void handleDownload()} disabled={isDownloading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#355BFF] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-60 sm:w-auto">{isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}Download {convertedType === "zip" ? "all as ZIP" : selectedFormat.toUpperCase()}</button></div>
              </div>}
            </div>
          </div>}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
