import { CATEGORIES } from "@/components/courses/config/courses-api";
import { COHORT, INSTRUCTORS } from "@/lib/api";
import { Book, Clock, Star, Target, Users } from "lucide-react";
import { PublishedPill } from "./published-pill";
import { fmtDate } from "../cohorts/format-data-helper";

export function FeaturedCourse({ course }: { course: any }) {
  const instructor = INSTRUCTORS[course.instructor_id as keyof typeof INSTRUCTORS];
  const cohort     = COHORT[course.cohort_id as keyof typeof COHORT];
const typeConfig = CATEGORIES.find(c => c.slug === course.course_type.toLowerCase().replace('_', '-')) || { label: course.course_type, icon: <Book className="w-3 h-3"/>, grad: ['#3b82f6', '#06b6d4'] };

  return (
    <div className={`relative rounded-3xl bg-gradient-to-br ${course.gradient} p-8 md:p-10 shadow-[0_16px_48px_rgba(37,99,235,0.22)] mb-10 overflow-hidden`}>
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle,#ffffff 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start gap-8">

        {/* Left */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-white/20 border border-white/30 text-white text-[11px] font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5"><Star className="w-3 h-3 fill-white"/> Featured Course</span>
            <PublishedPill is_published={course.is_published} />
<span className="bg-white/15 border border-white/25 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">{typeConfig.icon} {typeConfig.label}</span>
          </div>

          <h2 className="text-[26px] md:text-[32px] font-black text-white leading-tight mb-3">{course.title}</h2>
<p className="formatted-content text-white/90 text-base leading-relaxed mb-5 max-w-lg [&strong]:text-white">{course.description}</p>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { i: <Book className="w-3 h-3"/>, v: course.lessons + " lessons" },
              { i: <Clock className="w-3 h-3"/>, v: course.duration },
              { i: <Target className="w-3 h-3"/>, v: course.level },
              { i: <Users className="w-3 h-3"/>, v: course.enrolled + " learners" },
            ].map((m) => (
              <div key={m.v} className="flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-full px-3 py-1.5">
                <span className="leading-none">{m.i}</span>
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