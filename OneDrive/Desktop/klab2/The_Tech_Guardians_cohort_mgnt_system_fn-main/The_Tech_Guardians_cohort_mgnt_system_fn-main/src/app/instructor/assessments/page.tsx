'use client'

import { useState, useEffect } from "react";
import { Plus, Search, FileText, CheckCircle, Clock, Users, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { assessments, courses } from '../../../lib/instructorApi';

interface Assessment {
  id: string;
  title: string;
  type: 'quiz' | 'assignment';
  courseId: string;
  courseName: string;
  questions: number;
  submissions: number;
  dueDate?: string;
  status: 'draft' | 'published' | 'closed';
  createdAt: string;
}

interface Course {
  id: string;
  title: string;
}

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<'all' | 'quiz' | 'assignment'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'closed'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCourse !== 'all') {
      fetchAssessmentsByCourse();
    } else {
      fetchAllAssessments();
    }
  }, [selectedCourse]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch courses first
      const instructorCourses = await courses.fetchInstructorCourses();
      setCourses(instructorCourses);

      // Fetch assessments
      await fetchAllAssessments();
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllAssessments = async () => {
    try {
      // For now, we'll fetch assessments by course since the API expects a moduleId
      // In a real implementation, we'd have an endpoint to fetch all instructor assessments
      const allAssessments: Assessment[] = [];

      for (const course of courses) {
        try {
          // Get modules for this course first
          const modulesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/modules/course/${course.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          });
          const modulesData = await modulesResponse.json();

          if (modulesData.modules) {
            for (const module of modulesData.modules) {
              const moduleAssessments = await assessments.fetchAssessmentsByModule(module.id);
              const assessmentsWithCourseName = moduleAssessments.map((assessment: any) => ({
                ...assessment,
                courseName: course.title,
                submissions: 0, // Mock for now
                status: 'published' as const, // Mock for now
                createdAt: new Date().toISOString() // Mock for now
              }));
              allAssessments.push(...assessmentsWithCourseName);
            }
          }
        } catch (err) {
          console.error(`Failed to fetch assessments for course ${course.id}:`, err);
        }
      }

      setAssessments(allAssessments);
    } catch (err) {
      console.error('Failed to fetch assessments:', err);
      setError('Failed to load assessments');
    }
  };

  const fetchAssessmentsByCourse = async () => {
    if (selectedCourse === 'all') return;

    try {
      setLoading(true);
      const allAssessments: Assessment[] = [];

      // Get modules for selected course
      const modulesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/modules/course/${selectedCourse}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      const modulesData = await modulesResponse.json();

      if (modulesData.modules) {
        for (const module of modulesData.modules) {
          const moduleAssessments = await assessments.fetchAssessmentsByModule(module.id);
          const course = courses.find(c => c.id === selectedCourse);
          const assessmentsWithCourseName = moduleAssessments.map((assessment: any) => ({
            ...assessment,
            courseName: course?.title || 'Unknown Course',
            submissions: 0, // Mock for now
            status: 'published' as const, // Mock for now
            createdAt: new Date().toISOString() // Mock for now
          }));
          allAssessments.push(...assessmentsWithCourseName);
        }
      }

      setAssessments(allAssessments);
    } catch (err) {
      console.error('Failed to fetch assessments for course:', err);
      setError('Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || assessment.type === filter;
    const matchesStatus = statusFilter === 'all' || assessment.status === statusFilter;
    return matchesSearch && matchesFilter && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'quiz' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
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
          <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
          <p className="text-gray-600">Create and manage quizzes and assignments</p>
        </div>
        <Link
          href="/instructor/assessments/new"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          Create Assessment
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search assessments..."
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
          <option value="all">All Types</option>
          <option value="quiz">Quizzes</option>
          <option value="assignment">Assignments</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Assessments Grid */}
      {filteredAssessments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No assessments found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filter !== 'all' || statusFilter !== 'all' ? 'Try adjusting your search or filters.' : 'Get started by creating your first assessment.'}
          </p>
          <div className="mt-6">
            <Link
              href="/instructor/assessments/new"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus size={20} />
              Create Assessment
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map((assessment) => (
            <div key={assessment.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{assessment.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{assessment.courseName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(assessment.type)}`}>
                    {assessment.type}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assessment.status)}`}>
                    {assessment.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText size={16} />
                  <span>{assessment.questions} question{assessment.questions !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users size={16} />
                  <span>{assessment.submissions} submission{assessment.submissions !== 1 ? 's' : ''}</span>
                </div>
                {assessment.dueDate && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} />
                    <span>Due: {new Date(assessment.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/instructor/assessments/${assessment.id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/instructor/assessments/${assessment.id}/edit`}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    Edit
                  </Link>
                </div>
                <div className="relative">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <MoreVertical size={16} />
                  </button>
                  {/* Dropdown menu would go here */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{assessments.length}</div>
            <div className="text-sm text-gray-600">Total Assessments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{assessments.filter(a => a.type === 'quiz').length}</div>
            <div className="text-sm text-gray-600">Quizzes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{assessments.filter(a => a.type === 'assignment').length}</div>
            <div className="text-sm text-gray-600">Assignments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{assessments.filter(a => a.status === 'published').length}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
        </div>
      </div>
    </div>
  );
}