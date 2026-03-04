import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
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
  loading = false,
  loadingText,
  children,
  disabled,
  className = "",
  ...rest
}: ButtonProps) {
  const base =
    "w-full flex items-center justify-center gap-2 font-bold text-sm py-3.5 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-lg shadow-indigo-500/25",
    outline:
      "border-2 border-[#4F46E5] text-[#4F46E5] hover:bg-indigo-50 bg-transparent",
    ghost:
      "text-gray-500 hover:text-[#4F46E5] bg-transparent border-none shadow-none",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </button>
  );
}