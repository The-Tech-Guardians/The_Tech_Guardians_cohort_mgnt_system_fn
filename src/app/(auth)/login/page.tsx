"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/login/verify-2fa");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0F0C29]">

        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `linear-gradient(rgba(79,70,229,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.5) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                   <Logo/>

          <div className="space-y-8">
            <div className="space-y-2">
              <div className="w-12 h-1 bg-[#4F46E5] rounded-full" />
              <h2 className="text-4xl font-bold text-white leading-tight">
                Learn together,<br />
                <span className="text-[#6366F1]">grow together.</span>
              </h2>
              <p className="text-white/50 text-base leading-relaxed max-w-xs mt-4">
                A cohort-based learning platform built for structured, collaborative education.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Active Learners", value: "2,400+" },
                { label: "Courses", value: "48" },
                { label: "Completion Rate", value: "94%" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/40 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
            <p className="text-white/70 text-sm italic leading-relaxed">
             &quot;CohortLMS transformed how our team learns. The structured cohort model keeps everyone accountable.&quot;
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] flex items-center justify-center text-white text-xs font-bold">FB</div>
              <div>
                <div className="text-white text-sm font-medium">Freddy Bijanja</div>
                <div className="text-white/40 text-xs">Lead Instructor</div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-[#111827]">Welcome back</h1>
              <p className="text-gray-500 text-sm mt-1">Sign in to your account to continue learning</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#111827]">Email address</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-[#111827] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#111827]">Password</label>
                  <Link href="/login/forgot-password" className="text-xs text-[#4F46E5] hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 text-[#111827] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
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
              </div>

              <div className="flex items-start gap-2.5 bg-indigo-50 border border-indigo-100 rounded-xl p-3.5">
                <svg className="w-4 h-4 text-[#4F46E5] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-xs text-indigo-700 leading-relaxed">
                  2FA is required for all Admin and Instructor accounts. You&apos;ll be prompted after login.
                </p>
              </div>
            
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in to CohortLMS"
                )}
              </button>
              
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-medium">New to CohortLMS?</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <p className="text-center text-sm text-gray-500">
              Learners can{" "}
              <Link href="/register" className="text-[#4F46E5] font-semibold hover:underline">
                sign up here
              </Link>{" "}
              during open enrollment.
              <br />
              <span className="text-xs mt-1 block text-gray-400">Admins & Instructors must be invited.</span>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            &copy; {new Date().getFullYear()} CohortLMS · <a href="#" className="hover:underline">Privacy</a> · <a href="#" className="hover:underline">Terms</a>
          </p>
        </div>
      </div>
    </div>
  );
}
