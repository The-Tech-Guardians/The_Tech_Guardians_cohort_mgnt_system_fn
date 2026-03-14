export default function FeatureChip({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-[12.5px] font-medium text-slate-600">
      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      {text}
    </div>
  );
}