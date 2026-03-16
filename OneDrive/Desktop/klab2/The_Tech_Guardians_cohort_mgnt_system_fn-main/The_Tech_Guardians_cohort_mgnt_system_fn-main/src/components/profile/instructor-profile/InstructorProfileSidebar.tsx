'use client';

import { X, Mail, Calendar, Award, BookOpen, Users, LogOut } from 'lucide-react';

interface InstructorProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstructorProfileSidebar({ isOpen, onClose }: InstructorProfileSidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <aside className="fixed right-0 top-0 bottom-0 w-[320px] bg-gray-200 text-black border-l border-white/[0.07] z-50 overflow-y-auto">
        <div className="p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Syne'] text-sm font-bold uppercase tracking-wider">Profile</h2>
            <button onClick={onClose} className="p-1.5 hover:text-indigo-600 rounded transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-indigo-600 grid place-items-center font-['Syne'] text-2xl font-bold border-4 border-white/[0.07] mb-3 text-white">
              JK
            </div>
            <h3 className="text-lg font-semibold">Dr. James Kowalski</h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-600/10 border border-indigo-600/20 text-indigo-600 mt-2">
              Instructor
            </span>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4" />
              <span>james.k@example.com</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4" />
              <span>Joined Jan 2024</span>
            </div>
          </div>

          <div className="h-px bg-white/[0.07] my-6" />

          <div className="mb-6">
            <div className="font-['Syne'] text-[11px] font-bold uppercase tracking-wider mb-3">Stats Overview</div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: BookOpen, val: '8', label: 'Courses', color: '#4f46e5' },
                { icon: Users, val: '156', label: 'Students', color: '#76e3c4' },
                { icon: Award, val: '24', label: 'Certificates', color: '#68d391' },
                { icon: Calendar, val: '120', label: 'Days Active', color: '#f6ad55' },
              ].map((stat, i) => (
                <div key={i} className="bg-gray-200 border border-white/[0.07] rounded-lg p-3">
                  <stat.icon className="w-4 h-4 mb-2" style={{ color: stat.color }} />
                  <div className="font-['Syne'] text-xl font-extrabold leading-none mb-1" style={{ color: stat.color }}>
                    {stat.val}
                  </div>
                  <div className="text-[11px]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/[0.07] my-6" />

          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:text-indigo-600">
              <Award className="w-4 h-4" />
              My Credentials
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:text-indigo-600">
              <BookOpen className="w-4 h-4" />
              My Courses
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:text-indigo-600">
              <Users className="w-4 h-4" />
              My Students
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
