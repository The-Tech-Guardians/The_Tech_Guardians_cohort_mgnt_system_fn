"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Users, Calendar, BookOpen, Shield, FileText, Menu, Bell, LogOut, ChevronRight, X, Layers } from "lucide-react";
import Logo from "@/components/ui/navbar/Logo";
import { tokenManager } from "@/lib/auth";

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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
  const [userName, setUserName] = useState('Admin User');
  const [userInitials, setUserInitials] = useState('AD');
  const [userRoleLabel, setUserRoleLabel] = useState('Admin');

  // Role-based routing guard
  useEffect(() => {
    const userRole = tokenManager.getRoleFromToken();

    // Derive user display information from stored user + token
    const userData = tokenManager.getUser();
    const email = userData?.email as string | undefined;
    const name =
      (userData?.firstName || userData?.lastName)
        ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
        : email?.split('@')[0] || email || 'User';
    const initials =
      name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .toUpperCase() || 'AD';

    const roleLabel =
      userRole === 'ADMIN'
        ? 'Admin'
        : userRole === 'INSTRUCTOR'
        ? 'Instructor'
        : userRole === 'LEARNER'
        ? 'Learner'
        : 'Admin';

    setUserName(name);
    setUserInitials(initials);
    setUserRoleLabel(roleLabel);

    if (userRole) {
      switch (userRole) {
        case 'LEARNER':
          router.replace('/learner');
          break;
        case 'INSTRUCTOR':
          router.replace('/instructor');
          break;
        case 'ADMIN':
          // Allow access to admin section
          break;
        default:
          // Default to admin for unknown roles
          break;
      }
    } else {
      // No token, redirect to login
      router.replace('/login');
    }
  }, [router]);

  const view = pathname === '/admin' ? 'dashboard' : pathname.split('/').pop() || 'dashboard';

  // Sample notifications
  const notifications = [
    { id: 1, title: "New user registered", message: "John Doe just signed up", time: "2 min ago", unread: true },
    { id: 2, title: "Course completed", message: "Sarah completed React Basics", time: "1 hour ago", unread: true },
    { id: 3, title: "Ban request pending", message: "Review flagged content", time: "3 hours ago", unread: true },
    { id: 4, title: "System update", message: "Platform updated to v2.1", time: "1 day ago", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { id: "users", label: "Users", icon: Users, href: "/admin/users" },
    { id: "cohorts", label: "Cohorts", icon: Calendar, href: "/admin/cohorts" },
    { id: "courses", label: "Courses", icon: BookOpen, href: "/admin/courses" },
    { id: "modules", label: "Modules", icon: Layers, href: "/admin/modules" },
    { id: "moderation", label: "Moderation", icon: Shield, href: "/admin/moderation" },
    { id: "logs", label: "Audit Logs", icon: FileText, href: "/admin/logs" },
  ];

  const titles: Record<string, string> = {
    dashboard: "Analytics Dashboard",
    users: "User Management",
    cohorts: "Cohort Management",
    courses: "Course Management",
    modules: "Modules Management",
    moderation: "Content Moderation",
    logs: "Audit Logs",
  };

  const subtitles: Record<string, string> = {
    dashboard: "Overview of platform metrics",
    users: "Manage platform users",
    cohorts: "Create and manage cohorts",
    courses: "Manage course content",
    modules: "View modules grouped by course",
    moderation: "Review flagged content",
    logs: "System activity logs",
  };

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className={`px-5 pt-6 pb-5 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <Logo textMain="text-gray-900" />
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
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
              {userInitials}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
          </div>

          {!collapsed && (
            <>
              <div className="flex-1 text-left min-w-0">
                <div className="text-gray-900 text-xs font-semibold truncate leading-tight">{userName}</div>
                <div className="text-gray-400 text-[10px] mt-0.5 font-medium">{userRoleLabel}</div>
              </div>

              <ChevronRight
                size={14}
                className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0"
              />
            </>
          )}
        </button>

        {!collapsed && (
          <button 
            onClick={() => setLogoutPopupOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200"
          >
            <LogOut size={13} strokeWidth={1.8} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );

  const handleLogout = () => {
    setLogoutPopupOpen(false);
    tokenManager.logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-[#f8f8f8] overflow-hidden">
      {logoutPopupOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setLogoutPopupOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4" style={{ zIndex: 10000 }}>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Confirm Logout</h3>
              <button 
                onClick={() => setLogoutPopupOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={16} className="text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to logout? Your session will be ended and you'll need to login again.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setLogoutPopupOpen(false)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
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
                {userRoleLabel.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block mt-0.5 font-medium">
              {subtitles[view]}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all duration-200"
              >
                <Bell size={17} strokeWidth={1.8} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white" />
                )}
              </button>

              {notificationsOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setNotificationsOpen(false)}
                  />
                  <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{unreadCount} unread</p>
                      </div>
                      <button 
                        onClick={() => setNotificationsOpen(false)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <X size={14} className="text-gray-400" />
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                            notif.unread ? 'bg-indigo-50/30' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                              notif.unread ? 'bg-indigo-600' : 'bg-gray-300'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 truncate">{notif.title}</h4>
                              <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-1.5">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-100">
                      <button className="w-full text-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                        View all notifications
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="w-px h-6 bg-gray-200 mx-0.5" />

            <button
              className="relative flex-shrink-0 group"
              aria-label="Admin profile"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-bold
                group-hover:bg-indigo-700 transition-all duration-200 shadow-sm group-hover:shadow-md group-hover:scale-105">
                {userInitials}
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
