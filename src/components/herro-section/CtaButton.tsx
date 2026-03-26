export default function CTAButton({ children, primary, onClick }: { children: React.ReactNode; primary?: boolean; onClick?: () => void }) {
  if (primary) {
    return (
      <button
        onClick={onClick}
        className=" group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-[14.5px] px-7 py-3.5 rounded-xl  overflow-hidden"
      >
        
        <span >{children}</span>
        <svg className=" w-4 h-4 " viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-[14.5px] px-7 py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-blue-500/20"
    >
      {children}
    </button>
  );
}
