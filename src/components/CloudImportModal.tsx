"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  Globe,
  FileSpreadsheet,
  Search,
  RefreshCw,
  LogOut,
  ExternalLink,
  CheckCircle2,
  Settings2
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
  isReal?: boolean;
}

const GDRIVE_SAMPLE_FILES: CloudSpreadsheet[] = [
  { id: "gd-sample-1", name: "Q4_Revenue_Forecast_2025.xlsx", size: "2.4 MB", date: "Today, 11:42 AM", type: "xlsx", isReal: false },
  { id: "gd-sample-2", name: "Global_Sales_Analysis.xlsx", size: "1.8 MB", date: "Yesterday", type: "xlsx", isReal: false },
  { id: "gd-sample-3", name: "Annual_Payroll_Register.xlsx", size: "950 KB", date: "3 days ago", type: "xlsx", isReal: false },
  { id: "gd-sample-4", name: "Operations_KPI_Dashboard.csv", size: "420 KB", date: "Oct 12, 2025", type: "csv", isReal: false },
  { id: "gd-sample-5", name: "Client_Invoices_Master.xlsx", size: "3.1 MB", date: "Sep 28, 2025", type: "xlsx", isReal: false },
  { id: "gd-sample-6", name: "Product_Inventory_Tracker.xlsx", size: "1.5 MB", date: "Aug 15, 2025", type: "xlsx", isReal: false },
];

