"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Link2,
  Sparkles,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clipboard,
  FileSpreadsheet,
  Share2,
  FolderOpen,
  Search,
  RefreshCw,
  LogOut,
  UserPlus,
  LogIn,
  Check
} from "lucide-react";

export function GoogleDriveIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/icons/logos_google-drive.png"
      alt="Google Drive"
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
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/icons/thesvg-color_dropbox.png"
      alt="Dropbox"
      width={24}
      height={24}
      className={`object-contain ${className}`}
      draggable={false}
      aria-hidden="true"
    />
  );
}

export interface CloudSpreadsheet {
  id: string;
  name: string;
  size: string;
  date: string;
  type: "xlsx" | "csv" | "xlsm" | "xls";
  mimeType?: string;
  url?: string;
}

function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function formatRelativeTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `Today, ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "Recent";
  }
}

interface CloudImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "gdrive" | "dropbox" | "link";
  onImportSuccess: (fileName: string, fileSize: string, source: string, url?: string, fileBlob?: File | null) => void;
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const DROPBOX_APP_KEY = process.env.NEXT_PUBLIC_DROPBOX_APP_KEY || "";

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
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successNotice, setSuccessNotice] = useState("");

  // App User Auth State (from site backend)
  const [siteUser, setSiteUser] = useState<{ full_name?: string; email?: string; auth_provider?: string } | null>(null);

  // Google Drive Connected State
  const [gdriveConnected, setGdriveConnected] = useState(false);
  const [gdriveToken, setGdriveToken] = useState<string | null>(null);
  const [gdriveUser, setGdriveUser] = useState<{ name?: string; email?: string; picture?: string } | null>(null);
  const [gdriveFiles, setGdriveFiles] = useState<CloudSpreadsheet[]>([]);
  const [isLoadingGdriveFiles, setIsLoadingGdriveFiles] = useState(false);
  const [isConnectingGdrive, setIsConnectingGdrive] = useState(false);

  // Dropbox Connected State
  const [dropboxConnected, setDropboxConnected] = useState(false);
  const [dropboxUser, setDropboxUser] = useState<{ name?: string; email?: string } | null>(null);
  const [dropboxFiles, setDropboxFiles] = useState<CloudSpreadsheet[]>([]);
  const [isLoadingDropboxFiles, setIsLoadingDropboxFiles] = useState(false);
  const [isConnectingDropbox, setIsConnectingDropbox] = useState(false);

  // Importing specific file
  const [importingFileId, setImportingFileId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Check site user auth status
  useEffect(() => {
    fetch("/api/py/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setSiteUser(data?.user ?? null))
      .catch(() => undefined);
  }, [isOpen]);

  // Load Google Identity Services SDK
  useEffect(() => {
    if (!document.getElementById("google-gis-sdk")) {
      const gisScript = document.createElement("script");
      gisScript.id = "google-gis-sdk";
      gisScript.src = "https://accounts.google.com/gsi/client";
      gisScript.async = true;
      gisScript.defer = true;
      document.body.appendChild(gisScript);
    }

    if (DROPBOX_APP_KEY && !document.getElementById("dropboxjs")) {
      const dbScript = document.createElement("script");
      dbScript.id = "dropboxjs";
      dbScript.src = "https://www.dropbox.com/static/api/2/dropins.js";
      dbScript.async = true;
      dbScript.defer = true;
      dbScript.setAttribute("data-app-key", DROPBOX_APP_KEY);
      document.body.appendChild(dbScript);
    }
  }, []);

  // Restore saved cloud connection
  useEffect(() => {
    try {
      const savedGToken = localStorage.getItem("gdrive_token");
      const savedGUser = localStorage.getItem("gdrive_user");
      if (savedGToken) {
        setGdriveToken(savedGToken);
        setGdriveConnected(true);
        if (savedGUser) {
          try {
            setGdriveUser(JSON.parse(savedGUser));
          } catch {
            // ignore
          }
        }
        void fetchRealGoogleDriveFiles(savedGToken);
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync initialTab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setErrorMessage("");
      setUrlInput("");
      setSuccessNotice("");
    }
  }, [initialTab, isOpen]);

  // Paste from clipboard helper
  const handlePasteClipboard = async () => {
    try {
      if (navigator?.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrlInput(text.trim());
          setErrorMessage("");
        }
      }
    } catch {
      // ignore
    }
  };

  /**
   * Fetch Real Files from Google Drive
   */
  const fetchRealGoogleDriveFiles = useCallback(async (token: string) => {
    setIsLoadingGdriveFiles(true);
    setErrorMessage("");
    try {
      // Fetch user profile
      try {
        const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (userRes.ok) {
          const u = await userRes.json();
          const userObj = { name: u.name, email: u.email, picture: u.picture };
          setGdriveUser(userObj);
          localStorage.setItem("gdrive_user", JSON.stringify(userObj));
        }
      } catch {
        // ignore profile error
      }

      // Query spreadsheets from Google Drive
      const query = `trashed=false and (mimeType='application/vnd.google-apps.spreadsheet' or mimeType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' or mimeType='application/vnd.ms-excel' or mimeType='text/csv' or name contains '.xlsx' or name contains '.csv' or name contains '.xls' or name contains '.xlsm')`;
      const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,size,modifiedTime,webViewLink)&orderBy=modifiedTime desc&pageSize=50`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        if (res.status === 401) {
          handleDisconnectGoogleDrive();
          throw new Error("Google Drive authorization expired. Please connect again.");
        }
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `Google Drive error (${res.status})`);
      }

      const data = await res.json();
      const files: CloudSpreadsheet[] = (data.files || []).map((f: any) => {
        const isSheet = f.mimeType === "application/vnd.google-apps.spreadsheet";
        const cleanName = isSheet && !f.name.endsWith(".xlsx") ? `${f.name}.xlsx` : f.name;
        const fileType: "xlsx" | "csv" | "xlsm" | "xls" = cleanName.endsWith(".csv")
          ? "csv"
          : cleanName.endsWith(".xlsm")
          ? "xlsm"
          : cleanName.endsWith(".xls")
          ? "xls"
          : "xlsx";

        return {
          id: f.id,
          name: cleanName,
          size: f.size ? formatBytes(parseInt(f.size)) : "Google Sheet",
          date: f.modifiedTime ? formatRelativeTime(f.modifiedTime) : "Recent",
          type: fileType,
          mimeType: f.mimeType,
          url: f.webViewLink,
        };
      });

      setGdriveFiles(files);
      setGdriveConnected(true);
      localStorage.setItem("gdrive_connected", "true");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load Google Drive files");
      setGdriveFiles([]);
    } finally {
      setIsLoadingGdriveFiles(false);
    }
  }, []);

  /**
   * Connect Google Drive with Google OAuth
   */
  const handleConnectGoogleDrive = () => {
    setIsConnectingGdrive(true);
    setErrorMessage("");
    setSuccessNotice("");

    const win = window as any;
    const clientId = GOOGLE_CLIENT_ID || (typeof window !== "undefined" ? localStorage.getItem("google_client_id") || "" : "");

    if (!clientId) {
      // If no client ID configured in env, guide user to sign up or use direct link
      setIsConnectingGdrive(false);
      setErrorMessage("To connect your Google Drive directly, please sign in or paste your Google Sheets link below.");
      return;
    }

    if (win.google?.accounts?.oauth2) {
      try {
        const tokenClient = win.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: "https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
          callback: async (tokenResponse: any) => {
            setIsConnectingGdrive(false);
            if (tokenResponse.error) {
              setErrorMessage(`Google authorization failed: ${tokenResponse.error_description || tokenResponse.error}`);
              return;
            }
            if (tokenResponse.access_token) {
              setGdriveToken(tokenResponse.access_token);
              localStorage.setItem("gdrive_token", tokenResponse.access_token);
              setSuccessNotice("Successfully connected to Google Drive!");
              await fetchRealGoogleDriveFiles(tokenResponse.access_token);
            }
          },
          error_callback: (error: any) => {
            setIsConnectingGdrive(false);
            setErrorMessage(`Google OAuth error: ${error.message || "Popup closed or blocked."}`);
          }
        });

        tokenClient.requestAccessToken({ prompt: "consent" });
        return;
      } catch (err: any) {
        setIsConnectingGdrive(false);
        setErrorMessage(`Google authentication initialization failed: ${err.message}`);
        return;
      }
    }

    setIsConnectingGdrive(false);
    setErrorMessage("Google Identity library is initializing. Please try again in a moment.");
  };

  const handleDisconnectGoogleDrive = () => {
    setGdriveConnected(false);
    setGdriveToken(null);
    setGdriveUser(null);
    setGdriveFiles([]);
    try {
      localStorage.removeItem("gdrive_token");
      localStorage.removeItem("gdrive_connected");
      localStorage.removeItem("gdrive_user");
    } catch {
      // ignore
    }
  };

  /**
   * Import real file directly from Google Drive
   */
  const handleImportGoogleFile = async (fileItem: CloudSpreadsheet) => {
    if (!gdriveToken) return;
    setImportingFileId(fileItem.id);
    setErrorMessage("");

    try {
      let downloadUrl = "";
      if (fileItem.mimeType === "application/vnd.google-apps.spreadsheet") {
        downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileItem.id}/export?mimeType=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`;
      } else {
        downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileItem.id}?alt=media`;
      }

      const res = await fetch(downloadUrl, {
        headers: { Authorization: `Bearer ${gdriveToken}` }
      });

      if (!res.ok) {
        throw new Error(`Google Drive download failed (HTTP ${res.status})`);
      }

      const blob = await res.blob();
      const fileObject = new File([blob], fileItem.name, {
        type: blob.type || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });

      onImportSuccess(fileItem.name, fileItem.size, "Google Drive", fileItem.url, fileObject);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to download spreadsheet from Google Drive.");
    } finally {
      setImportingFileId(null);
    }
  };

  /**
   * Universal Cloud Import via Server-Side `/api/cloud-import`
   */
  const handleImportUrl = async (targetUrl?: string) => {
    const rawUrl = (targetUrl || urlInput).trim();
    if (!rawUrl) {
      setErrorMessage(
        activeTab === "gdrive"
          ? "Please paste your Google Drive or Google Sheets link."
          : activeTab === "dropbox"
          ? "Please paste your Dropbox file share link."
          : "Please enter a valid file URL."
      );
      return;
    }

    setErrorMessage("");
    setIsLoading(true);
    setStatusMessage("Connecting to cloud server...");

    try {
      setStatusMessage("Fetching & converting spreadsheet...");
      const res = await fetch("/api/cloud-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: rawUrl })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to import remote file.");
      }

      setStatusMessage("Preparing document for conversion...");

      // Convert Base64 payload back to a native File Blob
      const binaryString = atob(data.base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const fileBlob = new File([bytes], data.fileName, {
        type: data.mimeType || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });

      // Pass directly to the converter
      onImportSuccess(
        data.fileName,
        formatBytes(data.sizeBytes),
        data.source || "Cloud Import",
        rawUrl,
        fileBlob
      );

      setIsLoading(false);
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      setStatusMessage("");
      setErrorMessage(
        err.message || "Could not access the remote file. Please make sure the link is publicly viewable."
      );
    }
  };

  const filteredGdriveFiles = useMemo(() => {
    if (!searchQuery.trim()) return gdriveFiles;
    return gdriveFiles.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [gdriveFiles, searchQuery]);

  if (!isOpen) return null;

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
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 flex flex-col my-auto"
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
                  {activeTab === "gdrive" && "Import from Google Drive / Sheets"}
                  {activeTab === "dropbox" && "Import from Dropbox"}
                  {activeTab === "link" && "Import from Web URL / Cloud Link"}
                </h3>
                <p className="text-xs text-slate-500">
                  Connect your account or paste a share link to convert
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 pt-3 border-b border-slate-100 flex gap-2 bg-white">
            <button
              type="button"
              onClick={() => {
                setActiveTab("gdrive");
                setErrorMessage("");
                setSuccessNotice("");
                setUrlInput("");
              }}
              className={`pb-2.5 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === "gdrive"
                  ? "border-[#355BFF] text-[#355BFF]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <GoogleDriveIcon className="w-4 h-4" />
              <span>Google Drive</span>
              {gdriveConnected && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("dropbox");
                setErrorMessage("");
                setSuccessNotice("");
                setUrlInput("");
              }}
              className={`pb-2.5 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === "dropbox"
                  ? "border-[#0061FF] text-[#0061FF]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <DropboxIcon className="w-4 h-4" />
              <span>Dropbox</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("link");
                setErrorMessage("");
                setSuccessNotice("");
                setUrlInput("");
              }}
              className={`pb-2.5 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === "link"
                  ? "border-[#355BFF] text-[#355BFF]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span>Web URL / Direct</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            
            {/* Success Notification Banner */}
            {successNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSuccessNotice("")}
                  className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Error Notification Banner */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs flex items-start justify-between gap-2 shadow-xs"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage("")}
                  className="text-amber-700 hover:text-amber-900 shrink-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}

            {/* TAB 1: GOOGLE DRIVE */}
            {activeTab === "gdrive" && (
              <div className="space-y-4">
                
                {/* 1. Account Connect / Sign-in Card */}
                {!gdriveConnected ? (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white border border-blue-100 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-blue-100 flex items-center justify-center shrink-0">
                          <GoogleDriveIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">
                            Connect your Google Account
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Sign in with Google to browse and import your Google Drive files directly.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                      {/* Direct Google Sign In Button */}
                      <button
                        type="button"
                        onClick={handleConnectGoogleDrive}
                        disabled={isConnectingGdrive}
                        className="w-full sm:w-auto px-4 py-2 bg-[#355BFF] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        {isConnectingGdrive ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Connecting...</span>
                          </>
                        ) : (
                          <>
                            <GoogleDriveIcon className="w-3.5 h-3.5" />
                            <span>Continue with Google</span>
                          </>
                        )}
                      </button>

                      {/* Create Free Account button */}
                      <Link
                        href="/signup"
                        onClick={onClose}
                        className="w-full sm:w-auto px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-blue-600" />
                        <span>Create Account</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* Connected Google Drive State */
                  <div className="space-y-3">
                    {/* User Profile Bar */}
                    <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {gdriveUser?.picture ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={gdriveUser.picture}
                            alt=""
                            className="w-8 h-8 rounded-full border border-blue-200 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#355BFF] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {gdriveUser?.name ? gdriveUser.name[0] : "G"}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {gdriveUser?.name || "Google Account Connected"}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {gdriveUser?.email || "Google Drive"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => gdriveToken && fetchRealGoogleDriveFiles(gdriveToken)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
                          title="Refresh Files"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingGdriveFiles ? "animate-spin text-blue-600" : ""}`} />
                        </button>
                        <button
                          type="button"
                          onClick={handleDisconnectGoogleDrive}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                          title="Disconnect Google Drive"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Search & File Browser */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search your Google Drive spreadsheets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-xs pl-8 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                      />
                    </div>

                    {/* Google Drive Files List */}
                    <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-2xs">
                      {isLoadingGdriveFiles ? (
                        <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-500 text-xs">
                          <Loader2 className="w-5 h-5 animate-spin text-[#355BFF]" />
                          <span>Loading your spreadsheets...</span>
                        </div>
                      ) : filteredGdriveFiles.length === 0 ? (
                        <div className="py-8 text-center space-y-1.5">
                          <FileSpreadsheet className="w-7 h-7 text-slate-300 mx-auto" />
                          <p className="text-xs font-semibold text-slate-700">
                            {searchQuery ? "No matching spreadsheets found." : "No spreadsheets found in your Google Drive."}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            You can paste a Google Sheets share link below.
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100 max-h-52 overflow-y-auto">
                          {filteredGdriveFiles.map((f) => (
                            <div
                              key={f.id}
                              className="p-2.5 flex items-center justify-between gap-2.5 hover:bg-blue-50/40 transition-colors group"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                                  <FileSpreadsheet className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                                    {f.name}
                                  </p>
                                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                    <span className="px-1 py-0.2 bg-slate-100 text-slate-600 rounded text-[9px] uppercase font-bold">
                                      {f.type}
                                    </span>
                                    <span>{f.size}</span>
                                    <span>•</span>
                                    <span>{f.date}</span>
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleImportGoogleFile(f)}
                                disabled={importingFileId === f.id}
                                className="px-2.5 py-1.5 bg-[#355BFF] hover:bg-blue-700 disabled:opacity-50 text-white text-[11px] font-semibold rounded-lg shadow-2xs transition-all flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
                              >
                                {importingFileId === f.id ? (
                                  <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    <span>Importing...</span>
                                  </>
                                ) : (
                                  <>
                                    <span>Import</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </>
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Instant Link Import Option (No Account Required) */}
                <div className="pt-2 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Or Paste Google Sheets Share Link</span>
                    </label>
                    <span className="text-[10px] text-slate-400">No login required</span>
                  </div>

                  <div className="relative flex items-center">
                    <input
                      type="url"
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleImportUrl()}
                      disabled={isLoading}
                      className="w-full text-xs pl-3.5 pr-20 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                    />

                    <div className="absolute right-1.5 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handlePasteClipboard}
                        disabled={isLoading}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                        title="Paste from clipboard"
                      >
                        <Clipboard className="w-3 h-3 text-slate-500" />
                        <span>Paste</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleImportUrl()}
                    disabled={isLoading || !urlInput.trim()}
                    className="w-full py-2.5 bg-[#355BFF] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{statusMessage || "Importing..."}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Import & Convert Google Sheet</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 3-Step Guided How-To Card */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <Share2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>How to get your Google Sheets link:</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-600">
                    <div className="p-2 rounded-lg bg-white border border-slate-200/60 space-y-0.5">
                      <span className="font-bold text-blue-600">1. Open Sheet</span>
                      <p className="text-slate-500">Open in Google Sheets.</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200/60 space-y-0.5">
                      <span className="font-bold text-blue-600">2. Click Share</span>
                      <p className="text-slate-500">Set to &quot;Anyone with link&quot;.</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200/60 space-y-0.5">
                      <span className="font-bold text-blue-600">3. Paste & Convert</span>
                      <p className="text-slate-500">Paste above to convert!</p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: DROPBOX */}
            {activeTab === "dropbox" && (
              <div className="space-y-4">
                
                {/* 1. Account Connect / Sign-in Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50/70 via-blue-50/40 to-white border border-sky-100 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-sky-100 flex items-center justify-center shrink-0">
                      <DropboxIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Import from Dropbox
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Paste your Dropbox share link or sign in to import spreadsheets.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Dropbox Link Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <DropboxIcon className="w-4 h-4" />
                      <span>Paste Dropbox File Link</span>
                    </span>
                    <span className="text-[11px] font-normal text-slate-400">
                      Supports .xlsx, .xls, .csv, .xlsm
                    </span>
                  </label>

                  <div className="relative flex items-center">
                    <input
                      type="url"
                      placeholder="https://www.dropbox.com/s/..."
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleImportUrl()}
                      disabled={isLoading}
                      className="w-full text-xs pl-3.5 pr-20 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0061FF] focus:bg-white transition-all placeholder:text-slate-400"
                    />

                    <div className="absolute right-1.5 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handlePasteClipboard}
                        disabled={isLoading}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                        title="Paste from clipboard"
                      >
                        <Clipboard className="w-3 h-3 text-slate-500" />
                        <span>Paste</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Convert Button */}
                <button
                  type="button"
                  onClick={() => handleImportUrl()}
                  disabled={isLoading || !urlInput.trim()}
                  className="w-full py-2.5 bg-[#0061FF] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{statusMessage || "Importing..."}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Import & Convert Dropbox File</span>
                    </>
                  )}
                </button>

                {/* Dropbox 3-step guide */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <Share2 className="w-3.5 h-3.5 text-[#0061FF]" />
                    <span>How to get your Dropbox link:</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-600">
                    <div className="p-2 rounded-lg bg-white border border-slate-200/60 space-y-0.5">
                      <span className="font-bold text-[#0061FF]">1. Locate File</span>
                      <p className="text-slate-500">Go to your Dropbox file.</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200/60 space-y-0.5">
                      <span className="font-bold text-[#0061FF]">2. Copy Link</span>
                      <p className="text-slate-500">Click &quot;Copy link&quot; or Share.</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200/60 space-y-0.5">
                      <span className="font-bold text-[#0061FF]">3. Paste & Open</span>
                      <p className="text-slate-500">Paste above to convert!</p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: UNIVERSAL LINK / WEB URL */}
            {activeTab === "link" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Link2 className="w-4 h-4 text-blue-600" />
                      <span>Enter Any Spreadsheet Web URL</span>
                    </span>
                    <span className="text-[11px] font-normal text-slate-400">
                      Direct .xlsx, .xls, .csv, OneDrive, or S3
                    </span>
                  </label>

                  <div className="relative flex items-center">
                    <input
                      type="url"
                      placeholder="https://example.com/reports/financial_q4.xlsx"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleImportUrl()}
                      disabled={isLoading}
                      className="w-full text-xs pl-3.5 pr-20 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400 font-mono"
                    />

                    <div className="absolute right-1.5 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handlePasteClipboard}
                        disabled={isLoading}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                        title="Paste from clipboard"
                      >
                        <Clipboard className="w-3 h-3 text-slate-500" />
                        <span>Paste</span>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleImportUrl()}
                  disabled={isLoading || !urlInput.trim()}
                  className="w-full py-2.5 bg-[#355BFF] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{statusMessage || "Importing..."}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Import & Convert Spreadsheet</span>
                    </>
                  )}
                </button>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Our secure cloud engine connects directly to the URL, reads the worksheet data securely in memory, and immediately renders it in your converter.
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Direct encrypted cloud pipeline • Zero files permanently stored</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
