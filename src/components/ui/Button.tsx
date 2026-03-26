// components/ui/Button.tsx
// Primary and Outline variants used across every auth form.

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "default";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  loadingText?: string;
}

function Spinner() {
  return (
    <svg
      className="w-4 h-4 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  loadingText,
  children,
  disabled,
  className = "",
  ...rest
}: ButtonProps) {
  const base = "flex items-center justify-center gap-2 font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizes = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-3.5 text-sm w-full",
    lg: "px-6 py-4 text-base w-full"
  };

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25",
    outline:
      "border-2 border-blue-600 text-blue-600 hover:bg-cyan-50 bg-transparent",
    ghost:
      "text-gray-500 hover:text-blue-600 bg-transparent border-none shadow-none",
    default:
      "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      {loading ? (
        <>
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export { Button };
