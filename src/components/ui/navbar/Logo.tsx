import { FC } from "react";

interface LogoProps {
  variant?: "light" | "dark";
}

const Logo: FC<LogoProps> = ({ variant = "light" }) => {
  const isDark = variant === "dark";

  return (
    <div
      className="flex items-center gap-[11px] cursor-pointer flex-shrink-0 group select-none"
      style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}
    >
      {/* Icon mark */}
      <div className="relative flex-shrink-0" style={{ width: 40, height: 40 }}>
        {/* Outer glow ring on hover */}
        <div
          className="absolute inset-0 rounded-[13px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(circle, rgba(52,211,153,0.35) 0%, transparent 70%)",
            transform: "scale(1.35)",
          }}
        />

        {/* Main badge */}
        <div
          className="relative w-full h-full rounded-[13px] flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-[1.04]"
          style={{
            background:
              "linear-gradient(145deg, #059669 0%, #0d9488 55%, #0891b2 100%)",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.12), 0 4px 16px rgba(5,150,105,0.28), inset 0 1px 0 rgba(255,255,255,0.22)",
          }}
        >
          {/* Inner sheen */}
          <div
            className="absolute top-0 left-0 right-0"
            style={{
              height: "55%",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 100%)",
              borderRadius: "13px 13px 0 0",
            }}
          />

          {/* Shield + Book icon */}
          <svg
            viewBox="0 0 40 40"
            width="23"
            height="23"
            fill="none"
            style={{ position: "relative", zIndex: 1 }}
          >
            <path
              d="M20 4 L33 9.5 L33 21 C33 29.5 27 34.5 20 37.5 C13 34.5 7 29.5 7 21 L7 9.5 Z"
              fill="rgba(255,255,255,0.15)"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <line
              x1="20" y1="14" x2="20" y2="28"
              stroke="rgba(255,255,255,0.95)"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <path
              d="M20,14 C17,13 12.5,14 10,16 L10,27 C12.5,25.5 17,25.5 20,27 Z"
              fill="rgba(255,255,255,0.82)"
            />
            <path
              d="M20,14 C23,13 27.5,14 30,16 L30,27 C27.5,25.5 23,25.5 20,27 Z"
              fill="rgba(255,255,255,0.55)"
            />
            <circle cx="20" cy="10.5" r="2" fill="rgba(255,255,255,0.95)" />
          </svg>
        </div>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col" style={{ gap: 2 }}>
        <div className="flex items-baseline" style={{ lineHeight: 1 }}>
          <span
            style={{
              fontSize: 21,
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: isDark ? "rgba(255,255,255,0.88)" : "#1a2e2b",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            safe
          </span>
          <span
            style={{
              fontSize: 21,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #059669 30%, #0d9488 80%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ED
          </span>
        </div>

        {/* Tagline with accent line */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div
            style={{
              width: 14,
              height: 1.5,
              borderRadius: 2,
              background: "linear-gradient(90deg, #059669, #0d9488)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 8.5,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: isDark ? "rgba(255,255,255,0.38)" : "#6b7280",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Learning Platform
          </span>
        </div>
      </div>
    </div>
  );
};

export default Logo;