"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Globe2, 
  CheckCircle2, 
  FileSpreadsheet, 
  Clock, 
  Cpu, 
  ArrowRight,
  Target,
  Eye,
  Award,
  Users
} from "lucide-react";
import Navbar from "@/components/Navbar";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import LiveConverterModal from "@/components/LiveConverterModal";
import FileToExcelModal from "@/components/FileToExcelModal";
import FormulaGeneratorModal from "@/components/FormulaGeneratorModal";
import { ConverterToolId, FORWARD_FORMATS, REVERSE_SOURCES, TOOL_LABELS } from "@/lib/converter-tools";
import {
  OutputFormatProvider,
  SiteOutputFormat,
  toolIdToSiteFormat,
} from "@/context/OutputFormatContext";

export default function AboutPage() {
  const router = useRouter();
  const [pageFormat, setPageFormat] = useState<SiteOutputFormat>("jpg");
  const [activeTool, setActiveTool] = useState<ConverterToolId | null>(null);

  const handleSelectTool = useCallback(
    (tool: ConverterToolId) => {
      const siteFormat = toolIdToSiteFormat(tool);
      if (siteFormat) {
        router.push(`/?format=${siteFormat}`);
        return;
      }
      setActiveTool(tool);
    },
    [router],
  );

  return (
    <OutputFormatProvider format={pageFormat} setFormat={setPageFormat}>
      <main className="min-h-screen bg-[#FAFBFD] text-slate-900 selection:bg-blue-600 selection:text-white w-full max-w-full">
        {/* Upper layer scrolls over the sticky footer (curtain reveal) */}
        <div className="relative z-20 bg-[#FAFBFD] shadow-[0_30px_70px_-15px_rgba(15,23,42,0.22)] w-full max-w-full">
          <Navbar onSelectTool={handleSelectTool} activeFormat={pageFormat} />

          {/* Hero Section */}
          <section className="pt-28 sm:pt-36 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* Animated Glowing Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-blue-200/80 neon-border-glow shadow-xs text-xs font-semibold text-[#355BFF] mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#355BFF]" />
                <span>The Story Behind ExcelToJpg</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                Making Spreadsheets <span className="text-[#355BFF]">Visual</span>, Shareable & Secure
              </h1>
              <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto font-normal leading-relaxed">
                We engineered ExcelToJpg to solve a universal headache: converting complex financial models, audited sheets, and tables into razor-sharp, tamper-proof images ready for decks, presentations, and reports.
              </p>
            </motion.div>
          </section>

          {/* Key Metric Stats Cards with Animated Neon Borders */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {[
                {
                  value: "5M+",
                  label: "Spreadsheets Processed",
                  sub: "Across all global regions",
                  icon: FileSpreadsheet,
                  color: "text-blue-600",
                  bg: "bg-blue-50"
                },
                {
                  value: "99.98%",
                  label: "Visual Accuracy",
                  sub: "Pixel-perfect cell alignment",
                  icon: Target,
                  color: "text-emerald-600",
                  bg: "bg-emerald-50"
                },
                {
                  value: "< 3s",
                  label: "Average Render Speed",
                  sub: "Sub-second WASM pipeline",
                  icon: Zap,
                  color: "text-amber-600",
                  bg: "bg-amber-50"
                },
                {
                  value: "140+",
                  label: "Countries Served",
                  sub: "Trusted by remote teams",
                  icon: Globe2,
                  color: "text-indigo-600",
                  bg: "bg-indigo-50"
                }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="bg-[#F7F8FC] rounded-2xl p-5 sm:p-6 border border-slate-200/80 neon-border-glow shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-left"
                >
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1">{stat.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{stat.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Mission & Vision Cards */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Mission Card */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-[#F7F8FC] rounded-[28px] sm:rounded-[32px] p-8 border border-blue-200/80 neon-border-glow shadow-[0_12px_45px_rgba(53,91,255,0.06)] flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#355BFF] flex items-center justify-center mb-5">
                    <Target className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-3">
                    Our Mission
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    To eliminate the friction of presenting and publishing spreadsheet data. We empower businesses, educators, accountants, and executives to convert volatile raw data files into beautiful, tamper-resistant visual assets in seconds without compromising data security.
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#355BFF]">
                  <span>Zero formula leak risk</span>
                  <span>•</span>
                  <span>Crystal-clear 300 DPI</span>
                </div>
              </motion.div>

              {/* Vision Card */}
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-[#F7F8FC] rounded-[28px] sm:rounded-[32px] p-8 border border-blue-200/80 neon-border-glow shadow-[0_12px_45px_rgba(53,91,255,0.06)] flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-3">
                    Our Vision
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    To become the global standard for tabular document conversion and extraction. From AI formula generation to cross-platform vector image rendering, we build modern utilities that respect user privacy, preserve visual layout, and operate with zero bloat.
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-indigo-600">
                  <span>Privacy-first computing</span>
                  <span>•</span>
                  <span>Instant cloud sync</span>
                </div>
              </motion.div>

            </div>
          </section>

          {/* 4 Core Pillars */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="text-center space-y-3 mb-10">
              <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Why Millions Choose <span className="text-[#355BFF]">ExcelToJpg</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
                Engineered from the ground up for speed, visual excellence, and enterprise-level compliance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  icon: Cpu,
                  title: "Stateless Ephemeral Processing",
                  desc: "We never store or inspect your confidential rows. Uploaded spreadsheets are processed in isolated worker memory and permanently wiped within 60 minutes.",
                  color: "text-blue-600",
                  bg: "bg-blue-50"
                },
                {
                  icon: Layers,
                  title: "Sub-Pixel 300 DPI Vectorization",
                  desc: "Our high-precision rendering engine preserves exact column widths, cell borders, custom font hierarchies, and complex conditional formatting rules.",
                  color: "text-emerald-600",
                  bg: "bg-emerald-50"
                },
                {
                  icon: ShieldCheck,
                  title: "Tamper-Proof Data Sharing",
                  desc: "Sharing raw .xlsx files risks unauthorized cell edits and accidental formula exposure. Our rasterized images ensure your figures remain permanent and accurate.",
                  color: "text-amber-600",
                  bg: "bg-amber-50"
                },
                {
                  icon: Sparkles,
                  title: "AI-Powered Bi-Directional Tools",
                  desc: "Beyond raster images, convert JPG/PNG/PDF back to editable Excel workbooks and generate complex spreadsheet formulas from natural language prompts.",
                  color: "text-indigo-600",
                  bg: "bg-indigo-50"
                }
              ].map((pillar, i) => (
                <div
                  key={pillar.title}
                  className="bg-[#F7F8FC] rounded-2xl p-6 border border-slate-200/80 neon-border-glow shadow-xs hover:shadow-md transition-all flex gap-4 items-start"
                >
                  <div className={`w-11 h-11 rounded-xl ${pillar.bg} ${pillar.color} flex items-center justify-center shrink-0`}>
                    <pillar.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900">{pillar.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Architecture / Zero Training Guarantee Banner */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
            <div className="rounded-[28px] sm:rounded-[36px] p-8 sm:p-10 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white border border-blue-200/80 neon-border-glow shadow-[0_12px_45px_rgba(53,91,255,0.06)] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 text-[#355BFF] font-bold text-xs uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>Enterprise Data Integrity</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Zero AI Training on User Data
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                  Your spreadsheets, balances, employee payrolls, and proprietary equations are strictly transient. We never train or fine-tune public or private AI models on your files.
                </p>
              </div>
              <Link
                href="/security"
                className="btn-gradient-border inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#355BFF] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs shrink-0 transition-all"
              >
                <span>Read Security Whitepaper</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* CTA Banner */}
          <CtaBanner onScrollToUpload={() => router.push("/?format=jpg")} />
        </div>

        {/* Sticky footer reveals from underneath the CTA as you scroll */}
        <div className="sticky bottom-0 z-0 w-full">
          <Footer />
        </div>

        <LiveConverterModal
          isOpen={Boolean(activeTool && FORWARD_FORMATS[activeTool] && !toolIdToSiteFormat(activeTool))}
          onClose={() => setActiveTool(null)}
          initialFormat={(activeTool && FORWARD_FORMATS[activeTool]) || pageFormat}
          toolTitle={activeTool ? TOOL_LABELS[activeTool] : undefined}
          lockFormat
        />
        {activeTool && REVERSE_SOURCES[activeTool] && (
          <FileToExcelModal isOpen onClose={() => setActiveTool(null)} sourceKind={REVERSE_SOURCES[activeTool]!} />
        )}
        <FormulaGeneratorModal isOpen={activeTool === "formula"} onClose={() => setActiveTool(null)} />
      </main>
    </OutputFormatProvider>
  );
}
