export default function DateRow({ icon, label, value, highlight }) {
  return (
    <div className={`flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0 ${highlight ? "text-blue-600" : ""}`}>
      <div className="flex items-center gap-2 text-[12px] text-slate-500">
        <span>{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      <span className={`text-[12px] font-semibold ${highlight ? "text-blue-600" : "text-slate-700"}`}>{value}</span>
    </div>
  );
}