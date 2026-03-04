import { ReactNode } from "react";

export function Badge({ variant = "gray", children }: { variant?: "gray" | "green" | "rose" |"indigo"| "amber" | "dark"; children: ReactNode }) {
  const colors = {
    gray: "bg-gray-100 text-gray-600",
    green: "bg-green-100 text-green-700",
    rose: "bg-rose-100 text-rose-700",
    amber: "bg-amber-100 text-amber-700",
    dark: "bg-gray-900 text-white",
    indigo:"indigo-600"
  };
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${colors[variant]}`}>{children}</span>;
}

export function ProgressBar({ value, color = "green" }: { value: number; color?: "dark" | "green" | "amber" | "rose" | "indigo" }) {
  const colors = {
    dark: "bg-gray-900",  
    indigo: "bg-indigo-600",
    green: "bg-green-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
  };
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
      <div className={`h-full rounded-full transition-all ${colors[color]}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function Avatar({ initials, size = "md" }: { initials: string; size?: "md" | "lg" }) {
  const sizes = { md: "w-8 h-8 text-xs", lg: "w-12 h-12 text-sm" };
  return (
    <div className={`${sizes[size]} rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">{children}</div>;
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-sm font-black text-gray-900 mb-4" style={{ fontFamily: "'Bricolage Grotesque',sans-serif" }}>{children}</h3>;
}

export function Btn({ 
  variant = "indigo" ,   
  size = "md", 
  className = "", 
  children 
}: { 
  variant?: "primary" | "outline" | "ghost" | "danger" | "indigo"; 
  size?: "xs" | "sm" | "md"; 
  className?: string; 
  children: ReactNode 
}) {
  const variants = {
    indigo: "bg-indigo-600 text-white hover:bg-indigo-700",
    primary: "bg-gray-900 text-white hover:bg-gray-700",
    outline: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
    danger: "bg-rose-500 text-white hover:bg-rose-600",
  };
  const sizes = {
    xs: "text-xs px-2.5 py-1.5",
    sm: "text-xs px-3 py-2",
    md: "text-sm px-4 py-2.5",
  };
  return (
    <button className={`flex items-center gap-1.5 font-semibold rounded-xl transition-colors ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
}
