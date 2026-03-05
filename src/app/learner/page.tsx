"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useSidebar } from "@/components/ui/SideBarContext";
import { Monitor, BookOpen, BarChart3, Bot, Gamepad2, Camera, Leaf, Smartphone, FileText, Lightbulb, TrendingUp, BookMarked, Users, Clock } from "lucide-react";
import { MiniCalendar } from "@/components/learner/MiniCalendar";

const RECOMMENDED = [
  { id:1, level:"Beginner",     levelColor:"text-emerald-600", title:"Three-month Course to Learn the Basics of Python and Start Coding",             instructor:"Alison Walsh",   instructorGrad:"from-orange-400 to-pink-400",  students:118, rating:5.0, gradient:"from-slate-700 to-slate-900",  icon: Monitor  },
  { id:2, level:"Beginner",     levelColor:"text-emerald-600", title:"Beginner's Guide to Successful Company Management: Business An...",              instructor:"Patty Kutch",    instructorGrad:"from-purple-400 to-pink-400",  students:234, rating:4.8, gradient:"from-rose-400 to-orange-300",  icon: BookOpen },
  { id:3, level:"Intermediate", levelColor:"text-amber-600",   title:"A Fascinating Theory of Probability. Practice. Application. How to Outpla...",   instructor:"Alonzo Murray",  instructorGrad:"from-blue-400 to-cyan-400",   students:57,  rating:4.9, gradient:"from-amber-500 to-yellow-400", icon: BarChart3 },
  { id:4, level:"Advanced",     levelColor:"text-rose-600",    title:"Introduction to Machine Learning and LLM. Implementation in Modern Soft...",      instructor:"Gregory Harris", instructorGrad:"from-emerald-500 to-teal-400",students:19,  rating:5.0, gradient:"from-blue-600 to-indigo-500",  icon: Bot      },
];

const MY_COURSES = [
  { id:1, title:"AI & Virtual Reality",            icon: Gamepad2,   progress:9,  total:12, avatars:["FB","IB","ON","SA","AD"], extra:17, color:"from-purple-500 to-violet-400" },
  { id:2, title:"Photography",                      icon: Camera,     progress:16, total:24, avatars:["FK","AM","PK","GH"],       extra:9,  color:"from-amber-500 to-orange-400"  },
  { id:3, title:"Business Ecosystem: Introduction", icon: Leaf,       progress:11, total:18, avatars:["ON","SA","FB","IB","AD"],  extra:11, color:"from-emerald-500 to-teal-400"  },
  { id:4, title:"React Native Development",         icon: Smartphone, progress:18, total:37, avatars:["FB","GH","AM"],            extra:8,  color:"from-blue-500 to-cyan-400"     },
];

const UPCOMING = [
  { type:"Course",   icon: FileText,  iconBg:"bg-gray-900", title:"Business Prospect Analysis",  date:"Apr 25", time:"11:00–12:00" },
  { type:"Tutoring", icon: Lightbulb, iconBg:"bg-cyan-500", title:"AI & Virtual Reality: Intro", date:"Apr 27", time:"14:30–15:30" },
];

const OVERALL = [
  { label:"Score",            value:"210", trend:"+13%", up:true,  icon: TrendingUp },
  { label:"Completed Course", value:"34h", trend:"+15%", up:true,  icon: BookMarked },
  { label:"Total Student",    value:"17",  trend:"-2%",  up:false, icon: Users      },
  { label:"Total Hours",      value:"11",  trend:"-9%",  up:false, icon: Clock      },
];

const PRODUCTIVITY = [
  { day:"Mon", Mentoring:60, SelfImprove:40, Student:50 },
  { day:"Tue", Mentoring:45, SelfImprove:70, Student:80 },
  { day:"Wed", Mentoring:55, SelfImprove:50, Student:65 },
  { day:"Thu", Mentoring:30, SelfImprove:60, Student:45 },
  { day:"Fri", Mentoring:70, SelfImprove:45, Student:75 },
  { day:"Sat", Mentoring:40, SelfImprove:55, Student:60 },
  { day:"Sun", Mentoring:50, SelfImprove:65, Student:85 },
];

const AVATAR_COLORS = [
  "from-blue-500 to-cyan-400",
  "from-violet-500 to-pink-400",
  "from-emerald-500 to-teal-400",
  "from-amber-400 to-orange-400",
  "from-rose-500 to-pink-500",
];

// ── Sub-components ──────────────────────────────────────────

