"use client";

import React, { useState } from "react";
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

export default function Home() {
  const [activeTool, setActiveTool] = useState<ConverterToolId | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#FAFBFD] text-slate-900 selection:bg-blue-600 selection:text-white w-full max-w-full overflow-x-hidden">
      {/* Top Main Content Layer (Scrolls over the footer) */}
      <div className="relative z-20 bg-[#FAFBFD] shadow-[0_30px_70px_-15px_rgba(15,23,42,0.22)] w-full max-w-full overflow-x-hidden">
        {/* Top Navbar */}
        <Navbar onOpenUploadModal={() => setActiveTool("excel-jpg")} onSelectTool={setActiveTool} />

        {/* Hero Section */}
        <HeroSection />

        {/* Products Ribbon & Dock */}
        <ProductsRibbon onSelectTool={setActiveTool} />

        {/* How To Convert / Step-by-Step Flow */}
        <HowItWorks />

        {/* Interactive Spreadsheet to Image Showcase */}
        <SpreadsheetShowcase />

        {/* Share Excel Data Without Sending a Spreadsheet (3 Cards) */}
        <FeatureCards />

        {/* From Spreadsheet to JPG (Comparison Matrix) */}
        <ComparisonMatrix />

        {/* Related Conversion Utilities Grid */}
        <RelatedUtilities onSelectTool={setActiveTool} />

        {/* FAQ Accordion Section */}
        <FaqSection />

        {/* Sticky CTA Banner (Blue Section) */}
        <CtaBanner onScrollToUpload={scrollToTop} />
      </div>

      {/* Sticky Curtain Reveal Footer (Reveals from underneath the Blue CTA Banner) */}
      <div className="sticky bottom-0 z-10 w-full">
        <Footer />
      </div>

      {/* Global Interactive Converter Modal */}
      <LiveConverterModal
        isOpen={Boolean(activeTool && FORWARD_FORMATS[activeTool])}
        onClose={() => setActiveTool(null)}
        initialFormat={(activeTool && FORWARD_FORMATS[activeTool]) || "jpg"}
        toolTitle={activeTool ? TOOL_LABELS[activeTool] : undefined}
        lockFormat
      />
      {activeTool && REVERSE_SOURCES[activeTool] && <FileToExcelModal isOpen onClose={() => setActiveTool(null)} sourceKind={REVERSE_SOURCES[activeTool]!} />}
      <FormulaGeneratorModal isOpen={activeTool === "formula"} onClose={() => setActiveTool(null)} />
    </main>
  );
}
