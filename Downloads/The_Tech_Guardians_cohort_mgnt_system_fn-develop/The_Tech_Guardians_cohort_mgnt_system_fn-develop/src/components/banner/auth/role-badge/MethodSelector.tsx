"use client";

import Button from "@/components/ui/Button";
import { METHODS, TwoFAMethod } from "../two-fa/types";

interface MethodSelectorProps {
  selected: TwoFAMethod;
  onSelect: (method: TwoFAMethod) => void;
  onContinue: () => void;
}

export default function MethodSelector({
  selected,
  onSelect,
  onContinue,
}: MethodSelectorProps) {
  return (
    <>
      <h1 className="text-xl font-extrabold text-[#111827] mb-1">
        Verify your identity
      </h1>
      <p className="text-sm text-gray-500 mb-5">
        Choose how you&apos;d like to receive your verification code.
      </p>

      <div className="space-y-2.5 mb-6" role="radiogroup" aria-label="2FA method">
        {METHODS.map((m) => {
          const isSelected = selected === m.id;
          const IconComponent = m.icon;
          
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(m.id)}
              className={`w-full flex items-center gap-3 border-2 rounded-2xl px-4 py-3.5 transition-all text-left ${
                isSelected
                  ? "border-[#4F46E5] bg-indigo-50"
                  : "border-gray-200 hover:border-indigo-200 hover:bg-gray-50"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-lg flex-shrink-0">
                {typeof IconComponent === 'string' ? (
                  IconComponent
                ) : (
                  <IconComponent className="w-5 h-5 text-indigo-600" />
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-[#111827]">{m.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{m.sub}</p>
              </div>

              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  isSelected ? "bg-[#4F46E5]" : "bg-gray-200"
                }`}
              >
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>

      <Button onClick={onContinue}>
        Continue with verification
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </>
  );
}
