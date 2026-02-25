// components/ui/Logo.tsx
// Reusable CohortLMS logo — use anywhere in auth or dashboard layouts.

interface LogoProps {
  /** Icon size in Tailwind w/h units, e.g. "w-7 h-7" */
  iconSize?: string;
  /** Show/hide the wordmark next to the icon */
  showText?: boolean;
  /** Text colour class */
  textClass?: string;
}

export default function Logo({
  iconSize = "w-7 h-7",
  showText = true,
  textClass = "text-white font-extrabold text-xl",
}: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 40 40" className={iconSize} fill="none" aria-hidden="true">
          <circle cx="14" cy="10" r="5" fill="#4F46E5" />
          <circle cx="26" cy="10" r="5" fill="#2563EB" />
          <circle cx="20" cy="6"  r="5" fill="#06B6D4" />
          <path d="M4 28 Q20 18 36 28" stroke="#4F46E5" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M6 33 Q20 23 34 33" stroke="#2563EB" strokeWidth="2"   fill="none" strokeLinecap="round" />
          <path d="M9 38 Q20 30 31 38" stroke="#06B6D4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      {showText && <span className={textClass}>CohortLMS</span>}
    </div>
  );
}