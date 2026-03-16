// components/auth/two-fa/types.ts

export type TwoFAMethod = "app" | "sms" | "email";
export type OtpStatus   = "idle" | "loading" | "error" | "success";
export type TwoFAStep   = "method" | "otp";

export interface MethodOption {
  id: TwoFAMethod;
  icon: string;
  label: string;
  sub: string;
  otpSubtitle: string;
}

export const METHODS: MethodOption[] = [
  {
    id: "app",
    icon: "📱",
    label: "Authenticator App",
    sub: "Google Authenticator, Authy, etc.",
    otpSubtitle: "Open your authenticator app and enter the 6-digit code.",
  },
  {
    id: "sms",
    icon: "💬",
    label: "SMS Code",
    sub: "Send to ·· ·· ·· 47",
    otpSubtitle: "We sent a 6-digit code to your phone ending in ··47.",
  },
  {
    id: "email",
    icon: "📧",
    label: "Email Code",
    sub: "Send to a.k***@cohortlms.io",
    otpSubtitle: "We sent a 6-digit code to your email address.",
  },
];