'use client';

import { useState } from 'react';
import CourseSidebar from '@/components/learner/CourseSidebar';
import ProfileSidebar from '@/components/learner/ProfileSidebar';
import { BookCopy, ChartColumnStacked, Megaphone } from 'lucide-react';

export default function TopNav() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <nav className="flex items-center gap-2 md:gap-4 border-b border-white/[0.07] bg-[#0a0b0f] px-3 md:px-6 h-[60px] flex-shrink-0">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden flex flex-col gap-1 p-2 hover:bg-[#181c24] rounded transition"
        >
          <span className="w-5 h-0.5 bg-white rounded"></span>
          <span className="w-5 h-0.5 bg-white rounded"></span>
          <span className="w-5 h-0.5 bg-white rounded"></span>
        </button>
       

        <div className="flex items-center gap-2 mr-auto font-['Syne'] text-base md:text-lg font-extrabold tracking-tigh">
            <div className="w-13 h-13 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
                <circle cx="14" cy="10" r="5" fill="#4F46E5" />
                <circle cx="26" cy="10" r="5" fill="#2563EB" />
                <circle cx="20" cy="6" r="5" fill="#06B6D4" />
                <path d="M4 28 Q20 18 36 28" stroke="#4F46E5" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M6 33 Q20 23 34 33" stroke="#2563EB" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M9 38 Q20 30 31 38" stroke="#06B6D4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex flex-col">
               <span className="text-white font-bold text-xl tracking-tight">CohortLMS</span>
                <span className="text-white font-bold text-sm tracking-tight">Platform</span>
            </div>
           
          </div>
        <span className="font-mono text-[10px] md:text-[11px] bg-[#63b3ed]/10 border border-[#63b3ed]/20 text-[#63b3ed] px-2 md:px-2.5 py-1 rounded-full tracking-wider hidden sm:inline">
          COHORT-2025-A
        </span>
        <div className="w-px h-6 bg-white/[0.07] hidden md:block" />
        <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-[#63b3ed] hover:bg-[#181c24] rounded-lg transition">
          <BookCopy />
           My Course
        </button>
        <button className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-gray-400 hover:bg-[#181c24] hover:text-white rounded-lg transition">
          <ChartColumnStacked />
           Progress
        </button>
        <button className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-gray-400 hover:bg-[#181c24] hover:text-white rounded-lg transition">
          <Megaphone />
           Announcements
        </button>
        <div className="w-px h-6 bg-white/[0.07] hidden md:block" />
        <div 
          onClick={() => setProfileOpen(true)}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 grid place-items-center font-['Syne'] text-xs font-bold border-2 border-white/[0.07] hover:border-[#63b3ed] cursor-pointer transition flex-shrink-0"
        >
          FB
        </div>
      </nav>

      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-[60px] bottom-0 z-50 lg:hidden">
            <CourseSidebar />
          </div>
        </>
      )}

      <ProfileSidebar isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
