"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Users, Calendar, BookOpen, Shield, FileText, Menu, Bell, LogOut, ChevronRight, X, Layers, TrendingUp, ChevronDown } from "lucide-react";

import Logo from "@/components/ui/navbar/Logo";
import { tokenManager } from "@/lib/auth";
import { notificationService, Notification } from "@/services/notificationService";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";


function NavItem({ 
  icon: Icon, 
  label, 
  active, 
  onClick, 
  collapsed, 
  isExpandable, 
  children, 
  expanded,
  onToggleExpand,
  router,
  sidebarOpen,
  setSidebarOpen,
  currentReportPath
}: { 
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>; 
  label: string; 
  active: boolean; 
  onClick: () => void;
  collapsed: boolean;
  isExpandable?: boolean;
  children?: any[];
  expanded?: boolean;
  onToggleExpand?: () => void;
  router: any;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentReportPath: string;
}) {
  return (
    <div>
      <button
        onClick={isExpandable ? onToggleExpand : onClick}
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
            {isExpandable ? (
              <ChevronDown 
                size={13} 
                className={`transition-transform duration-200 ${
                  expanded ? 'rotate-180' : ''
                } ${active ? "text-white" : "text-gray-400"}`}
              />
            ) : active ? (
              <ChevronRight size={13} className="text-white/50" />
            ) : null}
          </>
        )}
      </button>
      
      {isExpandable && !collapsed && expanded && children && (
        <div className="ml-4 mt-1 space-y-1">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => {
                router.push(child.href);
                if (sidebarOpen) setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium
                transition-all duration-200 group
                ${currentReportPath === child.id
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                }
              `}
            >
              <div className={`w-2 h-2 rounded-full ${
                currentReportPath === child.id ? "bg-indigo-600" : "bg-gray-300"
              }`} />
              <span className="flex-1 text-left">{child.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NavSection({ label }: { label: string }) {
  return (
    <div className="px-3.5 pt-5 pb-1.5">
      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.12em]">{label}</span>
    </div>
  );
}

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [userName, setUserName] = useState('Instructor');
  const [userInitials, setUserInitials] = useState('IN');
  const [userRoleLabel, setUserRoleLabel] = useState('Instructor');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    setNotificationsLoading(true);
    try {
      const response = await notificationService.getNotifications(1, 10);
      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  // Fetch notifications when the notification dropdown is opened
  useEffect(() => {
    if (notificationsOpen) {
      fetchNotifications();
    }
  }, [notificationsOpen]);

  // Fetch unread count on mount
  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const response = await notificationService.getUnreadCount();
        setUnreadCount(response.unreadCount);
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      }
    };
    loadUnreadCount();
  }, []);

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
        .toUpperCase() || 'IN';

    const roleLabel =
      userRole === 'ADMIN'
        ? 'Admin'
        : userRole === 'INSTRUCTOR'
        ? 'Instructor'
        : userRole === 'LEARNER'
        ? 'Learner'
        : 'Instructor';

    setUserName(name);
    setUserInitials(initials);
    setUserRoleLabel(roleLabel);

    if (userRole) {
      switch (userRole) {
        case 'LEARNER':
          router.replace('/learner');
          break;
        case 'ADMIN':
          router.replace('/admin');
          break;
        case 'INSTRUCTOR':
          // Allow access to instructor section
          break;
        default:
          // Default to learner for unknown roles
          router.replace('/learner');
          break;
      }
    } else {
      // No token, redirect to login
      router.replace('/login');
    }
  }, [router]);

  const view = pathname === '/instructor' ? 'overview' : pathname.split('/').pop() || 'overview';

  // Check if current path is under reports
  const isReportsPath = pathname.startsWith('/instructor/reports');
  const currentReportPath = isReportsPath ? pathname.split('/').pop() || 'reports' : 'overview';

  // Toggle expandable menu
  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  // Auto-expand reports if we're on a reports subpage
  useEffect(() => {
    if (isReportsPath && !expandedMenus.includes('reports')) {
      setExpandedMenus(['reports']);
    }
  }, [isReportsPath]);

  const nav = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard, href: "/instructor" },
    { id: "courses", label: "My Courses", icon: BookOpen, href: "/instructor/courses" },
    { id: "learners", label: "Learners", icon: Users, href: "/instructor/learners" },
    { id: "modules", label: "Modules", icon: Layers, href: "/instructor/modules" },
    { id: "lessons", label: "Lessons", icon: FileText, href: "/instructor/lessons" },
    { id: "assessments", label: "Assessments", icon: Shield, href: "/instructor/assessments" },
    { 
      id: "reports", 
      label: "Reports", 
      icon: TrendingUp, 
      href: "/instructor/reports",
      isExpandable: true,
      children: [
        { id: "quiz", label: "Quiz Reports", href: "/instructor/reports/quiz" },
        { id: "assessment", label: "Assessment Reports", href: "/instructor/reports/assessment" },
        { id: "performance", label: "Performance Reports", href: "/instructor/reports/performance" },
        { id: "learner", label: "Learner Reports", href: "/instructor/reports/learner" },
        { id: "course", label: "Course Reports", href: "/instructor/reports/course" },
        { id: "engagement", label: "Engagement Reports", href: "/instructor/reports/engagement" },
      ]
    },
  ];

  const titles: Record<string, string> = {
    overview: "Instructor Dashboard",
    courses: "Course Management",
    learners: "Learner Management",
    modules: "Module Management",
    lessons: "Lesson Management",
    assessments: "Assessment Management",
    reports: "Reports & Analytics",
    quiz: "Quiz Reports",
    assessment: "Assessment Reports",
    performance: "Performance Reports",
    learner: "Learner Reports",
    course: "Course Reports",
    engagement: "Engagement Reports",
  };

  const subtitles: Record<string, string> = {
    overview: "Welcome back! Here's what's happening with your courses",
    courses: "Manage and organize your course content",
    learners: "Track learner progress and performance",
    modules: "Organize course content by modules",
    lessons: "Create and edit lesson content",
    assessments: "Create and manage assessments",
    reports: "Generate comprehensive reports and insights",
    quiz: "Quiz performance and analytics",
    assessment: "Assessment results and analysis",
    performance: "Overall performance metrics and trends",
    learner: "Individual learner progress and analytics",
    course: "Course completion and engagement metrics",
    engagement: "User engagement and activity analytics",
  };

  const formatNotificationTime = (createdAt: string) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className={`px-5 pt-6 pb-5 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <Logo textMain="text-gray-900" />
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
        {!collapsed && <NavSection label="Instructor Panel" />}
        {nav.map(item => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={view === item.id || (item.isExpandable && isReportsPath ? true : false)}
            collapsed={collapsed}
            isExpandable={item.isExpandable}
            children={item.children}
            expanded={item.isExpandable && expandedMenus.includes(item.id)}
            onToggleExpand={() => item.isExpandable && toggleMenu(item.id)}
            router={router}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            currentReportPath={currentReportPath}
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
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200"
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
    <AuthProvider>
      <ToastProvider>
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
                      {notificationsLoading ? (
                        <div className="p-4 text-center text-gray-500">Loading...</div>
                      ) : notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id}
                            className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                              !notif.isRead ? 'bg-indigo-50/30' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                !notif.isRead ? 'bg-indigo-600' : 'bg-gray-300'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-900 truncate">{notif.title}</h4>
                                <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                                <p className="text-xs text-gray-400 mt-1.5">{formatNotificationTime(notif.createdAt)}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">No notifications</div>
                      )}
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
              aria-label="Instructor profile"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xs
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
      </ToastProvider>
    </AuthProvider>
  );
}

