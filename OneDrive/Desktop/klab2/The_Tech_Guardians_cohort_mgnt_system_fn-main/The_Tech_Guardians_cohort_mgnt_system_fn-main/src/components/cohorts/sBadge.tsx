
const SC = {
  enrolling: { label: "Enrolling Now", pulse: true,  dot: "bg-emerald-400", text: "text-emerald-700", ring: "bg-emerald-50 border-emerald-200" },
  active:    { label: "In Progress",   pulse: false, dot: "bg-blue-400",    text: "text-blue-700",    ring: "bg-blue-50 border-blue-200" },
  upcoming:  { label: "Coming Soon",   pulse: false, dot: "bg-amber-400",   text: "text-amber-700",   ring: "bg-amber-50 border-amber-200" },
  completed: { label: "Completed",     pulse: false, dot: "bg-slate-400",   text: "text-slate-500",   ring: "bg-slate-100 border-slate-200" },
};
export function SBadge({ status }) {
  const c = SC[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${c.ring} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot} ${c.pulse ? "animate-pulse" : ""}`} />
      {c.label}
    </span>
  );
}

export default SBadge;