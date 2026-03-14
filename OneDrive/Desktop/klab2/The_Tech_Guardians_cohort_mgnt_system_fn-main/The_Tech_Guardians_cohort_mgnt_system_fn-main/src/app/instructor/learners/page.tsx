'use client'

import { useState, useEffect } from "react";
import { Search, Users, Clock, TrendingUp, MessageSquare, Eye, Mail, Phone } from "lucide-react";
import { courses as coursesApi, learners as learnersApi, progress as progressApi } from "@/lib/instructorApi";

interface Learner {
  id: string;
  name: string;
  email: string;
  enrolledCourses: number;
  completedModules: number;
  totalModules: number;
  timeSpent: number; // in minutes
  lastActive: string;
  progress: number; // percentage
  status: 'active' | 'inactive' | 'completed';
}

interface CourseOption {
  id: string;
  title: string;
}

export default function LearnersPage() {
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [learners, setLearners] = useState<Learner[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'completed'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchLearnersForCourse(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const fetched = await coursesApi.fetchInstructorCourses();
      setCourses(fetched.map((c) => ({ id: c.id, title: c.title })));
      setSelectedCourse(fetched.length ? fetched[0].id : null);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchLearnersForCourse = async (courseId: string) => {
    try {
      setLoading(true);
      setError(null);

      const [enrolled, progressData] = await Promise.all([
        learnersApi.fetchEnrolledLearners(courseId),
        progressApi.fetchCourseLearnerProgress(courseId)
      ]);

      // Merge progress into learner list (match on learner id)
      const progressMap = new Map(progressData.map((p: any) => [p.learnerId, p]));
      const merged = enrolled.map((learner: any) => {
        const progress = progressMap.get(learner.uuid);
        return {
          id: learner.uuid,
          name: `${learner.firstName} ${learner.lastName}`,
          email: learner.email,
          enrolledCourses: 0,
          completedModules: progress?.completedLessons ?? 0,
          totalModules: progress?.totalLessons ?? 0,
          timeSpent: progress?.totalTimeSpent ?? 0,
          lastActive: progress?.lastAccessed ? new Date(progress.lastAccessed).toLocaleDateString() : 'N/A',
          progress: Math.round(progress?.completionRate ?? 0),
          status: progress?.completionRate === 100 ? 'completed' : 'active'
        } as Learner;
      });

      setLearners(merged);
    } catch (err) {
      console.error('Failed to fetch learners:', err);
      setError('Failed to load learners');
      setLearners([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLearners = learners.filter(learner => {
    const matchesSearch = learner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         learner.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || learner.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Learners</h1>
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
          <h1 className="text-2xl font-bold text-gray-900">Learners</h1>
          <p className="text-gray-600">Monitor learner progress and engagement</p>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {/* Course picker */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Course</label>
          <select
            value={selectedCourse ?? ''}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="" disabled>
              {courses.length ? 'Select a course' : 'No courses available'}
            </option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search learners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Learners</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Learners List */}
      {filteredLearners.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No learners found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filter !== 'all' ? 'Try adjusting your search or filters.' : 'No learners enrolled yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Learner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
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
                {filteredLearners.map((learner) => (
                  <tr key={learner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {learner.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{learner.name}</div>
                          <div className="text-sm text-gray-500">{learner.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${learner.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{learner.progress}%</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {learner.completedModules}/{learner.totalModules} modules
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-900">{formatTime(learner.timeSpent)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {learner.enrolledCourses} course{learner.enrolledCourses !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(learner.lastActive).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(learner.status)}`}>
                        {learner.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-indigo-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{learners.length}</p>
              <p className="text-sm text-gray-600">Total Learners</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {learners.filter(l => l.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Active Learners</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(learners.reduce((sum, l) => sum + l.timeSpent, 0) / learners.length / 60)}h
              </p>
              <p className="text-sm text-gray-600">Avg. Time Spent</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {learners.filter(l => l.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">Completed Courses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}