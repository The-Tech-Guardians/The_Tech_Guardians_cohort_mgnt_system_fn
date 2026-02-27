"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Icon, I } from "@/components/instructor/ui/Icon";
import { Badge, Btn } from "@/components/instructor/ui/SharedUI";
import { MESSAGES_DATA } from "@/lib/data/instructorData";

function NavItem({ icon, label, active, badge, onClick }: { 
  icon: string; 
  label: string; 
  active: boolean; 
  badge?: number; 
  onClick: () => void 
}) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
        ${active?"bg-gray-900 text-white":"text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`}>
      <Icon d={I[icon as keyof typeof I]} size={17} className={active?"text-white":"text-gray-400 group-hover:text-gray-700"}/>
      <span className="flex-1 text-left">{label}</span>
      {badge&&<span className="bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{badge}</span>}
    </button>
  );
}

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-sm" style={{fontFamily:"'Bricolage Grotesque',sans-serif"}}>C</span>
          </div>
          <span className="text-gray-900 font-black text-lg" style={{fontFamily:"'Bricolage Grotesque',sans-serif"}}>CohortOS</span>
        </div>
        <div className="mt-1 text-xs text-gray-400 font-medium">Instructor Portal</div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(item=>(
          <NavItem key={item.id} icon={item.icon} label={item.label}
            active={view===item.id} badge={item.badge}
            onClick={()=>{ router.push(`/instructor/${item.id}`); setSidebarOpen(false); }}/>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button onClick={()=>setProfileOpen(!profileOpen)}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">JK</div>
          <div className="flex-1 text-left min-w-0">
            <div className="text-gray-900 text-sm font-semibold truncate">Dr. James Kowalski</div>
            <div className="text-gray-400 text-xs">Instructor</div>
          </div>
          <Icon d={I.chevronR} size={14} className="text-gray-400"/>
        </button>
        <button className="mt-1 w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
          <Icon d={I.logout} size={14}/>Sign Out
        </button>
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

        <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col bg-white border-r border-gray-200">
          {SidebarContent}
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-16 flex items-center gap-4 flex-shrink-0">
            <button className="lg:hidden text-gray-500 hover:text-gray-900 transition-colors" onClick={()=>setSidebarOpen(true)}>
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

            <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:bg-gray-700 transition-colors flex-shrink-0">
              JK
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {children}
          </main>
        </div>

        {profileOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/20" onClick={()=>setProfileOpen(false)}/>
            <div className="w-80 bg-white shadow-2xl flex flex-col">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-black text-gray-900" style={{fontFamily:"'Bricolage Grotesque',sans-serif"}}>Public Profile</h3>
                <button onClick={()=>setProfileOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                  <Icon d={I.x} size={18}/>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gray-900 flex items-center justify-center text-white text-2xl font-black mx-auto mb-3">JK</div>
                  <h2 className="font-black text-gray-900 text-lg" style={{fontFamily:"'Bricolage Grotesque',sans-serif"}}>Dr. James Kowalski</h2>
                  <p className="text-sm text-gray-500">Senior Web Engineer</p>
                  <div className="flex justify-center gap-2 mt-2">
                    <Badge variant="dark">PhD CS</Badge>
                    <Badge variant="green">Verified</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    {label:"Academic Credentials", value:"PhD in Computer Science, MIT 2014"},
                    {label:"Experience",            value:"10 years — Google, Meta, Stripe"},
                    {label:"Specialization",        value:"Full-Stack Web, Systems Design"},
                  ].map(f=>(
                    <div key={f.label} className="bg-gray-50 rounded-xl p-3">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{f.label}</div>
                      <div className="text-sm text-gray-700">{f.value}</div>
                    </div>
                  ))}
                </div>
                <Btn variant="primary" size="md" className="w-full justify-center">
                  <Icon d={I.edit} size={15}/>Edit Profile
                </Btn>
                <Btn variant="ghost" size="md" className="w-full justify-center">
                  Upload CV / Resume
                </Btn>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
