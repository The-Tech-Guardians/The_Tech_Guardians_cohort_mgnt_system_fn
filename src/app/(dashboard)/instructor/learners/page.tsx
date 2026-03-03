"use client";

import { useState } from "react";
import { Icon, I } from "@/components/instructor/ui/Icon";
import { Badge, ProgressBar, Avatar, Card, SectionTitle, Btn } from "@/components/instructor/ui/SharedUI";
import { LEARNERS, SC } from "@/lib/data/instructorData";

export default function InstructorLearnersPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = LEARNERS.filter(l => {
    const mf = filter==="all"||l.status===filter||l.cohort===filter;
    const ms = l.name.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });
  const sel = LEARNERS.find(l=>l.id===selected);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-44">
          <Icon d={I.search} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search learners..."
            className="w-full text-sm border border-gray-200 rounded-xl pl-8 pr-3 py-2 outline-none focus:border-gray-400 transition"/>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["all","active","at-risk","inactive","2025-A","2025-B"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors capitalize
                ${filter===f?"bg-indigo-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <SectionTitle>{filtered.length} Learners</SectionTitle>
            <span className="text-xs text-gray-400">{LEARNERS.filter(l=>l.status==="at-risk").length} at risk</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Learner","Cohort","Progress","Status","Last Active",""].map(h=>(
                    <th key={h} className="text-left text-xs font-bold text-gray-400 px-4 py-3 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(l=>(
                  <tr key={l.id} onClick={()=>setSelected(selected===l.id?null:l.id)}
                    className={`cursor-pointer transition-colors ${selected===l.id?"bg-gray-50":"hover:bg-gray-50/70"}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={l.name.split(" ").map(n=>n[0]).join("")}/>
                        <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">{l.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant="gray">{l.cohort}</Badge></td>
                    <td className="px-4 py-3 min-w-36">
                      <div className="flex items-center gap-2">
                        <div className="flex-1"><ProgressBar value={l.progress} color={l.progress>70?"green":l.progress>40?"amber":"rose"}/></div>
                        <span className="text-xs font-semibold text-gray-600 w-8">{l.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant={SC[l.status as keyof typeof SC] as "dark" | "gray" | "green" | "rose" | "indigo" | "amber"}>{l.status}</Badge></td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{l.lastSeen}</td>
                    <td className="px-4 py-3"><button className="text-gray-400 hover:text-gray-700"><Icon d={I.eye} size={15}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Card>
          {sel ? (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <Avatar initials={sel.name.split(" ").map(n=>n[0]).join("")} size="lg"/>
                <div>
                  <div className="font-black text-gray-900" style={{fontFamily:"'Bricolage Grotesque',sans-serif"}}>{sel.name}</div>
                  <Badge variant={SC[sel.status as keyof typeof SC] as "dark" | "gray" | "green" | "rose" | "indigo" | "amber"}>{sel.status}</Badge>
                </div>
              </div>
              <div className="space-y-1 mb-5">
                {[{label:"Cohort",value:sel.cohort},{label:"Progress",value:`${sel.progress}%`},{label:"Avg Score",value:`${sel.score}%`},{label:"Submissions",value:`${sel.submissions}/6`},{label:"Last Active",value:sel.lastSeen}].map(item=>(
                  <div key={item.label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-xs text-gray-400 font-medium">{item.label}</span>
                    <span className="text-xs font-semibold text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                {sel.status==="at-risk"&&<Btn variant="danger" size="sm" className="flex-1 justify-center"><Icon d={I.flag} size={13}/>Flag</Btn>}
                <Btn variant="ghost" size="sm" className="flex-1 justify-center"><Icon d={I.messages} size={13}/>Message</Btn>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Icon d={I.learners} size={36} className="text-gray-200 mb-3"/>
              <p className="text-sm text-gray-400 font-medium">Select a learner to view details</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
