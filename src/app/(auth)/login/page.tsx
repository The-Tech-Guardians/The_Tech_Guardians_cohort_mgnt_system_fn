
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/navbar/Logo";
import { authAPI, tokenManager } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
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
      console.log('Attempting login with:', { email, password: '***' });
      const response = await authAPI.login({ email, password });
      console.log('Login response:', JSON.stringify(response, null, 2));
      console.log('Response success:', response.success);
      console.log('Response data:', response.data);
      console.log('Response message:', response.message);
      
      if ((response.success && response.data?.token && response.data?.user) || (response.requires_2fa && response.token && response.user_id)) {
        console.log('Login successful, storing data and showing message');
        
        // Handle different response formats
        if (response.requires_2fa) {
          // Backend format: { requires_2fa: true, token, user_id, message }
          tokenManager.setToken(response.token);
          tokenManager.setUser({ id: response.user_id, email });
        } else {
          // Standard format: { success: true, data: { token, user } }
          tokenManager.setToken(response.data.token);
          tokenManager.setUser(response.data.user);
        }
        
        // Show success message
        setSuccess("2FA code sent to your email");
        
        // Redirect to 2FA verification after showing message
        setTimeout(() => {
          console.log('Redirecting to 2FA page');
          router.push("/login/verify-2fa");
        }, 2000);
      } else {
        console.log('Login failed:', response);
        setError(response.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">

  
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

          <Logo />

          <div className="space-y-8">

            <div className="space-y-3">
            
              <h2 className="text-4xl font-bold text-white leading-tight pt-4">
                Learn together,<br />
                <span className="text-white/75">grow together.</span>
              </h2>
              <p className="text-white/60 text-base leading-relaxed max-w-xs">
                A cohort-based learning platform built for structured, collaborative education.
              </p>
            </div>
            <div className="flex justify-center">
              <svg viewBox="0 0 480 300" fill="none" xmlns="http://www.w3.org/2000/svg"
                className="w-full max-w-sm drop-shadow-xl">

                <ellipse cx="240" cy="292" rx="160" ry="8" fill="rgba(0,0,0,0.15)" />

                <rect x="60" y="245" width="360" height="12" rx="6" fill="white" fillOpacity="0.25" />

                <rect x="216" y="222" width="48" height="24" rx="4" fill="white" fillOpacity="0.3" />
                <rect x="196" y="244" width="88" height="8" rx="4" fill="white" fillOpacity="0.35" />

            
                <rect x="100" y="60" width="280" height="164" rx="14" fill="white" fillOpacity="0.18" stroke="white" strokeOpacity="0.4" strokeWidth="2" />

                <rect x="112" y="72" width="256" height="140" rx="8" fill="#0C4A6E" fillOpacity="0.55" />

                <rect x="112" y="72" width="256" height="22" rx="8" fill="white" fillOpacity="0.12" />
                <circle cx="126" cy="83" r="4" fill="#F87171" fillOpacity="0.8" />
                <circle cx="139" cy="83" r="4" fill="#FBBF24" fillOpacity="0.8" />
                <circle cx="152" cy="83" r="4" fill="#34D399" fillOpacity="0.8" />

                <rect x="168" y="78" width="140" height="10" rx="5" fill="white" fillOpacity="0.15" />
                <rect x="172" y="81" width="80" height="4" rx="2" fill="white" fillOpacity="0.4" />

                <rect x="112" y="94" width="48" height="118" fill="white" fillOpacity="0.06" />
                <rect x="120" y="104" width="32" height="5" rx="2.5" fill="white" fillOpacity="0.3" />
                <rect x="120" y="114" width="28" height="4" rx="2" fill="white" fillOpacity="0.2" />
                <rect x="120" y="123" width="30" height="4" rx="2" fill="white" fillOpacity="0.2" />
                <rect x="120" y="132" width="26" height="4" rx="2" fill="white" fillOpacity="0.2" />
                <rect x="120" y="141" width="30" height="4" rx="2" fill="white" fillOpacity="0.2" />
                <rect x="120" y="150" width="24" height="4" rx="2" fill="white" fillOpacity="0.2" />

                <rect x="170" y="100" width="130" height="8" rx="4" fill="white" fillOpacity="0.55" />
                <rect x="170" y="113" width="100" height="5" rx="2.5" fill="white" fillOpacity="0.25" />

                <rect x="170" y="124" width="100" height="56" rx="6" fill="#0EA5E9" fillOpacity="0.45" />

                <circle cx="220" cy="152" r="14" fill="white" fillOpacity="0.25" />
     
                <rect x="170" y="186" width="80" height="5" rx="2.5" fill="white" fillOpacity="0.3" />
                <rect x="170" y="196" width="120" height="6" rx="3" fill="white" fillOpacity="0.12" />
                <rect x="170" y="196" width="78" height="6" rx="3" fill="white" fillOpacity="0.6" />

                <rect x="284" y="100" width="72" height="6" rx="3" fill="white" fillOpacity="0.4" />
                {[110, 122, 134, 146, 158, 170, 182].map((y, i) => (
                  <g key={i}>
                    <circle cx="292" cy={y + 4} r="3" fill="white" fillOpacity={i < 3 ? 0.7 : 0.25} />
                    <rect x="300" cy={y} y={y + 1} width={i < 3 ? 44 : 38} height="4" rx="2"
                      fill="white" fillOpacity={i < 3 ? 0.45 : 0.18} />
                  </g>
                ))}

                {/* ── Person / character ── */}
                {/* Body */}
                <ellipse cx="370" cy="210" rx="30" ry="34" fill="#FDE68A" />
              
                <path d="M340 225 Q355 215 370 218 Q385 215 400 225 L400 256 Q385 262 370 262 Q355 262 340 256 Z"
                  fill="white" fillOpacity="0.85" />
                
                <circle cx="370" cy="182" r="24" fill="#FDE68A" />
            
                <path d="M346 176 Q370 155 394 176 Q394 162 370 158 Q346 162 346 176Z" fill="#92400E" />
             
                <circle cx="362" cy="182" r="3" fill="#1E293B" />
                <circle cx="378" cy="182" r="3" fill="#1E293B" />
                <circle cx="363" cy="181" r="1" fill="white" />
                <circle cx="379" cy="181" r="1" fill="white" />
                <path d="M363 191 Q370 196 377 191" stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              
                <path d="M340 232 Q310 218 280 210" stroke="#FDE68A" strokeWidth="14" strokeLinecap="round" />
                <ellipse cx="276" cy="209" rx="9" ry="7" fill="#FDE68A" />
              
                <path d="M400 232 Q412 246 408 258" stroke="#FDE68A" strokeWidth="14" strokeLinecap="round" />

                <g filter="url(#shadow1)">
                  <rect x="14" y="40" width="150" height="62" rx="14" fill="white" fillOpacity="0.95" />
                  <rect x="14" y="40" width="150" height="62" rx="14" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
                
                
                  <rect x="66" y="53" width="84" height="6" rx="3" fill="#1E3A5F" fillOpacity="0.7" />
                  <rect x="66" y="64" width="64" height="5" rx="2.5" fill="#1E3A5F" fillOpacity="0.35" />
                  <rect x="66" y="74" width="76" height="4" rx="2" fill="#1E3A5F" fillOpacity="0.25" />
                
                  <rect x="26" y="88" width="126" height="6" rx="3" fill="#DBEAFE" />
                  <rect x="26" y="88" width="90" height="6" rx="3" fill="#2563EB" fillOpacity="0.85" />
                </g>

                <g filter="url(#shadow2)">
                  <rect x="316" y="18" width="150" height="56" rx="14" fill="white" fillOpacity="0.95" />
                  <rect x="316" y="18" width="150" height="56" rx="14" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
                  <rect x="328" y="30" width="32" height="32" rx="8" fill="#FEF3C7" />
                  <text x="344" y="51" textAnchor="middle" fontSize="16">🔥</text>
                  <rect x="368" y="32" width="84" height="6" rx="3" fill="#1E3A5F" fillOpacity="0.7" />
                  <rect x="368" y="43" width="60" height="5" rx="2.5" fill="#1E3A5F" fillOpacity="0.35" />

                  {[0,1,2,3,4].map(i => (
                    <text key={i} x={368 + i * 14} y="62" fontSize="10" fill="#FBBF24">★</text>
                  ))}
                </g>

                <defs>
                  <filter id="shadow1" x="-10%" y="-10%" width="120%" height="130%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.12" />
                  </filter>
                  <filter id="shadow2" x="-10%" y="-10%" width="120%" height="130%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.12" />
                  </filter>
                </defs>
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
                    placeholder="olivier@gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-[#111827] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#111827]">Password</label>
                  <Link href="/login/forgot-password" className="text-xs text-blue-600 hover:underline font-medium">
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
              <Link href="/register" className="text-[#4F46E5] font-semibold hover:underline">
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