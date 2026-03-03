"use client";

import { useState, useEffect } from "react";
import CategoryBar from "./navbar/CategoryBar";
import MobileMenuButton from "./navbar/MobileMenuButton";
import Logo from "./navbar/Logo";
import LanguageSelector from "./navbar/LanguageSelector";
import ThemeToggle from "./navbar/ThemeToggle";
import AuthButtons from "./navbar/AuthButtons";
import MobileMenu from "./navbar/MobileMenu";

const categoryItems = ["Development", "Design", "Business", "Marketing", "Data Science", "Personal Growth"];

const languages = [
  { code: "en", label: "English",     flag: "🇬🇧" },
  { code: "fr", label: "Français",    flag: "🇫🇷" },
  { code: "es", label: "Español",     flag: "🇪🇸" },
  { code: "ar", label: "العربية",     flag: "🇸🇦" },
  { code: "rw", label: "Kinyarwanda", flag: "🇷🇼" },
];

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [theme, setTheme] = useState("light");
  const [langOpen, setLangOpen] = useState(false);
  const [activeLang, setActiveLang] = useState(languages[0]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDark = theme === "dark";

  const bg = isDark ? "bg-slate-900" : "bg-white";
  const border = isDark ? "border-slate-700/60" : "border-slate-100";
  const textMain = isDark ? "text-slate-100" : "text-slate-800";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";
  const hoverBg = isDark ? "hover:bg-slate-700/50" : "hover:bg-slate-50";
  const chipBg = isDark ? "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200" : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800";
  const inputBorder = isDark ? "border-slate-700 hover:border-slate-500 hover:bg-slate-800/60" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50";
  const utilBar = isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-100";
  const shadow = scrolled ? (isDark ? "shadow-[0_4px_24px_rgba(0,0,0,0.4)]" : "shadow-[0_4px_20px_rgba(0,0,0,0.07)]") : "";

  return (
    <>
      

      <div className="font-dm">
        <header className="fixed top-0 left-0 right-0 z-50">
          <div className={`${utilBar} border-b transition-colors duration-300`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 h-9 flex items-center justify-end gap-3">
              <LanguageSelector
                languages={languages}
                activeLang={activeLang}
                setActiveLang={setActiveLang}
                langOpen={langOpen}
                setLangOpen={setLangOpen}
                textMuted={textMuted}
                hoverBg={hoverBg}
                border={border}
                isDark={isDark}
              />

              <div className={`w-px h-4 ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />

              <ThemeToggle
                theme={theme}
                setTheme={setTheme}
                textMuted={textMuted}
                hoverBg={hoverBg}
                border={border}
                isDark={isDark}
              />
            </div>
          </div>

          <div className={`${bg} border-b ${border} transition-all duration-300 ${shadow}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
              <Logo textMain={textMain} />

              <nav className="hidden lg:flex items-center gap-1">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-amber-600 bg-amber-50 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 transition-all duration-200">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" />
                  </svg>
                  Lightning Lessons
                </button>
              </nav>

              <AuthButtons textMuted={textMuted} inputBorder={inputBorder} isDark={isDark} />

              <MobileMenuButton
                mobileNavOpen={mobileNavOpen}
                setMobileNavOpen={setMobileNavOpen}
                isDark={isDark}
              />
            </div>
          </div>

          <CategoryBar
            categories={categoryItems}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            bg={bg}
            border={border}
            textMuted={textMuted}
            hoverBg={hoverBg}
            isDark={isDark}
          />

          {mobileNavOpen && (
            <MobileMenu
              languages={languages}
              activeLang={activeLang}
              setActiveLang={setActiveLang}
              theme={theme}
              setTheme={setTheme}
              bg={bg}
              border={border}
              textMuted={textMuted}
              chipBg={chipBg}
              inputBorder={inputBorder}
            />
          )}
        </header>
      </div>
    </>
  );
}
