"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  Menu,
  X,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { ConverterToolId, NAV_TOOL_IDS } from "@/lib/converter-tools";

const toolIcons = [
  ImageIcon,
  Layers,
  FileText,
  FileSpreadsheet,
  FileSpreadsheet,
  FileSpreadsheet,
  FileSpreadsheet,
  Sparkles,
];

export default function Navbar({ onOpenUploadModal, onSelectTool }: { onOpenUploadModal?: () => void; onSelectTool?: (tool: ConverterToolId) => void }) {
  const { language, setLanguage, t, languages } = useLanguage();
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-50 top-0 left-0 right-0 transition-all duration-300 py-4 sm:py-5">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Brand Logo matching user's /logo.png */}
        <Link href="/" className="group inline-flex items-center">
          <div className="relative h-24 sm:h-14 w-auto flex items-center transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="Excel To JPG"
              width={176}
              height={217}
              priority
              className="h-24 sm:h-18 w-auto object-contain drop-shadow-xs"
            />
          </div>
        </Link>

        {/* Center Floating Pill Navigation Bar (Desktop) */}
        <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 p-4 bg-white/85 backdrop-blur-xl rounded-full border border-slate-200/80 neon-border-glow shadow-xs hover:shadow-[0_4px_24px_rgba(59,130,246,0.18)] transition-all">
          {/* Active Image To Text Button */}
          <button
            onClick={() => onSelectTool?.("excel-jpg")}
            className="px-5 py-2 text-xs font-semibold rounded-full bg-[#355BFF] text-white shadow-xs hover:bg-blue-700 transition-all duration-150"
          >
            {t.nav.excelToJpg}
          </button>

          <button
            onClick={() => onSelectTool?.("excel-png")}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50/70 rounded-full transition-colors"
          >
            {t.nav.excelToPng}
          </button>

          <button
            onClick={() => onSelectTool?.("excel-csv")}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50/70 rounded-full transition-colors"
          >
            {t.nav.excelToCsv}
          </button>

          {/* Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              onMouseEnter={() => setIsToolsOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-900 hover:text-blue-600 hover:bg-slate-50/70 rounded-full transition-colors cursor-pointer"
            >
              {/* 4-square Grid Icon */}
              <svg className="w-3.5 h-3.5 text-slate-900 fill-current" viewBox="0 0 16 16">
                <rect x="1" y="1" width="6" height="6" rx="1.5" />
                <rect x="9" y="1" width="6" height="6" rx="1.5" />
                <rect x="1" y="9" width="6" height="6" rx="1.5" />
                <rect x="9" y="9" width="6" height="6" rx="1.5" />
              </svg>
              <span>{t.nav.tools}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isToolsOpen ? "rotate-180 text-blue-600" : "text-slate-500"}`} />
            </button>

            <AnimatePresence>
              {isToolsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  onMouseLeave={() => setIsToolsOpen(false)}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2.5 z-50 overflow-hidden"
                >
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-1.5">
                    {t.nav.conversionSuite}
                  </div>
                  <div className="space-y-1">
                    {t.nav.toolsList.map((item, idx) => {
                      const Icon = toolIcons[idx] || ImageIcon;
                      const isHighlight = idx === t.nav.toolsList.length - 1;
                      const isCurrent = idx === 0;
                      return (
                        <button
                          key={item.name}
                          onClick={() => { setIsToolsOpen(false); onSelectTool?.(NAV_TOOL_IDS[idx]); }}
                          className={`flex w-full items-start gap-3 p-2.5 text-left rounded-xl transition-all ${
                            isHighlight
                              ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/60"
                              : isCurrent
                              ? "bg-blue-50/50 text-blue-700"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg mt-0.5 ${
                              isHighlight ? "bg-blue-600 text-white" : isCurrent ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-slate-900">{item.name}</span>
                              {isHighlight && (
                                <span className="text-[10px] text-white bg-blue-600 font-bold px-1.5 py-0.2 rounded-full">AI</span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">{item.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right Section: Actions Pill & Language Selector (Desktop) */}
        <div className="hidden lg:flex items-stretch gap-3 ml-auto">

          {/* Right Floating Pill: Pricing + Login */}
          <div className="flex items-center gap-1.5 p-4 bg-white/85 backdrop-blur-xl rounded-full border border-slate-200/80 neon-border-glow shadow-xs hover:shadow-[0_4px_24px_rgba(59,130,246,0.18)] transition-all">
            {/* Pricing with Diamond / Crystal Icon */}
            <Link 
              href="/pricing" 
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-800 hover:text-blue-600 hover:bg-slate-50/70 rounded-full transition-colors"
            >
              <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3h12l4 6-10 12L2 9z" />
                <path d="M11 3 8 9l4 12 4-12-3-6" />
                <path d="M2 9h20" />
              </svg>
              <span>{t.nav.pricing}</span>
            </Link>

            {/* Login Pill Button */}
            <button
              onClick={onOpenUploadModal}
              className="px-6 py-2 bg-[#355BFF] hover:bg-blue-700 text-white text-xs font-semibold rounded-full shadow-xs hover:shadow-md hover:shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
            >
              {t.nav.login}
            </button>
          </div>

          {/* Language Selector */}
          <div className="relative flex">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex h-[66px] items-center gap-1.5 text-xs font-semibold text-slate-800 hover:text-blue-600 px-4 rounded-full border border-slate-200/80 bg-white/90 hover:bg-white transition-all shadow-xs cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{language}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 overflow-hidden"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                        language === lang.code ? "text-blue-600 bg-blue-50/80 font-bold" : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{lang.nativeLabel}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({lang.code})</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Mobile Language Button */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="p-1.5 px-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-full flex items-center gap-1"
            >
              <span>{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>
            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium ${
                        language === lang.code ? "text-blue-600 bg-blue-50 font-bold" : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {lang.nativeLabel}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={onOpenUploadModal}
            className="px-4 py-1.5 bg-[#355BFF] text-white text-xs font-semibold rounded-full shadow-xs cursor-pointer"
          >
            {t.nav.login}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 shadow-xl"
          >
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => { setIsMobileMenuOpen(false); onSelectTool?.("excel-jpg"); }}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-[#355BFF] rounded-xl text-center"
              >
                {t.nav.excelToJpg}
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); onSelectTool?.("excel-png"); }}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                {t.nav.excelToPng}
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); onSelectTool?.("excel-csv"); }}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                {t.nav.excelToCsv}
              </button>
              <Link
                href="/pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 3h12l4 6-10 12L2 9z" />
                  <path d="M11 3 8 9l4 12 4-12-3-6" />
                  <path d="M2 9h20" />
                </svg>
                <span>{t.nav.pricing}</span>
              </Link>
              <div className="border-t border-slate-100 my-2 pt-2">
                <div className="text-[11px] font-semibold text-slate-400 px-3 py-1">{t.nav.allTools}</div>
                {t.nav.toolsList.map((tool, idx) => {
                  const Icon = toolIcons[idx] || ImageIcon;
                  return (
                    <button
                      key={tool.name}
                      onClick={() => { setIsMobileMenuOpen(false); onSelectTool?.(NAV_TOOL_IDS[idx]); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50 rounded-lg"
                    >
                      <Icon className="w-4 h-4 text-blue-600" />
                      <span>{tool.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
