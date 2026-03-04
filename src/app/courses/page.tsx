"use client"

import { BarChartBigIcon, Book, ChartLine, Clock, Computer } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const INSTRUCTORS = {
  "ins-001": { name: "Freddy Bijanja",    role: "Lead Instructor",  initials: "FB", gradient: "from-blue-500 to-cyan-400" },
  "ins-002": { name: "IRADUKUNDA Boris",  role: "Design Lead",       initials: "IB", gradient: "from-violet-500 to-pink-400" },
  "ins-003": { name: "Olivier Nduwayesu", role: "Data Engineer",     initials: "ON", gradient: "from-emerald-500 to-teal-400" },
  "ins-004": { name: "Sarah Amara",       role: "Marketing Expert",  initials: "SA", gradient: "from-amber-400 to-orange-400" },
  "ins-005": { name: "Amara Diallo",      role: "Coach",             initials: "AD", gradient: "from-sky-400 to-blue-400" },
};

const COHORTS = {
  "coh-001": { name: "Full-Stack Cohort · Apr 2026",     gradient: "from-blue-600 to-cyan-500" },
  "coh-002": { name: "UI/UX Design Cohort · Apr 2026",   gradient: "from-violet-500 to-pink-500" },
  "coh-003": { name: "Data Science Cohort · Feb 2026",   gradient: "from-emerald-500 to-teal-400" },
  "coh-004": { name: "Marketing Cohort · May 2026",      gradient: "from-amber-400 to-orange-400" },
  "coh-005": { name: "Mobile Dev Cohort · Apr 2026",     gradient: "from-rose-500 to-pink-500" },
};

