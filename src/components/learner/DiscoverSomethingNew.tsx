import { BarChart2, BookOpen, ChevronRight, Layers } from "lucide-react";

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
const DiscoverSomethingNew = () => {
  return (
    <div>
          <section
        className="rounded-2xl border py-8 px-6 text-center"
        style={{ background: C.section, borderColor: C.border }}
      >
        <p className="text-sm font-semibold mb-1" style={{ color: C.text }}>
          Looking for something new?
        </p>
        <p className="text-xs mb-5" style={{ color: C.textMuted }}>
          Explore our full catalogue to expand your skills.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {[
            { label: "Career Tracks", icon: BarChart2 },
            { label: "Skill Tracks",  icon: Layers    },
            { label: "Courses",       icon: BookOpen  },
          ].map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:shadow-sm group"
              style={{ borderColor: C.border, color: C.text, background: C.bg }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = C.indigo;
                e.currentTarget.style.color = C.indigo;
                e.currentTarget.style.background = C.indigoLight;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.color = C.text;
                e.currentTarget.style.background = C.bg;
              }}
            >
              <Icon size={15} />
              {label}
              <ChevronRight size={14} className="opacity-40 group-hover:opacity-80 group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

export default DiscoverSomethingNew