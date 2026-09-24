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

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customFileName, setCustomFileName] = useState("Annual_Q4_Summary.xlsx");
  const [customFileSize, setCustomFileSize] = useState("1.4 MB");
  const [modalFormat, setModalFormat] = useState<"jpg" | "png" | "pdf" | "docx">("jpg");

  const handleOpenConverter = (fileName?: string, format?: "jpg" | "png" | "pdf" | "docx") => {
    if (fileName) {
      setCustomFileName(fileName);
      setCustomFileSize("2.4 MB");
    }
    if (format) {
      setModalFormat(format);
    }
    setIsModalOpen(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#FAFBFD] text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Main Content Layer (Scrolls over the footer) */}
      <div className="relative z-20 bg-[#FAFBFD] shadow-[0_30px_70px_-15px_rgba(15,23,42,0.22)]">
        {/* Top Navbar */}
        <Navbar onOpenUploadModal={() => handleOpenConverter()} />

        {/* Hero Section */}
        <HeroSection />

        {/* Products Ribbon & Dock */}
        <ProductsRibbon />

        {/* How To Convert / Step-by-Step Flow */}
        <HowItWorks />

        {/* Interactive Spreadsheet to Image Showcase */}
        <SpreadsheetShowcase />

        {/* Share Excel Data Without Sending a Spreadsheet (3 Cards) */}
        <FeatureCards />

        {/* From Spreadsheet to JPG (Comparison Matrix) */}
        <ComparisonMatrix />

        {/* Related Conversion Utilities Grid */}
        <RelatedUtilities
          onSelectTool={(toolName) => {
            const lower = toolName.toLowerCase();
            const fmt = lower.includes("png")
              ? "png"
              : lower.includes("pdf")
              ? "pdf"
              : lower.includes("docx") || lower.includes("doc")
              ? "docx"
              : "jpg";
            handleOpenConverter(`${toolName.replace(/\s+/g, "_")}.xlsx`, fmt);
          }}
        />

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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fileName={customFileName}
        fileSize={customFileSize}
        initialFormat={modalFormat}
      />
    </main>
  );
}
