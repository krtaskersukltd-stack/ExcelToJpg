"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Check, 
  Download, 
  Sparkles, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  RefreshCw, 
  Sliders, 
  ZoomIn, 
  Eye, 
  CheckCircle2,
  FileArchive,
  Layers,
  Zap,
  ArrowRight
} from "lucide-react";
import confetti from "canvas-confetti";

interface LiveConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName?: string;
  fileSize?: string;
}

export default function LiveConverterModal({
  isOpen,
  onClose,
  fileName = "Annual_Q4_Summary.xlsx",
  fileSize = "1.4 MB",
}: LiveConverterModalProps) {
  const [progress, setProgress] = useState(0);
  const [statusStep, setStatusStep] = useState<"parsing" | "rendering" | "optimizing" | "ready">("parsing");
  const [dpi, setDpi] = useState<"150" | "300" | "600">("300");
  const [activeSheet, setActiveSheet] = useState("Sheet 1 (Executive Summary)");
  const [quality, setQuality] = useState("98%");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      setStatusStep("parsing");
      setDownloadSuccess(false);

      const t1 = setTimeout(() => {
        setProgress(35);
        setStatusStep("rendering");
      }, 700);

      const t2 = setTimeout(() => {
        setProgress(75);
        setStatusStep("optimizing");
      }, 1500);

      const t3 = setTimeout(() => {
        setProgress(100);
        setStatusStep("ready");
      }, 2300);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [isOpen]);

  const handleDownload = (type: "single" | "zip") => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#2563EB", "#60A5FA", "#38BDF8", "#10B981", "#F59E0B"]
    });
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 4000);
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
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-white to-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{fileName}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-semibold">{fileSize}</span>
                </div>
                <p className="text-xs text-slate-500">Excel Engine v2.4 • 300 DPI High Fidelity Vectorizer</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Processing / Progress State */}
          {statusStep !== "ready" && (
            <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin flex items-center justify-center" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-blue-600 animate-pulse" />
                </div>
              </div>

              <h4 className="text-xl font-bold text-slate-900 mb-2">
                {statusStep === "parsing" && "Parsing Spreadsheet Formulas & Styles..."}
                {statusStep === "rendering" && "Rendering Crisp 300 DPI Raster Canvas..."}
                {statusStep === "optimizing" && "Optimizing JPG Compression & Color Profiles..."}
              </h4>
              <p className="text-sm text-slate-500 max-w-md mb-6">
                Evaluating merged cells, typography, custom borders, and financial charts into a pixel-perfect image.
              </p>

              {/* Progress bar */}
              <div className="w-full max-w-md bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner p-0.5">
                <motion.div
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs font-semibold text-slate-400 mt-2">{progress}% Completed</div>
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
                    "Sheet 3 (KPI Matrix)"
                  ].map((sheet) => (
                    <button
                      key={sheet}
                      onClick={() => setActiveSheet(sheet)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                        activeSheet === sheet 
                          ? "bg-blue-600 text-white shadow-sm" 
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
                          dpi === val ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>

                  <div className="hidden sm:flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg font-semibold border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Razor Sharp 98%</span>
                  </div>
                </div>
              </div>

              {/* Rendered Preview Card (Pixel Perfect Spreadsheet Mock) */}
              <div className="relative rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden group">
                <div className="px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="text-slate-400 ml-2">Preview: {activeSheet}.jpg (1920 × 1080 @ {dpi} DPI)</span>
                  </div>
                  <div className="flex items-center gap-2 font-sans font-semibold text-blue-600">
                    <Eye className="w-3.5 h-3.5" />
                    <span>True-to-Life Render</span>
                  </div>
                </div>

                {/* High Res Rendered Table Display */}
                <div className="p-6 bg-white overflow-x-auto">
                  <div className="min-w-[620px] bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden font-sans">
                    {/* Excel Header Bar */}
                    <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white px-5 py-3 flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-sm tracking-wide">Q4 FINANCIAL PERFORMANCE SUMMARY</h5>
                        <p className="text-[11px] text-blue-200">Internal Audit & Stakeholder Presentation</p>
                      </div>
                      <div className="bg-blue-900/60 px-3 py-1 rounded-md text-[11px] font-mono border border-blue-400/30">
                        CONFIDENTIAL
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
                            <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">On Target</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-2.5 px-4 font-semibold text-slate-900">Cloud Workspace</td>
                          <td className="py-2.5 px-4">Europe West</td>
                          <td className="py-2.5 px-4 text-right font-mono font-medium">$92,450</td>
                          <td className="py-2.5 px-4 text-right text-emerald-600 font-semibold">+18.2%</td>
                          <td className="py-2.5 px-4 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">On Target</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-2.5 px-4 font-semibold text-slate-900">Data Pipe API</td>
                          <td className="py-2.5 px-4">Asia Pacific</td>
                          <td className="py-2.5 px-4 text-right font-mono font-medium">$64,800</td>
                          <td className="py-2.5 px-4 text-right text-emerald-600 font-semibold">+31.0%</td>
                          <td className="py-2.5 px-4 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">Surpassing</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-2.5 px-4 font-semibold text-slate-900">Security Matrix</td>
                          <td className="py-2.5 px-4">LATAM</td>
                          <td className="py-2.5 px-4 text-right font-mono font-medium">$41,900</td>
                          <td className="py-2.5 px-4 text-right text-emerald-600 font-semibold">+9.4%</td>
                          <td className="py-2.5 px-4 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">On Target</span>
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
                  <span>JPG • 300 DPI Export Ready</span>
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
                  <span>Your high-resolution JPG has been exported and saved!</span>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Render generated in 1.4s • Zero artifacts</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => handleDownload("zip")}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all"
                  >
                    <FileArchive className="w-4 h-4 text-blue-600" />
                    <span>Download All (ZIP)</span>
                  </button>

                  <button
                    onClick={() => handleDownload("single")}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JPG</span>
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
