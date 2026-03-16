export default function Badge({ icon, text, accent = false }: { icon: React.ReactNode; text: string; accent?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1.5 rounded-full border
        ${accent
          ? "bg-blue-50 border-blue-200 text-blue-600"
          : "bg-emerald-50 border-emerald-200 text-emerald-700"
        }`}
    >
      <span>{icon}</span>
      {text}
    </span>
  );
}