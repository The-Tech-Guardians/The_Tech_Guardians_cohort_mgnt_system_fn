import Link from "next/link";


interface AuthButtonsProps {
  textMuted: string;
  inputBorder: string;
  isDark: boolean;
}

export default function AuthButtons({ textMuted, inputBorder, isDark }: AuthButtonsProps) {
  return (
    <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
      <div className={`w-px h-5 ${isDark ? "bg-slate-700" : "bg-slate-200"} mr-1`} />
      <Link href="/register">
        <button className={`text-sm font-medium ${textMuted} px-4 py-2 rounded-lg border ${inputBorder} transition-all duration-200`}>
          Sign Up
        </button>
      </Link>
      <Link href="/login">
        <button className="relative text-sm font-semibold text-white px-5 py-2 rounded-lg bg-blue-600 overflow-hidden">
          <span className="absolute inset-0 bg-gradient-to-br from-white/[0.12] to-transparent" />
          <span className="relative">Log In →</span>
        </button>
      </Link>
     
    </div>
  );
}
