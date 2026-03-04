export default function SeatsBar({ seats, seatsLeft, status }) {
  if (status === "completed") return null;
  const pct    = Math.round(((seats - seatsLeft) / seats) * 100);
  const urgent = seatsLeft <= 5 && seatsLeft > 0;
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[11.5px] text-slate-500 font-medium">
          {status === "upcoming" ? `${seats} seats total` : seatsLeft === 0 ? "Fully booked" : `${seatsLeft} seats left`}
        </span>
        <span className={`text-[11.5px] font-semibold ${urgent ? "text-rose-500" : "text-slate-400"}`}>{pct}% filled</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${pct >= 90 ? "bg-rose-400" : pct >= 70 ? "bg-amber-400" : "bg-emerald-400"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}