"use client";

import Link from "next/link";
import { Globe, GraduationCap, Lock } from "lucide-react";
import { useTranslation } from "@/components/i18n/LanguageProvider";
import NewLetter from "./footer/NewLetter";

type FooterProps = {
  className?: string;
};

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



const courseKeys = [
  "footer.course.webDevelopment",
  "footer.course.uiuxDesign",
  "footer.course.dataScience",
  "footer.course.digitalMarketing",
  "footer.course.businessStrategy",
];

const levelKeys = [
  "footer.level.individual",
  "footer.level.group",
  "footer.level.team",
  "footer.level.enterprise",
];

const companyLinks = [
  { key: "footer.company.about", href: "/about_us" },
  { key: "footer.company.contact", href: "/contact" },
  { key: "footer.company.privacy", href: "/privacy" },
  { key: "footer.company.careers", href: "/careers" },
];

const legalLinks = [
  { key: "footer.legal.terms", href: "/terms" },
  { key: "footer.legal.privacy", href: "/privacy" },
  { key: "footer.legal.cookies", href: "/cookies" },
];

export default function Footer({ className = "" }: FooterProps) {
  const { t } = useTranslation();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Instrument+Serif&display=swap');
        .footer-font { font-family: 'DM Sans', sans-serif; }
        .footer-brand { font-family: 'Instrument Serif', serif; }
        .footer-link { position: relative; display: inline-block; }
        .footer-link::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 0;
          height: 1px;
          background: #2563EB;
          transition: width .25s cubic-bezier(.4,0,.2,1);
        }
        .footer-link:hover::after { width: 100%; }
        .social-btn { transition: transform .2s, box-shadow .2s; }
        .social-btn:hover { transform: translateY(-2px); }
        .badge-dot { animation: pulse-dot 2s ease-in-out infinite; }
        @keyframes pulse-dot {
          0%,100% { opacity: 1; }
          50% { opacity: .4; }
        }
      `}</style>

      <footer className={`footer-font ${className}`}>
        <NewLetter />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-14 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4 flex flex-col gap-6">
             
             <Logo/>

              <p className="text-slate-500 text-[13.5px] leading-relaxed max-w-xs">
                {t("footer.brand.tagline")}
              </p>

              <div className="inline-flex items-center gap-2 self-start bg-emerald-50 border border-emerald-100 rounded-full px-3.5 py-1.5">
                <span className="badge-dot w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="text-[11.5px] font-semibold text-emerald-700">
                  {t("footer.brand.live")}
                </span>
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-5">
                {t("footer.courses.title")}
              </h4>
              <ul className="space-y-3">
                {courseKeys.map((key) => (
                  <li key={key}>
                    <Link href="/courses" className="footer-link text-[13.5px] text-slate-600 hover:text-blue-600 transition-colors duration-150 text-left block">
                      {t(key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-5">
                {t("footer.levels.title")}
              </h4>
              <ul className="space-y-3">
                {levelKeys.map((key) => (
                  <li key={key}>
                    <Link href="/courses" className="footer-link text-[13.5px] text-slate-600 hover:text-blue-600 transition-colors duration-150 block">
                      {t(key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-5">
                {t("footer.company.title")}
              </h4>
              <ul className="space-y-3">
                {companyLinks.map((item) => (
                  <li key={item.key}>
                    <Link href={item.href} className="footer-link text-[13.5px] text-slate-600 hover:text-blue-600 transition-colors duration-150 block">
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-5">
                {t("footer.trusted.title")}
              </h4>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                  <GraduationCap className="w-4 h-4 text-slate-600" />
                  <span className="text-[12px] font-medium text-slate-600">{t("footer.trust.accredited")}</span>
                </div>
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                  <Lock className="w-4 h-4 text-slate-600" />
                  <span className="text-[12px] font-medium text-slate-600">{t("footer.trust.ssl")}</span>
                </div>
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                  <span className="text-base leading-none">!</span>
                  <span className="text-[12px] font-medium text-slate-600">{t("footer.trust.uptime")}</span>
                </div>
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                  <Globe className="w-4 h-4 text-slate-600" />
                  <span className="text-[12px] font-medium text-slate-600">{t("footer.trust.global")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[12px] text-slate-400">
              &copy; {new Date().getFullYear()} CohortLMS - {t("footer.rights")}
            </p>
            <p className="text-[12px] text-slate-400 text-center">
              {t("footer.craftedBy")}{" "}
              <span className="font-medium text-slate-600">Freddy Bijanja</span>,{" "}
              <span className="font-medium text-slate-600">IRADUKUNDA Boris</span> &amp;{" "}
              <span className="font-medium text-slate-600">Olivier Nduwayesu</span>
            </p>
            <div className="flex items-center gap-4">
              {legalLinks.map((item) => (
                <Link key={item.key} href={item.href} className="text-[12px] text-slate-400 hover:text-slate-700 transition-colors duration-150">
                  {t(item.key)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
