'use client'

import { useState, useEffect } from "react";
import { BookOpen, Plus, Search, MoreVertical, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { courses as coursesApi, modules as modulesApi } from "@/lib/instructorApi";

interface Course { id: string; title: string; status?: string; }
interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  orderIndex: number;
  releaseWeek: number;
  createdAt: string;
  updatedAt: string;
}

export default function ModulesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const fetchedCourses = await coursesApi.fetchInstructorCourses();
        setCourses(fetchedCourses);
        if (fetchedCourses.length > 0) {
          setSelectedCourseId(fetchedCourses[0].id);
        }
      } catch (err) {
        console.error('Failed to load courses for modules:', err);
        setError('Unable to load courses.');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;

    const loadModules = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedModules = await modulesApi.fetchModulesByCourse(selectedCourseId);
        setModules(fetchedModules);
      } catch (err) {
        console.error('Failed to load modules:', err);
        setError('Unable to load modules for the selected course.');
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, [selectedCourseId]);

  const filteredModules = modules.filter((module) => {
    const courseName = courses.find((c) => c.id === module.courseId)?.title ?? '';
    return (
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courseName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Modules</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modules</h1>
          <p className="text-gray-600">Manage course modules and their content</p>
          {courses.length > 0 && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700">Showing modules for</label>
              <select
                value={selectedCourseId || ''}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="mt-1 block w-full max-w-xs rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <Link
          href="/instructor/modules/new"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          Create Module
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search modules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Modules Grid */}
      {filteredModules.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No modules found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search.' : 'Get started by creating your first module.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => (
            <div key={module.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {courses.find((c) => c.id === module.courseId)?.title ?? 'Unknown course'}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-2">{module.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  module.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {module.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen size={16} />
                  <span>Week {module.releaseWeek} • Module {module.orderIndex}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Created {new Date(module.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href={`/instructor/modules/${module.id}`}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  View Details
                </Link>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}