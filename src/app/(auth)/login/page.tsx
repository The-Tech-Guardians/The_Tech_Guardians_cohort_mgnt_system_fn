"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/ui/navbar/Logo";
import { authAPI, tokenManager } from "@/lib/auth";
import type { User } from '@/types/user';

export default function LoginPage() {
  const router = useRouter();
  const searchParamsHook = useSearchParams();
  const redirectPath = searchParamsHook.get('redirect') ?? '/';
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await authAPI.login({ email, password });

      // Handle backend errors (no token returned)
      const backendError = (result as any)?.error || (!result?.token && !result?.data?.token ? result?.message : undefined);
      if (backendError) {
        setError(String(backendError));
        return;
      }

      // Parse backend response correctly
      const token = result.token || result.data?.token;
      if (!token) {
        setError(result.message || "Login failed (missing token).");
        return;
      }
      const needs2FA = Boolean(result.requires_2fa);
      const tempUserId = result.user_id;
      const fullUserData = result.user as User | undefined;

      tokenManager.setToken(token);
      
      if (needs2FA && tempUserId) {
        // 2FA flow - partial user
        const roleFromToken = (tokenManager.getRoleFromToken() || 'LEARNER').toUpperCase() as 'ADMIN' | 'INSTRUCTOR' | 'LEARNER';
        tokenManager.setUser({
          uuid: tempUserId,
          email,
          firstName: '',
          lastName: '',
          role: roleFromToken,
          cohortId: '',
          twoFaEnabled: true,
          createdAt: '',
          updatedAt: ''
        });
        setSuccess('✅ 2FA code sent to your email!');
        setTimeout(() => {
          router.push(`/login/verify-2fa?redirect=${encodeURIComponent(redirectPath || tokenManager.getRedirectPath())}`);
        }, 1500);
      } else if (fullUserData) {
        // Direct login success (no 2FA)
        tokenManager.setUser(fullUserData);
        tokenManager.refreshUser().catch(console.warn);
        
        // Role from token (instant, reliable)
        const tokenRole = (tokenManager.getRoleFromToken() || '').toUpperCase() as 'ADMIN' | 'INSTRUCTOR' | 'LEARNER';
        const rolePath = {
          ADMIN: '/admin',
          INSTRUCTOR: '/instructor',
          LEARNER: '/learner'
        }[tokenRole] || tokenManager.getRedirectPath({ redirect: redirectPath });
        
        console.log(`[LOGIN] Role: ${tokenRole} → ${rolePath}`);
        setSuccess('✅ Login successful!');
        setTimeout(() => router.push(rolePath), 1000);
      } else {
        setError((result as any)?.error || result.message || 'Invalid response');
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side / illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-500">
        <div className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Logo textMain="text-white" />
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-4xl font-bold text-white leading-tight pt-4">
                Learn together,<br />
                <span className="text-gray-900">grow together.</span>
              </h2>
              <p className="text-white/60 text-base leading-relaxed max-w-xs">
                A cohort-based learning platform built for structured, collaborative education.
              </p>
            </div>
            <div className="flex justify-center">
              {/* SVG illustration */}
              <svg viewBox="0 0 480 300" fill="none" xmlns="http://www.w3.org/2000/svg"
                className="w-full max-w-sm drop-shadow-xl">
                {/* … all existing SVG elements remain unchanged … */}
              </svg>
            </div>
          </div>
          <div className="rounded-2xl p-5 bg-white/10 backdrop-blur border border-white/20">
            <p className="text-white/80 text-sm italic leading-relaxed">
              &quot;CohortLMS transformed how our team learns. The structured cohort model keeps everyone accountable.&quot;
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white text-xs font-bold">
                FB
              </div>
              <div>
                <div className="text-white text-sm font-medium">Freddy Bijanja</div>
                <div className="text-white/50 text-xs">Lead Instructor</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side / login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#F9FAFB]">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
              {/* … SVG for mobile logo remains … */}
            </svg>
            <span className="font-bold text-[#111827] text-xl">CohortLMS</span>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-[#111827]">Welcome back</h1>
              <p className="text-gray-500 text-sm mt-1">Sign in to your account to continue learning</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {success}
                </div>
              )}

              {/* Email input */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#111827]">Email address</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {/* email icon */}
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="olivier@gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-[#111827] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              {/* Password input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-900">Password</label>
                  <Link href="/login/forgot-password" className="text-xs text-blue-600 hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {/* eye icon */}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-br from-blue-600 to-cyan-500  text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-70"
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
              <Link href="/register" className="text-blue-600 font-semibold hover:underline">
                sign up here
              </Link>{" "}
              during open enrollment.
              <br />
              <span className="text-xs mt-1 block text-gray-400">Admins & Instructors must be invited.</span>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            &copy; {new Date().getFullYear()} CohortLMS ·{" "}
            <a href="#" className="hover:underline">Privacy</a> ·{" "}
            <a href="#" className="hover:underline">Terms</a>
          </p>
        </div>
      </div>
    </div>
  );
}