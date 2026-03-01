"use client";

import Link from "next/link";
import { useState } from "react";

const LEARNER_COURSES = [
  { id: 1, title: "Full-Stack Web Development", instructor: "Dr. James Kowalski", progress: 67, modules: 5, lessons: 24, nextLesson: "React Hooks Deep Dive", dueDate: "Mar 15", status: "active", thumbnail: "F" },
  { id: 2, title: "Advanced JavaScript Patterns", instructor: "Prof. Sarah Chen", progress: 42, modules: 3, lessons: 14, nextLesson: "Design Patterns Overview", dueDate: "Mar 20", status: "active", thumbnail: "A" },
  { id: 3, title: "Database Design & SQL", instructor: "Dr. Michael Torres", progress: 15, modules: 4, lessons: 18, nextLesson: "Introduction to Databases", dueDate: "Apr 5", status: "not-started", thumbnail: "D" },
];

export default function LearnerMyCoursesPage() {
  const [filter, setFilter] = useState("all");

  const filtered = LEARNER_COURSES.filter(c => 
    filter === "all" || 
    (filter === "in-progress" && c.progress > 0 && c.progress < 100) ||
    (filter === "not-started" && c.progress === 0)
  );

  return (
    <div className=" max-w-6xl mx-auto  space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900" style={{fontFamily:"'Bricolage Grotesque',sans-serif"}}>My Courses</h1>
          <p className="text-sm text-gray-500 mt-1">Continue your learning journey</p>
        </div>
        <div className="flex gap-2">
          {["all", "in-progress", "not-started"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs font-semibold px-4 py-2 rounded-xl capitalize transition-colors
                ${filter === f ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-indigo-200"}`}>
              {f.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {filtered.map(course => (
         
          <div key={course.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group cursor-pointer">
            <div className="relative h-32 bg-gray-900 flex items-center justify-center">
              <span className="text-6xl font-black text-white/20" style={{fontFamily:"'Bricolage Grotesque',sans-serif"}}>{course.thumbnail}</span>
              <div className="absolute top-3 right-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                  course.progress > 0 ? "bg-green-500 text-white" : "bg-white/20 text-white"
                }`}>
                  {course.progress}%
                </span>
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-black text-gray-900 mb-2 group-hover:text-gray-700 transition-colors" style={{fontFamily:"'Bricolage Grotesque',sans-serif"}}>
                {course.title}
              </h3>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span>{course.instructor}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                <span>{course.modules} Modules</span>
                <span>•</span>
                <span>{course.lessons} Lessons</span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Progress</span>
                  <span className="font-semibold">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all" style={{width: `${course.progress}%`}}/>
                </div>
              </div>

              {course.progress > 0 && (
                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                  <div className="text-xs text-gray-400 mb-1">Next Lesson</div>
                  <div className="text-sm font-semibold text-gray-800">{course.nextLesson}</div>
                </div>
              )}

              <div className="flex gap-2">
               
               
                <button className="flex-1 bg-indigo-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-indigo-400 transition-colors">
                  <Link href="my-courses/my-learning"> {course.progress > 0 ? "Continue" : "Start Course"}</Link>
                </button>
                <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 text-lg font-semibold">No courses found</div>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
