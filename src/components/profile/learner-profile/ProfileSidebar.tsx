'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Calendar, Award, BookOpen, Target, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { tokenManager } from '@/lib/auth';

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileSidebar({ isOpen, onClose }: ProfileSidebarProps) {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState({
    name: 'Loading...',
    initials: 'L',
    email: 'loading@example.com',
    role: 'LEARNER',
    joinDate: 'Loading...'
  });

  useEffect(() => {
    const userData = tokenManager.getUser();
    if (userData) {
      const name = userData.name || userData.email?.split('@')[0] || 'User';
      const initials = name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
      const email = userData.email || 'user@example.com';
      const role = userData.role || 'LEARNER';
      const joinDate = userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently';
      
      setUser({ name, initials, email, role, joinDate });
    }
  }, []);

  const handleLogout = () => {
    tokenManager.logout();
    setShowLogoutModal(false);
    onClose();
    router.push('/login');
  };

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
            <div className="w-20 h-20 rounded-full bg-[#63b3ed] grid place-items-center font-['Syne'] text-2xl font-bold border-4 border-white/[0.07] mb-3">
              {user.initials}
            </div>
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#63b3ed]/10 border border-[#63b3ed]/20 text-[#63b3ed] mt-2">
              {user.role}
            </span>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4" />
              <span className="text-">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 " />
              <span>Joined {user.joinDate}</span>
            </div>
          </div>

          <div className="h-px bg-white/[0.07] my-6" />

          <div className="mb-6">
            <div className="font-['Syne'] text-[11px] font-bold uppercase tracking-wider  mb-3">Stats Overview</div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: BookOpen, val: '5', label: 'Courses', color: '#63b3ed' },
                { icon: Award, val: '12', label: 'Certificates', color: '#76e3c4' },
                { icon: Target, val: '89%', label: 'Avg Score', color: '#68d391' },
                { icon: Calendar, val: '45', label: 'Days Active', color: '#f6ad55' },
              ].map((stat, i) => (
                <div key={i} className="bg-gray-200 border border-white rounded-lg p-3">
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
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:text-[#63b3ed]   ">
              <Award className="w-4 h-4" />
              My Certificates
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:text-[#63b3ed] ">
              <Target className="w-4 h-4" />
              Learning Goals
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:text-[#63b3ed]">
              <BookOpen className="w-4 h-4" />
              My Courses
            </button>
          </div>

          <div className="h-px bg-white my-6" />

          <button onClick={() => setShowLogoutModal(true)} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Sign Out</h2>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to sign out? You will need to log in again to access your account.</p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
