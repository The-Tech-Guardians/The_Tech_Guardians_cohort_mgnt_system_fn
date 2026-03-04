interface MobileMenuButtonProps {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  isDark: boolean;
}

export default function MobileMenuButton({ mobileNavOpen, setMobileNavOpen, isDark }: MobileMenuButtonProps) {
  return (
    <button
      onClick={() => setMobileNavOpen(!mobileNavOpen)}
      className={`lg:hidden flex items-center justify-center w-9 h-9 rounded-lg border ${isDark ? "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200" : "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200 hover:text-slate-800"} transition-all duration-200 flex-shrink-0`}
    >
      {mobileNavOpen ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      )}
    </button>
  );
}
