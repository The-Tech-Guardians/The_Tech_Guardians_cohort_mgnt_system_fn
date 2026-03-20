import { ExternalLink, Handshake } from "lucide-react";
import Link from "next/link";

const partners = [
  {
    id: 1,
    name: "Mama Hope",
    initials: "MH",
    tagline: "Community-Centered Impact",
    description:
      "A nonprofit that partners with communities to shift power and resources to locally-led solutions in East Africa.",
    gradientFrom: "from-orange-400",
    gradientTo: "to-rose-400",
    textColor: "text-orange-600",
    bgLight: "bg-orange-50",
    borderHover: "hover:border-orange-300",
  },
  {
    id: 2,
    name: "Emerging Leaders of East Africa",
    initials: "ELEA",
    tagline: "Youth Leadership & Development",
    description:
      "An organization dedicated to identifying and developing the next generation of changemakers across East Africa.",
    gradientFrom: "from-blue-500",
    gradientTo: "to-cyan-400",
    textColor: "text-blue-600",
    bgLight: "bg-blue-50",
    borderHover: "hover:border-blue-300",
  },
];







// ── Partner Card ──────────────────────────────────────────────────────────────

function PartnerCard({ p }) {
  return (
    <div
      className={`flex-1 group border border-gray-200 ${p.borderHover} rounded-2xl bg-white overflow-hidden transition-all duration-300 hover:shadow-lg`}
    >
      {/* Logo area */}
      <div
        className={`relative w-full h-32 bg-gradient-to-br ${p.gradientFrom} ${p.gradientTo} flex items-center justify-center overflow-hidden`}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 left-4 w-16 h-16 rounded-full bg-white" />
          <div className="absolute bottom-2 right-4 w-10 h-10 rounded-full bg-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white" />
        </div>

        {/* Initials */}
        <span className="relative z-10 text-white text-3xl font-extrabold tracking-tight drop-shadow">
          {p.initials}
        </span>

        {/* Placeholder badge */}
        <span className="absolute top-2 right-2 text-[10px] text-white/70 border border-white/30 rounded-full px-2 py-0.5 backdrop-blur-sm bg-black/10">
          Logo placeholder
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-sm font-bold text-gray-900 leading-snug">{p.name}</p>
          <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400 transition-colors shrink-0 mt-0.5" />
        </div>
        <p className={`text-xs font-semibold ${p.textColor} mb-2`}>{p.tagline}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{p.description}</p>
      </div>
    </div>
  );
}

// ── Partners Section ──────────────────────────────────────────────────────────

export function PartnersSection() {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <p className="text-xs font-bold tracking-widest text-blue-500 uppercase">
          Our Partners
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Organizations that believe in this work
        </h2>
        <p className="text-xs text-gray-400">
          High-resolution logos will replace these placeholders soon.
        </p>
      </div>

      {/* Partner cards */}
      <div className="flex flex-col sm:flex-row gap-4">
        {partners.map((p) => (
          <PartnerCard key={p.id} p={p} />
        ))}
      </div>

      {/* Bottom note */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
        <Handshake className="w-4 h-4 text-gray-300" />
        <span>
          Want to partner with us?{" "}
          <Link href="/contact" className="text-blue-500 font-medium hover:underline">
            Let&apos;s talk →
          </Link>
        </span>
      </div>
    </section>
  );
}