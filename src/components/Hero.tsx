

import FeatureChip from "./herro-section/FeatureChip";
import CTAButton from "./herro-section/CtaButton";
import { AvatarStack } from "./herro-section/AvatarStark";
import StatCard from "./herro-section/SetCart";
import Badge from "./herro-section/Badget";
import { Book, GraduationCap, Star, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";



export default function HeroSection() {
  return (
    <>
       
      <main className="hero-font pt-24">
        <section className="hero-bg min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 w-full">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

             
              <div className="flex-1 flex flex-col gap-7 text-center lg:text-left items-center lg:items-start">

                <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-start">
                  <Badge icon={<GraduationCap/>} text="SafED Learning Platform" accent />
                  <Badge icon="🟢" text="Open source · Free to join" />
                </div>

                <div>
                  <h1 className="text-[40px] md:text-[52px] lg:text-[54px] leading-[1.1] font-bold text-slate-900 tracking-tight">
                    Welcome to the{" "}
                    <span className="hero-serif italic font-normal" style={{
                      background: "linear-gradient(135deg, #2563EB, #0EA5E9)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}>
                      SafED
                    </span>{" "}
                    community
                  </h1>
                  <p className="mt-5 text-[16.5px] text-slate-500 leading-relaxed max-w-xl lg:mx-0 mx-auto">
                    The place to get support, ask and answer questions, and contribute to the open source learning platform — built by educators, for everyone.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 flex-wrap justify-center lg:justify-start">
                  <FeatureChip text="Cohort-based learning" />
                  <FeatureChip text="Expert instructors" />
                  <FeatureChip text="Certificates included" />
                </div>

                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                 <Link href="courses"> <CTAButton primary>Browse courses</CTAButton></Link>
                  
                  <CTAButton>
                    <Link href="cohorts">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
                    </svg>
                    View cohorts
                    </Link>
                    
                  </CTAButton>
                </div>

                <AvatarStack count={2400} />

              
                <div className="grid  sm:grid-cols-3 gap-3 w-full max-w-md lg:max-w-none">
                  <StatCard value="48+" label="Courses" icon={<Book/>} />
                  <StatCard value="120+" label="Instructors" icon={<User/>} />
                  <StatCard value="4.9★" label="Rating" icon={<Star/>} />
                </div>
              </div>

                <div className="flex-1 w-full max-w-lg lg:max-w-none flex items-center justify-center px-4 lg:px-0">
        <div className="blob-wrap">
          <div className="blob-blue" />
          <div className="blob-peach" />
          <div className="blob-photo">
            <Image src="/image.png" alt="hero-image" width={500} height={500} priority />
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