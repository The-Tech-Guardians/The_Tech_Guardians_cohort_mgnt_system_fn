import Logo from "./Logo";





interface AuthPanelProps {
  children: React.ReactNode;
  /** Optional small string shown in the bottom footer area */
  footerNote?: string;
}

export default function AuthPanel({
  children,
  footerNote = "© 2025 CohortLMS. Secured Platform.",
}: AuthPanelProps) {
  return (
    <aside className="hidden lg:flex w-[46%] bg-[#0F0C29] relative overflow-hidden flex-col justify-between p-12">
      {/* Gradient blobs */}
      <div
        className="absolute top-[-15%] left-[-10%] w-[65%] h-[65%] rounded-full bg-[#4F46E5] opacity-20 blur-[80px] animate-pulse pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-10%] right-[-8%] w-[55%] h-[55%] rounded-full bg-[#06B6D4] opacity-[0.15] blur-[90px] animate-pulse pointer-events-none"
        style={{ animationDelay: "1.5s" }}
        aria-hidden="true"
      />

      {/* Dot-grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(79,70,229,1) 1px,transparent 1px),linear-gradient(90deg,rgba(79,70,229,1) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      {/* Logo */}
      <div className="relative z-10">
        <Logo/>
      </div>

      {/* Centre content slot */}
      <div className="relative z-10">{children}</div>

      {/* Footer */}
      <p className="relative z-10 text-white/20 text-xs">{footerNote}</p>
    </aside>
  );
}