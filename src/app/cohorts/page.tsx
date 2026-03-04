"use client";

import { useState } from "react";
import { COHORTS } from "../cohort";
import getStatus from "@/components/cohorts/get-status";
import FeaturedCohort from "@/components/cohorts/feature-cohort";
import CohortCard from "@/components/cohorts/cohort-cart";
import Link from "next/link";

const TYPE_CONFIG = {
  development: { label: "Development",    color: "bg-blue-50 text-blue-600" },
  design:      { label: "Design",         color: "bg-violet-50 text-violet-600" },
  data:        { label: "Data Science",   color: "bg-emerald-50 text-emerald-600" },
  business:    { label: "Business",       color: "bg-amber-50 text-amber-600" },
  personal:    { label: "Personal Growth",color: "bg-sky-50 text-sky-600" },
};

const COURSE_TYPES = ["All", "development", "design", "data", "business", "personal"];


export default function CohortsPage() {
  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch]       = useState("");
  const [enrolled, setEnrolled]   = useState(new Set());

  const handleEnroll = (id) => setEnrolled((prev) => new Set([...prev, id]));

  const featured = COHORTS.find((c) => c.featured);

  const filtered = COHORTS
    .filter((c) => !c.featured)
    .filter((c) => activeCat === "All" || c.course_type === activeCat)
    .filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(search.toLowerCase())
    );

  const activeCount   = COHORTS.filter((c) => getStatus(c) === "active").length;
  const enrollingCount= COHORTS.filter((c) => getStatus(c) === "enrolling").length;

  return (
    <>
     

      <div className="cpf cpbg min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[12px] font-semibold text-blue-600 uppercase tracking-widest">Cohorts</span>
              </div>
              <h1 className="text-[36px] md:text-[44px] font-black text-slate-900 leading-tight tracking-tight">
                Find your{" "}
                <span className="cps italic font-normal" style={{ background: "linear-gradient(135deg,#2563EB,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  next cohort
                </span>
              </h1>
              <p className="text-slate-500 text-[15.5px] mt-2 max-w-xl leading-relaxed">
                Structured programs with real instructors, live sessions, and peers — all working toward the same goal.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              {[
                { v: COHORTS.length,  l: "Total Cohorts" },
                { v: enrollingCount,  l: "Enrolling Now" },
                { v: activeCount,     l: "In Progress" },
              ].map((s) => (
                <div key={s.l} className="text-center bg-white border border-slate-100 rounded-2xl px-5 py-3 shadow-sm min-w-[80px]">
                  <p className="text-2xl font-black text-slate-800">{s.v}</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-tight">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          {featured && <FeaturedCohort cohort={featured} onEnroll={handleEnroll} />}

          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search by name or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
              />
            </div>
          </div>

          <div className="nosb flex gap-1.5 overflow-x-auto pb-1 mb-8">
            {COURSE_TYPES.map((t) => {
              const label = t === "All" ? "All Types" : (TYPE_CONFIG[t]?.label || t);
              return (
                <button key={t} onClick={() => setActiveCat(t)}
                  className={`text-[12.5px] font-semibold px-4 py-2 rounded-full border whitespace-nowrap transition-all flex-shrink-0 ${
                    activeCat === t
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mb-5">
            <p className="text-[13.5px] text-slate-500">
              <span className="font-bold text-slate-800">{filtered.length}</span> cohort{filtered.length !== 1 ? "s" : ""} found
            </p>
            {(activeCat !== "All" || search) && (
              <button onClick={() => { setActiveCat("All"); setSearch(""); }}
                className="text-[12.5px] font-semibold text-blue-600 hover:underline">
                Clear filters
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-slate-700 mb-1">No cohorts found</h3>
              <p className="text-slate-500 text-sm">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((c) => (
                <CohortCard key={c.id} cohort={c} onEnroll={handleEnroll} />
              ))}
            </div>
          )}

          <div className="mt-16 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_8px_32px_rgba(37,99,235,0.25)] relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle,#ffffff 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
            <div className="relative text-center md:text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-100 mb-1">Ready to start?</p>
              <h3 className="cps italic text-white text-[26px] font-normal leading-tight">Join the next cohort today</h3>
              <p className="text-white/70 text-sm mt-1.5 max-w-sm">Enrollment is open. Cohorts fill up fast — secure your spot before the window closes.</p>
            </div>
            <div className="relative flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link href="courses"><button className="bg-white text-blue-600 font-bold text-sm px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all">Browse Courses</button></Link>
              
              <button className="bg-white/15 border border-white/30 text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-white/20 transition-all">View Schedule</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}