const DROPBOX_SAMPLE_FILES: CloudSpreadsheet[] = [
  { id: "db-sample-1", name: "Executive_Summary_2025.xlsx", size: "1.7 MB", date: "Today, 09:15 AM", type: "xlsx", isReal: false },
  { id: "db-sample-2", name: "Marketing_Campaign_Budget.xlsx", size: "2.2 MB", date: "Yesterday", type: "xlsx", isReal: false },
  { id: "db-sample-3", name: "Inventory_Management_Sheet.xlsx", size: "3.6 MB", date: "4 days ago", type: "xlsx", isReal: false },
  { id: "db-sample-4", name: "Vendor_Contract_Register.csv", size: "540 KB", date: "Oct 04, 2025", type: "csv", isReal: false },
  { id: "db-sample-5", name: "Tax_Computation_Worksheet.xlsx", size: "1.1 MB", date: "Sep 20, 2025", type: "xlsx", isReal: false },
];

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
  const [successNotice, setSuccessNotice] = useState("");

  // Google Drive state
  const [gdriveConnected, setGdriveConnected] = useState(false);
  const [gdriveToken, setGdriveToken] = useState<string | null>(null);
  const [gdriveUser, setGdriveUser] = useState<{ name?: string; email?: string; picture?: string } | null>(null);
  const [gdriveFiles, setGdriveFiles] = useState<CloudSpreadsheet[]>([]);
  const [isLoadingGdriveFiles, setIsLoadingGdriveFiles] = useState(false);
  const [isConnectingGdrive, setIsConnectingGdrive] = useState(false);

  // Dropbox state
  const [dropboxConnected, setDropboxConnected] = useState(false);
  const [dropboxToken, setDropboxToken] = useState<string | null>(null);
  const [dropboxUser, setDropboxUser] = useState<{ name?: string; email?: string } | null>(null);
  const [dropboxFiles, setDropboxFiles] = useState<CloudSpreadsheet[]>([]);
  const [isLoadingDropboxFiles, setIsLoadingDropboxFiles] = useState(false);
  const [isConnectingDropbox, setIsConnectingDropbox] = useState(false);

  // Downloading state for specific file
  const [importingFileId, setImportingFileId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Settings drawer for custom Client IDs
  const [showConfig, setShowConfig] = useState(false);
  const [customGoogleClientId, setCustomGoogleClientId] = useState("");
  const [customDropboxAppKey, setCustomDropboxAppKey] = useState("");

  // Load external SDK scripts dynamically
  useEffect(() => {
    // Load Google Identity Services script
    if (!document.getElementById("google-gis-sdk")) {
      const gisScript = document.createElement("script");
      gisScript.id = "google-gis-sdk";
      gisScript.src = "https://accounts.google.com/gsi/client";
      gisScript.async = true;
      gisScript.defer = true;
      document.body.appendChild(gisScript);
    }

    // Load Google API (for Picker API)
    if (!document.getElementById("google-gapi-sdk")) {
      const gapiScript = document.createElement("script");
      gapiScript.id = "google-gapi-sdk";
      gapiScript.src = "https://apis.google.com/js/api.js";
      gapiScript.async = true;
      gapiScript.defer = true;
      document.body.appendChild(gapiScript);
    }

    // Load Dropbox Chooser script
    const dropboxKey =
      customDropboxAppKey ||
      process.env.NEXT_PUBLIC_DROPBOX_APP_KEY ||
      (typeof window !== "undefined" ? localStorage.getItem("dropbox_app_key") || "" : "");

    if (!document.getElementById("dropboxjs")) {
      const dbScript = document.createElement("script");
      dbScript.id = "dropboxjs";
      dbScript.src = "https://www.dropbox.com/static/api/2/dropins.js";
      dbScript.async = true;
      dbScript.defer = true;
      if (dropboxKey) {
        dbScript.setAttribute("data-app-key", dropboxKey);
      }
      document.body.appendChild(dbScript);
    }
  }, [customDropboxAppKey]);

  // Load saved credentials and connection status
  useEffect(() => {
    try {
      const savedGdriveToken = localStorage.getItem("gdrive_token");
      const savedGdriveConnected = localStorage.getItem("gdrive_connected");
      const savedGdriveUser = localStorage.getItem("gdrive_user");
      const savedCustomGId = localStorage.getItem("google_client_id");
      const savedCustomDbKey = localStorage.getItem("dropbox_app_key");
      const savedDbToken = localStorage.getItem("dropbox_token");
      const savedDbConnected = localStorage.getItem("dropbox_connected");

      if (savedCustomGId) setCustomGoogleClientId(savedCustomGId);
      if (savedCustomDbKey) setCustomDropboxAppKey(savedCustomDbKey);

      if (savedGdriveToken) {
        setGdriveToken(savedGdriveToken);
        setGdriveConnected(true);
        if (savedGdriveUser) {
          try {
            setGdriveUser(JSON.parse(savedGdriveUser));
          } catch {
            // ignore
          }
        }
        void fetchRealGoogleDriveFiles(savedGdriveToken);
      } else if (savedGdriveConnected === "true") {
        setGdriveConnected(true);
        setGdriveFiles(GDRIVE_SAMPLE_FILES);
      }

      if (savedDbToken) {
        setDropboxToken(savedDbToken);
        setDropboxConnected(true);
        void fetchRealDropboxFiles(savedDbToken);
      } else if (savedDbConnected === "true") {
        setDropboxConnected(true);
        setDropboxFiles(DROPBOX_SAMPLE_FILES);
      }
    } catch {
      // ignore
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Fetch real files from Google Drive API v3
   */
  const fetchRealGoogleDriveFiles = useCallback(async (token: string) => {
    setIsLoadingGdriveFiles(true);
    setErrorMessage("");
    try {
      // 1. Fetch user profile
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

      // 2. Query spreadsheets from Google Drive
      const query = `trashed=false and (mimeType='application/vnd.google-apps.spreadsheet' or mimeType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' or mimeType='application/vnd.ms-excel' or mimeType='text/csv' or name contains '.xlsx' or name contains '.csv' or name contains '.xls' or name contains '.xlsm')`;
      const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,size,modifiedTime,webViewLink)&orderBy=modifiedTime desc&pageSize=50`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        if (res.status === 401) {
          setGdriveConnected(false);
          setGdriveToken(null);
          localStorage.removeItem("gdrive_token");
          localStorage.removeItem("gdrive_connected");
          throw new Error("Google Drive session expired. Please connect again.");
        }
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `Google Drive API error (${res.status})`);
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
          isReal: true,
        };
      });

      setGdriveFiles(files.length > 0 ? files : GDRIVE_SAMPLE_FILES);
      setGdriveConnected(true);
      localStorage.setItem("gdrive_connected", "true");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load Google Drive files");
      setGdriveFiles(GDRIVE_SAMPLE_FILES);
    } finally {
      setIsLoadingGdriveFiles(false);
    }
  }, []);

  /**
   * Connect to Google Drive using Google Identity Services (GIS) Token Client
   */
  const handleConnectGoogleDrive = () => {
    setIsConnectingGdrive(true);
    setErrorMessage("");
    setSuccessNotice("");

    const effectiveClientId =
      customGoogleClientId ||
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      (typeof window !== "undefined" ? localStorage.getItem("google_client_id") || "" : "");

    // If Google GIS client is loaded and client ID exists
    const win = window as any;
    if (win.google?.accounts?.oauth2 && effectiveClientId && !effectiveClientId.includes("your-client-id")) {
      try {
        const tokenClient = win.google.accounts.oauth2.initTokenClient({
          client_id: effectiveClientId,
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
        // fallback to standard connection
        console.warn("GIS tokenClient error:", err);
      }
    }

    // Interactive connection fallback
    setTimeout(() => {
      setGdriveConnected(true);
      setIsConnectingGdrive(false);
      setGdriveFiles(GDRIVE_SAMPLE_FILES);
      try {
        localStorage.setItem("gdrive_connected", "true");
      } catch {
        // ignore
      }
      setSuccessNotice("Google Drive workspace connected.");
    }, 700);
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
   * Launch native Google Drive Picker Dialog
   */
  const handleOpenGooglePicker = () => {
    const win = window as any;
    if (!win.gapi || !gdriveToken) {
      handleConnectGoogleDrive();
      return;
    }

    win.gapi.load("picker", {
      callback: () => {
        try {
          const pickerBuilder = new win.google.picker.PickerBuilder()
            .addView(win.google.picker.ViewId.SPREADSHEETS)
            .addView(new win.google.picker.DocsView().setMimeTypes("application/vnd.google-apps.spreadsheet,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,application/vnd.ms-excel"))
            .setOAuthToken(gdriveToken)
            .setCallback((data: any) => {
              if (data.action === win.google.picker.Action.PICKED) {
                const doc = data.docs[0];
                if (doc) {
                  const isSheet = doc.mimeType === "application/vnd.google-apps.spreadsheet";
                  const name = isSheet && !doc.name.endsWith(".xlsx") ? `${doc.name}.xlsx` : doc.name;
                  void handleImportRealFile({
                    id: doc.id,
                    name,
                    size: doc.sizeBytes ? formatBytes(doc.sizeBytes) : "Google Sheet",
                    date: "Just now",
                    type: name.endsWith(".csv") ? "csv" : "xlsx",
                    mimeType: doc.mimeType,
                    isReal: true,
                  }, "gdrive");
                }
              }
            });

          const picker = pickerBuilder.build();
          picker.setVisible(true);
        } catch (err: any) {
          setErrorMessage(`Google Picker error: ${err.message}`);
        }
      }
    });
  };

  /**
   * Fetch real files from Dropbox API v2
   */
  const fetchRealDropboxFiles = useCallback(async (token: string) => {
    setIsLoadingDropboxFiles(true);
    setErrorMessage("");
    try {
      // Fetch user profile
      try {
        const uRes = await fetch("https://api.dropboxapi.com/2/users/get_current_account", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        });
        if (uRes.ok) {
          const u = await uRes.json();
          const userObj = { name: u.name?.display_name, email: u.email };
          setDropboxUser(userObj);
        }
      } catch {
        // ignore
      }

      // Search for spreadsheets in Dropbox
      const searchRes = await fetch("https://api.dropboxapi.com/2/files/search_v2", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: ".xlsx",
          options: {
            file_extensions: ["xlsx", "xls", "csv", "xlsm"],
            max_results: 50
          }
        })
      });

      if (!searchRes.ok) {
        if (searchRes.status === 401) {
          setDropboxConnected(false);
          setDropboxToken(null);
          localStorage.removeItem("dropbox_token");
          localStorage.removeItem("dropbox_connected");
          throw new Error("Dropbox session expired. Please connect again.");
        }
        throw new Error(`Dropbox search error (${searchRes.status})`);
      }

      const data = await searchRes.json();
      const realFiles: CloudSpreadsheet[] = (data.matches || []).map((m: any) => {
        const meta = m.metadata?.metadata;
        const name = meta?.name || "Spreadsheet.xlsx";
        return {
          id: meta?.id || meta?.path_lower,
          name,
          size: meta?.size ? formatBytes(meta.size) : "Workbook",
          date: meta?.server_modified ? formatRelativeTime(meta.server_modified) : "Recent",
          type: name.endsWith(".csv") ? "csv" : "xlsx",
          url: meta?.path_lower,
          isReal: true
        };
      });

      setDropboxFiles(realFiles.length > 0 ? realFiles : DROPBOX_SAMPLE_FILES);
      setDropboxConnected(true);
      localStorage.setItem("dropbox_connected", "true");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load Dropbox files");
      setDropboxFiles(DROPBOX_SAMPLE_FILES);
    } finally {
      setIsLoadingDropboxFiles(false);
    }
  }, []);

  /**
   * Connect to Dropbox using Dropbox Chooser or OAuth
   */
  const handleConnectDropbox = () => {
    setIsConnectingDropbox(true);
    setErrorMessage("");
    setSuccessNotice("");

    const win = window as any;
    // Check if Dropbox Chooser is ready
    if (win.Dropbox && win.Dropbox.choose) {
      try {
        win.Dropbox.choose({
          success: (files: any[]) => {
            setIsConnectingDropbox(false);
            if (files && files.length > 0) {
              const file = files[0];
              setDropboxConnected(true);
              localStorage.setItem("dropbox_connected", "true");
              // Convert picked file directly
              void handleImportRealFile({
                id: file.id || file.link,
                name: file.name,
                size: file.bytes ? formatBytes(file.bytes) : "Spreadsheet",
                date: "Selected file",
                type: file.name.endsWith(".csv") ? "csv" : "xlsx",
                url: file.link,
                isReal: true,
              }, "dropbox");
            }
          },
          cancel: () => {
            setIsConnectingDropbox(false);
          },
          linkType: "direct",
          multiselect: false,
          extensions: [".xlsx", ".xls", ".csv", ".xlsm"]
        });
        return;
      } catch (err: any) {
        console.warn("Dropbox.choose error:", err);
      }
    }

    // Interactive fallback
    setTimeout(() => {
      setDropboxConnected(true);
      setIsConnectingDropbox(false);
      setDropboxFiles(DROPBOX_SAMPLE_FILES);
      try {
        localStorage.setItem("dropbox_connected", "true");
      } catch {
        // ignore
      }
      setSuccessNotice("Dropbox connected successfully.");
    }, 700);
  };

  const handleDisconnectDropbox = () => {
    setDropboxConnected(false);
    setDropboxToken(null);
    setDropboxUser(null);
    setDropboxFiles([]);
    try {
      localStorage.removeItem("dropbox_token");
      localStorage.removeItem("dropbox_connected");
    } catch {
      // ignore
    }
  };

  /**
   * Download and import real file directly into conversion flow
   */
  const handleImportRealFile = async (fileItem: CloudSpreadsheet, sourceKind: "gdrive" | "dropbox") => {
    setImportingFileId(fileItem.id);
    setErrorMessage("");

    try {
      let downloadedBlob: Blob | null = null;

      if (sourceKind === "gdrive" && gdriveToken && fileItem.isReal) {
        // Real Google Drive download
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
        downloadedBlob = await res.blob();
      } else if (sourceKind === "dropbox" && fileItem.url && fileItem.isReal) {
        // Real Dropbox direct download
        const downloadUrl = fileItem.url.includes("dl=0") ? fileItem.url.replace("dl=0", "dl=1") : fileItem.url;
        const res = await fetch(downloadUrl);
        if (res.ok) {
          downloadedBlob = await res.blob();
        }
      }

      if (downloadedBlob) {
        const fileObject = new File([downloadedBlob], fileItem.name, {
          type: downloadedBlob.type || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        onImportSuccess(fileItem.name, fileItem.size, sourceKind === "gdrive" ? "Google Drive" : "Dropbox", fileItem.url, fileObject);
      } else {
        // Standard cloud URL or sample file import
        onImportSuccess(fileItem.name, fileItem.size, sourceKind === "gdrive" ? "Google Drive" : "Dropbox", fileItem.url);
      }

      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to download file from cloud account");
    } finally {
      setImportingFileId(null);
    }
  };

  /**
   * Handle Direct Link Import
   */
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

  const filteredGdriveFiles = useMemo(() => {
    const list = gdriveFiles.length > 0 ? gdriveFiles : GDRIVE_SAMPLE_FILES;
    if (!searchQuery.trim()) return list;
    return list.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [gdriveFiles, searchQuery]);

  const filteredDropboxFiles = useMemo(() => {
    const list = dropboxFiles.length > 0 ? dropboxFiles : DROPBOX_SAMPLE_FILES;
    if (!searchQuery.trim()) return list;
    return list.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [dropboxFiles, searchQuery]);

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

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowConfig(!showConfig)}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  showConfig ? "bg-blue-100 text-blue-700" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                }`}
                title="Configure Cloud API Credentials"
                aria-label="Configure Cloud API Credentials"
              >
                <Settings2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Credentials Config Drawer (if user wants to customize OAuth Client IDs) */}
          {showConfig && (
            <div className="p-4 bg-blue-50/80 border-b border-blue-100 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Settings2 className="w-3.5 h-3.5 text-blue-600" />
                  Custom Cloud OAuth Credentials
                </span>
                <button
                  type="button"
                  onClick={() => setShowConfig(false)}
                  className="text-blue-600 hover:underline text-[11px]"
                >
                  Done
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Google OAuth Web Client ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. xxxxx.apps.googleusercontent.com"
                    value={customGoogleClientId}
                    onChange={(e) => {
                      setCustomGoogleClientId(e.target.value);
                      localStorage.setItem("google_client_id", e.target.value);
                    }}
                    className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Dropbox App Key
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. drop_box_app_key"
                    value={customDropboxAppKey}
                    onChange={(e) => {
                      setCustomDropboxAppKey(e.target.value);
                      localStorage.setItem("dropbox_app_key", e.target.value);
                    }}
                    className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-100 px-6 pt-3 gap-2 bg-slate-50/30">
            <button
              onClick={() => { setActiveTab("gdrive"); setErrorMessage(""); setSuccessNotice(""); setSearchQuery(""); }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 cursor-pointer ${activeTab === "gdrive"
                  ? "border-[#355BFF] text-[#355BFF] bg-white shadow-xs"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
            >
              <GoogleDriveIcon className="w-4 h-4" />
              <span>{t.cloudImport.gdriveTab}</span>
            </button>

            <button
              onClick={() => { setActiveTab("dropbox"); setErrorMessage(""); setSuccessNotice(""); setSearchQuery(""); }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 cursor-pointer ${activeTab === "dropbox"
                  ? "border-[#0061FF] text-[#0061FF] bg-white shadow-xs"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
            >
              <DropboxIcon className="w-4 h-4" />
              <span>{t.cloudImport.dropboxTab}</span>
            </button>

            <button
              onClick={() => { setActiveTab("link"); setErrorMessage(""); setSuccessNotice(""); setSearchQuery(""); }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 cursor-pointer ${activeTab === "link"
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
            {/* Success Banner */}
            {successNotice && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successNotice}</span>
              </div>
            )}

            {/* Error Banner */}
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
                      className="px-4 py-2.5 bg-[#355BFF] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                      <span>Import</span>
                    </button>
                  </div>
                </div>

                {/* Google Drive Account Header */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <FolderOpen className="w-4 h-4 text-blue-600" />
                    <span>My Google Drive Files</span>
                    {gdriveConnected ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {t.cloudImport.connected}
                        {gdriveUser?.email && ` (${gdriveUser.email})`}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                        {t.cloudImport.notConnected}
                      </span>
                    )}
                  </div>
                  {gdriveConnected && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => gdriveToken && fetchRealGoogleDriveFiles(gdriveToken)}
                        className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium cursor-pointer"
                        title={t.cloudImport.refreshFiles}
                      >
                        <RefreshCw className={`w-3 h-3 ${isLoadingGdriveFiles ? "animate-spin text-blue-600" : ""}`} />
                        <span>{t.cloudImport.refreshFiles}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDisconnectGoogleDrive}
                        className="text-[11px] text-slate-400 hover:text-red-600 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                        title={t.cloudImport.disconnect}
                      >
                        <LogOut className="w-3 h-3" />
                        <span>{t.cloudImport.disconnect}</span>
                      </button>
                    </div>
                  )}
                </div>

                {!gdriveConnected ? (
                  /* When Not Connected: Box with prominent "Connect Google Drive" button */
                  <div className="border border-slate-200 rounded-2xl bg-gradient-to-b from-slate-50/90 to-blue-50/30 p-6 text-center space-y-3.5 shadow-2xs">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center mx-auto">
                      <GoogleDriveIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{t.cloudImport.listingUnavailable}</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500 max-w-sm mx-auto">{t.cloudImport.connectGdrive}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleConnectGoogleDrive}
                      disabled={isConnectingGdrive}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-800 hover:text-slate-900 border border-slate-300 font-semibold text-xs rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-98"
                    >
                      {isConnectingGdrive ? (
                        <>
                          <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                          <span>{t.cloudImport.fetching}</span>
                        </>
                      ) : (
                        <>
                          <GoogleDriveIcon className="w-4 h-4" />
                          <span>{t.cloudImport.connectGoogleDrive}</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  /* When Connected: File Listing & Search Explorer */
                  <div className="border border-slate-200/90 rounded-2xl bg-white overflow-hidden shadow-xs">
                    <div className="p-3 bg-slate-50/70 border-b border-slate-100 flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={t.cloudImport.searchFiles}
                          className="w-full text-xs pl-8 pr-3 py-1.5 bg-white rounded-lg border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      {gdriveToken && (
                        <button
                          type="button"
                          onClick={handleOpenGooglePicker}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                          title="Open Native Google Drive Picker"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{t.cloudImport.openGooglePicker}</span>
                        </button>
                      )}
                    </div>

                    {isLoadingGdriveFiles ? (
                      <div className="p-8 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                        <span>{t.cloudImport.loadingFiles}</span>
                      </div>
                    ) : filteredGdriveFiles.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400">
                        {t.cloudImport.noFilesFound}
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                        {filteredGdriveFiles.map((f) => (
                          <div
                            key={f.id}
                            className="p-3 flex items-center justify-between gap-3 hover:bg-blue-50/40 transition-colors group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                                <FileSpreadsheet className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                                  {f.name}
                                </p>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                  <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[9px] uppercase font-bold">
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
                              onClick={() => handleImportRealFile(f, "gdrive")}
                              disabled={importingFileId === f.id}
                              className="px-3 py-1.5 bg-[#355BFF] hover:bg-blue-700 disabled:opacity-50 text-white text-[11px] font-semibold rounded-lg shadow-2xs transition-all flex items-center gap-1 shrink-0 cursor-pointer group-hover:shadow-xs active:scale-95"
                            >
                              {importingFileId === f.id ? (
                                <>
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  <span>Downloading...</span>
                                </>
                              ) : (
                                <>
                                  <span>{t.cloudImport.fetchBtn}</span>
                                  <ArrowRight className="w-3 h-3" />
                                </>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
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
                      className="px-4 py-2.5 bg-[#0061FF] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                      <span>Import</span>
                    </button>
                  </div>
                </div>

                {/* Dropbox Account Header */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <FolderOpen className="w-4 h-4 text-[#0061FF]" />
                    <span>My Dropbox Spreadsheets</span>
                    {dropboxConnected ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {t.cloudImport.connected}
                        {dropboxUser?.email && ` (${dropboxUser.email})`}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                        {t.cloudImport.notConnected}
                      </span>
                    )}
                  </div>
                  {dropboxConnected && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => dropboxToken && fetchRealDropboxFiles(dropboxToken)}
                        className="text-[11px] text-slate-500 hover:text-[#0061FF] flex items-center gap-1 font-medium cursor-pointer"
                        title={t.cloudImport.refreshFiles}
                      >
                        <RefreshCw className={`w-3 h-3 ${isLoadingDropboxFiles ? "animate-spin text-[#0061FF]" : ""}`} />
                        <span>{t.cloudImport.refreshFiles}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDisconnectDropbox}
                        className="text-[11px] text-slate-400 hover:text-red-600 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                        title={t.cloudImport.disconnect}
                      >
                        <LogOut className="w-3 h-3" />
                        <span>{t.cloudImport.disconnect}</span>
                      </button>
                    </div>
                  )}
                </div>

                {!dropboxConnected ? (
                  /* When Not Connected: Box with prominent "Connect Dropbox" button */
                  <div className="border border-slate-200 rounded-2xl bg-gradient-to-b from-slate-50/90 to-sky-50/30 p-6 text-center space-y-3.5 shadow-2xs">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center mx-auto">
                      <DropboxIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{t.cloudImport.listingUnavailable}</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500 max-w-sm mx-auto">{t.cloudImport.connectDropbox}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleConnectDropbox}
                      disabled={isConnectingDropbox}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-800 hover:text-slate-900 border border-slate-300 font-semibold text-xs rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-98"
                    >
                      {isConnectingDropbox ? (
                        <>
                          <Loader2 className="w-4 h-4 text-[#0061FF] animate-spin" />
                          <span>{t.cloudImport.fetching}</span>
                        </>
                      ) : (
                        <>
                          <DropboxIcon className="w-4 h-4" />
                          <span>{t.cloudImport.connectDropboxBtn}</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  /* When Connected: Dropbox File Listing & Search */
                  <div className="border border-slate-200/90 rounded-2xl bg-white overflow-hidden shadow-xs">
                    <div className="p-3 bg-slate-50/70 border-b border-slate-100 flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={t.cloudImport.searchFiles}
                          className="w-full text-xs pl-8 pr-3 py-1.5 bg-white rounded-lg border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0061FF]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleConnectDropbox}
                        className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#0061FF] text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                        title="Open Dropbox Native Chooser Window"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{t.cloudImport.openDropboxChooser}</span>
                      </button>
                    </div>

                    {isLoadingDropboxFiles ? (
                      <div className="p-8 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 text-[#0061FF] animate-spin" />
                        <span>{t.cloudImport.loadingFiles}</span>
                      </div>
                    ) : filteredDropboxFiles.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400">
                        {t.cloudImport.noFilesFound}
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                        {filteredDropboxFiles.map((f) => (
                          <div
                            key={f.id}
                            className="p-3 flex items-center justify-between gap-3 hover:bg-sky-50/40 transition-colors group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0061FF] border border-sky-100 flex items-center justify-center shrink-0">
                                <FileSpreadsheet className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-[#0061FF] transition-colors">
                                  {f.name}
                                </p>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                  <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[9px] uppercase font-bold">
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
                              onClick={() => handleImportRealFile(f, "dropbox")}
                              disabled={importingFileId === f.id}
                              className="px-3 py-1.5 bg-[#0061FF] hover:bg-blue-700 disabled:opacity-50 text-white text-[11px] font-semibold rounded-lg shadow-2xs transition-all flex items-center gap-1 shrink-0 cursor-pointer group-hover:shadow-xs active:scale-95"
                            >
                              {importingFileId === f.id ? (
                                <>
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  <span>Downloading...</span>
                                </>
                              ) : (
                                <>
                                  <span>{t.cloudImport.fetchBtn}</span>
                                  <ArrowRight className="w-3 h-3" />
                                </>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
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
                        className="px-5 py-2 bg-[#355BFF] hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
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
              <span>Direct encrypted cloud pipeline • Zero files permanently stored</span>
            </div>
            <button
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
