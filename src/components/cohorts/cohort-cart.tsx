import { useState } from "react";
import SBadge from "./sBadge";
import SeatsBar from "./seatBar";
import getStatus from "./get-status";
import { cohortWeeks, daysUntil, fmtDate } from "./format-data-helper";
import ActivePill from "./active-pill";
import DateRow from "./date-row";

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  development: { label: "Development",    color: "bg-blue-50 text-blue-600" },
  design:      { label: "Design",         color: "bg-violet-50 text-violet-600" },
  data:        { label: "Data Science",   color: "bg-emerald-50 text-emerald-600" },
  business:    { label: "Business",       color: "bg-amber-50 text-amber-600" },
  personal:    { label: "Personal Growth",color: "bg-sky-50 text-sky-600" },
};

export default function CohortCard({ cohort, onEnroll }: { cohort: any; onEnroll: (id: string) => void }) {
  const [showDates, setShowDates] = useState(false);
  const status = getStatus(cohort);
  const type   = TYPE_CONFIG[cohort.course_type] || { label: cohort.course_type, color: "bg-slate-100 text-slate-600" };
  const dur    = cohortWeeks(cohort.start_date, cohort.end_date);
  const d2open = daysUntil(cohort.enrollment_open_date);
  const d2close= daysUntil(cohort.enrollment_close_date);

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 hover:shadow-[0_8px_32px_rgba(0,0,0,0.09)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col">


      <div className={`h-1.5 bg-gradient-to-r ${cohort.gradient}`} />

      <div className="p-5 flex flex-col gap-4 flex-1">

        {/* Top: type + status + active */}
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex flex-wrap gap-1.5">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${type.color}`}>{type.label}</span>
            <ActivePill is_active={cohort.is_active} />
          </div>
          <SBadge status={status} />
        </div>

        {/* Title */}
        <div>
          <h3 className="text-[15.5px] font-bold text-slate-800 leading-snug mb-1">{cohort.name}</h3>
          <p className="text-[13px] text-slate-500 leading-relaxed">{cohort.subtitle}</p>
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${cohort.instructor.gradient} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
            {cohort.instructor.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-slate-700 leading-none truncate">{cohort.instructor.name}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{cohort.instructor.role}</p>
          </div>
          {cohort.rating && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-amber-400 text-xs">★</span>
              <span className="text-[12px] font-bold text-slate-700">{cohort.rating}</span>
              <span className="text-[11px] text-slate-400">({cohort.reviews})</span>
            </div>
          )}
        </div>

        {/* Key meta: start, duration, level */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { i: "📅", v: fmtDate(cohort.start_date) },
            { i: "⏱️", v: dur },
            { i: "🎯", v: cohort.level },
          ].map((m) => (
            <div key={m.v} className="bg-slate-50 rounded-xl px-2 py-2 text-center border border-slate-100">
              <div className="text-sm leading-none mb-1">{m.i}</div>
              <div className="text-[10.5px] font-medium text-slate-600 leading-tight">{m.v}</div>
            </div>
          ))}
        </div>

        {/* Enrollment window urgency */}
        {status === "enrolling" && d2close > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
            <span className="text-sm">⏰</span>
            <span className="text-[12px] font-semibold text-amber-700">
              Enrollment closes in <strong>{d2close} day{d2close !== 1 ? "s" : ""}</strong>
            </span>
          </div>
        )}
        {status === "upcoming" && d2open > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
            <span className="text-sm">🔔</span>
            <span className="text-[12px] font-semibold text-blue-700">
              Opens in <strong>{d2open} day{d2open !== 1 ? "s" : ""}</strong>
            </span>
          </div>
        )}

        {/* Sessions */}
        <div className="flex items-center gap-2 text-[12.5px] text-slate-500">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          {cohort.sessions} · Live sessions weekly
        </div>

        {/* Seats */}
        <SeatsBar seats={cohort.seats} seatsLeft={cohort.seatsLeft} status={status} />

        {/* Date schedule toggle */}
        <div>
          <button
            onClick={() => setShowDates(!showDates)}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-500 hover:text-slate-700 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              className={`transition-transform duration-200 ${showDates ? "rotate-180" : ""}`}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            {showDates ? "Hide" : "Show"} schedule & dates
          </button>
          {showDates && (
            <div className="mt-3 bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-0">
              <DateRow icon="📅" label="Starts"             value={fmtDate(cohort.start_date)} highlight={false} />
              <DateRow icon="🏁" label="Ends"               value={fmtDate(cohort.end_date)} highlight={false} />
              <DateRow icon="🔓" label="Enrollment opens"   value={fmtDate(cohort.enrollment_open_date)} highlight={status === "upcoming"} />
              <DateRow icon="🔒" label="Enrollment closes"  value={fmtDate(cohort.enrollment_close_date)} highlight={status === "enrolling"} />
              <DateRow icon="📆" label="Extension deadline" value={fmtDate(cohort.extension_date)} highlight={false} />
              <DateRow icon="🆔" label="Cohort ID"          value={cohort.id.slice(-8).toUpperCase()} highlight={false} />
            </div>
          )}
        </div>

        {/* Topics */}
        <div className="flex flex-wrap gap-1.5">
          {cohort.topics.slice(0, 4).map((t: string) => (
            <span key={t} className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">{t}</span>
          ))}
          {cohort.topics.length > 4 && (
            <span className="text-[11px] font-medium bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg">+{cohort.topics.length - 4} more</span>
          )}
        </div>

        <div className="flex-1" />

        {/* CTA button */}
        <div className="pt-1">
          {status === "completed" ? (
            <div className="flex gap-2">
              <button className="flex-1 text-[13px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 py-2.5 rounded-xl transition-all">View Certificate</button>
              <button className="flex-1 text-[13px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 py-2.5 rounded-xl border border-blue-100 transition-all">Review</button>
            </div>
          ) : status === "upcoming" ? (
            <button className="w-full text-[13px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 py-3 rounded-xl border border-amber-200 transition-all">
              Notify Me When Open
            </button>
          ) : cohort.seatsLeft === 0 ? (
            <button disabled className="w-full text-[13px] font-semibold text-slate-400 bg-slate-100 py-3 rounded-xl cursor-not-allowed">
              No seats available
            </button>
          ) : (
            <button
              onClick={() => onEnroll(cohort.id)}
              className={`w-full relative text-[13px] font-bold text-white py-3 rounded-xl bg-gradient-to-r ${cohort.gradient} shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all overflow-hidden`}
            >
              <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <span className="relative">
                {status === "active" ? "Join Cohort" : "Enroll Now"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}