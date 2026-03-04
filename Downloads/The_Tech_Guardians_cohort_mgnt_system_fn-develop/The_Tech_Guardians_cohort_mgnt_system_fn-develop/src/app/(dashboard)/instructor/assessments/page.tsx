"use client";

import { useState } from "react";
import { Icon, I } from "@/components/instructor/ui/Icon";
import { Badge, ProgressBar, Btn, SectionTitle } from "@/components/instructor/ui/SharedUI";
import { ASSIGNMENTS, QUIZZES } from "@/lib/data/instructorData";

export default function InstructorAssessmentsPage() {
  const [tab, setTab] = useState("assignments");
  
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-1.5 flex gap-1 w-fit">
        {["assignments","quizzes"].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`text-sm font-semibold px-4 py-2 rounded-xl capitalize transition-colors ${tab===t?"bg-gray-900 text-white":"text-gray-500 hover:text-gray-800"}`}>{t}</button>
        ))}
      </div>

      {tab==="assignments" && (
        <div className="space-y-4">
          <div className="flex justify-end"><Btn variant="primary" size="md"><Icon d={I.plus} size={15}/>New Assignment</Btn></div>
          {ASSIGNMENTS.map(a=>(
            <div key={a.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="font-black text-gray-900 mb-1" style={{fontFamily:"'Bricolage Grotesque',sans-serif"}}>{a.title}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="gray">{a.course}</Badge>
                    <span className="flex items-center gap-1 text-xs text-amber-600 font-medium"><Icon d={I.clock} size={12}/>Due {a.due}</span>
                  </div>
                </div>
                <Btn variant="ghost" size="xs"><Icon d={I.edit} size={13}/>Edit</Btn>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[{l:"Enrolled",v:a.total,c:"text-gray-900"},{l:"Submitted",v:a.submitted,c:"text-gray-700"},{l:"Graded",v:a.graded,c:"text-green-600"}].map(s=>(
                    <div key={s.l} className="text-center bg-gray-50 rounded-xl py-3">
                      <div className={`text-2xl font-black ${s.c}`} style={{fontFamily:"'Bricolage Grotesque',sans-serif"}}>{s.v}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{s.l}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1.5"><span>Submission rate</span><span className="font-semibold text-gray-700">{Math.round(a.submitted/a.total*100)}%</span></div>
                    <ProgressBar value={Math.round(a.submitted/a.total*100)} color="dark"/>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1.5"><span>Grading progress</span><span className="font-semibold text-gray-700">{Math.round(a.graded/a.submitted*100)}%</span></div>
                    <ProgressBar value={Math.round(a.graded/a.submitted*100)} color="green"/>
                  </div>
                </div>
                <button className="mt-4 w-full flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 py-2.5 rounded-xl transition-colors border border-gray-200">
                  Grade Submissions
                  <span className="bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full">{a.submitted-a.graded}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="quizzes" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <SectionTitle>Quiz Builder</SectionTitle>
            <Btn variant="primary" size="md"><Icon d={I.plus} size={15}/>New Quiz</Btn>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {QUIZZES.map((q,i)=>(
              <div key={i} className="border border-gray-200 rounded-2xl p-4 hover:border-gray-400 hover:shadow-sm transition-all cursor-pointer group">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h4 className="font-semibold text-sm text-gray-800 leading-snug">{q.title}</h4>
                  <Badge variant="dark">{q.type}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-gray-50 rounded-xl py-2 text-center">
                    <div className="font-black text-gray-900">{q.questions}</div>
                    <div className="text-xs text-gray-400">Questions</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl py-2 text-center">
                    <div className="font-black text-gray-700">{q.responses}</div>
                    <div className="text-xs text-gray-400">Responses</div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Pass: {q.pass}% · Retakes: {q.retakes}</span>
                  <span className="font-semibold text-green-600">Avg: {q.avg}%</span>
                </div>
                <ProgressBar value={q.avg} color={q.avg>70?"green":"amber"}/>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
