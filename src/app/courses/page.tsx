"use client";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import {
  Star,  Users, Search,  LayoutGrid, List, SlidersHorizontal, X, ChevronDown,
  BookOpen, GraduationCap, Flame, 
} from "lucide-react";
import { courseService, type BackendCourse, PaginationInfo } from "@/services/courseService";
import { cohortService } from "@/services/cohortService";
import { FALLBACK_BACKEND_COHORTS } from "@/lib/course-data";
import { CourseCardGrid } from "@/components/courses/course-card";
import { CourseCardList } from "@/components/courses/CourseList";







export function getCohortConfig(cohortId: string, cohorts: any[]) {
  return cohorts.find(c => c.id === cohortId) ?? cohorts[0];
}


export default function CoursesPage() {
  const [search, setSearch]           = useState("");
  const [activeCohortId, setActiveCohortId] = useState("");

  const [activeLevel, setLevel]       = useState("");
  const [activePrice, setPrice]       = useState("");  // "" | "free" | "paid"
  const [sort, setSort]               = useState("popular");
  const [viewMode, setViewMode]       = useState<"grid" | "list">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [courses, setCourses] = useState<BackendCourse[]>([]);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dataSource, setDataSource] = useState<'live' | 'fallback'>('live');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const coursesResult = await courseService.getAllCourses(1, 100);
        const cohortsResult = await cohortService.getAllCohorts(1, 20).catch(() => ({ cohorts: [] }));
        
        setCourses(coursesResult.courses);
        setDataSource((coursesResult.pagination as any)?.dataSource || 'live');

        // Fallback cohorts if backend fails
        setCohorts(cohortsResult.cohorts?.length > 0 ? cohortsResult.cohorts : FALLBACK_BACKEND_COHORTS);

      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Backend offline - using demo data');
        setCourses([]);
        setCohorts(FALLBACK_BACKEND_COHORTS || []);
        setDataSource('fallback');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const featured = courses.filter(c => c.isPublished); // Assume published = featured for now

  const filtered = useMemo(() => {
    let list = [...courses];
    if (search) list = list.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
    if (activeCohortId) list = list.filter(c => c.cohortId === activeCohortId);
    // Level/price filtering - add when backend supports
    if (sort === "popular") list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')); 
    if (sort === "newest") list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    return list;
  }, [courses, search, activeCohortId, sort]);


  const hasFilters = search || activeCohortId || activeLevel || activePrice;

  return (
    <main className="min-h-screen font-sans">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-24 pb-14 px-6"
       >
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#60a5fa 1px,transparent 1px),linear-gradient(90deg,#60a5fa 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute top-0 left-1/4 w-[500px] h-64 rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(ellipse,#6366f1,transparent)" }} />

        <div className="relative max-w-6xl mx-auto pt-18">
          <div className="flex items-center gap-2 text-[12.5px] text-slate-500 mb-5">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <span>/</span>
            <span className=" font-medium" style={{ background: "linear-gradient(90deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>All Courses</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
                <div className="flex items-center pt-12 gap-3 mb-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold text-indigo-300 border border-indigo-500/30"
                    style={{ background: "rgba(99,102,241,0.1)" }}>
                    <BookOpen size={12} /> {courses.length} Courses Available
                  </div>
                </div>
              <h1 className="text-4xl lg:text-5xl font-bold  tracking-tight leading-tight">
                Explore All <span style={{ background: "linear-gradient(90deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Courses</span>
              </h1>
              <p className="mt-3 text-slate-400 text-[15px] max-w-lg leading-relaxed">
                Everything from coding to branding — self-paced, certificate-ready courses built for the African learner.
              </p>
            </div>

            {/* Hero stats */}
            <div className="flex gap-4 lg:flex-col lg:items-end">
              {[
                { icon: <Users size={14} />, v: "530K+", label: "Total Learners" },
                { icon: <GraduationCap size={14} />, v: "100%", label: "Certificate Ready" },
                { icon: <Star size={13} fill="#fbbf24" stroke="#fbbf24" />, v: "4.8", label: "Avg Rating" },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2 text-[12.5px]">
                  <span className="text-indigo-400">{s.icon}</span>
                  <span className="font-bold ">{s.v}</span>
                  <span className="text-slate-500">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Global search */}
          <div className="relative mt-8 max-w-xl">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search any course, topic, or skill…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-300  placeholder-slate-500 text-[14px] outline-none focus:border-indigo-500/60 focus:bg-white/15 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Category pills ── */}
      <section className="bg-white- border-b border-slate-100 sticky top-[104px] z-30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 h-12 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveCohortId("")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12.5px] font-medium whitespace-nowrap border transition-all flex-shrink-0 ${
                !activeCohortId ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
              }`}
            >
              All Cohorts
            </button>
{cohorts.map((cohort, index) => (
                <button
                  key={cohort.id || `cohort-${index}`}
                  onClick={() => setActiveCohortId(cohort.id || '')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12.5px] font-medium whitespace-nowrap border transition-all flex-shrink-0 ${
                    activeCohortId === cohort.id ? "bg-indigo-500 text-white border-indigo-500" : " text-slate-500 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <Users size={12} /> {cohort.name}
                </button>
              ))}

          </div>
        </div>
      </section>

      {/* ── Featured section (only when no filters) ── */}
      {!hasFilters && (
        <section className="max-w-6xl mx-auto px-6 pt-10 pb-2">
          <div className="flex items-center gap-2 mb-5">
            <Flame size={18} className="text-orange-500" />
            <h2 className="text-[17px] font-bold text-slate-900">Featured Courses</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {featured.map(course => (
              <CourseCardGrid key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}

      {/* ── Main content ── */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-20">
        <div className="flex gap-6">

          {/* Sidebar */}
          {sidebarOpen && (
            <aside className="w-56 flex-shrink-0 hidden lg:block">
              <div className="sticky top-[160px] bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-5">

                {/* Level */}
                <div>
                  <p className="text-[11.5px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Level</p>
                  <div className="flex flex-col gap-1.5">
                    {["", "Beginner", "Intermediate", "Advanced"].map(l => (
                      <button key={l} onClick={() => setLevel(l === activeLevel ? "" : l)}
                        className={`text-left px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-all ${
                          activeLevel === l && l !== "" ? "bg-slate-900 text-white" : activeLevel === "" && l === "" ? "bg-slate-100 text-slate-700" : "text-slate-500 hover:bg-slate-50"
                        }`}>
                        {l || "All Levels"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Price */}
                <div>
                  <p className="text-[11.5px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Price</p>
                  <div className="flex flex-col gap-1.5">
                    {[["", "Any Price"], ["free", "Free Only"], ["paid", "Paid Only"]].map(([val, label]) => (
                      <button key={val} onClick={() => setPrice(val === activePrice ? "" : val)}
                        className={`text-left px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-all ${
                          activePrice === val && val !== "" ? "bg-slate-900 text-white" : activePrice === "" && val === "" ? "bg-slate-100 text-slate-700" : "text-slate-500 hover:bg-slate-50"
                        }`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Reset */}
                {hasFilters && (
                <button
                  onClick={() => { setSearch(""); setActiveCohortId(""); setLevel(""); setPrice(""); }}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium text-rose-500 bg-rose-50 hover:bg-rose-100 transition-all"
                >
                  <X size={12} /> Clear all filters
                </button>
                )}
              </div>
            </aside>
          )}

          {/* Right column */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button onClick={() => setSidebarOpen(v => !v)}
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium border border-slate-200 text-slate-500 hover:border-slate-400 transition-all">
                  <SlidersHorizontal size={13} /> Filters
                </button>
                <span className="text-[13px] text-slate-400 font-medium">
                  <span className="text-slate-800 font-semibold">{filtered.length}</span> courses
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Sort */}
                <div className="relative">
                  <select value={sort} onChange={e => setSort(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-1.5 rounded-lg text-[12.5px] font-medium border border-slate-200 bg-white text-slate-600 outline-none cursor-pointer">
                    <option value="popular">Most Popular</option>
                    <option value="rating">Top Rated</option>
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* View toggle */}
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                  <button onClick={() => setViewMode("grid")}
                    className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"}`}>
                    <LayoutGrid size={14} />
                  </button>
                  <button onClick={() => setViewMode("list")}
                    className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"}`}>
                    <List size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2">
                {search && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium bg-indigo-50 text-indigo-600 border border-indigo-200">
                    "{search}" <button onClick={() => setSearch("")}><X size={11} /></button>
                  </span>
                )}
                {activeCohortId && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium bg-slate-100 text-slate-600">
                    {cohorts.find(c => c.id === activeCohortId)?.name || activeCohortId}
                    <button onClick={() => setActiveCohortId("")}><X size={11} /></button>
                  </span>

                )}
                {activeLevel && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium bg-slate-100 text-slate-600">
                    {activeLevel} <button onClick={() => setLevel("")}><X size={11} /></button>
                  </span>
                )}
                {activePrice && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium bg-slate-100 text-slate-600">
                    {activePrice === "free" ? "Free" : "Paid"} <button onClick={() => setPrice("")}><X size={11} /></button>
                  </span>
                )}
              </div>
            )}

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="text-center py-24">
                <Search size={48} className="mx-auto mb-3 text-slate-200" />
                <p className="text-[15px] font-semibold text-slate-600">No courses found</p>
                <p className="text-[13px] text-slate-400 mt-1">Try adjusting your filters or search term</p>
                <button onClick={() => { setSearch(""); setActiveCohortId(""); setLevel(""); setPrice(""); }}
                  className="mt-4 px-4 py-2 rounded-xl text-[13px] font-medium bg-slate-900 text-white hover:bg-slate-700 transition-all">
                  Clear all filters
                </button>
              </div>
            )}

            {loading && (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p>Loading courses...</p>
              </div>
            )}
            {error && (
              <div className="text-center py-20">
                <p className="text-red-500 mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-blue-500 text-white rounded-xl">Retry</button>
              </div>
            )}
            {/* Grid view */}
            {viewMode === "grid" && filtered.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(course => <CourseCardGrid key={course.id} {...course as any} />)}
              </div>
            )}

            {/* List view */}
            {viewMode === "list" && filtered.length > 0 && (
              <div className="flex flex-col gap-3">
                {filtered.map(course => <CourseCardList key={course.id} {...course as any} />)}
              </div>
            )}

          </div>
        </div>
      </section>
    </main>
  );
}