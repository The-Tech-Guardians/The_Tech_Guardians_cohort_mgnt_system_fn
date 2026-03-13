"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { HeartPulse, BookOpen, Users, GraduationCap, Star, Clock, PlayCircle, Search, BadgeCheck, TrendingUp, Award } from "lucide-react";
import { courseService } from "@/services/courseService";
import { cohortService, type Cohort } from "@/services/cohortService";
import { tokenManager } from "@/lib/auth";
import CTAButton from "@/components/herro-section/CtaButton";

interface BackendCourse {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  cohortId: string;
  courseType: string;
  isPublished: boolean;
}

const LEVEL_COLOR: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Intermediate: "bg-purple-100 text-purple-700 border-purple-200",
  Advanced: "bg-rose-100 text-rose-700 border-rose-200",
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star 
          key={s} 
          size={11} 
          fill={s <= Math.round(rating) ? "#f59e0b" : "none"} 
          stroke="#f59e0b" 
          strokeWidth={2} 
        />
      ))}
    </span>
  );
}

export default function SRHRPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [courses, setCourses] = useState<BackendCourse[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {

      try {
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const [courseRes, cohortRes] = await Promise.all([
          fetch('http://localhost:3000/api/courses?page=1&limit=50', { headers }).then(r => r.json()),
          fetch('http://localhost:3000/api/cohorts?page=1&limit=50', { headers }).then(r => r.json())
        ]);
        const srhrCourses = (courseRes.courses || []).filter((c: any) => c.courseType === 'SRHR' && c.isPublished);
        setCourses(srhrCourses);
        setCohorts(cohortRes.cohorts || []);
      } catch (e) {
        console.error('Backend fetch failed:', e);
        setCourses([]);
        setCohorts([]);
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

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase()) &&
    (!level || true) // level filter can be added later
  );

  return (
    <main className="min-h-screen pb-10 max-w-7xl mx-auto font-sans">
      <section className="relative overflow-hidden pt-24 px-6">
        <div className="relative pt-14">
          <div className="flex items-center justify-between pt-14 mb-8">
            <div className="flex items-center gap-2 text-[12.5px] text-slate-400">
              <Link href="/" className="hover:text-rose-400 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-rose-400 font-medium">SRHR</span>
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
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(244,63,94,0.15)", border: "1px solid rgba(244,63,94,0.3)" }}>
              <HeartPulse size={30} color="#fb7185" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold">Sexual & Reproductive<br />Health & Rights</h1>
              <p className="mt-3 text-[15px] leading-relaxed">Evidence-based courses for health workers, educators, and advocates driving reproductive health equity.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { v: `${filteredCourses.length} Courses`, icon: <BookOpen size={14} /> },
              { v: "Live cohorts", icon: <Users size={14} /> },
              { v: "Certificates", icon: <GraduationCap size={14} /> },
              { v: "4.8 Avg Rating", icon: <Star size={13} fill="#fbbf24" stroke="#fbbf24" /> },
            ].map(({ v, icon }) => (
              <div key={v} className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] text-gray-500 border border-gray-200">
                {icon}{v}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-400" />
            <input 
              type="text" 
              placeholder="Search courses…" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-rose-100 bg-white text-[13.5px] text-slate-800 placeholder-slate-400 outline-none focus:border-rose-400 transition-colors shadow-sm" 
            />
          </div>
          <div className="flex gap-2">
            {["", "Beginner", "Intermediate", "Advanced"].map(l => (
              <button 
                key={l} 
                onClick={() => setLevel(l)} 
                className={`px-3.5 py-2 rounded-xl text-[12.5px] font-medium border transition-all ${level === l ? "bg-rose-500 text-white border-rose-500" : "bg-white text-slate-600 border-rose-100 hover:border-rose-300"}`}
              >
                {l || "All"}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-[12.5px] text-slate-400">{filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""} available</p>
      </section>

      <section className="px-6 pb-20">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20">
            <Search size={48} className="mx-auto mb-3 text-slate-300" />
            <p className="text-[15px] font-medium text-slate-600">No courses match your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => {
              const cohort = cohortMap[course.cohortId];
              return (
                <article key={course.id} className="group bg-white rounded-2xl border border-rose-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                  <div className="h-40 flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, #f43f5e15, #a855f715)" }}>
                    <HeartPulse size={56} color="#f43f5e" strokeWidth={1} opacity={0.5} />
                    <span className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-rose-700 border border-rose-200">
                      Live
                    </span>
                    <span className="absolute top-3 left-3 text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-white text-rose-700 border-rose-200">
                      Beginner
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 p-5 gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 font-medium">SRHR</span>
                    </div>
                    <h3 className="text-[14.5px] font-semibold text-slate-900 leading-snug line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-[12.5px] text-slate-500 leading-relaxed line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-rose-500 to-pink-500">
                        TBA
                      </span>
                      <span className="text-[12px] text-slate-500">SRHR Instructor</span>
                    </div>
                    <div className="flex gap-3 text-[12px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        Live cohort
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={11} />
                        {cohort?.currentStudents || 0}/{cohort?.maxStudents || 30}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-base">
                          {cohort?.name || 'SRHR Cohort'}
                        </span>
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

