"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthButtons from "./navbar/AuthButtons";
import CategoryBar from "./navbar/CategoryBar";
import LanguageSelector from "./navbar/LanguageSelector";
import Logo from "./Logo";
import MobileMenu from "./navbar/MobileMenu";
import MobileMenuButton from "./navbar/MobileMenuButton";
import ThemeToggle from "./navbar/ThemeToggle";
import { CATEGORIES } from "@/components/courses/config/courses-api";
import { formatCourseType } from "@/services/courseService";
import {
  PLATFORM_LANGUAGES,
  useLanguage,
} from "@/components/i18n/LanguageProvider";

type CategoryItem = {
  label: string;
  href: string;
};

type CourseRecord = {
  courseType?: string;
};

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState("light");
  const [langOpen, setLangOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const { activeLanguage, setLanguage } = useLanguage();

  useEffect(() => {
    const fetchCourseCategories = async () => {
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("auth_token");
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const response = await fetch(`${apiUrl}/api/courses?page=1&limit=100`, {
          headers,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch course categories");
        }

        const data = await response.json();
        const courses = (data.courses || data.data || []) as CourseRecord[];
        const uniqueTypes = Array.from(
          new Set(
            courses
              .map((course) => course.courseType)
              .filter((type): type is string => typeof type === "string")
          )
        );

        const categoryItems = [{
          label: "All Courses",
          href: "/courses",
        },
        ...uniqueTypes.map((courseType) => ({
          label: formatCourseType(courseType),
          href: `/${courseType.toLowerCase().replace(/_/g, "-")}`,
        }))];

        setCategories(categoryItems);
      } catch (error: unknown) {
        console.warn("Failed to fetch course categories:", error);
        setCategories([
          { label: "All Courses", href: "/courses" },
          ...CATEGORIES.map((category) => ({
            label: category.label,
            href: `/${category.slug}`,
          })),
        ]);
      }
    };

    fetchCourseCategories();
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

  const bg = isDark ? "bg-slate-900" : "bg-white";
  const border = isDark ? "border-slate-700/60" : "border-slate-100";
  const textMain = isDark ? "text-slate-100" : "text-slate-800";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";
  const hoverBg = isDark ? "hover:bg-slate-700/50" : "hover:bg-slate-50";
  const chipBg = isDark
    ? "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
    : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800";
  const inputBorder = isDark
    ? "border-slate-700 hover:border-slate-500 hover:bg-slate-800/60"
    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50";
  const utilBar = isDark
    ? "bg-slate-950 border-slate-800"
    : "bg-slate-50 border-slate-100";
  const shadow = scrolled
    ? isDark
      ? "shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
      : "shadow-[0_4px_20px_rgba(0,0,0,0.07)]"
    : "";

  return (
    <div className="font-dm">
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className={`${utilBar} border-b transition-colors duration-300`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 h-9 flex items-center justify-end gap-3">
            <LanguageSelector
              languages={PLATFORM_LANGUAGES}
              activeLang={activeLanguage}
              setActiveLang={setLanguage}
              langOpen={langOpen}
              setLangOpen={setLangOpen}
              textMuted={textMuted}
              hoverBg={hoverBg}
              border={border}
              isDark={isDark}
            />

            <div
              className={`w-px h-4 ${isDark ? "bg-slate-700" : "bg-slate-200"}`}
            />

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

        <div
          className={`${bg} border-b ${border} transition-all duration-300 ${shadow}`}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <Link href="/">
              <Logo variant={isDark ? "dark" : "light"} />
            </Link>

            <AuthButtons
              textMuted={textMuted}
              inputBorder={inputBorder}
              isDark={isDark}
            />

            <MobileMenuButton
              mobileNavOpen={mobileNavOpen}
              setMobileNavOpen={setMobileNavOpen}
              isDark={isDark}
            />
          </div>
        </div>

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
            languages={PLATFORM_LANGUAGES}
            activeLang={activeLanguage}
            setActiveLang={setLanguage}
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
