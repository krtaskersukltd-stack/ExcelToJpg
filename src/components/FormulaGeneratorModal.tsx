"use client";

import React, { useEffect, useState } from "react";
import { Check, Copy, FunctionSquare, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function rangeFrom(prompt: string, fallback = "A2:A100") {
  return prompt.match(/\b[A-Z]{1,3}\d+:[A-Z]{1,3}\d+\b/i)?.[0].toUpperCase() || fallback;
}

function generateFormula(prompt: string) {
  const text = prompt.toLowerCase();
  const range = rangeFrom(prompt);
  if (text.includes("xlookup") || text.includes("lookup") || text.includes("find matching")) return "=XLOOKUP(A2,Sheet2!A:A,Sheet2!B:B,\"Not found\")";
  if (text.includes("countif") || (text.includes("count") && text.includes("if"))) return `=COUNTIF(${range},\"criteria\")`;
  if (text.includes("sumif") || (text.includes("sum") && text.includes("if"))) return `=SUMIF(${range},\"criteria\",B2:B100)`;
  if (text.includes("if") || text.includes("condition")) return "=IF(A2>=100,\"Yes\",\"No\")";
  if (text.includes("average") || text.includes("mean")) return `=AVERAGE(${range})`;
  if (text.includes("maximum") || text.includes("highest") || text.includes("max")) return `=MAX(${range})`;
  if (text.includes("minimum") || text.includes("lowest") || text.includes("min")) return `=MIN(${range})`;
  if (text.includes("count")) return `=COUNTA(${range})`;
  if (text.includes("join") || text.includes("combine") || text.includes("concatenate")) return "=TEXTJOIN(\" \",TRUE,A2:C2)";
  if (text.includes("date") && (text.includes("difference") || text.includes("days"))) return "=DATEDIF(A2,B2,\"d\")";
  if (text.includes("percentage") || text.includes("percent")) return "=IFERROR((B2-A2)/A2,0)";
  return `=SUM(${range})`;
}

export default function FormulaGeneratorModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [prompt, setPrompt] = useState("");
  const [formula, setFormula] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => { if (isOpen) { setPrompt(""); setFormula(""); setCopied(false); } }, [isOpen]);
  if (!isOpen) return null;
  return <AnimatePresence><div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true"><button className="fixed inset-0 bg-slate-950/65 backdrop-blur-md" onClick={onClose} aria-label="Close" /><motion.div initial={{ opacity: 0, scale: .97, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"><header className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-5"><div className="flex items-center gap-3"><div className="rounded-xl bg-[#355BFF] p-2.5 text-white"><FunctionSquare className="h-5 w-5" /></div><div><h2 className="text-lg font-bold text-slate-950">Excel Formula Generator</h2><p className="text-xs text-slate-500">Describe the calculation and get a ready-to-paste formula.</p></div></div><button onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-white"><X className="h-5 w-5" /></button></header><div className="p-6"><label className="text-sm font-bold text-slate-800" htmlFor="formula-prompt">What should the formula calculate?</label><textarea id="formula-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Example: Average the values in B2:B50, or find a matching product from Sheet2" className="mt-2 min-h-32 w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /><button disabled={!prompt.trim()} onClick={() => setFormula(generateFormula(prompt))} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#355BFF] px-5 py-3 text-sm font-bold text-white disabled:opacity-40"><Sparkles className="h-4 w-4" />Generate formula</button>{formula && <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50/60 p-4"><p className="text-xs font-bold uppercase tracking-wide text-blue-700">Generated formula</p><div className="mt-2 flex items-center gap-3"><code className="min-w-0 flex-1 overflow-x-auto rounded-xl bg-slate-950 px-4 py-3 text-sm text-emerald-300">{formula}</code><button onClick={async () => { await navigator.clipboard.writeText(formula); setCopied(true); }} className="rounded-xl border border-blue-200 bg-white p-3 text-blue-700">{copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}</button></div><p className="mt-3 text-xs text-slate-500">Review cell references, then paste this formula into Excel.</p></div>}</div></motion.div></div></AnimatePresence>;
}
