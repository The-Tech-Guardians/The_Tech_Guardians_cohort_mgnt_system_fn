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
    <aside className="w-64 bg-white min-h-screen flex flex-col border-r border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <Link href="/admin">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <h1 className="text-xl font-bold tracking-tight">
                <span className="text-indigo-600">Saf</span>
                <span className="text-gray-900">ED</span>
              </h1>
              <p className="text-xs tracking-[0.3em] text-gray-600">
                LEARNING
              </p>
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
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all w-full">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
