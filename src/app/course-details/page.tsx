"use client"

import { useState } from "react";

// ── Course data (matches DB schema) ─────────────────────────
const COURSE = {
  id: "crs-0001-uuid",
  title: "Full-Stack Web Development Bootcamp",
  description: "The most complete full-stack program on the platform. Go from writing your first line of HTML to deploying production-grade web applications — with real projects, live sessions, and an expert instructor guiding you every step of the way.",
  instructor_id: "ins-001",
  cohort_id: "coh-001",
  course_type: "development",
  is_published: true,
  created_at: "2026-01-10",
};

const INSTRUCTOR = {
  id: "ins-001",
  name: "Freddy Bijanja",
  title: "Lead Instructor",
  bio: "Full-stack engineer & educator. Former engineer at Andela, Google Developer Expert, and founder of two EdTech startups across East Africa.",
  credentials: "Google Dev Expert · ex-Andela · 10k+ students taught",
  avatar_gradient: "from-blue-500 to-cyan-400",
  rating: 4.9,
  reviews: 148,
  students: 2400,
  courses: 6,
};

const COHORTS = [
  { id: "coh-001", name: "Apr 14 — Jul 7, 2026",  start: "2026-04-14", end: "2026-07-07", enrollment_close: "2026-04-10", seats_left: 6,  urgent: true  },
  { id: "coh-002", name: "May 12 — Aug 4, 2026",  start: "2026-05-12", end: "2026-08-04", enrollment_close: "2026-05-08", seats_left: 18, urgent: false },
  { id: "coh-003", name: "Jun 9 — Sep 2, 2026",   start: "2026-06-09", end: "2026-09-02", enrollment_close: "2026-06-05", seats_left: 24, urgent: false },
  { id: "coh-004", name: "Sep 7 — Nov 28, 2026",  start: "2026-09-07", end: "2026-11-28", enrollment_close: "2026-09-03", seats_left: 30, urgent: false },
];

const HIGHLIGHTS = [
  { emoji: "💻", title: "Become a full-stack developer", body: "Build, deploy, and maintain complete web applications — front-end and back-end — using industry-standard tools and workflows." },
  { emoji: "⚡", title: "Work with modern tech stacks", body: "Real tools real teams use: React, Node.js, PostgreSQL, REST APIs, Git, Docker, and deployment on Vercel & Railway." },
  { emoji: "🎯", title: "Project-driven learning", body: "Ship 4 complete projects from scratch — a portfolio site, a SaaS dashboard, a REST API, and a full-stack capstone app." },
  { emoji: "👨‍🏫", title: "Learn from a practitioner", body: "Your instructor has built products used by thousands. Every lesson is grounded in real-world engineering, not just theory." },
];

const CURRICULUM = [
  { week: "Week 1–2",  title: "Web Foundations",        lessons: 14, topics: "HTML5, CSS3, Flexbox, Grid, Responsive Design" },
  { week: "Week 3–5",  title: "JavaScript & ES6+",      lessons: 22, topics: "Functions, DOM, Fetch, Async/Await, Modules" },
  { week: "Week 6–8",  title: "React & State Management",lessons: 20, topics: "Components, Hooks, Context, React Router, Redux" },
  { week: "Week 9–10", title: "Backend with Node.js",   lessons: 16, topics: "Express, REST APIs, Authentication, JWT" },
  { week: "Week 11",   title: "Databases",              lessons: 10, topics: "PostgreSQL, Prisma ORM, Migrations, Queries" },
  { week: "Week 12",   title: "Capstone & Deployment",  lessons:  8, topics: "Docker, CI/CD, Vercel, Railway, Portfolio Polish" },
];

const OUTCOMES = [
  "Build and deploy full-stack web applications independently",
  "Write clean, maintainable JavaScript and React code",
  "Design and consume REST APIs with Node.js & Express",
  "Model and query relational databases with PostgreSQL",
  "Use Git, GitHub, and professional development workflows",
  "Deploy projects to the cloud and manage environments",
  "Present and explain your work in a technical interview",
];

const FAQS = [
  { q: "Do I need any prior experience?", a: "No prior coding experience required. We start from absolute zero and move at a structured pace through every concept." },
  { q: "How much time per week does this require?", a: "Expect 10–15 hours per week — 3 live sessions plus independent project work. It is intensive by design." },
  { q: "What happens if I miss a live session?", a: "All sessions are recorded and available within 24 hours. You also get access to the session notes and exercises." },
  { q: "Is there a certificate upon completion?", a: "Yes. Learners who complete all modules and submit the capstone project receive a verified CohortLMS certificate." },
  { q: "Can I switch to a different cohort date?", a: "Yes, up to 7 days before your cohort's start date you can transfer to any future cohort at no extra cost." },
];

