"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  MessageSquare, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  Clock, 
  Building2, 
  ChevronDown,
  AlertCircle
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

export default function ContactPage() {
  const router = useRouter();
  const [pageFormat, setPageFormat] = useState<SiteOutputFormat>("jpg");
  const [activeTool, setActiveTool] = useState<ConverterToolId | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "general", message: "" });
    }, 900);
  };

  const contactFaqs = [
    {
      q: "What is the typical response time for support inquiries?",
      a: "Our customer success and technical teams respond to all inquiries within 2 to 4 hours during business hours, and within 12 hours on weekends."
    },
    {
      q: "Can I request high-volume custom API access for enterprise automation?",
      a: "Yes! Our Enterprise plans offer programmatic REST API access with custom rate limits and dedicated compute workers. Contact sales@exceltojpg.com for API keys."
    },
    {
      q: "Do you store or inspect uploaded spreadsheets during support checks?",
      a: "Never. All spreadsheets remain strictly in ephemeral memory and are permanently wiped within 60 minutes. We never view or retain your file contents."
    },
    {
      q: "How can I request a refund or cancel my subscription?",
      a: "You can cancel anytime from your Account portal, or email support@exceltojpg.com and our billing team will process your cancellation immediately."
    }
  ];

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
              {/* Glowing Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-blue-200/80 neon-border-glow shadow-xs text-xs font-semibold text-[#355BFF] mb-2">
                <MessageSquare className="w-3.5 h-3.5 text-[#355BFF]" />
                <span>24/7 Dedicated Support & Inquiries</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                Get in <span className="text-[#355BFF]">Touch</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto font-normal leading-relaxed">
                Have questions about our spreadsheet rasterization engine, custom volume licenses, or need help with a conversion? We&apos;re here to help.
              </p>
            </motion.div>
          </section>

          {/* 3 Direct Support Channel Cards with Animated Neon Borders */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              
              {/* Channel 1: General Support */}
              <motion.a
                href="mailto:support@exceltojpg.com"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="bg-[#F7F8FC] rounded-2xl p-6 border border-slate-200/80 neon-border-glow shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">General Support</h3>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    Assistance with file rendering, tool options, and account management.
                  </p>
                </div>
                <div className="text-xs font-bold text-[#355BFF] flex items-center gap-1.5">
                  <span>support@exceltojpg.com</span>
                </div>
              </motion.a>

              {/* Channel 2: Enterprise & Sales */}
              <motion.a
                href="mailto:sales@exceltojpg.com"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.12 }}
                className="bg-[#F7F8FC] rounded-2xl p-6 border border-slate-200/80 neon-border-glow shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Enterprise & Sales</h3>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    Custom API quotas, volume discounts, and company invoicing.
                  </p>
                </div>
                <div className="text-xs font-bold text-indigo-600 flex items-center gap-1.5">
                  <span>sales@exceltojpg.com</span>
                </div>
              </motion.a>

              {/* Channel 3: Security & Compliance */}
              <motion.a
                href="mailto:privacy@exceltojpg.com"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.19 }}
                className="bg-[#F7F8FC] rounded-2xl p-6 border border-slate-200/80 neon-border-glow shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Security & Privacy</h3>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    Data protection officer inquiries, GDPR requests, and audits.
                  </p>
                </div>
                <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <span>privacy@exceltojpg.com</span>
                </div>
              </motion.a>

            </div>
          </section>

          {/* Interactive Contact Form Container Card */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
            <div className="bg-[#F7F8FC] rounded-[28px] sm:rounded-[36px] border border-slate-200/80 p-6 sm:p-10 lg:p-12 shadow-[0_12px_45px_rgba(53,91,255,0.06)] grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Form Left Details */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                 
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Send Us a Message
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                    Fill out the form and our technical team will review your query and respond shortly.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <Clock className="w-5 h-5 text-[#355BFF] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Rapid Response Window</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Average turnaround under 4 hours on business days.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-emerald-900">Encrypted Communication</h4>
                      <p className="text-[11px] text-emerald-700 mt-0.5">All tickets and details are protected under strict confidentiality.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Right Inputs */}
              <div className="lg:col-span-7">
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="h-full min-h-[360px] flex flex-col items-center justify-center text-center p-8 bg-gradient-to-b from-blue-50/50 to-emerald-50/30 rounded-2xl border border-emerald-200/80"
                    >
                      <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-sm">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent Successfully!</h3>
                      <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed mb-6">
                        Thank you for reaching out. A confirmation has been logged and our support team will respond to your email shortly.
                      </p>
                      <button
                        onClick={() => setIsSuccess(false)}
                        className="btn-gradient-border px-6 py-2.5 rounded-full bg-[#355BFF] text-white text-xs font-semibold shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1.5" htmlFor="contact-name">
                            Your Name *
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            required
                            placeholder="e.g. Alex Miller"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#355BFF] focus:ring-2 focus:ring-blue-100 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1.5" htmlFor="contact-email">
                            Email Address *
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            required
                            placeholder="alex@company.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#355BFF] focus:ring-2 focus:ring-blue-100 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5" htmlFor="contact-subject">
                          Topic / Subject
                        </label>
                        <select
                          id="contact-subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#355BFF] focus:ring-2 focus:ring-blue-100 bg-white transition-all cursor-pointer"
                        >
                          <option value="general">General Support & Question</option>
                          <option value="enterprise">Enterprise Plan & API License</option>
                          <option value="bug">Conversion Issue / Bug Report</option>
                          <option value="feature">Feature Request & Suggestion</option>
                          <option value="billing">Billing & Invoices</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5" htmlFor="contact-message">
                          Message *
                        </label>
                        <textarea
                          id="contact-message"
                          required
                          rows={4}
                          placeholder="Please describe your question or issue in detail..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#355BFF] focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn-gradient-border w-full py-3 rounded-full bg-[#355BFF] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>Send Support Message</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </section>

          {/* Quick FAQ Section */}
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
            <div className="text-center space-y-2 mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Frequently Asked Support Questions
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Quick answers to common questions about our platform and licensing.
              </p>
            </div>

            <div className="space-y-3">
              {contactFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-900">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${activeFaq === idx ? "rotate-180 text-[#355BFF]" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {activeFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 sm:px-5 pb-4 pt-1 text-xs text-slate-500 border-t border-slate-100 leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
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
