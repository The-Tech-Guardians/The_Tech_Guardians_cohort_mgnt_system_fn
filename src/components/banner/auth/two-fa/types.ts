export type OtpStatus = "idle" | "loading" | "success" | "error";
import { Lock, Mail, MessageCircle } from "lucide-react";

export type TwoFAMethod = "email" | "sms" | "app";

export type TwoFAStep = "method" | "otp";

export interface MethodInfo {
  id: TwoFAMethod;
  label: string;
  icon: string | React.ComponentType<{ className?: string }>;
  sub: string;
  otpSubtitle: string;
}

export const METHODS: MethodInfo[] = [
  {
    id: "email",
    label: "Email",
    icon: Mail,
    sub: "Receive code via email",
    otpSubtitle: "We sent a 6-digit code to your email address.",
  },
  {
    id: "sms",
    label: "SMS",
    icon:  MessageCircle,
    sub: "Receive code via text message",
    otpSubtitle: "We sent a 6-digit code to your phone number.",
  },
  {
    id: "app",
    label: "Authenticator App",
    icon: Lock,
    sub: "Use your authenticator app",
    otpSubtitle: "Enter the 6-digit code from your authenticator app.",
  },
];
