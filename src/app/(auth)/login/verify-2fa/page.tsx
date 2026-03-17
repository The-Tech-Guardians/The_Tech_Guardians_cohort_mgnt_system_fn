"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import AuthPanel from "@/components/ui/AuthPanel";
import AuthCard from "@/components/ui/AuthCard";
import AuthFooter from "@/components/ui/AuthFooter";
import BackButton from "@/components/ui/BackButton";
import TwoFAPanel from "@/components/banner/auth/TwoFAStep/TwoFAPanel";
import UserPill from "@/components/banner/auth/audit-note/UserPill";

import OtpVerifyForm from "@/components/banner/auth/Continue-button/OtpVerifyForm";
import { OtpStatus, TwoFAMethod, METHODS } from "@/components/banner/auth/two-fa/types";
import { authAPI, tokenManager } from "@/lib/auth";
import { QRCodeSVG } from "qrcode.react";

const OTP_DURATION = 30;

export default function TwoFAPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<TwoFAMethod>("email");
  const [methodSelected, setMethodSelected] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [tempSecret, setTempSecret] = useState('');
  const [setupMode, setSetupMode] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpStatus, setOtpStatus] = useState<OtpStatus>("idle");
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize user from token, redirect if missing
  useEffect(() => {
    const userData = tokenManager.getUser();
    const roleFromToken = tokenManager.getRoleFromToken();
    if (!userData?.email || !roleFromToken) {
      router.push("/login");
      return;
    }

    const displayName =
      (userData?.firstName || userData?.lastName)
        ? `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
        : userData.email.split("@")[0];

    const initials = displayName
      .split(" ")
      .filter(Boolean)
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "U";

    const roleLabel =
      roleFromToken === "ADMIN"
        ? "Admin"
        : roleFromToken === "INSTRUCTOR"
        ? "Instructor"
        : "Learner";

    setUser({
      initials,
      name: displayName,
      email: userData.email,
      role: roleLabel,
    });
  }, [router]);

  // Timer logic
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // OTP input changes
  const handleOtpChange = (value: string[], autoSubmit: boolean) => {
    setOtp(value);
    setOtpStatus("idle");
    if (autoSubmit) setTimeout(() => verifyOTP(value.join("")), 150);
  };

  // Verify OTP
  const verifyOTP = async (code: string) => {
    const userId = tokenManager.getUserIdFromToken();
    if (!userId) {
      setOtpStatus("error");
      return;
    }
    setOtpStatus("loading");

    try {
      const response = await authAPI.verify2FA(userId, selectedMethod, code, tempSecret || undefined);
      if (response.success) {
        setOtpStatus("success");
        clearInterval(timerRef.current!);

        const token = response.token || response.data?.token;
        const userObj = (response as any).user || response.data?.user;

        if (token) tokenManager.setToken(token);
        if (userObj) tokenManager.setUser(userObj);

        // Determine redirect based on role
        let finalRedirect = tokenManager.getRedirectPath();
        
        // Override with URL param if present
        const urlParams = new URLSearchParams(window.location.search);
        const redirectParam = urlParams.get("redirect");
        if (redirectParam && redirectParam !== '/' && redirectParam !== '/login') {
          finalRedirect = redirectParam;
        }
        
        console.log('[2FA SUCCESS] Redirecting to:', finalRedirect);
        
        tokenManager.refreshUser().then(() => {
          setTimeout(() => router.push(finalRedirect), 500);
        }).catch(() => {
          setTimeout(() => router.push(finalRedirect), 500);
        });
      } else {
        setOtpStatus("error");
        setTimeout(() => setOtpStatus("idle"), 800);
      }
    } catch (error) {
      console.error("2FA verification failed:", error);
      setOtpStatus("error");
      setTimeout(() => setOtpStatus("idle"), 800);
    }
  };

  // Change 2FA Method
  const handleMethodChange = async () => {
    const userId = tokenManager.getUserIdFromToken();
    if (!userId) {
      setOtpStatus("error");
      return;
    }

    setOtpStatus("loading");

    try {
      const response = await authAPI.select2FAMethod(userId, selectedMethod);
      if (response.success) {
        setQrDataUrl(response.qrDataUrl || '');
        setTempSecret(response.secret || '');
        setSetupMode(response.setupMode || false);
        setMethodSelected(true);
        setOtpStatus("idle");
        setOtp(Array(6).fill(""));
        setTimeLeft(OTP_DURATION);
        setCanResend(false);
        startTimer();
      } else {
        setOtpStatus("error");
        setTimeout(() => setOtpStatus("idle"), 2000);
      }
    } catch (error) {
      console.error("Method change failed:", error);
      setOtpStatus("error");
      setTimeout(() => setOtpStatus("idle"), 2000);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    const userId = tokenManager.getUserIdFromToken();
    if (!userId) {
      setOtpStatus("error");
      return;
    }

    setOtpStatus("loading");
    try {
      const response = await authAPI.resend2FA(userId, selectedMethod);
      if (response.success) {
        setOtp(Array(6).fill(""));
        setOtpStatus("idle");
        setTimeLeft(OTP_DURATION);
        setCanResend(false);
        startTimer();
      } else {
        setOtpStatus("error");
        setTimeout(() => setOtpStatus("idle"), 2000);
      }
    } catch (error) {
      console.error("Resend failed:", error);
      setOtpStatus("error");
      setTimeout(() => setOtpStatus("idle"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <AuthPanel footerNote="© 2026 CohortLMS. Secured Platform.">
        <TwoFAPanel />
      </AuthPanel>

      <div className="flex-1 bg-[#F9FAFB] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          <AuthCard>
              <BackButton href="/login" label="Back to login" />
              {user && <UserPill {...user} />}
              
              {!methodSelected ? (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Choose your 2FA method</h2>
                  <div className="grid grid-cols-1 gap-3">
                    {METHODS.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => {
                          setSelectedMethod(method.id as TwoFAMethod);
                          handleMethodChange();
                        }}
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 bg-white"
                      >
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                          {method.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold text-gray-900 text-base">{method.label}</h3>
                          <p className="text-sm text-gray-500">{method.sub}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {qrDataUrl && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 mb-4 text-center">
                      <p className="text-sm font-medium text-blue-900 mb-2">Authenticator App Setup</p>
                      <div className="flex justify-center mb-2">
                        <QRCodeSVG value={qrDataUrl} size={160} />
                      </div>
                      <p className="text-xs text-blue-700">Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)</p>
                    </div>
                  )}
                  <OtpVerifyForm
                    method={selectedMethod}
                    otp={otp}
                    status={otpStatus}
                    timeLeft={timeLeft}
                    canResend={canResend}
                    onOtpChange={handleOtpChange}
                    onVerify={() => verifyOTP(otp.join(""))}
                    onResend={handleResend}
                    onChangeMethod={handleMethodChange}
                  />
                </>
              )}
          </AuthCard>
          <AuthFooter />
        </div>
      </div>
    </div>
  );
}
