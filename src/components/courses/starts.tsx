export function Stars({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-[11px] text-slate-400">No ratings yet</span>;
  return (
    <div className="flex items-center gap-1">
      <span className="text-amber-400 text-xs">{"★".repeat(Math.floor(rating))}</span>
      <span className="text-[12px] font-bold text-slate-700">{rating}</span>
    </div>
  );
}