"use client";

import React, { useState } from "react";
import { PricingCard, PricingPlan } from "./PricingCard";
import { CheckoutModal } from "./CheckoutModal";

const pricingPlans: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic Plan",
    monthlyPrice: 9.9,
    yearlyPrice: 7.9,
    description:
      "For individual users who need smooth, professional results in a simple, fast environment.",
    isPopular: false,
    features: [
      "1000Credits per Month",
      "AI-Powered Data Extraction",
      "Batch Conversions",
      "Preserve Layout for Tabular Data",
      "Blazing-Fast Conversions",
      "Secure Processing",
    ],
    footerNote: "Secure SSL payment - Cancel anytime",
    ctaText: "Get Started",
  },
  {
    id: "advance",
    name: "Advance Plan",
    monthlyPrice: 14.9,
    yearlyPrice: 11.9,
    description:
      "For professional users who need higher credit limits and faster, priority processing speeds.",
    isPopular: true,
    features: [
      "2000Credits per Month",
      "AI-PoweredData Extraction",
      "Batch Conversions",
      "Preserve Layout for Tabular Data",
      "Blazing-Fast Conversions",
      "Secure Processing",
    ],
    footerNote: "Secure SSL payment - Cancel anytime",
    ctaText: "Get Started",
  },
  {
    id: "business",
    name: "Business Plan",
    monthlyPrice: 29.9,
    yearlyPrice: 23.9,
    description:
      "For corporate teams that need maximum output capacity and dedicated, premium-level support.",
    isPopular: false,
    features: [
      "4000Credits per Month",
      "AI-Powered Data Extraction",
      "Batch Conversions",
      "Preserve Layout for Tabular Data",
      "Blazing-Fast Conversions",
      "Secure Processing",
    ],
    footerNote: "Secure SSL payment - Cancel anytime",
    ctaText: "Get Started",
  },
];

export const PricingSection: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

  return (
    <section className="relative w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header Content */}
        <div className="text-center mx-auto mb-10 sm:mb-12">
          {/* Main Title: "Our Pricings" */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-3.5 font-sans">
            Our <span className="text-[#3858F6]">Pricings</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[13.5px] sm:text-[14.5px] text-slate-700 leading-relaxed font-normal whitespace-nowrap">
            Tabular data retention from images enabled, Find the perfect plan to supercharge your data management.
          </p>

          {/* Billing Switcher Toggle (Monthly / Yearly) */}
          <div className="mt-8 flex justify-center items-center">
            <div className="inline-flex items-center gap-2 p-1 bg-white rounded-full shadow-[0_10px_25px_-5px_rgba(56,88,246,0.18),0_4px_10px_rgba(0,0,0,0.03)] border border-blue-100/80">
              {/* Monthly Button */}
              <button
                type="button"
                onClick={() => setIsYearly(false)}
                className={`w-28 py-2 text-[13.5px] font-semibold rounded-full flex items-center justify-center transition-all duration-300 ${
                  !isYearly
                    ? "bg-[#3858F6] text-white shadow-[0_4px_12px_rgba(56,88,246,0.35)]"
                    : "text-slate-700 hover:text-slate-950"
                }`}
              >
                Monthly
              </button>

              {/* Yearly Button */}
              <button
                type="button"
                onClick={() => setIsYearly(true)}
                className={`w-28 py-2 text-[13.5px] font-semibold rounded-full flex items-center justify-center transition-all duration-300 ${
                  isYearly
                    ? "bg-[#3858F6] text-white shadow-[0_4px_12px_rgba(56,88,246,0.35)]"
                    : "text-slate-700 hover:text-slate-950"
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-7 items-center pt-16 pb-8 max-w-[1060px] mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={plan.isPopular ? "md:col-span-2 lg:col-span-1" : ""}
            >
              <PricingCard
                plan={plan}
                isYearly={isYearly}
                onSelectPlan={(p) => setSelectedPlan(p)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        plan={selectedPlan}
        isYearly={isYearly}
        onClose={() => setSelectedPlan(null)}
      />
    </section>
  );
};

