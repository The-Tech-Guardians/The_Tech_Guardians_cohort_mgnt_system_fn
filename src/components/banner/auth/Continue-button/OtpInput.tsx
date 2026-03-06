// components/auth/two-fa/OtpInput.tsx
// Renders six individual digit inputs split into two groups of three (XXX–XXX).
// Auto-advances focus, handles Backspace and Arrow keys.

"use client";

import { useRef } from "react";
import { OtpStatus } from "../two-fa/types";

interface OtpInputProps {
  value: string[];               // array of 6 single-char strings
  status: OtpStatus;
  onChange: (value: string[], autoSubmit: boolean) => void;
}

export default function OtpInput({ value, status, onChange }: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (char: string, idx: number) => {
    if (!/^[0-9]?$/.test(char)) return;
    const next = [...value];
    next[idx] = char;
    const shouldAutoSubmit = next.every((v) => v) && next.join("").length === 6;
    onChange(next, shouldAutoSubmit);
    if (char && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      const next = [...value];
      next[idx - 1] = "";
      onChange(next, false);
      refs.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowLeft"  && idx > 0) refs.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < 5) refs.current[idx + 1]?.focus();
  };

  const cellClass = (idx: number) => {
    const base =
      "w-12 h-14 text-center text-xl font-extrabold border-2 rounded-2xl outline-none transition-all focus:border-[#4F46E5] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.12)]";
    if (status === "error")
      return `${base} border-red-400 bg-red-50 text-red-500`;
    if (value[idx])
      return `${base} border-[#4F46E5] bg-indigo-50 text-[#4F46E5]`;
    return `${base} border-gray-200 text-[#111827]`;
  };

  return (
    <div className="flex gap-2 justify-center" role="group" aria-label="One-time passcode">
      {/* First triplet */}
      {[0, 1, 2].map((i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          className={cellClass(i)}
          maxLength={1}
          inputMode="numeric"
          pattern="[0-9]"
          value={value[i]}
          aria-label={`Digit ${i + 1}`}
          disabled={status === "loading" || status === "success"}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
        />
      ))}

      {/* Separator */}
      <div className="flex items-center text-gray-300 font-bold text-xl px-0.5" aria-hidden="true">
        –
      </div>

      {/* Second triplet */}
      {[3, 4, 5].map((i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          className={cellClass(i)}
          maxLength={1}
          inputMode="numeric"
          pattern="[0-9]"
          value={value[i]}
          aria-label={`Digit ${i + 1}`}
          disabled={status === "loading" || status === "success"}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
        />
      ))}
    </div>
  );
}