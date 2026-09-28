"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, RefreshCw, Image as ImageIcon, FileUp, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useOutputFormat } from "@/context/OutputFormatContext";
import { ConverterToolId, getToolConfig } from "@/lib/converter-tools";

export default function HowItWorks({ activeTool = "excel-jpg" }: { activeTool?: ConverterToolId }) {
  const { t } = useLanguage();
  const { withFormat } = useOutputFormat();
  const toolConfig = getToolConfig(activeTool);

  const isReverse = toolConfig.actionType === "reverse_excel";
  const isFormula = toolConfig.actionType === "formula";
  const sourceLabel = isReverse
    ? toolConfig.titlePrefix.replace(" To", "")
    : toolConfig.titleHighlight;

  const step1Title = isReverse
    ? `Upload ${toolConfig.titlePrefix.replace(" To", "")} File`
    : isFormula
    ? "Enter Prompt"
    : "Upload Excel";

  const step1Desc = isReverse
    ? `Choose or drop your ${toolConfig.titlePrefix.replace(" To", "")} file into our smart table conversion engine.`
    : isFormula
    ? "Describe the calculation, condition, or transformation you need in regular words."
    : "Select your .xls, .xlsx, or .csv document from your device or drag it directly onto the upload zone.";

  const step2Title = isReverse
    ? "AI OCR & Table Extraction"
    : isFormula
    ? "Formula Generation"
    : "Convert Your Sheet";

  const step2Desc = isReverse
    ? "Our engine accurately scans table boundaries, text, and numbers into structured spreadsheet cells."
    : isFormula
    ? "Advanced AI creates the optimal Excel or Google Sheets formula and explains syntax step by step."
    : "Our render engine parses fonts, custom styles, merged cells, and graphics into razor sharp output pixels.";

  const step3Title = isReverse
    ? "Download Excel (.xlsx)"
    : isFormula
    ? "Copy & Calculate"
    : `Download ${toolConfig.titleHighlight}`;

  const step3Desc = isReverse
    ? "Download your clean, fully editable Microsoft Excel spreadsheet ready for analysis."
    : isFormula
    ? "Paste the formula directly into your sheet and automate calculations instantly."
    : "Instantly download individual sheet images or grab all worksheets bundled into a clean ZIP file.";

  return (
    <section id="about" className="relative bg-[#FAFBFD] py-16 sm:py-20">
      <div className="mx-auto max-w-[1248px] px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-7 text-center sm:mb-6">
          <h2 className="text-[28px] font-bold leading-[1.2] tracking-[-0.035em] text-[#141414] sm:text-[34px]">
            {isFormula ? (
              <>How to Generate <span className="text-[#4A29FF]">Excel Formulas</span>?</>
            ) : (
              <>How to Convert <span className="text-[#4A29FF]">{sourceLabel}</span> to Excel?</>
            )}
          </h2>
          <p className="mx-auto mt-2.5 max-w-3xl text-[15px] leading-6 text-[#252525] sm:text-[16px]">
            {isReverse
              ? `Convert your ${toolConfig.titlePrefix.replace(" To", "")} into structured spreadsheets in 3 quick steps.`
              : isFormula
              ? "Generate accurate, high-performance formulas in seconds."
              : withFormat(t.howItWorks.subtitle)}
          </p>
        </div>

        {/* Large Single White Container Card Holding All 3 Steps */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-[22px] bg-[#F6F7FB] px-6 py-8 sm:px-10 sm:py-10 lg:px-10 lg:py-10"
        >
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12 lg:gap-[108px]">
            
            {/* Step 01: Upload Excel */}
            <div className="flex min-w-0 flex-col justify-between">
              <div>
                {/* Number & Top-Right Icon */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[40px] font-medium leading-none tracking-[-0.04em] text-[#141414]">
                    01
                  </span>
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#F1F2F7] text-[#4A29FF]">
                    <FileUp className="size-[18px] stroke-[2.2]" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="mb-2 text-[23px] font-bold leading-7 tracking-[-0.025em] text-[#4A29FF]">
                  {step1Title}
                </h3>

                {/* Description */}
                <p className="text-[16px] leading-[1.45] text-[#202020]">
                  {step1Desc}
                </p>
              </div>

              {/* Bottom Preview Pill Card */}
              <div className="mt-5 flex min-h-[60px] items-center gap-3 rounded-[14px] border border-[#8D7CFF] bg-white px-4 py-2.5 shadow-[8px_12px_18px_-10px_rgba(73,43,255,0.42)] sm:mt-5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-[4px] bg-[#EEECFF] text-[#4A29FF]">
                  <FileText className="size-[17px] stroke-[2.2]" />
                </div>
                <div className="truncate">
                  <p className="truncate text-[13px] font-medium text-[#252538]">{t.howItWorks.step1CardTitle}</p>
                  <p className="text-[12px] text-[#55566A]">{t.howItWorks.step1CardSize} • {t.howItWorks.step1CardStatus}</p>
                </div>
              </div>
            </div>

            {/* Step 02: Convert Your Sheet */}
            <div className="flex min-w-0 flex-col justify-between">
              <div>
                {/* Number & Top-Right Icon */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[40px] font-medium leading-none tracking-[-0.04em] text-[#141414]">
                    02
                  </span>
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#F1F2F7] text-[#4A29FF]">
                    <RefreshCw className="size-[18px] stroke-[2.2]" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="mb-2 text-[23px] font-bold leading-7 tracking-[-0.025em] text-[#4A29FF]">
                  {step2Title}
                </h3>

                {/* Description */}
                <p className="text-[16px] leading-[1.45] text-[#202020]">
                  {step2Desc}
                </p>
              </div>

              {/* Bottom Preview Pill Card */}
              <div className="mt-5 flex min-h-[60px] items-center justify-between rounded-[14px] border border-[#8D7CFF] bg-white px-4 py-2.5 shadow-[8px_12px_18px_-10px_rgba(73,43,255,0.42)] sm:mt-5">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-[#4A29FF]"></span>
                  <span className="text-[13px] font-medium text-[#252538]">{t.howItWorks.step2CardTitle}</span>
                </div>
                <span className="rounded-[4px] bg-[#F7F6FF] px-2.5 py-1 text-[12px] font-semibold text-[#4A29FF]">
                  {t.howItWorks.step2CardSpeed}
                </span>
              </div>
            </div>

            {/* Step 03: Download Output */}
            <div className="flex min-w-0 flex-col justify-between">
              <div>
                {/* Number & Top-Right Icon */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[40px] font-medium leading-none tracking-[-0.04em] text-[#141414]">
                    03
                  </span>
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#F1F2F7] text-[#4A29FF]">
                    <ImageIcon className="size-[18px] stroke-[2.2]" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="mb-2 text-[23px] font-bold leading-7 tracking-[-0.025em] text-[#4A29FF]">
                  {step3Title}
                </h3>

                {/* Description */}
                <p className="text-[16px] leading-[1.45] text-[#202020]">
                  {step3Desc}
                </p>
              </div>

              {/* Bottom Preview Pill Card */}
              <div className="mt-5 flex min-h-[60px] items-center justify-between gap-2 rounded-[14px] border border-[#8D7CFF] bg-white px-4 py-2.5 shadow-[8px_12px_18px_-10px_rgba(73,43,255,0.42)] sm:mt-5">
                <div className="flex items-center gap-2 truncate">
                  <Check className="size-[17px] shrink-0 stroke-[2.5] text-[#4A29FF]" />
                  <span className="truncate text-[13px] font-medium text-[#252538]">{withFormat(t.howItWorks.step3CardTitle)}</span>
                </div>
                <button type="button" className="btn-gradient-border shrink-0 cursor-pointer rounded-full bg-[#4A29FF] px-4 py-1 text-[11px] font-semibold text-white shadow-[0_3px_7px_rgba(74,41,255,0.3)] transition-colors hover:bg-[#3518dc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A29FF]">
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
