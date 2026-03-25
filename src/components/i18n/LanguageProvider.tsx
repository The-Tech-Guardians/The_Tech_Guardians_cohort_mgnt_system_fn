"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { messages } from "./messages";

export type LanguageCode = "en" | "fr" | "es" | "ar" | "rw";

export type LanguageOption = {
  code: LanguageCode;
  label: string;
  flag: string;
};

export const PLATFORM_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "rw", label: "Kinyarwanda", flag: "🇷🇼" },
];

type TranslationParams = Record<string, string | number>;

type LanguageContextValue = {
  activeLanguage: LanguageOption;
  languages: LanguageOption[];
  setLanguage: (language: LanguageOption) => void;
  t: (key: string, params?: TranslationParams) => string;
};

const LANGUAGE_STORAGE_KEY = "platform_language";

const LanguageContext = createContext<LanguageContextValue | null>(null);

const interpolate = (template: string, params?: TranslationParams) => {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    String(params[key] ?? ""),
  );
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [activeLanguage, setActiveLanguage] = useState<LanguageOption>(
    PLATFORM_LANGUAGES[0],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedLanguageCode = window.localStorage.getItem(
      LANGUAGE_STORAGE_KEY,
    ) as LanguageCode | null;
    const storedLanguage = PLATFORM_LANGUAGES.find(
      (language) => language.code === storedLanguageCode,
    );

    if (storedLanguage) {
      const timer = window.setTimeout(() => {
        setActiveLanguage(storedLanguage);
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = activeLanguage.code;
    document.documentElement.dir = activeLanguage.code === "ar" ? "rtl" : "ltr";
  }, [activeLanguage]);

  const value = useMemo<LanguageContextValue>(() => {
    const activeMessages = messages[activeLanguage.code] || {};
    const fallbackMessages = messages.en;

    return {
      activeLanguage,
      languages: PLATFORM_LANGUAGES,
      setLanguage: (language) => {
        setActiveLanguage(language);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language.code);
        }
      },
      t: (key, params) => {
        const template = activeMessages[key] || fallbackMessages[key] || key;
        return interpolate(template, params);
      },
    };
  }, [activeLanguage]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

export const useTranslation = () => {
  const { t, activeLanguage } = useLanguage();
  return { t, language: activeLanguage.code };
};
