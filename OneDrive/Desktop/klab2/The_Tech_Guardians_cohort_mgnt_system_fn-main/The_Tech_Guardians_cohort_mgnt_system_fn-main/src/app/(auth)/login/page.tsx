
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/navbar/Logo";
import { authAPI, tokenManager } from "@/lib/auth";
import { BookOpen, CheckCircle } from "lucide-react";


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
      const result = await authAPI.login({ email, password });
      console.log('Login response:', JSON.stringify(result, null, 2));
      console.log('Response success:', result.success);
      console.log('Response data:', result.data);
      console.log('Response message:', result.message);
      
      if ((result.success && result.data?.token && result.data?.user) || 
          (result.requires_2fa && result.token && result.user_id) ||
          (result.requires_2fa_setup && result.token && result.user_id)) {
        console.log('Login successful, storing data and showing message');
        
        // Handle different response formats
        if ((result.requires_2fa || result.requires_2fa_setup) && result.token && result.user_id) {
          // Backend format: { requires_2fa: true, token, user_id, message }
          tokenManager.setToken(result.token);
          tokenManager.setUser({ id: result.user_id, email });
        } else if (result.data?.token && result.data?.user) {
          // Standard format: { success: true, data: { token, user } }
          tokenManager.setToken(result.data.token);
          tokenManager.setUser(result.data.user);
        }
        
        // Show success message
        setSuccess(result.message || "2FA code sent to your email");
        
        // Show development 2FA code in console only
        if (result.dev_2fa_token) {
          console.log('🔓 Development 2FA Code:', result.dev_2fa_token);
          console.log('📝 Use this code for 2FA verification:', result.dev_2fa_token);
          // Store in localStorage for verification page
          localStorage.setItem('dev_2fa_code', result.dev_2fa_token);
        }
        
        // Redirect to 2FA verification quickly
        setTimeout(() => {
          console.log('Redirecting to 2FA page');
          router.push("/login/verify-2fa");
        }, 2000);
      } else {
        console.log('Login failed:', result);
        setError(result.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // More specific error messages
      if (error.message.includes('fetch')) {
        setError("Network error: Cannot connect to server. Please check if the backend is running on port 3000.");
      } else if (error.message.includes('Failed to fetch')) {
        setError("Network error: Unable to reach the server. Please check your internet connection and try again.");
      } else if (error.message.includes('CORS')) {
        setError("Network error: CORS issue. Please check server configuration.");
      } else {
        setError(`Network error: ${error.message}. Please try again.`);
      }
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

          <Logo textMain="text-white" />


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

   
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SafeLearn</span>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
              <p className="text-gray-600 text-sm mt-1">Sign in to your account to continue learning</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {success}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="olivier@gmail.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <Link href="/login/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-200 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in to SafeLearn"
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-500">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Backend API: <a href="http://localhost:3000/api-docs" target="_blank" className="text-blue-600 hover:underline">Swagger Docs</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}