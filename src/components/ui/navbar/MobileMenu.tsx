import Link from "next/link";

interface Language {
  code: string;
  label: string;
  flag: string;
}

interface MobileMenuProps {
  languages: Language[];
  activeLang: Language;
  setActiveLang: (lang: Language) => void;
  theme: string;
  setTheme: (theme: string) => void;
  bg: string;
  border: string;
  textMuted: string;
  chipBg: string;
  inputBorder: string;
}

export default function MobileMenu({
  languages,
  activeLang,
  setActiveLang,
  theme,
  setTheme,
  bg,
  border,
  textMuted,
  chipBg,
  inputBorder,
}: MobileMenuProps) {
  return (
    <div className={`lg:hidden ${bg} border-b ${border} shadow-lg transition-colors duration-300`}>
      <div className="px-6 py-4 pb-6">
       

        <div className="pt-4 pb-3">
          <p className={`text-[10.5px] font-semibold uppercase tracking-widest ${textMuted} mb-2`}>Language</p>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setActiveLang(lang)}
                className={`flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-all duration-150
                  ${activeLang.code === lang.code
                    ? "bg-blue-50 border-blue-200 text-blue-600"
                    : chipBg
                  }`}
              >
                {lang.flag} {lang.label}
              </button>
            ))}
          </div>
        </div>

        <div className={`border-t ${border} pt-3 pb-3`}>
          <p className={`text-[10.5px] font-semibold uppercase tracking-widest ${textMuted} mb-2`}>Theme</p>
          <div className="flex gap-2">
            {["light", "dark"].map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg border capitalize transition-all duration-150
                  ${theme === t
                    ? "bg-blue-50 border-blue-200 text-blue-600"
                    : chipBg
                  }`}
              >
                {t === "light" ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2.5 pt-5">
          <Link href="/register">
            <button className={`flex-1 text-sm font-medium ${textMuted} px-4 py-2.5 rounded-lg border ${inputBorder} transition-all duration-200`}>
           
            Sign Up

          </button>
          </Link>
        <Link href="/login">
         <button className="flex-1 relative text-sm font-semibold text-white px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_4px_14px_rgba(37,99,235,0.3)] overflow-hidden transition-all duration-200">
            <span className="absolute inset-0 bg-gradient-to-br from-white/[0.12] to-transparent" />
            <span className="relative">Log In →</span>
          </button>
        </Link>
         
        </div>
      </div>
    </div>
  );
}
