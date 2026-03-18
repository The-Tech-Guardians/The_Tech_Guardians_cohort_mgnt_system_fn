"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { tokenManager } from '@/lib/auth';
import {
  GraduationCap,
  Users,
  ChevronRight,
  UserPlus,
  LogIn,
  ClipboardList,
  FileEdit,
  Clock,
  
} from "lucide-react";
import { CriteriaCard } from "@/components/application-component/criteria-cart";
import Link from "next/link";
import { Btn } from "@/components/instructor/ui/SharedUI";


// ── Data ──────────────────────────────────────────────────────────────────────

const criteriaData = [
  {
    icon: <GraduationCap className="w-5 h-5 text-blue-500" />,
    title: "Education Requirements",
    items: [
      "Currently enrolled or recently graduated (secondary or tertiary)",
      "Basic reading and writing proficiency in English",
      "No prior technical experience required",
    ],
  },
  {
    icon: <Users className="w-5 h-5 text-blue-500" />,
    title: "Personal Qualities",
    items: [
      "Curious, open-minded, and willing to learn",
      "Able to commit focused time each week to the cohort",
      "Interested in using skills to solve real community problems",
    ],
  },
];

const stepsData = [
  {
    number: 1,
    icon: <UserPlus className="w-4 h-4 text-white" />,
    title: "Create an Account",
    description:
      "Register with your email address and set a secure password to access your applicant dashboard.",
  },
  {
    number: 2,
    icon: <LogIn className="w-4 h-4 text-white" />,
    title: "Log In to Your Dashboard",
    description:
      "Sign in to your Safe Education Platform account to begin and track your application.",
  },
  {
    number: 3,
    icon: <ClipboardList className="w-4 h-4 text-white" />,
    title: "Review the Criteria",
    description:
      "Read through the cohort requirements carefully to make sure this program is the right fit for you.",
  },
  {
    number: 4,
    icon: <FileEdit className="w-4 h-4 text-white" />,
    title: "Complete the Application",
    description:
      "Answer a few honest, straightforward questions. This helps us understand who you are — not just what you know.",
  },
  {
    number: 5,
    icon: <Clock className="w-4 h-4 text-white" />,
    title: "Wait for the Decision",
    description:
      "Our team will review every application personally and respond to you within 2 weeks.",
  },
];

export const educationOptions = [
  "Primary School",
  "Secondary School (O-Level / GCSE)",
  "High School / A-Level",
  "Vocational / TVET Certificate",
  "Undergraduate (In Progress)",
  "Bachelor's Degree",
  "Postgraduate",
  "Other",
];



function StepDot({ icon }) {
  return (
    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0 z-10 relative">
      {icon}
    </div>
  );
}

// ── Step Row — desktop: zigzag with blue line | mobile: left-aligned list ─────

function StepRow({ step, isLast }) {
  const isOdd = step.number % 2 !== 0;

  return (
    <>
      {/* ── MOBILE layout (< md): icon left, text right, vertical line ── */}
      <div className="flex md:hidden items-start">
        {/* Left column: dot + line */}
        <div className="flex flex-col items-center mr-4">
          <StepDot icon={step.icon} />
          {!isLast && (
            <div className="w-px flex-1 bg-blue-300 min-h-[40px] mt-1" />
          )}
        </div>
        {/* Text */}
        <div className={`flex-1 text-left ${!isLast ? "pb-8" : ""}`}>
          <p className="text-sm font-semibold text-gray-800">
            {step.number}. {step.title}
          </p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>

      {/* ── DESKTOP layout (≥ md): zigzag with center line ── */}
      <div className="hidden md:flex items-start">
        {isOdd ? (
          <>
            {/* Text — left */}
            <div className="flex-1 pr-6 text-right">
              <p className="text-sm font-semibold text-gray-800">
                {step.number}. {step.title}
              </p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Center: dot + line */}
            <div className="flex flex-col items-center">
              <StepDot icon={step.icon} />
              {!isLast && (
                <div className="w-px flex-1 bg-blue-300 min-h-[48px] mt-1" />
              )}
            </div>

            {/* Empty right */}
            <div className={`flex-1 pl-6 ${!isLast ? "pb-10" : ""}`} />
          </>
        ) : (
          <>
            {/* Empty left */}
            <div className={`flex-1 pr-6 ${!isLast ? "pb-10" : ""}`} />

            {/* Center: dot + line */}
            <div className="flex flex-col items-center">
              <StepDot icon={step.icon} />
              {!isLast && (
                <div className="w-px flex-1 bg-blue-300 min-h-[48px] mt-1" />
              )}
            </div>

            {/* Text — right */}
            <div className="flex-1 pl-6 text-left">
              <p className="text-sm font-semibold text-gray-800">
                {step.number}. {step.title}
              </p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {step.description}
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}



export default function ApplicationProcess() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!tokenManager.getUser()) {
      router.replace('/login?redirect=/application_process');
      return;
    }
  }, [router]);

  return (
    <div className=" mt-44 py-8 sm:py-10 ">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Welcome Banner */}
        <div className="border border-gray-200 rounded-lg p-5 sm:p-6 bg-white">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1">
            Safe Education Platform — Cohort Application
          </p>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            Welcome, Freddy Bijanja
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            We&apos;re glad you&apos;re here. Safe Education Platform brings together students
            and fresh graduates who want to grow their skills, connect with like-minded peers,
            and use what they learn to solve real problems in their communities. This isn&apos;t
            just a certification — it&apos;s a cohort experience built around collaboration,
            entrepreneurship, and practical impact. Ready to take the first step?
          </p>
        <Link href="/application_process/form"><Btn>Apply Now</Btn></Link> 
        </div>

        {/* Application Criteria */}
        <div>
          <h2 className="text-base font-semibold text-blue-600 text-center mb-4">
            Application Criteria
          </h2>
          {/* Stack on mobile, side-by-side on sm+ */}
          <div className="flex flex-col sm:flex-row gap-4">
            {criteriaData.map((c) => (
              <CriteriaCard key={c.title} {...c} />
            ))}
          </div>
        </div>

        {/* Application Process */}
        <div>
          <h2 className="text-base font-semibold text-gray-800 text-center mb-6">
            Application Process
          </h2>
          <div className="relative">
            {stepsData.map((step, i) => (
              <StepRow
                key={step.number}
                step={step}
                isLast={i === stepsData.length - 1}
              />
            ))}
          </div>
        </div>


              <Link href="/application_process/form"><Btn>Apply Now</Btn></Link> 
      </div>
    </div>
  );
}