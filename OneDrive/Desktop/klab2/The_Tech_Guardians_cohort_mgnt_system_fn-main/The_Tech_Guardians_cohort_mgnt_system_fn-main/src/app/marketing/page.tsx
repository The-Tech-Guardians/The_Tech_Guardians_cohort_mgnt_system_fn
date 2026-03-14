"use client";
import Link from "next/link";
import { useState } from "react";
import { Megaphone, BookOpen, Users, GraduationCap, Star, Clock, PlayCircle, Search, BadgeCheck, TrendingUp, Award } from "lucide-react";

const courses = [
  { id: 1, title: "Digital Marketing Masterclass: A–Z", instructor: "Nina Umutoni", avatar: "NU", level: "Beginner", duration: "24h 00m", lessons: 88, rating: 4.9, reviews: 6420, enrolled: 41200, price: 0, tags: ["SEO", "Ads", "Email"], description: "The complete guide to digital marketing — SEO, paid ads, email, analytics, and conversion optimization.", featured: true },
  { id: 2, title: "Brand Strategy & Positioning", instructor: "Kevin Nshimiyimana", avatar: "KN", level: "Intermediate", duration: "12h 30m", lessons: 46, rating: 4.8, reviews: 2310, enrolled: 14500, price: 49, tags: ["Branding", "Positioning", "Identity"], description: "Build a brand that stands out. Learn positioning, messaging, and how to create lasting emotional connections.", featured: false },
  { id: 3, title: "Copywriting That Converts", instructor: "Stella Nyamwasa", avatar: "SN", level: "Beginner", duration: "10h 00m", lessons: 38, rating: 4.8, reviews: 4100, enrolled: 27800, price: 0, tags: ["Copywriting", "Persuasion", "Sales"], description: "Write copy that compels action — landing pages, emails, ads, and social posts that actually convert.", featured: false },
  { id: 4, title: "Performance Marketing & Paid Ads", instructor: "Roger Habimana", avatar: "RH", level: "Intermediate", duration: "16h 20m", lessons: 60, rating: 4.7, reviews: 1880, enrolled: 11300, price: 54, tags: ["Google Ads", "Meta Ads", "ROAS"], description: "Maximize ROI with proven paid advertising strategies across Google, Meta, TikTok, and more.", featured: false },
  { id: 5, title: "Content Marketing & SEO Growth", instructor: "Violette Gasana", avatar: "VG", level: "Intermediate", duration: "14h 45m", lessons: 54, rating: 4.9, reviews: 3240, enrolled: 19700, price: 39, tags: ["SEO", "Content", "Blogging"], description: "Build organic traffic that compounds. Master keyword strategy, on-page SEO, and content distribution.", featured: false },
  { id: 6, title: "Marketing Analytics & Data-Driven Decisions", instructor: "Olivier Mugisha", avatar: "OM", level: "Advanced", duration: "18h 00m", lessons: 64, rating: 4.7, reviews: 1020, enrolled: 6400, price: 64, tags: ["Analytics", "GA4", "Attribution"], description: "Move beyond vanity metrics. Learn to track, attribute, and optimise every step of the customer journey.", featured: false },
];

const LEVEL_COLOR: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Intermediate: "bg-violet-100 text-violet-700 border-violet-200",
  Advanced: "bg-pink-100 text-pink-700 border-pink-200",
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= Math.round(rating) ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth={2} />)}
    </span>
  );
}

export default function MarketingPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchSearch && (!level || c.level === level);
  });

  return (
    <main className="min-h-screen max-w-7xl mx-auto pb-10  font-sans">
      <section className="relative overflow-hidden pt-28 pb-16 px-6">
        <div className="relative ">
          <div className="flex items-center gap-2 pt-14 text-[12.5px] t mb-6">
            <Link href="/" >Home</Link>
            <span>/</span>
            <span className="text-violet-300 font-medium">Marketing</span>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)" }}>
              <Megaphone size={30} color="#c084fc" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold ">Marketing</h1>
              <p className="mt-3  text-[15px]  leading-relaxed">Grow audiences, craft irresistible messages, and drive revenue with frameworks used by the world's fastest-growing companies.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { v: `${courses.length} Courses`, icon: <BookOpen size={14} /> },
              { v: "121K+ Learners", icon: <Users size={14} /> },
              { v: "Certificates", icon: <GraduationCap size={14} /> },
              { v: "4.8 Avg Rating", icon: <Star size={13} fill="#fbbf24" stroke="#fbbf24" /> },
            ].map(s => (
              <div key={s.v} className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px]  text-gray-500 border border-gray-200   " >
                {s.icon}{s.v}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className=" px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400" />
            <input type="text" placeholder="Search courses…" value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-violet-100  text-[13.5px] text-slate-800 placeholder-slate-400 outline-none focus:border-violet-400 transition-colors shadow-sm" />
          </div>
          <div className="flex gap-2">
            {["", "Beginner", "Intermediate", "Advanced"].map(l => (
              <button key={l} onClick={() => setLevel(l)} className={`px-3.5 py-2 rounded-xl text-[12.5px] font-medium border transition-all ${level === l ? "bg-violet-600  border-violet-600" : " text-slate-600 border-violet-100 hover:border-violet-300"}`}>{l || "All"}</button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-[12.5px] text-slate-400">{filtered.length} course{filtered.length !== 1 ? "s" : ""} available</p>
      </section>

      <section className="px-6 ">
        {filtered.length === 0 ? (
          <div className="text-center py-20"><Search size={48} className="mx-auto mb-3 text-slate-300" /><p className="text-[15px] font-medium text-slate-600">No courses match your search</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(course => (
              <article key={course.id} className="group  rounded-2xl border border-violet-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                <div className="h-40 flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, #8b5cf615, #ec489915)" }}>
                  <Megaphone size={56} color="#8b5cf6" strokeWidth={1} opacity={0.5} />
                  {course.featured && <span className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-900"><Award size={10} /> Featured</span>}
                  <span className={`absolute top-3 left-3 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${LEVEL_COLOR[course.level]}`}>{course.level}</span>
                </div>
                <div className="flex flex-col flex-1 p-5 gap-3">
                  <div className="flex flex-wrap gap-1.5">{course.tags.map(t => <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 font-medium">{t}</span>)}</div>
                  <h3 className="text-[14.5px] font-semibold  leading-snug line-clamp-2">{course.title}</h3>
                  <p className="text-[12.5px] text-slate-500 leading-relaxed line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>{course.avatar}</span>
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
                    <Link href={`/courses/${course.id}`} className="text-[12.5px] font-semibold px-4 py-1.5 rounded-lg text-white transition-all hover:opacity-90 active:scale-95 flex items-center gap-1" style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)", boxShadow: "0 4px 14px #8b5cf633" }}>
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