"use client";

import { useState, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Users, Calendar, BookOpen, Shield, FileText, LogOut, Menu, Bell, ChevronRight } from "lucide-react";
import Link from "next/link";

const SidebarContext = createContext({ collapsed: false });

export const useSidebar = () => useContext(SidebarContext);

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Cohorts", href: "/admin/cohorts", icon: Calendar },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Moderation", href: "/admin/moderation", icon: Shield },
  { label: "Audit Logs", href: "/admin/logs", icon: FileText },
];

function NavItem({ 
  icon: Icon, 
  label, 
  active, 
  onClick, 
  collapsed 
}: { 
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
          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
          active ? "text-white" : "text-slate-500 group-hover:text-slate-700"
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

function NavSection({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) return null;
  return (
    <div className="px-3.5 pt-5 pb-1.5">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em]">{label}</span>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const getPageTitle = () => {
    if (pathname === "/admin") return "Analytics Dashboard";
    if (pathname === "/admin/users") return "User Management";
    if (pathname === "/admin/cohorts") return "Cohort Management";
    if (pathname === "/admin/courses") return "Course Management";
    if (pathname === "/admin/moderation") return "Moderation & Discipline";
    if (pathname === "/admin/logs") return "Audit Logs";
    return "Admin Panel";
  };

  const getPageSubtitle = () => {
    if (pathname === "/admin") return "Overview of platform metrics";
    if (pathname === "/admin/users") return "Manage users and permissions";
    if (pathname === "/admin/cohorts") return "Create and manage cohorts";
    if (pathname === "/admin/courses") return "Manage course content";
    if (pathname === "/admin/moderation") return "Handle user discipline";
    if (pathname === "/admin/logs") return "Track system changes";
    return "Administrative controls";
  };

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className={`px-5 pt-6 pb-5 flex items-center justify-between ${collapsed ? '' : ''}`}>
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md overflow-hidden flex-shrink-0 group-hover:shadow-lg transition-shadow duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <svg viewBox="0 0 38 38" width="20" height="20" fill="none">
                <circle cx="12" cy="11" r="5" fill="rgba(255,255,255,0.9)" />
                <circle cx="26" cy="11" r="5" fill="rgba(255,255,255,0.7)" />
                <circle cx="19" cy="7" r="4" fill="rgba(255,255,255,0.55)" />
                <path d="M3 26 Q19 17 35 26" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M5 31 Q19 23 33 31" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-[17px] text-slate-800 tracking-tight">CohortLMS</span>
              <span className="text-[9px] font-semibold tracking-[0.14em] uppercase text-cyan-500 mt-[3px]">Admin Panel</span>
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-8 h-8 items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
        >
          {collapsed ? <Menu size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
        </button>
      </div>

      <div className="mx-4 h-px bg-slate-200" />

      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5">
        <NavSection label="Navigate" collapsed={collapsed} />
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            active={pathname === item.href}
            collapsed={collapsed}
            onClick={() => {
              router.push(item.href);
              setSidebarOpen(false);
            }}
          />
        ))}
      </nav>

      <div className="mx-4 h-px bg-slate-200" />

      <div className="p-3 space-y-1">
        {!collapsed && (
          <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200">
            <LogOut size={13} strokeWidth={1.8} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <SidebarContext.Provider value={{ collapsed }}>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" />
            <div
              className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-2xl flex flex-col z-50 border-r border-slate-200"
              onClick={e => e.stopPropagation()}
            >
              {SidebarContent}
            </div>
          </div>
        )}

        <aside className={`hidden lg:flex flex-shrink-0 flex-col bg-white border-r border-slate-200 shadow-sm transition-all duration-300 ${collapsed ? 'w-20' : 'w-60'}`}>
          {SidebarContent}
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center gap-4 flex-shrink-0 sticky top-0 z-30 shadow-sm">
            <button
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <h1 className="text-base font-bold text-slate-900 truncate leading-tight">
                  {getPageTitle()}
                </h1>
                <span className="hidden sm:inline-flex items-center text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block mt-0.5 font-medium">
                {getPageSubtitle()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button className="relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all duration-200">
                <Bell size={17} strokeWidth={1.8} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
              </button>

              <div className="w-px h-6 bg-slate-200 mx-0.5" />

              <button className="relative flex-shrink-0 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold group-hover:shadow-lg transition-all duration-200 shadow-md group-hover:scale-105">
                  AB
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
              </button>
            </div>
          </header>

          <main className={`flex-1 overflow-y-auto transition-all duration-300 ${collapsed ? 'p-4 sm:p-6' : 'p-4 sm:p-6'}`}>
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
