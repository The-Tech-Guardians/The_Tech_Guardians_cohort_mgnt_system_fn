import Link from "next/link";
import { Stars } from "./starts";
import { Users } from "lucide-react";
import { getCohortConfig } from "@/app/courses/page";
import { FALLBACK_BACKEND_COHORTS } from "@/lib/course-data";
import { Award, BadgeCheck, Clock, PlayCircle, TrendingUp, Zap } from "lucide-react";
import { LEVEL_BADGE } from "./config/courses-api";

export function CourseCardList({ course }: { course: any }) {
  const safeCourse = course || {};
  const safeCohort = getCohortConfig(safeCourse.cohortId, FALLBACK_BACKEND_COHORTS) || { label: 'Course', icon: Users, grad: ['#3b82f6', '#06b6d4'] };
  const cat = safeCohort;
  const Icon = (cat.icon as any) || Users;
  
  const grad1 = cat.grad ? cat.grad[0] || '#3b82f6' : '#3b82f6';
  const grad2 = cat.grad ? cat.grad[1] || '#06b6d4' : '#06b6d4';
  
  return (
    <article className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-200 flex gap-0 overflow-hidden">
      <div className="w-36 flex-shrink-0 flex items-center justify-center relative"
        style={{ background: `linear-gradient(135deg, ${grad1}18, ${grad2}18)` }}>
        <Icon size={40} color={grad1} strokeWidth={1} opacity={0.5} />
        {safeCourse.featured && <span className="absolute top-2 left-2 flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-900"><Award size={8} />Top</span>}
        {safeCourse.isNew && <span className="absolute top-2 right-2 flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500 text-white"><Zap size={8} />New</span>}
      </div>
      <div className="flex flex-1 items-center gap-6 px-5 py-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full border ${LEVEL_BADGE[safeCourse.level || 'Beginner']}`}>{safeCourse.level || 'Beginner'}</span>
            <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${grad1}15`, color: grad1 }}>{cat.label}</span>
          </div>
          <h3 className="text-[14px] font-semibold text-slate-900 leading-snug truncate">{safeCourse.title}</h3>
          <p className="text-[12px] text-slate-400 mt-0.5 line-clamp-1">{safeCourse.description}</p>
          <div className="flex items-center gap-3 mt-1.5 text-[11.5px] text-slate-400">
            <span className="flex items-center gap-1"><Clock size={10} />{safeCourse.duration || "12 weeks"}</span>
            <span className="flex items-center gap-1"><PlayCircle size={10} />{safeCourse.lessons || "20"} lessons</span>
            <span className="flex items-center gap-1"><Users size={10} />{(safeCourse.enrolled || 0).toLocaleString()}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="flex items-center gap-1">
            <Stars rating={safeCourse.rating || 0} />
            <span className="text-[11.5px] font-semibold text-amber-600">{safeCourse.rating || 0}</span>
          </div>
          <span className="text-[15px] font-bold">
            {safeCourse.price === 0 || !safeCourse.price
              ? <span className="text-emerald-600 flex items-center gap-1"><BadgeCheck size={13} />Free</span>
              : <span className="text-slate-900">${safeCourse.price}</span>}
          </span>
          <Link href={`/courses/${safeCourse.id}`}
            className="text-[11.5px] font-semibold px-4 py-1.5 rounded-lg text-white flex items-center gap-1 hover:opacity-90 transition-all"
            style={{ background: `linear-gradient(135deg, ${grad1}, ${grad2})` }}>
            Enroll Now <TrendingUp size={11} />
          </Link>
        </div>
      </div>
    </article>
  );
}
