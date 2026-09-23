"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  Check,
  Link2,
  ExternalLink,
  FileSpreadsheet,
  Download,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  Globe
} from "lucide-react";

export function GoogleDriveIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 87.3 78" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5l5.4 9.35z" fill="#0066DA" />
      <path d="M43.65 25L29.9 1.2C28.5.4 26.95 0 25.4 0H8.3C6.75 0 5.2.4 3.8 1.2L17.55 25h26.1z" fill="#00AC47" />
      <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 5.4-9.35c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.5 9.5 10.5 10.4z" fill="#EA4335" />
      <path d="M43.65 25L57.4 1.2C56 .4 54.45 0 52.9 0H35.8c-1.55 0-3.1.4-4.5 1.2L45 25h-1.35z" fill="#00832D" />
      <path d="M59.8 53H32.3L18.55 76.8c1.4.8 2.95 1.2 4.5 1.2h41.45c1.55 0 3.1-.4 4.5-1.2L59.8 53z" fill="#2684FC" />
      <path d="M73.4 26.5l-13.6-23.5c-1.4-.8-2.95-1.2-4.5-1.2L41.55 25l13.75 23.8h27.5c0-1.55-.4-3.1-1.2-4.5l-8.2-17.8z" fill="#FFBA00" />
    </svg>
  );
}

export function DropboxIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#0061FF" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.035 2.5 0 6.643l5.965 4.887 6.035-4.93L6.035 2.5zm11.93 0-6.035 4.099 6.035 4.931L24 6.643 17.965 2.5zM0 16.417l6.035 4.143 5.965-4.888-6.035-4.93L0 16.417zm24 0-6.035-4.257-6.035 4.93 5.965 4.888L24 16.417zM6.035 21.5 12 17.587l5.965 3.913L24 17.375v2.125l-12 8-12-8v-2.125l6.035 4.125z" />
    </svg>
  );
}

const GDRIVE_MOCK_FILES = [
  { id: "gd-1", name: "2026_Executive_Financial_Plan.xlsx", size: "2.4 MB", modified: "Today, 11:20 AM", type: "XLSX", owner: "Me" },
  { id: "gd-2", name: "Global_Sales_Revenue_Q4.xlsx", size: "1.8 MB", modified: "Yesterday", type: "XLSX", owner: "Me" },
  { id: "gd-3", name: "Marketing_Campaign_KPIs.csv", size: "840 KB", modified: "Sep 21, 2026", type: "CSV", owner: "Marketing Team" },
  { id: "gd-4", name: "Staff_Directory_&_Payroll.xlsx", size: "3.1 MB", modified: "Sep 18, 2026", type: "XLSX", owner: "Finance" },
  { id: "gd-5", name: "Supply_Chain_Forecast_2026.xlsm", size: "4.5 MB", modified: "Sep 15, 2026", type: "XLSM", owner: "Operations" },
];

const DROPBOX_MOCK_FILES = [
  { id: "db-1", name: "Dropbox_Q4_Audit_Report.xlsx", size: "1.9 MB", modified: "Today, 09:45 AM", type: "XLSX" },
  { id: "db-2", name: "Inventory_Logistics_Matrix.xlsx", size: "2.2 MB", modified: "Sep 22, 2026", type: "XLSX" },
  { id: "db-3", name: "Client_Invoice_Dataset.csv", size: "650 KB", modified: "Sep 20, 2026", type: "CSV" },
  { id: "db-4", name: "Regional_Performance_2026.xlsx", size: "3.7 MB", modified: "Sep 17, 2026", type: "XLSX" },
];

interface CloudImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "gdrive" | "dropbox" | "link";
  onImportSuccess: (fileName: string, fileSize: string, source: string) => void;
}

