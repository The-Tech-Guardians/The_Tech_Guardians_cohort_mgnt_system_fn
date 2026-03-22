// components/TestimonialsSection.jsx
// Requires: Tailwind CSS + lucide-react

import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────

const testimonials = [
  {
    id: 1,
    name: "John Doe",
    role: "Cohort 1 Graduate",
    initials: "JD",
    avatarBg: "from-blue-500 to-blue-600",
    quote:
      "SafED completely changed how I approach problem-solving. I came to learn coding, but I left as part of a startup team. I didn't know that was even possible before this program.",
    stars: 5,
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Cohort 1 Graduate",
    initials: "JS",
    avatarBg: "from-emerald-500 to-emerald-600",
    quote:
      "In an economy with limited funding, SafED taught us how to leverage our skills and build something real together. The peer learning model is unlike anything I've experienced in formal education.",
    stars: 5,
  },
  {
    id: 3,
    name: "Amara Osei",
    role: "Cohort 1 Participant",
    initials: "AO",
    avatarBg: "from-violet-500 to-violet-600",
    quote:
      "What surprised me most was how fast I went from consumer to builder. SafED doesn't just teach you tools — it rewires how you see problems in your community. Every session felt like real progress.",
    stars: 5,
  },
  {
    id: 4,
    name: "David Mwangi",
    role: "Cohort 1 Participant",
    initials: "DM",
    avatarBg: "from-amber-500 to-amber-600",
    quote:
      "Before SafED, I thought entrepreneurship was only for people with money or connections. This program showed me it starts with skills, curiosity, and the right team around you.",
    stars: 5,
  },
  {
    id: 5,
    name: "Priya Nakamura",
    role: "Cohort 1 Graduate",
    initials: "PN",
    avatarBg: "from-rose-500 to-rose-600",
    quote:
      "SafED gave me language for things I always felt but couldn't articulate — community-driven design, lean entrepreneurship, cross-functional teams. It changed how I see my own potential.",
    stars: 5,
  },
];

const AUTOPLAY_MS = 5000;

// ── StarRow ───────────────────────────────────────────────────────────────────

export function StarRow({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

// ── ProgressBar ───────────────────────────────────────────────────────────────

function ProgressBar({ active, total, duration }) {
  return (
    <div className="flex gap-1.5 items-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="relative h-1 rounded-full overflow-hidden bg-gray-200 flex-1"
        >
          {i === active && (
            <div
              className="absolute inset-y-0 left-0 bg-blue-500 rounded-full"
              style={{ animation: `fillBar ${duration}ms linear forwards` }}
            />
          )}
          {i < active && (
            <div className="absolute inset-0 bg-blue-500 rounded-full" />
          )}
        </div>
      ))}
    </div>
  );
}

// ── TestimonialCard ───────────────────────────────────────────────────────────
// position: -1 (prev peek), 0 (active center), 1 (next peek), other (hidden)

function TestimonialCard({ t, position, onClick }) {
  const isCenter = position === 0;
  const isPeek = position === -1 || position === 1;

  const transform = isCenter
    ? "translateX(0%) scale(1)"
    : position === -1
    ? "translateX(-78%) scale(0.88)"
    : position === 1
    ? "translateX(78%) scale(0.88)"
    : position < -1
    ? "translateX(-150%) scale(0.75)"
    : "translateX(150%) scale(0.75)";

  return (
    <div
      onClick={isPeek ? onClick : undefined}
      style={{
        transform,
        opacity: isCenter ? 1 : isPeek ? 0.45 : 0,
        zIndex: isCenter ? 10 : isPeek ? 5 : 0,
        filter: isPeek ? "blur(1px)" : "blur(0px)",
        transition: "all 0.55s cubic-bezier(0.34, 1.2, 0.64, 1)",
        cursor: isPeek ? "pointer" : "default",
        position: "absolute",
        width: "100%",
        top: 0,
        // hide cards that are fully offscreen from pointer events
        pointerEvents: isCenter || isPeek ? "auto" : "none",
      }}
    >
      <div
        className={`border rounded-2xl bg-white p-6 sm:p-8 flex flex-col gap-5 shadow-sm ${
          isCenter ? "border-gray-200 shadow-lg" : "border-gray-100"
        }`}
      >
        {/* Quote icon + stars */}
        <div className="flex items-start justify-between">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${t.avatarBg}`}
          >
            <Quote className="w-5 h-5 text-white" />
          </div>
          <StarRow count={t.stars} />
        </div>

        {/* Quote text */}
        <p className="text-sm sm:text-[15px] text-gray-700 leading-relaxed">
          &ldquo;{t.quote}&rdquo;
        </p>

        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* Author row */}
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.avatarBg} flex items-center justify-center shrink-0`}
          >
            <span className="text-white text-xs font-bold tracking-wide">
              {t.initials}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{t.name}</p>
            <p className="text-xs text-gray-400">{t.role}</p>
          </div>
          {isCenter && (
            <span className="text-[10px] text-gray-300 border border-dashed border-gray-200 rounded-full px-2 py-0.5 shrink-0">
              Dummy
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── TestimonialsSection ───────────────────────────────────────────────────────

export function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [key, setKey] = useState(0);
  const timerRef = useRef(null);
  const n = testimonials.length;

  const go = useCallback(
    (dir) => {
      setActive((prev) => (prev + dir + n) % n);
      setKey((k) => k + 1);
      setPaused(false);
    },
    [n]
  );

  const goTo = (i) => {
    setActive(i);
    setKey((k) => k + 1);
    setPaused(false);
  };

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [paused, go, key]);

  return (
    <section className="  space-y-8">
      {/* Header */}
      <div className="text-center space-y-1">
        <p className="text-xs font-bold tracking-widest text-blue-500 uppercase">
          Testimonials
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Words from our community
        </h2>
        <p className="text-xs text-gray-400">
          Placeholder content — real stories arrive after Cohort 1.
        </p>
      </div>

      {/* ── Carousel stage ──
          overflow-hidden is CRITICAL here — it clips the peeking side cards
          so they don't overflow the container and cause horizontal scroll.   */}
      <div
        className="relative overflow-hidden"
        style={{ height: 300 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {testimonials.map((t, i) => {
          let pos = i - active;
          if (pos > n / 2) pos -= n;
          if (pos < -n / 2) pos += n;
          return (
            <TestimonialCard
              key={t.id}
              t={t}
              position={pos}
              onClick={() => goTo(i)}
            />
          );
        })}
      </div>

      {/* Progress bars + controls */}
      <div className="space-y-3">
        <ProgressBar
          key={`${active}-${key}`}
          active={active}
          total={n}
          duration={AUTOPLAY_MS}
        />
        <div className="flex items-center justify-between">
          {/* Dot indicators */}
          <div className="flex gap-2 items-center">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === active
                    ? "w-6 h-2 bg-blue-500"
                    : "w-2 h-2 bg-gray-400 hover:bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex gap-2">
            <button
              onClick={() => go(-1)}
              className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-blue-400 hover:text-blue-500 hover:shadow-md transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => go(1)}
              className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-blue-400 hover:text-blue-500 hover:shadow-md transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* fillBar keyframe */}
      <style>{`
        @keyframes fillBar {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </section>
  );
}