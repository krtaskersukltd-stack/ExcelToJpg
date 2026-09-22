"use client";

import React from "react";
import { motion } from "framer-motion";
import { Upload, Cpu, Download, FileSpreadsheet, Sparkles, Check, ArrowUpRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Upload Excel",
      description: "Select your .xls, .xlsx, or .csv document from your device or drag it directly onto the upload zone.",
      icon: Upload,
      preview: {
        type: "upload",
        name: "Annual_Q4_Summary.xlsx",
        detail: "1.4 MB • Ready",
      }
    },
    {
      number: "02",
      title: "Convert Your Sheet",
      description: "Our render engine parses fonts, custom styles, merged cells, and graphics into razor sharp JPG pixels.",
      icon: Cpu,
      preview: {
        type: "rendering",
        name: "Rendering Canvas",
        detail: "300 DPI",
      }
    },
    {
      number: "03",
      title: "Download JPG",
      description: "Instantly download individual sheet images or grab all worksheets bundled into a clean ZIP file.",
      icon: Download,
      preview: {
        type: "download",
        name: "Sheet_1_Export.jpg",
        detail: "Save",
      }
    },
  ];

  return (
    <section className="py-20 relative bg-white border-y border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How to Convert <span className="text-blue-600">JPG</span> to Excel?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            The process is very simple, just follow these steps and get your JPG converted into Excel instantly.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative group rounded-3xl p-7 bg-[#F9FBFE] hover:bg-[#F2F7FD] border border-blue-100/80 shadow-[0_4px_20px_-4px_rgba(37,99,235,0.05)] hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Top Number & Icon Bar */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                    {step.number}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-white border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs group-hover:scale-110 transition-transform">
                    <step.icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Card Title & Description */}
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Bottom Interactive Mini Preview Mockup */}
              <div className="mt-8 pt-5 border-t border-slate-200/60">
                {step.preview.type === "upload" && (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 truncate">{step.preview.name}</p>
                        <p className="text-[11px] text-slate-400">{step.preview.detail}</p>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                  </div>
                )}

                {step.preview.type === "rendering" && (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>
                      <span className="text-xs font-bold text-slate-800">{step.preview.name}</span>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60">
                      {step.preview.detail}
                    </span>
                  </div>
                )}

                {step.preview.type === "download" && (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 truncate">{step.preview.name}</span>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all">
                      {step.preview.detail}
                    </button>
                  </div>
                )}
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
