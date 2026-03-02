import { ArrowRight, ChevronRight, Tag } from "lucide-react";
import { ProgressBar } from "../instructor/ui/SharedUI";
import { useState } from "react";
import Link from "next/link";

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

const RECENT_COURSES = [
  { id: 1, title: "Introduction to SQL",       tag: "AI NATIVE", progress: 2,  label: "COURSE", abbr: "SQL" },
  { id: 2, title: "Data Analysis with Python",  tag: "POPULAR",   progress: 18, label: "COURSE", abbr: "PY"  },
];
const PromotionBanner = () => {
    const [bannerDismissed, setBannerDismissed] = useState(false);
  return (
    <div>
            {!bannerDismissed && (
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ background: `linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, ${C.indigo} 100%)` }}
        >
          <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full opacity-20 blur-3xl" style={{ background: "#818CF8" }} />
          <div className="absolute -bottom-8 left-24 w-36 h-36 rounded-full opacity-10 blur-2xl" style={{ background: C.indigo }} />
        </div>
      )}

      <section
        className="rounded-2xl border p-5"
        style={{ background: C.section, borderColor: C.border }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: C.text }}>
            Pick up where you left off
          </h2>
        <Link href="learner/my-courses">
        <button
            className="text-xs font-semibold flex items-center gap-1 transition-opacity hover:opacity-75 group"
            style={{ color: C.indigo }}
          >
            See All in My Library
            <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
          </Link>
          
        </div>

        <div className="space-y-3">
          {RECENT_COURSES.map(course => (
            <div
              key={course.id}
              className="rounded-xl border flex items-center gap-4 px-4 py-3.5 transition-all cursor-pointer hover:shadow-sm"
              style={{ background: C.bg, borderColor: C.border }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = C.indigoBorder)}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = C.border)}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
                style={{ background: C.indigoLight, color: C.indigo }}
              >
                {course.abbr}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: C.textLight }}>
                    {course.label}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    course.tag === "AI NATIVE" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {course.tag}
                  </span>
                </div>
                <p className="text-sm font-semibold truncate mb-2" style={{ color: C.text }}>
                  {course.title}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1"><ProgressBar value={course.progress} /></div>
                  <span className="text-xs font-medium flex-shrink-0" style={{ color: C.textLight }}>
                    {course.progress}%
                  </span>
                </div>
              </div>

              <button
                className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border transition-all"
                style={{ borderColor: C.indigoBorder, color: C.indigo, background: C.indigoLight }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = C.indigo;
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.borderColor = C.indigo;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = C.indigoLight;
                  e.currentTarget.style.color = C.indigo;
                  e.currentTarget.style.borderColor = C.indigoBorder;
                }}
              >
                Continue
                <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default PromotionBanner