"use client";

import { Badge, ProgressBar, Avatar, Card, SectionTitle } from "@/components/instructor/ui/SharedUI";
import { LEARNERS, ASSIGNMENTS } from "@/lib/data/instructorData";

export default function InstructorAnalyticsPage() {
  const total = LEARNERS.length;
  const active = LEARNERS.filter(l=>l.status==="active").length;
  const atRisk = LEARNERS.filter(l=>l.status==="at-risk").length;
  const avgProg = Math.round(LEARNERS.reduce((s,l)=>s+l.progress,0)/total);
  const avgScore = Math.round(LEARNERS.reduce((s,l)=>s+l.score,0)/total);

  const tiles = [
    {label:"Active Learners",  value:active,        sub:`of ${total} total`,     delta:5 },
    {label:"At Risk",          value:atRisk,         sub:"need intervention",     delta:-2},
    {label:"Avg Progress",     value:`${avgProg}%`,  sub:"across all courses",    delta:4 },
    {label:"Avg Score",        value:`${avgScore}%`, sub:"quiz + assignment avg", delta:2 },
    {label:"Completion Rate",  value:"58%",          sub:"full-course finishers", delta:4 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        {tiles.map(t=>(
          <div key={t.label} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="text-2xl font-black text-gray-900 mb-0.5" style={{fontFamily:"'Bricolage Grotesque',sans-serif"}}>{t.value}</div>
            <div className="text-xs font-semibold text-gray-600 mb-0.5">{t.label}</div>
            <div className="text-xs text-gray-400 mb-1">{t.sub}</div>
            <div className={`text-xs font-bold ${t.delta>0?"text-green-600":"text-rose-500"}`}>
              {t.delta>0?"▲":"▼"} {Math.abs(t.delta)}% vs last week
            </div>
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-2 gap-5">
        <Card>
          <SectionTitle>Learner Progress Distribution</SectionTitle>
          <div className="space-y-3">
            {[
              {label:"90–100% (Excelling)", count:LEARNERS.filter(l=>l.progress>=90).length, color:"green"},
              {label:"70–89% (On track)",   count:LEARNERS.filter(l=>l.progress>=70&&l.progress<90).length, color:"dark"},
              {label:"40–69% (Moderate)",   count:LEARNERS.filter(l=>l.progress>=40&&l.progress<70).length, color:"amber"},
              {label:"< 40% (At risk)",     count:LEARNERS.filter(l=>l.progress<40).length, color:"rose"},
            ].map(row=>(
              <div key={row.label} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-36 flex-shrink-0">{row.label}</span>
                <div className="flex-1"><ProgressBar value={(row.count/total)*100} color={row.color}/></div>
                <span className="text-xs font-semibold text-gray-700 w-5 text-right">{row.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>Cohort Comparison</SectionTitle>
          {["2025-A","2025-B"].map(cohort=>{
            const grp = LEARNERS.filter(l=>l.cohort===cohort);
            const avg = Math.round(grp.reduce((s,l)=>s+l.progress,0)/grp.length);
            const sc  = Math.round(grp.reduce((s,l)=>s+l.score,0)/grp.length);
            return (
              <div key={cohort} className="mb-5 last:mb-0">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="dark">{cohort}</Badge>
                  <span className="text-xs text-gray-400">{grp.length} learners</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Avg Progress</span><span className="font-semibold text-gray-700">{avg}%</span></div>
                    <ProgressBar value={avg}/>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Avg Score</span><span className="font-semibold text-gray-700">{sc}%</span></div>
                    <ProgressBar value={sc} color="green"/>
                  </div>
                </div>
              </div>
            );
          })}
        </Card>

        <Card>
          <SectionTitle>Assignment Submission Rates</SectionTitle>
          <div className="space-y-4">
            {ASSIGNMENTS.map(a=>(
              <div key={a.id}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-gray-700 truncate pr-4">{a.title}</span>
                  <span className="text-gray-400 flex-shrink-0">{Math.round(a.submitted/a.total*100)}%</span>
                </div>
                <ProgressBar value={Math.round(a.submitted/a.total*100)}/>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>Top Performers</SectionTitle>
          <div className="space-y-3">
            {[...LEARNERS].sort((a,b)=>b.score-a.score).slice(0,5).map((l,i)=>(
              <div key={l.id} className="flex items-center gap-3">
                <span className="text-sm font-black text-gray-200 w-5">#{i+1}</span>
                <Avatar initials={l.name.split(" ").map(n=>n[0]).join("")}/>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">{l.name}</div>
                  <div className="text-xs text-gray-400">{l.cohort}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-black text-gray-900">{l.score}%</div>
                  <div className="text-xs text-gray-400">score</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
