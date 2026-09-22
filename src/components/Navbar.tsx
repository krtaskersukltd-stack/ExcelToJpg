"use client";

import React, { useState, useEffect } from "react";
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
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const toolsList = [
  { name: "Excel to JPG", desc: "High-DPI raster image export", icon: ImageIcon, isCurrent: true, href: "#" },
  { name: "Excel to PNG", desc: "Lossless transparent output", icon: Layers, href: "#related-tools" },
  { name: "Excel to PDF", desc: "Print-ready vectorized sheets", icon: FileText, href: "#related-tools" },
  { name: "JPG to Excel", desc: "Extract table data via OCR", icon: FileSpreadsheet, href: "#related-tools" },
  { name: "PNG to Excel", desc: "Turn screenshots back to tables", icon: FileSpreadsheet, href: "#related-tools" },
  { name: "PDF to Excel", desc: "Reconstruct PDF tables to XLSX", icon: FileSpreadsheet, href: "#related-tools" },
  { name: "CSV to Excel", desc: "Format comma separated datasets", icon: FileSpreadsheet, href: "#related-tools" },
  { name: "Excel Formula Generator", desc: "AI-assisted spreadsheet formulas", icon: Sparkles, href: "#products", highlight: true },
];

export default function Navbar({ onOpenUploadModal }: { onOpenUploadModal?: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("EN");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`top-0 left-0 right-0 z-50 transition-all duration-300 py-4 sm:py-5`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
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
        <nav className="hidden lg:flex items-center gap-1 p-4 backdrop-blur-xl rounded-full border">
          {/* Active Image To Text Button */}
          <Link 
            href="#tools"
            className="px-5 py-2 text-xs font-semibold rounded-full bg-[#355BFF] text-white shadow-xs hover:bg-blue-700 transition-all duration-150"
          >
            Image To Text
          </Link>
          
          <Link 
            href="#related-tools"
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50/70 rounded-full transition-colors"
          >
            PDF To Excel
          </Link>
          
          <Link 
            href="#related-tools"
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50/70 rounded-full transition-colors"
          >
            Excel To CSV
          </Link>

          {/* Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              onMouseEnter={() => setIsToolsOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-900 hover:text-blue-600 hover:bg-slate-50/70 rounded-full transition-colors"
            >
              {/* 4-square Grid Icon */}
              <svg className="w-3.5 h-3.5 text-slate-900 fill-current" viewBox="0 0 16 16">
                <rect x="1" y="1" width="6" height="6" rx="1.5" />
                <rect x="9" y="1" width="6" height="6" rx="1.5" />
                <rect x="1" y="9" width="6" height="6" rx="1.5" />
                <rect x="9" y="9" width="6" height="6" rx="1.5" />
              </svg>
              <span>Tools</span>
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
                    Conversion Suite
                  </div>
                  <div className="space-y-1">
                    {toolsList.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsToolsOpen(false)}
                        className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                          item.highlight 
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/60" 
                            : item.isCurrent 
                            ? "bg-blue-50/50 text-blue-700" 
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className={`p-2 rounded-lg mt-0.5 ${
                          item.highlight ? "bg-blue-600 text-white" : item.isCurrent ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                        }`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-900">{item.name}</span>
                            {item.highlight && (
                              <span className="text-[10px] text-white font-bold px-1.5 py-0.2 rounded-full">AI</span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right Section: Actions Pill & Language Selector (Desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          
          {/* Right Floating Pill: Pricing + Login */}
          <div className="flex items-center gap-1.5 p-4 bg-white/85 backdrop-blur-xl rounded-full neon-border-glow shadow-[0_4px_24px_rgba(59,130,246,0.12)]">
            {/* Pricing with Diamond / Crystal Icon */}
            <Link 
              href="#pricing" 
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-800 hover:text-blue-600 hover:bg-slate-50/70 rounded-full transition-colors"
            >
              <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3h12l4 6-10 12L2 9z" />
                <path d="M11 3 8 9l4 12 4-12-3-6" />
                <path d="M2 9h20" />
              </svg>
              <span>Pricing</span>
            </Link>

            {/* Login Pill Button */}
            <button 
              onClick={onOpenUploadModal}
              className="px-6 py-2 bg-[#355BFF] hover:bg-blue-700 text-white text-xs font-semibold rounded-full shadow-xs hover:shadow-md hover:shadow-blue-500/20 transition-all active:scale-95"
            >
              Login
            </button>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-800 hover:text-blue-600 px-2 py-1.5 rounded-lg hover:bg-slate-100/70 transition-colors"
            >
              <span>{selectedLang}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute right-0 mt-1 w-28 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50"
                >
                  {["EN", "ES", "FR", "DE", "JA", "ZH"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLang(lang);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors ${
                        selectedLang === lang ? "text-blue-600 bg-blue-50 font-semibold" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {lang} {lang === "EN" && "(English)"}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <button 
            onClick={onOpenUploadModal}
            className="px-4 py-1.5 bg-[#355BFF] text-white text-xs font-semibold rounded-full shadow-xs"
          >
            Login
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100"
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
              <Link 
                href="#tools" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-[#355BFF] rounded-xl text-center"
              >
                Image To Text
              </Link>
              <Link 
                href="#related-tools" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                PDF To Excel
              </Link>
              <Link 
                href="#related-tools" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Excel To CSV
              </Link>
              <Link 
                href="#pricing" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 3h12l4 6-10 12L2 9z" />
                  <path d="M11 3 8 9l4 12 4-12-3-6" />
                  <path d="M2 9h20" />
                </svg>
                <span>Pricing</span>
              </Link>
              <div className="border-t border-slate-100 my-2 pt-2">
                <div className="text-[11px] font-semibold text-slate-400 px-3 py-1">ALL TOOLS</div>
                {toolsList.map((tool) => (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 rounded-lg"
                  >
                    <tool.icon className="w-4 h-4 text-blue-600" />
                    <span>{tool.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
