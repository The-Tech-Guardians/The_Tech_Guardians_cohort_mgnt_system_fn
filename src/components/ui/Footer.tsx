import {  GraduationCap, Lock } from "lucide-react";
import NewLetter from "./footer/NewLetter";

const courses = [
  { id: 1, name: "Web Development" },
  { id: 2, name: "UI/UX Design" },
  { id: 3, name: "Data Science" },
  { id: 4, name: "Digital Marketing" },
  { id: 5, name: "Business Strategy" },
];

const socials = [
  {
    label: "Twitter",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
      </svg>
    ),
  },
];

export default function Footer() {
  

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Instrument+Serif&display=swap');
        .footer-font    { font-family: 'DM Sans', sans-serif; }
        .footer-brand   { font-family: 'Instrument Serif', serif; }
        .footer-link    { position: relative; display: inline-block; }
        .footer-link::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0;
          width: 0; height: 1px;
          background: #2563EB;
          transition: width .25s cubic-bezier(.4,0,.2,1);
        }
        .footer-link:hover::after { width: 100%; }
        .social-btn { transition: transform .2s, box-shadow .2s; }
        .social-btn:hover { transform: translateY(-2px); }
        .badge-dot { animation: pulse-dot 2s ease-in-out infinite; }
        @keyframes pulse-dot {
          0%,100% { opacity: 1; }
          50%      { opacity: .4; }
        }
      `}</style>

      <footer className="footer-font bg-white border-t border-slate-100">

        {/* ── Newsletter band ── */}
        <NewLetter/>

        {/* ── Main footer body ── */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-14 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

            {/* Brand column */}
            <div className="md:col-span-4 flex flex-col gap-6">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-[0_2px_14px_rgba(14,165,233,0.3)] overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  <svg viewBox="0 0 38 38" width="22" height="22" fill="none">
                    <circle cx="12" cy="11" r="5" fill="rgba(255,255,255,0.9)" />
                    <circle cx="26" cy="11" r="5" fill="rgba(255,255,255,0.7)" />
                    <circle cx="19" cy="7"  r="4" fill="rgba(255,255,255,0.55)" />
                    <path d="M3 26 Q19 17 35 26" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M5 31 Q19 23 33 31" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="footer-brand text-[21px] text-slate-800 tracking-tight">CohortLMS</span>
                  <span className="text-[9.5px] font-semibold tracking-[0.14em] uppercase text-cyan-500 mt-[3px]">Learning Platform</span>
                </div>
              </div>

              {/* Tagline */}
              <p className="text-slate-500 text-[13.5px] leading-relaxed max-w-xs">
                Empowering learners worldwide with cohort-based courses built for real outcomes — not just certificates.
              </p>

              {/* Live badge */}
              <div className="inline-flex items-center gap-2 self-start bg-emerald-50 border border-emerald-100 rounded-full px-3.5 py-1.5">
                <span className="badge-dot w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="text-[11.5px] font-semibold text-emerald-700">Platform is live · 2,400+ learners</span>
              </div>

              {/* Socials */}
              <div className="flex items-center gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="social-btn w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 flex items-center justify-center transition-colors duration-200"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links — Courses */}
            <div className="md:col-span-2">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-5">Courses</h4>
              <ul className="space-y-3">
                {courses.map((c) => (
                  <li key={c.id}>
                    <button className="footer-link text-[13.5px] text-slate-600 hover:text-blue-600 transition-colors duration-150 text-left">
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links — Levels */}
            <div className="md:col-span-2">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-5">Levels</h4>
              <ul className="space-y-3">
                {["Individual", "Group", "Team", "Enterprise"].map((lvl) => (
                  <li key={lvl}>
                    <button className="footer-link text-[13.5px] text-slate-600 hover:text-blue-600 transition-colors duration-150">
                      {lvl}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links — Company */}
            <div className="md:col-span-2">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-5">Company</h4>
              <ul className="space-y-3">
                {["About Us", "Contact", "Privacy", "Careers"].map((item) => (
                  <li key={item}>
                    <button className="footer-link text-[13.5px] text-slate-600 hover:text-blue-600 transition-colors duration-150">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust badges */}
            <div className="md:col-span-2">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-5">Trusted by</h4>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                  <GraduationCap className="w-4 h-4 text-slate-600" />
                  <span className="text-[12px] font-medium text-slate-600">Accredited courses</span>
                </div>
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                  <Lock className="w-4 h-4 text-slate-600" />
                  <span className="text-[12px] font-medium text-slate-600">SSL secured</span>
                </div>
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                  <span className="text-base leading-none">⚡</span>
                  <span className="text-[12px] font-medium text-slate-600">99.9% uptime</span>
                </div>
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                  <span className="text-base leading-none">🌍</span>
                  <span className="text-[12px] font-medium text-slate-600">Global access</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[12px] text-slate-400">
              &copy; {new Date().getFullYear()} CohortLMS · All rights reserved
            </p>
            <p className="text-[12px] text-slate-400 text-center">
              Crafted with care by{" "}
              <span className="font-medium text-slate-600">Freddy Bijanja</span>,{" "}
              <span className="font-medium text-slate-600">IRADUKUNDA Boris</span>{" "}
              &amp;{" "}
              <span className="font-medium text-slate-600">Olivier Nduwayesu</span>
            </p>
            <div className="flex items-center gap-4">
              {["Terms", "Privacy", "Cookies"].map((t) => (
                <button key={t} className="text-[12px] text-slate-400 hover:text-slate-700 transition-colors duration-150">
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}