
"use client";

import Button from "@/components/ui/Button";
import CountdownRing from "./CountdownRing";
import OtpInput from "./OtpInput";
import { METHODS, OtpStatus, TwoFAMethod } from "../two-fa/types";

interface OtpVerifyFormProps {
  method: TwoFAMethod;
  otp: string[];
  status: OtpStatus;
  timeLeft: number;
  canResend: boolean;
  onOtpChange: (value: string[], autoSubmit: boolean) => void;
  onVerify: () => void;
  onResend: () => void;
  onChangeMethod: () => void;
}

function SuccessState() {
  return (
    <div className="text-center py-4">
      <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-base font-extrabold text-[#111827] mb-1">Verified successfully!</h3>
      <p className="text-xs text-gray-500">Redirecting to your dashboard…</p>
    </div>
  );
}

export default function OtpVerifyForm({
  method,
  otp,
  status,
  timeLeft,
  canResend,
  onOtpChange,
  onVerify,
  onResend,
  onChangeMethod,
}: OtpVerifyFormProps) {
  const methodMeta = METHODS.find((m) => m.id === method)!;
  const isFilled = otp.join("").length === 6;

  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div>
          <span className="inline-block bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-3 py-1 text-xs font-bold mb-2">
            {methodMeta.icon} {methodMeta.label}
          </span>
          <h1 className="text-xl font-extrabold text-[#111827] mb-1">Enter your code</h1>
          <p className="text-sm text-gray-500 max-w-[240px] leading-relaxed">
            {methodMeta.otpSubtitle}
          </p>
        </div>
        <CountdownRing timeLeft={timeLeft} />
      </div>

      {status === "success" ? (
        <SuccessState />
      ) : (
        <>
          {/* OTP digit inputs */}
          <OtpInput value={otp} status={status} onChange={onOtpChange} />

          {/* Error message */}
          <p
            className="text-center text-xs text-red-500 min-h-[20px] mt-2 mb-3"
            role="alert"
            aria-live="polite"
          >
            {status === "error" ? "Incorrect code. Please try again." : ""}
          </p>

          {/* Verify button */}
          <Button
            onClick={onVerify}
            disabled={!isFilled}
            loading={status === "loading"}
            loadingText="Verifying…"
          >
            Verify &amp; Sign In
          </Button>

          {/* Resend */}
          <div className="text-center mt-4">
            <span className="text-xs text-gray-400">Didn&apos;t get a code? </span>
            <button
              type="button"
              onClick={onResend}
              disabled={!canResend}
              className={`text-xs font-bold transition ${
                canResend
                  ? "text-[#4F46E5] hover:underline cursor-pointer"
                  : "text-gray-300 cursor-not-allowed"
              }`}
            >
              Resend code
            </button>
          </div>

        </>
      )}

      {status !== "success" && (
        <button
          type="button"
          onClick={onChangeMethod}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#4F46E5] transition mt-5 mx-auto"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Change method
        </button>
      )}
    </>
  );
}