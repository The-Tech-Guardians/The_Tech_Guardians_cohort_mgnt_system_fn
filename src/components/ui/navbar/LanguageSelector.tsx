import { useRef, useEffect } from "react";

interface Language {
  code: string;
  label: string;
  flag: string;
}

interface LanguageSelectorProps {
  languages: Language[];
  activeLang: Language;
  setActiveLang: (lang: Language) => void;
  langOpen: boolean;
  setLangOpen: (open: boolean) => void;
  textMuted: string;
  hoverBg: string;
  border: string;
  isDark: boolean;
}

export default function LanguageSelector({
  languages,
  activeLang,
  setActiveLang,
  langOpen,
  setLangOpen,
  textMuted,
  hoverBg,
  border,
  isDark,
}: LanguageSelectorProps) {
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setLangOpen]);

  return (
    <div className="relative" ref={langRef}>
      <button
        onClick={() => setLangOpen(!langOpen)}
        className={`flex items-center gap-1.5 text-[12px] font-medium ${textMuted} ${hoverBg} px-2.5 py-1 rounded-md border ${border} transition-all duration-200`}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span>{activeLang.flag} {activeLang.label}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          className={`transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {langOpen && (
        <div className={`lang-dropdown absolute right-0 top-full mt-1.5 w-44 rounded-xl border ${isDark ? "bg-slate-800 border-slate-700 shadow-[0_8px_30px_rgba(0,0,0,0.4)]" : "bg-white border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.1)]"} overflow-hidden z-50`}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setActiveLang(lang); setLangOpen(false); }}
              className={`flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 text-[12.5px] font-medium transition-colors duration-150
                ${activeLang.code === lang.code
                  ? (isDark ? "bg-blue-600/20 text-blue-400" : "bg-blue-50 text-blue-600")
                  : (isDark ? "text-slate-300 hover:bg-slate-700/60" : "text-slate-600 hover:bg-slate-50")
                }`}
            >
              <span className="text-base leading-none">{lang.flag}</span>
              {lang.label}
              {activeLang.code === lang.code && (
                <svg className="ml-auto" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
