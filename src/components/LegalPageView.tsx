"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import LiveConverterModal from "@/components/LiveConverterModal";
import FileToExcelModal from "@/components/FileToExcelModal";
import FormulaGeneratorModal from "@/components/FormulaGeneratorModal";
import { ConverterToolId, FORWARD_FORMATS, REVERSE_SOURCES, TOOL_LABELS } from "@/lib/converter-tools";
import {
  OutputFormatProvider,
  SiteOutputFormat,
  toolIdToSiteFormat,
} from "@/context/OutputFormatContext";
import { LEGAL_PAGES, LEGAL_TABS, LegalPageId } from "@/lib/legal-data";

export default function LegalPageView({ pageId }: { pageId: LegalPageId }) {
  const router = useRouter();
  const [pageFormat, setPageFormat] = useState<SiteOutputFormat>("jpg");
  const [activeTool, setActiveTool] = useState<ConverterToolId | null>(null);

  const pageConfig = LEGAL_PAGES[pageId] || LEGAL_PAGES.privacy;

  const handleSelectTool = useCallback(
    (tool: ConverterToolId) => {
      const siteFormat = toolIdToSiteFormat(tool);
      if (siteFormat) {
        router.push(`/?format=${siteFormat}`);
        return;
      }
      setActiveTool(tool);
    },
    [router],
  );

  return (
    <OutputFormatProvider format={pageFormat} setFormat={setPageFormat}>
      <main className="min-h-screen bg-[#FAFBFD] text-slate-900 selection:bg-blue-600 selection:text-white w-full max-w-full">
        {/* Upper layer scrolls over the sticky footer (curtain reveal) */}
        <div className="relative z-20 bg-[#FAFBFD] shadow-[0_30px_70px_-15px_rgba(15,23,42,0.22)] w-full max-w-full">
          <Navbar onSelectTool={handleSelectTool} activeFormat={pageFormat} />

          {/* Hero Banner */}
          <section className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
            <motion.div
              key={pageConfig.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
                {pageConfig.titlePrefix} <span className="text-[#355BFF]">{pageConfig.titleHighlight}</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto font-normal">
                {pageConfig.subtitle}
              </p>
              {pageConfig.meta}
            </motion.div>
          </section>

          {/* 4 Key Pillars (Cards with Neon Glow on Hover) */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {pageConfig.pillars.map((pillar, i) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 neon-border-glow shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className={`w-10 h-10 rounded-xl ${pillar.bg} ${pillar.color} flex items-center justify-center mb-3.5`}>
                    <pillar.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{pillar.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{pillar.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Main Document Content Container */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="bg-white rounded-[28px] sm:rounded-[36px] border border-slate-200/80 p-6 sm:p-10 lg:p-12 shadow-[0_12px_45px_rgba(53,91,255,0.06)] space-y-10 text-slate-700">
              
              {pageConfig.sections.map((sec) => (
                <React.Fragment key={sec.number}>
                  {/* Standard Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-blue-100 text-[#355BFF] flex items-center justify-center text-xs font-bold font-mono">
                        {sec.number}
                      </span>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                        {sec.title}
                      </h2>
                    </div>
                    {sec.content}
                  </div>

                  {/* Highlight Box if inserted after this section */}
                  {pageConfig.highlightBox && pageConfig.highlightBox.insertAfterSectionNumber === sec.number && (
                    <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white border border-blue-200/80 neon-border-glow shadow-xs space-y-3">
                      <div className="flex items-center gap-2 text-blue-900 font-bold text-sm sm:text-base">
                        <pageConfig.highlightBox.icon className="w-4 h-4 text-[#355BFF]" />
                        <span>{pageConfig.highlightBox.title}</span>
                      </div>
                      {pageConfig.highlightBox.content}
                    </div>
                  )}
                </React.Fragment>
              ))}

              {/* Contact Box at bottom of document */}
              {pageConfig.contactBox && (
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{pageConfig.contactBox.title}</h3>
                    <p className="text-xs text-slate-500">{pageConfig.contactBox.subtitle}</p>
                  </div>
                  <a
                    href={`mailto:${pageConfig.contactBox.email}`}
                    className="btn-gradient-border inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#355BFF] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{pageConfig.contactBox.buttonText}</span>
                  </a>
                </div>
              )}

            </div>
          </section>

          {/* CTA Banner */}
          <CtaBanner onScrollToUpload={() => router.push("/?format=jpg")} />
        </div>

        {/* Sticky Curtain Footer */}
        <div className="sticky bottom-0 z-0 w-full">
          <Footer />
        </div>

        <LiveConverterModal
          isOpen={Boolean(activeTool && FORWARD_FORMATS[activeTool] && !toolIdToSiteFormat(activeTool))}
          onClose={() => setActiveTool(null)}
          initialFormat={(activeTool && FORWARD_FORMATS[activeTool]) || pageFormat}
          toolTitle={activeTool ? TOOL_LABELS[activeTool] : undefined}
          lockFormat
        />
        {activeTool && REVERSE_SOURCES[activeTool] && (
          <FileToExcelModal isOpen onClose={() => setActiveTool(null)} sourceKind={REVERSE_SOURCES[activeTool]!} />
        )}
        <FormulaGeneratorModal isOpen={activeTool === "formula"} onClose={() => setActiveTool(null)} />
      </main>
    </OutputFormatProvider>
  );
}
