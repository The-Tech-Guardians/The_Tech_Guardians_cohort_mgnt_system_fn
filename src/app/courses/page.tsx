"use client"

import { BarChartBigIcon, Book, ChartLine, Clock, Computer } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { FileText,  Palette, Sprout, Star } from "lucide-react";
import {  COURSES } from "@/lib/api";
import { FeaturedCourse } from "@/components/courses/futured-course";
import { CourseCard } from "@/components/courses/course-card";



export const LEVEL_COLOR = {
  "Beginner":     "bg-green-50 text-green-700 border-green-200",
  "Intermediate": "bg-blue-50 text-blue-700 border-blue-200",
  "Advanced":     "bg-rose-50 text-rose-700 border-rose-200",
  "All Levels":   "bg-slate-100 text-slate-600 border-slate-200",
};

const COURSE_TYPES = ["All", "development", "design", "data", "business", "personal"];

 export const TYPE_CONFIG = {
  development: { label: "Development",     color: "bg-blue-50 text-blue-600",     icon: <Computer className="w-3 h-3"/> },
  design:      { label: "Design",          color: "bg-violet-50 text-violet-600", icon: <Palette className="w-3 h-3"/> },
  data:        { label: "Data Science",    color: "bg-emerald-50 text-emerald-600",icon: <BarChartBigIcon className="w-3 h-3"/> },
  business:    { label: "Business",        color: "bg-amber-50 text-amber-600",   icon: <ChartLine className="w-3 h-3"/> },
  personal:    { label: "Personal Growth", color: "bg-sky-50 text-sky-600",       icon: <Sprout className="w-3 h-3"/> },
};

export default function CoursesPage() {
  const [activeCat, setActiveCat]     = useState("All");
  const [activePublished, setActivePublished] = useState("All");
  const [search, setSearch]           = useState("");

  const featured = COURSES.find((c) => c.featured);

  const filtered = COURSES
    .filter((c) => !c.featured)
    .filter((c) => activeCat === "All" || c.course_type === activeCat)
    .filter((c) => {
      if (activePublished === "Published") return c.is_published;
      if (activePublished === "Draft")     return !c.is_published;
      return true;
    })
    .filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    );

  const publishedCount = COURSES.filter((c) => c.is_published).length;
  const draftCount     = COURSES.filter((c) => !c.is_published).length;
  const totalLearners  = COURSES.reduce((s, c) => s + c.enrolled, 0);

  return (
    <>

      <div className="cpf cpbg min-h-screen pt-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

          {/* ── Header ── */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"/>
                <span className="text-[12px] font-semibold text-blue-600 uppercase tracking-widest">Courses</span>
              </div>
              <h1 className="text-[36px] md:text-[44px] font-black text-slate-900 leading-tight tracking-tight">
                Explore our{" "}
                <span className="cps italic font-normal" style={{ background: "linear-gradient(135deg,#2563EB,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  course library
                </span>
              </h1>
              <p className="text-slate-500 text-[15.5px] mt-2 max-w-xl leading-relaxed">
                Every course is built for a specific cohort, taught by a real expert, and designed to get you results — not just certificates.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-3 flex-shrink-0">
              {[
                { v: COURSES.length,  l: "Total Courses" },
                { v: publishedCount,  l: "Published" },
                { v: draftCount,      l: "Drafts" },
                { v: totalLearners,   l: "Learners" },
              ].map((s) => (
                <div key={s.l} className="text-center bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm min-w-[68px]">
                  <p className="text-xl font-black text-slate-800">{s.v}</p>
                  <p className="text-[10.5px] text-slate-500 font-medium mt-0.5 leading-tight">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Featured ── */}
          {featured && <FeaturedCourse course={featured} />}

          {/* ── Search + published filter ── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input type="text" placeholder="Search by title or description..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"/>
            </div>
            <div className="flex gap-1.5">
              {["All", "Published", "Draft"].map((s) => (
                <button key={s} onClick={() => setActivePublished(s)}
                  className={`text-[12.5px] font-semibold px-3.5 py-2.5 rounded-xl border transition-all ${
                    activePublished === s
                      ? s === "Draft" ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                        : "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {s === "Published" && "✓ "}{s === "Draft" && "✎ "}{s}
                </button>
              ))}
            </div>
          </div>

          {/* ── Course type tabs ── */}
          <div className="nosb flex gap-1.5 overflow-x-auto pb-1 mb-8">
            {COURSE_TYPES.map((t: string) => {
              const cfg   = TYPE_CONFIG[t as keyof typeof TYPE_CONFIG];
              const label = t === "All" ? "All Types" : cfg?.label || t;
              const icon  = t === "All" ? <Book className="w-3 h-3"/> : cfg?.icon || "";
              return (
                <button key={t} onClick={() => setActiveCat(t)}
                  className={`text-[12.5px] flex items-center gap-1.5 font-semibold px-4 py-2 rounded-full border whitespace-nowrap transition-all flex-shrink-0 ${
                    activeCat === t
                      ? "bg-blue-600 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {icon} {label}
                </button>
              );
            })}
          </div>

          {/* ── Count + clear ── */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-[13.5px] text-slate-500">
              <span className="font-bold text-slate-800">{filtered.length}</span> course{filtered.length !== 1 ? "s" : ""} found
            </p>
            {(activeCat !== "All" || activePublished !== "All" || search) && (
              <button onClick={() => { setActiveCat("All"); setActivePublished("All"); setSearch(""); }}
                className="text-[12.5px] font-semibold text-blue-600 hover:underline">
                Clear filters
              </button>
            )}
          </div>

          {/* ── Grid ── */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
              <div className="flex justify-center mb-4"><FileText className="w-16 h-16 text-slate-300"/></div>
              <h3 className="text-lg font-bold text-slate-700 mb-1">No courses found</h3>
              <p className="text-slate-500 text-sm">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          )}

          {/* ── Bottom CTA ── */}
          <div className="mt-16 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_8px_32px_rgba(37,99,235,0.25)] relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle,#ffffff 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
            <div className="relative text-center md:text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-100 mb-1">Start learning today</p>
              <h3 className="cps italic text-white text-[26px] font-normal leading-tight">Find a course that moves you forward</h3>
              <p className="text-white/70 text-sm mt-1.5 max-w-sm">Every course is linked to an active cohort with live sessions, instructor support, and a real community.</p>
            </div>
            <div className="relative flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <button className="bg-white text-blue-600 font-bold text-sm px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all">Browse Cohorts</button>
              <button className="bg-white/15 border border-white/30 text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-white/20 transition-all">View Schedule</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}