function CourseThumbnail({ course }: { course: typeof RECOMMENDED[0] }) {
  const Icon = course.icon;
  return (
    <div className={`relative h-[110px] sm:h-[120px] rounded-xl overflow-hidden bg-gradient-to-br ${course.gradient} flex items-center justify-center`}>
      <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-white opacity-75" />
      <button className="absolute top-2 right-2 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
        <div className="flex items-center justify-between">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white ${course.levelColor}`}>{course.level}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-white text-[10px] font-medium flex items-center gap-0.5">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              </svg>
              {course.students}
            </span>
            <span className="text-white text-[10px] font-medium">⭐{course.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AvatarStack({ avatars, extra }: { avatars: string[]; extra: number }) {
  return (
    <div className="flex items-center flex-shrink-0">
      <div className="flex -space-x-1.5">
        {avatars.slice(0, 4).map((a, i) => (
          <div key={i} className={`w-6 h-6 rounded-full bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} border-2 border-white flex items-center justify-center text-white text-[8px] font-bold`}>
            {a}
          </div>
        ))}
      </div>
      {extra > 0 && (
        <div className="ml-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">+{extra}</div>
      )}
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────
export default function LearnerDashboardPage() {
  const { collapsed } = useSidebar();

  const today   = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    // Outer wrapper: stack on mobile, side-by-side on xl
    <div className={`flex flex-col xl:flex-row gap-5 min-h-full ${collapsed ? "p-3 sm:p-4 xl:p-5" : ""}`}>

      {/* ══════════ LEFT COLUMN ══════════ */}
      <div className="flex-1 min-w-0 space-y-5">

        {/* Top courses */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-bold text-gray-900">Top courses you may like</h2>
            <button className="text-[12px] font-semibold text-blue-600 hover:underline">View all</button>
          </div>
          {/* 1 col on small mobile, 2 cols on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RECOMMENDED.map(c => (
              <div key={c.id} className="group cursor-pointer">
                <CourseThumbnail course={c} />
                <div className="pt-2.5">
                  <p className="text-[12.5px] font-semibold text-gray-800 leading-snug mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {c.title}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${c.instructorGrad} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-[7px] font-bold">
                        {c.instructor.split(" ").map((n: string) => n[0]).join("")}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium truncate">{c.instructor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Courses */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-bold text-gray-900">My Courses</h2>
            <button className="text-[12px] font-semibold text-blue-600 hover:underline">View all</button>
          </div>
          <div className="space-y-2">
            {MY_COURSES.map(c => {
              const pct  = Math.round((c.progress / c.total) * 100);
              const Icon = c.icon;
              return (
                <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">{c.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${c.color}`} style={{ width: `${pct}%` }} />
                      </div>
                      {/* Hide label on very small screens */}
                      <span className="hidden sm:inline text-[10.5px] text-gray-400 font-medium flex-shrink-0">
                        Sessions completed: {c.progress}/{c.total}
                      </span>
                      <span className="sm:hidden text-[10.5px] text-gray-400 font-medium flex-shrink-0">
                        {c.progress}/{c.total}
                      </span>
                    </div>
                  </div>
                  {/* Hide avatar stack on very small screens */}
                  <div className="hidden sm:flex">
                    <AvatarStack avatars={c.avatars} extra={c.extra} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT COLUMN content shown inline on mobile/tablet, hidden on xl ── */}
        <div className="xl:hidden space-y-4">
          <RightColumnContent dayName={dayName} dateStr={dateStr} />
        </div>

      </div>

      {/* ══════════ RIGHT COLUMN (sticky on xl only) ══════════ */}
      <div className="hidden xl:block w-[280px] 2xl:w-[300px] flex-shrink-0">
        <div className="space-y-4">
          <RightColumnContent dayName={dayName} dateStr={dateStr} />
        </div>
      </div>

    </div>
  );
}

function RightColumnContent({ dayName, dateStr }: { dayName: string; dateStr: string }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-black text-gray-900 leading-tight">{dayName}</h2>
          <p className="text-[11.5px] text-gray-400 font-medium">{dateStr}</p>
        </div>
      </div>

      <MiniCalendar />

     
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2.5">
        {UPCOMING.map((u, i) => {
          const Icon = u.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-sm flex items-center gap-3 cursor-pointer hover:shadow-md transition-all group">
              <div className={`w-9 h-9 rounded-xl ${u.iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider">{u.type}</p>
                <p className="text-[12.5px] font-bold text-gray-800 leading-tight truncate">{u.title}</p>
                <div className="flex items-center gap-2.5 mt-0.5">
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {u.date}
                  </span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {u.time}
                  </span>
                </div>
              </div>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          );
        })}
      </div>

      {/* Overall Information */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <h3 className="text-[13.5px] font-bold text-gray-900 mb-3">Overall Information</h3>
        {/* Always 2 cols */}
        <div className="grid grid-cols-2 gap-2.5">
          {OVERALL.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="text-[10px] font-semibold text-gray-500 leading-tight">{s.label}</span>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-[18px] font-black text-gray-900 leading-none">{s.value}</span>
                  <span className={`text-[10px] font-bold mb-0.5 ${s.up ? "text-emerald-500" : "text-rose-500"}`}>
                    {s.up ? "▲" : "▼"} {s.trend}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Productivity chart */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13.5px] font-bold text-gray-900">Productivity</h3>
          <button className="flex items-center gap-0.5 text-[11px] font-semibold text-blue-600 hover:underline">
            View details
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={PRODUCTIVITY} barSize={5} barCategoryGap="28%" margin={{ top:0, right:0, left:-28, bottom:0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize:9, fill:"#94A3B8", fontWeight:600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:9, fill:"#94A3B8" }} tickFormatter={(v: number) => `${v}%`} domain={[0,100]} ticks={[0,25,50,75,90]} />
            <Tooltip
              contentStyle={{ fontSize:10, borderRadius:8, border:"1px solid #E2E8F0", padding:"6px 10px" }}
              labelStyle={{ fontWeight:700, color:"#1E293B", marginBottom:2 }}
            />
            <Bar dataKey="Mentoring"   fill="#C4B5FD" radius={[3,3,0,0]} />
            <Bar dataKey="SelfImprove" fill="#1E293B"  radius={[3,3,0,0]} />
            <Bar dataKey="Student"     fill="#38BDF8"  radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-3 mt-1">
          {[
            { c:"bg-violet-300", l:"Mentoring"    },
            { c:"bg-slate-900",  l:"Self Improve" },
            { c:"bg-sky-400",    l:"Student"      },
          ].map(l => (
            <div key={l.l} className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-sm ${l.c}`} />
              <span className="text-[10px] text-gray-400 font-medium">{l.l}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}