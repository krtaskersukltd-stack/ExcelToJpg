"use client";

import React from "react";
import { Flame } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  isPopular?: boolean;
  features: string[];
  footerNote?: string;
  ctaText?: string;
}

interface PricingCardProps {
  plan: PricingPlan;
  isYearly: boolean;
  onSelectPlan: (plan: PricingPlan) => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  isYearly,
  onSelectPlan,
}) => {
  const { t } = useLanguage();
  const isHighlighted = plan.isPopular;
  const currentPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const priceDisplay = Number.isInteger(currentPrice)
    ? currentPrice
    : currentPrice.toFixed(1);

  return (
    <div
      className={`relative w-full rounded-[30px] neon-border-glow transition-all duration-300 flex flex-col justify-between ${
        isHighlighted
          ? "bg-[#444AF4] text-white shadow-[0_25px_60px_-10px_rgba(68,74,244,0.48)] border border-[#6B71FF]/35 p-7 lg:p-8 lg:-translate-y-12 lg:scale-[1.03] z-10 hover:shadow-[0_30px_70px_-8px_rgba(68,74,244,0.58)]"
          : "bg-white text-slate-900 shadow-[0_20px_45px_-10px_rgba(56,88,246,0.18)] border-2 border-[#DCE4FE] p-7 lg:p-8 hover:shadow-[0_25px_50px_-8px_rgba(56,88,246,0.24)] hover:-translate-y-1"
      }`}
    >
      {/* Centered Most Popular Badge Straddling Top Border */}
      {isHighlighted && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="h-10 px-3.5 flex items-center justify-center gap-1 rounded-full bg-white text-slate-800 text-[13px] font-semibold tracking-normal shadow-sm border border-[#DCE4FE]">
            <Flame className="w-4 h-4 text-[#444AF4] stroke-[2.3]" />
            <span>{t.pricingPage.popular}</span>
          </div>
        </div>
      )}

      {/* Top Details */}
      <div>
        {/* Plan Name */}
        <h3
          className={`text-[20px] font-bold tracking-tight ${
            isHighlighted ? "text-white" : "text-[#111827]"
          }`}
        >
          {plan.name}
        </h3>

        {/* Pricing */}
        <div className="flex items-baseline mt-4 mb-3">
          <span
            className={`text-4xl lg:text-[44px] font-extrabold tracking-tight leading-none ${
              isHighlighted ? "text-white" : "text-[#3858F6]"
            }`}
          >
            ${priceDisplay}
          </span>
          <span
            className={`text-[13px] sm:text-[14px] font-medium ml-1.5 ${
              isHighlighted ? "text-blue-100" : "text-slate-800"
            }`}
          >
            {isYearly ? "/mo (annual)" : "/mo"}
          </span>
        </div>

        {/* Description */}
        <p
          className={`text-[13px] leading-relaxed min-h-[50px] ${
            isHighlighted ? "text-blue-50/95" : "text-slate-700"
          }`}
        >
          {plan.description}
        </p>

        {/* Call to Action Button */}
        <button
          onClick={() => onSelectPlan(plan)}
          className={`w-full py-3.5 px-6 rounded-full font-semibold text-[14.5px] tracking-wide transition-all duration-200 mt-6 active:scale-[0.98] cursor-pointer ${
            isHighlighted
              ? "bg-white text-slate-900 hover:bg-slate-50 shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.16)] font-bold"
              : "bg-[#3858F6] text-white hover:bg-[#2A48E8] shadow-[0_10px_22px_-4px_rgba(56,88,246,0.45)] hover:shadow-[0_12px_26px_-4px_rgba(56,88,246,0.55)]"
          }`}
        >
          {t.pricingPage.getStarted}
        </button>

        {/* Features List Header */}
        <div className="mt-6">
          <p
            className={`text-[11px] font-bold tracking-wider uppercase mb-3 ${
              isHighlighted ? "text-blue-200" : "text-slate-800"
            }`}
          >
            •
          </p>

          {/* Features */}
          <ul className="space-y-2">
            {plan.features.map((feature, idx) => (
              <li
                key={idx}
                className={`text-[12.5px] font-medium flex items-start leading-snug ${
                  isHighlighted ? "text-white" : "text-slate-800"
                }`}
              >
                <span className="inline-block mr-2 select-none">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Divider & Guarantee */}
      <div className="mt-7 pt-2">
        <div
          className={`w-full h-[1.5px] rounded-full mb-3.5 ${
            isHighlighted ? "bg-white/35" : "bg-[#6B8EFC]"
          }`}
        />
        <p
          className={`text-[11px] font-medium text-center tracking-normal ${
            isHighlighted ? "text-blue-100/90" : "text-slate-600"
          }`}
        >
          {t.pricingPage.cancelAnytime}
        </p>
      </div>
    </div>
  );
};
