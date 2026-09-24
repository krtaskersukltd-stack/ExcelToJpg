"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function FeatureCards() {
  const { t } = useLanguage();

  const c0 = t.features.cards[0];
  const c1 = t.features.cards[1];
  const c2 = t.features.cards[2];

  const cards = [
    {
      id: "executive-reports",
      titlePrefix: c0?.titlePrefix || "Executive",
      titleSuffix: c0?.titleSuffix || "Reports",
      description: c0?.desc || "Paste high-level financial snapshots and KPI summaries straight into presentations.",
      centerIcon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#2F54EB]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M7 16v-3" strokeWidth="2.5" />
          <path d="M11 16V8" strokeWidth="2.5" />
          <path d="M15 16v-5" strokeWidth="2.5" />
        </svg>
      ),
      graphic: (
        <div className="w-full bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_4px_20px_rgba(59,130,246,0.06)] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#3B66FF] text-white text-[11px] sm:text-[12px] font-semibold tracking-tight shadow-sm">
              {c0?.tag1 || "Project Name"}
            </span>
            <span className="inline-flex items-center px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white border border-slate-200/90 text-slate-800 text-[11px] sm:text-[12px] font-semibold tracking-tight shadow-xs">
              KR Tasker Digital
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#3B66FF] text-white text-[11px] sm:text-[12px] font-semibold tracking-tight shadow-sm">
              {c0?.tag2 || "Date Issued"}
            </span>
            <span className="inline-flex items-center px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white border border-slate-200/90 text-slate-800 text-[11px] sm:text-[12px] font-semibold tracking-tight shadow-xs">
              Oct, 06, 2025
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#3B66FF] text-white text-[11px] sm:text-[12px] font-semibold tracking-tight shadow-sm">
              {c0?.tag3 || "Prepared By"}
            </span>
            <span className="inline-flex items-center px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white border border-slate-200/90 text-slate-800 text-[11px] sm:text-[12px] font-semibold tracking-tight shadow-xs">
              Alex Zuckerberg
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "financial-tables",
      titlePrefix: c1?.titlePrefix || "Financial",
      titleSuffix: c1?.titleSuffix || "Tables",
      description: c1?.desc || "Deliver balance sheets, cash flows, and audited calculations where cell contents cannot be altered.",
      centerIcon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#2F54EB]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M3 9h18" strokeWidth="2" />
          <path d="M3 15h18" strokeWidth="2" />
          <path d="M9 3v18" strokeWidth="2" />
          <path d="M15 3v18" strokeWidth="2" />
        </svg>
      ),
      graphic: (
        <div className="w-full bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(59,130,246,0.06)] flex flex-col justify-between min-h-[142px]">
          <div className="flex items-center justify-between px-3 py-1.5 rounded-full border border-slate-200/90 bg-slate-50/50">
            <span className="inline-flex items-center px-4 py-1 rounded-full bg-[#3B66FF] text-white text-[12px] font-semibold tracking-tight shadow-sm">
              {c1?.tag1 || "Category"}
            </span>
            <span className="text-slate-800 text-[13px] font-bold pr-2 tracking-tight">
              {c1?.tag2 || "Budgeted Amount"}
            </span>
          </div>

          <div className="w-full h-[2px] bg-[#3B66FF] rounded-full my-2 opacity-90" />

          <div className="space-y-1.5 px-2">
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-semibold text-slate-800">{c1?.row1 || "Housing"}</span>
              <span className="font-bold text-slate-900">$50,0000</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-semibold text-slate-800">{c1?.row2 || "Rent of car"}</span>
              <span className="font-bold text-slate-900">$35000</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "embedded-charts",
      titlePrefix: c2?.titlePrefix || "Print & Social",
      titleSuffix: c2?.titleSuffix || "Ready",
      description: c2?.desc || "Generate crystal-clear 300 DPI images suitable for brochures, marketing materials, and displays.",
      centerIcon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#2F54EB]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v9h9" strokeWidth="2" />
        </svg>
      ),
      graphic: (
        <div className="w-full bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(59,130,246,0.06)] flex items-center justify-between gap-4 min-h-[142px]">
          <div className="relative w-24 h-24 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
              <path d="M 50 50 L 50 2 A 48 48 0 1 0 98 50 Z" fill="#3B66FF" />
              <path d="M 50 50 L 98 50 A 48 48 0 0 0 50 2 Z" fill="#0F172A" />
              <text x="35" y="42" fill="#FFFFFF" fontSize="11" fontWeight="800" fontFamily="system-ui, sans-serif" textAnchor="middle">
                75%
              </text>
              <text x="68" y="38" fill="#FFFFFF" fontSize="10" fontWeight="800" fontFamily="system-ui, sans-serif" textAnchor="middle">
                25%
              </text>
            </svg>
          </div>

          <div className="space-y-2 text-[12px] leading-snug">
            <div className="flex items-start gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B66FF] mt-1.5 shrink-0" />
              <span className="text-[#3B66FF] font-medium">{c2?.row1 || "Ultra HD"} (300 DPI)</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-1.5 shrink-0" />
              <span className="text-slate-800 font-medium">{c2?.row2 || "Vector Crisp"}</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-tight">
            Share <span className="text-[#3B66FF]">Excel Data</span> Without Sending<br className="hidden sm:inline" /> a Spreadsheet
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-normal">
            Prevent accidental formula tampering and simplify reading for stakeholders on any platform.
          </p>
        </div>

        {/* 3 Highlight Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 lg:gap-8">
          {cards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.12 }}
              className="relative rounded-[28px] p-6 sm:p-7 bg-white border border-slate-200/80 neon-border-glow shadow-[0_10px_30px_-5px_rgba(59,130,246,0.07),0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_-8px_rgba(59,130,246,0.18)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center"
            >
              {/* Top Graphic Card Mockup */}
              <div className="w-full">
                {card.graphic}
              </div>

              {/* Floating Center Circle Icon Badge */}
              <div className="w-14 h-14 rounded-full bg-white shadow-[0_6px_24px_rgba(59,130,246,0.18)] border border-blue-200/90 flex items-center justify-center -mt-7 mb-4 relative z-10 mx-auto">
                {card.centerIcon}
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-[22px] font-bold text-center mb-2.5 tracking-tight">
                <span className="text-[#3B66FF]">{card.titlePrefix}</span>{" "}
                <span className="text-slate-900">{card.titleSuffix}</span>
              </h3>

              {/* Description */}
              <p className="text-[13px] sm:text-sm text-slate-600 leading-relaxed text-center max-w-[280px]">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
