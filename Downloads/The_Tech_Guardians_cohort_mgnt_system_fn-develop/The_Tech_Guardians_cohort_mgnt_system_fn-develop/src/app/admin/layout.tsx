"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Users, Calendar, BookOpen, Shield, FileText, Menu, Bell, LogOut, ChevronRight } from "lucide-react";
import Logo from "@/components/ui/navbar/Logo";

function NavItem({ icon: Icon, label, active, onClick, collapsed }: { 
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>; 
  label: string; 
  active: boolean; 
  onClick: () => void;
  collapsed: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium
        transition-all duration-200 group relative overflow-hidden
        ${active
          ? "bg-indigo-600 text-white shadow-sm"
          : "text-gray-400 hover:bg-indigo-300 hover:text-gray-800"
        }
        ${collapsed ? "justify-center" : ""}
      `}
    >
      {active && !collapsed && (
        <span className="absolute left-0 top-0 bottom-2 w-2.5 h-full bg-white rounded-l-2xl" />
      )}
      <Icon
        size={16}
        strokeWidth={active ? 2 : 1.8}
        className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
          active ? "text-white" : "text-gray-400 group-hover:text-gray-700"
        }`}
      />
      {!collapsed && (
        <>
          <span className="flex-1 text-left tracking-tight">{label}</span>
          {active && (
            <ChevronRight size={13} className="text-white/50" />
          )}
        </>
      )}
    </button>
  );
}

function NavSection({ label }: { label: string }) {
  return (
    <div className="px-3.5 pt-5 pb-1.5">
      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.12em]">{label}</span>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const view = pathname === '/admin' ? 'dashboard' : pathname.split('/').pop() || 'dashboard';

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { id: "users", label: "Users", icon: Users, href: "/admin/users" },
    { id: "cohorts", label: "Cohorts", icon: Calendar, href: "/admin/cohorts" },
    { id: "courses", label: "Courses", icon: BookOpen, href: "/admin/courses" },
    { id: "moderation", label: "Moderation", icon: Shield, href: "/admin/moderation" },
    { id: "logs", label: "Audit Logs", icon: FileText, href: "/admin/logs" },
  ];

  const titles: Record<string, string> = {
    dashboard: "Analytics Dashboard",
    users: "User Management",
    cohorts: "Cohort Management",
    courses: "Course Management",
    moderation: "Content Moderation",
    logs: "Audit Logs",
  };

  const subtitles: Record<string, string> = {
    dashboard: "Overview of platform metrics",
    users: "Manage platform users",
    cohorts: "Create and manage cohorts",
    courses: "Manage course content",
    moderation: "Review flagged content",
    logs: "System activity logs",
  };

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className={`px-5 pt-6 pb-5 flex items-center justify-between ${collapsed ? '' : ''}`}>
        {!collapsed && (
          <div className="flex items-center gap-3 mb-0.5">
            <div className="text-[10px]"><Logo textMain="text-gray-900" /></div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-8 h-8 items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
        >
          {collapsed ? <Menu size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
        </button>
      </div>

      <div className="mx-4 h-px bg-gray-100" />

      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5">
        {!collapsed && <NavSection label="Admin Panel" />}
        {nav.map(item => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={view === item.id}
            collapsed={collapsed}
            onClick={() => {
              router.push(item.href);
              setSidebarOpen(false);
            }}
          />
        ))}
      </nav>

      <div className="mx-4 h-px bg-gray-100" />

      <div className="p-3 space-y-1">
        <button
          className={`w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-gray-50 transition-all duration-200 group ${collapsed ? 'justify-center' : ''}`}
        >
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              AD
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
          </div>

          {!collapsed && (
            <>
              <div className="flex-1 text-left min-w-0">
                <div className="text-gray-900 text-xs font-semibold truncate leading-tight">Admin User</div>
                <div className="text-gray-400 text-[10px] mt-0.5 font-medium">Administrator</div>
              </div>

              <ChevronRight
                size={14}
                className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0"
              />
            </>
          )}
        </button>

        {!collapsed && (
          <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <LogOut size={13} strokeWidth={1.8} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8f8f8] overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" />
          <div
            className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-2xl flex flex-col z-50 border-r border-gray-100"
            onClick={e => e.stopPropagation()}
          >
            {SidebarContent}
          </div>
        </div>
      )}

      <aside className={`hidden lg:flex flex-shrink-0 flex-col bg-white border-r border-gray-100 shadow-sm transition-all duration-300 ${collapsed ? 'w-20' : 'w-60'}`}>
        {SidebarContent}
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 h-16 flex items-center gap-4 flex-shrink-0 sticky top-0 z-30">
          <button
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <h1 className="text-base font-bold text-gray-900 truncate leading-tight">
                {titles[view]}
              </h1>
              <span className="hidden sm:inline-flex items-center text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                ADMIN
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block mt-0.5 font-medium">
              {subtitles[view]}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all duration-200">
              <Bell size={17} strokeWidth={1.8} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white" />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-0.5" />

            <button
              className="relative flex-shrink-0 group"
              aria-label="Admin profile"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-bold
                group-hover:bg-indigo-700 transition-all duration-200 shadow-sm group-hover:shadow-md group-hover:scale-105">
                AD
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
