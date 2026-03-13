import Link from "next/link";
import { Stars } from "./starts";
import { Users } from "lucide-react";
import { BackendCourse } from "@/services/courseService";
import { getCohortConfig } from "@/app/courses/page";
import { FALLBACK_BACKEND_COHORTS } from "@/lib/course-data";
import { Award, BadgeCheck, Clock, PlayCircle, TrendingUp, Zap } from "lucide-react";
import { LEVEL_BADGE } from "./config/courses-api";

export function CourseCardGrid({ course }: { course: BackendCourse | any }) {
  const safeCourse = course || {};
  const safeCohort = getCohortConfig(safeCourse.cohortId, FALLBACK_BACKEND_COHORTS) || { label: 'Course', icon: Users, grad: ['#3b82f6', '#06b6d4'] };
  const cat = safeCohort;
  const Icon = (cat.icon as any) || Users;
  
  const grad1 = cat.grad ? cat.grad[0] || '#3b82f6' : '#3b82f6';
  const grad2 = cat.grad ? cat.grad[1] || '#06b6d4' : '#06b6d4';
  
  return (
    <article className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      <div className="h-36 flex items-center justify-center relative"
        style={{ background: `linear-gradient(135deg, ${grad1}18, ${grad2}18)` }}>
        <Icon size={52} color={grad1} strokeWidth={1} opacity={0.5} />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full border bg-green-100 text-green-700 border-green-200">Beginner</span>
          {safeCourse.featured && <span className="flex items-center gap-0.5 text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-900"><Award size={9} />Top</span>}
          {safeCourse.isNew && <span className="flex items-center gap-0.5 text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white"><Zap size={9} />New</span>}
        </div>
        <span className="absolute bottom-2 right-3 text-[10.5px] font-medium px-2 py-0.5 rounded-full"
          style={{ background: `${grad1}22`, color: grad1 }}>{cat.label}</span>
      </div>
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        <div className="flex flex-wrap gap-1">
          {(safeCourse.tags || []).slice(0,2).map((t: string) => (
            <span key={t} className="text-[10.5px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">{t}</span>
          ))}
        </div>
        <h3 className="text-[13.5px] font-semibold text-slate-900 leading-snug line-clamp-2">{safeCourse.title || 'Untitled Course'}</h3>
        <p className="text-[11.5px] text-slate-400 leading-relaxed line-clamp-2">{safeCourse.description || 'No description available'}</p>
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${grad1}, ${grad2})` }}>
            {safeCourse.avatar || 'TBA'}
          </span>
          <span className="text-[11px] text-slate-400">{safeCourse.instructor || 'TBA'}</span>
        </div>
        <div className="flex gap-2.5 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><Clock size={10} />{safeCourse.duration || '12 weeks'}</span>
          <span className="flex items-center gap-1"><PlayCircle size={10} />{safeCourse.lessons || 20} lessons</span>
          <span className="flex items-center gap-1"><Users size={10} />{(safeCourse.enrolled || 0).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Stars rating={safeCourse.rating || 4.5} />
          <span className="text-[11px] font-semibold text-amber-600">{safeCourse.rating || 4.5}</span>
          <span className="text-[11px] text-slate-300">({(safeCourse.reviews || 0).toLocaleString()})</span>
        </div>
        <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[14px] font-bold">
            {safeCourse.price === 0 || !safeCourse.price
              ? <span className="text-emerald-600 flex items-center gap-1"><BadgeCheck size={13} />Free</span>
              : <span className="text-slate-900">${safeCourse.price}</span>}
          </span>
          <Link href={`/course-details/${safeCourse.id}`}
            className="text-[11.5px] font-semibold px-3.5 py-1.5 rounded-lg text-white flex items-center gap-1 hover:opacity-90 active:scale-95 transition-all"
            style={{ background: `linear-gradient(135deg, ${grad1}, ${grad2})` }}>
            View Details <TrendingUp size={11} />
          </Link>
        </div>
      </div>
    </article>
  );
}
