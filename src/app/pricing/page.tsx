"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Sparkles, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import Navbar from "@/components/Navbar";
import { PricingSection } from "@/components/PricingSection";
import FaqSection from "@/components/FaqSection";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import LiveConverterModal from "@/components/LiveConverterModal";

function PaymentStatusNotification() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const planName = searchParams.get("plan");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status === "success") {
      setVisible(true);
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.4 },
        colors: ["#3858F6", "#10B981", "#6366F1", "#3B82F6", "#F59E0B"],
      });
    } else if (status === "cancelled") {
      setVisible(true);
    }
  }, [status]);

  if (!visible || !status) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-2">
      {status === "success" ? (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm sm:text-base">Payment Confirmed by Stripe!</h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-extrabold uppercase">
                  Active
                </span>
              </div>
              <p className="text-xs text-emerald-700 mt-0.5">
                Your {planName || "Membership"} is now unlocked with instant extraction credits.
              </p>
            </div>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 shadow-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Checkout Cancelled</h4>
              <p className="text-xs text-amber-700">
                Your card was not charged. You can choose a plan whenever you are ready.
              </p>
            </div>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

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

        {/* Payment Confirmation Banner (if redirected from Stripe) */}
        <Suspense fallback={null}>
          <PaymentStatusNotification />
        </Suspense>

        {/* Pricing Table Section */}
        <div className="pt-2 sm:pt-4">
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
