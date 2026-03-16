import { FC } from "react";

interface LogoProps {
  textMain: string;
}

const Logo: FC<LogoProps> = ({ textMain }) => {
  return (
    <div className="flex items-center gap-3 cursor-pointer flex-shrink-0 group">
      <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-[0_2px_12px_rgba(14,165,233,0.3)] overflow-hidden flex-shrink-0 group-hover:shadow-[0_4px_18px_rgba(14,165,233,0.45)] transition-shadow duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        <svg viewBox="0 0 38 38" width="21" height="21" fill="none">
          <circle cx="12" cy="11" r="5" fill="rgba(255,255,255,0.9)" />
          <circle cx="26" cy="11" r="5" fill="rgba(255,255,255,0.7)" />
          <circle cx="19" cy="7" r="4" fill="rgba(255,255,255,0.55)" />
          <path d="M3 26 Q19 17 35 26" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M5 31 Q19 23 33 31" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className={`font-brand text-[20px] ${textMain} tracking-tight`}>CohortLMS</span>
        <span className="text-[9.5px] font-semibold tracking-[0.14em] uppercase text-cyan-500 mt-[3px]">Learning Platform</span>
      </div>
    </div>
  );
};

export default Logo;