const COURSES = [
  {
    id: "crs-0001-uuid",
    title: "Introduction to HTML & CSS",
    description: "Build solid foundations in web markup and styling. You will learn semantic HTML5, Flexbox, Grid, and responsive design patterns used in real production projects.",
    instructor_id: "ins-001",
    cohort_id: "coh-001",
    course_type: "development",
    is_published: true,
    created_at: "2026-01-10",
    // UI extras
    duration: "2 weeks", lessons: 14, level: "Beginner",
    rating: 4.9, reviews: 112, enrolled: 240,
    topics: ["HTML5", "CSS3", "Flexbox", "Grid", "Responsive"],
    gradient: "from-blue-600 to-cyan-500",
    featured: true,
  },
  {
    id: "crs-0002-uuid",
    title: "JavaScript Fundamentals",
    description: "Master the language of the web. From variables and functions to DOM manipulation and async programming — this course covers everything you need to write real JavaScript.",
    instructor_id: "ins-001",
    cohort_id: "coh-001",
    course_type: "development",
    is_published: true,
    created_at: "2026-01-12",
    duration: "3 weeks", lessons: 22, level: "Beginner",
    rating: 4.8, reviews: 98, enrolled: 210,
    topics: ["Variables", "Functions", "DOM", "Async/Await", "ES6+"],
    gradient: "from-blue-500 to-indigo-500",
    featured: false,
  },
  {
    id: "crs-0003-uuid",
    title: "React — Build Modern UIs",
    description: "Dive deep into the most popular front-end library. Components, hooks, state management, routing, and connecting to APIs. Build three complete projects from scratch.",
    instructor_id: "ins-001",
    cohort_id: "coh-001",
    course_type: "development",
    is_published: true,
    created_at: "2026-01-20",
    duration: "4 weeks", lessons: 30, level: "Intermediate",
    rating: 4.9, reviews: 87, enrolled: 195,
    topics: ["Components", "Hooks", "Redux", "React Router", "APIs"],
    gradient: "from-cyan-500 to-blue-600",
    featured: false,
  },
  {
    id: "crs-0004-uuid",
    title: "Figma for Product Designers",
    description: "Go from sketch to polished prototype. Learn auto-layout, components, variants, design tokens, and how to hand off designs to developers like a senior designer.",
    instructor_id: "ins-002",
    cohort_id: "coh-002",
    course_type: "design",
    is_published: true,
    created_at: "2026-01-15",
    duration: "2 weeks", lessons: 16, level: "All Levels",
    rating: 4.8, reviews: 74, enrolled: 168,
    topics: ["Auto-layout", "Components", "Variants", "Tokens", "Handoff"],
    gradient: "from-violet-500 to-pink-500",
    featured: false,
  },
  {
    id: "crs-0005-uuid",
    title: "User Research & UX Strategy",
    description: "Great products start with deep user understanding. Learn interviews, surveys, usability testing, and how to synthesize insights into product decisions that stick.",
    instructor_id: "ins-002",
    cohort_id: "coh-002",
    course_type: "design",
    is_published: false,
    created_at: "2026-01-18",
    duration: "2 weeks", lessons: 12, level: "Intermediate",
    rating: null, reviews: 0, enrolled: 0,
    topics: ["Interviews", "Surveys", "Usability Testing", "Personas", "Journey Maps"],
    gradient: "from-fuchsia-500 to-violet-500",
    featured: false,
  },
  {
    id: "crs-0006-uuid",
    title: "Python for Data Analysis",
    description: "Hands-on data work with Python. You will manipulate large datasets with Pandas, visualize patterns with Matplotlib and Seaborn, and query databases using SQL.",
    instructor_id: "ins-003",
    cohort_id: "coh-003",
    course_type: "data",
    is_published: true,
    created_at: "2025-12-20",
    duration: "3 weeks", lessons: 20, level: "Intermediate",
    rating: 4.9, reviews: 63, enrolled: 140,
    topics: ["Python", "Pandas", "Matplotlib", "Seaborn", "SQL"],
    gradient: "from-emerald-500 to-teal-400",
    featured: false,
  },
  {
    id: "crs-0007-uuid",
    title: "Machine Learning Basics",
    description: "Demystify machine learning. Understand supervised and unsupervised learning, train your first models with scikit-learn, and evaluate them with real-world datasets.",
    instructor_id: "ins-003",
    cohort_id: "coh-003",
    course_type: "data",
    is_published: false,
    created_at: "2026-01-05",
    duration: "3 weeks", lessons: 18, level: "Advanced",
    rating: null, reviews: 0, enrolled: 0,
    topics: ["scikit-learn", "Supervised Learning", "Clustering", "Model Evaluation"],
    gradient: "from-teal-500 to-cyan-500",
    featured: false,
  },
  {
    id: "crs-0008-uuid",
    title: "SEO & Content Marketing",
    description: "Learn how to get your content found and loved. Keyword research, on-page SEO, content calendars, and measuring performance — the full content marketing playbook.",
    instructor_id: "ins-004",
    cohort_id: "coh-004",
    course_type: "business",
    is_published: true,
    created_at: "2026-02-01",
    duration: "2 weeks", lessons: 14, level: "All Levels",
    rating: 4.7, reviews: 38, enrolled: 90,
    topics: ["Keyword Research", "On-Page SEO", "Backlinks", "Analytics", "Content Strategy"],
    gradient: "from-amber-400 to-orange-400",
    featured: false,
  },
  {
    id: "crs-0009-uuid",
    title: "React Native — Mobile Apps",
    description: "Build polished iOS and Android apps with a single codebase. Navigation, native APIs, push notifications, and publishing to the App Store and Google Play.",
    instructor_id: "ins-001",
    cohort_id: "coh-005",
    course_type: "development",
    is_published: true,
    created_at: "2026-02-05",
    duration: "4 weeks", lessons: 28, level: "Intermediate",
    rating: 4.7, reviews: 45, enrolled: 110,
    topics: ["React Native", "Expo", "Navigation", "Push Notifications", "App Store"],
    gradient: "from-rose-500 to-pink-500",
    featured: false,
  },
  {
    id: "crs-0010-uuid",
    title: "Public Speaking Masterclass",
    description: "Communicate ideas that move people. From structuring arguments to controlling nerves, mastering body language and delivering presentations with poise and power.",
    instructor_id: "ins-005",
    cohort_id: "coh-001",
    course_type: "personal",
    is_published: true,
    created_at: "2025-11-20",
    duration: "2 weeks", lessons: 10, level: "All Levels",
    rating: 5.0, reviews: 41, enrolled: 130,
    topics: ["Storytelling", "Body Language", "Slide Design", "Q&A Handling", "Confidence"],
    gradient: "from-sky-400 to-blue-500",
    featured: false,
  },
];

// ── Config ──────────────────────────────────────────────────
const TYPE_CONFIG = {
  development: { label: "Development",     color: "bg-blue-50 text-blue-600",     icon: <Computer/> },
  design:      { label: "Design",          color: "bg-violet-50 text-violet-600", icon: "🎨 "},
  data:        { label: "Data Science",    color: "bg-emerald-50 text-emerald-600",icon: <BarChartBigIcon/> },
  business:    { label: "Business",        color: "bg-amber-50 text-amber-600",   icon: <ChartLine/> },
  personal:    { label: "Personal Growth", color: "bg-sky-50 text-sky-600",       icon: "🌱" },
};

const LEVEL_COLOR = {
  "Beginner":     "bg-green-50 text-green-700 border-green-200",
  "Intermediate": "bg-blue-50 text-blue-700 border-blue-200",
  "Advanced":     "bg-rose-50 text-rose-700 border-rose-200",
  "All Levels":   "bg-slate-100 text-slate-600 border-slate-200",
};

