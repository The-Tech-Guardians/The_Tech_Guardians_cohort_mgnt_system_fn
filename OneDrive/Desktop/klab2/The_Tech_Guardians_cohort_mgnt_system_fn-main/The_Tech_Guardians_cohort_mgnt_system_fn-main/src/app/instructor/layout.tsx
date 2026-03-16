"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Users, Calendar, BookOpen, Shield, FileText, Menu, Bell, LogOut, ChevronRight, X, Layers, GraduationCap, BarChart3, CheckCircle } from "lucide-react";
import Logo from "@/components/ui/navbar/Logo";
import { tokenManager } from "@/lib/auth";
import { notificationService, Notification } from "@/services/notificationService";

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

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/instructor', match: /^\/instructor(\/)?$/ },
    { icon: GraduationCap, label: 'Courses', href: '/instructor/courses', match: /\/courses/ },
    { icon: BookOpen, label: 'Modules', href: '/instructor/modules', match: /\/modules/ },
    { icon: FileText, label: 'Lessons', href: '/instructor/lessons', match: /\/lessons/ },
    { icon: Users, label: 'Learners', href: '/instructor/learners', match: /\/learners/ },
    { icon: CheckCircle, label: 'Assessments', href: '/instructor/assessments', match: /\/assessments/ },
    { icon: Shield, label: 'Moderation', href: '/instructor/moderation', match: /\/moderation/ },
    { icon: BarChart3, label: 'Analytics', href: '/instructor/analytics', match: /\/analytics/ },
  ];

  useEffect(() => {
    const currentUser = tokenManager.getUser();
    if (!currentUser || currentUser.role !== 'INSTRUCTOR') {
      router.push('/');
      return;
    }
    setUser(currentUser);

    // Load notifications
    const loadNotifications = async () => {
      try {
        const notifs = await notificationService.getNotifications();
        setNotifications(notifs);
      } catch (error) {
        console.error('Failed to load notifications:', error);
      }
    };
    loadNotifications();
  }, [router]);

  const handleLogout = () => {
    tokenManager.logout();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`
        bg-white border-r border-gray-200 transition-all duration-300
        ${sidebarCollapsed ? 'w-16' : 'w-64'}
      `}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && <Logo />}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname.match(item.match) !== null}
              onClick={() => router.push(item.href)}
              collapsed={sidebarCollapsed}
            />
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">Instructor Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-400 hover:text-gray-600 relative"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-gray-500 text-sm">No notifications</div>
                    ) : (
                      notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{new Date(notification.createdAt).toLocaleDateString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
                <p className="text-xs text-gray-500">Instructor</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}