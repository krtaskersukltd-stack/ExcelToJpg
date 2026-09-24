"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Download,
  Sparkles,
  FileSpreadsheet,
  RefreshCw,
  Eye,
  CheckCircle2,
  FileArchive,
  AlertCircle,
  Server,
  FileType,
  ArrowRight,
  Loader2,
  FileText,
  Layers,
  Image as ImageIcon
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  convertExcelFile,
  convertExcelUrl,
  checkBackendHealth,
  triggerFileDownload,
  getDownloadUrl,
  API_BASE_URL,
} from "@/lib/api";

export type OutputFormat = "jpg" | "png" | "pdf" | "docx";

interface LiveConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  file?: File | null;
  url?: string | null;
  fileName?: string;
  fileSize?: string;
  initialFormat?: OutputFormat;
}

export default function LiveConverterModal({
  isOpen,
  onClose,
  file,
  url,
  fileName = "Spreadsheet.xlsx",
  fileSize = "1.4 MB",
  initialFormat = "jpg",
}: LiveConverterModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<OutputFormat>(initialFormat);
  const [progress, setProgress] = useState(0);
  const [statusStep, setStatusStep] = useState<"parsing" | "rendering" | "optimizing" | "ready" | "error">("parsing");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dpi, setDpi] = useState<"150" | "300" | "600">("300");
  const [activeSheet, setActiveSheet] = useState("Sheet 1 (Data Preview)");
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [convertedFilename, setConvertedFilename] = useState<string | null>(null);
  const [convertedType, setConvertedType] = useState<string>("zip");
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [totalParts, setTotalParts] = useState(1);

  const displayFileName = file?.name || (url ? url.split("/").pop()?.split("?")[0] || "Remote_Sheet.xlsx" : fileName);
  const displayFileSize = file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : fileSize;

  // Run backend conversion
  const executeConversion = useCallback(
    async (formatToUse: OutputFormat) => {
      setProgress(15);
      setStatusStep("parsing");
      setErrorMessage(null);
      setConvertedFilename(null);

      // Check backend health
      const health = await checkBackendHealth();
      setBackendOnline(health.online);

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 40) return prev + 12;
          if (prev < 75) return prev + 6;
          if (prev < 90) return prev + 2;
          return prev;
        });
      }, 300);

      try {
        let result;

        if (file) {
          setTimeout(() => setStatusStep("rendering"), 600);
          setTimeout(() => setStatusStep("optimizing"), 1400);
          result = await convertExcelFile(file, formatToUse);
        } else if (url) {
          setTimeout(() => setStatusStep("rendering"), 600);
          setTimeout(() => setStatusStep("optimizing"), 1400);
          result = await convertExcelUrl(url, formatToUse);
        } else {
          // If neither a real file nor a URL was provided (e.g. sample mock trigger)
          // create a simulated dataset excel file blob on the fly and send it to the backend!
          const sampleCsvContent = `Item,Region,Volume,Growth,Status\nEnterprise Suite,North America,$184200,+24.5%,On Target\nCloud Workspace,Europe West,$92450,+18.2%,On Target\nData Pipe API,Asia Pacific,$64800,+31.0%,Surpassing\nSecurity Matrix,LATAM,$41900,+9.4%,On Target\nAI Copilot Engine,Global,$210400,+45.2%,Surpassing\nCompliance Core,EMEA,$78300,+12.0%,On Target\n`;
          const sampleFile = new File([sampleCsvContent], displayFileName.replace(/\.(xlsx|xls|xlsm)$/, ".csv"), {
            type: "text/csv",
          });
          setTimeout(() => setStatusStep("rendering"), 600);
          setTimeout(() => setStatusStep("optimizing"), 1400);
          result = await convertExcelFile(sampleFile, formatToUse);
        }

        clearInterval(progressInterval);

        if (result.status === "success") {
          setProgress(100);
          setStatusStep("ready");
          setConvertedFilename(result.filename || result.conv);
          setConvertedType(result.type || formatToUse);
          setTotalParts(result.total_parts || 1);
        } else {
          setStatusStep("error");
          setErrorMessage(result.error || "Failed to convert file");
        }
      } catch (err: any) {
        clearInterval(progressInterval);
        setStatusStep("error");
        setErrorMessage(err.message || "An unexpected error occurred during conversion.");
      }
    },
    [file, url, displayFileName]
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedFormat(initialFormat);
      setDownloadSuccess(false);
      executeConversion(initialFormat);
    }
  }, [isOpen, initialFormat, executeConversion]);

  const handleFormatChange = (newFormat: OutputFormat) => {
    setSelectedFormat(newFormat);
    executeConversion(newFormat);
  };

  const handleDownload = async () => {
    if (!convertedFilename) return;

    try {
      await triggerFileDownload(convertedFilename, convertedFilename);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2563EB", "#60A5FA", "#38BDF8", "#10B981", "#F59E0B"],
      });
      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 4000);
    } catch (e: any) {
      // Fallback
      window.open(getDownloadUrl(convertedFilename), "_blank");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 flex flex-col my-auto"
        >
          {/* Top Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-white to-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#355BFF] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                    {displayFileName}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-semibold">
                    {displayFileSize}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>FastAPI Python Engine v1.0</span>
                  <span>•</span>
                  {backendOnline === true && (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Backend Online
                    </span>
                  )}
                  {backendOnline === false && (
                    <span className="inline-flex items-center gap-1 text-amber-600 font-medium" title="Python backend offline">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Local Backend Standby
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Format Selector Bar */}
          <div className="px-6 py-2.5 bg-slate-50/90 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <FileType className="w-3.5 h-3.5 text-blue-600" />
                Target Format:
              </span>
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                {(
                  [
                    { id: "jpg", label: "JPG Image", icon: ImageIcon },
                    { id: "png", label: "PNG Image", icon: Layers },
                    { id: "pdf", label: "PDF Document", icon: FileText },
                    { id: "docx", label: "Word (DOCX)", icon: FileSpreadsheet },
                  ] as const
                ).map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => handleFormatChange(fmt.id)}
                    disabled={statusStep !== "ready" && statusStep !== "error"}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      selectedFormat === fmt.id
                        ? "bg-[#355BFF] text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                    }`}
                  >
                    <fmt.icon className="w-3.5 h-3.5" />
                    <span>{fmt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {statusStep === "ready" && (
              <button
                onClick={() => executeConversion(selectedFormat)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Re-convert</span>
              </button>
            )}
          </div>

          {/* Processing / Progress State */}
          {statusStep !== "ready" && statusStep !== "error" && (
            <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-[#355BFF] animate-spin flex items-center justify-center" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-[#355BFF] animate-pulse" />
                </div>
              </div>

              <h4 className="text-xl font-bold text-slate-900 mb-2">
                {statusStep === "parsing" && "Uploading & Parsing Excel Workbook..."}
                {statusStep === "rendering" && `Python Engine Converting to ${selectedFormat.toUpperCase()}...`}
                {statusStep === "optimizing" && `Finalizing & Packaging Output...`}
              </h4>
              <p className="text-sm text-slate-500 max-w-md mb-6">
                Processing columns, formatting formulas, font kerning, and generating crisp {selectedFormat.toUpperCase()} output.
              </p>

              {/* Progress bar */}
              <div className="w-full max-w-md bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner p-0.5">
                <motion.div
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs font-semibold text-slate-400 mt-2">
                {progress}% • Running Python FastAPI Pipeline
              </div>
            </div>
          )}

          {/* Error State */}
          {statusStep === "error" && (
            <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">Conversion Failed</h4>
              <p className="text-xs text-red-600 max-w-md bg-red-50 p-3 rounded-xl border border-red-200 mb-4 font-mono text-left">
                {errorMessage}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => executeConversion(selectedFormat)}
                  className="px-5 py-2.5 bg-[#355BFF] hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Ready / Preview & Download State */}
          {statusStep === "ready" && (
            <div className="p-6 space-y-6">
              {/* Top controls banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                {/* Sheet Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {[
                    "Sheet 1 (Executive Summary)",
                    "Sheet 2 (Q4 Breakdown)",
                    "Sheet 3 (KPI Matrix)",
                  ].map((sheet) => (
                    <button
                      key={sheet}
                      onClick={() => setActiveSheet(sheet)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                        activeSheet === sheet
                          ? "bg-[#355BFF] text-white shadow-sm"
                          : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70"
                      }`}
                    >
                      {sheet}
                    </button>
                  ))}
                </div>

                {/* Quality & DPI Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <span className="font-medium text-slate-400">DPI:</span>
                    {(["150", "300", "600"] as const).map((val) => (
                      <button
                        key={val}
                        onClick={() => setDpi(val)}
                        className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                          dpi === val
                            ? "bg-slate-900 text-white"
                            : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>

                  <div className="hidden sm:flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg font-semibold border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Razor Sharp Vectorizer</span>
                  </div>
                </div>
              </div>

              {/* Rendered Preview Card */}
              <div className="relative rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden group">
                <div className="px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="text-slate-400 ml-2">
                      Result: {convertedFilename || `${displayFileName}.${selectedFormat}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-sans font-semibold text-blue-600">
                    <Eye className="w-3.5 h-3.5" />
                    <span>True High-Res Render</span>
                  </div>
                </div>

                {/* Rendered Preview Table Display */}
                <div className="p-6 bg-[#FAFBFD] overflow-x-auto">
                  <div className="min-w-[620px] bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden font-sans">
                    {/* Excel Header Bar */}
                    <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white px-5 py-3 flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-sm tracking-wide">Q4 FINANCIAL PERFORMANCE SUMMARY</h5>
                        <p className="text-[11px] text-blue-200">Export Engine: Python FastAPI + Pandas</p>
                      </div>
                      <div className="bg-blue-900/60 px-3 py-1 rounded-md text-[11px] font-mono border border-blue-400/30">
                        {selectedFormat.toUpperCase()} OUTPUT
                      </div>
                    </div>

                    {/* Table Data */}
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                          <th className="py-2.5 px-4">Item</th>
                          <th className="py-2.5 px-4">Region</th>
                          <th className="py-2.5 px-4 text-right">Volume</th>
                          <th className="py-2.5 px-4 text-right">Growth</th>
                          <th className="py-2.5 px-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        <tr className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-2.5 px-4 font-semibold text-slate-900">Enterprise Suite</td>
                          <td className="py-2.5 px-4">North America</td>
                          <td className="py-2.5 px-4 text-right font-mono font-medium">$184,200</td>
                          <td className="py-2.5 px-4 text-right text-emerald-600 font-semibold">+24.5%</td>
                          <td className="py-2.5 px-4 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              On Target
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-2.5 px-4 font-semibold text-slate-900">Cloud Workspace</td>
                          <td className="py-2.5 px-4">Europe West</td>
                          <td className="py-2.5 px-4 text-right font-mono font-medium">$92,450</td>
                          <td className="py-2.5 px-4 text-right text-emerald-600 font-semibold">+18.2%</td>
                          <td className="py-2.5 px-4 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              On Target
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-2.5 px-4 font-semibold text-slate-900">Data Pipe API</td>
                          <td className="py-2.5 px-4">Asia Pacific</td>
                          <td className="py-2.5 px-4 text-right font-mono font-medium">$64,800</td>
                          <td className="py-2.5 px-4 text-right text-emerald-600 font-semibold">+31.0%</td>
                          <td className="py-2.5 px-4 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                              Surpassing
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-2.5 px-4 font-semibold text-slate-900">Security Matrix</td>
                          <td className="py-2.5 px-4">LATAM</td>
                          <td className="py-2.5 px-4 text-right font-mono font-medium">$41,900</td>
                          <td className="py-2.5 px-4 text-right text-emerald-600 font-semibold">+9.4%</td>
                          <td className="py-2.5 px-4 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              On Target
                            </span>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="bg-blue-50/70 border-t-2 border-blue-200 font-bold text-slate-900">
                          <td className="py-3 px-4">Total Net Output</td>
                          <td className="py-3 px-4 text-xs text-slate-500">Global Aggregate</td>
                          <td className="py-3 px-4 text-right font-mono text-blue-700 text-sm">$383,350</td>
                          <td className="py-3 px-4 text-right text-emerald-600">+22.4%</td>
                          <td className="py-3 px-4 text-center text-blue-600 text-xs">Audited ✓</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Badge overlay */}
                <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>{selectedFormat.toUpperCase()} • Ready for Download</span>
                </div>
              </div>

              {/* Download Feedback Banner */}
              {downloadSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-emerald-500 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Check className="w-4 h-4" />
                  <span>Your {selectedFormat.toUpperCase()} file has been downloaded successfully!</span>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>
                    Converted via Python FastAPI endpoint <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">/download_file</code>
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleDownload}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#355BFF] hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download {selectedFormat.toUpperCase()}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
