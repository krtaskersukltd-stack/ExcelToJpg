"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2, Sliders, Eye, RefreshCw, BarChart2 } from "lucide-react";

export default function SpreadsheetShowcase() {
  const [isRendering, setIsRendering] = useState(false);
  const [activeTab, setActiveTab] = useState("Sheet1");

  const triggerRenderAnimation = () => {
    setIsRendering(true);
    setTimeout(() => {
      setIsRendering(false);
    }, 1200);
  };

  return (
    <section className="py-20 relative bg-[#FAFBFD] overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-300/10 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Turn Your Spreadsheet Into a <span className="text-blue-600">Shareable Image</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Embed complex data tables directly into presentations, Slack messages, social feeds, and emails without formatting headaches.
          </p>
        </div>

        {/* Side-by-Side Transformation Showcase */}
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          
          {/* Left: Raw Excel Spreadsheet Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-1/2 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
          >
            {/* Window Top Bar */}
            <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="text-xs font-semibold text-slate-700 ml-2">Quarterly_Sales_Report.xlsx</span>
              </div>
              <div className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-600">
                {activeTab}
              </div>
            </div>

            {/* Formula Bar */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2 text-xs font-mono text-slate-600">
              <span className="text-blue-600 font-bold">fx</span>
              <div className="h-3.5 w-px bg-slate-300"></div>
              <span className="text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 w-full truncate">
                =SUM(D2:D14)*1.15
              </span>
            </div>

            {/* Excel Grid Table */}
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-100/90 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-2 px-3">Item</th>
                    <th className="py-2 px-3">Region</th>
                    <th className="py-2 px-3 text-right">Volume</th>
                    <th className="py-2 px-3 text-right">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  <tr className="hover:bg-blue-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Enterprise Suite</td>
                    <td className="py-2.5 px-3 text-slate-500">North America</td>
                    <td className="py-2.5 px-3 text-right font-mono">$184,200</td>
                    <td className="py-2.5 px-3 text-right text-blue-600 font-bold">+24.5%</td>
                  </tr>
                  <tr className="hover:bg-blue-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Cloud Workspace</td>
                    <td className="py-2.5 px-3 text-slate-500">Europe West</td>
                    <td className="py-2.5 px-3 text-right font-mono">$92,450</td>
                    <td className="py-2.5 px-3 text-right text-blue-600 font-bold">+18.2%</td>
                  </tr>
                  <tr className="hover:bg-blue-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Data Pipe API</td>
                    <td className="py-2.5 px-3 text-slate-500">Asia Pacific</td>
                    <td className="py-2.5 px-3 text-right font-mono">$64,800</td>
                    <td className="py-2.5 px-3 text-right text-blue-600 font-bold">+31.0%</td>
                  </tr>
                  <tr className="hover:bg-blue-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Security Matrix</td>
                    <td className="py-2.5 px-3 text-slate-500">LATAM</td>
                    <td className="py-2.5 px-3 text-right font-mono">$41,900</td>
                    <td className="py-2.5 px-3 text-right text-blue-600 font-bold">+9.4%</td>
                  </tr>
                </tbody>
              </table>

              {/* Chart Indicator Box */}
              <div className="mt-4 p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between text-xs font-bold text-blue-900 mb-2">
                  <div className="flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Q4 PERFORMANCE INDEX</span>
                  </div>
                  <span className="text-[10px] text-blue-600 font-mono">LIVE CHART</span>
                </div>
                {/* Visual Bar representation */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  <div className="h-8 bg-blue-500 rounded-md"></div>
                  <div className="h-6 bg-blue-400 rounded-md mt-2"></div>
                  <div className="h-10 bg-blue-600 rounded-md -mt-2"></div>
                  <div className="h-5 bg-blue-300 rounded-md mt-3"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Center RENDER Action Pill */}
          <div className="flex flex-col items-center justify-center shrink-0 z-10 my-2 lg:my-0">
            <button
              onClick={triggerRenderAnimation}
              className="group flex items-center justify-center gap-2 w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/30 hover:scale-110 active:scale-95 transition-all duration-200"
            >
              <ArrowRight className={`w-6 h-6 group-hover:translate-x-0.5 transition-transform ${isRendering ? "animate-spin" : ""}`} />
            </button>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 mt-2">
              RENDER
            </span>
          </div>

          {/* Right: Exported Crisp JPG Visual Asset Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-1/2 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
          >
            {/* Window Top Bar */}
            <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-200">Exported JPG (1920 × 1080)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-600 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                <Sparkles className="w-3 h-3" />
                <span>98% Quality</span>
              </div>
            </div>

            {/* Rendered Visual Graphic Output */}
            <div className="p-5 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 relative">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
                
                {/* Header Badge */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-blue-600"></div>
                    <span className="text-xs font-bold text-slate-800 tracking-wide">EXECUTIVE SALES DASHBOARD</span>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">300 DPI RASTER</span>
                </div>

                {/* Styled Row Bars */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span className="font-semibold text-slate-800">Enterprise Suite</span>
                    <span className="font-mono font-bold text-blue-600">$184,200 (+24.5%)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span className="font-semibold text-slate-800">Cloud Workspace</span>
                    <span className="font-mono font-bold text-blue-600">$92,450 (+18.2%)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span className="font-semibold text-slate-800">Data Pipe API</span>
                    <span className="font-mono font-bold text-blue-600">$64,800 (+31.0%)</span>
                  </div>
                </div>

                {/* Visual Asset Callout */}
                <div className="p-3 bg-blue-600 text-white rounded-xl flex items-center justify-between shadow-md shadow-blue-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold">High-Fidelity Visual Asset</span>
                  </div>
                  <span className="text-[10px] bg-blue-700/80 px-2 py-0.5 rounded font-mono">READY</span>
                </div>

              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
