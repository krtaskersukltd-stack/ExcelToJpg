"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, TableProperties, PieChart } from "lucide-react";

export default function FeatureCards() {
  const cards = [
    {
      id: "executive-reports",
      title: "Executive Reports",
      description:
        "Paste high-level financial snapshots and KPI summaries straight into PowerPoint presentations or email newsletters.",
      icon: FileText,
      graphic: (
        <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-xs space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/80 border border-blue-100/60">
            <span className="font-semibold text-blue-900">Project Name</span>
            <span className="font-mono text-slate-700 bg-white px-2 py-0.5 rounded shadow-xs">KR Tasker Digital</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/80 border border-blue-100/60">
            <span className="font-semibold text-blue-900">Date Issued</span>
            <span className="font-mono text-slate-700 bg-white px-2 py-0.5 rounded shadow-xs">Oct, 06, 2025</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/80 border border-blue-100/60">
            <span className="font-semibold text-blue-900">Prepared By</span>
            <span className="font-mono text-slate-700 bg-white px-2 py-0.5 rounded shadow-xs">Alex Zuckerberg</span>
          </div>
        </div>
      ),
    },
    {
      id: "financial-tables",
      title: "Financial Tables",
      description:
        "Deliver balance sheets, cash flows, and audited calculations where viewers cannot distort or alter cell contents.",
      icon: TableProperties,
      graphic: (
        <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-xs space-y-2 text-xs">
          <div className="grid grid-cols-2 bg-blue-600 text-white font-bold p-2 rounded-lg text-center">
            <span>Category</span>
            <span>Budgeted Amount</span>
          </div>
          <div className="grid grid-cols-2 p-2 bg-slate-50 rounded-lg text-center font-medium text-slate-700">
            <span>Housing</span>
            <span className="font-mono font-bold text-slate-900">$50,000</span>
          </div>
          <div className="grid grid-cols-2 p-2 bg-slate-50 rounded-lg text-center font-medium text-slate-700">
            <span>Rent of car</span>
            <span className="font-mono font-bold text-slate-900">$35,000</span>
          </div>
        </div>
      ),
    },
    {
      id: "embedded-charts",
      title: "Embedded Charts",
      description:
        "Export charts, pie graphs, and trends created in Excel without having to crop screenshots manually.",
      icon: PieChart,
      graphic: (
        <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-xs flex items-center justify-between gap-4 text-xs">
          {/* Donut Chart SVG */}
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              {/* Background ring */}
              <path
                className="text-blue-100 stroke-current"
                strokeWidth="5"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* 75% stroke */}
              <path
                className="text-blue-600 stroke-current"
                strokeDasharray="75, 100"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center font-bold text-slate-800">
              <span className="text-sm font-extrabold text-blue-600">75%</span>
              <span className="text-[8px] text-slate-400">25%</span>
            </div>
          </div>

          {/* Legend notes */}
          <div className="space-y-2 text-[11px] text-slate-600">
            <div className="flex items-start gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0"></div>
              <span>Expenses are under the firm</span>
            </div>
            <div className="flex items-start gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-200 mt-1 shrink-0"></div>
              <span>External effects slow down the growth</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Share <span className="text-blue-600">Excel Data</span> Without Sending a Spreadsheet
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Prevent accidental formula tampering and simplify reading for stakeholders on any platform.
          </p>
        </div>

        {/* 3 Highlight Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="rounded-3xl p-6 bg-[#F9FBFE] border border-blue-100/90 shadow-[0_4px_25px_-5px_rgba(37,99,235,0.04)] hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Card Graphic Mockup */}
              <div className="mb-6">{card.graphic}</div>

              <div>
                {/* Icon Badge */}
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 mb-4 group-hover:scale-105 transition-transform">
                  <card.icon className="w-6 h-6" />
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-slate-900 mb-2.5 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
