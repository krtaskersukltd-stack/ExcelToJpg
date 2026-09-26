"use client";

import React, { createContext, useContext, useMemo } from "react";

export type SiteOutputFormat = "jpg" | "png" | "csv";

interface OutputFormatContextValue {
  format: SiteOutputFormat;
  setFormat: (format: SiteOutputFormat) => void;
  /** Uppercase label: JPG / PNG / CSV */
  label: string;
  /** Extension with dot: .jpg / .png / .csv */
  extension: string;
  /** Replace JPG/jpg (and JPEG) placeholders with the active format */
  withFormat: (text: string) => string;
}

const OutputFormatContext = createContext<OutputFormatContextValue | null>(null);

export function OutputFormatProvider({
  format,
  setFormat,
  children,
}: {
  format: SiteOutputFormat;
  setFormat: (format: SiteOutputFormat) => void;
  children: React.ReactNode;
}) {
  const value = useMemo<OutputFormatContextValue>(() => {
    const label = format.toUpperCase();
    const extension = `.${format}`;
    const withFormat = (text: string) =>
      text
        .replace(/JPEG/gi, label)
        .replace(/JPG/g, label)
        .replace(/jpg/g, format);
    return { format, setFormat, label, extension, withFormat };
  }, [format, setFormat]);

  return (
    <OutputFormatContext.Provider value={value}>
      {children}
    </OutputFormatContext.Provider>
  );
}

export function useOutputFormat() {
  const ctx = useContext(OutputFormatContext);
  if (!ctx) {
    // Safe fallback when provider is missing (e.g. isolated story renders)
    return {
      format: "jpg" as SiteOutputFormat,
      setFormat: () => undefined,
      label: "JPG",
      extension: ".jpg",
      withFormat: (text: string) => text,
    };
  }
  return ctx;
}

export function toolIdToSiteFormat(toolId: string): SiteOutputFormat | null {
  if (toolId === "excel-jpg") return "jpg";
  if (toolId === "excel-png") return "png";
  if (toolId === "excel-csv") return "csv";
  return null;
}
