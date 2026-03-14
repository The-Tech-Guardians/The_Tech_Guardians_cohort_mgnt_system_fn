// components/ui/Notice.tsx
// Coloured notice banner for info, warning and success states.

type Variant = "indigo" | "amber" | "green" | "red";

interface NoticeProps {
  variant?: Variant;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<Variant, string> = {
  indigo: "bg-indigo-50 border border-indigo-100 text-indigo-700",
  amber:  "bg-amber-50  border border-amber-100  text-amber-700",
  green:  "bg-green-50  border border-green-100  text-green-700",
  red:    "bg-red-50    border border-red-100    text-red-700",
};

const defaultIcons: Record<Variant, React.ReactNode> = {
  indigo: (
    <svg className="w-4 h-4 text-[#4F46E5] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  amber: (
    <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  green: (
    <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  red: (
    <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function Notice({
  variant = "indigo",
  icon,
  children,
  className = "",
}: NoticeProps) {
  return (
    <div className={`flex gap-2.5 rounded-xl p-3.5 ${styles[variant]} ${className}`}>
      {icon ?? defaultIcons[variant]}
      <div className="text-xs leading-relaxed">{children}</div>
    </div>
  );
}