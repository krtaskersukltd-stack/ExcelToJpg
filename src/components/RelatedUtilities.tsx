"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface UtilityCard {
  badge: string;
  badgeBg: string;
  title: string;
  description: string;
  href: string;
}

export default function RelatedUtilities({ onSelectTool }: { onSelectTool?: (name: string) => void }) {
  const utilities: UtilityCard[] = [
    {
      badge: "PNG",
      badgeBg: "bg-blue-600",
      title: "Excel to PNG",
      description: "Lossless transparent output",
      href: "#",
    },
    {
      badge: "PDF",
      badgeBg: "bg-blue-700",
      title: "Excel to PDF",
      description: "Print-ready vectorized sheets",
      href: "#",
    },
    {
      badge: "OCR",
      badgeBg: "bg-slate-900",
      title: "JPG to Excel",
      description: "Extract table data via OCR",
      href: "#",
    },
    {
      badge: "XLS",
      badgeBg: "bg-indigo-600",
      title: "PNG to Excel",
      description: "Turn screenshots back to tables",
      href: "#",
    },
    {
      badge: "CON",
      badgeBg: "bg-blue-800",
      title: "PDF to Excel",
      description: "Reconstruct PDF tables to XLSX",
      href: "#",
    },
    {
      badge: "CSV",
      badgeBg: "bg-sky-600",
      title: "CSV to Excel",
      description: "Format comma separated datasets",
      href: "#",
    },
  ];

  return (
    <section id="related-tools" className="py-20 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Related Conversion <span className="text-blue-600">Utilities</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Complementary file transforms for accounting teams, developers, and analysts.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {utilities.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              onClick={() => onSelectTool && onSelectTool(item.title)}
              className="cursor-pointer group rounded-2xl p-5 bg-[#F9FBFE] hover:bg-[#F0F6FE] border border-slate-200/70 neon-border-glow shadow-xs hover:shadow-md hover:shadow-blue-500/15 transition-all duration-200 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Badge Icon */}
                <div
                  className={`w-11 h-11 rounded-xl ${item.badgeBg} text-white flex items-center justify-center font-extrabold text-xs tracking-wider shrink-0 shadow-sm group-hover:scale-105 transition-transform`}
                >
                  {item.badge}
                </div>

                {/* Details */}
                <div className="truncate">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Arrow button */}
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200/80 text-slate-400 group-hover:text-blue-600 group-hover:border-blue-300 flex items-center justify-center shrink-0 transition-colors">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
