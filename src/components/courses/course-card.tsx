import { LEVEL_COLOR, TYPE_CONFIG } from "@/app/courses/page";
import { COHORT, INSTRUCTORS } from "@/lib/api";
import Link from "next/link";
import { PublishedPill } from "./published-pill";
import { useState } from "react";
import { Stars } from "./starts";
import { BookOpen, Clock, Users, Book } from "lucide-react";
import { fmtDate } from "../cohorts/format-data-helper";

export function CourseCard({ course }: { course: any }) {
  const [expanded, setExpanded] = useState(false);
  const instructor = INSTRUCTORS[course.instructor_id as keyof typeof INSTRUCTORS];
  const cohort     = COHORT[course.cohort_id as keyof typeof COHORT];
  const type       = TYPE_CONFIG[course.course_type as keyof typeof TYPE_CONFIG] || { label: course.course_type, color: "bg-slate-100 text-slate-600", icon: <Book className="w-3 h-3"/> };

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 hover:shadow-[0_8px_32px_rgba(0,0,0,0.09)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col">

      {/* Gradient bar */}
      <div className={`h-1.5 bg-gradient-to-r ${course.gradient}`} />

      <div className="p-5 flex flex-col gap-4 flex-1">

        {/* Top badges */}
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex flex-wrap gap-1.5">
            <span className={`text-[11px] flex items-center gap-x-1.5 font-semibold px-2.5 py-1 rounded-full ${type.color}`}>
              {type.icon} {type.label}
            </span>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${LEVEL_COLOR[course.level as keyof typeof LEVEL_COLOR] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
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
            { i: <BookOpen className="w-3.5 h-3.5"/>, v: course.lessons + " lessons" },
            { i: <Clock className="w-3.5 h-3.5"/>, v: course.duration },
            { i: <Users className="w-3.5 h-3.5"/>, v: course.enrolled > 0 ? course.enrolled + " enrolled" : "Not started" },
          ].map((m) => (
            <div key={m.v} className="bg-slate-50  rounded-xl px-2 py-2 text-center border border-slate-100">
              <div className="flex justify-center mb-1">{m.i}</div>
              <div className="text-[10.5px] font-medium text-slate-600 leading-tight">{m.v}</div>
            </div>
          ))}
        </div>

        {cohort && (
          <div className={`flex items-center gap-2 bg-gradient-to-r ${cohort.gradient} rounded-xl px-3 py-2`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span className="text-white text-[11.5px] font-semibold truncate">{cohort.name}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Added {fmtDate(course.created_at)}</span>
          <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[10px]">{course.id.slice(-8).toUpperCase()}</span>
        </div>

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
              {course.topics.map((t: string) => (
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