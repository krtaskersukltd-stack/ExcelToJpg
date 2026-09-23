"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ComparisonMatrix() {
  return (
    <section className="py-20 bg-[#FAFBFD] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            From Spreadsheet to <span className="text-[#355BFF]">JPG</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            Compare original raw spreadsheet layout against the pristine, non-editable JPG render.
          </p>
        </div>

        {/* Comparison Dual Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Left Card: SOURCE Editable Excel (.xlsx) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 bg-white border-2 border-blue-400/50 shadow-[0_12px_45px_rgba(53,91,255,0.12)] flex flex-col justify-between"
          >
            <div>
              {/* Top Capsule Pill Header Bar */}
              <div className="p-1 sm:p-1.5 bg-white rounded-full border border-blue-200/70 shadow-[0_2px_12px_rgba(59,130,246,0.06)] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="px-3.5 py-1 bg-[#355BFF] text-white text-[11px] font-bold rounded-full uppercase tracking-wider">
                    SOURCE
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    Editable Excel (.xlsx)
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs text-slate-400 font-medium px-3 truncate">
                  Requires Excel/Viewer
                </span>
              </div>

              {/* Inner Data Card Container */}
              <div className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5 sm:p-6 my-6">
                {/* Card Top Row Header */}
                <div className="flex items-center justify-between text-xs pb-1">
                  <span className="font-semibold text-slate-800">Cell [A1:C1]</span>
                  <span className="font-mono text-slate-700 font-medium">Formula: =NPV(0.08, C2:C12)</span>
                </div>

                {/* Thin Sharp Blue Line Divider */}
                <div className="h-[1.5px] bg-[#355BFF] w-full my-3" />

                {/* Table Data Grid: 3 Columns */}
                <div className="space-y-3 pt-1 text-xs">
                  <div className="grid grid-cols-12 items-center">
                    <span className="col-span-5 text-slate-600 font-medium">2024 Revenue</span>
                    <span className="col-span-4 font-bold text-slate-900">$1,450,000</span>
                    <span className="col-span-3 text-right font-bold text-[#355BFF]">Target Met</span>
                  </div>

                  <div className="grid grid-cols-12 items-center">
                    <span className="col-span-5 text-slate-600 font-medium">Operating Exp</span>
                    <span className="col-span-4 font-bold text-slate-900">$820,000</span>
                    <span className="col-span-3 text-right font-medium text-slate-600">Variance 4%</span>
                  </div>

                  <div className="grid grid-cols-12 items-center">
                    <span className="col-span-5 text-slate-600 font-medium">Net Margin</span>
                    <span className="col-span-4 font-bold text-slate-900">$630,000</span>
                    <span className="col-span-3 text-right font-bold text-[#355BFF]">43.4%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Disadvantages List with Blue Cross Glyphs */}
            <div className="space-y-2.5 pt-1 text-xs text-slate-600 font-medium">
              <div className="flex items-start gap-2">
                <span className="text-[#355BFF] font-bold text-sm leading-none shrink-0">✕</span>
                <span>Formulas can break or display #REF! errors on other devices</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#355BFF] font-bold text-sm leading-none shrink-0">✕</span>
                <span>Requires specialized software to view on mobile devices</span>
              </div>
            </div>
          </motion.div>

          {/* Right Card: OUTPUT Pixel-Perfect JPG (.jpg) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 bg-white border-2 border-blue-400/50 shadow-[0_12px_45px_rgba(53,91,255,0.12)] flex flex-col justify-between"
          >
            <div>
              {/* Top Capsule Pill Header Bar */}
              <div className="p-1 sm:p-1.5 bg-white rounded-full border border-blue-200/70 shadow-[0_2px_12px_rgba(59,130,246,0.06)] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="px-3.5 py-1 bg-[#355BFF] text-white text-[11px] font-bold rounded-full uppercase tracking-wider">
                    OUTPUT
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    Pixel-Perfect JPG (.jpg)
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs text-slate-400 font-medium px-3 truncate">
                  Universal Compatibility
                </span>
              </div>

              {/* Inner Data Card Container */}
              <div className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5 sm:p-6 my-6">
                {/* Card Top Row Header */}
                <div className="flex items-center justify-between text-xs pb-1">
                  <span className="font-semibold text-slate-800">Financial Snapshot • Final</span>
                  <span className="font-bold text-[#355BFF]">300 DPI Raster</span>
                </div>

                {/* Thin Sharp Blue Line Divider */}
                <div className="h-[1.5px] bg-[#355BFF] w-full my-3" />

                {/* Table Data Grid: 3 Columns */}
                <div className="space-y-3 pt-1 text-xs">
                  <div className="grid grid-cols-12 items-center">
                    <span className="col-span-5 text-slate-600 font-medium">2024 Revenue</span>
                    <span className="col-span-4 font-bold text-slate-900">$1,450,000</span>
                    <span className="col-span-3 text-right font-bold text-[#355BFF]">Target Met</span>
                  </div>

                  <div className="grid grid-cols-12 items-center">
                    <span className="col-span-5 text-slate-600 font-medium">Operating Exp</span>
                    <span className="col-span-4 font-bold text-slate-900">$820,000</span>
                    <span className="col-span-3 text-right font-medium text-slate-600">Variance 4%</span>
                  </div>

                  <div className="grid grid-cols-12 items-center">
                    <span className="col-span-5 text-slate-600 font-medium">Net Margin</span>
                    <span className="col-span-4 font-bold text-slate-900">$630,000</span>
                    <span className="col-span-3 text-right font-bold text-[#355BFF]">43.4%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Advantages List with Blue Check Glyphs */}
            <div className="space-y-2.5 pt-1 text-xs text-slate-600 font-medium">
              <div className="flex items-start gap-2">
                <span className="text-[#355BFF] font-bold text-sm leading-none shrink-0">✓</span>
                <span>Unchangeable, tamper-proof presentation layout</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#355BFF] font-bold text-sm leading-none shrink-0">✓</span>
                <span>Instantly views anywhere: WhatsApp, Slack, Keynote, Notion</span>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
