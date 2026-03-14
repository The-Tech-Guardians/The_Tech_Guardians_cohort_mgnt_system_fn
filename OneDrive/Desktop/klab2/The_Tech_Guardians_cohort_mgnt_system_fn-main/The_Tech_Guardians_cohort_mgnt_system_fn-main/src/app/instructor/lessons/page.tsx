'use client'

import { useState, useEffect } from "react";
import { FileText, Video, Link as LinkIcon, Plus, Search, MoreVertical, Edit, Trash2, Play } from "lucide-react";
import Link from "next/link";

interface Course { id: string; title: string; }
interface Module { id: string; title: string; courseId: string; }
interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  contentType: 'video' | 'pdf' | 'text';
  contentUrl: string;
  contentBody: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export default function LessonsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
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
        console.error('Failed to load courses for lessons:', err);
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
      try {
        const fetchedModules = await modulesApi.fetchModulesByCourse(selectedCourseId);
        setModules(fetchedModules);
        if (fetchedModules.length > 0) {
          setSelectedModuleId(fetchedModules[0].id);
        } else {
          setSelectedModuleId(null);
        }
      } catch (err) {
        console.error('Failed to load modules:', err);
        setError('Unable to load modules for the selected course.');
      }
    };

    loadModules();
  }, [selectedCourseId]);

  useEffect(() => {
    if (!selectedModuleId) return;

    const loadLessons = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedLessons = await lessonsApi.fetchLessonsByModule(selectedModuleId);
        setLessons(fetchedLessons);
      } catch (err) {
        console.error('Failed to load lessons:', err);
        setError('Unable to load lessons for the selected module.');
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, [selectedModuleId]);

  const filteredLessons = lessons.filter((lesson) => {
    const module = modules.find((m) => m.id === lesson.moduleId);
    const course = courses.find((c) => c.id === module?.courseId);
    const moduleName = module?.title ?? '';
    const courseName = course?.title ?? '';
    return (
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courseName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={16} className="text-blue-600" />;
      case 'text': return <FileText size={16} className="text-green-600" />;
      case 'pdf': return <FileText size={16} className="text-red-600" />;
      default: return <FileText size={16} className="text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Lessons</h1>
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
          <h1 className="text-2xl font-bold text-gray-900">Lessons</h1>
          <p className="text-gray-600">Manage individual lessons and their content</p>
        </div>
        <Link
          href="/instructor/lessons/new"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          Create Lesson
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search lessons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Lessons List */}
      {filteredLessons.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No lessons found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search.' : 'Get started by creating your first lesson.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lesson
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Module
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lesson.title}</div>
                        <div className="text-sm text-gray-500">{lesson.contentBody?.substring(0, 50)}...</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(lesson.contentType)}
                        <span className="text-sm text-gray-900">{getTypeLabel(lesson.contentType)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {modules.find((m) => m.id === lesson.moduleId)?.title ?? 'Unknown module'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {courses.find((c) => c.id === modules.find((m) => m.id === lesson.moduleId)?.courseId)?.title ?? 'Unknown course'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lesson.orderIndex}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lesson.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/instructor/lessons/${lesson.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </Link>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}