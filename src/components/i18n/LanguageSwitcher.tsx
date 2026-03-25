"use client";

import { useLanguage } from "./LanguageProvider";

type LanguageSwitcherProps = {
  className?: string;
};

export default function LanguageSwitcher({
  className = "",
}: LanguageSwitcherProps) {
  const { activeLanguage, languages, setLanguage } = useLanguage();

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {languages.map((language) => (
        <button
          key={language.code}
          type="button"
          onClick={() => setLanguage(language)}
          className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
            activeLanguage.code === language.code
              ? "border-blue-200 bg-blue-50 text-blue-600"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          {language.flag} {language.label}
        </button>
      ))}
    </div>
  );
}
