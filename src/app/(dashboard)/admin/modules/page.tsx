'use client';

import { useEffect, useState } from "react";
import { adminApi, type Course, type Module } from "@/lib/adminApi";
import { Loader2, Layers, BookOpen } from "lucide-react";

export default function ModulesManagementPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminApi.listCourses(1, 50);
        setCourses(response.data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load modules");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading && courses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-sm text-red-600 mb-2">{error}</p>
        <p className="text-xs text-red-500">
          Ensure the admin API for courses/modules is reachable.
        </p>
      </div>
    );
  }

  const coursesWithModules = courses.filter((c) => (c.modules || []).length > 0);
  const totalModules = courses.reduce(
    (sum, c) => sum + ((c.modules as Module[] | undefined)?.length || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Total modules
            </p>
            <p className="text-lg font-semibold text-gray-900">{totalModules}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Courses with modules
            </p>
            <p className="text-lg font-semibold text-gray-900">{coursesWithModules.length}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 text-sm text-gray-600 hidden sm:flex items-center">
          Manage modules grouped by course. Use this view to quickly see how content is structured
          across the platform.
        </div>
      </div>

      {/* Modules per course */}
      {coursesWithModules.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
          <p className="text-gray-500 mb-2">No modules found.</p>
          <p className="text-xs text-gray-400">
            Create courses and add modules via your course authoring tools.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {coursesWithModules.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate" title={course.title}>
                    {course.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {course.courseType.replace(/_/g, " ").toLowerCase()}
                  </p>
                </div>
                <span className="px-3 py-1 text-[11px] font-semibold rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {(course.modules || []).length} modules
                </span>
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-2 max-h-40 overflow-y-auto">
                {(course.modules || []).map((mod) => (
                  <div
                    key={mod.id}
                    className="flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2"
                  >
                    <div className="mt-0.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate" title={mod.title}>
                        {mod.title}
                      </p>
                      {mod.description && (
                        <p className="text-[11px] text-gray-500 line-clamp-2">
                          {mod.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

