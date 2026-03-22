// app/about/page.jsx  (or pages/about.jsx for Pages Router)
// Requires: Tailwind CSS + lucide-react

import {
  Target,
  Eye,
  BarChart3,
  Users,
  Lightbulb,
  Globe,
  ArrowRight,
  Sparkles,
  BookOpen,
  Rocket,
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const pillars = [
  {
    icon: <BookOpen className="w-5 h-5 text-blue-500" />,
    label: "Open-Source Knowledge",
    description:
      "We use freely available tools, frameworks, and communities to ensure no learner is gated by cost.",
  },
  {
    icon: <Users className="w-5 h-5 text-blue-500" />,
    label: "Cross-Disciplinary Teams",
    description:
      "Every cohort is designed to mix backgrounds — tech, business, design — into a single founding unit.",
  },
  {
    icon: <Lightbulb className="w-5 h-5 text-blue-500" />,
    label: "Entrepreneurship from Scratch",
    description:
      "We don't wait for experience. We experiment with turning raw curiosity into real product thinking.",
  },
  {
    icon: <Globe className="w-5 h-5 text-blue-500" />,
    label: "Built for Africa",
    description:
      "Our framework is shaped around the realities of African markets — lean, resourceful, and community-first.",
  },
];

const impactPlaceholders = [
  { value: "Cohort 1", label: "In Progress", note: "Results coming soon" },
  { value: "—", label: "Jobs Created", note: "Tracked post-cohort" },
  { value: "—", label: "Teams Formed", note: "Tracked post-cohort" },
  { value: "—", label: "Solutions Launched", note: "Tracked post-cohort" },
];

// ── Components ────────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-2">
      {children}
    </p>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 leading-snug">
      {children}
    </h2>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`border border-gray-200 rounded-xl bg-white p-6 ${className}`}>
      {children}
    </div>
  );
}

function PillarCard({ icon, label, description }) {
  return (
    <div className="flex flex-col gap-3 border border-gray-200 rounded-xl p-5 bg-white hover:border-blue-300 hover:shadow-sm transition-all">
      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-1">{label}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function ImpactStat({ value, label, note }) {
  return (
    <div className="flex flex-col items-center text-center border border-gray-200 rounded-xl p-5 bg-white">
      <span className="text-2xl font-bold text-blue-600 mb-1">{value}</span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-xs text-gray-400 mt-1">{note}</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AboutUs() {
  return (
    <div className="min-h-screen  py-8 sm:py-12 px-4">
      <div className="max-w-7xl pt-36 mx-auto space-y-10">

        {/* ── HERO ── */}
        <div className="border border-gray-200 rounded-xl p-6 sm:p-8 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Safe Education Platform
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-4">
            We are experimenting with the art of{" "}
            <span className="text-blue-600">creating entrepreneurs from scratch.</span>
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            Safe Education Platform is not a traditional learning management system.
            It is a live experiment — one that asks: can open-source knowledge,
            the right framework, and a motivated cohort of youth produce the next
            generation of African founders?
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/apply"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Apply to the Cohort
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#mission"
              className="inline-flex items-center justify-center gap-2 border border-gray-200 hover:border-blue-300 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Read Our Story
            </a>
          </div>
        </div>

        {/* ── MISSION ── */}
        <Card id="mission">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <SectionLabel>Our Mission</SectionLabel>
              <SectionTitle>Skilled people. Cross-disciplinary teams. New founders.</SectionTitle>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Our mission is to create skilled people who can form cross-disciplinary
                teams and become the new thinkers and founders of our region.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                We are experimenting with the art of creating entrepreneurs from scratch —
                using open-source knowledge in an economy that lacks traditional venture
                capital. We believe that the absence of funding is not the absence of
                opportunity. With the right skills and the right people around you,
                you can start building today.
              </p>
            </div>
          </div>
        </Card>

        {/* ── VISION ── */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <SectionLabel>Our Vision</SectionLabel>
              <SectionTitle>Where learning diverges into real-world startup teams.</SectionTitle>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                We are building a platform where learning doesn&apos;t stop at a
                certificate — it diverges into real startup teams. Our vision is
                to prove that with the right framework and regulations, youth can
                build solutions that matter for Africa.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Every cohort is a test of that belief. Not a classroom. A launchpad.
              </p>
            </div>
          </div>
        </Card>

        {/* ── PILLARS ── */}
        <div>
          <div className="text-center mb-5">
            <SectionLabel>What We Stand On</SectionLabel>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              The four pillars of our approach
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((p) => (
              <PillarCard key={p.label} {...p} />
            ))}
          </div>
        </div>

        {/* ── IMPACT ── */}
        <div>
          <div className="flex items-start gap-4 border border-gray-200 rounded-xl p-6 bg-white mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <SectionLabel>Our Impact</SectionLabel>
              <SectionTitle>We are just getting started.</SectionTitle>
              <p className="text-sm text-gray-600 leading-relaxed">
                Specific metrics on job creation and team formation will be published
                after Cohort 1 completes. We believe in transparent, honest reporting —
                no inflated numbers, no projections dressed as results. Come back here
                once the first cohort graduates, and you&apos;ll see exactly what was built.
              </p>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {impactPlaceholders.map((s) => (
              <ImpactStat key={s.label} {...s} />
            ))}
          </div>
        </div>

        {/* ── CTA FOOTER ── */}
        <div className="border border-blue-100 bg-blue-50 rounded-xl p-6 sm:p-8 text-center">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
            Be part of the first cohort.
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-5 max-w-sm mx-auto">
            If you&apos;re a student or fresh graduate who wants to build something
            that matters, this is your entry point.
          </p>
          <a
            href="/apply"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Apply Now
            <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-xs text-gray-400 mt-3">
            No experience required. Applications reviewed personally.
          </p>
        </div>

      </div>
    </div>
  );
}