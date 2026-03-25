import Link from "next/link";
import { useTranslation } from "@/components/i18n/LanguageProvider";

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
  const { t } = useTranslation();

  return (
    <div className={`lg:hidden ${bg} border-b ${border} shadow-lg transition-colors duration-300`}>
      <div className="px-6 py-4 pb-6">
        <div className="pt-4 pb-3">
          <p className={`text-[10.5px] font-semibold uppercase tracking-widest ${textMuted} mb-2`}>
            {t("common.language")}
          </p>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setActiveLang(lang)}
                className={`flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                  activeLang.code === lang.code
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
          <p className={`text-[10.5px] font-semibold uppercase tracking-widest ${textMuted} mb-2`}>
            {t("common.theme")}
          </p>
          <div className="flex gap-2">
            {[
              { id: "light", label: t("common.light") },
              { id: "dark", label: t("common.dark") },
            ].map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => setTheme(themeOption.id)}
                className={`flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg border capitalize transition-all duration-150 ${
                  theme === themeOption.id
                    ? "bg-blue-50 border-blue-200 text-blue-600"
                    : chipBg
                }`}
              >
                {themeOption.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2.5 pt-5">
          <Link href="/register">
            <button className={`flex-1 text-sm font-medium ${textMuted} px-4 py-2.5 rounded-lg border ${inputBorder} transition-all duration-200`}>
              {t("common.signUp")}
            </button>
          </Link>
          <Link href="/login">
            <button className="flex-1 relative text-sm font-semibold text-white px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_4px_14px_rgba(37,99,235,0.3)] overflow-hidden transition-all duration-200">
              <span className="absolute inset-0 bg-gradient-to-br from-white/[0.12] to-transparent" />
              <span className="relative">{t("common.logIn")} -&gt;</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
