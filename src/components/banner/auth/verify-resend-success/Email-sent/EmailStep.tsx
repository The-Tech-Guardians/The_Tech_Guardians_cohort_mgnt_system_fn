"use client";

import Link from "next/link";
import BackButton from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";


interface EmailStepProps {
  email: string;
  loading: boolean;
  onChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function EmailStep({ email, loading, onChange, onSubmit }: EmailStepProps) {
  return (
    <>
      <BackButton href="/login" label="Back to login" />

      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mb-4">
        🔑
      </div>
      <h1 className="text-2xl font-extrabold text-[#111827] mb-2">
        Forgot your password?
      </h1>
      <p className="text-sm text-gray-500 leading-relaxed mb-6">
        No worries. Enter your registered email address and we&apos;ll send you a
        secure reset link.
      </p>

      <form onSubmit={onSubmit} className="space-y-5">
        
        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            Email address
          </label>
          <div className="relative">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <input
              type="email"
              value={email}
              onChange={(e) => onChange(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border-[1.5px] border-gray-200 text-[#111827] text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#4F46E5] focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)] transition"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            We&apos;ll send instructions to this address if it&apos;s linked to an account.
          </p>
        </div>

        <Button type="submit" loading={loading} loadingText="Sending…">
          Send reset link
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </form>

     
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">Remember it now?</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>
      <Link
        href="/login"
        className="block w-full text-center text-sm font-bold text-[#4F46E5] border-2 border-[#4F46E5] rounded-xl py-3 hover:bg-indigo-50 transition"
      >
        Sign in instead
      </Link>
    </>
  );
}