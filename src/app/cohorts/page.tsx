"use client";

import { useState } from "react";

const COHORTS = [
  { id:1, category:"Development", categoryColor:"bg-blue-50 text-blue-600", badge:"Most Popular", badgeColor:"bg-orange-50 border-orange-200 text-orange-600", title:"Full-Stack Web Development", subtitle:"From zero to full-stack developer in 12 weeks", instructor:{name:"Freddy Bijanja",role:"Lead Instructor",initials:"FB",color:"from-blue-500 to-cyan-400"}, status:"enrolling", startDate:"Apr 14, 2026", duration:"12 weeks", sessions:"3x / week", seats:24, seatsLeft:6, enrolled:false, progress:0, level:"Beginner", topics:["HTML & CSS","JavaScript","React","Node.js","Databases"], rating:4.9, reviews:148, gradient:"from-blue-600 to-cyan-500", featured:true },
  { id:2, category:"Design", categoryColor:"bg-violet-50 text-violet-600", badge:"New", badgeColor:"bg-violet-50 border-violet-200 text-violet-600", title:"UI/UX Design Mastery", subtitle:"Design beautiful products people love to use", instructor:{name:"IRADUKUNDA Boris",role:"Design Lead",initials:"IB",color:"from-violet-500 to-pink-400"}, status:"enrolling", startDate:"Apr 21, 2026", duration:"8 weeks", sessions:"2x / week", seats:20, seatsLeft:12, enrolled:true, progress:0, level:"All Levels", topics:["Figma","User Research","Wireframing","Prototyping","Design Systems"], rating:4.8, reviews:93, gradient:"from-violet-500 to-pink-500", featured:false },
  { id:3, category:"Data Science", categoryColor:"bg-emerald-50 text-emerald-600", badge:"In Progress", badgeColor:"bg-emerald-50 border-emerald-200 text-emerald-600", title:"Data Science & Analytics", subtitle:"Turn raw data into actionable insights", instructor:{name:"Olivier Nduwayesu",role:"Data Engineer",initials:"ON",color:"from-emerald-500 to-teal-400"}, status:"active", startDate:"Feb 3, 2026", duration:"10 weeks", sessions:"2x / week", seats:18, seatsLeft:0, enrolled:true, progress:62, level:"Intermediate", topics:["Python","Pandas","SQL","Visualization","ML Basics"], rating:4.9, reviews:76, gradient:"from-emerald-500 to-teal-400", featured:false },
  { id:4, category:"Business", categoryColor:"bg-amber-50 text-amber-600", badge:"Coming Soon", badgeColor:"bg-amber-50 border-amber-200 text-amber-600", title:"Digital Marketing Strategy", subtitle:"Build and scale brands in the digital age", instructor:{name:"Sarah Amara",role:"Marketing Expert",initials:"SA",color:"from-amber-400 to-orange-400"}, status:"upcoming", startDate:"May 5, 2026", duration:"6 weeks", sessions:"2x / week", seats:30, seatsLeft:30, enrolled:false, progress:0, level:"All Levels", topics:["SEO","Content Strategy","Paid Ads","Analytics","Social Media"], rating:null, reviews:0, gradient:"from-amber-400 to-orange-400", featured:false },
  { id:5, category:"Development", categoryColor:"bg-blue-50 text-blue-600", badge:"Limited Seats", badgeColor:"bg-rose-50 border-rose-200 text-rose-600", title:"Mobile App Development", subtitle:"Ship iOS and Android apps with React Native", instructor:{name:"Freddy Bijanja",role:"Lead Instructor",initials:"FB",color:"from-blue-500 to-cyan-400"}, status:"enrolling", startDate:"Apr 28, 2026", duration:"10 weeks", sessions:"2x / week", seats:15, seatsLeft:3, enrolled:false, progress:0, level:"Intermediate", topics:["React Native","Expo","Navigation","APIs","App Store"], rating:4.7, reviews:54, gradient:"from-rose-500 to-pink-500", featured:false },
  { id:6, category:"Personal Growth", categoryColor:"bg-sky-50 text-sky-600", badge:"Completed", badgeColor:"bg-slate-100 border-slate-200 text-slate-500", title:"Public Speaking", subtitle:"Communicate with confidence and clarity", instructor:{name:"Amara Diallo",role:"Coach",initials:"AD",color:"from-sky-400 to-blue-400"}, status:"completed", startDate:"Jan 6, 2026", duration:"4 weeks", sessions:"2x / week", seats:25, seatsLeft:0, enrolled:true, progress:100, level:"All Levels", topics:["Storytelling","Presentations","Body Language","Persuasion"], rating:5.0, reviews:41, gradient:"from-sky-400 to-blue-500", featured:false },
];

