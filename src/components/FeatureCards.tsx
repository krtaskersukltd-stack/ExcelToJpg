"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function FeatureCards() {
  const { t } = useLanguage();

  const c0 = t.features?.cards?.[0];
  const c1 = t.features?.cards?.[1];
  const c2 = t.features?.cards?.[2];

  const cards = [
    {
      id: "executive-reports",
      titlePrefix: c0?.titlePrefix || "Executive",
      titleSuffix: c0?.titleSuffix || "Reports",
      description:
        c0?.desc ||
        "Paste high-level financial snapshots and KPI summaries straight into PowerPoint presentations or email newsletters.",
      centerIcon: (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 text-[#355BFF]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M7 16v-3" strokeWidth="2.2" />
          <path d="M11 16V8" strokeWidth="2.2" />
          <path d="M15 16v-5" strokeWidth="2.2" />
        </svg>
      ),
      graphic: (
        <div className="w-full bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_4px_20px_rgba(59,130,246,0.06)] flex flex-col justify-center gap-2.5 h-[160px]">
          <div className="flex items-center justify-between p-1 pl-1 pr-4 rounded-full bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <span className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-[#355BFF] text-white text-[11px] sm:text-[12px] font-semibold tracking-tight shadow-xs">
              {c0?.tag1 || "Project Name"}
            </span>
            <span className="text-slate-800 text-[12px] sm:text-[13px] font-bold tracking-tight">
              KR Tasker Digital
            </span>
          </div>
          <div className="flex items-center justify-between p-1 pl-1 pr-4 rounded-full bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <span className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-[#355BFF] text-white text-[11px] sm:text-[12px] font-semibold tracking-tight shadow-xs">
              {c0?.tag2 || "Date Issued"}
            </span>
            <span className="text-slate-800 text-[12px] sm:text-[13px] font-bold tracking-tight">
              Oct, 06, 2025
            </span>
          </div>
          <div className="flex items-center justify-between p-1 pl-1 pr-4 rounded-full bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <span className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-[#355BFF] text-white text-[11px] sm:text-[12px] font-semibold tracking-tight shadow-xs">
              {c0?.tag3 || "Prepared By"}
            </span>
            <span className="text-slate-800 text-[12px] sm:text-[13px] font-bold tracking-tight">
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
      description:
        c1?.desc ||
        "Deliver balance sheets, cash flows, and audited calculations where viewers cannot distort or alter cell contents.",
      centerIcon: (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 text-[#355BFF]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M3 9h18" strokeWidth="2" />
          <path d="M3 15h18" strokeWidth="2" />
          <path d="M9 3v18" strokeWidth="2" />
          <path d="M15 3v18" strokeWidth="2" />
        </svg>
      ),
      graphic: (
        <div className="w-full bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_4px_20px_rgba(59,130,246,0.06)] flex flex-col justify-between h-[160px]">
          <div className="flex items-center justify-between p-1 pl-1 pr-4 rounded-full bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <span className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-[#355BFF] text-white text-[11px] sm:text-[12px] font-semibold tracking-tight shadow-xs">
              {c1?.tag1 || "Category"}
            </span>
            <span className="text-slate-800 text-[12px] sm:text-[13px] font-bold tracking-tight">
              {c1?.tag2 || "Budgeted Amount"}
            </span>
          </div>

          <div className="w-full h-[2px] bg-[#355BFF] rounded-full my-2.5 opacity-90" />

          <div className="space-y-1.5 px-3 pb-1">
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-bold text-slate-800">{c1?.row1 || "Housing"}</span>
              <span className="font-bold text-slate-900">$50,0000</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-bold text-slate-800">{c1?.row2 || "Rent of car"}</span>
              <span className="font-bold text-slate-900">$35000</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "embedded-charts",
      titlePrefix: c2?.titlePrefix || "Embedded",
      titleSuffix: c2?.titleSuffix || "Charts",
      description:
        c2?.desc ||
        "Export charts, pie graphs, and trends created in Excel without having to crop screenshots manually.",
      centerIcon: (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 text-[#355BFF]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18" strokeWidth="2" />
          <path d="M12 12h9" strokeWidth="2" />
        </svg>
      ),
      graphic: (
        <div className="w-full bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_4px_20px_rgba(59,130,246,0.06)] flex items-center justify-between gap-3 h-[160px]">
          {/* 75% / 25% Pie Chart with crisp white dividing gap matching Figma */}
          <div className="relative w-[92px] h-[92px] shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs">
              {/* 75% Royal Blue Slice */}
              <path
                d="M 50 50 L 96 50 A 46 46 0 1 0 50 96 Z"
                fill="#355BFF"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* 25% Dark Navy Slice (Bottom-Right Quadrant from 0° to 90°) */}
              <path
                d="M 50 50 L 96 50 A 46 46 0 0 1 50 96 Z"
                fill="#111827"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* 75% label in top-left region */}
              <text
                x="36"
                y="44"
                fill="#FFFFFF"
                fontSize="11"
                fontWeight="700"
                fontFamily="system-ui, sans-serif"
                textAnchor="middle"
              >
                75%
              </text>
              {/* 25% label in bottom-right quadrant */}
              <text
                x="69"
                y="73"
                fill="#FFFFFF"
                fontSize="10"
                fontWeight="700"
                fontFamily="system-ui, sans-serif"
                textAnchor="middle"
              >
                25%
              </text>
            </svg>
          </div>

          {/* Bulleted Insights List */}
          <div className="flex-1 space-y-2 text-[11px] leading-[1.3] pl-1">
            <div className="flex items-start gap-1.5">
              <span className="text-[#355BFF] font-bold select-none text-[13px] leading-none mt-0.5 shrink-0">•</span>
              <span className="text-[#355BFF] font-semibold">{c2?.row1 || "Expenses are under the firm"}</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-slate-800 font-bold select-none text-[13px] leading-none mt-0.5 shrink-0">•</span>
              <span className="text-slate-800 font-semibold">{c2?.row2 || "External effects slow down the growth"}</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center space-y-3 mb-14 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0F172A] tracking-[-0.03em] leading-[1.2]">
            Share <span className="text-[#355BFF]">Excel Data</span> Without Sending
            <br className="hidden sm:inline" /> a Spreadsheet
          </h2>
          <p className="text-sm sm:text-base text-[#475467] max-w-xl mx-auto font-normal leading-relaxed text-center mt-3">
            Prevent accidental formula tampering and simplify reading
            <br className="hidden sm:inline" /> for stakeholders on any platform.
          </p>
        </div>

        {/* 3 Highlight Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
          {cards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.12 }}
              className="relative rounded-[32px] p-6 sm:p-7 bg-[#F7F8FC] border border-[#DCE4FE] neon-border-glow shadow-[0_12px_36px_-6px_rgba(53,91,255,0.10),0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_-8px_rgba(53,91,255,0.20)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center"
            >
              {/* Top Graphic Card Mockup */}
              <div className="w-full">{card.graphic}</div>

              {/* Floating Center Circle Icon Badge */}
              <div className="w-14 h-14 rounded-full bg-[#F7F8FC] shadow-[0_8px_24px_rgba(53,91,255,0.18)] border-2 border-[#DCE4FE] flex items-center justify-center -mt-7 mb-4 relative z-10 mx-auto">
                {card.centerIcon}
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-[22px] font-bold text-center mb-2.5 tracking-tight">
                <span className="text-[#355BFF]">{card.titlePrefix}</span>{" "}
                <span className="text-[#0F172A]">{card.titleSuffix}</span>
              </h3>

              {/* Description with precise Figma line wrapping */}
              <p className="text-[13px] sm:text-[13.5px] text-[#475467] leading-[1.55] text-center max-w-[285px] mx-auto">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
