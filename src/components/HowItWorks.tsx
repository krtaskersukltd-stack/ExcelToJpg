"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, RefreshCw, Image as ImageIcon, FileUp, Check } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="py-20 relative bg-[#FAFBFD]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            How to Convert <span className="text-[#355BFF]">JPG</span> to Excel?
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            The process is very simple, just follow these steps and get your JPG converted into Excel instantly.
          </p>
        </div>

        {/* Large Single White Container Card Holding All 3 Steps */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-[28px] sm:rounded-[36px] bg-white border border-slate-200/80 p-6 sm:p-10 lg:p-12 shadow-[0_12px_45px_rgba(53,91,255,0.06)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            
            {/* Step 01: Upload Excel */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Number & Top-Right Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    01
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#EEF4FF] flex items-center justify-center text-[#355BFF]">
                    <FileUp className="w-4 h-4 stroke-[2.2]" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-[#355BFF] mb-2 tracking-tight">
                  Upload Excel
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Select your .xls, .xlsx, or .csv document from your device or drag it directly onto the upload zone.
                </p>
              </div>

              {/* Bottom Preview Pill Card */}
              <div className="mt-8 p-3 bg-white rounded-2xl border border-blue-200/80 shadow-[0_4px_16px_rgba(53,91,255,0.12)] flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#DEE7FF] text-[#355BFF] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-800 truncate">Annual_Q4_Summary.xlsx</p>
                  <p className="text-[10px] text-slate-400 font-medium">1.4 MB • Ready</p>
                </div>
              </div>
            </div>

            {/* Step 02: Convert Your Sheet */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Number & Top-Right Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    02
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#EEF4FF] flex items-center justify-center text-[#355BFF]">
                    <RefreshCw className="w-4 h-4 stroke-[2.2]" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-[#355BFF] mb-2 tracking-tight">
                  Convert Your Sheet
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Our render engine parses fonts, custom styles, merged cells, and graphics into razor sharp JPG pixels.
                </p>
              </div>

              {/* Bottom Preview Pill Card */}
              <div className="mt-8 p-3.5 bg-white rounded-2xl border-2 border-[#355BFF] shadow-[0_4px_16px_rgba(53,91,255,0.15)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#355BFF]"></span>
                  <span className="text-xs font-semibold text-slate-800">Rendering Canvas</span>
                </div>
                <span className="text-xs font-bold text-[#355BFF]">
                  300 DPI
                </span>
              </div>
            </div>

            {/* Step 03: Download JPG */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Number & Top-Right Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    03
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#EEF4FF] flex items-center justify-center text-[#355BFF]">
                    <ImageIcon className="w-4 h-4 stroke-[2.2]" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-[#355BFF] mb-2 tracking-tight">
                  Download JPG
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Instantly download individual sheet images or grab all worksheets bundled into a clean ZIP file.
                </p>
              </div>

              {/* Bottom Preview Pill Card */}
              <div className="mt-8 p-3 bg-white rounded-2xl border border-blue-200/80 shadow-[0_4px_16px_rgba(53,91,255,0.12)] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate">
                  <Check className="w-4 h-4 text-[#355BFF] stroke-[2.5] shrink-0" />
                  <span className="text-xs font-semibold text-slate-800 truncate">Sheet_1_Export.jpg</span>
                </div>
                <button className="bg-[#355BFF] hover:bg-blue-700 text-white text-[11px] font-semibold px-4 py-1.5 rounded-full shadow-xs transition-colors shrink-0 cursor-pointer">
                  Save
                </button>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
