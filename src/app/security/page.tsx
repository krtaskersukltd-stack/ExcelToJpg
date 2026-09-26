"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Lock, 
  Server, 
  Cpu, 
  KeyRound, 
  FileCheck2, 
  Trash2, 
  ShieldAlert, 
  Mail, 
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Globe2
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

export default function SecurityPage() {
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
      <main className="min-h-screen flex flex-col justify-between bg-[#FAFBFD] text-slate-900 selection:bg-blue-600 selection:text-white">
        {/* Top Navigation & Content */}
        <div className="relative z-20 bg-[#FAFBFD]">
          <Navbar onSelectTool={handleSelectTool} activeFormat={pageFormat} />

          {/* Hero Banner with Animated Neon Glowing Badge */}
          <section className="pt-28 sm:pt-36 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* Legal Hub Switcher Pills */}
              <div className="inline-flex items-center gap-1.5 p-1.5 bg-white/90 backdrop-blur-md rounded-full border border-blue-200/80 neon-border-glow shadow-sm mb-2">
                <Link
                  href="/privacy"
                  className="px-4 py-1.5 rounded-full text-slate-600 hover:text-blue-600 hover:bg-slate-50 text-xs font-medium transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="px-4 py-1.5 rounded-full text-slate-600 hover:text-blue-600 hover:bg-slate-50 text-xs font-medium transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/security"
                  className="px-4 py-1.5 rounded-full bg-[#355BFF] text-white text-xs font-semibold shadow-xs"
                >
                  Security & Compliance
                </Link>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
                Security & <span className="text-[#355BFF]">Data Protection</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto font-normal">
                Enterprise-grade cryptographic protection and stateless ephemeral compute for your sensitive financial & tabular datasets.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                <span>Security Status: All Systems Encrypted & Operational</span>
                <span>•</span>
                <span className="text-emerald-600 font-semibold">TLS 1.3 Active</span>
              </div>
            </motion.div>
          </section>

          {/* 4 Key Security Pillars (Cards with Neon Glow on Hover) */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {[
                {
                  icon: Lock,
                  title: "End-to-End TLS 1.3",
                  desc: "High-grade 256-bit encryption for all file uploads, previews, and downloads.",
                  color: "text-blue-600",
                  bg: "bg-blue-50"
                },
                {
                  icon: Cpu,
                  title: "Isolated Sandboxes",
                  desc: "Every conversion executes in a hardened, memory-confined ephemeral container.",
                  color: "text-emerald-600",
                  bg: "bg-emerald-50"
                },
                {
                  icon: Trash2,
                  title: "Hard Ephemeral Purge",
                  desc: "Strict automated cron routines permanently erase files and cache after 60 minutes.",
                  color: "text-indigo-600",
                  bg: "bg-indigo-50"
                },
                {
                  icon: KeyRound,
                  title: "OAuth 2.0 Scoped Auth",
                  desc: "Cloud pickers read only the selected sheet with immediate token expiration.",
                  color: "text-amber-600",
                  bg: "bg-amber-50"
                }
              ].map((pillar, i) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 neon-border-glow shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className={`w-10 h-10 rounded-xl ${pillar.bg} ${pillar.color} flex items-center justify-center mb-3.5`}>
                    <pillar.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{pillar.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{pillar.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Main Document Content Container */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="bg-white rounded-[28px] sm:rounded-[36px] border border-slate-200/80 p-6 sm:p-10 lg:p-12 shadow-[0_12px_45px_rgba(53,91,255,0.06)] space-y-10 text-slate-700">
              
              {/* Section 1 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-[#355BFF] flex items-center justify-center text-xs font-bold font-mono">01</span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Security Architecture Overview</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-9">
                  ExcelToJpg utilizes a defense-in-depth security model engineered specifically for temporary file processing. We believe the safest data is data that is not retained. Consequently, our conversion architecture is designed from the ground up as a stateless pipeline with zero long-term data persistence.
                </p>
              </div>

              {/* Section 2 (Visual Lifecycle Box with Neon Glow) */}
              <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white border border-blue-200/80 neon-border-glow shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm sm:text-base">
                  <ShieldCheck className="w-5 h-5 text-[#355BFF]" />
                  <span>Automated File Lifecycle & Destruction Pipeline</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
                  <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-2xs">
                    <span className="text-[11px] font-bold text-blue-600 font-mono">01. INGESTION</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">Encrypted Transit</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">TLS 1.3 direct to conversion node.</p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-2xs">
                    <span className="text-[11px] font-bold text-blue-600 font-mono">02. ISOLATION</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">Memory Sandbox</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Stateless process without disk writing.</p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-2xs">
                    <span className="text-[11px] font-bold text-blue-600 font-mono">03. VECTORIZE</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">300 DPI Rendering</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Crisp pixel-perfect JPG generation.</p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-emerald-600 font-mono">04. HARD PURGE</span>
                    <p className="text-xs font-bold text-emerald-900 mt-1">Zero Remnants</p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">File & memory wiped within 60 mins.</p>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-[#355BFF] flex items-center justify-center text-xs font-bold font-mono">02</span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Cloud Integration Security (Google Drive & Dropbox)</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-9">
                  When you import files from Google Drive or Dropbox, our client communicates directly through official SDKs with scoped OAuth 2.0 permissions. We only request read access to the specific spreadsheet file you click. We never retain access tokens or inspect any other documents in your cloud drives.
                </p>
              </div>

              {/* Section 4 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-[#355BFF] flex items-center justify-center text-xs font-bold font-mono">03</span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Infrastructure & DDoS Mitigation</h2>
                </div>
                <div className="pl-9 space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <p>To guarantee 99.9% availability and prevent system abuse:</p>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-700 font-normal">
                    <li>Global Edge CDN filtering malicious HTTP traffic and mitigating DDoS attacks.</li>
                    <li>Intelligent IP rate-limiting guarding compute instances from automated bot abuse.</li>
                    <li>Automated security patch deployments and non-root Linux container execution.</li>
                  </ul>
                </div>
              </div>

              {/* Section 5: Responsible Disclosure */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Found a vulnerability? Report to our Security Team</h3>
                  <p className="text-xs text-slate-500">We appreciate responsible security disclosures and bug reports.</p>
                </div>
                <a
                  href="mailto:security@exceltojpg.com"
                  className="btn-gradient-border inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#355BFF] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
                >
                  <Mail className="w-4 h-4" />
                  <span>Submit Security Report</span>
                </a>
              </div>

            </div>
          </section>

          {/* CTA Banner */}
          <CtaBanner onScrollToUpload={() => router.push("/?format=jpg")} />
        </div>

        {/* Sticky Curtain Footer */}
        <Footer />

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
