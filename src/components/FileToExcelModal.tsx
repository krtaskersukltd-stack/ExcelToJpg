"use client";

import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, Loader2, Sparkles, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cleanupFiles, convertFileToExcel, ExcelSourceKind, triggerFileDownload } from "@/lib/api";

const ACCEPT: Record<ExcelSourceKind, string> = {
  jpg: ".jpg,.jpeg",
  jpeg: ".jpg,.jpeg",
  png: ".png",
  pdf: ".pdf",
  bank_statement_pdf: ".pdf",
  csv: ".csv",
  tsv: ".tsv,.txt",
  json: ".json",
  xml: ".xml",
  txt: ".txt,.text,.log",
  text: ".txt,.text,.log",
  notepad: ".txt,.text,.log",
  word: ".docx",
  ods: ".ods",
  vcf: ".vcf,.vcard",
};

const SOURCE_TITLES: Partial<Record<ExcelSourceKind, string>> = {
  bank_statement_pdf: "Bank Statement PDF to Excel",
  word: "Word to Excel",
  notepad: "Notepad to Excel",
  text: "Text to Excel",
  txt: "TXT to Excel",
};


export default function FileToExcelModal({
  isOpen,
  onClose,
  sourceKind,
  initialFile,
}: {
  isOpen: boolean;
  onClose: () => void;
  sourceKind: ExcelSourceKind;
  initialFile?: File | null;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "working" | "ready" | "error">("idle");
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [downloaded, setDownloaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const activeOutputRef = useRef<string | null>(null);

  const handleClose = () => {
    if (activeOutputRef.current) {
      cleanupFiles([activeOutputRef.current]);
      activeOutputRef.current = null;
    }
    onClose();
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (activeOutputRef.current) {
        cleanupFiles([activeOutputRef.current]);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (activeOutputRef.current) {
        cleanupFiles([activeOutputRef.current]);
      }
    };
  }, []);

  const convert = async (nextFile: File) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setFile(nextFile); setStatus("working"); setError(""); setOutput(null); setDownloaded(false);
    const result = await convertFileToExcel(nextFile, sourceKind, controller.signal);
    if (controller.signal.aborted) return;
    if (result.status === "success") {
      setOutput(result.filename);
      activeOutputRef.current = result.filename;
      setStatus("ready");
    } else {
      setError(result.error);
      setStatus("error");
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (activeOutputRef.current) {
        cleanupFiles([activeOutputRef.current]);
        activeOutputRef.current = null;
      }
      setFile(null);
      setStatus("idle");
      setOutput(null);
      setError("");
      setDownloaded(false);

      if (initialFile) {
        convert(initialFile);
      }
    } else {
      controllerRef.current?.abort();
    }
  }, [isOpen, sourceKind, initialFile]);


  const download = async () => {
    if (!output || downloaded) return;
    try {
      await triggerFileDownload(output, output);
      activeOutputRef.current = null;
      setDownloaded(true);
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : "Download failed");
    }
  };

  if (!isOpen) return null;
  const label = SOURCE_TITLES[sourceKind] || `${sourceKind.replaceAll("_", " ").toUpperCase()} to Excel`;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={label}>
        <button className="fixed inset-0 bg-slate-950/65 backdrop-blur-md" onClick={handleClose} aria-label="Close" />
        <motion.div initial={{ opacity: 0, y: 15, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
          <header className="flex items-center justify-between border-b border-slate-100 bg-blue-50/60 px-6 py-4">
            <div>
              <h2 className="text-lg font-bold text-slate-950">{label}</h2>
              <p className="text-xs text-slate-500">{
                sourceKind === "csv" || sourceKind === "tsv"
                  ? "Format delimited rows and columns into an XLSX workbook."
                  : sourceKind === "bank_statement_pdf"
                    ? "Extract bank transactions into Date, Description, Debit, Credit, and Balance columns."
                    : sourceKind === "word"
                      ? "Pull tables and text from Word documents into an editable XLSX workbook."
                      : "Extract readable table data into an editable XLSX workbook."
              }</p>
            </div>
            <button onClick={handleClose} className="rounded-full p-2 text-slate-500 hover:bg-white"><X className="h-5 w-5" /></button>
          </header>
      <input ref={inputRef} className="hidden" type="file" accept={ACCEPT[sourceKind]} onChange={(event) => { const next = event.target.files?.[0]; if (next) void convert(next); event.target.value = ""; }} />
      <div className="p-6">
        {status === "idle" && <button onClick={() => inputRef.current?.click()} className="flex min-h-72 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/30 text-center hover:border-blue-500"><Upload className="mb-4 h-10 w-10 text-[#355BFF]" /><span className="text-lg font-bold text-slate-900">Choose {sourceKind.toUpperCase()} file</span><span className="mt-1 text-sm text-slate-500">Only {ACCEPT[sourceKind].replaceAll(",", ", ")} files are accepted</span></button>}
        {status === "working" && (
          <div className="flex min-h-72 flex-col items-center justify-center text-center p-4">
            <div className="relative mb-5 flex items-center justify-center">
              <div className="absolute -inset-5 rounded-full bg-gradient-to-tr from-blue-500/25 via-indigo-500/20 to-cyan-400/25 blur-xl animate-pulse" />
              <div className="relative h-20 w-20">
                <svg className="h-full w-full animate-spin [animation-duration:2s]" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#E0E7FF" strokeWidth="4" opacity="0.5" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#355BFF" strokeWidth="4" strokeDasharray="160 100" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-[#355BFF] via-[#4338CA] to-[#6366F1] text-white shadow-md">
                  <div className="relative flex items-center justify-center">
                    <FileSpreadsheet className="h-6 w-6 text-white" />
                    <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-1 -right-1 h-0.5 bg-cyan-300 shadow-[0_0_6px_#22D3EE]" />
                    <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-amber-300 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#355BFF]" />
              </span>
              <span>AI OCR Processing</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Extracting data from {file?.name}</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm">Reconstructing rows and columns into an editable Excel workbook…</p>
          </div>
        )}
        {status === "error" && <div className="flex min-h-72 flex-col items-center justify-center text-center"><AlertCircle className="mb-4 h-12 w-12 text-red-500" /><h3 className="text-lg font-bold text-slate-900">Could not convert this file</h3><p className="mt-2 max-w-md rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p><button onClick={() => inputRef.current?.click()} className="mt-5 rounded-xl bg-[#355BFF] px-5 py-2.5 text-sm font-bold text-white">Choose another file</button></div>}
        {status === "ready" && <div className="flex min-h-72 flex-col items-center justify-center text-center"><CheckCircle2 className="mb-4 h-14 w-14 text-emerald-500" /><h3 className="text-xl font-bold text-slate-900">Excel workbook ready</h3><p className="mt-1 max-w-md truncate text-sm text-slate-500">{output}</p>{error && <p className="mt-3 text-sm text-red-600">{error}</p>}<button onClick={() => void download()} disabled={downloaded} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#355BFF] px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"><Download className="h-4 w-4" />{downloaded ? "Downloaded (one time)" : "Download XLSX"}</button><button onClick={() => inputRef.current?.click()} className="mt-3 text-xs font-bold text-blue-700 hover:underline">Convert another file</button></div>}
        </div>
      </motion.div>
    </div>
  </AnimatePresence>
  );
}
