'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Calendar, BookOpen, Shield, FileText, LogOut } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Cohorts", href: "/admin/cohorts", icon: Calendar },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Moderation", href: "/admin/moderation", icon: Shield },
  { label: "Audit Logs", href: "/admin/logs", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900/90 backdrop-blur-sm min-h-screen flex flex-col border-r border-white/10">
      <div className="p-6 border-b border-white/10">
        <Link href="/admin">
          <div className="flex items-center gap-3">
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
        </Link>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    active 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/50" 
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-white/10">
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all w-full">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
