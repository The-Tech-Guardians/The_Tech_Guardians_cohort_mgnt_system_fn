"use client";
import Link from "next/link";
import { useState } from "react";
import { Sparkles, BookOpen, Users, GraduationCap, Star, Clock, PlayCircle, Search, BadgeCheck, TrendingUp, Award } from "lucide-react";

const courses = [
  { id: 1, title: "Build Your Personal Brand on Social Media", instructor: "Chloé Mukazitoni", avatar: "CM", level: "Beginner", duration: "12h 00m", lessons: 44, rating: 4.9, reviews: 8120, enrolled: 56300, price: 0, tags: ["Personal Brand", "Instagram", "LinkedIn"], description: "Go from zero to recognizable. Build a consistent brand identity across every major platform.", featured: true },
  { id: 2, title: "TikTok & Reels Content Strategy", instructor: "Manzi Uwase", avatar: "MU", level: "Beginner", duration: "8h 30m", lessons: 34, rating: 4.9, reviews: 6430, enrolled: 44100, price: 0, tags: ["TikTok", "Reels", "Short-form Video"], description: "Crack the short-form video algorithm. Learn hooks, storytelling, and consistency systems that grow fast.", featured: false },
  { id: 3, title: "Social Media Content Creation & Canva", instructor: "Ines Nyiraneza", avatar: "IN", level: "Beginner", duration: "10h 20m", lessons: 40, rating: 4.8, reviews: 5210, enrolled: 37800, price: 0, tags: ["Canva", "Design", "Visual Content"], description: "Design scroll-stopping visuals without being a designer. Master Canva templates, brand kits, and aesthetics.", featured: false },
  { id: 4, title: "Community Management & Audience Growth", instructor: "Théo Niyibizi", avatar: "TN", level: "Intermediate", duration: "14h 00m", lessons: 50, rating: 4.7, reviews: 2340, enrolled: 15200, price: 39, tags: ["Community", "Engagement", "Growth"], description: "Build loyal communities, master engagement tactics, and grow audiences that convert to real customers.", featured: false },
  { id: 5, title: "Social Media Advertising That Converts", instructor: "Agathe Ineza", avatar: "AI", level: "Intermediate", duration: "16h 30m", lessons: 58, rating: 4.8, reviews: 2780, enrolled: 18100, price: 49, tags: ["Meta Ads", "Paid Social", "ROAS"], description: "Run profitable social media ad campaigns on Meta, TikTok, and Pinterest with proven targeting strategies.", featured: false },
  { id: 6, title: "Brand Deals & Influencer Marketing", instructor: "Rosine Mugenzi", avatar: "RM", level: "Advanced", duration: "12h 00m", lessons: 46, rating: 4.9, reviews: 1640, enrolled: 9300, price: 59, tags: ["Influencer", "Brand Deals", "Monetization"], description: "Land brand partnerships, negotiate deals, and build a sustainable income as a content creator or agency.", featured: false },
];

const LEVEL_COLOR: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Intermediate: "bg-pink-100 text-pink-700 border-pink-200",
  Advanced: "bg-orange-100 text-orange-700 border-orange-200",
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= Math.round(rating) ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth={2} />)}
    </span>
  );
}

export default function SocialMediaBrandingPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchSearch && (!level || c.level === level);
  });

  return (
    <main className="min-h-screen max-w-7xl mx-auto pb-10  font-sans pt-24">
      <section className="relative overflow-hidden pt-24  px-6" >
        <div className="relative ">
          <div className="flex items-center gap-2 text-[12.5px] mb-6">
            <Link href="/" className="text-gray-400">Home</Link>
            <span>/</span>
            <span className="text-pink-400 font-medium">Social Media Branding</span>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)" }}>
              <Sparkles size={30} color="#fdba74" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold ">Social Media Branding</h1>
              <p className="mt-3 text-[15px] leading-relaxed">Build a brand people remember and a community that stays. Platform playbooks, content systems, and monetization strategies in one place.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { v: `${courses.length} Courses`, icon: <BookOpen size={14} /> },
              { v: "181K+ Learners", icon: <Users size={14} /> },
              { v: "Certificates", icon: <GraduationCap size={14} /> },
              { v: "4.9 Avg Rating", icon: <Star size={13} fill="#fbbf24" stroke="#fbbf24" /> },
            ].map(s => (
              <div key={s.v} className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] text-gray-500 border border-gray-200  " >
                {s.icon}{s.v}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className=" px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
            <input type="text" placeholder="Search courses…" value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-pink-100  text-[13.5px] text-slate-800 placeholder-slate-400 outline-none focus:border-pink-400 transition-colors shadow-sm" />
          </div>
          <div className="flex gap-2">
            {["", "Beginner", "Intermediate", "Advanced"].map(l => (
              <button key={l} onClick={() => setLevel(l)} className={`px-3.5 py-2 rounded-xl text-[12.5px] font-medium border transition-all ${level === l ? "bg-pink-500  border-pink-500 " : " text-slate-600 border-pink-100 hover:border-pink-300"}`}>{l || "All"}</button>
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
              <article key={course.id} className=" rounded-2xl border border-pink-100 overflow-hidden flex flex-col">
                <div className="h-40 flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, #ec489915, #f9731615)" }}>
                  <Sparkles size={56} color="#ec4899" strokeWidth={1} opacity={0.5} />
                  {course.featured && <span className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-900"><Award size={10} /> Featured</span>}
                  <span className={`absolute top-3 left-3 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${LEVEL_COLOR[course.level]}`}>{course.level}</span>
                </div>
                <div className="flex flex-col flex-1 p-5 gap-3">
                  <div className="flex flex-wrap gap-1.5">{course.tags.map(t => <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 font-medium">{t}</span>)}</div>
                  <h3 className="text-[14.5px] font-semibold text-slate-900 leading-snug line-clamp-2">{course.title}</h3>
                  <p className="text-[12.5px] text-slate-500 leading-relaxed line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #ec4899, #f97316)" }}>{course.avatar}</span>
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
                    <Link href={`/courses/${course.id}`} className="text-[12.5px] font-semibold px-4 py-1.5 rounded-lg text-white transition-all hover:opacity-90 active:scale-95 flex items-center gap-1" style={{ background: "linear-gradient(135deg, #ec4899, #f97316)", boxShadow: "0 4px 14px #ec489933" }}>
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