// components/ui/BackButton.tsx
// A small ghost back-button. Pass href for a <Link> or onClick for a button.

import Link from "next/link";

interface BackButtonProps {
  href?: string;
  onClick?: () => void;
  label?: string;
}

export default function BackButton({
  href,
  onClick,
  label = "Back",
}: BackButtonProps) {
  const inner = (
    <>
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </>
  );

  const base =
    "flex items-center gap-2 text-sm text-gray-500 hover:text-[#4F46E5] transition font-medium mb-6";

  if (href) {
    return (
      <Link href={href} className={base}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={base}>
      {inner}
    </button>
  );
}