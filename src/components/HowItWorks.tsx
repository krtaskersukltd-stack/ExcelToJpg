"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, RefreshCw, Image as ImageIcon, FileUp, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useOutputFormat } from "@/context/OutputFormatContext";

export default function HowItWorks() {
  const { t } = useLanguage();
  const { label, withFormat } = useOutputFormat();

  return (
    <section className="py-20 relative bg-[#FAFBFD]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {t.howItWorks.titlePrefix} <span className="text-[#355BFF]">{label}</span> {t.howItWorks.titleSuffix}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            {withFormat(t.howItWorks.subtitle)}
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
                  <span className="text-3xl sm:text-4xl font-medium text-slate-900 tracking-tight">
                    01
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#EEF4FF] flex items-center justify-center text-[#355BFF]">
                    <FileUp className="w-4 h-4 stroke-[2.2]" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-[#355BFF] mb-2 tracking-tight">
                  {t.howItWorks.step1Title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.howItWorks.step1Desc}
                </p>
              </div>

              {/* Bottom Preview Pill Card */}
              <div className="mt-8 p-3 bg-white rounded-2xl border border-blue-200/80 neon-border-glow shadow-[0_4px_16px_rgba(53,91,255,0.12)] hover:shadow-[0_6px_20px_rgba(53,91,255,0.18)] transition-all flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#DEE7FF] text-[#355BFF] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-800 truncate">{t.howItWorks.step1CardTitle}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{t.howItWorks.step1CardSize} • {t.howItWorks.step1CardStatus}</p>
                </div>
              </div>
            </div>

            {/* Step 02: Convert Your Sheet */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Number & Top-Right Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl sm:text-4xl font-medium text-slate-900 tracking-tight">
                    02
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#EEF4FF] flex items-center justify-center text-[#355BFF]">
                    <RefreshCw className="w-4 h-4 stroke-[2.2]" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-[#355BFF] mb-2 tracking-tight">
                  {t.howItWorks.step2Title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {withFormat(t.howItWorks.step2Desc)}
                </p>
              </div>

              {/* Bottom Preview Pill Card */}
              <div className="mt-8 p-6 bg-white rounded-2xl border border-blue-200/80 neon-border-glow shadow-[0_4px_16px_rgba(53,91,255,0.15)] hover:shadow-[0_6px_20px_rgba(53,91,255,0.22)] transition-all flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#355BFF]"></span>
                  <span className="text-xs font-semibold text-slate-800">{t.howItWorks.step2CardTitle}</span>
                </div>
                <span className="text-xs font-bold text-[#355BFF]">
                  {t.howItWorks.step2CardSpeed}
                </span>
              </div>
            </div>

            {/* Step 03: Download JPG */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Number & Top-Right Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl sm:text-4xl font-medium text-slate-900 tracking-tight">
                    03
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#EEF4FF] flex items-center justify-center text-[#355BFF]">
                    <ImageIcon className="w-4 h-4 stroke-[2.2]" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-[#355BFF] mb-2 tracking-tight">
                  {t.howItWorks.step3Title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {withFormat(t.howItWorks.step3Desc)}
                </p>
              </div>

              {/* Bottom Preview Pill Card */}
              <div className="mt-8 p-4 bg-white rounded-2xl border border-blue-200/80 neon-border-glow shadow-[0_4px_16px_rgba(53,91,255,0.12)] hover:shadow-[0_6px_20px_rgba(53,91,255,0.18)] transition-all flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate">
                  <Check className="w-4 h-4 text-[#355BFF] stroke-[2.5] shrink-0" />
                  <span className="text-xs font-semibold text-slate-800 truncate">{withFormat(t.howItWorks.step3CardTitle)}</span>
                </div>
                <button className="btn-gradient-border bg-[#355BFF] hover:bg-blue-700 text-white text-[11px] font-semibold px-4 py-1.5 rounded-full shadow-xs transition-colors shrink-0 cursor-pointer">
                  {t.howItWorks.step3CardAction}
                </button>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
