"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function FaqSection() {
  const { t } = useLanguage();
  const [openId, setOpenId] = useState<string | null>("faq-0");

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 sm:py-24 bg-[#FAFBFD] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-2.5 mb-14 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#0F172A] tracking-tight">
            {t.faq.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-normal">
            {t.faq.subtitle}
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3 sm:space-y-4">
          {t.faq.items.map((faq, idx) => {
            const faqId = `faq-${idx}`;
            const isOpen = openId === faqId;

            return (
              <motion.div
                key={faqId}
                initial={false}
                animate={{
                  backgroundColor: isOpen ? "#FFFFFF" : "rgba(255, 255, 255, 0)",
                }}
                className={`rounded-[20px] sm:rounded-2xl transition-all duration-300 ${
                  isOpen
                    ? "bg-white shadow-[0_12px_36px_rgba(59,130,246,0.18),0_2px_8px_rgba(0,0,0,0.02)] border border-indigo-100/90"
                    : "hover:bg-white/60"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faqId)}
                  className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer select-none group"
                >
                  <div className="flex-1 pr-2">
                    <span className="text-base sm:text-[19px] font-bold text-[#0F172A] tracking-tight block leading-snug">
                      {faq.q}
                    </span>

                    {/* Expanded Answer Content */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed max-w-2xl font-normal">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Circular Arrow Button */}
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? "bg-[#3B66FF] shadow-lg shadow-blue-500/35"
                        : "bg-white shadow-[0_4px_16px_rgba(59,130,246,0.22)] border border-blue-100 group-hover:scale-105 group-hover:shadow-[0_6px_20px_rgba(59,130,246,0.3)]"
                    }`}
                  >
                    {isOpen ? (
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 7L7 17" />
                        <path d="M17 17H7V7" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-[#3B66FF]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17L17 7" />
                        <path d="M7 7H17V17" />
                      </svg>
                    )}
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
