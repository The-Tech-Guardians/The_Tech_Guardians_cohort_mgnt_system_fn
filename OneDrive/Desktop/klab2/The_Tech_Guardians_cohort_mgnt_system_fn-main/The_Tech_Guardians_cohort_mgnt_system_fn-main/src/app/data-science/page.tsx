"use client";
import Link from "next/link";
import { useState } from "react";
import { BarChart2, BookOpen, Users, GraduationCap, Star, Clock, PlayCircle, Search, BadgeCheck, TrendingUp, Award } from "lucide-react";

const courses = [
  { id: 1, title: "Python for Data Science & Machine Learning", instructor: "Dr. Joseph Rurangwa", avatar: "JR", level: "Beginner", duration: "30h 00m", lessons: 106, rating: 4.9, reviews: 7820, enrolled: 52400, price: 0, tags: ["Python", "Pandas", "ML"], description: "The most complete data science bootcamp — from Python basics to machine learning model deployment.", featured: true },
  { id: 2, title: "SQL & Database Analytics", instructor: "Laetitia Nzamwita", avatar: "LN", level: "Beginner", duration: "14h 30m", lessons: 52, rating: 4.8, reviews: 5340, enrolled: 35100, price: 0, tags: ["SQL", "PostgreSQL", "Analytics"], description: "Master SQL from fundamentals to advanced analytics. Write queries that transform raw data into clear insights.", featured: false },
  { id: 3, title: "Deep Learning with TensorFlow & Keras", instructor: "Emmanuel Ndahiro", avatar: "EN", level: "Advanced", duration: "26h 00m", lessons: 90, rating: 4.7, reviews: 2100, enrolled: 12600, price: 59, tags: ["Deep Learning", "TensorFlow", "Neural Nets"], description: "Build and deploy deep learning models — CNNs, RNNs, transformers, and production pipelines.", featured: false },
  { id: 4, title: "Data Visualization with Python & Tableau", instructor: "Cécile Mukamana", avatar: "CM", level: "Intermediate", duration: "16h 20m", lessons: 60, rating: 4.8, reviews: 3120, enrolled: 19800, price: 44, tags: ["Tableau", "Matplotlib", "Seaborn"], description: "Turn data into compelling stories. Master chart design, dashboard building, and visual best practices.", featured: false },
  { id: 5, title: "Statistics & Probability for Data Science", instructor: "Dr. Théogène Habimana", avatar: "TH", level: "Intermediate", duration: "20h 00m", lessons: 72, rating: 4.7, reviews: 1780, enrolled: 10200, price: 49, tags: ["Statistics", "Probability", "Hypothesis Testing"], description: "The math behind data science — distributions, inference, regression, and A/B testing with real datasets.", featured: false },
  { id: 6, title: "Big Data Engineering: Spark & Kafka", instructor: "Fidèle Nkurunziza", avatar: "FN", level: "Advanced", duration: "22h 45m", lessons: 80, rating: 4.6, reviews: 860, enrolled: 5100, price: 69, tags: ["Spark", "Kafka", "Data Pipelines"], description: "Build scalable data pipelines. Process millions of records with Apache Spark and stream data with Kafka.", featured: false },
];

const LEVEL_COLOR: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Intermediate: "bg-teal-100 text-teal-700 border-teal-200",
  Advanced: "bg-blue-100 text-blue-700 border-blue-200",
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= Math.round(rating) ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth={2} />)}
    </span>
  );
}

export default function DataSciencePage() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchSearch && (!level || c.level === level);
  });

  return (
    <main className="min-h-screen max-w-7xl mx-auto pb-10 pt-28  font-sans">
      <section className=" overflow-hidden   px-6 ">
        <div className=" ">
          <div className="flex items-center gap-2 pt-14 text-[12.5px]  mb-6">
            <Link href="/" className="text-gray-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-emerald-300 font-medium">Data Science</span>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center " style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
              <BarChart2 size={30} color="#34d399" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold ">Data Science</h1>
              <p className="mt-3  text-[15px]  leading-relaxed">Extract insights, build models, and engineer data pipelines. Courses for analysts and engineers who want to go beyond spreadsheets.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { v: `${courses.length} Courses`, icon: <BookOpen size={14} /> },
              { v: "135K+ Learners", icon: <Users size={14} /> },
              { v: "Certificates", icon: <GraduationCap size={14} /> },
              { v: "4.8 Avg Rating", icon: <Star size={13} fill="#fbbf24" stroke="#fbbf24" /> },
            ].map(s => (
              <div key={s.v} className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px]   border border-gray-200 " >
                {s.icon}{s.v}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className=" px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
            <input type="text" placeholder="Search courses…" value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-emerald-100  text-[13.5px] text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-400 transition-colors shadow-sm" />
          </div>
          <div className="flex gap-2">
            {["", "Beginner", "Intermediate", "Advanced"].map(l => (
              <button key={l} onClick={() => setLevel(l)} className={`px-3.5 py-2 rounded-xl text-[12.5px] font-medium border transition-all ${level === l ? "bg-emerald-600  border-emerald-600  " : " text-slate-600 border-emerald-100 hover:border-emerald-300"}`}>{l || "All"}</button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-[12.5px] text-slate-400">{filtered.length} course{filtered.length !== 1 ? "s" : ""} available</p>
      </section>

      <section className="px-6 pb-20">
        {filtered.length === 0 ? (
          <div className="text-center py-20"><Search size={48} className="mx-auto mb-3 text-slate-300" /><p className="text-[15px] font-medium text-slate-600">No courses match your search</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(course => (
              <article key={course.id} className="group  rounded-2xl border border-emerald-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                <div className="h-40 flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, #10b98115, #3b82f615)" }}>
                  <BarChart2 size={56} color="#10b981" strokeWidth={1} opacity={0.5} />
                  {course.featured && <span className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-900"><Award size={10} /> Featured</span>}
                  <span className={`absolute top-3 left-3 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${LEVEL_COLOR[course.level]}`}>{course.level}</span>
                </div>
                <div className="flex flex-col flex-1 p-5 gap-3">
                  <div className="flex flex-wrap gap-1.5">{course.tags.map(t => <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">{t}</span>)}</div>
                  <h3 className="text-[14.5px] font-semibold text-slate-900 leading-snug line-clamp-2">{course.title}</h3>
                  <p className="text-[12.5px] text-slate-500 leading-relaxed line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)" }}>{course.avatar}</span>
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
                    <Link href={`/courses/${course.id}`} className="text-[12.5px] font-semibold px-4 py-1.5 rounded-lg text-white transition-all hover:opacity-90 active:scale-95 flex items-center gap-1" style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)", boxShadow: "0 4px 14px #10b98133" }}>
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