"use client";
import Link from "next/link";
import { useState } from "react";
import { HeartPulse, BookOpen, Users, GraduationCap, Star, Clock, PlayCircle, Search, BadgeCheck, TrendingUp, Award } from "lucide-react";

const courses = [
  { id: 1, title: "Foundations of Sexual & Reproductive Health", instructor: "Dr. Amina Mukagihana", avatar: "AM", level: "Beginner", duration: "10h 30m", lessons: 40, rating: 4.9, reviews: 3820, enrolled: 22100, price: 0, tags: ["SRHR", "Health", "Awareness"], description: "A comprehensive introduction to sexual and reproductive health rights — for educators, advocates, and health workers.", featured: true },
  { id: 2, title: "Reproductive Rights Advocacy & Policy", instructor: "Jeannette Nzeyimana", avatar: "JN", level: "Intermediate", duration: "14h 00m", lessons: 50, rating: 4.8, reviews: 1440, enrolled: 9200, price: 39, tags: ["Advocacy", "Policy", "Rights"], description: "Navigate policy landscapes and learn advocacy strategies that drive real change in reproductive rights.", featured: false },
  { id: 3, title: "Adolescent Sexual Health Education", instructor: "Florence Kayitesi", avatar: "FK", level: "Beginner", duration: "8h 20m", lessons: 32, rating: 4.7, reviews: 2670, enrolled: 16300, price: 0, tags: ["Youth", "Education", "Prevention"], description: "Age-appropriate, evidence-based curriculum for educators working with adolescents.", featured: false },
  { id: 4, title: "Family Planning Methods: A Clinical Guide", instructor: "Dr. Samuel Uwizeye", avatar: "SU", level: "Advanced", duration: "18h 45m", lessons: 68, rating: 4.9, reviews: 980, enrolled: 5800, price: 54, tags: ["Clinical", "Family Planning", "Medicine"], description: "In-depth clinical training on contraception methods, counselling, and patient care for health practitioners.", featured: false },
  { id: 5, title: "Gender-Based Violence: Prevention & Response", instructor: "Marie Claire Ingabire", avatar: "MC", level: "Intermediate", duration: "12h 10m", lessons: 46, rating: 4.8, reviews: 2100, enrolled: 13400, price: 29, tags: ["GBV", "Prevention", "Support"], description: "Equip yourself with the tools to prevent, identify, and respond to gender-based violence in your community.", featured: false },
  { id: 6, title: "Maternal Health & Safe Motherhood", instructor: "Dr. Olive Musabyimana", avatar: "OM", level: "Intermediate", duration: "16h 00m", lessons: 60, rating: 4.7, reviews: 1560, enrolled: 10200, price: 44, tags: ["Maternal", "Pregnancy", "Midwifery"], description: "Improve maternal outcomes with evidence-based practices covering prenatal care, delivery, and postpartum support.", featured: false },
];

const LEVEL_COLOR: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Intermediate: "bg-purple-100 text-purple-700 border-purple-200",
  Advanced: "bg-rose-100 text-rose-700 border-rose-200",
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= Math.round(rating) ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth={2} />)}
    </span>
  );
}

export default function SRHRPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchSearch && (!level || c.level === level);
  });

  return (
    <main className="min-h-screen  pb-10 max-w-7xl mx-auto font-sans">
      <section className="relative overflow-hidden pt-24  px-6" >
  
        <div className="relative pt-14 ">
          <div className="flex items-center gap-2  text-[12.5px]  mb-6">
            <Link href="/" className=" transition-colors text-gray-400">Home</Link>
            <span>/</span>
            <span className="text-rose-500 font-medium">SRHR</span>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(244,63,94,0.15)", border: "1px solid rgba(244,63,94,0.3)" }}>
              <HeartPulse size={30} color="#fb7185" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold ">Sexual & Reproductive<br />Health & Rights</h1>
              <p className="mt-3  text-[15px]  leading-relaxed">Evidence-based courses for health workers, educators, and advocates driving reproductive health equity.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { v: `${courses.length} Courses`, icon: <BookOpen size={14} /> },
              { v: "77K+ Learners", icon: <Users size={14} /> },
              { v: "Certificates", icon: <GraduationCap size={14} /> },
              { v: "4.8 Avg Rating", icon: <Star size={13} fill="#fbbf24" stroke="#fbbf24" /> },
            ].map(s => (
              <div key={s.v} className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px]  text-gray-500 border border-gray-200">
                {s.icon}{s.v}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className=" px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-400" />
            <input type="text" placeholder="Search courses…" value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-rose-100 bg-white text-[13.5px] text-slate-800 placeholder-slate-400 outline-none focus:border-rose-400 transition-colors shadow-sm" />
          </div>
          <div className="flex gap-2">
            {["", "Beginner", "Intermediate", "Advanced"].map(l => (
              <button key={l} onClick={() => setLevel(l)} className={`px-3.5 py-2 rounded-xl text-[12.5px] font-medium border transition-all ${level === l ? "bg-rose-500 text-white border-rose-500 " : "bg-white text-slate-600 border-rose-100 hover:border-rose-300"}`}>{l || "All"}</button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-[12.5px] text-slate-400">{filtered.length} course{filtered.length !== 1 ? "s" : ""} available</p>
      </section>

      <section className=" px-6 pb-20">
        {filtered.length === 0 ? (
          <div className="text-center py-20"><Search size={48} className="mx-auto mb-3 text-slate-300" /><p className="text-[15px] font-medium text-slate-600">No courses match your search</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(course => (
              <article key={course.id} className="group bg-white rounded-2xl border border-rose-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                <div className="h-40 flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, #f43f5e15, #a855f715)" }}>
                  <HeartPulse size={56} color="#f43f5e" strokeWidth={1} opacity={0.5} />
                  {course.featured && <span className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-900"><Award size={10} /> Featured</span>}
                  <span className={`absolute top-3 left-3 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${LEVEL_COLOR[course.level]}`}>{course.level}</span>
                </div>
                <div className="flex flex-col flex-1 p-5 gap-3">
                  <div className="flex flex-wrap gap-1.5">{course.tags.map(t => <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 font-medium">{t}</span>)}</div>
                  <h3 className="text-[14.5px] font-semibold text-slate-900 leading-snug line-clamp-2">{course.title}</h3>
                  <p className="text-[12.5px] text-slate-500 leading-relaxed line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 bg-rose-500">{course.avatar}</span>
                    <span className="text-[12px] text-slate-500">{course.instructor}</span>
                  </div>
                  <div className="flex gap-3 text-[12px] text-slate-400">
                    <span className="flex items-center gap-1"><Clock size={11} />{course.duration}</span>
                    <span className="flex items-center gap-1"><PlayCircle size={11} />{course.lessons} lessons</span>
                    <span className="flex items-center gap-1"><Users size={11} />{course.enrolled.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Stars rating={course.rating} />
                    <span className="text-[12px] font-semibold text-amber-600">{course.rating}</span>
                    <span className="text-[12px] text-slate-400">({course.reviews.toLocaleString()})</span>
                  </div>
                  <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[15px] font-bold">
                      {course.price === 0 ? <span className="text-emerald-600 flex items-center gap-1"><BadgeCheck size={14} />Free</span> : <span className="text-slate-900">${course.price}</span>}
                    </span>
                    <Link href={`/courses/${course.id}`} className="text-[12.5px] font-semibold px-4 py-1.5 rounded-lg text-white transition-all hover:opacity-90 active:scale-95 flex items-center gap-1 bg-rose-500" >
                      Enroll Now <TrendingUp size={12} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}