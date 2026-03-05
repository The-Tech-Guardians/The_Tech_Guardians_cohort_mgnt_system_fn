"use client";
import { useState } from "react";
import Link from "next/link";
import { BookCopy, ChartColumnStacked, GraduationCap, Trophy } from "lucide-react";
import Logo from "@/components/ui/navbar/Logo";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1800);
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strengthColors = ["", "#EF4444", "#F59E0B", "#3B82F6", "#10B981"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strength = passwordStrength();

  // ── Step 2: Success screen (unchanged) ──
  if (step === 2) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 p-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#111827] mb-2">Account created!</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              We&apos;ve sent a confirmation link to <span className="font-semibold text-[#111827]">{form.email}</span>. Please verify your email to activate your account.
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-left mb-6">
              <div className="flex gap-2.5">
                <svg className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Enrollment is open. Complete verification before the enrollment window closes.
                </p>
              </div>
            </div>
            <Link
              href="/login"
              className="inline-block w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-3 rounded-xl transition text-sm shadow-lg shadow-indigo-500/25"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">

      {/* ═══════════════════════════════════════
          LEFT PANEL — blue-600 → cyan-500 + Undraw illustration
      ═══════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-500">

        {/* White dot-grid overlay */}
        <div className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Soft white glow — top right */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        {/* Soft white glow — bottom left */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">

          {/* Logo */}
          <Logo />

          <div className="space-y-8">
            <div>
              <div className="w-10 h-1 bg-white/60 rounded-full mb-4" />
              <h2 className="text-4xl font-bold text-white leading-tight">
                Your learning<br />
                <span className="text-white/75">journey starts here.</span>
              </h2>
              <p className="text-white/60 text-sm mt-4 max-w-xs leading-relaxed">
                Join an active cohort and gain access to structured courses, expert instructors, and a community of learners.
              </p>
            </div>
            <div className="flex justify-center">
              <svg viewBox="0 0 480 280" fill="none" xmlns="http://www.w3.org/2000/svg"
                className="w-full max-w-sm drop-shadow-xl">
                <ellipse cx="240" cy="274" rx="170" ry="6" fill="rgba(0,0,0,0.12)" />
                <rect x="60" y="30" width="260" height="180" rx="12" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />

               
                <rect x="60" y="30" width="260" height="32" rx="12" fill="white" fillOpacity="0.2" />
                <circle cx="82" cy="46" r="5" fill="white" fillOpacity="0.5" />
                <circle cx="97" cy="46" r="5" fill="white" fillOpacity="0.5" />
                <circle cx="112" cy="46" r="5" fill="white" fillOpacity="0.5" />
             
                <rect x="128" y="42" width="100" height="8" rx="4" fill="white" fillOpacity="0.35" />

                {/* Section title */}
                <rect x="78" y="76" width="120" height="8" rx="4" fill="white" fillOpacity="0.6" />
                <rect x="78" y="90" width="80" height="5" rx="2.5" fill="white" fillOpacity="0.3" />

                {/* Course cards on board */}
                {[
                  { x: 78, y: 105, w: 100, prog: 72, color: "white" },
                  { x: 190, y: 105, w: 100, prog: 45, color: "white" },
                ].map((c, i) => (
                  <g key={i}>
                    <rect x={c.x} y={c.y} width={c.w} height={64} rx="8" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
                    <rect x={c.x + 8} y={c.y + 10} width={40} height={24} rx="5" fill="white" fillOpacity="0.2" />
                    <rect x={c.x + 56} y={c.y + 12} width={36} height="5" rx="2.5" fill="white" fillOpacity="0.45" />
                    <rect x={c.x + 56} y={c.y + 22} width={28} height="4" rx="2" fill="white" fillOpacity="0.25" />
                    {/* Progress */}
                    <rect x={c.x + 8} y={c.y + 48} width={c.w - 16} height="5" rx="2.5" fill="white" fillOpacity="0.15" />
                    <rect x={c.x + 8} y={c.y + 48} width={(c.w - 16) * c.prog / 100} height="5" rx="2.5" fill="white" fillOpacity="0.7" />
                  </g>
                ))}

                {/* Bottom stat row on board */}
                {[78, 148, 218].map((x, i) => (
                  <g key={i}>
                    <rect x={x} y="182" width="58" height="18" rx="5" fill="white" fillOpacity="0.12" />
                    <rect x={x + 6} y="187" width="30" height="5" rx="2.5" fill="white" fillOpacity="0.4" />
                    <rect x={x + 6} y="196" width="22" height="3" rx="1.5" fill="white" fillOpacity="0.22" />
                  </g>
                ))}

                {/* ── Standing person (teacher/student) ── */}
                {/* Body */}
                <rect x="360" y="148" width="52" height="80" rx="22" fill="#FDE68A" />
                {/* Shirt */}
                <path d="M352 178 Q375 168 400 178 L402 228 Q386 236 375 236 Q364 236 348 228 Z"
                  fill="white" fillOpacity="0.9" />
                {/* Head */}
                <circle cx="375" cy="138" r="26" fill="#FDE68A" />
                {/* Hair */}
                <path d="M349 130 Q375 108 401 130 Q401 114 375 110 Q349 114 349 130Z" fill="#7C3AED" />
                {/* Eyes */}
                <circle cx="367" cy="138" r="3" fill="#1E293B" />
                <circle cx="383" cy="138" r="3" fill="#1E293B" />
                <circle cx="368" cy="137" r="1" fill="white" />
                <circle cx="384" cy="137" r="1" fill="white" />
                {/* Smile */}
                <path d="M368 147 Q375 153 382 147" stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                {/* Left arm — pointing at board */}
                <path d="M352 185 Q318 172 300 165" stroke="#FDE68A" strokeWidth="14" strokeLinecap="round" />
                <ellipse cx="296" cy="163" rx="9" ry="7" fill="#FDE68A" />
                {/* Right arm — holding something */}
                <path d="M400 185 Q416 196 414 210" stroke="#FDE68A" strokeWidth="14" strokeLinecap="round" />
                {/* Legs */}
                <rect x="358" y="226" width="14" height="40" rx="7" fill="#7C3AED" fillOpacity="0.7" />
                <rect x="378" y="226" width="14" height="40" rx="7" fill="#7C3AED" fillOpacity="0.7" />
                {/* Shoes */}
                <ellipse cx="365" cy="266" rx="12" ry="6" fill="#1E293B" fillOpacity="0.7" />
                <ellipse cx="385" cy="266" rx="12" ry="6" fill="#1E293B" fillOpacity="0.7" />

                {/* Pointer / stick */}
                <line x1="296" y1="163" x2="230" y2="145" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeDasharray="4 3" />

                {/* ── Floating badge: Trophy ── */}
                <g filter="url(#s1)">
                  <rect x="10" y="20" width="148" height="64" rx="14" fill="white" fillOpacity="0.97" />
                  <rect x="22" y="32" width="32" height="32" rx="8" fill="#EDE9FE" />
                  <text x="38" y="53" textAnchor="middle" fontSize="17">🏆</text>
                  <rect x="62" y="34" width="80" height="6" rx="3" fill="#1E3A5F" fillOpacity="0.65" />
                  <rect x="62" y="45" width="60" height="5" rx="2.5" fill="#1E3A5F" fillOpacity="0.3" />
                  <rect x="22" y="72" width="124" height="5" rx="2.5" fill="#EDE9FE" />
                  <rect x="22" y="72" width="88" height="5" rx="2.5" fill="#7C3AED" fillOpacity="0.75" />
                </g>

                {/* ── Floating badge: Streak ── */}
                <g filter="url(#s2)">
                  <rect x="322" y="12" width="148" height="58" rx="14" fill="white" fillOpacity="0.97" />
                  <rect x="334" y="24" width="32" height="32" rx="8" fill="#FEF3C7" />
                  <text x="350" y="45" textAnchor="middle" fontSize="17">🔥</text>
                  <rect x="374" y="26" width="80" height="6" rx="3" fill="#1E3A5F" fillOpacity="0.65" />
                  <rect x="374" y="37" width="58" height="5" rx="2.5" fill="#1E3A5F" fillOpacity="0.3" />
                  {[0,1,2,3,4].map(i => (
                    <text key={i} x={374 + i * 14} y="58" fontSize="11" fill="#FBBF24">★</text>
                  ))}
                </g>

                {/* ── Floating badge: New Lesson ── */}
                <g filter="url(#s3)">
                  <rect x="10" y="200" width="148" height="52" rx="14" fill="white" fillOpacity="0.97" />
                  <rect x="22" y="212" width="32" height="32" rx="8" fill="#DBEAFE" />
                  <text x="38" y="233" textAnchor="middle" fontSize="17">📚</text>
                  <rect x="62" y="214" width="80" height="6" rx="3" fill="#1E3A5F" fillOpacity="0.65" />
                  <rect x="62" y="225" width="56" height="5" rx="2.5" fill="#1E3A5F" fillOpacity="0.3" />
                  <rect x="62" y="234" width="70" height="4" rx="2" fill="#1E3A5F" fillOpacity="0.2" />
                </g>

                <defs>
                  <filter id="s1" x="-10%" y="-10%" width="130%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.1" />
                  </filter>
                  <filter id="s2" x="-10%" y="-10%" width="130%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.1" />
                  </filter>
                  <filter id="s3" x="-10%" y="-10%" width="130%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.1" />
                  </filter>
                </defs>
              </svg>
            </div>

            {/* Feature list */}
            <div className=" grid grid-cols-2 gap-2">
              {[
                { icon: <GraduationCap size={18} />, title: "Structured Cohort Learning", desc: "Learn alongside peers on a shared schedule" },
                { icon: <BookCopy size={18} />, title: "Expert-led Courses", desc: "Coding, Content Creation and more" },
                { icon: <ChartColumnStacked size={18} />, title: "Track Your Progress", desc: "Visual progress through every module" },
                { icon: <Trophy size={18} />, title: "Earn Credentials", desc: "Completion badges and certificates" },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 rounded-xl px-4 py-3">
                  <span className="text-white/80">{item.icon}</span>
                  <div>
                    <div className="text-white text-sm font-medium">{item.title}</div>
                    <div className="text-white/50 text-xs">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-white/40 text-xs">&copy; {new Date().getFullYear()} CohortLMS. All rights reserved.</div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          RIGHT PANEL — signup form (unchanged)
      ═══════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#F9FAFB]">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
              <circle cx="14" cy="10" r="5" fill="#4F46E5" />
              <circle cx="26" cy="10" r="5" fill="#2563EB" />
              <circle cx="20" cy="6" r="5" fill="#06B6D4" />
              <path d="M4 28 Q20 18 36 28" stroke="#4F46E5" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M6 33 Q20 23 34 33" stroke="#2563EB" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M9 38 Q20 30 31 38" stroke="#06B6D4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
            <span className="font-bold text-[#111827] text-xl">CohortLMS</span>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 p-8">
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 rounded-full px-3 py-1 text-xs font-medium mb-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse inline-block" />
                Enrollment Open
              </div>
              <h1 className="text-2xl font-bold text-[#111827]">Create your account</h1>
              <p className="text-gray-500 text-sm mt-1">Learner sign-up · Free during enrollment window</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#111827]">First name</label>
                  <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Olivier"
                    className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-[#111827] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#111827]">Last name</label>
                  <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Nduwayesu"
                    className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-[#111827] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#111827]">Email address</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="olivier@gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-[#111827] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#111827]">Password</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="Min. 8 characters"
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 text-[#111827] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {form.password && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                          style={{ backgroundColor: i <= strength ? strengthColors[strength] : "#E5E7EB" }} />
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: strengthColors[strength] }}>{strengthLabels[strength]} password</p>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#111827]">Confirm password</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter your password"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-[#111827] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition ${
                      form.confirmPassword && form.password !== form.confirmPassword ? "border-red-300 bg-red-50"
                      : form.confirmPassword && form.password === form.confirmPassword ? "border-green-300 bg-green-50"
                      : "border-gray-200"}`} required />
                  {form.confirmPassword && form.password === form.confirmPassword && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-xs text-red-500">Passwords don&apos;t match</p>
                )}
              </div>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} className="sr-only" />
                  <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${form.agreeTerms ? "bg-[#4F46E5] border-[#4F46E5]" : "border-gray-300 group-hover:border-[#4F46E5]"}`}>
                    {form.agreeTerms && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-600 leading-tight">
                  I agree to the{" "}
                  <a href="#" className="text-[#4F46E5] font-medium hover:underline">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="text-[#4F46E5] font-medium hover:underline">Privacy Policy</a>
                </span>
              </label>

              <button type="submit"
                disabled={loading || !form.agreeTerms || form.password !== form.confirmPassword}
                className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </>
                ) : "Create Learner Account"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-medium">Already have an account?</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <Link href="/login"
              className="block w-full text-center text-sm font-semibold text-gradient-to-br from-blue-600 to-cyan-500 border border-[#4F46E5] rounded-xl py-3 hover:bg-indigo-50 transition">
              Sign in instead
            </Link>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            &copy; {new Date().getFullYear()} CohortLMS · <a href="#" className="hover:underline">Privacy</a> · <a href="#" className="hover:underline">Terms</a>
          </p>
        </div>
      </div>
    </div>
  );
}
