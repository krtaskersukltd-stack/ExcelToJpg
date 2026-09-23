"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { PricingSection } from "@/components/PricingSection";
import FaqSection from "@/components/FaqSection";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import LiveConverterModal from "@/components/LiveConverterModal";

export default function PricingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customFileName, setCustomFileName] = useState("Annual_Q4_Summary.xlsx");
  const [customFileSize, setCustomFileSize] = useState("1.4 MB");

  const handleOpenConverter = (fileName?: string) => {
    if (fileName) {
      setCustomFileName(fileName);
      setCustomFileSize("2.4 MB");
    }
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#FAFBFD] text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Main Content Layer (Navbar, Pricing, FAQs, CTA Banner) */}
      <div className="relative z-20 bg-[#FAFBFD] shadow-[0_30px_70px_-15px_rgba(15,23,42,0.22)]">
        {/* Top Navbar */}
        <Navbar onOpenUploadModal={() => handleOpenConverter()} />

        {/* Pricing Table Section */}
        <div className="pt-4 sm:pt-8">
          <PricingSection />
        </div>

        {/* Frequently Asked Questions */}
        <FaqSection />

        {/* Sticky CTA Banner ('Ready to Convert Your Excel File?') */}
        <CtaBanner onScrollToUpload={() => handleOpenConverter()} />
      </div>

      {/* Sticky Curtain Reveal Footer (Reveals from underneath the CTA Banner) */}
      <div className="sticky bottom-0 z-10 w-full">
        <Footer />
      </div>

      {/* Global Interactive Converter Modal */}
      <LiveConverterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fileName={customFileName}
        fileSize={customFileSize}
      />
    </main>
  );
}
