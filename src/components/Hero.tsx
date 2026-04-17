import FeatureChip from "./herro-section/FeatureChip";
import CTAButton from "./herro-section/CtaButton";
import { AvatarStack } from "./herro-section/AvatarStark";
import StatCard from "./herro-section/SetCart";
import Badge from "./herro-section/Badget";
import { Book, ChevronRight, GraduationCap, Star, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Btn } from "./instructor/ui/SharedUI";


export default function HeroSection() {
  return (
    <>
      <main className="hero-font pt-24">
        <section className="hero-bg min-h-screen flex items-center">
          <div className="max-w-7xl  mx-auto px-6 lg:px-8 py-20 lg:py-28 w-full">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
              <div className="flex-1 flex flex-col gap-7 text-center lg:text-left items-center lg:items-start">
                <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-start">
                  <Badge
                    icon={<GraduationCap />}
                    text="SafED Learning Platform"
                    accent
                  />
                  <Badge icon="🟢" text="Open source · Free to join" />
                </div>

                <div>
                  <h1 className="text-[40px] md:text-[52px] lg:text-[54px] leading-[1.1] font-bold text-slate-900- tracking-tight">
                    Welcome to the{" "}
                    <span
                      className="hero-serif italic font-normal"
                      style={{
                        background: "linear-gradient(135deg, #2563EB, #0EA5E9)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      SafED
                    </span>{" "}
                    community
                  </h1>
                  <p className="mt-5 text-[16.5px] text-slate-500 leading-relaxed max-w-xl lg:mx-0 mx-auto">
                    The place to get support, ask and answer questions, and
                    contribute to the open source learning platform — built by
                    educators, for everyone.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 flex-wrap justify-center lg:justify-start">
                  <FeatureChip text="Cohort-based learning" />
                  <FeatureChip text="Expert instructors" />
                  <FeatureChip text="Certificates included" />
                </div>

                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <Link href="courses">
                    {" "}
                    <CTAButton primary>Browse courses</CTAButton>
                  </Link>

                  <CTAButton>
                    <Link href="cohorts" className="flex items-center gap-1.5">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polygon points="10 8 16 12 10 16 10 8" />
                      </svg>
                      View cohorts
                    </Link>
                  </CTAButton>
                 <Link href="/application_process">
                   <CTAButton primary>
                    Apply Now
                   
                  </CTAButton>
                 </Link>
                
                </div>

                <AvatarStack count={2400} />

                <div className="grid  sm:grid-cols-3 gap-3 w-full max-w-md lg:max-w-none">
                  <StatCard value="48+" label="Courses" icon={<Book />} />
                  <StatCard value="120+" label="Instructors" icon={<User />} />
                  <StatCard value="4.9★" label="Rating" icon={<Star />} />
                </div>
              </div>

             {/* Replace your blob-wrap div with this */}
<div className="flex-1 w-full max-w-lg lg:max-w-none flex items-center justify-center px-4 lg:px-0">
  <div className="relative w-full max-w-[400px] h-[440px]">

    {/* Floating badge — top */}
    <div className="absolute -top-3 right-6 z-20 flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-md text-[11px] font-semibold text-emerald-600 whitespace-nowrap">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      2,400+ learners active
    </div>

    {/* Card 1 — Individual learner (back-left, blue) */}
    <div
      className="absolute top-[12px] left-0 w-[200px] h-[240px] rounded-[20px] overflow-hidden border-[3px] border-white shadow-xl z-[1]"
      style={{ transform: "rotate(-4deg)" }}
    >
      <img
        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&crop=faces"
        alt="Individual learner studying online"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 text-white text-[10px] font-semibold tracking-widest uppercase">
        <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
        Individual
      </div>
    </div>

    {/* Card 2 — Group collaboration (middle-right, peach) */}
    <div
      className="absolute top-[55px] right-0 w-[220px] h-[260px] rounded-[20px] overflow-hidden border-[3px] border-white shadow-xl z-[2]"
      style={{ transform: "rotate(3deg)" }}
    >
      <img
        src="https://images.unsplash.com/photo-1543269664-7eef42226a21?w=400&h=320&fit=crop&crop=faces"
        alt="Small collaborative group learning"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 text-white text-[10px] font-semibold tracking-widest uppercase">
        <span className="w-2 h-2 rounded-full bg-orange-300 flex-shrink-0" />
        Group
      </div>
    </div>

    {/* Card 3 — Team / Cohort (front-center, teal) */}
    <div
      className="absolute bottom-0 left-[40px] w-[210px] h-[245px] rounded-[20px] overflow-hidden border-[3px] border-white shadow-xl z-[3]"
      style={{ transform: "rotate(-1.5deg)" }}
    >
      <img
        src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop&crop=faces"
        alt="Full team cohort working together"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 text-white text-[10px] font-semibold tracking-widest uppercase">
        <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
        Team / Cohort
      </div>
    </div>

    {/* Floating badge — bottom */}
    <div className="absolute -bottom-3 right-10 z-20 flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-md text-[11px] font-semibold text-sky-600 whitespace-nowrap">
      🎓 Cohort-based learning
    </div>

  </div>
</div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