// ── Helpers ─────────────────────────────────────────────────
function Stars({ rating, reviews, size = "sm" }) {
  const full = Math.floor(rating);
  const sz   = size === "lg" ? "text-lg" : "text-sm";
  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-amber-400 ${sz} leading-none`}>{"★".repeat(full)}{"☆".repeat(5 - full)}</span>
      <span className={`font-bold text-slate-800 ${size === "lg" ? "text-base" : "text-[13px]"}`}>{rating}</span>
      {reviews > 0 && <span className="text-slate-400 text-[12px]">({reviews} reviews)</span>}
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 className="text-[22px] font-black text-slate-900 mb-5 tracking-tight">{children}</h2>;
}

// ── Sticky sidebar ───────────────────────────────────────────
function Sidebar({ cohorts }) {
  const [selected, setSelected]   = useState(cohorts[0].id);
  const [email, setEmail]         = useState("");
  const [enrolled, setEnrolled]   = useState(false);
  const selectedCohort = cohorts.find((c) => c.id === selected);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden">

      {/* Price */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-100">
        <div className="flex items-end gap-2 mb-1">
          <span className="text-[28px] font-black text-slate-900">Free</span>
          <span className="text-slate-400 text-sm mb-1">during enrollment</span>
        </div>
        <Stars rating={4.9} reviews={148} />
      </div>

      <div className="px-6 py-5 space-y-5">

        {/* Cohort selector */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Select Cohort</p>
          <div className="space-y-2">
            {cohorts.map((c) => (
              <label key={c.id}
                className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 cursor-pointer transition-all ${
                  selected === c.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}>
                <input
                  type="radio"
                  name="cohort"
                  value={c.id}
                  checked={selected === c.id}
                  onChange={() => setSelected(c.id)}
                  className="accent-blue-600 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className={`text-[13px] font-semibold ${selected === c.id ? "text-blue-700" : "text-slate-700"}`}>
                    {c.name}
                  </span>
                  {c.urgent && (
                    <span className="ml-2 text-[10px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded-full">
                      {c.seats_left} seats left
                    </span>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Seats left warning */}
        {selectedCohort?.urgent && (
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
            <span className="text-sm">🔥</span>
            <span className="text-[12px] font-semibold text-rose-700">
              Only {selectedCohort.seats_left} seats remaining in this cohort
            </span>
          </div>
        )}

        {/* Enroll CTA */}
        {enrolled ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3.5 text-center">
            <p className="text-emerald-700 font-bold text-sm">✓ You're enrolled!</p>
            <p className="text-emerald-600 text-[12px] mt-0.5">Check your email for next steps.</p>
          </div>
        ) : (
          <button
            onClick={() => setEnrolled(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-[15px] py-4 rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 active:translate-y-0 transition-all duration-200 relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <span className="relative">Enroll Now</span>
          </button>
        )}

        {/* Email updates */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Get Course Updates</p>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition min-w-0"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 rounded-xl transition-colors flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="space-y-2 pt-1">
          {[
            { icon: "🔒", text: "Secure enrollment · No payment required" },
            { icon: "🔄", text: "Switch cohort anytime before start date" },
            { icon: "🏆", text: "Verified certificate on completion" },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-2.5 text-[12px] text-slate-500">
              <span className="text-base leading-none">{b.icon}</span>
              <span>{b.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── FAQ Item ────────────────────────────────────────────────
function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-[14.5px] font-semibold text-slate-800">{faq.q}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          className={`flex-shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <p className="text-[13.5px] text-slate-500 leading-relaxed pb-4 -mt-1">{faq.a}</p>
      )}
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────
export default function CourseDetailPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const TABS = ["overview", "curriculum", "instructor", "faqs"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Instrument+Serif:ital@0;1&display=swap');
        .cpf  { font-family: 'DM Sans', sans-serif; }
        .cps  { font-family: 'Instrument Serif', serif; }
        .lc3  { display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden }
      `}</style>

      <div className="cpf bg-white min-h-screen">

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
                  <span className="text-sm">🚀</span>
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
                    { i: "📚", v: "65 lessons" },
                    { i: "⏱️", v: "25h+ content" },
                    { i: "📡", v: "3x live / week" },
                    { i: "🏆", v: "Certificate" },
                    { i: "🌍", v: "English" },
                  ].map((m) => (
                    <div key={m.v} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
                      <span className="text-xs">{m.i}</span>
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
                    <span className="text-base">🔥</span>
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
                    <p className="text-[13.5px] font-bold text-blue-600 mb-4">CohortLMS's most complete development program · 2,400+ alumni</p>

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