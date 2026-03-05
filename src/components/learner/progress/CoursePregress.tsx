"use client";

import { useState, useEffect } from "react";
import { authAPI } from "@/lib/auth";

const CourseProgress = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await authAPI.getLearnerCourses();
        if (response.success) {
          setCourses(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Progress</h2>
        <div className="space-y-6">
          {[1,2,3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-2 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Progress</h2>
        {courses.length > 0 ? (
          <div className="space-y-6">
            {courses.map((course: any) => (
              <div key={course.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">{course.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{course.lessons || 0} lessons</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      course.progress === 100 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-indigo-50 text-indigo-700'
                    }`}>
                      {course.progress === 100 ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all"
                      style={{ width: `${course.progress || 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right">{course.progress || 0}%</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">Average Score</span>
                  <span className="text-xs font-semibold text-gray-900">{course.averageScore || 0}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No courses enrolled yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseProgress;