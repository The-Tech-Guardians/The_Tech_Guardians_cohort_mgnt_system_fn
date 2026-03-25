"use client";

import Link from "next/link";
import { Globe, GraduationCap, Lock } from "lucide-react";
import { useTranslation } from "@/components/i18n/LanguageProvider";
import NewLetter from "./footer/NewLetter";

type FooterProps = {
  className?: string;
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
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-[0_2px_14px_rgba(14,165,233,0.3)] overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  <svg viewBox="0 0 38 38" width="22" height="22" fill="none">
                    <circle cx="12" cy="11" r="5" fill="rgba(255,255,255,0.9)" />
                    <circle cx="26" cy="11" r="5" fill="rgba(255,255,255,0.7)" />
                    <circle cx="19" cy="7" r="4" fill="rgba(255,255,255,0.55)" />
                    <path d="M3 26 Q19 17 35 26" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M5 31 Q19 23 33 31" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="footer-brand text-[21px] tracking-tight">CohortLMS</span>
                  <span className="text-[9.5px] font-semibold tracking-[0.14em] uppercase text-cyan-500 mt-[3px]">
                    {t("footer.brand.platform")}
                  </span>
                </div>
              </div>

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
