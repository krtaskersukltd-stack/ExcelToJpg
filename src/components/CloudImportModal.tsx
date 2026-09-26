"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Link2,
  Sparkles,
  AlertCircle,
  Loader2,
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  Globe
} from "lucide-react";

export function GoogleDriveIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    // Official Google Drive product logo (fonts.gstatic productlogos)
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/icons/google-drive.svg"
      alt=""
      width={24}
      height={24}
      className={`object-contain ${className}`}
      draggable={false}
      aria-hidden="true"
    />
  );
}

export function DropboxIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    // Official Dropbox open-box mark
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/icons/dropbox.svg"
      alt=""
      width={24}
      height={24}
      className={`object-contain ${className}`}
      draggable={false}
      aria-hidden="true"
    />
  );
}

interface CloudImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "gdrive" | "dropbox" | "link";
  onImportSuccess: (fileName: string, fileSize: string, source: string, url?: string) => void;
}

export default function CloudImportModal({
  isOpen,
  onClose,
  initialTab = "gdrive",
  onImportSuccess
}: CloudImportModalProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"gdrive" | "dropbox" | "link">(initialTab);
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  if (!isOpen) return null;

  const handleUrlImport = async (inputUrl?: string) => {
    const targetUrl = (inputUrl || urlInput).trim();
    if (!targetUrl) {
      setErrorMessage("Please enter a valid link.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      const parsed = new URL(targetUrl);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        throw new Error("Unsupported URL protocol");
      }

      let fileName = "Cloud_Spreadsheet.xlsx";
      const fileSize = "Remote file";
      let source = "URL Link";

      // Google Drive / Google Sheets Parsing
      if (targetUrl.includes("docs.google.com/spreadsheets")) {
        fileName = "Google_Sheets_Document.xlsx";
        source = "Google Sheets";
      } else if (targetUrl.includes("drive.google.com")) {
        fileName = "Google_Drive_File.xlsx";
        source = "Google Drive";
      } else if (targetUrl.includes("dropbox.com")) {
        fileName = "Dropbox_Shared_Sheet.xlsx";
        source = "Dropbox";
      } else {
        // Extract filename from direct link if available
        const pathSegments = parsed.pathname.split("/").filter(Boolean);
        const lastSeg = pathSegments[pathSegments.length - 1];
        if (lastSeg && /\.(xlsx|xls|csv|xlsm)$/i.test(lastSeg)) {
          fileName = decodeURIComponent(lastSeg);
        } else {
          fileName = "Imported_Dataset.xlsx";
        }
      }

      setIsLoading(false);
      onImportSuccess(fileName, fileSize, source, targetUrl);
      onClose();
    } catch {
      setIsLoading(false);
      setErrorMessage("Could not fetch file from the provided URL. Please check permissions or direct link.");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 flex flex-col my-auto"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center shadow-xs">
                {activeTab === "gdrive" && <GoogleDriveIcon className="w-5 h-5" />}
                {activeTab === "dropbox" && <DropboxIcon className="w-5 h-5" />}
                {activeTab === "link" && <Link2 className="w-5 h-5 text-[#355BFF]" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {activeTab === "gdrive" && "Import from Google Drive"}
                  {activeTab === "dropbox" && "Import from Dropbox"}
                  {activeTab === "link" && "Import from Link or Google Drive URL"}
                </h3>
                <p className="text-xs text-slate-500">
                  Select a spreadsheet or enter a share link to convert to JPG
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-100 px-6 pt-3 gap-2 bg-slate-50/30">
            <button
              onClick={() => { setActiveTab("gdrive"); setErrorMessage(""); }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${activeTab === "gdrive"
                  ? "border-[#355BFF] text-[#355BFF] bg-white shadow-xs"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
            >
              <GoogleDriveIcon className="w-4 h-4" />
              <span>{t.cloudImport.gdriveTab}</span>
            </button>

            <button
              onClick={() => { setActiveTab("dropbox"); setErrorMessage(""); }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${activeTab === "dropbox"
                  ? "border-[#0061FF] text-[#0061FF] bg-white shadow-xs"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
            >
              <DropboxIcon className="w-4 h-4" />
              <span>{t.cloudImport.dropboxTab}</span>
            </button>

            <button
              onClick={() => { setActiveTab("link"); setErrorMessage(""); }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${activeTab === "link"
                  ? "border-[#355BFF] text-[#355BFF] bg-white shadow-xs"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
            >
              <Link2 className="w-4 h-4" />
              <span>{t.cloudImport.urlTab}</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Error banner */}
            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* TAB 1: GOOGLE DRIVE */}
            {activeTab === "gdrive" && (
              <div className="space-y-4">
                {/* Direct Google Drive URL Input Card */}
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-600" />
                      <span>Paste Google Drive or Google Sheets Link</span>
                    </label>
                    <span className="text-[10px] text-blue-600 font-medium">Public or View-accessible</span>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="url"
                        placeholder="https://docs.google.com/spreadsheets/d/... or drive.google.com/file/d/..."
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleUrlImport()}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                      />
                    </div>
                    <button
                      onClick={() => handleUrlImport()}
                      disabled={isLoading || !urlInput.trim()}
                      className="px-4 py-2.5 bg-[#355BFF] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
                    >
                      {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                      <span>Import</span>
                    </button>
                  </div>
                </div>

                {/* OAuth-backed account listing is not available yet. */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <FolderOpen className="w-4 h-4 text-blue-600" />
                    <span>My Google Drive Files</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                      {t.cloudImport.notConnected}
                    </span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl bg-slate-50/70 p-5 text-center">
                  <p className="text-xs font-semibold text-slate-800">{t.cloudImport.listingUnavailable}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{t.cloudImport.connectGdrive}</p>
                </div>
              </div>
            )}

            {/* TAB 2: DROPBOX */}
            {activeTab === "dropbox" && (
              <div className="space-y-4">
                {/* Direct Dropbox URL Input Card */}
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <DropboxIcon className="w-3.5 h-3.5" />
                      <span>Paste Dropbox Shared Spreadsheet Link</span>
                    </label>
                    <span className="text-[10px] text-[#0061FF] font-medium">Shared or Public Link</span>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="url"
                        placeholder="https://www.dropbox.com/s/..."
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleUrlImport()}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0061FF] focus:border-transparent placeholder:text-slate-400"
                      />
                    </div>
                    <button
                      onClick={() => handleUrlImport()}
                      disabled={isLoading || !urlInput.trim()}
                      className="px-4 py-2.5 bg-[#0061FF] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
                    >
                      {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                      <span>Import</span>
                    </button>
                  </div>
                </div>

                {/* OAuth-backed account listing is not available yet. */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <FolderOpen className="w-4 h-4 text-[#0061FF]" />
                    <span>My Dropbox Spreadsheets</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                      {t.cloudImport.notConnected}
                    </span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl bg-slate-50/70 p-5 text-center">
                  <p className="text-xs font-semibold text-slate-800">{t.cloudImport.listingUnavailable}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{t.cloudImport.connectDropbox}</p>
                </div>
              </div>
            )}

            {/* TAB 3: UNIVERSAL LINK / GOOGLE DRIVE URL */}
            {activeTab === "link" && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white border border-blue-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Link2 className="w-4 h-4 text-blue-600" />
                      <span>Enter Google Drive, Google Sheets, or Direct File URL</span>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="url"
                      placeholder="e.g. https://docs.google.com/spreadsheets/d/YOUR_FILE_ID/edit"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleUrlImport()}
                      className="w-full text-xs px-3.5 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 font-mono"
                    />

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Supported: Google Sheets, Google Drive, Dropbox, OneDrive, Web URLs</span>
                      <button
                        onClick={() => handleUrlImport()}
                        disabled={isLoading || !urlInput.trim()}
                        className="px-5 py-2 bg-[#355BFF] hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                      >
                        {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        <span>Import & Convert</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{t.cloudImport.publicLinksOnly}</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer security badge */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Direct encrypted cloud pipeline • No files stored on third-party servers</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