const COURSE_TYPES = ["All", "development", "design", "data", "business", "personal"];

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── Published pill ──────────────────────────────────────────
function PublishedPill({ is_published }) {
  return is_published
    ? <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>Published</span>
    : <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"/>Draft</span>;
}

// ── Star Rating ─────────────────────────────────────────────
function Stars({ rating }) {
  if (!rating) return <span className="text-[11px] text-slate-400">No ratings yet</span>;
  return (
    <div className="flex items-center gap-1">
      <span className="text-amber-400 text-xs">{"★".repeat(Math.floor(rating))}</span>
      <span className="text-[12px] font-bold text-slate-700">{rating}</span>
    </div>
  );
}

// ── Course Card ─────────────────────────────────────────────
function CourseCard({ course }) {
  const [expanded, setExpanded] = useState(false);
  const instructor = INSTRUCTORS[course.instructor_id];
  const cohort     = COHORTS[course.cohort_id];
  const type       = TYPE_CONFIG[course.course_type] || { label: course.course_type, color: "bg-slate-100 text-slate-600", icon: "📚" };

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 hover:shadow-[0_8px_32px_rgba(0,0,0,0.09)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col">

      {/* Gradient bar */}
      <div className={`h-1.5 bg-gradient-to-r ${course.gradient}`} />

      <div className="p-5 flex flex-col gap-4 flex-1">

        {/* Top badges */}
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex flex-wrap gap-1.5">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${type.color}`}>
              {type.icon} {type.label}
            </span>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${LEVEL_COLOR[course.level] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
              {course.level}
            </span>
          </div>
          <PublishedPill is_published={course.is_published} />
        </div>

        {/* Title */}
        <div>
          <h3 className="text-[15.5px] font-bold text-slate-800 leading-snug mb-2">{course.title}</h3>
          <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-3">{course.description}</p>
        </div>

        {/* Instructor */}
        {instructor && (
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${instructor.gradient} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
              {instructor.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-slate-700 leading-none truncate">{instructor.name}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{instructor.role}</p>
            </div>
            <Stars rating={course.rating} />
          </div>
        )}

        {/* Meta row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { i: "📚", v: course.lessons + " lessons" },
            { i: "⏱️", v: course.duration },
            { i: "👥", v: course.enrolled > 0 ? course.enrolled + " enrolled" : "Not started" },
          ].map((m) => (
            <div key={m.v} className="bg-slate-50 rounded-xl px-2 py-2 text-center border border-slate-100">
              <div className="text-sm leading-none mb-1">{m.i}</div>
              <div className="text-[10.5px] font-medium text-slate-600 leading-tight">{m.v}</div>
            </div>
          ))}
        </div>

        {/* Cohort link */}
        {cohort && (
          <div className={`flex items-center gap-2 bg-gradient-to-r ${cohort.gradient} rounded-xl px-3 py-2`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span className="text-white text-[11.5px] font-semibold truncate">{cohort.name}</span>
          </div>
        )}

        {/* Created at + ID */}
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Added {fmtDate(course.created_at)}</span>
          <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[10px]">{course.id.slice(-8).toUpperCase()}</span>
        </div>

        {/* Topics toggle */}
        <div>
          <button onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-500 hover:text-slate-700 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            {expanded ? "Hide" : "Show"} topics ({course.topics.length})
          </button>
          {expanded && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {course.topics.map((t) => (
                <span key={t} className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">{t}</span>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1" />

        {/* CTA */}
        <div className="pt-1">
          {!course.is_published ? (
            <button disabled className="w-full text-[13px] font-semibold text-slate-400 bg-slate-100 py-3 rounded-xl cursor-not-allowed">
              Not yet published
            </button>
          ) : course.enrolled === 0 ? (
            <button className={`w-full relative text-[13px] font-bold text-white py-3 rounded-xl bg-gradient-to-r ${course.gradient} shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all overflow-hidden`}>
              <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"/>
              <span className="relative">Enroll Now</span>
            </button>
          ) : (
           <Link href="course-details">
            <button className={`w-full relative text-[13px] font-bold text-white py-3 rounded-xl bg-gradient-to-r ${course.gradient} shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all overflow-hidden`}>
              <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"/>
              <span className="relative">View Course</span>
            </button>
           </Link>
          
          )}
        </div>
      </div>
    </div>
  );
}

// ── Featured Course Hero ────────────────────────────────────
function FeaturedCourse({ course }) {
  const instructor = INSTRUCTORS[course.instructor_id];
  const cohort     = COHORTS[course.cohort_id];
  const type       = TYPE_CONFIG[course.course_type] || { label: course.course_type, color: "", icon: "📚" };

  return (
    <div className={`relative rounded-3xl bg-gradient-to-br ${course.gradient} p-8 md:p-10 shadow-[0_16px_48px_rgba(37,99,235,0.22)] mb-10 overflow-hidden`}>
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle,#ffffff 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start gap-8">

        {/* Left */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-white/20 border border-white/30 text-white text-[11px] font-bold px-3 py-1 rounded-full">⭐ Featured Course</span>
            <PublishedPill is_published={course.is_published} />
            <span className="bg-white/15 border border-white/25 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">{type.icon} {type.label}</span>
          </div>

          <h2 className="text-[26px] md:text-[32px] font-black text-white leading-tight mb-3">{course.title}</h2>
          <p className="text-white/75 text-[15px] leading-relaxed mb-5 max-w-lg">{course.description}</p>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { i: <Book/>, v: course.lessons + " lessons" },
              { i: <Clock/>, v: course.duration },
              { i: "🎯", v: course.level },
              { i: "👥", v: course.enrolled + " learners" },
            ].map((m) => (
              <div key={m.v} className="flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-full px-3 py-1.5">
                <span className="text-xs leading-none">{m.i}</span>
                <span className="text-white text-[12px] font-medium">{m.v}</span>
              </div>
            ))}
          </div>

          {/* Instructor */}
          {instructor && (
            <div className="flex items-center gap-3 flex-wrap">
              <div className={`w-10 h-10 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white text-sm font-bold`}>
                {instructor.initials}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{instructor.name}</p>
                <p className="text-white/60 text-xs">{instructor.role}</p>
              </div>
              {course.rating && (
                <div className="flex items-center gap-1 bg-white/15 rounded-full px-3 py-1 border border-white/20">
                  <span className="text-yellow-300 text-xs">★</span>
                  <span className="text-white text-xs font-bold">{course.rating}</span>
                  <span className="text-white/50 text-xs">({course.reviews} reviews)</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="lg:w-80 flex-shrink-0 w-full space-y-4">

          {/* Topics */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-5">
            <p className="text-white/60 text-[11px] font-semibold uppercase tracking-widest mb-3">Topics covered</p>
            <div className="flex flex-wrap gap-2">
              {course.topics.map((t) => (
                <span key={t} className="text-[11.5px] font-medium bg-white/15 text-white border border-white/20 px-2.5 py-1 rounded-lg">{t}</span>
              ))}
            </div>
          </div>

          {/* Cohort link */}
          {cohort && (
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
              <p className="text-white/60 text-[11px] font-semibold uppercase tracking-widest mb-2">Part of cohort</p>
              <p className="text-white font-semibold text-[13px]">{cohort.name}</p>
            </div>
          )}

          {/* Course info */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-4 space-y-2">
            {[
              { label: "Course ID",    val: course.id.slice(-8).toUpperCase() },
              { label: "Added",        val: fmtDate(course.created_at) },
              { label: "Type",         val: type.label },
            ].map((r) => (
              <div key={r.label} className="flex justify-between items-center">
                <span className="text-white/55 text-[12px]">{r.label}</span>
                <span className="text-white text-[12px] font-semibold font-mono">{r.val}</span>
              </div>
            ))}
          </div>

          <button className="w-full bg-white text-blue-600 font-black text-[14px] py-3.5 rounded-xl hover:bg-blue-50 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-lg">
            Start This Course
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Instrument+Serif:ital@0;1&display=swap');
        .cpf{font-family:'DM Sans',sans-serif}
        .cps{font-family:'Instrument Serif',serif}
        .cpbg{background:radial-gradient(ellipse 70% 40% at 5% 0%,rgba(37,99,235,.06) 0%,transparent 55%),radial-gradient(ellipse 50% 35% at 95% 100%,rgba(6,182,212,.05) 0%,transparent 55%),#F8FAFC}
        .nosb::-webkit-scrollbar{display:none}.nosb{scrollbar-width:none}
        .lc3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
      `}</style>

      <div className="cpf cpbg min-h-screen pt-20">
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
            {COURSE_TYPES.map((t) => {
              const cfg   = TYPE_CONFIG[t];
              const label = t === "All" ? "All Types" : cfg?.label || t;
              const icon  = t === "All" ? "📚" : cfg?.icon || "";
              return (
                <button key={t} onClick={() => setActiveCat(t)}
                  className={`text-[12.5px] font-semibold px-4 py-2 rounded-full border whitespace-nowrap transition-all flex-shrink-0 ${
                    activeCat === t
                      ? "bg-slate-900 text-white border-slate-900"
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
              <div className="text-5xl mb-4">🔍</div>
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