const CATS = ["All","Development","Design","Data Science","Business","Personal Growth"];
const STATS = ["All","Enrolling","Active","Upcoming","Completed"];

const SC = {
  enrolling:{ label:"Enrolling Now", pulse:true,  dot:"bg-emerald-400", text:"text-emerald-700", ring:"bg-emerald-50 border-emerald-200" },
  active:   { label:"In Progress",  pulse:false, dot:"bg-blue-400",    text:"text-blue-700",    ring:"bg-blue-50 border-blue-200" },
  upcoming: { label:"Coming Soon",  pulse:false, dot:"bg-amber-400",   text:"text-amber-700",   ring:"bg-amber-50 border-amber-200" },
  completed:{ label:"Completed",    pulse:false, dot:"bg-slate-400",   text:"text-slate-500",   ring:"bg-slate-100 border-slate-200" },
};

function SBadge({status}){
  const c=SC[status];
  return(
    <span className={"inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border "+c.ring+" "+c.text}>
      <span className={"w-1.5 h-1.5 rounded-full flex-shrink-0 "+c.dot+(c.pulse?" animate-pulse":"")}/>
      {c.label}
    </span>
  );
}

function SeatsBar({seats,seatsLeft,status}){
  if(status==="completed") return null;
  const pct=Math.round(((seats-seatsLeft)/seats)*100);
  const urgent=seatsLeft<=5&&seatsLeft>0;
  return(
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[11.5px] text-slate-500 font-medium">
          {status==="upcoming"?seats+" seats total":seatsLeft===0?"Fully booked":seatsLeft+" seats left"}
        </span>
        <span className={"text-[11.5px] font-semibold "+(urgent?"text-rose-500":"text-slate-400")}>{pct}% filled</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={"h-full rounded-full transition-all "+(pct>=90?"bg-rose-400":pct>=70?"bg-amber-400":"bg-emerald-400")} style={{width:pct+"%"}}/>
      </div>
    </div>
  );
}

function PBar({progress,gradient}){
  return(
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[11.5px] text-slate-500 font-medium">Your progress</span>
        <span className="text-[11.5px] font-bold text-slate-700">{progress}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={"h-full rounded-full bg-gradient-to-r "+gradient} style={{width:progress+"%"}}/>
      </div>
    </div>
  );
}

