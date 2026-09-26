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
  const [pageFormat, setPageFormat] = useState<SiteOutputFormat>(
    () => parseFormatParam(searchParams.get("format")) || "jpg",
  );
  const [activeTool, setActiveTool] = useState<ConverterToolId | null>(null);

  useEffect(() => {
    const fromUrl = parseFormatParam(searchParams.get("format"));
    if (fromUrl) setPageFormat(fromUrl);
  }, [searchParams]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSelectTool = useCallback(
    (tool: ConverterToolId) => {
      const siteFormat = toolIdToSiteFormat(tool);
      if (siteFormat) {
        setPageFormat(siteFormat);
        setActiveTool(null);
        scrollToTop();
        return;
      }
      setActiveTool(tool);
    },
    [scrollToTop],
  );

  return (
    <OutputFormatProvider format={pageFormat} setFormat={setPageFormat}>
      <main className="min-h-screen flex flex-col bg-[#FAFBFD] text-slate-900 selection:bg-blue-600 selection:text-white w-full max-w-full overflow-x-hidden">
        <div className="relative z-20 bg-[#FAFBFD] shadow-[0_30px_70px_-15px_rgba(15,23,42,0.22)] w-full max-w-full overflow-x-hidden">
          <Navbar onSelectTool={handleSelectTool} activeFormat={pageFormat} />

          <HeroSection />

          <ProductsRibbon onSelectTool={handleSelectTool} />

          <HowItWorks />

          <SpreadsheetShowcase />

          <FeatureCards />

          <ComparisonMatrix />

          <RelatedUtilities onSelectTool={handleSelectTool} />

          <FaqSection />

          <CtaBanner onScrollToUpload={scrollToTop} />
        </div>

        <div className="sticky bottom-0 z-10 w-full">
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

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
