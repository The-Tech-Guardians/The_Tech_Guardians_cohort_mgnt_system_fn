// components/auth/forgot-password/ForgotPasswordPanel.tsx
// Left panel for the Forgot Password flow.
// Renders the animated step tracker that updates as the user progresses.

import { FPStep, STEPS } from "./types";

interface ForgotPasswordPanelProps {
  /** Current active step (1 | 2 | 3). Steps below this are shown as complete. */
  currentStep: FPStep;
}

export default function ForgotPasswordPanel({ currentStep }: ForgotPasswordPanelProps) {
  const dotStyle = (n: FPStep) => {
    if (n < currentStep)
      return "bg-green-500 text-white";
    if (n === currentStep)
      return "bg-[#4F46E5] text-white";
    return "bg-white/10 text-white/40";
  };

  const labelStyle = (n: FPStep) =>
    n <= currentStep ? "text-white" : "text-white/40";

  return (
    <div className="space-y-8">
     
      <div>
        <div className="w-12 h-1 bg-[#4F46E5] rounded-full mb-4" />
        <h2 className="text-[34px] font-extrabold text-white leading-tight mb-3">
          Password<br />
          <span className="text-indigo-400">Recovery</span>
        </h2>
        <p className="text-white/45 text-sm max-w-[260px] leading-relaxed">
          Secure, step-by-step password reset. We&apos;ll verify your identity
          before allowing any changes.
        </p>
      </div>

      {/* Step indicators */}
      <ol className="space-y-0" aria-label="Password reset steps">
        {STEPS.map((step, idx) => (
          <li key={step.n} className="flex gap-3.5 items-start">
            <div className="flex flex-col items-center">
              {/* Dot */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 transition-all duration-300 ${dotStyle(step.n)}`}
                aria-current={step.n === currentStep ? "step" : undefined}
              >
                {step.n < currentStep ? "✓" : step.n}
              </div>
              {/* Connector line */}
              {idx < STEPS.length - 1 && (
                <div className="w-0.5 h-9 bg-white/10 my-1" />
              )}
            </div>

            <div className="pt-1">
              <p className={`text-sm font-semibold transition-colors duration-300 ${labelStyle(step.n)}`}>
                {step.title}
              </p>
              <p className="text-white/25 text-xs mt-0.5">{step.sub}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Security note */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <p className="text-white/35 text-xs leading-relaxed">
          🔒 Reset links expire after{" "}
          <strong className="text-white/55">15 minutes</strong>. For Admins &
          Instructors, 2FA will still be required after reset.
        </p>
      </div>
    </div>
  );
}