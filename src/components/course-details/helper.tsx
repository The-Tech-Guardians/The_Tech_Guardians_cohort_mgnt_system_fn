export function Stars({ rating, reviews, size = "sm" }: { rating: number; reviews: number; size?: string }) {
  const full = Math.floor(rating);
  const sz   = size === "lg" ? "text-lg" : "text-sm";
  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-amber-400 ${sz} leading-none`}>{"★".repeat(full)}{"☆".repeat(5 - full)}</span>
      <span className={`font-bold text-slate-800 ${size === "lg" ? "text-base" : "text-[13px]"}`}>{rating}</span>
      {reviews > 0 && <span className="text-slate-400 text-[12px]">({reviews} reviews)</span>}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[22px] font-black text-slate-900 mb-5 tracking-tight">{children}</h2>;
}