import { Antenna, BarChart, CheckCheckIcon, Circle, GraduationCap, Handshake, MessageCircle, Star, TrendingUp, Trophy, Zap } from "lucide-react";
import StatPill from "./why-shoose-sc-component/stat-pill";
import { FeatureCard } from "./why-shoose-sc-component/feature-card";
import Link from "next/link";


const stats = [
  { value: "2,400+", label: "Active Learners" },
  { value: "48",     label: "Courses Available" },
  { value: "94%",    label: "Completion Rate" },
  { value: "120+",   label: "Expert Instructors" },
];

const features = [
  {
    emoji: <GraduationCap/>,
    gradient: "from-blue-500 to-cyan-400",
    bg: "bg-blue-50",
    border: "border-blue-100",
    accent: "text-blue-600",
    tag: "Core Experience",
    title: "Cohort-Based Learning",
    desc: "Learn alongside a tight-knit group on a shared schedule. Accountability, momentum, and real camaraderie — built in from day one.",
    stat: "3× faster completion vs solo learning",
    statIcon: <Zap/>,
  },
  {
    emoji: "👨‍🏫",
    gradient: "from-violet-500 to-blue-500",
    bg: "bg-violet-50",
    border: "border-violet-100",
    accent: "text-violet-600",
    tag: "World-Class Teaching",
    title: "Expert Instructors",
    desc: "Every course is led by practitioners with real-world experience — not just theory. Ask questions, get feedback, grow faster.",
    stat: "4.9★ average instructor rating",
    statIcon: <Star/>,
  },
  {
    emoji: <Trophy/>,
    gradient: "from-amber-400 to-orange-400",
    bg: "bg-amber-50",
    border: "border-amber-100",
    accent: "text-amber-600",
    tag: "Recognized Credentials",
    title: "Certificates & Badges",
    desc: "Earn verified certificates upon completion. Share them on LinkedIn, add them to your resume, and prove your skills to the world.",
    stat: "Recognised by 200+ employers",
    statIcon: <CheckCheckIcon/>,
  },
  {
    emoji: <MessageCircle/>,
    gradient: "from-emerald-500 to-teal-400",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    accent: "text-emerald-600",
    tag: "Always Supported",
    title: "Community Support",
    desc: "A dedicated forum, peer channels, and instructor office hours. You'll never feel stuck or alone on your learning journey.",
    stat: "< 2h average response time",
    statIcon: <Handshake/>,
  },
  {
    emoji: <Antenna/>,
    gradient: "from-sky-500 to-blue-400",
    bg: "bg-sky-50",
    border: "border-sky-100",
    accent: "text-sky-600",
    tag: "Real-Time Learning",
    title: "Live Sessions",
    desc: "Weekly live workshops, Q&A calls, and collaborative projects. Learning is a two-way conversation, not a pre-recorded monologue.",
    stat: "8+ live sessions per cohort",
    statIcon: <Circle/>,
  },
  {
    emoji: <BarChart/>,
    gradient: "from-pink-500 to-rose-400",
    bg: "bg-pink-50",
    border: "border-pink-100",
    accent: "text-pink-600",
    tag: "Data-Driven Growth",
    title: "Track Your Progress",
    desc: "Visual dashboards show exactly where you are, what's next, and how far you've come — module by module, week by week.",
    stat: "Real-time progress analytics",
    statIcon: <TrendingUp/>,
  },
];


// ── Main Section ──
export default function WhyJoinSection() {
  return (
    <>


      <section className="wj-font wj-bg py-24 lg:py-32 pt-24np">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[12px] font-semibold text-blue-600 uppercase tracking-widest">Why join us</span>
            </div>
            <h2 className="text-[36px] md:text-[44px] font-black text-slate-900 leading-[1.1] tracking-tight mb-5">
              Everything you need to{" "}
              <span className="wj-serif italic font-normal"
                style={{ background: "linear-gradient(135deg, #2563EB, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                learn, grow
              </span>
              {" "}&amp; thrive
            </h2>

            <p className="text-[16px] text-slate-500 leading-relaxed">
              SafED isn&apos;t just a course platform — it&apos;s a structured, supportive community designed to take you from where you are to where you want to be.
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm px-6 py-6 mb-14 grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-slate-100">
            {stats.map((s) => (
              <StatPill key={s.label} {...s} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={f.title} className="card-reveal" >
                <FeatureCard feature={f} index={i} />
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-px ">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-100 mb-1">Ready to start?</p>
                <h3 className="wj-serif italic text-white text-[26px] font-normal leading-tight">
                  Join the next cohort today
                </h3>
                <p className="text-white/70 text-sm mt-1.5 max-w-sm">
                  Enrollment is open. Cohorts fill up fast — secure your spot before the window closes.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <button className="relative bg-white text-blue-600 font-bold text-sm px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 overflow-hidden">
                  <span className="relative">Browse Courses →</span>
                </button>
               <Link href="cohorts">
                 <button className="bg-white/15 border border-white/30 text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-white/20 transition-all duration-200">
                  View Cohorts
                </button>
               </Link>
              
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}