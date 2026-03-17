"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Users, BookOpen, GraduationCap, Clock, TrendingUp, Search } from "lucide-react";
import { cohortService, type Cohort } from "@/services/cohortService";
import { tokenManager } from "@/lib/auth";
import CTAButton from "@/components/herro-section/CtaButton";

export default function CohortsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await cohortService.getAllCohorts(1, 100);
        const validCohorts = result.cohorts.filter((cohort: Cohort) => cohort.id && cohort.name);
        console.log('Valid cohorts loaded:', validCohorts.length, validCohorts);
        setCohorts(validCohorts);

      } catch (err) {
        console.error(err);
        setError("Failed to load cohorts. Backend may be offline.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = cohorts.filter((cohort: Cohort) => {
      const matchSearch = cohort.name.toLowerCase().includes(search.toLowerCase());
      const isActive = cohort.isActive || false;
      const cohortStatus = isActive ? 'Active' : 'Upcoming';
      const matchStatus = status === 'All' || status === cohortStatus;
      return matchSearch && matchStatus;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading cohorts...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen max-w-7xl mx-auto pb-10 font-sans">
      <section className="relative overflow-hidden pt-24 px-6">
        <div className="relative">
          <div className="flex items-center justify-between pt-14 mb-8">
            <div className="flex items-center gap-2 text-[12.5px] text-slate-400">
              <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-blue-400 font-medium">Cohorts</span>
            </div>
            <CTAButton primary onClick={async () => {
              const isValid = await tokenManager.validateAuth();
              if (isValid) {
                window.location.href = '/courses';
              } else {
                window.location.href = '/login';
              }
            }}>Browse Courses</CTAButton>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #3b82f620, #06b6d420)", border: "1px solid #3b82f630" }}>
              <Users size={30} color="#60a5fa" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight">Available Cohorts</h1>
              <p className="mt-3 text-[15px] leading-relaxed">Join live, cohort-based learning with expert instructors and peers. Limited spots available.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { v: `${filtered.length} Cohorts`, icon: <BookOpen size={14} /> },
              { v: `${cohorts.reduce((sum, c) => sum + (c.currentStudents || 0), 0)} Learners`, icon: <Users size={14} /> },
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
            <input type="text" placeholder="Search cohorts..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13.5px] text-slate-800 placeholder-slate-400 outline-none focus:border-blue-400 transition-colors shadow-sm" />
          </div>
          <div className="flex gap-2">
            {["All", "Active", "Upcoming"].map(l => (
              <button key={l} onClick={() => setStatus(l)} className={`px-3.5 py-2 rounded-xl text-[12.5px] font-medium border transition-all ${status === l ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}>{l}</button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-[12.5px] text-slate-400">{filtered.length} cohort{filtered.length !== 1 ? "s" : ""} available</p>
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </section>

      <section className="px-6 pb-20">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search size={48} className="mx-auto mb-3 text-slate-300" />
            <p className="text-[15px] font-medium text-slate-600">No cohorts match your search</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-xl">Retry</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filtered.map((cohort, index) => {
              if (!cohort.id) return null;
              const isActive = cohort.isActive || false;
              return (
                <article key={`${cohort.id}-${index}`} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                  <div className="h-40 flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, #3b82f615, #06b6d415)" }}>
                    <Users size={56} color="#3b82f6" strokeWidth={1} opacity={0.5} />
                    {isActive && <span className="absolute top-3 right-3 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-900">Open</span>}
                    <span className="absolute top-3 left-3 text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-blue-100 text-blue-700 border-blue-200">
                      {formatCourseType(cohort.courseType)}
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 p-5 gap-3">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">Live Cohort</span>
                    <h3 className="text-[14.5px] font-semibold text-slate-900 leading-snug line-clamp-2">{cohort.name}</h3>
                    <p className="text-[12.5px] text-slate-500 leading-relaxed line-clamp-2">Join {cohort.currentStudents || 0}/{cohort.maxStudents || 0} seats taken</p>
                    <div className="flex gap-3 text-[12px] text-slate-400">
                      <span className="flex items-center gap-1"><Clock size={11} />{formatDate(cohort.startDate)} - {formatDate(cohort.endDate)}</span>
                    </div>
                    <div className="mt-auto pt-3 border-t border-slate-100 flex flex-col gap-2">
                      <span className="text-[13px] font-semibold text-slate-900">{formatCourseType(cohort.courseType)}</span>
                      <CTAButton primary onClick={async () => {
                        const isValid = await tokenManager.validateAuth();
                        if (!isValid) {
                          window.location.href = '/login';
                          return;
                        }
                        window.location.href = `/learner/cohorts/${cohort.id}`;
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

function formatCourseType(type: string) {
  const types: Record<string, string> = {
    COMPUTER_PROGRAMMING: "Computer Programming",
    SOCIAL_MEDIA_BRANDING: "Social Media Branding",
    ENTREPRENEURSHIP: "Entrepreneurship",
    DATA_SCIENCE: "Data Science",
    SRHR: "SRHR",
  };
  return types[type] || type;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

