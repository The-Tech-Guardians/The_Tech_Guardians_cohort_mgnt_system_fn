import SBadge from "./sBadge";
import SeatsBar from "./seatBar";
import getStatus from "./get-status";
import { cohortWeeks, daysUntil, fmtDate } from "./format-data-helper";
import ActivePill from "./active-pill";
import Link from "next/link";


export default function FeaturedCohort({ cohort, onEnroll }) {
  const status = getStatus(cohort);
  const dur    = cohortWeeks(cohort.start_date, cohort.end_date);
  const d2close= daysUntil(cohort.enrollment_close_date);

  return (
    <div className={`relative rounded-3xl bg-gradient-to-br ${cohort.gradient} p-8 md:p-10 shadow-[0_16px_48px_rgba(37,99,235,0.22)] mb-10 overflow-hidden`}>
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle,#ffffff 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start gap-8">

        {/* Left */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-white/20 border border-white/30 text-white text-[11px] font-bold px-3 py-1 rounded-full">⭐ Featured Cohort</span>
            <SBadge status={status} />
            <ActivePill is_active={cohort.is_active} />
          </div>

          <h2 className="text-[26px] md:text-[32px] font-black text-white leading-tight mb-2">{cohort.name}</h2>
          <p className="text-white/75 text-[15px] leading-relaxed mb-5 max-w-lg">{cohort.subtitle}</p>

          {/* Date chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { i: "📅", v: "Starts " + fmtDate(cohort.start_date) },
              { i: "🏁", v: "Ends " + fmtDate(cohort.end_date) },
              { i: "⏱️", v: dur },
              { i: "👥", v: cohort.seatsLeft + " seats left" },
              { i: "📡", v: cohort.sessions },
            ].map((m) => (
              <div key={m.v} className="flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-full px-3 py-1.5">
                <span className="text-xs leading-none">{m.i}</span>
                <span className="text-white text-[12px] font-medium">{m.v}</span>
              </div>
            ))}
          </div>

          {/* Enrollment urgency */}
          {status === "enrolling" && d2close > 0 && (
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-xl px-4 py-2 mb-5">
              <span className="text-sm">⏰</span>
              <span className="text-white text-[12.5px] font-semibold">
                Enrollment closes in <strong>{d2close} day{d2close !== 1 ? "s" : ""}</strong> · {fmtDate(cohort.enrollment_close_date)}
              </span>
            </div>
          )}

          {/* Instructor */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white text-sm font-bold">
              {cohort.instructor.initials}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{cohort.instructor.name}</p>
              <p className="text-white/60 text-xs">{cohort.instructor.role}</p>
            </div>
            {cohort.rating && (
              <div className="flex items-center gap-1 bg-white/15 rounded-full px-3 py-1 border border-white/20">
                <span className="text-yellow-300 text-xs">★</span>
                <span className="text-white text-xs font-bold">{cohort.rating}</span>
                <span className="text-white/50 text-xs">({cohort.reviews} reviews)</span>
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="lg:w-80 flex-shrink-0 w-full space-y-4">

          {/* Topics */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-5">
            <p className="text-white/60 text-[11px] font-semibold uppercase tracking-widest mb-3">What you will learn</p>
            <div className="flex flex-wrap gap-2">
              {cohort.topics.map((t) => (
                <span key={t} className="text-[11.5px] font-medium bg-white/15 text-white border border-white/20 px-2.5 py-1 rounded-lg">{t}</span>
              ))}
            </div>
          </div>

          {/* Schedule box */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-5 space-y-2">
            <p className="text-white/60 text-[11px] font-semibold uppercase tracking-widest mb-2">Key Dates</p>
            {[
              { label: "Enrollment opens",  val: fmtDate(cohort.enrollment_open_date) },
              { label: "Enrollment closes", val: fmtDate(cohort.enrollment_close_date) },
              { label: "Cohort starts",     val: fmtDate(cohort.start_date) },
              { label: "Extension date",    val: fmtDate(cohort.extension_date) },
            ].map((r) => (
              <div key={r.label} className="flex justify-between items-center">
                <span className="text-white/55 text-[12px]">{r.label}</span>
                <span className="text-white text-[12px] font-semibold">{r.val}</span>
              </div>
            ))}
          </div>

          {/* Seats */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
            <SeatsBar seats={cohort.seats} seatsLeft={cohort.seatsLeft} status={status} />
            <p className="text-white/50 text-[11px] mt-1.5">Only {cohort.seatsLeft} of {cohort.seats} seats remaining</p>
          </div>
          <Link href="/course-details">
          <button
            onClick={() => onEnroll(cohort.id)}
            className="w-full bg-white text-blue-600 font-black text-[14px] py-3.5 rounded-xl hover:bg-blue-50 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-lg"
          >
            Enroll in This Cohort
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}