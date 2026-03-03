export default function StatCard({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)] px-5 py-4">
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-xl">
        {icon}
      </div>
      <div>
        <p className="text-[18px] font-bold text-slate-800 leading-tight">{value}</p>
        <p className="text-[11.5px] text-slate-500 font-medium leading-tight">{label}</p>
      </div>
    </div>
  );
}