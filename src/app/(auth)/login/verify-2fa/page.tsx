

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import AuthPanel    from "@/components/ui/AuthPanel";
import AuthCard     from "@/components/ui/AuthCard";
import AuthFooter   from "@/components/ui/AuthFooter";
import BackButton   from "@/components/ui/BackButton";
import TwoFAPanel from "@/components/banner/auth/TwoFAStep/TwoFAPanel";
import UserPill from "@/components/banner/auth/audit-note/UserPill";
import MethodSelector from "@/components/banner/auth/role-badge/MethodSelector";
import OtpVerifyForm from "@/components/banner/auth/Continue-button/OtpVerifyForm";
import { OtpStatus, TwoFAMethod, TwoFAStep } from "@/components/banner/auth/two-fa/types";
import { authAPI, tokenManager } from "@/lib/auth";

const OTP_DURATION = 30;

export default function TwoFAPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState<TwoFAStep>("method");
  const [selectedMethod, setSelectedMethod] = useState<TwoFAMethod>("app");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpStatus, setOtpStatus] = useState<OtpStatus>("idle");
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const userData = tokenManager.getUser();
    const userEmail = userData?.email;
    
    if (userEmail) {
      // Use actual user data from token manager
      setUser({
        initials: userData?.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U',
        name: userData?.name || 'User',
        email: userEmail,
        role: userData?.role || 'LEARNER' // Use actual role from backend
      });
    } else {
      router.push('/login');
    }
  }, [router]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); setCanResend(true); return 0; }
        return t - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleOtpChange = (value: string[], autoSubmit: boolean) => {
    setOtp(value);
    setOtpStatus("idle");
    if (autoSubmit) setTimeout(() => verifyOTP(value.join("")), 150);
  };

  const verifyOTP = async (code: string) => {
    if (!user?.email) return;
    
    setOtpStatus("loading");
    try {
      const response = await authAPI.verify2FA(user.email, code);
      console.log('2FA verification response:', response);
      
      if (response.success) {
        setOtpStatus("success");
        clearInterval(timerRef.current!);
        
        // Get user role from JWT token (most reliable source)
        const userRole = tokenManager.getRoleFromToken();
        console.log('User role from token:', userRole);
        
        // Redirect based on user role
        setTimeout(() => {
          switch (userRole) {
            case 'ADMIN':
              console.log('Redirecting to admin dashboard');
              router.push('/admin');
              break;
            case 'INSTRUCTOR':
              console.log('Redirecting to instructor dashboard');
              router.push('/instructor');
              break;
            case 'LEARNER':
              console.log('Redirecting to learner dashboard');
              router.push('/learner');
              break;
            default:
              console.log('Unknown role, redirecting to learner dashboard');
              router.push('/learner');
          }
        }, 1000);
      } else {
        setOtpStatus("error");
        setTimeout(() => setOtpStatus("idle"), 800);
      }
    } catch (error) {
      console.error('2FA verification failed:', error);
      setOtpStatus("error");
      setTimeout(() => setOtpStatus("idle"), 800);
    }
  };

  const handleResend = () => {
    setOtp(Array(6).fill(""));
    setOtpStatus("idle");
    setTimeLeft(OTP_DURATION);
    setCanResend(false);
    startTimer();
  };

  const goToMethodSelect = () => {
    setStep("method");
    setOtp(Array(6).fill(""));
    setOtpStatus("idle");
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <div className="min-h-screen flex bg-white">
      <AuthPanel footerNote={`© ${new Date().getFullYear()} CohortLMS. Secured Platform.`}>
        <TwoFAPanel />
      </AuthPanel>

      <div className="flex-1 bg-[#F9FAFB] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          <AuthCard>
            {step === "method" ? (
              <>
                <BackButton href="/login" label="Back to login" />
                {user && <UserPill {...user} />}
                <MethodSelector
                  selected={selectedMethod}
                  onSelect={setSelectedMethod}
                  onContinue={() => {
                    setStep("otp");
                    setTimeLeft(OTP_DURATION);
                    setCanResend(false);
                    startTimer();
                  }}
                />
              </>
            ) : (
              <OtpVerifyForm
                method={selectedMethod}
                otp={otp}
                status={otpStatus}
                timeLeft={timeLeft}
                canResend={canResend}
                onOtpChange={handleOtpChange}
                onVerify={() => verifyOTP(otp.join(""))}
                onResend={handleResend}
                onChangeMethod={goToMethodSelect}
              />
            )}
          </AuthCard>
          <AuthFooter />
        </div>
      </div>
    </div>
  );
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       