export function AvatarStack({ count }: { count: number }) {
  const colors = ["bg-blue-400", "bg-cyan-400", "bg-indigo-400", "bg-violet-400"];
  const initials = ["FJ", "IB", "ON", "SA"];
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {initials.map((init, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full ${colors[i]} border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}
          >
            {init}
          </div>
        ))}
      </div>
      <p className="text-[12.5px] text-slate-500 font-medium">
        <span className="text-slate-700 font-semibold">+{count.toLocaleString()}</span> learners joined this month
      </p>
    </div>
  );
}