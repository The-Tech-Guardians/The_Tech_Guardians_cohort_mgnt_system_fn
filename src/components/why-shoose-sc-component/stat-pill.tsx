export default function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-black  tracking-tight leading-none">{value}</p>
      <p className="text-[12px] text-slate-500 font-medium mt-1">{label}</p>
    </div>
  );
}