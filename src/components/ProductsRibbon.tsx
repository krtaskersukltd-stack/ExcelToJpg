"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, FileText, FileSpreadsheet, FileCode, Layers, Image as ImageIcon } from "lucide-react";

interface ProductIcon {
  id: string;
  name: string;
  badge: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  format: string;
}

const products: ProductIcon[] = [
  {
    id: "word",
    name: "Word to Excel",
    badge: "W",
    color: "text-white",
    bgColor: "bg-blue-600",
    borderColor: "border-blue-400",
    description: "Extract structured tables from .docx documents into spreadsheet format",
    format: "DOCX → XLSX"
  },
  {
    id: "excel",
    name: "Excel to JPG",
    badge: "X",
    color: "text-white",
    bgColor: "bg-emerald-600",
    borderColor: "border-emerald-400",
    description: "Convert workbooks into 300 DPI razor sharp presentation graphics",
    format: "XLSX → JPG"
  },
  {
    id: "csv",
    name: "CSV to Excel",
    badge: "CSV",
    color: "text-white",
    bgColor: "bg-orange-500",
    borderColor: "border-orange-400",
    description: "Format delimiter-separated values into clean stylized workbooks",
    format: "CSV → XLSX"
  },
  {
    id: "pdf",
    name: "PDF to Excel",
    badge: "PDF",
    color: "text-white",
    bgColor: "bg-rose-500",
    borderColor: "border-rose-400",
    description: "Reconstruct vectorized financial statements and tabular PDF data",
    format: "PDF → XLSX"
  },
  {
    id: "formula",
    name: "Formula AI",
    badge: "fx",
    color: "text-white",
    bgColor: "bg-cyan-500",
    borderColor: "border-cyan-400",
    description: "Generate complex nested spreadsheet logic with natural language AI",
    format: "AI Generator"
  },
  {
    id: "jpg",
    name: "JPG to Excel",
    badge: "IMG",
    color: "text-white",
    bgColor: "bg-amber-500",
    borderColor: "border-amber-400",
    description: "AI Optical Character Recognition for receipts, invoices, and table scans",
    format: "JPG → XLSX"
  },
];

export default function ProductsRibbon() {
  const [activeProduct, setActiveProduct] = useState<ProductIcon | null>(products[1]);

  return (
    <section id="products" className="py-16 relative bg-[#FAFBFD]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Section Heading */}
        <div className="space-y-3 mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Excel To <span className="text-blue-600">JPG</span> Products
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Explore more of our file conversion tools to seamlessly switch between Excel, PDF, and CSV formats.
          </p>
        </div>

        {/* Floating Dock & Tooltip Badge */}
        <div className="relative flex flex-col items-center">
          
          {/* Floating Top Badge: "Excel Formula Generator" */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-md shadow-slate-900/10 border border-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Excel Formula Generator</span>
              <span className="text-[10px] bg-cyan-500/30 text-cyan-300 px-1.5 py-0.2 rounded font-mono">NEW</span>
            </div>
          </motion.div>

          {/* Product Dock */}
          <div className="p-3 sm:p-4 rounded-3xl bg-white border border-slate-200/90 shadow-[0_10px_35px_-5px_rgba(15,23,42,0.06)] flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
            {products.map((item) => {
              const isSelected = activeProduct?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveProduct(item)}
                  onMouseEnter={() => setActiveProduct(item)}
                  className={`group relative p-2 rounded-2xl transition-all duration-200 ${
                    isSelected ? "bg-blue-50/80 scale-110 shadow-sm" : "hover:bg-slate-50 hover:scale-105"
                  }`}
                >
                  {/* Colorful File Badge Squircle */}
                  <div
                    className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl ${item.bgColor} ${item.color} flex flex-col items-center justify-center shadow-md relative overflow-hidden transition-transform group-hover:-translate-y-1`}
                  >
                    {/* Folded Corner Effect */}
                    <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-black/15 rounded-bl-lg"></div>
                    
                    <span className="font-extrabold text-sm sm:text-base tracking-wider">{item.badge}</span>
                    <span className="text-[8px] font-semibold opacity-80 uppercase mt-0.5 tracking-tight">FILE</span>
                  </div>

                  {/* Active indicator dot */}
                  {isSelected && (
                    <motion.div
                      layoutId="activeDockDot"
                      className="w-1.5 h-1.5 rounded-full bg-blue-600 mx-auto mt-1"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Dynamic Details Box for Active Selected Product */}
          {activeProduct && (
            <motion.div
              key={activeProduct.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 px-6 py-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center max-w-lg"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">{activeProduct.format}</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold text-slate-800">{activeProduct.name}</span>
              </div>
              <p className="text-xs text-slate-500">
                {activeProduct.description}
              </p>
            </motion.div>
          )}

        </div>

      </div>
    </section>
  );
}
