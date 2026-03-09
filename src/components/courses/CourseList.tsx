import { getCatConfig } from "@/app/courses/page";
import { Stars } from "./starts";
import Link from "next/link";
import { Award, BadgeCheck, Clock, PlayCircle, TrendingUp, Users, Zap } from "lucide-react";
import { Course } from "@/types/courses";
import { LEVEL_BADGE } from "./config/courses-api";

export function CourseCardList({ course }: { course: Course }) {
  const cat = getCatConfig(course.categorySlug);
  const Icon = cat.icon;
  return (
    <article className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-200 flex gap-0 overflow-hidden">
      <div className="w-36 flex-shrink-0 flex items-center justify-center relative"
        style={{ background: `linear-gradient(135deg, ${cat.grad[0]}18, ${cat.grad[1]}18)` }}>
        <Icon size={40} color={cat.grad[0]} strokeWidth={1} opacity={0.5} />
        {course.featured && <span className="absolute top-2 left-2 flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-900"><Award size={8} />Top</span>}
        {course.isNew && <span className="absolute top-2 right-2 flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500 text-white"><Zap size={8} />New</span>}
      </div>
      <div className="flex flex-1 items-center gap-6 px-5 py-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full border ${LEVEL_BADGE[course.level]}`}>{course.level}</span>
            <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${cat.grad[0]}15`, color: cat.grad[0] }}>{cat.label}</span>
          </div>
          <h3 className="text-[14px] font-semibold text-slate-900 leading-snug truncate">{course.title}</h3>
          <p className="text-[12px] text-slate-400 mt-0.5 line-clamp-1">{course.description}</p>
          <div className="flex items-center gap-3 mt-1.5 text-[11.5px] text-slate-400">
            <span className="flex items-center gap-1"><Clock size={10} />{course.duration}</span>
            <span className="flex items-center gap-1"><PlayCircle size={10} />{course.lessons} lessons</span>
            <span className="flex items-center gap-1"><Users size={10} />{course.enrolled.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="flex items-center gap-1">
            <Stars rating={course.rating} />
            <span className="text-[11.5px] font-semibold text-amber-600">{course.rating}</span>
          </div>
          <span className="text-[15px] font-bold">
            {course.price === 0
              ? <span className="text-emerald-600 flex items-center gap-1"><BadgeCheck size={13} />Free</span>
              : <span className="text-slate-900">${course.price}</span>}
          </span>
          <Link href={`/courses/${course.id}`}
            className="text-[11.5px] font-semibold px-4 py-1.5 rounded-lg text-white flex items-center gap-1 hover:opacity-90 transition-all"
            style={{ background: `linear-gradient(135deg, ${cat.grad[0]}, ${cat.grad[1]})` }}>
            Enroll Now <TrendingUp size={11} />
          </Link>
        </div>
      </div>
    </article>
  );
}