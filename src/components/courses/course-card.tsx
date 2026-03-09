
import Link from "next/link";
import { Stars } from "./starts";
import { getCatConfig } from "@/app/courses/page";
import { Award, BadgeCheck, Clock, PlayCircle, TrendingUp, Users, Zap } from "lucide-react";
import { Course } from "@/types/courses";
import { LEVEL_BADGE } from "./config/courses-api";

export function CourseCardGrid({ course }: { course: Course }) {
  const cat = getCatConfig(course.categorySlug);
  const Icon = cat.icon;
  return (
    <article className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      <div className="h-36 flex items-center justify-center relative"
        style={{ background: `linear-gradient(135deg, ${cat.grad[0]}18, ${cat.grad[1]}18)` }}>
        <Icon size={52} color={cat.grad[0]} strokeWidth={1} opacity={0.5} />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full border ${LEVEL_BADGE[course.level]}`}>{course.level}</span>
          {course.featured && <span className="flex items-center gap-0.5 text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-900"><Award size={9} />Top</span>}
          {course.isNew && <span className="flex items-center gap-0.5 text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white"><Zap size={9} />New</span>}
        </div>
        <span className="absolute bottom-2 right-3 text-[10.5px] font-medium px-2 py-0.5 rounded-full"
          style={{ background: `${cat.grad[0]}22`, color: cat.grad[0] }}>{cat.label}</span>
      </div>
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        <div className="flex flex-wrap gap-1">
          {course.tags.slice(0,2).map(t => (
            <span key={t} className="text-[10.5px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">{t}</span>
          ))}
        </div>
        <h3 className="text-[13.5px] font-semibold text-slate-900 leading-snug line-clamp-2">{course.title}</h3>
        <p className="text-[11.5px] text-slate-400 leading-relaxed line-clamp-2">{course.description}</p>
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${cat.grad[0]}, ${cat.grad[1]})` }}>{course.avatar}</span>
          <span className="text-[11px] text-slate-400">{course.instructor}</span>
        </div>
        <div className="flex gap-2.5 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><Clock size={10} />{course.duration}</span>
          <span className="flex items-center gap-1"><PlayCircle size={10} />{course.lessons}</span>
          <span className="flex items-center gap-1"><Users size={10} />{(course.enrolled/1000).toFixed(0)}K</span>
        </div>
        <div className="flex items-center gap-1">
          <Stars rating={course.rating} />
          <span className="text-[11px] font-semibold text-amber-600">{course.rating}</span>
          <span className="text-[11px] text-slate-300">({course.reviews.toLocaleString()})</span>
        </div>
        <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[14px] font-bold">
            {course.price === 0
              ? <span className="text-emerald-600 flex items-center gap-1"><BadgeCheck size={13} />Free</span>
              : <span className="text-slate-900">${course.price}</span>}
          </span>
          <Link href={`/courses/${course.id}`}
            className="text-[11.5px] font-semibold px-3.5 py-1.5 rounded-lg text-white flex items-center gap-1 hover:opacity-90 active:scale-95 transition-all"
            style={{ background: `linear-gradient(135deg, ${cat.grad[0]}, ${cat.grad[1]})` }}>
            Enroll <TrendingUp size={11} />
          </Link>
        </div>
      </div>
    </article>
  );
}