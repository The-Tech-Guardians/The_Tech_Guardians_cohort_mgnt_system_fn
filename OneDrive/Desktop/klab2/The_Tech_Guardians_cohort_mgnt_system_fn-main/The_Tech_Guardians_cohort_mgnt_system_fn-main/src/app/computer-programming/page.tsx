"use client";
import Link from "next/link";
import { useState } from "react";
import { Code2, BookOpen, Users, GraduationCap, Star, Clock, PlayCircle, Search, BadgeCheck, TrendingUp, Award } from "lucide-react";

const courses = [
  { id: 1, title: "Full-Stack Web Development with React & Node.js", instructor: "Alex Murenzi", avatar: "AM", level: "Intermediate", duration: "42h 30m", lessons: 128, rating: 4.9, reviews: 3241, enrolled: 18400, price: 49, tags: ["React", "Node.js", "MongoDB"], description: "Build production-ready full-stack apps from scratch. Master REST APIs, authentication, and deployment.", featured: true },
  { id: 2, title: "Python for Beginners: Zero to Automation", instructor: "Grace Uwase", avatar: "GU", level: "Beginner", duration: "18h 10m", lessons: 64, rating: 4.8, reviews: 5102, enrolled: 32100, price: 0, tags: ["Python", "Automation", "Scripts"], description: "Learn Python from the ground up. Write scripts, automate tasks, and build your first programs.", featured: false },
  { id: 3, title: "Data Structures & Algorithms in JavaScript", instructor: "Patrick Nkurunziza", avatar: "PN", level: "Advanced", duration: "28h 00m", lessons: 94, rating: 4.7, reviews: 1820, enrolled: 9200, price: 39, tags: ["DSA", "JavaScript", "Interviews"], description: "Crack technical interviews with confidence. Deep-dive into sorting, trees, graphs, and dynamic programming.", featured: false },
  { id: 4, title: "Mobile App Development with Flutter", instructor: "Sandra Ingabire", avatar: "SI", level: "Intermediate", duration: "34h 20m", lessons: 110, rating: 4.8, reviews: 2430, enrolled: 12600, price: 44, tags: ["Flutter", "Dart", "iOS", "Android"], description: "Ship beautiful iOS & Android apps using Flutter. From widgets to state management and app store publishing.", featured: false },
  { id: 5, title: "DevOps & CI/CD Pipelines from Scratch", instructor: "Jean Bosco Habumuremyi", avatar: "JB", level: "Advanced", duration: "22h 50m", lessons: 78, rating: 4.6, reviews: 980, enrolled: 5400, price: 54, tags: ["Docker", "GitHub Actions", "AWS"], description: "Automate your deployments. Learn Docker, CI/CD pipelines, cloud hosting, and monitoring strategies.", featured: false },
  { id: 6, title: "UI/UX Design for Developers", instructor: "Clarisse Muhoza", avatar: "CM", level: "Beginner", duration: "14h 00m", lessons: 52, rating: 4.9, reviews: 4110, enrolled: 24300, price: 0, tags: ["Figma", "Design", "CSS"], description: "Learn design principles every developer needs — spacing, typography, color, and Figma prototyping.", featured: false },
];

const LEVEL_COLOR: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Intermediate: "bg-blue-100 text-blue-700 border-blue-200",
  Advanced: "bg-rose-100 text-rose-700 border-rose-200",
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= Math.round(rating) ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth={2} />)}
    </span>
  );
}

export default function ComputerProgrammingPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchSearch && (!level || c.level === level);
  });

  return (
    <main className="min-h-screen max-w-7xl mx-auto pb-10  font-sans">
      <section className="relative overflow-hidden  pt-24  px-6">
       
        <div className="relative ">
          <div className="flex items-center gap-2 pt-14 text-[12.5px] text-slate-400 mb-6">
            <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-blue-400 font-medium">Computer Programming</span>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #3b82f620, #06b6d420)", border: "1px solid #3b82f630" }}>
              <Code2 size={30} color="#60a5fa" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold  tracking-tight leading-tight">Computer Programming</h1>
              <p className="mt-3  text-[15px]  leading-relaxed">From web development to algorithms — hands-on courses for every level. Build real projects and land your next role.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-8 ">
            {[
              { v: `${courses.length} Courses`, icon: <BookOpen size={14} /> },
              { v: "102K+ Learners", icon: <Users size={14} /> },
              { v: "Certificates Included", icon: <GraduationCap size={14} /> },
              { v: "4.8 Avg Rating", icon: <Star size={13} fill="#fbbf24" stroke="#fbbf24" /> },
            ].map(s => (
              <div key={s.v} className="flex items-center gap-2 px-3.5 py-2 rounded-xl  text-[13px] text-gray-500 border border-gray-200 " >
                {s.icon}{s.v}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className=" px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" />
            <input type="text" placeholder="Search courses or topics…" value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13.5px] text-slate-800 placeholder-slate-400 outline-none focus:border-blue-400 transition-colors shadow-sm" />
          </div>
          <div className="flex gap-2">
            {["", "Beginner", "Intermediate", "Advanced"].map(l => (
              <button key={l} onClick={() => setLevel(l)} className={`px-3.5 py-2 rounded-xl text-[12.5px] font-medium border transition-all ${level === l ? "bg-blue-600 text-white border-blue-600 " : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}>{l || "All"}</button>
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
              <article key={course.id} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                <div className="h-40 flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, #3b82f615, #06b6d415)" }}>
                  <Code2 size={56} color="#3b82f6" strokeWidth={1} opacity={0.5} />
                  {course.featured && <span className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-900"><Award size={10} /> Featured</span>}
                  <span className={`absolute top-3 left-3 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${LEVEL_COLOR[course.level]}`}>{course.level}</span>
                </div>
                <div className="flex flex-col flex-1 p-5 gap-3">
                  <div className="flex flex-wrap gap-1.5">{course.tags.map(t => <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">{t}</span>)}</div>
                  <h3 className="text-[14.5px] font-semibold text-slate-900 leading-snug line-clamp-2">{course.title}</h3>
                  <p className="text-[12.5px] text-slate-500 leading-relaxed line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">{course.avatar}</span>
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
                    <Link href={`/courses/${course.id}`} className="text-[12.5px] font-semibold px-4 py-1.5 rounded-lg text-white transition-all hover:opacity-90 active:scale-95 flex items-center gap-1" style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)", boxShadow: "0 4px 14px #3b82f633" }}>
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