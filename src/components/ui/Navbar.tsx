"use client";

import { useState, useEffect } from "react";
import CategoryBar from "./navbar/CategoryBar";
import MobileMenuButton from "./navbar/MobileMenuButton";
import Logo from "./navbar/Logo";
import LanguageSelector from "./navbar/LanguageSelector";
import ThemeToggle from "./navbar/ThemeToggle";
import AuthButtons from "./navbar/AuthButtons";
import MobileMenu from "./navbar/MobileMenu";
import { cohortService } from "@/services/cohortService";
import Link from "next/link";




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
  const [activeCategory, setActiveCategory] = useState(-1);
  const [theme, setTheme] = useState("light");
  const [langOpen, setLangOpen] = useState(false);
const [activeLang, setActiveLang] = useState(languages[0]);
  const [categories, setCategories] = useState([]);

// Fetch dynamic cohorts from backend (public - no auth required)
  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch('http://localhost:3000/api/cohorts', { 
          headers 
        });
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        const cohorts = data.cohorts || [];
        const activeCohorts = cohorts.filter((c: any) => c.isActive);
        const categoryItems = activeCohorts.map((cohort: any) => ({
          label: cohort.courseType.charAt(0).toUpperCase() + cohort.courseType.slice(1).replace(/-/g, ' ').replace(/_/g, ' '),
          href: `/${cohort.courseType.toLowerCase().replace(/_/g, '-')}`,
        }));
        setCategories(categoryItems);
      } catch (error: unknown) {
        console.warn('Failed to fetch cohorts:', error);
        setCategories([]);
      }
    };

    fetchCohorts();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }, [theme]);

  const isDark = theme === "dark";

  const bg       = isDark ? "bg-slate-900" : "bg-white";
  const border   = isDark ? "border-slate-700/60" : "border-slate-100";
  const textMain = isDark ? "text-slate-100" : "text-slate-800";
  const textMuted= isDark ? "text-slate-400" : "text-slate-500";
  const hoverBg  = isDark ? "hover:bg-slate-700/50" : "hover:bg-slate-50";
  const chipBg   = isDark
    ? "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
    : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800";
  const inputBorder = isDark
    ? "border-slate-700 hover:border-slate-500 hover:bg-slate-800/60"
    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50";
  const utilBar  = isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-100";
  const shadow   = scrolled
    ? isDark
      ? "shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
      : "shadow-[0_4px_20px_rgba(0,0,0,0.07)]"
    : "";

  return (
    <div className="font-dm">
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* ── Utility bar ── */}
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

        {/* ── Main nav bar ── */}
        <div className={`${bg} border-b ${border} transition-all duration-300 ${shadow}`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <Link href="/">
              <Logo textMain={textMain} />
            </Link>

           

            <AuthButtons textMuted={textMuted} inputBorder={inputBorder} isDark={isDark} />

            <MobileMenuButton
              mobileNavOpen={mobileNavOpen}
              setMobileNavOpen={setMobileNavOpen}
              isDark={isDark}
            />
          </div>
        </div>

        {/* ── Category bar ── */}
        <CategoryBar
          categories={categories}
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
  );
}