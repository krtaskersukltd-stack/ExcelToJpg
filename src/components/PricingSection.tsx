"use client";

import React, { useState } from "react";
import { PricingCard, PricingPlan } from "./PricingCard";
import { CheckoutModal } from "./CheckoutModal";
import { useLanguage } from "@/context/LanguageContext";

export const PricingSection: React.FC = () => {
  const { t } = useLanguage();
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

  const planConfigs = [
    {
      id: "basic",
      monthlyPrice: 9.9,
      yearlyPrice: 7.9,
      isPopular: false,
    },
    {
      id: "advance",
      monthlyPrice: 14.9,
      yearlyPrice: 11.9,
      isPopular: true,
    },
    {
      id: "business",
      monthlyPrice: 29.9,
      yearlyPrice: 23.9,
      isPopular: false,
    },
  ];

  const dynamicPlans: PricingPlan[] = planConfigs.map((cfg, idx) => {
    const localized = t.pricingPage.plans[idx] || t.pricingPage.plans[0];
    return {
      id: cfg.id,
      name: localized.name,
      monthlyPrice: cfg.monthlyPrice,
      yearlyPrice: cfg.yearlyPrice,
      description: localized.desc,
      isPopular: cfg.isPopular,
      features: [...localized.features],
      footerNote: t.pricingPage.cancelAnytime,
      ctaText: t.pricingPage.getStarted,
    };
  });

  return (
    <section className="relative w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header Content */}
        <div className="text-center mx-auto mb-10 sm:mb-12">
          {/* Main Title: "Our Pricings" */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-3.5 font-sans">
            {t.pricingPage.title}
          </h1>

          {/* Subtitle */}
          <p className="text-[13.5px] sm:text-[14.5px] text-slate-700 leading-relaxed font-normal max-w-xl mx-auto">
            {t.pricingPage.subtitle}
          </p>

          {/* Billing Switcher Toggle (Monthly / Yearly) */}
          <div className="mt-8 flex justify-center items-center">
            <div className="inline-flex items-center gap-2 p-1 bg-white rounded-full shadow-[0_10px_25px_-5px_rgba(56,88,246,0.18),0_4px_10px_rgba(0,0,0,0.03)] border border-blue-100/80">
              {/* Monthly Button */}
              <button
                type="button"
                onClick={() => setIsYearly(false)}
                className={`w-32 py-2 text-[13.5px] font-semibold rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  !isYearly
                    ? "bg-[#3858F6] text-white shadow-[0_4px_12px_rgba(56,88,246,0.35)]"
                    : "text-slate-700 hover:text-slate-950"
                }`}
              >
                {t.pricingPage.monthly}
              </button>

              {/* Yearly Button */}
              <button
                type="button"
                onClick={() => setIsYearly(true)}
                className={`w-32 py-2 text-[13.5px] font-semibold rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  isYearly
                    ? "bg-[#3858F6] text-white shadow-[0_4px_12px_rgba(56,88,246,0.35)]"
                    : "text-slate-700 hover:text-slate-950"
                }`}
              >
                {t.pricingPage.yearly}
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-7 items-center pt-16 pb-8 max-w-[1060px] mx-auto">
          {dynamicPlans.map((plan) => (
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
