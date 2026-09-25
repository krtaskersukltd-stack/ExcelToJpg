"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Language,
  LANGUAGES,
  LANGUAGE_LOCALES,
  SEO_METADATA,
  translations,
  Translations,
} from "@/i18n/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  languages: typeof LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "EN",
  setLanguage: () => {},
  t: translations.EN as Translations,
  languages: LANGUAGES,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("EN");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("app_language") as Language | null;
      if (saved && (saved === "EN" || saved === "ES" || saved === "FR" || saved === "DE" || saved === "JA" || saved === "ZH")) {
        const restoreLanguage = window.setTimeout(() => setLanguageState(saved), 0);
        return () => window.clearTimeout(restoreLanguage);
      }
    } catch {
      // Ignore localStorage access errors
    }
  }, []);

  useEffect(() => {
    const seo = SEO_METADATA[language];
    document.documentElement.lang = LANGUAGE_LOCALES[language];
    document.title = seo.title;

    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const openGraphTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    const openGraphDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');

    description?.setAttribute("content", seo.description);
    openGraphTitle?.setAttribute("content", seo.title);
    openGraphDescription?.setAttribute("content", seo.description);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("app_language", lang);
    } catch {
      // Ignore localStorage access errors
    }
  };

  const t = (translations[language] || translations.EN) as Translations;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
