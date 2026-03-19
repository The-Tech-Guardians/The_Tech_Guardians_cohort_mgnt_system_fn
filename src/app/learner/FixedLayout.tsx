"use client";

import { useState, createContext, useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BookOpen, TrendingUp, Megaphone, Home, Menu, Bell, LogOut, ChevronRight, Users } from "lucide-react";
import ProfileSidebar from '@/components/profile/learner-profile/ProfileSidebar';
import Logo from "@/components/ui/navbar/Logo";
import { tokenManager } from "@/lib/auth";
import { notificationService, Notification } from "@/services/notificationService";

const SidebarContext = createContext({ collapsed: false });

export const useSidebar = () => useContext(SidebarContext);

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
          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm"
          : "text-gray-400 hover:bg-cyan-500 hover:text-gray-800"
        }
        ${collapsed ? "justify-center" : ""}
      `}
    >

      {active && !collapsed && (
        <span className="absolute left-0 top-0 bottom-2 w-2.5 h-full bg-white  rounded-l-2xl" />
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

export default function LearnerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState({ name: 'Loading...', initials: 'L' });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(true);
  const [checkingProfile, setCheckingProfile] = useState(true);

  // ALL HOOKS AT TOP LEVEL BEFORE ANY EARLY RETURNS
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const userId = tokenManager.getUserIdFromToken();
        if (!userId) {
          router.replace('/login');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${tokenManager.getToken()}`,
          },
        });

        if (!response.ok) {
          router.replace('/application_process');
          return;
        }

        const data = await response.json();
        if (!data.profile) {
          router.replace('/application_process');
        } else {
          setHasProfile(true);
        }
      } catch (error) {
        console.error('Profile check failed:', error);
        router.replace('/application_process');
      } finally {
        setCheckingProfile(false);
      }
    };

    checkProfile();
  }, [router]);

  useEffect(() => {
    if (checkingProfile || !hasProfile) return;
    const userData = tokenManager.getUser?.() || null;
    if (userData) {
      const name =
        (userData.firstName || userData.lastName)
          ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
          : userData.name || userData.email?.split('@')[0] || 'User';
      const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U';
      setUser({ name, initials });
    }
  }, [checkingProfile, hasProfile]);

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
    if (checkingProfile || !hasProfile) return;
    if (notificationsOpen) {
      fetchNotifications();
    }
  }, [notificationsOpen, checkingProfile, hasProfile]);

  // Fetch unread count on mount
  useEffect(() => {
    if (checkingProfile || !hasProfile) return;
    const loadUnreadCount = async () => {
      try {
        const response = await notificationService.getUnreadCount();
        setUnreadCount(response.unreadCount);
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      }
    };
    loadUnreadCount();
  }, [checkingProfile, hasProfile]);

  // EARLY RETURNS AFTER ALL HOOKS
  if (checkingProfile) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-50">Checking profile...</div>;
  }

  if (!hasProfile) {
    return null;
  }

  // Helper function to format notification time
  const formatNotificationTime = (createdAt?: string) => {
    if (!createdAt) return 'Just now';
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} h ago`;
    if (diffDays < 7) return `${diffDays} d ago`;
    return date.toLocaleDateString();
  };

  const handleLogout = () => {
    tokenManager.logout?.();
    setShowLogoutModal(false);
    router.push('/login');
  };

  const view = pathname.split('/').pop() || 'learner';

  const nav = [
    { id: "learner",       label: "Home",          icon: Home      },
    { id: "cohorts",       label: "Cohorts",       icon: Users     },
    { id: "my-courses",    label: "My Courses",    icon: BookOpen  },
    { id: "progress",      label: "Progress",      icon: TrendingUp},
    { id: "announcements", label: "Announcements", icon: Megaphone },
  ];

  const titles: Record<string, string> = {
    learner:       "Dashboard",
    cohorts:       "Available Cohorts",
    "my-courses":  "My Courses",
    progress:      "My Progress",
    announcements: "Announcements",
  };

  const subtitles: Record<string, string> = {
    learner:       `Welcome back, ${user.name.split(' ')[0]}`,
    cohorts:       "Browse and join available cohorts",
    "my-courses":  "Browse your enrolled courses",
    progress:      "Track your learning journey",
    announcements: "Stay up to date",
  };

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className={`px-5 pt-6 pb-5 flex items-center justify-between ${collapsed ? '' : 'max-w-72 mx-auto'}`}>
        {!collapsed && (
          <div className="flex items-center gap-3 mb-0.5">
            <Logo className="h-6 w-auto" textMain="text-gray-900" />
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
        {!collapsed && <NavSection label="Navigate" />}
        {nav.map(item => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={view === item.id}
            collapsed={collapsed}
            onClick={() => {
              router.push(`/learner${item.id === 'learner' ? '' : `/${item.id}`}`);
              setSidebarOpen(false);
            }}
          />
        ))}
      </nav>

      <div className="mx-4 h-px bg-gray-100" />

      <div className="p-3 space-y-1">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className={`w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-gray-50 transition-all duration-200 group ${collapsed ? 'justify-center' : ''}`}
        >
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
              {user.initials}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
          </div>

          {!collapsed && (
            <>
              <div className="flex-1 text-left min-w-0">
                <div className="text-gray-900 text-xs font-semibold truncate leading-tight">{user.name}</div>
                <div className="text-gray-400 text-[10px] mt-0.5 font-medium">Active · Online</div>
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
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
          >
            <LogOut size={13} strokeWidth={1.8} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <SidebarContext.Provider value={{ collapsed }}>
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

        <aside className={`hidden lg:flex flex-shrink-0 flex-col bg-white border-r border-gray-100 shadow-sm transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}>
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

            <button
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all lg:ml-4"
              onClick={() => router.push('/')}
              title="Back to Home"
            >
              <Home size={18} strokeWidth={1.8} />
            </button>

            <div className="flex-1 min-w-0">

              <div className="flex items-baseline gap-2">
                <h1 className="text-base font-bold text-gray-900 truncate leading-tight">
                  {titles[view]}
                </h1>
                <span className="hidden sm:inline-flex items-center text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  Online
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
                        <button 
                          onClick={() => {
                            router.push('/learner/announcements');
                            setNotificationsOpen(false);
                          }}
                          className="w-full text-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                          View all announcements
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="w-px h-6 bg-gray-200 mx-2" />

              <button
                onClick={() => setProfileOpen(true)}
                className="relative flex-shrink-0 group"
                aria-label="Open profile"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold
                  group-hover:bg-indigo-700 transition-all duration-200 shadow-sm group-hover:shadow-md group-hover:scale-105">
                  {user.initials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
              </button>
            </div>
          </header>

          <main className={`flex-1 overflow-y-auto transition-all duration-300 p-6 ${collapsed ? '' : ''}`}>
            {children}
          </main>
        </div>

        <ProfileSidebar isOpen={profileOpen} onClose={() => setProfileOpen(false)} />

        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
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
      </div>
    </SidebarContext.Provider>
  );
}
