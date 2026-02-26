'use client';

import { X, Mail, Calendar, Award, BookOpen, Target, LogOut } from 'lucide-react';

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileSidebar({ isOpen, onClose }: ProfileSidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <aside className="fixed right-0 top-0 bottom-0 w-[320px] bg-[#111318] border-l border-white/[0.07] z-50 overflow-y-auto">
        <div className="p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Syne'] text-sm font-bold uppercase tracking-wider text-gray-400">Profile</h2>
            <button onClick={onClose} className="p-1.5 hover:bg-[#181c24] rounded transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 grid place-items-center font-['Syne'] text-2xl font-bold border-4 border-white/[0.07] mb-3">
              FB
            </div>
            <h3 className="text-lg font-semibold">Freddy Bijanja</h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#63b3ed]/10 border border-[#63b3ed]/20 text-[#63b3ed] mt-2">
              Learner
            </span>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">freddy@example.com</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">Joined Jan 2025</span>
            </div>
          </div>

          <div className="h-px bg-white/[0.07] my-6" />

          <div className="mb-6">
            <div className="font-['Syne'] text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">Stats Overview</div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: BookOpen, val: '5', label: 'Courses', color: '#63b3ed' },
                { icon: Award, val: '12', label: 'Certificates', color: '#76e3c4' },
                { icon: Target, val: '89%', label: 'Avg Score', color: '#68d391' },
                { icon: Calendar, val: '45', label: 'Days Active', color: '#f6ad55' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#181c24] border border-white/[0.07] rounded-lg p-3">
                  <stat.icon className="w-4 h-4 mb-2" style={{ color: stat.color }} />
                  <div className="font-['Syne'] text-xl font-extrabold leading-none mb-1" style={{ color: stat.color }}>
                    {stat.val}
                  </div>
                  <div className="text-[11px] text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/[0.07] my-6" />

          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-[#181c24] rounded-lg transition">
              <Award className="w-4 h-4" />
              My Certificates
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-[#181c24] rounded-lg transition">
              <Target className="w-4 h-4" />
              Learning Goals
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-[#181c24] rounded-lg transition">
              <BookOpen className="w-4 h-4" />
              My Courses
            </button>
          </div>

          <div className="h-px bg-white/[0.07] my-6" />

          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
