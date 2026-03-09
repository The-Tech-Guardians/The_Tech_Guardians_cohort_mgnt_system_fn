import { Star } from "lucide-react";

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={11} fill={s <= Math.round(rating) ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth={2} />
      ))}
    </span>
  );
}