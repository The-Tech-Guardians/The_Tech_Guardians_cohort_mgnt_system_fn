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
    <aside className="hidden lg:flex w-[46%] bg-gradient-to-br from-blue-600 to-cyan-500  relative overflow-hidden flex-col justify-between p-12">
      {/* Gradient blobs */}
   
      

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
        <Logo textMain="text-white font-extrabold text-xl" />
      </div>

      {/* Centre content slot */}
      <div className="relative z-10">{children}</div>

      {/* Footer */}
      <p className="relative z-10 text-white/20 text-xs">{footerNote}</p>
    </aside>
  );
}