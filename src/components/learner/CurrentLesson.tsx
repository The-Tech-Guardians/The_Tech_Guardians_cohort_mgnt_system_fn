import { ArrowRight, ChevronRight, Clock, GraduationCap, Play } from "lucide-react";
import Link from "next/link";


const CURRENT_COURSE = {
  title: "Introduction to SQL",
  hoursLeft: 2,
  progress: 2,
  tag: "AI NATIVE",
};

const C = {
  indigo:       "#4F46E5",
  indigoDark:   "#4338CA",
  indigoLight:  "#EEF2FF",
  indigoBorder: "#C7D2FE",
  text:         "#111827",
  textMuted:    "#6B7280",
  textLight:    "#9CA3AF",
  bg:           "#FFFFFF",
  section:      "#F9FAFB",
  border:       "#E5E7EB",
  borderHover:  "#D1D5DB",
};

const CurrentLesson = () => {
  return (
    <div>

          <div
        className="rounded-2xl border overflow-hidden shadow-sm"
        style={{ background: C.bg, borderColor: C.border }}
      >
        {/* Indigo top bar */}
        <div className="h-[3px]" style={{ background: C.indigo }} />

        <div className="px-6 pt-4 pb-0">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: C.textLight }}>
            Learn
          </span>
        </div>

        {/* Course row */}
        <div className="flex items-center gap-4 px-6 py-4 flex-wrap">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: C.indigoLight }}
          >
            <GraduationCap size={22} style={{ color: C.indigo }} />
          </div>

          <div className="flex-1 min-w-0">
            <button
              className="flex items-center gap-1 text-base font-bold group transition-opacity hover:opacity-75"
              style={{ color: C.text }}
            >
              {CURRENT_COURSE.title}
              <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" style={{ color: C.textLight }} />
            </button>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-medium" style={{ color: C.textLight }}>
              <Clock size={12} />
              {CURRENT_COURSE.hoursLeft} hr to go
            </div>
          </div>

         <Link href="learner/my-courses/my-learning">
           <button
            className="flex-shrink-0 flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm"
            style={{ background: C.indigo }}
            onMouseEnter={e => (e.currentTarget.style.background = C.indigoDark)}
            onMouseLeave={e => (e.currentTarget.style.background = C.indigo)}
          >
            <Play size={13} className="fill-white" />
            Let&apos;s Do This
          </button>
         </Link>
        
        </div>

        
        <div className="mx-6 h-px" style={{ background: C.border }} />

        <div className="flex items-center justify-between px-6 py-4 gap-3 flex-wrap" style={{ background: C.section }}>
          <div>
            <p className="text-xs font-semibold" style={{ color: C.text }}>Already know this?</p>
            <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>
              Take an assessment to verify your skill level and skip this course.
            </p>
          </div>
          <button
            className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all"
            style={{ borderColor: C.border, color: C.text, background: C.bg }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.color = C.indigo; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text; }}
          >
            {CURRENT_COURSE.title}
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CurrentLesson