"use client";

import React, { useState, useRef } from "react";
import { 
  Folder, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Link2
} from "lucide-react";
import { motion } from "framer-motion";
import LiveConverterModal from "./LiveConverterModal";
import CloudImportModal, { GoogleDriveIcon, DropboxIcon } from "./CloudImportModal";

/* Exact Cloud Upload Icon matching user's uploaded icon */
function CustomCloudUploadIcon({ className = "w-7 h-7 text-[#355BFF]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.5 21.5H6.5C3.74 21.5 1.5 19.26 1.5 16.5C1.5 13.97 3.39 11.87 5.89 11.54C6.54 6.74 10.63 3 15.5 3C19.98 3 23.73 6.18 24.73 10.45C26.91 11.08 28.5 13.1 28.5 15.5C28.5 18.81 25.81 21.5 22.5 21.5H19.5"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 21.5V9.5M14 9.5L9 14.5M14 9.5L19 14.5"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HeroSection() {
  const [isDragging, setIsDragging] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [cloudModalOpen, setCloudModalOpen] = useState(false);
  const [cloudTab, setCloudTab] = useState<"gdrive" | "dropbox" | "link">("gdrive");
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

  const openCloudModal = (tab: "gdrive" | "dropbox" | "link") => {
    setCloudTab(tab);
    setCloudModalOpen(true);
  };

  const handleCloudImportSuccess = (name: string, size: string) => {
    setSelectedFileName(name);
    setSelectedFileSize(size);
    setModalOpen(true);
  };

  return (
    <section className="relative pt-28 sm:pt-36 pb-16 overflow-hidden bg-gradient-to-b from-[#FAFBFD] via-[#F4F8FE] to-[#FAFBFD]">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3 max-w-3xl mx-auto"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-[48px] font-bold tracking-tight text-slate-900 leading-[1.2]">
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
          className="mt-8 max-w-4xl mx-auto"
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-[28px] sm:rounded-[36px] p-5 sm:p-8 transition-all duration-300 bg-white border-2 overflow-hidden ${
              isDragging
                ? "border-[#355BFF] shadow-[0_12px_45px_rgba(53,91,255,0.25)] scale-[1.01]"
                : "border-blue-400/50 shadow-[0_12px_45px_rgba(53,91,255,0.12)]"
            }`}
          >
            {/* Top Dropzone Area with Structured Background Tiles */}
            <div className="relative rounded-2xl overflow-hidden py-6 px-4">
              
              {/* Spreadsheet Grid Rectangles strictly inside Dropzone (stops above footer) */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-2.5 pointer-events-none rounded-2xl overflow-hidden opacity-85">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="bg-[#EEF3FE]/70 rounded-md border border-blue-100/40"
                  />
                ))}
              </div>

              {/* Content Foreground */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center">
                
                {/* Cloud Upload Icon Inside Lavender-Blue Squircle */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer group mb-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#DEE7FF] flex items-center justify-center text-[#355BFF] shadow-xs group-hover:scale-105 group-hover:bg-[#D4E0FF] transition-all duration-200">
                    <CustomCloudUploadIcon className="w-7 h-7 text-[#355BFF]" />
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
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#355BFF] hover:bg-blue-700 active:scale-95 text-white font-medium rounded-xl shadow-md shadow-blue-500/25 transition-all text-xs sm:text-sm cursor-pointer"
                  >
                    <Folder className="w-4 h-4 fill-white/20 stroke-[2]" />
                    <span>Choose Excel File</span>
                  </button>

                  {/* Google Drive Integration */}
                  <button 
                    onClick={() => openCloudModal("gdrive")}
                    className="flex flex-col items-center justify-center p-1.5 hover:bg-white/80 rounded-xl transition-colors group cursor-pointer"
                    title="Import from Google Drive"
                  >
                    <GoogleDriveIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium text-slate-700 mt-0.5">Google Drive</span>
                  </button>

                  {/* Dropbox Integration */}
                  <button 
                    onClick={() => openCloudModal("dropbox")}
                    className="flex flex-col items-center justify-center p-1.5 hover:bg-white/80 rounded-xl transition-colors group cursor-pointer"
                    title="Import from Dropbox"
                  >
                    <div className="w-6 h-6 rounded-[6px] bg-[#0061FF] flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 2l6 4-6 4-6-4 6-4zm12 0l6 4-6 4-6-4 6-4zM0 10l6 4-6 4-6-4 6-4zm24 0l-6 4 6 4 6-4-6-4zM6 18l6-4 6 4-6 4-6-4z"/>
                      </svg>
                    </div>
                    <span className="text-[10px] font-medium text-slate-700 mt-0.5">Dropbox</span>
                  </button>

                  {/* Direct Link Chain Icon (Allows entering Google Drive / URL link) */}
                  <button 
                    onClick={() => openCloudModal("link")}
                    className="p-2 hover:bg-white/80 text-[#355BFF] hover:text-blue-700 rounded-xl transition-all group cursor-pointer"
                    title="Enter Google Drive link or file URL"
                  >
                    <Link2 className="w-6 h-6 group-hover:scale-110 -rotate-45 stroke-[2.5]" />
                  </button>
                </div>

                {/* Supported Formats Pills */}
                <div className="flex items-center justify-center gap-1.5">
                  {[".XLS", ".XLSX", ".CSV", ".XLSM"].map((ext) => (
                    <span
                      key={ext}
                      className="px-2 py-0.5 rounded bg-white/95 border border-slate-200/90 text-[10px] font-medium text-slate-600 shadow-2xs"
                    >
                      {ext}
                    </span>
                  ))}
                </div>

              </div>
            </div>

            {/* Bottom Row Guarantees (Clean separate footer bar) */}
            <div className="pt-4 mt-2 border-t border-slate-100 flex flex-wrap items-center justify-center sm:justify-between gap-3 text-xs text-slate-600 relative z-10 bg-white">
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

      {/* Cloud Import Modal (Google Drive, Dropbox, URL / Drive Link) */}
      <CloudImportModal
        isOpen={cloudModalOpen}
        onClose={() => setCloudModalOpen(false)}
        initialTab={cloudTab}
        onImportSuccess={handleCloudImportSuccess}
      />

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
