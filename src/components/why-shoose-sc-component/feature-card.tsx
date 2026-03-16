
export function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  return (
    <div
      className={`group relative bg-white rounded-2xl border ${feature.border} p-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Tag */}
      <span className={`inline-block text-[10.5px] font-semibold uppercase tracking-[0.12em] ${feature.accent} mb-4`}>
        {feature.tag}
      </span>

      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-4 shadow-md group-hover:scale-105 transition-transform duration-300`}>
        {feature.emoji}
      </div>

      {/* Title + desc */}
      <h3 className="text-[16px] font-bold text-slate-800 mb-2 leading-snug">{feature.title}</h3>
      <p className="text-[13.5px] text-slate-500 leading-relaxed mb-5">{feature.desc}</p>

      {/* Stat chip */}
      <div className={`flex items-center gap-2 ${feature.bg} rounded-lg px-3 py-2 border ${feature.border}`}>
        <span className="text-base leading-none">{feature.statIcon}</span>
        <span className={`text-[12px] font-semibold ${feature.accent}`}>{feature.stat}</span>
      </div>

      {/* Hover accent line */}
      <div className={`absolute bottom-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </div>
  );
}