export default function CloudImportModal({
  isOpen,
  onClose,
  initialTab = "gdrive",
  onImportSuccess
}: CloudImportModalProps) {
  const [activeTab, setActiveTab] = useState<"gdrive" | "dropbox" | "link">(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isConnectedGDrive, setIsConnectedGDrive] = useState(true);
  const [isConnectedDropbox, setIsConnectedDropbox] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setSearchQuery("");
      setUrlInput("");
      setSelectedFileId(null);
      setErrorMessage("");
      setIsLoading(false);
    }
  }, [isOpen, initialTab]);

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
      // Simulate network request & link parsing
      await new Promise((res) => setTimeout(res, 800));

      let fileName = "Cloud_Spreadsheet.xlsx";
      let fileSize = "1.8 MB";
      let source = "URL Link";

      // Google Drive / Google Sheets Parsing
      if (targetUrl.includes("docs.google.com/spreadsheets")) {
        fileName = "Google_Sheets_Document.xlsx";
        fileSize = "2.1 MB";
        source = "Google Sheets";
      } else if (targetUrl.includes("drive.google.com")) {
        fileName = "Google_Drive_File.xlsx";
        fileSize = "2.4 MB";
        source = "Google Drive";
      } else if (targetUrl.includes("dropbox.com")) {
        fileName = "Dropbox_Shared_Sheet.xlsx";
        fileSize = "1.9 MB";
        source = "Dropbox";
      } else {
        // Extract filename from direct link if available
        try {
          const parsed = new URL(targetUrl);
          const pathSegments = parsed.pathname.split("/").filter(Boolean);
          const lastSeg = pathSegments[pathSegments.length - 1];
          if (lastSeg && (lastSeg.endsWith(".xlsx") || lastSeg.endsWith(".xls") || lastSeg.endsWith(".csv") || lastSeg.endsWith(".xlsm"))) {
            fileName = decodeURIComponent(lastSeg);
          } else {
            fileName = "Imported_Dataset.xlsx";
          }
        } catch {
          fileName = "Web_Spreadsheet.xlsx";
        }
      }

      setIsLoading(false);
      onImportSuccess(fileName, fileSize, source);
      onClose();
    } catch {
      setIsLoading(false);
      setErrorMessage("Could not fetch file from the provided URL. Please check permissions or direct link.");
    }
  };

  const handleFileSelectAndImport = (file: { name: string; size: string }, source: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onImportSuccess(file.name, file.size, source);
      onClose();
    }, 600);
  };

  const filteredGDriveFiles = GDRIVE_MOCK_FILES.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDropboxFiles = DROPBOX_MOCK_FILES.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <span>Google Drive</span>
            </button>

            <button
              onClick={() => { setActiveTab("dropbox"); setErrorMessage(""); }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${activeTab === "dropbox"
                  ? "border-[#0061FF] text-[#0061FF] bg-white shadow-xs"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
            >
              <DropboxIcon className="w-4 h-4" />
              <span>Dropbox</span>
            </button>

            <button
              onClick={() => { setActiveTab("link"); setErrorMessage(""); }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${activeTab === "link"
                  ? "border-[#355BFF] text-[#355BFF] bg-white shadow-xs"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
            >
              <Link2 className="w-4 h-4" />
              <span>Google Drive / URL Link</span>
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

                {/* Google Drive Account Header & Search */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <FolderOpen className="w-4 h-4 text-blue-600" />
                    <span>My Google Drive Files</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                      Connected
                    </span>
                  </div>

                  <div className="relative w-48">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search Drive..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Google Drive Files List */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                  {filteredGDriveFiles.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => setSelectedFileId(file.id)}
                      className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${selectedFileId === file.id
                          ? "bg-blue-50/70 text-blue-900"
                          : "hover:bg-slate-50 text-slate-800"
                        }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <FileSpreadsheet className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate text-slate-900">{file.name}</p>
                          <p className="text-[10px] text-slate-500">{file.size} • Modified {file.modified}</p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileSelectAndImport(file, "Google Drive");
                        }}
                        className="px-3 py-1.5 bg-[#355BFF] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-95 shrink-0"
                      >
                        Convert to JPG
                      </button>
                    </div>
                  ))}
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

                {/* Dropbox Header & Search */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <FolderOpen className="w-4 h-4 text-[#0061FF]" />
                    <span>My Dropbox Spreadsheets</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                      Connected
                    </span>
                  </div>

                  <div className="relative w-48">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search Dropbox..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Dropbox Files List */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                  {filteredDropboxFiles.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => setSelectedFileId(file.id)}
                      className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${selectedFileId === file.id
                          ? "bg-blue-50/70 text-blue-900"
                          : "hover:bg-slate-50 text-slate-800"
                        }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0061FF] flex items-center justify-center shrink-0">
                          <FileSpreadsheet className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate text-slate-900">{file.name}</p>
                          <p className="text-[10px] text-slate-500">{file.size} • Modified {file.modified}</p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileSelectAndImport(file, "Dropbox");
                        }}
                        className="px-3 py-1.5 bg-[#0061FF] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-95 shrink-0"
                      >
                        Convert to JPG
                      </button>
                    </div>
                  ))}
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
                      placeholder="e.g. https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
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

                {/* Instant Quick-Test Samples */}
                <div className="pt-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Or Test with a Live Sample Sheet:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => handleUrlImport("https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/export?format=xlsx")}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50/40 text-left transition-all group"
                    >
                      <GoogleDriveIcon className="w-4 h-4 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 truncate">Google Sheets Financial Report</p>
                        <p className="text-[10px] text-slate-400">Public Google Sheet • 2.1 MB</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                    </button>

                    <button
                      onClick={() => handleUrlImport("https://www.dropbox.com/s/2026_Executive_Dashboard.xlsx?dl=1")}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50/40 text-left transition-all group"
                    >
                      <DropboxIcon className="w-4 h-4 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 truncate">Dropbox KPI Dashboard (.xlsx)</p>
                        <p className="text-[10px] text-slate-400">Dropbox File • 1.8 MB</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
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
