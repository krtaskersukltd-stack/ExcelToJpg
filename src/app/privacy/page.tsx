"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Lock, 
  Clock, 
  EyeOff, 
  Sparkles, 
  Mail, 
  FileSpreadsheet, 
  Trash2, 
  CheckCircle2,
  Server,
  Shield,
  HelpCircle
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

export default function PrivacyPolicyPage() {
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
                  className="px-4 py-1.5 rounded-full bg-[#355BFF] text-white text-xs font-semibold shadow-xs"
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
                  className="px-4 py-1.5 rounded-full text-slate-600 hover:text-blue-600 hover:bg-slate-50 text-xs font-medium transition-colors"
                >
                  Security & Compliance
                </Link>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
                Privacy <span className="text-[#355BFF]">Policy</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto font-normal">
                Your data privacy is our highest priority. Learn how ExcelToJpg processes, ephemeralizes, and protects your spreadsheets.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                <span>Last Updated: September 26, 2026</span>
                <span>•</span>
                <span>Effective Date: Immediate</span>
              </div>
            </motion.div>
          </section>

          {/* 4 Key Privacy Pillars (Cards with Neon Glow on Hover) */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {[
                {
                  icon: Clock,
                  title: "1-Hour Auto-Purge",
                  desc: "Uploaded Excel files and generated JPGs are permanently wiped within 60 minutes.",
                  color: "text-blue-600",
                  bg: "bg-blue-50"
                },
                {
                  icon: EyeOff,
                  title: "Zero Data Selling",
                  desc: "We never monetize, inspect, or sell your spreadsheet rows, figures, or metadata.",
                  color: "text-emerald-600",
                  bg: "bg-emerald-50"
                },
                {
                  icon: Lock,
                  title: "256-Bit TLS Transit",
                  desc: "All transmissions are shielded via modern TLS 1.3 cryptographic protocols.",
                  color: "text-indigo-600",
                  bg: "bg-indigo-50"
                },
                {
                  icon: ShieldCheck,
                  title: "GDPR & CCPA Aligned",
                  desc: "Full international data subject rights including instant right-to-erasure.",
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
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Introduction & Scope</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-9">
                  ExcelToJpg (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the online spreadsheet rasterization suite located at <span className="font-semibold text-slate-800">exceltojpg.com</span>. This Privacy Policy sets out how we handle user files, account credentials, and diagnostic data when you convert Microsoft Excel (<code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">.xlsx</code>, <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">.xls</code>, <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">.xlsm</code>) or comma-separated (<code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">.csv</code>) spreadsheets into high-resolution JPG images.
                </p>
              </div>

              {/* Section 2 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-[#355BFF] flex items-center justify-center text-xs font-bold font-mono">02</span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Information We Collect & Process</h2>
                </div>
                <div className="pl-9 space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <p>
                    We prioritize data minimization. We only touch the data strictly necessary to execute high-fidelity raster rendering:
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-slate-700 font-normal">
                    <li><strong className="text-slate-900">User Spreadsheets & Files:</strong> Uploaded solely for rendering. Evaluated in ephemeral sandbox workers and permanently deleted within 1 hour.</li>
                    <li><strong className="text-slate-900">Cloud Storage Access (Google Drive & Dropbox):</strong> When using our cloud picker, we obtain short-lived scoped read tokens solely for the specific file you pick. We never inspect other folders in your cloud storage.</li>
                    <li><strong className="text-slate-900">Technical Diagnostics:</strong> Browser user agent, screen resolution, and error codes used to maintain compatibility across desktop and mobile devices.</li>
                  </ul>
                </div>
              </div>

              {/* Section 3 (Highlight Box with Neon Glow) */}
              <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white border border-blue-200/80 neon-border-glow shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm sm:text-base">
                  <Sparkles className="w-4 h-4 text-[#355BFF]" />
                  <span>Zero AI Model Training Guarantee</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Your spreadsheets, formulas, financial balances, customer rosters, and charts are <strong>NEVER used to train, fine-tune, or calibrate artificial intelligence models</strong>. Processing occurs in isolated stateless compute containers.
                </p>
              </div>

              {/* Section 4 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-[#355BFF] flex items-center justify-center text-xs font-bold font-mono">03</span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Automated Data Lifecycle & Retention</h2>
                </div>
                <div className="pl-9 space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <p>
                    Our server architecture enforces automated hard deletion policies:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <p className="text-xs font-bold text-slate-900">Step 1: Upload</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Encrypted via TLS 1.3 to conversion sandbox.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <p className="text-xs font-bold text-slate-900">Step 2: 300 DPI Render</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Vectorized & output as crisp JPG image.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
                      <p className="text-xs font-bold text-emerald-800">Step 3: 60m Hard Purge</p>
                      <p className="text-[11px] text-emerald-700 mt-0.5">File shredded completely from storage.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-[#355BFF] flex items-center justify-center text-xs font-bold font-mono">04</span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Your Rights Under GDPR & CCPA</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-9">
                  Under the EU General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you retain full authority over your data. Because we purge files automatically within 1 hour, residual personal data is effectively non-existent. You may request explicit confirmation or manual purge at any time by contacting our team.
                </p>
              </div>

              {/* Section 6: Contact Box */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Have questions about our privacy standards?</h3>
                  <p className="text-xs text-slate-500">Our Data Protection Officer is ready to assist you.</p>
                </div>
                <a
                  href="mailto:privacy@exceltojpg.com"
                  className="btn-gradient-border inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#355BFF] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Privacy Team</span>
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
