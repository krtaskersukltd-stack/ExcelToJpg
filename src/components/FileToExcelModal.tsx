"use client";

import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Download, Loader2, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cleanupFiles, convertFileToExcel, ExcelSourceKind, triggerFileDownload } from "@/lib/api";

const ACCEPT: Record<ExcelSourceKind, string> = { jpg: ".jpg,.jpeg", png: ".png", pdf: ".pdf", csv: ".csv" };

export default function FileToExcelModal({ isOpen, onClose, sourceKind }: { isOpen: boolean; onClose: () => void; sourceKind: ExcelSourceKind }) {
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
    } else {
      controllerRef.current?.abort();
    }
  }, [isOpen, sourceKind]);

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
  const label = `${sourceKind.toUpperCase()} to Excel`;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={label}>
        <button className="fixed inset-0 bg-slate-950/65 backdrop-blur-md" onClick={handleClose} aria-label="Close" />
        <motion.div initial={{ opacity: 0, y: 15, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
          <header className="flex items-center justify-between border-b border-slate-100 bg-blue-50/60 px-6 py-4">
            <div>
              <h2 className="text-lg font-bold text-slate-950">{label}</h2>
              <p className="text-xs text-slate-500">{sourceKind === "csv" ? "Format CSV rows and columns into an XLSX workbook." : "Extract readable table data into an editable XLSX workbook."}</p>
            </div>
            <button onClick={handleClose} className="rounded-full p-2 text-slate-500 hover:bg-white"><X className="h-5 w-5" /></button>
          </header>
      <input ref={inputRef} className="hidden" type="file" accept={ACCEPT[sourceKind]} onChange={(event) => { const next = event.target.files?.[0]; if (next) void convert(next); event.target.value = ""; }} />
      <div className="p-6">
        {status === "idle" && <button onClick={() => inputRef.current?.click()} className="flex min-h-72 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/30 text-center hover:border-blue-500"><Upload className="mb-4 h-10 w-10 text-[#355BFF]" /><span className="text-lg font-bold text-slate-900">Choose {sourceKind.toUpperCase()} file</span><span className="mt-1 text-sm text-slate-500">Only {ACCEPT[sourceKind].replaceAll(",", ", ")} files are accepted</span></button>}
        {status === "working" && <div className="flex min-h-72 flex-col items-center justify-center text-center"><Loader2 className="mb-5 h-12 w-12 animate-spin text-[#355BFF]" /><h3 className="text-lg font-bold text-slate-900">Extracting data from {file?.name}</h3><p className="mt-1 text-sm text-slate-500">Building an editable Excel workbook…</p></div>}
        {status === "error" && <div className="flex min-h-72 flex-col items-center justify-center text-center"><AlertCircle className="mb-4 h-12 w-12 text-red-500" /><h3 className="text-lg font-bold text-slate-900">Could not convert this file</h3><p className="mt-2 max-w-md rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p><button onClick={() => inputRef.current?.click()} className="mt-5 rounded-xl bg-[#355BFF] px-5 py-2.5 text-sm font-bold text-white">Choose another file</button></div>}
        {status === "ready" && <div className="flex min-h-72 flex-col items-center justify-center text-center"><CheckCircle2 className="mb-4 h-14 w-14 text-emerald-500" /><h3 className="text-xl font-bold text-slate-900">Excel workbook ready</h3><p className="mt-1 max-w-md truncate text-sm text-slate-500">{output}</p>{error && <p className="mt-3 text-sm text-red-600">{error}</p>}<button onClick={() => void download()} disabled={downloaded} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#355BFF] px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"><Download className="h-4 w-4" />{downloaded ? "Downloaded (one time)" : "Download XLSX"}</button><button onClick={() => inputRef.current?.click()} className="mt-3 text-xs font-bold text-blue-700 hover:underline">Convert another file</button></div>}
        </div>
      </motion.div>
    </div>
  </AnimatePresence>
  );
}
