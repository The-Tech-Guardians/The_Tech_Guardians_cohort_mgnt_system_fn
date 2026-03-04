"use client"

import { FAQItem } from "@/components/course-details/faq-item";
import { SectionTitle, Stars } from "@/components/course-details/helper";
import { Sidebar } from "@/components/course-details/side-bar";
import { COHORTS, COURSE, CURRICULUM, FAQS, HIGHLIGHTS, INSTRUCTOR, OUTCOMES } from "@/lib/course-data";
import { Clock, Computer, Trophy, Rocket, BookOpen, Globe, Flame } from "lucide-react";
import { useState } from "react";


export default function CourseDetailPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const TABS = ["overview", "curriculum", "instructor", "faqs"];

  return (
    <>

      <div className="cpf bg-white min-h-screen pt-25">

        {/* ── HERO SECTION ───────────────────────────────── */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[13px] text-slate-400 pt-6 pb-4">
              <a href="#" className="hover:text-blue-600 transition-colors">All courses</a>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              <span className="text-slate-600 font-medium capitalize">{COURSE.course_type}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              <span className="text-slate-800 font-semibold truncate max-w-xs">{COURSE.title}</span>
            </div>

            {/* Hero grid */}
            <div className="flex flex-col lg:flex-row items-start gap-8 pb-10 pt-2">

              {/* Left — text */}
              <div className="flex-1">
                {/* Featured badge */}
                <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 mb-5">
                  <Rocket className="w-3.5 h-3.5 text-slate-600"/>
                  <span className="text-[11.5px] font-semibold text-slate-600 uppercase tracking-wider">Featured in CohortLMS</span>
                </div>

                {/* Title */}
                <h1 className="text-[32px] md:text-[42px] font-black text-slate-900 leading-[1.1] tracking-tight mb-4 max-w-2xl">
                  {COURSE.title}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <Stars rating={INSTRUCTOR.rating} reviews={INSTRUCTOR.reviews} size="lg" />
                  <span className="w-px h-4 bg-slate-200" />
                  <span className="text-[13px] text-slate-500">{INSTRUCTOR.students.toLocaleString()} learners enrolled</span>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${INSTRUCTOR.avatar_gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {INSTRUCTOR.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <span className="text-[15px] font-bold text-slate-900">{INSTRUCTOR.name}</span>
                    <span className="text-slate-400 mx-2 text-sm">·</span>
                    <span className="text-[13.5px] text-slate-500">{INSTRUCTOR.credentials}</span>
                  </div>
                </div>

                {/* Quick stats chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {[
                    { i: <BookOpen className="w-3 h-3"/>, v: "65 lessons" },
                    { i: <Clock className="w-3 h-3"/>, v: "25h+ content" },
                    { i: <Computer className="w-3 h-3"/>, v: "3x live / week" },
                    { i: <Trophy className="w-3 h-3"/>, v: "Certificate" },
                    { i: <Globe className="w-3 h-3"/>, v: "English" },
                  ].map((m) => (
                    <div key={m.v} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
                      <span className="leading-none">{m.i}</span>
                      <span className="text-[12.5px] font-medium text-slate-700">{m.v}</span>
                    </div>
                  ))}
                </div>

                {/* Action row */}
                <div className="flex items-center gap-4 flex-wrap">
                  <button className="flex items-center gap-2 border-2 border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-600 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    View Syllabus
                  </button>
                  <div className="flex items-center gap-2 text-[13px] text-slate-500">
                    <Flame className="w-4 h-4 text-orange-500"/>
                    <span><strong className="text-slate-800">25 people</strong> enrolled this week</span>
                  </div>
                </div>
              </div>

              {/* Right — instructor card */}
              <div className="lg:w-72 flex-shrink-0 w-full">
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 h-56 lg:h-72 flex items-end">
                  {/* Decorative vertical lines like the screenshot */}
                  <div className="absolute inset-0 flex justify-end overflow-hidden opacity-20">
                    {Array.from({length: 18}).map((_,i) => (
                      <div key={i} className="w-px bg-blue-400 mx-1.5 h-full" style={{opacity: 0.3 + i * 0.04}}/>
                    ))}
                  </div>
                  {/* Instructor avatar circle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${INSTRUCTOR.avatar_gradient} flex items-center justify-center shadow-xl`}>
                      <span className="text-white text-4xl font-black">
                        {INSTRUCTOR.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                  </div>
                  {/* Name plate */}
                  <div className="relative z-10 w-full bg-white/80 backdrop-blur-sm px-4 py-3 border-t border-blue-100">
                    <p className="font-bold text-slate-800 text-[13.5px]">{INSTRUCTOR.name}</p>
                    <p className="text-slate-500 text-[11.5px]">{INSTRUCTOR.title}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── STICKY NAV TABS ─────────────────────────── */}
        <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex gap-1 overflow-x-auto">
              {TABS.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`capitalize text-[13.5px] font-semibold px-4 py-4 border-b-2 whitespace-nowrap transition-all duration-150 ${
                    activeTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab === "faqs" ? "FAQs" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT + SIDEBAR ──────────────────── */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* ── LEFT CONTENT ── */}
            <div className="flex-1 min-w-0 space-y-14">

              {/* OVERVIEW */}
              {(activeTab === "overview") && (
                <>
                  {/* Hook */}
                  <div>
                    <h2 className="text-[24px] md:text-[28px] font-black text-slate-900 leading-tight mb-3">
                      Become a job-ready full-stack developer from idea to deployed product
                    </h2>
                    <p className="text-[13.5px] font-bold text-blue-600 mb-4">CohortLMS&apos;s most complete development program · 2,400+ alumni</p>

                    <div className="space-y-5">
                      {HIGHLIGHTS.map((h) => (
                        <div key={h.title} className="flex gap-3">
                          <span className="text-xl mt-0.5 flex-shrink-0">{h.emoji}</span>
                          <div>
                            <p className="font-bold text-slate-800 text-[14px] mb-1">{h.title}</p>
                            <p className="text-[13.5px] text-slate-500 leading-relaxed">{h.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What you'll learn */}
                  <div>
                    <SectionTitle>What you will learn</SectionTitle>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {OUTCOMES.map((o) => (
                        <div key={o} className="flex items-start gap-2.5">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                          </div>
                          <span className="text-[13.5px] text-slate-700 leading-relaxed">{o}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats bar */}
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { v: "65",    l: "Lessons" },
                        { v: "25h+",  l: "Video content" },
                        { v: "4",     l: "Projects" },
                        { v: "94%",   l: "Completion rate" },
                      ].map((s) => (
                        <div key={s.l} className="text-center">
                          <p className="text-2xl font-black text-white">{s.v}</p>
                          <p className="text-white/70 text-[12px] font-medium mt-0.5">{s.l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* CURRICULUM */}
              {(activeTab === "curriculum") && (
                <div>
                  <SectionTitle>Course Curriculum</SectionTitle>
                  <p className="text-[13.5px] text-slate-500 mb-6">12 weeks · 65 lessons · 4 projects</p>
                  <div className="space-y-3">
                    {CURRICULUM.map((w, i) => (
                      <div key={w.week} className="border border-slate-100 rounded-2xl overflow-hidden">
                        <div className="flex items-center gap-4 px-5 py-4 bg-slate-50">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-[11px] font-black flex-shrink-0`}>
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-bold text-slate-800 text-[14px]">{w.title}</p>
                              <span className="text-[11px] font-semibold text-slate-400 flex-shrink-0">{w.lessons} lessons</span>
                            </div>
                            <p className="text-[12px] text-slate-500 mt-0.5 truncate">{w.week} · {w.topics}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* INSTRUCTOR */}
              {(activeTab === "instructor") && (
                <div>
                  <SectionTitle>Your Instructor</SectionTitle>
                  <div className="flex items-start gap-5 mb-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${INSTRUCTOR.avatar_gradient} flex items-center justify-center text-white text-2xl font-black flex-shrink-0 shadow-lg`}>
                      {INSTRUCTOR.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">{INSTRUCTOR.name}</h3>
                      <p className="text-blue-600 font-semibold text-[13.5px] mb-1">{INSTRUCTOR.title}</p>
                      <p className="text-slate-500 text-[13px]">{INSTRUCTOR.credentials}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <Stars rating={INSTRUCTOR.rating} reviews={INSTRUCTOR.reviews} />
                        <span className="text-[12.5px] text-slate-500">{INSTRUCTOR.students.toLocaleString()} students</span>
                        <span className="text-[12.5px] text-slate-500">{INSTRUCTOR.courses} courses</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[14px] text-slate-600 leading-relaxed">{INSTRUCTOR.bio}</p>
                </div>
              )}

              {/* FAQs */}
              {(activeTab === "faqs") && (
                <div>
                  <SectionTitle>Frequently Asked Questions</SectionTitle>
                  <div className="bg-white border border-slate-100 rounded-2xl px-6 py-2 shadow-sm">
                    {FAQS.map((faq) => <FAQItem key={faq.q} faq={faq} />)}
                  </div>
                </div>
              )}

            </div>

            {/* ── STICKY SIDEBAR ── */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="sticky top-20">
                <Sidebar cohorts={COHORTS} />
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}