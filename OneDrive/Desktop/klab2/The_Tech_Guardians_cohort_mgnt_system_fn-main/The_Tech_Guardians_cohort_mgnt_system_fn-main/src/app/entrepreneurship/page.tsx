"use client";
import Link from "next/link";
import { useState } from "react";
import { Rocket, BookOpen, Users, GraduationCap, Star, Clock, PlayCircle, Search, BadgeCheck, TrendingUp, Award } from "lucide-react";

const courses = [
  { id: 1, title: "Launch Your Startup in 90 Days", instructor: "Diane Uwimana", avatar: "DU", level: "Beginner", duration: "16h 00m", lessons: 58, rating: 4.9, reviews: 4210, enrolled: 29400, price: 0, tags: ["Startup", "MVP", "Ideation"], description: "Go from idea to first paying customer. Learn lean startup methodology, validation, and rapid iteration.", featured: true },
  { id: 2, title: "Fundraising & Pitching to Investors", instructor: "Eric Nkurunziza", avatar: "EN", level: "Intermediate", duration: "12h 30m", lessons: 44, rating: 4.8, reviews: 1890, enrolled: 11200, price: 59, tags: ["Pitch Deck", "VC", "Funding"], description: "Build a compelling pitch deck and learn what investors actually look for when writing checks.", featured: false },
  { id: 3, title: "Business Finance for Non-Finance Founders", instructor: "Aline Ishimwe", avatar: "AI", level: "Beginner", duration: "10h 20m", lessons: 38, rating: 4.7, reviews: 2340, enrolled: 14800, price: 0, tags: ["Finance", "Cash Flow", "Budgeting"], description: "Understand P&L, burn rate, unit economics, and how to make smarter financial decisions.", featured: false },
  { id: 4, title: "Building & Leading High-Performance Teams", instructor: "Pascal Habimana", avatar: "PH", level: "Intermediate", duration: "14h 00m", lessons: 52, rating: 4.6, reviews: 1120, enrolled: 7600, price: 44, tags: ["Leadership", "HR", "Culture"], description: "Hire the right people, define culture, manage performance, and lead through hypergrowth.", featured: false },
  { id: 5, title: "E-commerce from Zero: Build & Scale", instructor: "Solange Nyiransabimana", avatar: "SN", level: "Beginner", duration: "20h 10m", lessons: 72, rating: 4.8, reviews: 3780, enrolled: 21500, price: 39, tags: ["E-commerce", "Shopify", "Sales"], description: "Launch an online store, set up logistics, and scale to $10K/month with proven playbooks.", featured: false },
  { id: 6, title: "Advanced Growth Strategy & Product-Market Fit", instructor: "Bruno Kalisa", avatar: "BK", level: "Advanced", duration: "18h 45m", lessons: 66, rating: 4.9, reviews: 890, enrolled: 5300, price: 69, tags: ["PMF", "Growth", "Strategy"], description: "Frameworks used by billion-dollar companies to find product-market fit and engineer growth loops.", featured: false },
];

const LEVEL_COLOR: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Intermediate: "bg-amber-100 text-amber-700 border-amber-200",
  Advanced: "bg-rose-100 text-rose-700 border-rose-200",
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= Math.round(rating) ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth={2} />)}
    </span>
  );
}

export default function EntrepreneurshipPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchSearch && (!level || c.level === level);
  });

  return (
    <main className="min-h-screen max-w-7xl mx-auto  font-sans">
      <section className="relative overflow-hidden pt-28  px-6" >
        <div className="relative  pt-14 ">
          <div className="flex items-center gap-2 text-[12.5px]  mb-6">
            <Link href="/" className=" text-gray-400 ">Home</Link>
            <span>/</span>
            <span className="text-amber-300 font-medium">Entrepreneurship</span>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)" }}>
              <Rocket size={30} color="#fbbf24" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">Entrepreneurship</h1>
              <p className="mt-3 text-[15px]  leading-relaxed">Turn bold ideas into thriving businesses. Learn from founders who've built, failed, and scaled — then did it again.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { v: `${courses.length} Courses`, icon: <BookOpen size={14} /> },
              { v: "89K+ Learners", icon: <Users size={14} /> },
              { v: "Certificates", icon: <GraduationCap size={14} /> },
              { v: "4.8 Avg Rating", icon: <Star size={13} fill="#fbbf24" stroke="#fbbf24" /> },
            ].map(s => (
              <div key={s.v} className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] text-gray-500 border border-gray-200 " >
                {s.icon}{s.v}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className=" px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500" />
            <input type="text" placeholder="Search courses…" value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-100 bg-white text-[13.5px] text-slate-800 placeholder-slate-400 outline-none focus:border-amber-400 transition-colors shadow-sm" />
          </div>
          <div className="flex gap-2">
            {["", "Beginner", "Intermediate", "Advanced"].map(l => (
              <button key={l} onClick={() => setLevel(l)} className={`px-3.5 py-2 rounded-xl text-[12.5px] font-medium border transition-all ${level === l ? "bg-amber-500 text-white border-amber-500 " : "bg-white text-slate-600 border-amber-100 hover:border-amber-300"}`}>{l || "All"}</button>
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
              <article key={course.id} className="group bg-white rounded-2xl border border-amber-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                <div className="h-40 flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, #f59e0b15, #ef444415)" }}>
                  <Rocket size={56} color="#f59e0b" strokeWidth={1} opacity={0.5} />
                  {course.featured && <span className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-900"><Award size={10} /> Featured</span>}
                  <span className={`absolute top-3 left-3 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${LEVEL_COLOR[course.level]}`}>{course.level}</span>
                </div>
                <div className="flex flex-col flex-1 p-5 gap-3">
                  <div className="flex flex-wrap gap-1.5">{course.tags.map(t => <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">{t}</span>)}</div>
                  <h3 className="text-[14.5px] font-semibold text-slate-900 leading-snug line-clamp-2">{course.title}</h3>
                  <p className="text-[12.5px] text-slate-500 leading-relaxed line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}>{course.avatar}</span>
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
                    <Link href={`/courses/${course.id}`} className="text-[12.5px] font-semibold px-4 py-1.5 rounded-lg text-white transition-all hover:opacity-90 active:scale-95 flex items-center gap-1" style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)", boxShadow: "0 4px 14px #f59e0b33" }}>
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