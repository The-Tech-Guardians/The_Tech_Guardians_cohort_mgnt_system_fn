
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { PasswordStrength } from "@/components/banner/auth/verify-resend-success/forgot-password";

type Step = 1 | 2 | 3;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [sentEmail, setSentEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [resent, setResent] = useState(false);
  const [leftStep, setLeftStep] = useState(1);

  const updateLeftDots = (s: number) => setLeftStep(s);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSentEmail(email); setStep(2); updateLeftDots(2); }, 1500);
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setResetDone(true); }, 1500);
  };

  const handleResend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  const dotClass = (s: number) => {
    if (s < leftStep) return "bg-white text-blue-600";
    if (s === leftStep) return "bg-white/25 text-white border-2 border-white";
    return "bg-white/10 text-white/40 border border-white/20";
  };
  const labelClass = (s: number) => (s <= leftStep ? "text-white" : "text-white/40");

  return (
    <div className="min-h-screen flex bg-white">

      {/* ═══════════════════════════════════════
          LEFT PANEL
      ═══════════════════════════════════════ */}
      <div className="hidden lg:flex w-[46%] relative overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-500 flex-col justify-between p-12">

        {/* White dot-grid */}
        <div className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10">
          <Logo />
        </div>

        <div className="relative z-10 space-y-8">
          {/* Headline */}
          <div>
            <div className="w-10 h-1 bg-white/60 rounded-full mb-4" />
            <h2 className="text-[34px] font-extrabold text-white leading-tight mb-3">
              Password<br />
              <span className="text-white/75">Recovery</span>
            </h2>
            <p className="text-white/60 text-sm max-w-[260px] leading-relaxed">
              Secure, step-by-step password reset. We'll verify your identity before allowing any changes.
            </p>
          </div>

          {/* Step tracker */}
          <div className="space-y-0">
            {[
              { n: 1, title: "Enter your email", sub: "We'll send a secure reset link" },
              { n: 2, title: "Check your email", sub: "Click the link to continue" },
              { n: 3, title: "Set new password", sub: "Choose a strong new password" },
            ].map((item, idx) => (
              <div key={item.n} className="flex gap-3.5 items-start">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 transition-all duration-300 ${dotClass(item.n)}`}>
                    {item.n < leftStep ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : item.n}
                  </div>
                  {idx < 2 && <div className="w-0.5 h-9 bg-white/20 my-1" />}
                </div>
                <div className="pt-1">
                  <div className={`text-sm font-semibold transition-colors duration-300 ${labelClass(item.n)}`}>{item.title}</div>
                  <div className="text-white/35 text-xs mt-0.5">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Undraw-style illustration — lock / security */}
          <div className="flex justify-center">
            <svg viewBox="0 0 380 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs drop-shadow-lg">
              <ellipse cx="190" cy="214" rx="130" ry="6" fill="rgba(0,0,0,0.1)" />

              {/* Shield body */}
              <path d="M190 20 L290 60 L290 130 Q290 180 190 205 Q90 180 90 130 L90 60 Z"
                fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.35" strokeWidth="2" />
              {/* Shield inner */}
              <path d="M190 38 L272 72 L272 130 Q272 170 190 190 Q108 170 108 130 L108 72 Z"
                fill="white" fillOpacity="0.1" />

              {/* Lock icon in shield */}
              <rect x="162" y="100" width="56" height="46" rx="10" fill="white" fillOpacity="0.3" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" />
              <path d="M172 100 L172 88 Q172 72 190 72 Q208 72 208 88 L208 100"
                stroke="white" strokeOpacity="0.7" strokeWidth="4" strokeLinecap="round" fill="none" />
              <circle cx="190" cy="120" r="8" fill="white" fillOpacity="0.7" />
              <rect x="187" y="120" width="6" height="12" rx="3" fill="white" fillOpacity="0.9" />

              {/* Check badge top right */}
              <circle cx="272" cy="48" r="18" fill="white" fillOpacity="0.9" />
              <path d="M263 48 L269 54 L281 42" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

              {/* Key — left */}
              <g transform="rotate(-35 110 160)">
                <circle cx="110" cy="148" r="14" fill="white" fillOpacity="0.25" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" />
                <circle cx="110" cy="148" r="7" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
                <rect x="120" y="145" width="32" height="6" rx="3" fill="white" fillOpacity="0.35" />
                <rect x="144" y="151" width="6" height="8" rx="2" fill="white" fillOpacity="0.35" />
                <rect x="135" y="151" width="5" height="6" rx="1.5" fill="white" fillOpacity="0.35" />
              </g>

              {/* Dots / particles */}
              {[[50,80],[320,90],[60,170],[330,155],[190,15]].map(([x,y],i) => (
                <circle key={i} cx={x} cy={y} r={i%2===0?3:2} fill="white" fillOpacity="0.3" />
              ))}
            </svg>
          </div>
        </div>

        {/* Bottom notice */}
        <div className="relative z-10 bg-white/10 border border-white/20 rounded-2xl p-4">
          <p className="text-white/60 text-xs leading-relaxed">
            Reset links expire after <strong className="text-white/80">15 minutes</strong>. For Admins & Instructors, 2FA will still be required after reset.
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          RIGHT PANEL — steps (unchanged logic)
      ═══════════════════════════════════════ */}
      <div className="flex-1 bg-[#F9FAFB] flex items-center justify-center px-6 py-20 overflow-y-auto">
        <div className="w-full max-w-[420px]">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 p-8">
              <Link href="/login" className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition mb-6 font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                Back to login
              </Link>
              <div className="flex gap-1.5 mb-6">
                <div className="h-2 w-6 rounded-full bg-blue-600" />
                <div className="h-2 w-2 rounded-full bg-gray-200" />
                <div className="h-2 w-2 rounded-full bg-gray-200" />
              </div>
              <h1 className="text-2xl font-extrabold text-[#111827] mb-2">Forgot your password?</h1>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">No worries. Enter your registered email address and we'll send you a secure reset link.</p>
              <form onSubmit={handleStep1} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-1.5">Email address</label>
                  <div className="relative">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-[1.5px] border-gray-200 text-[#111827] text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] transition" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">We'll send instructions to this address if it's linked to an account.</p>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition disabled:opacity-60">
                  {loading ? (<><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Sending…</>) : (<>Send reset link <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg></>)}
                </button>
              </form>
              <div className="flex items-center gap-3 my-5"><div className="flex-1 h-px bg-gray-100"/><span className="text-xs text-gray-400">Remember it now?</span><div className="flex-1 h-px bg-gray-100"/></div>
              <Link href="/login" className="block w-full text-center text-sm font-bold text-blue-600 border-2 border-blue-500 rounded-xl py-3 hover:bg-blue-50 transition">Sign in instead</Link>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 p-8">
              <div className="flex gap-1.5 mb-6">
                <div className="h-2 w-2 rounded-full bg-green-500"/>
                <div className="h-2 w-6 rounded-full bg-blue-600"/>
                <div className="h-2 w-2 rounded-full bg-gray-200"/>
              </div>
              <div className="text-center py-2 mb-5">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">📬</div>
                <h1 className="text-xl font-extrabold text-[#111827] mb-2">Check your inbox</h1>
                <p className="text-sm text-gray-500 leading-relaxed">We've sent a reset link to<br/><strong className="text-[#111827]">{sentEmail}</strong></p>
              </div>
              <div className="flex gap-2.5 bg-blue-50 border border-blue-100 rounded-xl p-3.5 mb-5">
                <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <p className="text-xs text-blue-700 leading-relaxed">This link expires in <strong>15 minutes</strong>. Check your spam folder if you don't see it.</p>
              </div>
              <button onClick={() => { setStep(3); updateLeftDots(3); }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition mb-3">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                Simulate: open reset link
              </button>
              <div className="text-center mb-4">
                <span className="text-xs text-gray-400">Didn't receive it? </span>
                <button onClick={handleResend} className={`text-xs font-bold transition ${resent ? "text-green-600" : "text-blue-600 hover:underline"}`}>{resent ? "Sent! ✓" : "Resend email"}</button>
              </div>
              <div className="flex items-center gap-3 my-4"><div className="flex-1 h-px bg-gray-100"/><div className="flex-1 h-px bg-gray-100"/></div>
              <button onClick={() => { setStep(1); updateLeftDots(1); }} className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                Use a different email
              </button>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 p-8">
              <div className="flex gap-1.5 mb-6">
                <div className="h-2 w-2 rounded-full bg-green-500"/>
                <div className="h-2 w-2 rounded-full bg-green-500"/>
                <div className="h-2 w-6 rounded-full bg-blue-600"/>
              </div>
              {resetDone ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#111827] mb-2">Password updated!</h3>
                  <p className="text-sm text-gray-500 mb-5">Your password has been changed successfully.</p>
                  <Link href="/login" className="inline-block w-full text-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition">Continue to Login</Link>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-extrabold text-[#111827] mb-2">Set new password</h1>
                  <p className="text-sm text-gray-500 mb-6">Choose a strong password you haven't used before.</p>
                  <form onSubmit={handleReset} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#111827] mb-1.5">New password</label>
                      <div className="relative">
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                        <input type={showPass ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 8 characters" required
                          className="w-full pl-10 pr-10 py-3 rounded-xl border-[1.5px] border-gray-200 text-[#111827] text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] transition"/>
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </button>
                      </div>
                      <PasswordStrength password={newPassword} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#111827] mb-1.5">Confirm new password</label>
                      <div className="relative">
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password" required
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border-[1.5px] text-[#111827] text-sm placeholder:text-gray-400 focus:outline-none transition ${confirmPassword && newPassword !== confirmPassword ? "border-red-300 bg-red-50 focus:border-red-400" : confirmPassword && newPassword === confirmPassword ? "border-green-300 bg-green-50" : "border-gray-200 focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"}`}/>
                        {confirmPassword && newPassword === confirmPassword && (
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></div>
                        )}
                      </div>
                      {confirmPassword && (
                        <p className={`text-xs mt-1 ${newPassword === confirmPassword ? "text-green-600" : "text-red-500"}`}>{newPassword === confirmPassword ? "✓ Passwords match" : "Passwords don't match"}</p>
                      )}
                    </div>
                    <button type="submit" disabled={loading || newPassword !== confirmPassword || !newPassword}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                      {loading ? (<><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Resetting…</>) : "Reset password"}
                    </button>
                  </form>
                </>
              )}
            </div>
          )}

          <p className="text-center text-xs text-gray-400 mt-5">&copy;{new Date().getFullYear()} CohortLMS · <Link href="#" className="hover:underline">Privacy</Link> · <Link href="#" className="hover:underline">Terms</Link></p>
        </div>
      </div>
    </div>
  );
}