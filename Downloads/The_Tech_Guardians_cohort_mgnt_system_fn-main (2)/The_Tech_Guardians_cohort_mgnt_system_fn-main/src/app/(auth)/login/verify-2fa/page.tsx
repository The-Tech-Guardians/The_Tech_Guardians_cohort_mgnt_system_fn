

"use client";

import { useState, useCallback, useEffect, useRef } from "react";

import AuthPanel    from "@/components/ui/AuthPanel";
import AuthCard     from "@/components/ui/AuthCard";
import AuthFooter   from "@/components/ui/AuthFooter";
import BackButton   from "@/components/ui/BackButton";
import TwoFAPanel from "@/components/banner/auth/TwoFAStep/TwoFAPanel";
import UserPill from "@/components/banner/auth/audit-note/UserPill";
import MethodSelector from "@/components/banner/auth/role-badge/MethodSelector";
import OtpVerifyForm from "@/components/banner/auth/Continue-button/OtpVerifyForm";
import { OtpStatus, TwoFAMethod, TwoFAStep } from "@/components/banner/auth/two-fa/types";



const DEMO_USER = {
  initials: "AK",
  name:     "Amara Kone",
  email:    "a.kone@cohortlms.io",
  role:     "Instructor" as const,
};

const OTP_DURATION = 30;

export default function TwoFAPage() {
  const [step,           setStep]           = useState<TwoFAStep>("method");
  const [selectedMethod, setSelectedMethod] = useState<TwoFAMethod>("app");
  const [otp,            setOtp]            = useState<string[]>(Array(6).fill(""));
  const [otpStatus,      setOtpStatus]      = useState<OtpStatus>("idle");
  const [timeLeft,       setTimeLeft]       = useState(OTP_DURATION);
  const [canResend,      setCanResend]      = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const verifyOTP = (code: string) => {
    setOtpStatus("loading");
    setTimeout(() => {
      if (code === "123456") { setOtpStatus("success"); clearInterval(timerRef.current!); }
      else { setOtpStatus("error"); setTimeout(() => setOtpStatus("idle"), 800); }
    }, 1200);
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
      <AuthPanel footerNote="© 2025 CohortLMS. Secured Platform.">
        <TwoFAPanel />
      </AuthPanel>

      <div className="flex-1 bg-[#F9FAFB] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          <AuthCard>
            {step === "method" ? (
              <>
                <BackButton href="/login" label="Back to login" />
                <UserPill {...DEMO_USER} />
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