"use client";
import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { Book, BookCopy, ChartColumnStacked, GraduationCap, Trophy } from "lucide-react";

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
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0F0C29]">
        <div className="absolute inset-0">
          <div className="absolute top-[-10%] right-[-10%] w-[65%] h-[65%] rounded-full bg-[#4F46E5] opacity-20 blur-[100px] animate-pulse" />
          <div className="absolute bottom-[10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-[#06B6D4] opacity-15 blur-[90px] animate-pulse" style={{ animationDelay: "1.5s" }} />
        </div>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `linear-gradient(rgba(79,70,229,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.5) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
        <Logo/>

          <div className="space-y-8 ">
            <div>
              <div className="w-12 h-1 bg-[#4F46E5] rounded-full mb-4" />
              <h2 className="text-4xl font-bold text-white leading-tight">
                Your learning<br />
                <span className="text-[#6366F1]">journey starts here.</span>
              </h2>
              <p className="text-white/50 text-sm mt-4 max-w-xs leading-relaxed">
                Join an active cohort and gain access to structured courses, expert instructors, and a community of learners.
              </p>
            </div>

            <div className="  text-[#6366F1] space-y-3">
              {[
                { icon: <GraduationCap />, title: "Structured Cohort Learning", desc: "Learn alongside peers on a shared schedule" },
                { icon: <BookCopy />, title: "Expert-led Courses", desc: "Coding, Content Creation and more" },
                { icon: <ChartColumnStacked />, title: "Track Your Progress", desc: "Visual progress through every module" },
                { icon: <Trophy />, title: "Earn Credentials", desc: "Completion badges and certificates" },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3 bg-white/5 backdrop-blur border border-white/10 rounded-xl px-4 py-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="text-white text-sm font-medium">{item.title}</div>
                    <div className="text-white/40 text-xs">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-white/30 text-xs">&copy; {new Date().getFullYear()} CohortLMS. All rights reserved.</div>
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
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Ada"
                    className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-[#111827] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#111827]">Last name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Lovelace"
                    className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-[#111827] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition"
                    required
                  />
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
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-[#111827] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition"
                    required
                  />
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
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
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
                {form.password && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300" style={{ backgroundColor: i <= strength ? strengthColors[strength] : "#E5E7EB" }} />
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
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-[#111827] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition ${
                      form.confirmPassword && form.password !== form.confirmPassword
                        ? "border-red-300 bg-red-50"
                        : form.confirmPassword && form.password === form.confirmPassword
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200"
                    }`}
                    required
                  />
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
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={form.agreeTerms}
                    onChange={handleChange}
                    className="sr-only"
                  />
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

              <button
                type="submit"
                disabled={loading || !form.agreeTerms || form.password !== form.confirmPassword}
                className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  "Create Learner Account"
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-medium">Already have an account?</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <Link
              href="/login"
              className="block w-full text-center text-sm font-semibold text-[#4F46E5] border border-[#4F46E5] rounded-xl py-3 hover:bg-indigo-50 transition"
            >
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
