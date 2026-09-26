"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import confetti from "canvas-confetti";
import Navbar from "@/components/Navbar";
import { PricingSection } from "@/components/PricingSection";
import FaqSection from "@/components/FaqSection";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import LiveConverterModal from "@/components/LiveConverterModal";
import { useLanguage } from "@/context/LanguageContext";
import FileToExcelModal from "@/components/FileToExcelModal";
import FormulaGeneratorModal from "@/components/FormulaGeneratorModal";
import { ConverterToolId, FORWARD_FORMATS, REVERSE_SOURCES, TOOL_LABELS } from "@/lib/converter-tools";
import {
  OutputFormatProvider,
  SiteOutputFormat,
  toolIdToSiteFormat,
} from "@/context/OutputFormatContext";

function PaymentStatusNotification() {
  const { t } = useLanguage();
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
                <h4 className="font-bold text-sm sm:text-base">{t.pricingPage.paymentSuccess}</h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-extrabold uppercase">
                  Active
                </span>
              </div>
              <p className="text-xs text-emerald-700 mt-0.5">
                {planName ? `${planName}: ` : ""}{t.pricingPage.paymentSuccessDesc}
              </p>
            </div>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer"
          >
            {t.pricingPage.dismiss}
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 shadow-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">{t.pricingPage.paymentCancelled}</h4>
              <p className="text-xs text-amber-700">
                {t.pricingPage.paymentCancelledDesc}
              </p>
            </div>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer"
          >
            {t.pricingPage.close}
          </button>
        </div>
      )}
    </div>
  );
}

export default function PricingPage() {
  const router = useRouter();
  const [pageFormat, setPageFormat] = useState<SiteOutputFormat>("jpg");
  const [activeTool, setActiveTool] = useState<ConverterToolId | null>(null);

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
      <div className="min-h-screen bg-[#FAFBFD] flex flex-col justify-between">
        <div>
          <Navbar onSelectTool={handleSelectTool} activeFormat={pageFormat} />

          <Suspense fallback={null}>
            <PaymentStatusNotification />
          </Suspense>

          <div className="pt-2 sm:pt-4">
            <PricingSection />
          </div>

          <FaqSection />

          <CtaBanner onScrollToUpload={() => router.push("/?format=jpg")} />
        </div>

        <Footer />

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
      </div>
    </OutputFormatProvider>
  );
}
