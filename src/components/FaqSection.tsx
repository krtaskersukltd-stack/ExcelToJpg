"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export default function FaqSection() {
  const faqs: FaqItem[] = [
    {
      id: "faq-1",
      question: "What is an Excel to JPG converter?",
      answer:
        "An Excel to JPG converter is a tool or feature that turns a Microsoft Excel spreadsheet (.xls or .xlsx) into a high-quality JPEG image",
    },
    {
      id: "faq-2",
      question: "How do I convert Excel to JPG?",
      answer:
        "Simply upload your spreadsheet into our dropzone above, select your desired DPI rendering quality, and click download. Your high-resolution JPG will be generated and saved in seconds.",
    },
    {
      id: "faq-3",
      question: "Can XLSX files be converted to JPG?",
      answer:
        "Yes, our converter provides complete support for modern .xlsx workbooks, legacy .xls sheets, .csv data tables, and macro-enabled .xlsm workbooks.",
    },
    {
      id: "faq-4",
      question: "Can individual spreadsheet sheets be converted?",
      answer:
        "Yes! You can preview individual sheets, select specific tabs to export as standalone JPG images, or grab all sheets bundled into an organized ZIP archive.",
    },
    {
      id: "faq-5",
      question: "What is the difference between JPG and PNG for spreadsheets?",
      answer:
        "JPG is ideal for standard presentations, documents, Slack messages, and email reports with compact file sizes. PNG provides lossless rasterization with support for transparent background areas.",
    },
  ];

  // Default first item open matching the Figma design screenshot
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 sm:py-24 bg-[#FAFBFD] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-2.5 mb-14 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#0F172A] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-normal">
            Everything you need to know about Excel to JPG conversion.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <motion.div
                key={faq.id}
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
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer select-none group"
                >
                  <div className="flex-1 pr-2">
                    <span className="text-base sm:text-[19px] font-bold text-[#0F172A] tracking-tight block leading-snug">
                      {faq.question}
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
                            {faq.answer}
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
                      /* Active Down-Left Arrow (White) */
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
                      /* Inactive Up-Right Arrow (Blue) */
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
