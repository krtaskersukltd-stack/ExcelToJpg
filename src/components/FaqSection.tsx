"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Minus, Check, HelpCircle } from "lucide-react";

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
        "An Excel to JPG converter is a tool or feature that turns a Microsoft Excel spreadsheet (.xls or .xlsx) into a high-quality JPEG image.",
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
    <section id="faq" className="py-20 bg-[#FAFBFD] relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Everything you need to know about Excel to JPG conversion.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-white border-2 border-blue-500 shadow-md shadow-blue-500/10"
                    : "bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs"
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4"
                >
                  <span className={`text-base sm:text-lg font-bold transition-colors ${isOpen ? "text-slate-900" : "text-slate-800"}`}>
                    {faq.question}
                  </span>

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600 border border-blue-200/60"
                    }`}
                  >
                    {isOpen ? (
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 sm:px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
