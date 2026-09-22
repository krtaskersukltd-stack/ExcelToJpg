"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUp, FileSpreadsheet, Sparkles, Upload } from "lucide-react";

export default function CtaBanner({ onScrollToUpload }: { onScrollToUpload?: () => void }) {
  const handleClick = () => {
    if (onScrollToUpload) {
      onScrollToUpload();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 bg-[#2563EB] text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-900/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Ready to Convert Your Excel File?
          </h2>
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto font-normal">
            Upload your spreadsheet and turn it into a crisp, high-resolution JPG image in a matter of seconds.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="pt-2"
        >
          <button
            onClick={handleClick}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-blue-700 hover:text-blue-800 font-bold text-base shadow-2xl hover:bg-slate-50 hover:shadow-blue-900/30 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Upload className="w-5 h-5 text-blue-600" />
            <span>Convert Excel to JPG</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
