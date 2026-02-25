"use client";

import { useState } from "react";
import Notice from "@/components/Notice";
import Button from "@/components/ui/Button";


interface EmailSentStepProps {
  sentEmail: string;
  onOpenLink: () => void; 
  onBack: () => void;     
}

export default function EmailSentStep({ sentEmail, onOpenLink, onBack }: EmailSentStepProps) {
  const [resent, setResent] = useState(false);

  const handleResend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <>
      <div className="text-center py-2 mb-5">
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
          📬
        </div>
        <h1 className="text-xl font-extrabold text-[#111827] mb-2">
          Check your inbox
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          We&apos;ve sent a reset link to
          <br />
          <strong className="text-[#111827]">{sentEmail}</strong>
        </p>
      </div>

      <Notice variant="indigo" className="mb-5">
        This link expires in <strong>15 minutes</strong>. Check your spam
        folder if you don&apos;t see it.
      </Notice>

      <Button onClick={onOpenLink} className="mb-3">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        Simulate: open reset link
      </Button>

      <div className="text-center mb-4">
        <span className="text-xs text-gray-400">Didn&apos;t receive it? </span>
        <button
          type="button"
          onClick={handleResend}
          className={`text-xs font-bold transition ${
            resent ? "text-green-600" : "text-[#4F46E5] hover:underline"
          }`}
        >
          {resent ? "Sent! ✓" : "Resend email"}
        </button>
      </div>

      <div className="flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-gray-100" />
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <button
        type="button"
        onClick={onBack}
        className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-[#4F46E5] transition mt-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Use a different email
      </button>
    </>
  );
}