import { ChevronRight, Dumbbell, Flame, Star, Zap } from "lucide-react"

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
const USER = {
  name: "Freddy",
  initials: "FB",
  portfolioPercent: 25,
  track: "Associate Data Analyst in SQL",
  streakDays: 0,
  reviewCount: 0,
};


function Tag({ children, variant = "default" }: {
  children: React.ReactNode;
  variant?: "ai" | "popular" | "default";
}) {
  const cfg = {
    ai: {
      cls: "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border",
      style: { background: C.indigoLight, color: C.indigo, borderColor: C.indigoBorder },
      icon: <Zap size={9} style={{ color: C.indigo, fill: C.indigo }} />,
    },
    popular: {
      cls: "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border",
      style: { background: "#F0FDF4", color: "#15803D", borderColor: "#BBF7D0" },
      icon: <Star size={9} style={{ color: "#16A34A", fill: "#16A34A" }} />,
    },
    default: {
      cls: "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border",
      style: { background: C.section, color: C.textMuted, borderColor: C.border },
      icon: null,
    },
  };
  const { cls, style, icon } = cfg[variant];
  return <span className={cls} style={style}>{icon}{children}</span>;
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.border }}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${Math.max(2, value)}%`, background: C.indigo }}
      />
    </div>
  );
}
const WelcomeLearner = () => {
  return (
    <div>
           <section className="flex items-start justify-between gap-4 flex-wrap pt-1">

        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div
              className="w-13 h-13 rounded-2xl flex items-center justify-center text-sm font-bold text-white shadow-md"
              style={{ width: 52, height: 52, background: C.indigo }}
            >
              {USER.initials}
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-black leading-tight tracking-tight" style={{ color: C.text }}>
              Hey, {USER.name}!
            </h1>
            <button className="flex items-center gap-2 text-xs font-medium mt-1 group" style={{ color: C.textMuted }}>
              <div className="h-1 w-14 rounded-full overflow-hidden" style={{ background: C.border }}>
                <div className="h-full rounded-full" style={{ width: `${USER.portfolioPercent}%`, background: C.indigo }} />
              </div>
              Portfolio {USER.portfolioPercent}% complete
              <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all hover:shadow-sm"
            style={{ borderColor: C.border, color: C.text, background: C.bg }}
          >
            <Dumbbell size={14} style={{ color: C.textMuted }} />
            Review
            <span
              className="min-w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center px-1"
              style={{ background: C.section, color: C.textMuted }}
            >
              {USER.reviewCount}
            </span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all hover:shadow-sm"
            style={{ borderColor: C.border, color: C.text, background: C.bg }}
          >
            <Flame size={14} className="text-orange-400" />
            Daily Streak
            <span className="min-w-5 h-5 rounded-full bg-orange-50 text-orange-500 text-[11px] font-bold flex items-center justify-center px-1">
              {USER.streakDays}
            </span>
          </button>
        </div>
      </section>

      <p className="text-sm  pt-6" style={{ color: C.textMuted }}>
        You&apos;re enrolled in the{" "}
        <button
          className="font-semibold underline underline-offset-2 transition-opacity hover:opacity-75"
          style={{ color: C.indigo }}
        >
          {USER.track}
        </button>{" "}
        track.
      </p>
    </div>
  )
}

export default WelcomeLearner