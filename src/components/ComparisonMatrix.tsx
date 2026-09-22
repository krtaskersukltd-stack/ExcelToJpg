"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Check, FileSpreadsheet, Image as ImageIcon, Sparkles, AlertCircle } from "lucide-react";

export default function ComparisonMatrix() {
  return (
    <section className="py-20 bg-[#FAFBFD] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            From Spreadsheet to <span className="text-blue-600">JPG</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Compare original raw spreadsheet layout against the pristine, non-editable JPG render.
          </p>
        </div>

        {/* Comparison Dual Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Card: SOURCE Editable Excel (.xlsx) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl p-6 sm:p-8 bg-white border border-slate-200/90 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] flex flex-col justify-between"
          >
            <div>
              {/* Header Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-slate-900 text-white text-[11px] font-bold rounded-lg uppercase tracking-wider">
                    SOURCE
                  </span>
                  <span className="text-sm font-bold text-slate-900">Editable Excel (.xlsx)</span>
                </div>
                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  Formula: =NPV(0.08, C2:C12)
                </span>
              </div>

              {/* Mini Table UI */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50 mb-6">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-xs font-mono text-slate-500">
                  Cell [A1:C1]
                </div>
                <div className="p-4 space-y-2.5 text-xs">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>2024 Revenue</span>
                    <span className="font-mono text-slate-900">$1,450,000</span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Operating Exp</span>
                    <span className="font-mono text-slate-900">$820,000</span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Net Margin</span>
                    <span className="font-mono text-slate-900">$630,000</span>
                  </div>

                  {/* Metrics bar */}
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Target Met</span>
                    <span>Variance 4%</span>
                    <span className="font-mono font-bold text-slate-700">43.4%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Disadvantages List */}
            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Formulas can break or display #REF! errors on other devices</span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Requires specialized software to view on mobile devices</span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Requires Excel/Viewer</span>
              </div>
            </div>
          </motion.div>

          {/* Right Card: OUTPUT Pixel-Perfect JPG (.jpg) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-3xl p-6 sm:p-8 bg-white neon-border-glow shadow-[0_12px_36px_rgba(59,130,246,0.16)] flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top right highlight tag */}
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-extrabold uppercase px-4 py-1 rounded-bl-xl tracking-wider">
              RECOMMENDED
            </div>

            <div>
              {/* Header Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-blue-600 text-white text-[11px] font-bold rounded-lg uppercase tracking-wider">
                    OUTPUT
                  </span>
                  <span className="text-sm font-bold text-slate-900">Pixel-Perfect JPG (.jpg)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60">
                    300 DPI Raster
                  </span>
                </div>
              </div>

              {/* Mini Table UI */}
              <div className="rounded-2xl border border-blue-200 overflow-hidden bg-white shadow-xs mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between">
                  <span>Financial Snapshot • Final</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">JPG EMBED</span>
                </div>
                <div className="p-4 space-y-2.5 text-xs">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>2024 Revenue</span>
                    <span className="font-mono text-blue-700 font-bold">$1,450,000</span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Operating Exp</span>
                    <span className="font-mono text-slate-900 font-bold">$820,000</span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Net Margin</span>
                    <span className="font-mono text-slate-900 font-bold">$630,000</span>
                  </div>

                  {/* Metrics bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">Target Met ✓</span>
                    <span className="font-semibold">Variance 4%</span>
                    <span className="font-mono font-extrabold text-blue-600">43.4%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Advantages List */}
            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="font-semibold text-slate-900">Unchangeable, tamper-proof presentation layout</span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="font-semibold text-slate-900">Instantly views anywhere: WhatsApp, Slack, Keynote, Notion</span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3" />
                </div>
                <span className="font-semibold text-blue-700">Universal 100% Platform Compatibility</span>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
