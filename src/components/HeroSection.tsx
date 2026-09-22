"use client";

import React, { useState, useRef } from "react";
import { 
  CloudUpload, 
  Folder, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Link2
} from "lucide-react";
import { motion } from "framer-motion";
import LiveConverterModal from "./LiveConverterModal";

export default function HeroSection() {
  const [isDragging, setIsDragging] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("Annual_Q4_Summary.xlsx");
  const [selectedFileSize, setSelectedFileSize] = useState("1.4 MB");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFileName(file.name);
      setSelectedFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      setModalOpen(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);
      setSelectedFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      setModalOpen(true);
    }
  };

  const triggerSampleConversion = (name: string, size: string) => {
    setSelectedFileName(name);
    setSelectedFileSize(size);
    setModalOpen(true);
  };

  return (
    <section className="relative pt-28 sm:pt-36 pb-16 overflow-hidden">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3 max-w-3xl mx-auto"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-[46px] font-bold tracking-tight text-slate-900 leading-[1.2]">
            Excel To <span className="text-[#355BFF]">JPG</span> Converter
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-normal leading-relaxed max-w-xl mx-auto">
            Convert Excel spreadsheets into clear, high-quality JPG images online. Upload your Excel file, convert it, and download your images in seconds.
          </p>
        </motion.div>

        {/* Pixel-Perfect Hero Dropzone Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 max-w-3xl mx-auto"
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 transition-all duration-300 bg-white border-2 ${
              isDragging
                ? "border-[#355BFF] shadow-[0_12px_45px_rgba(53,91,255,0.25)] scale-[1.01]"
                : "border-blue-400/50 shadow-[0_12px_45px_rgba(53,91,255,0.12)]"
            }`}
          >
            {/* Spreadsheet Grid Rectangles inside Dropzone */}
            <div className="absolute inset-4 sm:inset-6 grid grid-cols-6 grid-rows-4 gap-2.5 pointer-events-none rounded-2xl overflow-hidden opacity-90">
              {Array.from({ length: 24 }).map((_, i) => (
                <div 
                  key={i} 
                  className="bg-[#EEF3FE]/70 rounded-md border border-blue-100/40"
                />
              ))}
            </div>

            {/* Content Foreground */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center py-2 sm:py-4">
              
              {/* Cloud Upload Icon Inside Lavender-Blue Squircle */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer group mb-3.5"
              >
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#DEE7FF] flex items-center justify-center text-[#355BFF] shadow-xs group-hover:scale-105 group-hover:bg-[#D4E0FF] transition-all duration-200">
                  <CloudUpload className="w-7 h-7 text-[#355BFF] stroke-[2.2]" />
                </div>
              </div>

              {/* Title & Subtext */}
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Drop your Excel file here
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-5">
                or choose a file from your device
              </p>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".xls,.xlsx,.csv,.xlsm"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Actions Row: Choose File + Google Drive + Dropbox + URL Link */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-4">
                
                {/* Choose Excel File Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#355BFF] hover:bg-blue-700 active:scale-95 text-white font-medium rounded-xl shadow-md shadow-blue-500/25 transition-all text-xs sm:text-sm"
                >
                  <Folder className="w-4 h-4 fill-white/20 stroke-[2]" />
                  <span>Choose Excel File</span>
                </button>

                {/* Google Drive Integration */}
                <button 
                  onClick={() => triggerSampleConversion("Q3_Financial_Analysis_Gdrive.xlsx", "2.1 MB")}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-white/80 rounded-xl transition-colors group cursor-pointer"
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 87.3 78" fill="none">
                    <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5l5.4 9.35z" fill="#0066DA"/>
                    <path d="M43.65 25L29.9 1.2C28.5.4 26.95 0 25.4 0H8.3C6.75 0 5.2.4 3.8 1.2L17.55 25h26.1z" fill="#00AC47"/>
                    <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 5.4-9.35c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.5 9.5 10.5 10.4z" fill="#EA4335"/>
                    <path d="M43.65 25L57.4 1.2C56 .4 54.45 0 52.9 0H35.8c-1.55 0-3.1.4-4.5 1.2L45 25h-1.35z" fill="#00832D"/>
                    <path d="M59.8 53H32.3L18.55 76.8c1.4.8 2.95 1.2 4.5 1.2h41.45c1.55 0 3.1-.4 4.5-1.2L59.8 53z" fill="#2684FC"/>
                    <path d="M73.4 26.5l-13.6-23.5c-1.4-.8-2.95-1.2-4.5-1.2L41.55 25l13.75 23.8h27.5c0-1.55-.4-3.1-1.2-4.5l-8.2-17.8z" fill="#FFBA00"/>
                  </svg>
                  <span className="text-[10px] font-medium text-slate-700 mt-0.5">Google Drive</span>
                </button>

                {/* Dropbox Integration */}
                <button 
                  onClick={() => triggerSampleConversion("Dropbox_Inventory_Matrix.xlsx", "980 KB")}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-white/80 rounded-xl transition-colors group cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-sm bg-[#0061FF] flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 2l6 4-6 4-6-4 6-4zm12 0l6 4-6 4-6-4 6-4zM0 10l6 4-6 4-6-4 6-4zm24 0l-6 4 6 4 6-4-6-4zM6 18l6-4 6 4-6 4-6-4z"/>
                    </svg>
                  </div>
                  <span className="text-[10px] font-medium text-slate-700 mt-0.5">Dropbox</span>
                </button>

                {/* Direct Link Chain Icon */}
                <button 
                  onClick={() => triggerSampleConversion("Web_Export_Data.xlsx", "3.2 MB")}
                  className="p-2 hover:bg-white/80 text-[#355BFF] hover:text-blue-700 rounded-xl transition-all group cursor-pointer"
                  title="Upload from URL"
                >
                  <Link2 className="w-6 h-6 group-hover:scale-110 -rotate-45 stroke-[2.5]" />
                </button>
              </div>

              {/* Supported Formats Pills */}
              <div className="flex items-center justify-center gap-1.5 mb-6">
                {[".XLS", ".XLSX", ".CSV", ".XLSM"].map((ext) => (
                  <span
                    key={ext}
                    className="px-2 py-0.5 rounded bg-white/90 border border-slate-200/90 text-[10px] font-medium text-slate-600 shadow-2xs"
                  >
                    {ext}
                  </span>
                ))}
              </div>

            </div>

            {/* Bottom Row Guarantees (Below Grid) */}
            <div className="pt-4 border-t border-slate-200/60 flex flex-wrap items-center justify-center sm:justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#355BFF]" />
                <span>Max file size: <strong className="text-slate-800 font-semibold">50MB</strong></span>
              </div>

              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#355BFF]" />
                <span>Files permanently deleted after <strong className="text-slate-800 font-semibold">1 hour</strong></span>
              </div>

              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#355BFF]" />
                <span>High-DPI Render</span>
              </div>
            </div>

          </div>
        </motion.div>

      </div>

      {/* Interactive Live Converter Modal */}
      <LiveConverterModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        fileName={selectedFileName}
        fileSize={selectedFileSize}
      />
    </section>
  );
}
