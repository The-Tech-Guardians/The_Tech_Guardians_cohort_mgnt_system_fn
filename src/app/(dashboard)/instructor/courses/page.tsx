"use client";

import { useState } from "react";
import { Icon, I } from "@/components/instructor/ui/Icon";
import { Badge, ProgressBar, Btn } from "@/components/instructor/ui/SharedUI";
import { COURSES } from "@/lib/data/instructorData";

export default function InstructorCoursesPage() {
  const [open, setOpen] = useState<string | null>(null);
  
  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Btn variant="primary" size="md"><Icon d={I.plus} size={15}/>New Course</Btn>
      </div>
      {COURSES.map(c => (
        <div key={c.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 p-5 border-b border-gray-100 flex-wrap">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center text-xl font-black flex-shrink-0">{c.title[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-black text-gray-900" style={{fontFamily:"'Bricolage Grotesque',sans-serif"}}>{c.title}</h3>
                <Badge variant={c.published?"green":"gray"}>{c.published?"● Published":"Draft"}</Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                <span>{c.enrolled} learners</span><span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline">{c.modules}M · {c.lessons}L</span>
                <Badge variant="gray">{c.cohort}</Badge>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1"><ProgressBar value={c.completion}/></div>
                <span className="text-xs font-semibold text-gray-500 flex-shrink-0">{c.completion}%</span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0 flex-wrap">
              <Btn variant="outline" size="xs"><Icon d={I.eye} size={13}/>Preview</Btn>
              <Btn variant="ghost" size="xs"><Icon d={I.edit} size={13}/>Edit</Btn>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Course Structure</span>
              <button className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                <Icon d={I.plus} size={12}/>Add Module
              </button>
            </div>
            <div className="space-y-2">
              {c.modules_data.map(m => {
                const k = `${c.id}-${m.id}`;
                const isOpen = open===k;
                return (
                  <div key={m.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={()=>setOpen(isOpen?null:k)}>
                      <span className="text-xs font-mono bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-lg">{m.week}</span>
                      <span className="text-sm font-semibold text-gray-800 flex-1">{m.title}</span>
                      <span className="text-xs text-gray-400 hidden sm:block">{m.lessons} lessons</span>
                      <Badge variant={m.published?"green":"amber"}>{m.published?"Live":"Draft"}</Badge>
                      <Icon d={I.chevronD} size={14} className={`text-gray-400 transition-transform ${isOpen?"rotate-180":""}`}/>
                    </div>
                    {isOpen && (
                      <div className="p-3 space-y-1.5 border-t border-gray-100">
                        {Array.from({length:m.lessons},(_,i)=>(
                          <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                              {i%3===0?<Icon d={I.video} size={13} className="text-gray-600"/>
                              :i%3===1?<Icon d={I.file}  size={13} className="text-gray-600"/>
                              :<span className="text-gray-500 text-xs font-bold">Md</span>}
                            </div>
                            <span className="text-sm text-gray-600 flex-1">Lesson {i+1}: {["Intro","Core Concepts","Deep Dive","Practice","Review","Project"][i%6]}</span>
                            <div className="hidden group-hover:flex items-center gap-2">
                              <button className="text-xs text-gray-700 font-semibold hover:text-gray-900">Edit</button>
                              <span className="text-gray-200">|</span>
                              <button className="text-xs text-gray-400 hover:text-gray-600">Preview</button>
                            </div>
                          </div>
                        ))}
                        <button className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold p-2 hover:text-gray-900 transition-colors">
                          <Icon d={I.plus} size={12}/>Add Lesson
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
