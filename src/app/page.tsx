"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsRibbon from "@/components/ProductsRibbon";
import HowItWorks from "@/components/HowItWorks";
import SpreadsheetShowcase from "@/components/SpreadsheetShowcase";
import FeatureCards from "@/components/FeatureCards";
import ComparisonMatrix from "@/components/ComparisonMatrix";
import RelatedUtilities from "@/components/RelatedUtilities";
import FaqSection from "@/components/FaqSection";
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

function parseFormatParam(value: string | null): SiteOutputFormat | null {
  if (value === "jpg" || value === "png" || value === "csv") return value;
  return null;
}

function HomeContent() {
  const searchParams = useSearchParams();
  const formatFromQuery = parseFormatParam(searchParams.get("format"));
  const toolFromQuery = searchParams.get("tool") as ConverterToolId | null;

  const [activeTool, setActiveTool] = useState<ConverterToolId>(() => {
    if (toolFromQuery) return toolFromQuery;
    if (formatFromQuery === "png") return "excel-png";
    if (formatFromQuery === "csv") return "excel-csv";
    return "excel-jpg";
  });

  const [pageFormat, setPageFormat] = useState<SiteOutputFormat>(() => {
    if (formatFromQuery) return formatFromQuery;
    if (toolFromQuery === "excel-png") return "png";
    if (toolFromQuery === "excel-csv") return "csv";
    return "jpg";
  });

  useEffect(() => {
    const qFormat = parseFormatParam(searchParams.get("format"));
    const qTool = searchParams.get("tool") as ConverterToolId | null;
    if (qTool) {
      setActiveTool(qTool);
      const siteFmt = toolIdToSiteFormat(qTool);
      if (siteFmt) setPageFormat(siteFmt);
    } else if (qFormat) {
      setPageFormat(qFormat);
      if (qFormat === "png") setActiveTool("excel-png");
      else if (qFormat === "csv") setActiveTool("excel-csv");
      else setActiveTool("excel-jpg");
    }
  }, [searchParams]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSelectTool = useCallback(
    (tool: ConverterToolId) => {
      setActiveTool(tool);
      const siteFormat = toolIdToSiteFormat(tool);
      if (siteFormat) {
        setPageFormat(siteFormat);
      }
      scrollToTop();
    },
    [scrollToTop],
  );

  return (
    <OutputFormatProvider format={pageFormat} setFormat={setPageFormat}>
      <main className="min-h-screen bg-[#FAFBFD] text-slate-900 selection:bg-blue-600 selection:text-white w-full max-w-full">
        {/* Upper layer scrolls over the sticky footer (curtain reveal) */}
        <div className="relative z-20 bg-[#FAFBFD] shadow-[0_30px_70px_-15px_rgba(15,23,42,0.22)] w-full max-w-full">
          <Navbar onSelectTool={handleSelectTool} activeFormat={pageFormat} activeTool={activeTool} />

          <HeroSection activeTool={activeTool} onSelectTool={handleSelectTool} />

          <ProductsRibbon onSelectTool={handleSelectTool} />

          <HowItWorks activeTool={activeTool} />

          <SpreadsheetShowcase activeTool={activeTool} />

          <FeatureCards />

          <ComparisonMatrix activeTool={activeTool} />

          <RelatedUtilities onSelectTool={handleSelectTool} />

          <FaqSection />

          {/* Blue “ready” CTA — last piece of the covering layer */}
          <CtaBanner onScrollToUpload={scrollToTop} activeTool={activeTool} />
        </div>

        {/* Sticky footer reveals from underneath the CTA as you scroll */}
        <div className="sticky bottom-0 z-0 w-full">
          <Footer />
        </div>
      </main>
    </OutputFormatProvider>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
