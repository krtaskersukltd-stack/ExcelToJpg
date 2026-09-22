"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductItem {
  id: string;
  name: string;
  component: React.FC<{ className?: string }>;
}

/* 1. PNG File Icon (Blue) */
function PngFileIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 54 68" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 0C2.686 0 0 2.686 0 6V62C0 65.314 2.686 68 6 68H48C51.314 68 54 65.314 54 62V16L38 0H6Z"
        fill="#215AF8"
      />
      <path
        d="M38 0V12C38 14.209 39.791 16 42 16H54L38 0Z"
        fill="#FFFFFF"
        fillOpacity="0.95"
      />
      <text
        x="27"
        y="51"
        fill="#FFFFFF"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="14"
        fontWeight="800"
        letterSpacing="0.04em"
        textAnchor="middle"
      >
        PNG
      </text>
    </svg>
  );
}

/* 2. Excel File Icon (Green with 3D Overlap) */
function ExcelFileIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 58 68" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Back Green Sheet with Fold */}
      <path
        d="M16 4C13.79 4 12 5.79 12 8V60C12 62.21 13.79 64 16 64H50C52.21 64 54 62.21 54 60V18L40 4H16Z"
        fill="#107C41"
      />
      <path
        d="M40 4V14C40 16.21 41.79 18 44 18H54L40 4Z"
        fill="#FFFFFF"
        fillOpacity="0.9"
      />
      {/* Front Excel Square with X */}
      <rect
        x="2"
        y="13"
        width="38"
        height="42"
        rx="6"
        fill="#22C55E"
        style={{ filter: "drop-shadow(0 3px 6px rgba(0, 0, 0, 0.2))" }}
      />
      <text
        x="21"
        y="42"
        fill="#FFFFFF"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="24"
        fontWeight="900"
        textAnchor="middle"
      >
        X
      </text>
    </svg>
  );
}

/* 3. CSV File Icon (Orange) */
function CsvFileIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 54 68" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 0C2.686 0 0 2.686 0 6V62C0 65.314 2.686 68 6 68H48C51.314 68 54 65.314 54 62V16L38 0H6Z"
        fill="#FF7A1A"
      />
      <path
        d="M38 0V12C38 14.209 39.791 16 42 16H54L38 0Z"
        fill="#FFFFFF"
        fillOpacity="0.95"
      />
      <text
        x="27"
        y="51"
        fill="#FFFFFF"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="14"
        fontWeight="800"
        letterSpacing="0.04em"
        textAnchor="middle"
      >
        CSV
      </text>
    </svg>
  );
}

/* 4. PDF File Icon (Red with Adobe Loop) */
function PdfFileIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 54 68" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 0C2.686 0 0 2.686 0 6V62C0 65.314 2.686 68 6 68H48C51.314 68 54 65.314 54 62V16L38 0H6Z"
        fill="#FF2836"
      />
      <path
        d="M38 0V12C38 14.209 39.791 16 42 16H54L38 0Z"
        fill="#FFFFFF"
        fillOpacity="0.95"
      />
      <path
        d="M36.2 38.5C34.8 38.5 32.5 39.2 30.1 40.5C28.2 37.8 26.5 34.2 25.4 30.9C26.1 27.5 26.3 24.8 25.8 23.4C25.4 22.2 24.4 21.6 23.5 21.6C22.2 21.6 21.4 22.7 21.5 24.6C21.6 26.8 22.4 29.8 23.9 33.4C22.7 37.3 20.8 41.6 19 44.5C16.8 46.2 15.2 47.9 14.8 49.3C14.5 50.3 14.8 51.2 15.6 51.7C16.2 52 17 52.1 17.9 52.1C20.3 52.1 23.3 49.7 25.8 46.1C28.9 44.9 32.5 44.1 35.8 43.8C37.8 45.2 39.5 45.8 40.6 45.8C41.7 45.8 42.4 45.1 42.6 44.1C42.8 42.8 41.9 41.2 39.7 39.9C38.6 39.2 37.4 38.5 36.2 38.5ZM23.5 23.8C23.6 23.7 23.8 23.8 23.9 24.2C24.1 24.7 24 26.3 23.5 28.7C22.9 26.5 22.9 24.8 23.1 24.2C23.2 23.9 23.3 23.8 23.5 23.8ZM16.9 49.8C16.7 49.7 16.6 49.5 16.7 49.2C16.9 48.4 18 47.2 19.6 45.8C19 47.6 18.1 49.1 17.3 49.6C17.1 49.8 17 49.8 16.9 49.8ZM27.4 43.8C28.6 42.3 29.8 40.5 30.9 38.6C32.7 37.7 34.4 37.2 35.5 36.8C33.3 37.3 30.3 38.4 27.4 43.8ZM39.6 43.4C39.4 43.6 38.8 43.6 37.7 43.1C38.9 42.3 39.8 41.8 40.3 41.8C40.6 41.8 40.8 42 40.7 42.4C40.6 42.8 40.2 43.2 39.6 43.4Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/* 5. Formula AI / Excel Formula Generator (Teal with White Cross) */
function FormulaFileIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 54 68" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 0C2.686 0 0 2.686 0 6V62C0 65.314 2.686 68 6 68H48C51.314 68 54 65.314 54 62V16L38 0H6Z"
        fill="#00C49F"
      />
      <path
        d="M38 0V12C38 14.209 39.791 16 42 16H54L38 0Z"
        fill="#FFFFFF"
        fillOpacity="0.95"
      />
      <path
        d="M24 16H30V29H43V35H30V56H24V35H11V29H24V16Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/* 6. JPG File Icon (Yellow/Amber) */
function JpgFileIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 54 68" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 0C2.686 0 0 2.686 0 6V62C0 65.314 2.686 68 6 68H48C51.314 68 54 65.314 54 62V16L38 0H6Z"
        fill="#FFB800"
      />
      <path
        d="M38 0V12C38 14.209 39.791 16 42 16H54L38 0Z"
        fill="#FFFFFF"
        fillOpacity="0.95"
      />
      <text
        x="27"
        y="51"
        fill="#FFFFFF"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="14"
        fontWeight="800"
        letterSpacing="0.04em"
        textAnchor="middle"
      >
        JPG
      </text>
    </svg>
  );
}

const products: ProductItem[] = [
  { id: "png", name: "PNG to Excel", component: PngFileIcon },
  { id: "excel", name: "Excel to JPG", component: ExcelFileIcon },
  { id: "csv", name: "CSV to Excel", component: CsvFileIcon },
  { id: "pdf", name: "PDF to Excel", component: PdfFileIcon },
  { id: "formula", name: "Excel Formula Generator", component: FormulaFileIcon },
  { id: "jpg", name: "JPG to Excel", component: JpgFileIcon },
];

export default function ProductsRibbon() {
  const [hoveredId, setHoveredId] = useState<string | null>("formula");

  return (
    <section id="products" className="py-14 sm:py-20 relative bg-[#FAFBFD] overflow-visible">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center">
        
        {/* Section Heading */}
        <div className="space-y-3 mb-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Excel To <span className="text-blue-600">JPG</span> Products
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Explore more of our file conversion tools to seamlessly switch between Excel, PDF, and CSV formats.
          </p>
        </div>

        {/* Floating Dock Capsule */}
        <div className="relative pt-10 pb-2">
          {/* Glass Dock Container */}
          <div className="relative px-6 sm:px-10 py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-md border border-indigo-200/70 shadow-[0_12px_36px_-6px_rgba(99,102,241,0.14),0_2px_10px_rgba(0,0,0,0.03)] flex items-center justify-center gap-3.5 sm:gap-6">
            
            {/* Ambient left & right subtle neon glows */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-indigo-400/40 rounded-r-full blur-[2px]" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-indigo-400/40 rounded-l-full blur-[2px]" />

            {products.map((item) => {
              const isHovered = hoveredId === item.id;
              const IconComponent = item.component;

              return (
                <div
                  key={item.id}
                  className="relative flex flex-col items-center"
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Tooltip on Hover (Above the icon) */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none z-30 whitespace-nowrap"
                      >
                        <div className="relative px-3.5 py-1.5 rounded-xl bg-white border border-indigo-200/90 shadow-[0_4px_20px_rgba(99,102,241,0.18),0_2px_6px_rgba(0,0,0,0.04)] text-[12px] sm:text-[13px] font-semibold text-slate-800">
                          {item.name}
                          {/* Speech bubble down arrow */}
                          <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-b border-r border-indigo-200/90 rotate-45" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Icon Card */}
                  <motion.button
                    type="button"
                    aria-label={item.name}
                    animate={{
                      y: isHovered ? -16 : 0,
                      scale: isHovered ? 1.12 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    className="focus:outline-none cursor-pointer select-none"
                  >
                    <div className="w-11 h-14 sm:w-14 sm:h-18 flex items-center justify-center transition-all duration-200 drop-shadow-[0_4px_10px_rgba(0,0,0,0.08)]">
                      <IconComponent className="w-full h-full object-contain" />
                    </div>
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
