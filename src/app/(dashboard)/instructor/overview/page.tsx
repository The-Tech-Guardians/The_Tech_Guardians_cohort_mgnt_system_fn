"use client";

import { useState } from "react";
import { Icon, I } from "@/components/instructor/ui/Icon";
import { Badge, ProgressBar, Btn, Card, SectionTitle } from "@/components/instructor/ui/SharedUI";
import { COURSES, ANNOUNCEMENTS, MODERATION_REQUESTS } from "@/lib/data/instructorData";

export default function InstructorOverviewPage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label:"Total Learners",  value:"70",  sub:"Across 2 cohorts",  icon:"learners",  accent:true  },
          { label:"Active Courses",  value:"2",   sub:"4 modules pending", icon:"courses",   accent:false },
          { label:"Avg Completion",  value:"58%", sub:"+4% this week",     icon:"analytics", accent:false },
          { label:"Pending Reviews", value:"12",  sub:"3 ban requests",    icon:"quiz",      accent:false },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border p-5 hover:shadow-md transition-all  bg-white border-gray-200">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3  bg-gray-100">
              <Icon d={I[s.icon as keyof typeof I]} size={16} className="text-gray-600" />
            </div>
            <div className="text-3xl font-black tracking-tight mb-0.5  text-gray-900"
              style={{fontFamily:"'Bricolage Grotesque',sans-serif"}}>{s.value}</div>
            <div className="text-sm font-semibold  text-gray-700">{s.label}</div>
            <div className={`text-xs mt-0.5 ${s.accent ? "text-gray-500" : "text-gray-400"}`}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <SectionTitle>My Courses</SectionTitle>
            <Btn variant="indigo" size="xs" ><Icon d={I.plus} size={13}/>New Course</Btn>
          </div>
          <div className="divide-y divide-gray-50">
            {COURSES.map(c => (
              <div key={c.id}>
                <div className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setExpanded(expanded===c.id ? null : c.id)}>
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black flex-shrink-0">{c.title[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-sm text-gray-900 truncate">{c.title}</span>
                      <Badge variant={c.published?"green":"gray"}>{c.published?"● Live":"Draft"}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                      <span>{c.enrolled} learners</span><span>·</span>
                      <span>{c.lessons} lessons</span><span>·</span>
                      <Badge variant="gray">{c.cohort}</Badge>
                    </div>
                    <div className="mt-2"><ProgressBar value={c.completion}/></div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xl font-black text-gray-900">{c.completion}%</div>
                    <div className="text-xs text-gray-400">done</div>
                  </div>
                  <Icon d={I.chevronD} size={15} className={`text-gray-400 transition-transform flex-shrink-0 ${expanded===c.id?"rotate-180":""}`}/>
                </div>
                {expanded===c.id && (
                  <div className="bg-gray-50 border-t border-gray-100 px-5 py-4">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Modules</div>
                    <div className="space-y-2">
                      {c.modules_data.map(m => (
                        <div key={m.id} className="flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                          <span className="text-xs font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-lg">{m.week}</span>
                          <span className="text-sm text-gray-700 flex-1 truncate">{m.title}</span>
                          <span className="text-xs text-gray-400 hidden sm:block">{m.lessons}L</span>
                          <Badge variant={m.published?"green":"amber"}>{m.published?"Live":"Draft"}</Badge>
                          <button className="text-gray-400 hover:text-gray-700 transition-colors"><Icon d={I.edit} size={13}/></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <SectionTitle>Announcements</SectionTitle>
            <div className="space-y-3">
              {ANNOUNCEMENTS.map(a => (
                <div key={a.id} className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0"/>
                  <div>
                    <p className="text-xs font-medium text-gray-800 leading-snug">{a.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={a.scope==="Cohort"?"dark":"gray"}>{a.scope}</Badge>
                      <span className="text-xs text-gray-400">{a.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <SectionTitle>Ban Requests</SectionTitle>
              <Badge variant="rose">{MODERATION_REQUESTS.length} Pending</Badge>
            </div>
            <div className="space-y-3">
              {MODERATION_REQUESTS.map(r => (
                <div key={r.id} className={`rounded-xl border p-3 ${r.urgency==="high"?"border-rose-200 bg-rose-50":"border-amber-200 bg-amber-50"}`}>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-semibold text-sm text-gray-900">{r.learner}</span>
                    <Badge variant={r.urgency==="high"?"rose":"amber"}>{r.urgency}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{r.reason}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors">
                      <Icon d={I.check} size={12}/> Approve
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1 bg-white hover:bg-gray-50 text-gray-600 text-xs font-semibold py-1.5 rounded-lg border border-gray-200 transition-colors">
                      <Icon d={I.x} size={12}/> Deny
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
