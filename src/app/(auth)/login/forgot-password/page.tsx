"use client";
import { useState } from "react";
import Link from "next/link";

const LOGO = (
  <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
    <circle cx="14" cy="10" r="5" fill="#4F46E5" />
    <circle cx="26" cy="10" r="5" fill="#2563EB" />
    <circle cx="20" cy="6" r="5" fill="#06B6D4" />
    <path d="M4 28 Q20 18 36 28" stroke="#4F46E5" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M6 33 Q20 23 34 33" stroke="#2563EB" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M9 38 Q20 30 31 38" stroke="#06B6D4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
);

type Step = 1 | 2 | 3;

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const checks = {
    len: password.length >= 8,
    upper: /[A-Z]/.test(password),
    num: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  const colors = ["", "#EF4444", "#F59E0B", "#3B82F6", "#10B981"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300" style={{ background: i <= score ? colors[score] : "#E5E7EB" }} />
        ))}
      </div>
      <p className="text-xs font-medium" style={{ color: colors[score] }}>{labels[score]} password</p>
      <div className="space-y-1">
        {[
          { key: "len", label: "At least 8 characters", ok: checks.len },
          { key: "upper", label: "One uppercase letter", ok: checks.upper },
          { key: "num", label: "One number", ok: checks.num },
          { key: "special", label: "One special character", ok: checks.special },
        ].map((r) => (
          <div key={r.key} className="flex items-center gap-1.5 text-xs transition-colors" style={{ color: r.ok ? "#10B981" : "#9CA3AF" }}>
            <span>{r.ok ? "✓" : "○"}</span>
            <span>{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

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

  const [leftStep, setLeftStep] = useState(1);
  const updateLeftDots = (s: number) => setLeftStep(s);

  const dotClass = (s: number) => {
    if (s < leftStep) return "bg-green-500 text-white";
    if (s === leftStep) return "bg-[#4F46E5] text-white";
    return "bg-white/10 text-white/40";
  };
  const labelClass = (s: number) => (s <= leftStep ? "text-white" : "text-white/40");

  return (
    <div className="min-h-screen flex bg-white">
     
      <div className="hidden lg:flex w-[46%] bg-[#0F0C29] relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-[#4F46E5] opacity-20 blur-[80px] animate-pulse" />
        <div className="absolute bottom-[5%] left-[-8%] w-[50%] h-[50%] rounded-full bg-[#06B6D4] opacity-15 blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(79,70,229,1) 1px,transparent 1px),linear-gradient(90deg,rgba(79,70,229,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">{LOGO}</div>
          <span className="text-white font-extrabold text-xl">CohortLMS</span>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <div className="w-12 h-1 bg-[#4F46E5] rounded-full mb-4" />
            <h2 className="text-[34px] font-extrabold text-white leading-tight mb-3">Password<br /><span className="text-indigo-400">Recovery</span></h2>
            <p className="text-white/45 text-sm max-w-[260px] leading-relaxed">Secure, step-by-step password reset. We&apos;ll verify your identity before allowing any changes.</p>
          </div>

          <div className="space-y-0">
            {[
              { n: 1, title: "Enter your email", sub: "We'll send a secure reset link" },
              { n: 2, title: "Check your email", sub: "Click the link to continue" },
              { n: 3, title: "Set new password", sub: "Choose a strong new password" },
            ].map((item, idx) => (
              <div key={item.n} className="flex gap-3.5 items-start">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 transition-all duration-300 ${dotClass(item.n)}`}>{item.n < leftStep ? "✓" : item.n}</div>
                  {idx < 2 && <div className="w-0.5 h-9 bg-white/10 my-1" />}
                </div>
                <div className="pt-1">
                  <div className={`text-sm font-semibold transition-colors duration-300 ${labelClass(item.n)}`}>{item.title}</div>
                  <div className="text-white/25 text-xs mt-0.5">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 relative z-10">
          <p className="text-white/35 text-xs leading-relaxed">🔒 Reset links expire after <strong className="text-white/55">15 minutes</strong>. For Admins & Instructors, 2FA will still be required after reset.</p>
        </div>
      </div>
      <div className="flex-1 bg-[#F9FAFB] flex items-center justify-center px-6 py-20 overflow-y-auto">
        <div className="w-full max-w-[420px]">

          
          {step === 1 && (
            <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 p-8">
              <Link href="/login" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#4F46E5] transition mb-6 font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                Back to login
              </Link>

              <div className="flex gap-1.5 mb-6">
                <div className="h-2 w-6 rounded-full bg-[#4F46E5]" />
                <div className="h-2 w-2 rounded-full bg-gray-200" />
                <div className="h-2 w-2 rounded-full bg-gray-200" />
              </div>

              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mb-4">🔑</div>
              <h1 className="text-2xl font-extrabold text-[#111827] mb-2">Forgot your password?</h1>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">No worries. Enter your registered email address and we&apos;ll send you a secure reset link.</p>

              <form onSubmit={handleStep1} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-1.5">Email address</label>
                  <div className="relative">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full pl-10 pr-4 py-3 rounded-xl border-[1.5px] border-gray-200 text-[#111827] text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#4F46E5] focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)] transition" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">We&apos;ll send instructions to this address if it&apos;s linked to an account.</p>
                </div>

                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 transition disabled:opacity-60">
                  {loading ? (<><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Sending…</>) : (<>Send reset link <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></>)}
                </button>
              </form>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400">Remember it now?</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <Link href="/login" className="block w-full text-center text-sm font-bold text-[#4F46E5] border-2 border-[#4F46E5] rounded-xl py-3 hover:bg-indigo-50 transition">Sign in instead</Link>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 p-8">
              <div className="flex gap-1.5 mb-6">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div className="h-2 w-6 rounded-full bg-[#4F46E5]" />
                <div className="h-2 w-2 rounded-full bg-gray-200" />
              </div>

              <div className="text-center py-2 mb-5">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl" style={{ animation: "successPop 0.4s ease-out" }}>📬</div>
                <h1 className="text-xl font-extrabold text-[#111827] mb-2">Check your inbox</h1>
                <p className="text-sm text-gray-500 leading-relaxed">We&apos;ve sent a reset link to<br /><strong className="text-[#111827]">{sentEmail}</strong></p>
              </div>

              <div className="flex gap-2.5 bg-indigo-50 border border-indigo-100 rounded-xl p-3.5 mb-5">
                <svg className="w-4 h-4 text-[#4F46E5] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-xs text-indigo-700 leading-relaxed">This link expires in <strong>15 minutes</strong>. Check your spam folder if you don&apos;t see it.</p>
              </div>

              <button onClick={() => { setStep(3); updateLeftDots(3); }} className="w-full flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 transition mb-3">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                Simulate: open reset link
              </button>

              <div className="text-center mb-4">
                <span className="text-xs text-gray-400">Didn&apos;t receive it? </span>
                <button onClick={handleResend} className={`text-xs font-bold transition ${resent ? "text-green-600" : "text-[#4F46E5] hover:underline"}`}>{resent ? "Sent! ✓" : "Resend email"}</button>
              </div>

              <div className="flex items-center gap-3 my-4"><div className="flex-1 h-px bg-gray-100" /><div className="flex-1 h-px bg-gray-100" /></div>
              <button onClick={() => { setStep(1); updateLeftDots(1); }} className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-[#4F46E5] transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                Use a different email
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 p-8">
              <div className="flex gap-1.5 mb-6">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div className="h-2 w-6 rounded-full bg-[#4F46E5]" />
              </div>

              {resetDone ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#111827] mb-2">Password updated!</h3>
                  <p className="text-sm text-gray-500 mb-5">Your password has been changed successfully.</p>
                  <Link href="/login" className="inline-block w-full text-center bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 transition">Continue to Login</Link>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-2xl mb-4">🔐</div>
                  <h1 className="text-2xl font-extrabold text-[#111827] mb-2">Set new password</h1>
                  <p className="text-sm text-gray-500 mb-6">Choose a strong password you haven&apos;t used before.</p>

                  <form onSubmit={handleReset} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#111827] mb-1.5">New password</label>
                      <div className="relative">
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        <input type={showPass ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 8 characters" required className="w-full pl-10 pr-10 py-3 rounded-xl border-[1.5px] border-gray-200 text-[#111827] text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#4F46E5] focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)] transition" />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                      </div>
                      <PasswordStrength password={newPassword} />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#111827] mb-1.5">Confirm new password</label>
                      <div className="relative">
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password" required className={`w-full pl-10 pr-4 py-3 rounded-xl border-[1.5px] text-[#111827] text-sm placeholder:text-gray-400 focus:outline-none transition ${confirmPassword && newPassword !== confirmPassword ? "border-red-300 bg-red-50 focus:border-red-400" : confirmPassword && newPassword === confirmPassword ? "border-green-300 bg-green-50" : "border-gray-200 focus:border-[#4F46E5] focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)]"}`} />
                        {confirmPassword && newPassword === confirmPassword && (
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
                        )}
                      </div>
                      {confirmPassword && (
                        <p className={`text-xs mt-1 ${newPassword === confirmPassword ? "text-green-600" : "text-red-500"}`}>{newPassword === confirmPassword ? "✓ Passwords match" : "Passwords don't match"}</p>
                      )}
                    </div>

                    <button type="submit" disabled={loading || newPassword !== confirmPassword || !newPassword} className="w-full flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                      {loading ? (<><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Resetting…</>) : "Reset password"}
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