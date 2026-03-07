"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Icon, I } from "@/components/instructor/ui/Icon";
import { Badge, Btn } from "@/components/instructor/ui/SharedUI";
import { MESSAGES_DATA } from "@/lib/data/instructorData";
import InstructorProfileSidebar from "@/components/profile/instructor-profile/InstructorProfileSidebar";
import { ChevronRight, Menu } from "lucide-react";
import Logo from "@/components/ui/navbar/Logo";
import { tokenManager } from "@/lib/auth";

function NavItem({ icon, label, active, badge, onClick, collapsed }: { 
  icon: string; 
  label: string; 
  active: boolean; 
  badge?: number; 
  onClick: () => void;
  collapsed: boolean;
}) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
        ${active?"bg-gradient-to-r from-blue-600 to-cyan-500 text-white":"text-gray-500 hover:bg-indigo-100 hover:text-gray-900"}
        ${collapsed ? "justify-center" : ""}`}>
      <Icon d={I[icon as keyof typeof I]} size={17} className={active?"text-white":"text-gray-400 group-hover:text-gray-700"}/>
      {!collapsed && <span className="flex-1 text-left">{label}</span>}
      {badge && !collapsed && <span className="bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{badge}</span>}
    </button>
  );
}

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userName, setUserName] = useState('Instructor');
  const [userInitials, setUserInitials] = useState('IN');
  const [userRoleLabel, setUserRoleLabel] = useState('Instructor');

  // Role-based routing guard
  useEffect(() => {
    const userRole = tokenManager.getRoleFromToken();

    const userData = tokenManager.getUser();
    const email = userData?.email as string | undefined;
    const name =
      (userData?.firstName || userData?.lastName)
        ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
        : email?.split('@')[0] || email || 'Instructor';
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

  const view = pathname.split('/').pop() || 'overview';
  const totalUnread = MESSAGES_DATA.reduce((s,m)=>s+m.unread,0);

  const nav = [
    { id:"overview",    label:"Overview",    icon:"dashboard" },
    { id:"courses",     label:"My Courses",  icon:"courses"   },
    { id:"learners",    label:"Learners",    icon:"learners"  },
    { id:"assessments", label:"Assessments", icon:"quiz"      },
    { id:"analytics",   label:"Analytics",   icon:"analytics" },
    { id:"messages",    label:"Messages",    icon:"messages", badge: totalUnread||undefined },
  ];

  const titles: Record<string, string> = {
    instructor:"Dashboard", overview:"Dashboard", courses:"My Courses", learners:"Learner Management",
    assessments:"Assessments", analytics:"Analytics", messages:"Messages",
  };

  const SidebarContent = (
    <>
      <div className={`px-5 pt-6 pb-5 flex items-center justify-between`}>
        {!collapsed && (
          <div className="flex items-center gap-3 mb-0.5">
            <div className="text-[10px]"><Logo/></div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-8 h-8 items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
        >
          {collapsed ? <Menu size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(item=>(
          <NavItem key={item.id} icon={item.icon} label={item.label}
            active={view===item.id} badge={item.badge} collapsed={collapsed}
            onClick={()=>{ router.push(`/instructor/${item.id}`); setSidebarOpen(false); }}/>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button onClick={()=>setProfileOpen(!profileOpen)}
          className={`w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-100 transition-colors ${collapsed ? "justify-center" : ""}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {userInitials}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 text-left min-w-0">
                <div className="text-gray-900 text-sm font-semibold truncate">{userName}</div>
                <div className="text-gray-400 text-xs">{userRoleLabel}</div>
              </div>
              <Icon d={I.chevronR} size={14} className="text-gray-400"/>
            </>
          )}
        </button>
        {!collapsed && (
          <button className="mt-1 w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-700 hover:bg-red-100 rounded-xl transition-colors">
            <Icon d={I.logout} size={14}/>Sign Out
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Geist:wght@300;400;500;600&display=swap');
        * { font-family: 'Geist', system-ui, sans-serif; box-sizing: border-box; }
      `}</style>

      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden" onClick={()=>setSidebarOpen(false)}>
            <div className="absolute inset-0 bg-black/20"/>
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-2xl flex flex-col z-50" onClick={e=>e.stopPropagation()}>
              {SidebarContent}
            </div>
          </div>
        )}

        <aside className={`hidden lg:flex flex-shrink-0 flex-col bg-white border-r border-gray-200 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
          {SidebarContent}
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-16 flex items-center gap-4 flex-shrink-0">
            <button className="lg:hidden text-gray-500 hover:text-indigo-600 transition-colors" onClick={()=>setSidebarOpen(true)}>
              <Icon d={I.menu} size={20}/>
            </button>

            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg font-black text-gray-900 truncate" style={{fontFamily:"'Bricolage Grotesque',sans-serif"}}>
                {titles[view]}
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">COHORT-2025-A · COHORT-2025-B</p>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 border border-green-200 px-2.5 py-1.5 rounded-xl">
              <Icon d={I.lock} size={12}/>2FA Active
            </div>

            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
              <Icon d={I.bell} size={18}/>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"/>
            </button>

            <button onClick={()=>setProfileOpen(!profileOpen)} className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:bg-gray-700 transition-colors flex-shrink-0">
              {userInitials}
            </button>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {children}
          </main>
        </div>

        <InstructorProfileSidebar isOpen={profileOpen} onClose={()=>setProfileOpen(false)} />
      </div>
    </>
  );
}
