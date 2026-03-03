export default function CTAButton({ children, primary, onClick }: { children: React.ReactNode; primary?: boolean; onClick?: () => void }) {
  if (primary) {
    return (
      <button
        onClick={onClick}
        className="relative group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-[14.5px] px-7 py-3.5 rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(37,99,235,0.45)] active:translate-y-0 transition-all duration-200 overflow-hidden"
      >
        <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <span className="relative">{children}</span>
        <svg className="relative w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 bg-white text-slate-700 font-semibold text-[14.5px] px-7 py-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200 shadow-sm"
    >
      {children}
    </button>
  );
}