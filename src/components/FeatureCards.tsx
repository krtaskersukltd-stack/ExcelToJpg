"use client";

import React from "react";
import { motion } from "framer-motion";

export default function FeatureCards() {
  const cards = [
    {
      id: "executive-reports",
      titlePrefix: "Executive",
      titleSuffix: "Reports",
      description:
        "Paste high-level financial snapshots and KPI summaries straight into PowerPoint presentations or email newsletters.",
      centerIcon: (
        /* Analytics / Bar chart in squircle */
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#2F54EB]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M7 16v-3" strokeWidth="2.5" />
          <path d="M11 16V8" strokeWidth="2.5" />
          <path d="M15 16v-5" strokeWidth="2.5" />
        </svg>
      ),
      graphic: (
        <div className="w-full bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(59,130,246,0.06)] space-y-3">
          {/* Row 1 */}
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#3B66FF] text-white text-[12px] font-semibold tracking-tight shadow-sm">
              Project Name
            </span>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-slate-200/90 text-slate-800 text-[12px] font-semibold tracking-tight shadow-xs">
              KR Tasker Digital
            </span>
          </div>
          {/* Row 2 */}
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#3B66FF] text-white text-[12px] font-semibold tracking-tight shadow-sm">
              Date Issued
            </span>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-slate-200/90 text-slate-800 text-[12px] font-semibold tracking-tight shadow-xs">
              Oct, 06, 2025
            </span>
          </div>
          {/* Row 3 */}
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#3B66FF] text-white text-[12px] font-semibold tracking-tight shadow-sm">
              Prepared By
            </span>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-slate-200/90 text-slate-800 text-[12px] font-semibold tracking-tight shadow-xs">
              Alex Zuckerberg
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "financial-tables",
      titlePrefix: "Financial",
      titleSuffix: "Tables",
      description:
        "Deliver balance sheets, cash flows, and audited calculations where viewers cannot distort or alter cell contents.",
      centerIcon: (
        /* Table Grid Icon */
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
          {/* Header Bar Pill Container */}
          <div className="flex items-center justify-between px-3 py-1.5 rounded-full border border-slate-200/90 bg-slate-50/50">
            <span className="inline-flex items-center px-4 py-1 rounded-full bg-[#3B66FF] text-white text-[12px] font-semibold tracking-tight shadow-sm">
              Category
            </span>
            <span className="text-slate-800 text-[13px] font-bold pr-2 tracking-tight">
              Budgeted Amount
            </span>
          </div>

          {/* Blue Divider Bar */}
          <div className="w-full h-[2px] bg-[#3B66FF] rounded-full my-2 opacity-90" />

          {/* Rows */}
          <div className="space-y-1.5 px-2">
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-semibold text-slate-800">Housing</span>
              <span className="font-bold text-slate-900">$50,0000</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-semibold text-slate-800">Rent of car</span>
              <span className="font-bold text-slate-900">$35000</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "embedded-charts",
      titlePrefix: "Embedded",
      titleSuffix: "Charts",
      description:
        "Export charts, pie graphs, and trends created in Excel without having to crop screenshots manually.",
      centerIcon: (
        /* Pie Chart Icon */
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#2F54EB]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v9h9" strokeWidth="2" />
        </svg>
      ),
      graphic: (
        <div className="w-full bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(59,130,246,0.06)] flex items-center justify-between gap-4 min-h-[142px]">
          {/* Pie Chart SVG */}
          <div className="relative w-24 h-24 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
              {/* 75% Blue Slice */}
              <path
                d="M 50 50 L 50 2 A 48 48 0 1 0 98 50 Z"
                fill="#3B66FF"
              />
              {/* 25% Dark Navy Slice */}
              <path
                d="M 50 50 L 98 50 A 48 48 0 0 0 50 2 Z"
                fill="#0F172A"
              />
              {/* 75% Text */}
              <text
                x="35"
                y="42"
                fill="#FFFFFF"
                fontSize="11"
                fontWeight="800"
                fontFamily="system-ui, sans-serif"
                textAnchor="middle"
              >
                75%
              </text>
              {/* 25% Text */}
              <text
                x="68"
                y="38"
                fill="#FFFFFF"
                fontSize="10"
                fontWeight="800"
                fontFamily="system-ui, sans-serif"
                textAnchor="middle"
              >
                25%
              </text>
            </svg>
          </div>

          {/* Bullet Descriptions */}
          <div className="space-y-2 text-[12px] leading-snug">
            <div className="flex items-start gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B66FF] mt-1.5 shrink-0" />
              <span className="text-[#3B66FF] font-medium">Expenses are under the firm</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-1.5 shrink-0" />
              <span className="text-slate-800 font-medium">External effects slow down the growth</span>
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
              className="relative rounded-[28px] p-6 sm:p-7 bg-white neon-border-glow shadow-[0_10px_30px_-5px_rgba(59,130,246,0.07),0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_-8px_rgba(59,130,246,0.14)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center"
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