function CohortCard({cohort,onEnroll}){
  const [exp,setExp]=useState(false);
  return(
    <div className="group bg-white rounded-2xl border border-slate-100 hover:shadow-[0_8px_32px_rgba(0,0,0,0.09)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col">
      <div className={"h-1.5 bg-gradient-to-r "+cohort.gradient}/>
      <div className="p-5 flex flex-col gap-4 flex-1">

        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex flex-wrap gap-1.5">
            <span className={"text-[11px] font-semibold px-2.5 py-1 rounded-full "+cohort.categoryColor}>{cohort.category}</span>
            <span className={"text-[11px] font-semibold px-2.5 py-1 rounded-full border "+cohort.badgeColor}>{cohort.badge}</span>
          </div>
          <SBadge status={cohort.status}/>
        </div>

        <div>
          <h3 className="text-[15.5px] font-bold text-slate-800 leading-snug mb-1">{cohort.title}</h3>
          <p className="text-[13px] text-slate-500 leading-relaxed">{cohort.subtitle}</p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className={"w-7 h-7 rounded-full bg-gradient-to-br "+cohort.instructor.color+" flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"}>{cohort.instructor.initials}</div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-slate-700 leading-none truncate">{cohort.instructor.name}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{cohort.instructor.role}</p>
          </div>
          {cohort.rating&&(
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-amber-400 text-xs">★</span>
              <span className="text-[12px] font-bold text-slate-700">{cohort.rating}</span>
              <span className="text-[11px] text-slate-400">({cohort.reviews})</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[{i:"📅",v:cohort.startDate},{i:"⏱️",v:cohort.duration},{i:"🎯",v:cohort.level}].map(m=>(
            <div key={m.v} className="bg-slate-50 rounded-xl px-2 py-2 text-center border border-slate-100">
              <div className="text-sm leading-none mb-1">{m.i}</div>
              <div className="text-[10.5px] font-medium text-slate-600 leading-tight">{m.v}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[12.5px] text-slate-500">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {cohort.sessions} — Live sessions weekly
        </div>

        {cohort.enrolled&&cohort.progress>0
          ?<PBar progress={cohort.progress} gradient={cohort.gradient}/>
          :<SeatsBar seats={cohort.seats} seatsLeft={cohort.seatsLeft} status={cohort.status}/>
        }

        <div>
          <button onClick={()=>setExp(!exp)} className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-500 hover:text-slate-700 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={"transition-transform duration-200 "+(exp?"rotate-180":"")}><polyline points="6 9 12 15 18 9"/></svg>
            {exp?"Hide":"Show"} topics ({cohort.topics.length})
          </button>
          {exp&&(
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {cohort.topics.map(t=><span key={t} className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">{t}</span>)}
            </div>
          )}
        </div>

        <div className="flex-1"/>

        <div className="pt-1">
          {cohort.status==="completed"?(
            <div className="flex gap-2">
              <button className="flex-1 text-[13px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 py-2.5 rounded-xl transition-all">View Certificate</button>
              <button className="flex-1 text-[13px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 py-2.5 rounded-xl border border-blue-100 transition-all">Review</button>
            </div>
          ):cohort.enrolled&&cohort.status==="active"?(
            <button className={"w-full relative text-[13px] font-bold text-white py-3 rounded-xl bg-gradient-to-r "+cohort.gradient+" shadow-md hover:-translate-y-0.5 transition-all overflow-hidden"}>
              <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"/>
              <span className="relative">Continue Learning</span>
            </button>
          ):cohort.enrolled?(
            <button className="w-full text-[13px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 py-3 rounded-xl border border-emerald-200 transition-all">Enrolled — View Details</button>
          ):cohort.status==="upcoming"?(
            <button className="w-full text-[13px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 py-3 rounded-xl border border-amber-200 transition-all">Notify Me When Open</button>
          ):cohort.seatsLeft===0?(
            <button disabled className="w-full text-[13px] font-semibold text-slate-400 bg-slate-100 py-3 rounded-xl cursor-not-allowed">No seats available</button>
          ):(
            <button onClick={()=>onEnroll(cohort.id)} className={"w-full relative text-[13px] font-bold text-white py-3 rounded-xl bg-gradient-to-r "+cohort.gradient+" shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all overflow-hidden"}>
              <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"/>
              <span className="relative">Enroll Now</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FeaturedCohort({cohort,onEnroll}){
  return(
    <div className={"relative rounded-3xl bg-gradient-to-br "+cohort.gradient+" p-8 md:p-10 shadow-[0_16px_48px_rgba(37,99,235,0.22)] mb-10 overflow-hidden"}>
      <div className="absolute inset-0 opacity-[0.07]" style={{backgroundImage:"radial-gradient(circle,#ffffff 1px,transparent 1px)",backgroundSize:"24px 24px"}}/>
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl"/>
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/10 blur-3xl"/>
      <div className="relative z-10 flex flex-col lg:flex-row items-start gap-8">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-white/20 border border-white/30 text-white text-[11px] font-bold px-3 py-1 rounded-full">Featured Cohort</span>
            <SBadge status={cohort.status}/>
          </div>
          <h2 className="text-[26px] md:text-[32px] font-black text-white leading-tight mb-2">{cohort.title}</h2>
          <p className="text-white/75 text-[15px] leading-relaxed mb-5 max-w-lg">{cohort.subtitle}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {[{i:"📅",v:"Starts "+cohort.startDate},{i:"⏱️",v:cohort.duration},{i:"👥",v:cohort.seatsLeft+" seats left"},{i:"📡",v:cohort.sessions}].map(m=>(
              <div key={m.v} className="flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-full px-3 py-1.5">
                <span className="text-xs leading-none">{m.i}</span>
                <span className="text-white text-[12px] font-medium">{m.v}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white text-sm font-bold">{cohort.instructor.initials}</div>
            <div>
              <p className="text-white font-semibold text-sm">{cohort.instructor.name}</p>
              <p className="text-white/60 text-xs">{cohort.instructor.role}</p>
            </div>
            <div className="flex items-center gap-1 bg-white/15 rounded-full px-3 py-1 border border-white/20">
              <span className="text-yellow-300 text-xs">★</span>
              <span className="text-white text-xs font-bold">{cohort.rating}</span>
              <span className="text-white/50 text-xs">({cohort.reviews} reviews)</span>
            </div>
          </div>
        </div>
        <div className="lg:w-72 flex-shrink-0 w-full">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-5 mb-4">
            <p className="text-white/60 text-[11px] font-semibold uppercase tracking-widest mb-3">What you will learn</p>
            <div className="flex flex-wrap gap-2">
              {cohort.topics.map(t=><span key={t} className="text-[11.5px] font-medium bg-white/15 text-white border border-white/20 px-2.5 py-1 rounded-lg">{t}</span>)}
            </div>
          </div>
          <SeatsBar seats={cohort.seats} seatsLeft={cohort.seatsLeft} status={cohort.status}/>
          <p className="text-white/50 text-[11px] mt-1 mb-4">Only {cohort.seatsLeft} of {cohort.seats} seats remaining</p>
          <button onClick={()=>onEnroll(cohort.id)} className="w-full bg-white text-blue-600 font-black text-[14px] py-3.5 rounded-xl hover:bg-blue-50 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-lg">
            Enroll in This Cohort
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CohortsPage(){
  const [activeCat,setActiveCat]=useState("All");
  const [activeSt,setActiveSt]=useState("All");
  const [search,setSearch]=useState("");
  const [cohorts,setCohorts]=useState(COHORTS);

  const enroll=id=>setCohorts(p=>p.map(c=>c.id===id?{...c,enrolled:true}:c));

  const featured=cohorts.find(c=>c.featured);
  const filtered=cohorts
    .filter(c=>!c.featured)
    .filter(c=>activeCat==="All"||c.category===activeCat)
    .filter(c=>activeSt==="All"||c.status===activeSt.toLowerCase())
    .filter(c=>c.title.toLowerCase().includes(search.toLowerCase())||c.subtitle.toLowerCase().includes(search.toLowerCase()));

  const enrolledN=cohorts.filter(c=>c.enrolled&&c.status!=="completed").length;
  const completedN=cohorts.filter(c=>c.status==="completed").length;

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Instrument+Serif:ital@0;1&display=swap');
        .cpf{font-family:'DM Sans',sans-serif}
        .cps{font-family:'Instrument Serif',serif}
        .cpbg{background:radial-gradient(ellipse 70% 40% at 5% 0%,rgba(37,99,235,.06) 0%,transparent 55%),radial-gradient(ellipse 50% 35% at 95% 100%,rgba(6,182,212,.05) 0%,transparent 55%),#F8FAFC}
        .nosb::-webkit-scrollbar{display:none}.nosb{scrollbar-width:none}
      `}</style>

      <div className="cpf cpbg min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"/>
                <span className="text-[12px] font-semibold text-blue-600 uppercase tracking-widest">Cohorts</span>
              </div>
              <h1 className="text-[36px] md:text-[44px] font-black text-slate-900 leading-tight tracking-tight">
                Find your{" "}
                <span className="cps italic font-normal" style={{background:"linear-gradient(135deg,#2563EB,#06B6D4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>next cohort</span>
              </h1>
              <p className="text-slate-500 text-[15.5px] mt-2 max-w-xl leading-relaxed">Structured programs with real instructors, live sessions, and peers all working toward the same goal.</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              {[{v:enrolledN,l:"Enrolled"},{v:completedN,l:"Completed"},{v:cohorts.length,l:"Total"}].map(s=>(
                <div key={s.l} className="text-center bg-white border border-slate-100 rounded-2xl px-5 py-3 shadow-sm min-w-[72px]">
                  <p className="text-2xl font-black text-slate-800">{s.v}</p>
                  <p className="text-[11.5px] text-slate-500 font-medium mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {featured&&<FeaturedCohort cohort={featured} onEnroll={enroll}/>}

          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Search cohorts..." value={search} onChange={e=>setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"/>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {STATS.map(s=>(
                <button key={s} onClick={()=>setActiveSt(s)} className={"text-[12.5px] font-semibold px-3.5 py-2.5 rounded-xl border transition-all "+(activeSt===s?"bg-blue-600 text-white border-blue-600 shadow-sm":"bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600")}>{s}</button>
              ))}
            </div>
          </div>

          <div className="nosb flex gap-1.5 overflow-x-auto pb-1 mb-8">
            {CATS.map(c=>(
              <button key={c} onClick={()=>setActiveCat(c)} className={"text-[12.5px] font-semibold px-4 py-2 rounded-full border whitespace-nowrap transition-all flex-shrink-0 "+(activeCat===c?"bg-slate-900 text-white border-slate-900":"bg-white text-slate-600 border-slate-200 hover:border-slate-400")}>{c}</button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-5">
            <p className="text-[13.5px] text-slate-500"><span className="font-bold text-slate-800">{filtered.length}</span> cohort{filtered.length!==1?"s":""} found</p>
            {(activeCat!=="All"||activeSt!=="All"||search)&&(
              <button onClick={()=>{setActiveCat("All");setActiveSt("All");setSearch("");}} className="text-[12.5px] font-semibold text-blue-600 hover:underline">Clear filters</button>
            )}
          </div>

          {filtered.length===0?(
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-slate-700 mb-1">No cohorts found</h3>
              <p className="text-slate-500 text-sm">Try adjusting your filters or search term.</p>
            </div>
          ):(
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(c=><CohortCard key={c.id} cohort={c} onEnroll={enroll}/>)}
            </div>
          )}

          <div className="mt-16 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_8px_32px_rgba(37,99,235,0.25)] relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.07]" style={{backgroundImage:"radial-gradient(circle,#ffffff 1px,transparent 1px)",backgroundSize:"24px 24px"}}/>
            <div className="relative text-center md:text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-100 mb-1">Ready to start?</p>
              <h3 className="cps italic text-white text-[26px] font-normal leading-tight">Join the next cohort today</h3>
              <p className="text-white/70 text-sm mt-1.5 max-w-sm">Enrollment is open. Cohorts fill up fast — secure your spot before the window closes.</p>
            </div>
            <div className="relative flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <button className="bg-white text-blue-600 font-bold text-sm px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all">Browse Courses</button>
              <button className="bg-white/15 border border-white/30 text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-white/20 transition-all">View Schedule</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}