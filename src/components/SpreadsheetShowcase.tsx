"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function SpreadsheetShowcase() {
  const [isRendering, setIsRendering] = useState(false);

  const triggerRenderAnimation = () => {
    setIsRendering(true);
    setTimeout(() => {
      setIsRendering(false);
    }, 1000);
  };

  return (
    <section className="py-20 sm:py-24 relative bg-[#FAFBFD] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 mb-14 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0F172A] tracking-tight leading-tight">
            Turn Your Spreadsheet Into a<br />
            <span className="text-[#3B66FF]">Shareable</span> Image
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Embed complex data tables directly into presentations, Slack messages, social feeds, and emails without formatting headaches.
          </p>
        </div>

        {/* Side-by-Side Transformation Showcase */}
        <div className="relative flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
          
          {/* Left: Raw Excel Spreadsheet Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-[48%] bg-white rounded-2xl sm:rounded-[22px] neon-border-glow shadow-[0_10px_30px_rgba(59,130,246,0.1)] overflow-hidden"
          >
            {/* Window Top Bar */}
            <div className="px-4 py-3 bg-[#F1F3F9] border-b border-slate-200/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#3B66FF]" />
                <span className="text-xs font-semibold text-slate-700 ml-2">
                  Quarterly_Sales_Report.xlsx
                </span>
              </div>
              <div className="px-3 py-0.5 rounded bg-white text-[11px] font-medium text-slate-600 shadow-2xs border border-slate-200/60">
                Sheet1
              </div>
            </div>

            {/* Formula Bar */}
            <div className="px-4 py-2 bg-white border-b border-slate-100 flex items-center gap-2 text-xs font-mono text-slate-700">
              <span className="text-[#3B66FF] font-bold italic">fx</span>
              <span className="text-slate-800 font-medium">
                =SUM(D2:D14)*1.15
              </span>
            </div>

            {/* Excel Grid Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-[#F1F3F9] text-slate-700 font-semibold border-b border-slate-200/60">
                    <th className="py-2 px-4">Item</th>
                    <th className="py-2 px-4">Region</th>
                    <th className="py-2 px-4">Volume</th>
                    <th className="py-2 px-4">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  <tr className="hover:bg-blue-50/40">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">Enterprise Suite</td>
                    <td className="py-2.5 px-4 text-slate-600">North America</td>
                    <td className="py-2.5 px-4 font-mono text-slate-900">$184,200</td>
                    <td className="py-2.5 px-4 text-[#3B66FF] font-bold">+24.5%</td>
                  </tr>
                  <tr className="hover:bg-blue-50/40">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">Cloud Workspace</td>
                    <td className="py-2.5 px-4 text-slate-600">Europe West</td>
                    <td className="py-2.5 px-4 font-mono text-slate-900">$92,450</td>
                    <td className="py-2.5 px-4 text-[#3B66FF] font-bold">+18.2%</td>
                  </tr>
                  <tr className="hover:bg-blue-50/40">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">Data Pipe API</td>
                    <td className="py-2.5 px-4 text-slate-600">Asia Pacific</td>
                    <td className="py-2.5 px-4 font-mono text-slate-900">$64,800</td>
                    <td className="py-2.5 px-4 text-[#3B66FF] font-bold">+31.0%</td>
                  </tr>
                  <tr className="hover:bg-blue-50/40">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">Security Matrix</td>
                    <td className="py-2.5 px-4 text-slate-600">LATAM</td>
                    <td className="py-2.5 px-4 font-mono text-slate-900">$41,900</td>
                    <td className="py-2.5 px-4 text-[#3B66FF] font-bold">+9.4%</td>
                  </tr>
                </tbody>
              </table>

              {/* Chart Indicator Box */}
              <div className="p-4 bg-white border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-800 tracking-wider block mb-2.5">
                  Q4 PERFORMANCE INDEX
                </span>
                {/* 4 Visual Bars */}
                <div className="grid grid-cols-4 gap-2.5 items-end h-16 pt-1">
                  <div className="h-6 bg-[#C7D2FE] rounded-md" />
                  <div className="h-8 bg-[#A5B4FC] rounded-md" />
                  <div className="h-11 bg-[#818CF8] rounded-md" />
                  <div className="h-14 bg-[#1D4ED8] rounded-md" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Center RENDER Action Button */}
          <div className="flex flex-col items-center justify-center shrink-0 z-10 my-2 lg:my-0">
            <button
              type="button"
              onClick={triggerRenderAnimation}
              className="group flex items-center justify-center w-12 h-12 rounded-full bg-[#3B66FF] hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                className={`w-5 h-5 transition-transform ${isRendering ? "animate-spin" : "group-hover:translate-x-0.5"}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <span className="text-[12px] font-extrabold uppercase tracking-wider text-[#0F172A] mt-2">
              RENDER
            </span>
          </div>

          {/* Right: Exported Crisp JPG Visual Asset Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-[48%] bg-white rounded-2xl sm:rounded-[22px] neon-border-glow shadow-[0_10px_30px_rgba(59,130,246,0.1)] p-5 flex flex-col justify-between min-h-[380px]"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-slate-800">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-slate-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span>Exported <span className="text-[#3B66FF]">JPG</span> (1920 × 1080)</span>
              </div>
              <span className="bg-[#3B66FF] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
                98% Quality
              </span>
            </div>

            {/* Skeleton Mockup Lines */}
            <div className="space-y-4 my-auto py-2">
              <div className="flex items-center justify-between">
                <div className="w-28 sm:w-32 h-4 sm:h-5 bg-[#C7D2FE]/80 rounded-md" />
                <div className="w-14 sm:w-16 h-3 bg-slate-200/80 rounded-md" />
              </div>
              <div className="space-y-2 pt-1">
                <div className="w-full h-2 bg-slate-100 rounded-full" />
                <div className="w-[85%] h-2 bg-slate-100 rounded-full" />
                <div className="w-[65%] h-2 bg-slate-100 rounded-full" />
              </div>
            </div>

            {/* Bottom High-Fidelity Callout Box */}
            <div className="w-full py-6 sm:py-7 rounded-xl bg-[#E0E7FF]/60 border border-[#C7D2FE]/50 flex items-center justify-center gap-2">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-[#3B66FF]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span className="text-[#2F54EB] font-bold text-xs sm:text-[13px] tracking-tight">
                High-Fidelity Visual Asset
              </span>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
