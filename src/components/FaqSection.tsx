"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useOutputFormat } from "@/context/OutputFormatContext";

export default function FaqSection() {
  const { t } = useLanguage();
  const { withFormat } = useOutputFormat();
  const [openId, setOpenId] = useState<string | null>("faq-0");

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="relative bg-[#FFFFFF] overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[870px] px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="mb-7 text-center sm:mb-8">
          <h2 className="text-[32px] font-bold leading-tight tracking-[-0.035em] text-[#151515] sm:text-[40px]">
            {t.faq.title}
          </h2>
          <p className="mt-2.5 text-[15px] font-normal leading-6 text-[#242424] sm:text-[16px]">
            {withFormat("Everything you need to know about Excel to JPG conversion.")}
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-1.5">
          {t.faq.items.map((faq, idx) => {
            const faqId = `faq-${idx}`;
            const isOpen = openId === faqId;

            return (
              <motion.div
                key={faqId}
                initial={false}
                animate={{
                  backgroundColor: isOpen ? "#F7F8FC" : "rgba(255, 255, 255, 0)",
                }}
                className={`rounded-[17px] transition-all duration-300 ${
                  isOpen
                    ? "border-[2px] border-[#9688FF] bg-[#F7F8FC] shadow-[0_12px_22px_rgba(74,41,255,0.18)]"
                    : "hover:bg-white/70"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faqId)}
                  aria-expanded={isOpen}
                  aria-controls={`${faqId}-answer`}
                  className={`group flex w-full cursor-pointer select-none items-start justify-between gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A29FF] ${
                    isOpen ? "p-3 sm:px-3 sm:py-4" : "px-3 py-2.5 sm:py-2"
                  }`}
                >
                  <div className={`min-w-0 flex-1 pr-2 ${isOpen ? "sm:pt-0.5" : "sm:pt-1.5"}`}>
                    <span className="block text-[19px] font-medium leading-snug tracking-[-0.025em] text-[#171B54] sm:text-[24px]">
                      {withFormat(faq.q)}
                    </span>

                    {/* Expanded Answer Content */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`${faqId}-answer`}
                          key="content"
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-[680px] text-[14px] font-normal leading-6 text-[#171717] sm:text-[16px] sm:leading-7">
                            {withFormat(faq.a)}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Circular Arrow Button */}
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 sm:size-11 ${
                      isOpen
                        ? "bg-[#4A29FF] shadow-[0_8px_17px_rgba(74,41,255,0.35)]"
                        : "border border-[#E8E6FF] bg-white shadow-[0_8px_16px_rgba(74,41,255,0.20)] group-hover:scale-105 group-hover:shadow-[0_9px_19px_rgba(74,41,255,0.28)]"
                    }`}
                  >
                    {isOpen ? (
                      <svg
                        viewBox="0 0 24 24"
                        className="size-5 text-white"
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
                        className="size-5 text-[#4A29FF]"
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
