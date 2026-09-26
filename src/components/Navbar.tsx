"use client";

import React, { useEffect, useRef, useState } from "react";
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
import { ConverterToolId, NAV_TOOL_COLUMNS, TOOL_LABELS } from "@/lib/converter-tools";
import type { SiteOutputFormat } from "@/context/OutputFormatContext";

function getToolIcon(id: ConverterToolId) {
  if (id.includes("jpg") || id.includes("jpeg")) return ImageIcon;
  if (id.includes("png")) return Layers;
  if (id.includes("pdf") || id.includes("word") || id.includes("txt")) return FileText;
  if (id.includes("formula")) return Sparkles;
  return FileSpreadsheet;
}

export default function Navbar({
  onSelectTool,
  activeFormat = "jpg",
  activeTool = "excel-jpg",
}: {
  onSelectTool?: (tool: ConverterToolId) => void;
  activeFormat?: SiteOutputFormat;
  activeTool?: ConverterToolId;
}) {
  const { language, setLanguage, t, languages } = useLanguage();
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ full_name: string; auth_provider: string } | null>(null);

  const langRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/py/api/auth/me", { credentials: "include", signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => setCurrentUser(data?.user ?? null))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="relative z-50 top-0 left-0 right-0 transition-all duration-300 py-4 sm:py-5">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between lg:grid lg:grid-cols-3 lg:items-center lg:gap-4">

        {/* Left: Brand Logo */}
        <div className="flex items-center lg:justify-self-start">
          <Link href="/" className="group inline-flex items-center">
            <div className="relative h-14 sm:h-14 w-auto flex items-center transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Excel To JPG"
                width={176}
                height={217}
                priority
                className="h-12 sm:h-16 w-auto object-contain drop-shadow-xs"
              />
            </div>
          </Link>
        </div>

        {/* Center: Floating Pill Navigation (Desktop) */}
        <nav className="hidden lg:flex lg:justify-self-center items-center gap-0.5 p-1.5 bg-white/85 backdrop-blur-xl rounded-full border border-slate-200/80 neon-border-glow shadow-xs hover:shadow-[0_4px_24px_rgba(59,130,246,0.18)] transition-all">
          {(
            [
              { tool: "excel-jpg" as const, format: "jpg" as const, label: t.nav.excelToJpg },
              { tool: "excel-png" as const, format: "png" as const, label: t.nav.excelToPng },
              { tool: "excel-csv" as const, format: "csv" as const, label: t.nav.excelToCsv },
            ] as const
          ).map(({ tool, format, label }) => {
            const isActive = activeFormat === format;
            return (
              <button
                key={tool}
                onClick={() => onSelectTool?.(tool)}
                className={`whitespace-nowrap shrink-0 px-4 py-2 text-xs rounded-full transition-all duration-150 ${
                  isActive
                    ? "font-semibold bg-[#355BFF] text-white shadow-xs hover:bg-blue-700"
                    : "font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50/70"
                }`}
              >
                {label}
              </button>
            );
          })}

          {/* Tools Dropdown */}
          <div ref={toolsRef} className="relative shrink-0">
            <button
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              onMouseEnter={() => setIsToolsOpen(true)}
              className="flex items-center gap-1.5 whitespace-nowrap px-4 py-2 text-xs font-medium text-slate-900 hover:text-blue-600 hover:bg-slate-50/70 rounded-full transition-colors cursor-pointer"
            >
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
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-[760px] lg:w-[860px] max-w-[95vw] bg-white rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.18)] border border-slate-200/90 p-3.5 sm:p-4 z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100 px-1">
                    <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#355BFF]"></span>
                      {t.nav.conversionSuite}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">22 Fast Online Tools</span>
                  </div>

                  {/* 3 Columns Menu */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-[72vh] md:max-h-[560px] overflow-y-auto pr-1">
                    {NAV_TOOL_COLUMNS.map((group) => (
                      <div key={group.title} className="flex flex-col bg-slate-50/70 rounded-xl p-2 border border-slate-100">
                        <div className="px-2 py-1 mb-1 border-b border-slate-200/60">
                          <h4 className="text-xs font-bold text-slate-900 tracking-tight">{group.title}</h4>
                          <p className="text-[10px] text-slate-500 font-medium">{group.subtitle}</p>
                        </div>
                        <div className="space-y-1">
                          {group.tools.map((tool) => {
                            const isCurrent = activeTool === tool.id;
                            const isHighlight = tool.id === "formula";
                            const Icon = getToolIcon(tool.id);

                            return (
                              <button
                                key={tool.id}
                                onClick={() => {
                                  setIsToolsOpen(false);
                                  onSelectTool?.(tool.id);
                                }}
                                className={`flex w-full items-start gap-2.5 p-2 text-left rounded-lg transition-all cursor-pointer ${
                                  isCurrent
                                    ? "bg-[#355BFF] text-white shadow-xs"
                                    : isHighlight
                                    ? "bg-blue-50/90 hover:bg-blue-100/90 text-blue-950"
                                    : "hover:bg-white hover:shadow-2xs text-slate-700"
                                }`}
                              >
                                <div
                                  className={`p-1.5 rounded-md mt-0.5 shrink-0 ${
                                    isCurrent
                                      ? "bg-white/20 text-white"
                                      : isHighlight
                                      ? "bg-blue-600 text-white"
                                      : "bg-white text-slate-600 border border-slate-200/70"
                                  }`}
                                >
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className={`text-xs font-semibold truncate ${isCurrent ? "text-white" : "text-slate-900"}`}>
                                      {tool.name}
                                    </span>
                                    {tool.badge && (
                                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                                        isCurrent ? "bg-white text-[#355BFF]" : "bg-blue-600 text-white"
                                      }`}>
                                        {tool.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className={`text-[10px] truncate ${isCurrent ? "text-blue-100" : "text-slate-500"}`}>
                                    {tool.desc}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right: Actions (Desktop) + Mobile controls */}
        <div className="flex items-center gap-2 sm:gap-3 lg:justify-self-end">

          {/* Desktop: Pricing + Login + Language */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-1.5 p-1.5 bg-white/85 backdrop-blur-xl rounded-full border border-slate-200/80 neon-border-glow shadow-xs hover:shadow-[0_4px_24px_rgba(59,130,246,0.18)] transition-all">
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

              <Link
                href={currentUser ? "/account" : "/login"}
                className="px-6 py-2 bg-[#355BFF] hover:bg-blue-700 text-white text-xs font-semibold rounded-full shadow-xs hover:shadow-md hover:shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
              >
                {currentUser ? (currentUser.auth_provider === "google" ? "Google" : currentUser.full_name.split(" ")[0]) : t.nav.login}
              </Link>
            </div>

            <div
              ref={langRef}
              className="relative flex items-center"
              onMouseEnter={() => setIsLangOpen(true)}
              onMouseLeave={() => setIsLangOpen(false)}
            >
              <button
                onClick={() => setIsLangOpen((prev) => !prev)}
                className="flex h-10 items-center gap-1.5 text-xs font-semibold text-slate-800 hover:text-blue-600 px-4 rounded-full border border-slate-200/80 bg-white/90 hover:bg-white transition-all shadow-xs cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>{language}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isLangOpen ? "rotate-180 text-blue-600" : ""}`} />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-40 bg-white rounded-2xl shadow-2xl border border-slate-100 py-1.5 z-50 overflow-hidden"
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

          {/* Mobile controls */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setIsLangOpen((prev) => !prev)}
                className="p-1.5 px-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-full flex items-center gap-1 cursor-pointer"
              >
                <span>{language}</span>
                <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${isLangOpen ? "rotate-180 text-blue-600" : ""}`} />
              </button>
              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 overflow-hidden"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-medium cursor-pointer ${
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

            <Link
              href={currentUser ? "/account" : "/login"}
              className="px-4 py-1.5 bg-[#355BFF] text-white text-xs font-semibold rounded-full shadow-xs cursor-pointer"
            >
              {currentUser ? (currentUser.auth_provider === "google" ? "Google" : currentUser.full_name.split(" ")[0]) : t.nav.login}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

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
              {(
                [
                  { tool: "excel-jpg" as const, format: "jpg" as const, label: t.nav.excelToJpg },
                  { tool: "excel-png" as const, format: "png" as const, label: t.nav.excelToPng },
                  { tool: "excel-csv" as const, format: "csv" as const, label: t.nav.excelToCsv },
                ] as const
              ).map(({ tool, format, label }) => {
                const isActive = activeFormat === format;
                return (
                  <button
                    key={tool}
                    onClick={() => { setIsMobileMenuOpen(false); onSelectTool?.(tool); }}
                    className={`px-3.5 py-2 text-xs rounded-xl text-center whitespace-nowrap ${
                      isActive
                        ? "font-semibold text-white bg-[#355BFF]"
                        : "font-medium text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
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
              <div className="border-t border-slate-100 my-2 pt-2 max-h-[50vh] overflow-y-auto">
                <div className="text-[11px] font-semibold text-slate-400 px-3 py-1">{t.nav.allTools}</div>
                {NAV_TOOL_COLUMNS.map((group) => (
                  <div key={group.title} className="mb-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                      {group.title}
                    </div>
                    {group.tools.map((tool) => {
                      const Icon = getToolIcon(tool.id);
                      const isCurrent = activeTool === tool.id;
                      return (
                        <button
                          key={tool.id}
                          onClick={() => { setIsMobileMenuOpen(false); onSelectTool?.(tool.id); }}
                          className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs rounded-lg transition-colors ${
                            isCurrent
                              ? "bg-blue-50 text-blue-700 font-semibold"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${isCurrent ? "text-blue-600" : "text-slate-500"}`} />
                            <span>{tool.name}</span>
                          </div>
                          {tool.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-blue-600 text-white">
                              {tool.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
