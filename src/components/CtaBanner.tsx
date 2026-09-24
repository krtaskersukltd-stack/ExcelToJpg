"use client";

import React from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function CtaBanner({ onScrollToUpload }: { onScrollToUpload?: () => void }) {
  const { t } = useLanguage();

  const handleClick = () => {
    if (onScrollToUpload) {
      onScrollToUpload();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 bg-[#355BFF] text-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {t.cta.title}
          </h2>
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto font-normal">
            {t.cta.subtitle}
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
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-blue-700 hover:text-blue-800 font-bold text-base shadow-2xl hover:bg-slate-50 hover:shadow-blue-900/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Upload className="w-5 h-5 text-blue-600" />
            <span>{t.cta.button}</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
