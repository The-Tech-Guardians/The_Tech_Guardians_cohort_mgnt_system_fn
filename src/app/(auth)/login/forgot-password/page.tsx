
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/ui/navbar/Logo";
import { authAPI } from "@/lib/auth"; 


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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [intendedRedirect, setIntendedRedirect] = useState(searchParams.get('redirect') || '/learner');
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [leftStep, setLeftStep] = useState<1|2|3>(1);

  const updateLeftDots = (s: number) => setLeftStep(s);

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await authAPI.forgotPassword(email);
      if (response.success) {
        setSuccess("OTP sent to your email");
        setStep(2);
        updateLeftDots(2);
      } else {
        setError(response.message || "Failed to send OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await authAPI.verifyOTP(email, otp);
      if (response.success) {
        setSuccess("");
        setStep(3);
        updateLeftDots(3);
      } else {
        setError(response.message || "Invalid OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    setLoading(true);
    setError("");
    
    try {
      const response = await authAPI.resetPassword(email, otp, newPassword);
      if (response.success) {
        setSuccess("Password reset successfully!");
        setTimeout(() => router.push(`/login?redirect=${encodeURIComponent(intendedRedirect)}`), 2000);
      } else {
        setError(response.message || "Failed to reset password");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const response = await authAPI.forgotPassword(email);
      if (response.success) {
        setSuccess("OTP resent to your email");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      setError("Failed to resend OTP");
    }
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
              { n: 1, title: "Enter your email", sub: "We'll send an OTP code" },
              { n: 2, title: "Enter OTP code", sub: "Check your email for the code" },
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
              <p className="text-sm text-gray-500 leading-relaxed mb-6">Enter your registered email address to receive an OTP code.</p>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleStep1} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-1.5">Email address</label>
                  <div className="relative">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="olivier@gmail.com" required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-[1.5px] border-gray-200 text-[#111827] text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] transition" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">We'll send an OTP code to this address if it's linked to an account.</p>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition disabled:opacity-60">
                  {loading ? (<><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Sending…</>) : (<>Send OTP code <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg></>)}
                </button>
              </form>
              <div className="flex items-center gap-3 my-5"><div className="flex-1 h-px bg-gray-100"/><span className="text-xs text-gray-400">Remember it now?</span><div className="flex-1 h-px bg-gray-100"/></div>
              <Link href="/login" className="block w-full text-center text-sm font-bold text-blue-600 border-2 border-blue-500 rounded-xl py-3 hover:bg-blue-50 transition">Sign in instead</Link>
            </div>
          )}

          {/* STEP 2 - OTP Verification */}
          {step === 2 && (
            <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 p-8">
              <div className="flex gap-1.5 mb-6">
                <div className="h-2 w-2 rounded-full bg-green-500"/>
                <div className="h-2 w-6 rounded-full bg-blue-600"/>
                <div className="h-2 w-2 rounded-full bg-gray-200"/>
              </div>
              
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="inline-block bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full px-3 py-1 text-xs font-bold mb-2">
                    📧 Email OTP
                  </span>
                  <h1 className="text-xl font-extrabold text-[#111827] mb-1">Enter OTP Code</h1>
                  <p className="text-sm text-gray-500 max-w-[240px] leading-relaxed">
                    We've sent a 6-digit code to <strong className="text-[#111827]">{email}</strong>
                  </p>
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm mb-4">
                  {success}
                </div>
              )}
              
              <form onSubmit={handleStep2} className="space-y-5">
                <div className="flex gap-2 justify-center">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={otp[index] || ''}
                      onChange={(e) => {
                        const newOtp = otp.split('');
                        newOtp[index] = e.target.value;
                        setOtp(newOtp.join(''));
                        
                        // Auto-focus next input
                        if (e.target.value && index < 5) {
                          const nextInput = e.target.parentElement?.children[index + 1] as HTMLInputElement;
                          nextInput?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        // Handle backspace
                        if (e.key === 'Backspace' && !otp[index] && index > 0) {
                          const prevInput = e.target.parentElement?.children[index - 1] as HTMLInputElement;
                          prevInput?.focus();
                        }
                      }}
                      className="w-12 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                    />
                  ))}
                </div>
                
                <p className="text-center text-xs text-red-500 min-h-[20px]" role="alert">
                  {error && otp.length === 6 ? "Incorrect code. Please try again." : ""}
                </p>
                
                <button type="submit" disabled={loading || otp.length !== 6}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition disabled:opacity-60">
                  {loading ? (<><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Verifying…</>) : "Verify & Continue"}
                </button>
              </form>
              
              <div className="text-center mt-4">
                <span className="text-xs text-gray-400">Didn't receive the code? </span>
                <button onClick={handleResend} className="text-xs font-bold text-blue-600 hover:underline">
                  Resend OTP
                </button>
              </div>
              
              <button onClick={() => { setStep(1); updateLeftDots(1); setError(""); }} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 transition mt-5 mx-auto">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
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
              {success ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#111827] mb-2">Password updated!</h3>
                  <p className="text-sm text-gray-500 mb-5">{success}</p>
                </div>
              ) : (
                <>

                  <h1 className="text-2xl font-extrabold text-[#111827] mb-2">Set new password</h1>
                  <p className="text-sm text-gray-500 mb-6">Choose a strong password you haven't used before.</p>
                  
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
                      {error}
                    </div>
                  )}
                  
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