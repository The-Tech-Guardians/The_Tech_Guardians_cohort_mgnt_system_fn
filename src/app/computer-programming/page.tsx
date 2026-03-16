"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Code2, BookOpen, Users, GraduationCap, Clock, TrendingUp, Search } from "lucide-react";
import { courseService } from "@/services/courseService";
import { cohortService, type Cohort } from "@/services/cohortService";
import { tokenManager } from "@/lib/auth";
import Button from "@/components/ui/Button";
import CTAButton from "@/components/herro-section/CtaButton";

interface BackendCourse {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  cohortId: string;
  courseType: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function ComputerProgrammingPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [courses, setCourses] = useState<BackendCourse[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseRes, cohortRes] = await Promise.all([
          courseService.getAllCourses(1, 100),
          cohortService.getAllCohorts(1, 100).catch(() => ({ cohorts: [] }))
        ]);
        const compCourses = courseRes.courses.filter(c => c.courseType === 'COMPUTER_PROGRAMMING' && c.isPublished);
        setCourses(compCourses);
        setCohorts(cohortRes.cohorts);
      } catch (err) {
        console.error(err);
        setError("Failed to load Computer Programming courses. Backend may be offline.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cohortMap = cohorts.reduce((acc, cohort) => {
    acc[cohort.id] = cohort;
    return acc;
  }, {} as Record<string, Cohort>);

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const cohort = cohortMap[c.cohortId];
    const cohortName = cohort?.name || '';
    const matchCohort = cohortName.toLowerCase().includes(search.toLowerCase());
    const isActive = cohort?.isActive || false;
    const cohortStatus = isActive ? 'Active' : 'Upcoming';
    const matchStatus = status === 'All' || status === cohortStatus;
    return (matchSearch || matchCohort) && matchStatus;
  });

  const handleJoinCohort = async (cohortId: string) => {
    if (!confirm('Join this cohort? You can only be in one cohort.')) return;
    try {
      const result = await cohortService.joinCohort(cohortId);
      alert(`Joined ${result.data.cohortName}!`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join cohort. Please login.';
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading Computer Programming courses...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen max-w-7xl mx-auto pb-10 font-sans">
      <section className="relative overflow-hidden pt-24 px-6">
        <div className="relative">
            <div className="flex items-center justify-between pt-14 mb-8">
              <div className="flex items-center gap-2 text-[12.5px] text-slate-400" >
                  <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
                <span>/</span>
                <span className="text-blue-400 font-medium">Computer Programming</span>
              </div>
              
                <CTAButton primary onClick={async () => {
                  const isValid = await tokenManager.validateAuth();
                  if (isValid) {
                    window.location.href = '/cohorts';
                  } else {
                    window.location.href = '/login';
                  }
                }}>Join Cohort</CTAButton>
            </div>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #3b82f620, #06b6d420)", border: "1px solid #3b82f630" }}>
              <Code2 size={30} color="#60a5fa" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight">Computer Programming</h1>
              <p className="mt-3 text-[15px] leading-relaxed">From web development to algorithms — hands-on courses for every level. Build real projects and land your next role.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { v: `${filtered.length} Courses`, icon: <BookOpen size={14} /> },
              { v: `${cohorts.length} Cohorts`, icon: <Users size={14} /> },
              { v: "Certificates Included", icon: <GraduationCap size={14} /> },
            ].map(s => (
              <div key={s.v} className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] text-gray-500 border border-gray-200">
                {s.icon}{s.v}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" />
            <input type="text" placeholder="Search courses or cohorts..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13.5px] text-slate-800 placeholder-slate-400 outline-none focus:border-blue-400 transition-colors shadow-sm" />
          </div>
          <div className="flex gap-2">
            {["All", "Active", "Upcoming"].map(l => (
              <button key={l} onClick={() => setStatus(l)} className={`px-3.5 py-2 rounded-xl text-[12.5px] font-medium border transition-all ${status === l ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}>{l}</button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-[12.5px] text-slate-400">{filtered.length} course{filtered.length !== 1 ? "s" : ""} available</p>
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </section>

      <section className="px-6 pb-20">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search size={48} className="mx-auto mb-3 text-slate-300" />
            <p className="text-[15px] font-medium text-slate-600">No Computer Programming courses match your search</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-xl">Retry</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(course => {
              const cohort = cohortMap[course.cohortId];
              const isActive = cohort?.isActive || false;
              return (
                <article key={course.id} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                  <div className="h-40 flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, #3b82f615, #06b6d415)" }}>
                    <Code2 size={56} color="#3b82f6" strokeWidth={1} opacity={0.5} />
                    {isActive && <span className="absolute top-3 right-3 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-900">Open</span>}
                    <span className="absolute top-3 left-3 text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-blue-100 text-blue-700 border-blue-200">Programming</span>
                  </div>
                  <div className="flex flex-col flex-1 p-5 gap-3">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">Computer Programming</span>
                    <h3 className="text-[14.5px] font-semibold text-slate-900 leading-snug line-clamp-2">{course.title}</h3>
                    <p className="text-[12.5px] text-slate-500 leading-relaxed line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">TBA</span>
                      <span className="text-[12px] text-slate-500">Programming Instructor</span>
                    </div>
                    <div className="flex gap-3 text-[12px] text-slate-400">
                      <span className="flex items-center gap-1"><Users size={11} />{cohort?.currentStudents || 0}/{cohort?.maxStudents || 0} seats</span>
                    </div>
                    <div className="mt-auto pt-3 border-t border-slate-100 flex flex-col gap-2">
                      <span className="text-[13px] font-semibold text-slate-900">{cohort?.name || 'Programming Cohort'}</span>
                      <CTAButton primary onClick={async () => {
                const isValid = await tokenManager.validateAuth();
                if (!isValid) {
                  window.location.href = '/login';
                  return;
                }
                const currentCohort = localStorage.getItem('currentCohortId');
                if (currentCohort) {
                  alert('Already enrolled in a cohort');
                  return;
                }
                window.location.href = '/cohorts';
              }}>Join Cohort</CTAButton>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

