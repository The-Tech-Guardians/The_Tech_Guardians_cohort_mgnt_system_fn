// components/banner/auth/verify-resend-success/forgot-password/types.ts

export type FPStep = 1 | 2 | 3;

export interface StepInfo {
  n: FPStep;
  title: string;
  sub: string;
}

export const STEPS: StepInfo[] = [
  { n: 1, title: "Verify Email", sub: "Confirm your account" },
  { n: 2, title: "Reset Code", sub: "Enter verification code" },
  { n: 3, title: "New Password", sub: "Set a secure password" },
];
