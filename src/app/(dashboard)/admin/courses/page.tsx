'use client';

import { useState, useEffect, useCallback } from "react";
import Modal from "@/components/admin/Modal";
import Toast from "@/components/admin/Toast";
import { Plus, Search, Edit, Trash2, Loader2, Eye, EyeOff, BookOpen } from "lucide-react";
import {
  courseService,
  type Course,
  formatCourseType,
} from "@/services/courseService";
import { newCohortService as cohortService, type Cohort } from "@/services/newCohortService";

const API_BASE_URL = "http://localhost:3000/api";

// Get current user from localStorage
const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

// Initial form state
const initialCourseForm = {
  title: "",
  courseType: "",
  description: "",
  cohortId: "",
};

const COURSE_TYPE_OPTIONS = [
  { value: "SOCIAL_MEDIA_BRANDING", label: "Social Media Branding" },
  { value: "COMPUTER_PROGRAMMING", label: "Computer Programming" },
  { value: "ENTREPRENEURSHIP", label: "Entrepreneurship" },
  { value: "TEAM_MANAGEMENT", label: "Team Management" },
  { value: "SRHR", label: "SRHR" },
];

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Selected items
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  // Search and UI states
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });
  const [courseForm, setCourseForm] = useState(initialCourseForm);
  const [formLoading, setFormLoading] = useState(false);

  const getToken = () => localStorage.getItem("auth_token") || localStorage.getItem("token");

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // Fetch courses
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await courseService.getAllCourses();
      setCourses(response || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch courses');
      showToast(err.message || 'Failed to fetch courses', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch cohorts
  const fetchCohorts = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/cohorts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCohorts(data.cohorts || []);
      }
    } catch (err) {
      console.error('Failed to fetch cohorts:', err);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchCohorts();
  }, [fetchCourses, fetchCohorts]);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = getCurrentUser();
    if (!user) {
      showToast('Please log in to create a course', 'error');
      return;
    }

    if (!courseForm.cohortId) {
      showToast('Please select a cohort', 'error');
      return;
    }

    try {
      setFormLoading(true);
      
      const created = await courseService.createCourse({
        title: courseForm.title,
        description: courseForm.description,
        instructorId: (user.uuid || user.id || "") as string,
        cohortId: courseForm.cohortId,
        courseType: courseForm.courseType,
      });

      if (created) {
        showToast("Course created successfully!");
        setCourseForm(initialCourseForm);
        setShowCreateModal(false);
        fetchCourses();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to create course', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    try {
      setFormLoading(true);
      const updated = await courseService.updateCourse(selectedCourse.id, {
        title: courseForm.title,
        description: courseForm.description,
        courseType: courseForm.courseType,
      });

      if (updated) {
        showToast("Course updated successfully!");
        setCourseForm(initialCourseForm);
        setShowEditModal(false);
        setSelectedCourse(null);
        fetchCourses();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update course', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      setFormLoading(true);
      await courseService.deleteCourse(courseToDelete.id);
      
      showToast("Course deleted successfully!");
      setShowDeleteModal(false);
      setCourseToDelete(null);
      fetchCourses();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete course', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handlePublishCourse = async (courseId: string) => {
    try {
      setLoading(true);
      await courseService.publishCourse(courseId);
      showToast("Course status updated successfully!");
      fetchCourses();
    } catch (err: any) {
      showToast(err.message || 'Failed to update course status', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    setCourseForm({
      title: course.title,
      courseType: course.courseType,
      description: course.description,
      cohortId: course.cohortId,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (course: Course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const filteredCourses = courses.filter((course) =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && courses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchCourses}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setCourseForm(initialCourseForm);
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-sm text-sm"
          disabled={loading}
        >
          <Plus className="w-4 h-4" />
          Create Course
        </button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
            disabled={loading}
          />
        </div>
      </div>

      {/* Courses as cards */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">No courses found</p>
          <p className="text-xs text-gray-400">
            Try adjusting your search or create a new course.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCourses.map((course) => {
            const cohort = cohorts.find(c => c.id === course.cohortId);
            return (
              <div
                key={course.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate" title={course.title}>
                        {course.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatCourseType(course.courseType)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-[11px] font-semibold rounded-full border ${
                        course.isPublished
                          ? "bg-green-50 text-green-600 border-green-200"
                          : "bg-amber-50 text-amber-600 border-amber-200"
                      }`}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>

                  <p
                    className="text-xs text-gray-600 line-clamp-3"
                    title={course.description || undefined}
                  >
                    {course.description || "No description provided for this course yet."}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span className="truncate">
                      Cohort:&nbsp;
                      <span className="font-medium text-gray-700">
                        {cohort?.name || course.cohortId?.substring(0, 8) || "Unknown"}...
                      </span>
                    </span>
                    <span>
                      Created:&nbsp;
                      <span className="font-medium text-gray-700">
                        {course.createdAt
                          ? new Date(course.createdAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-[11px] text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {course.isPublished ? "Visible to learners" : "Hidden from learners"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(course)}
                      className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      title="Edit"
                      disabled={loading}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handlePublishCourse(course.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        course.isPublished
                          ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      }`}
                      title={course.isPublished ? "Unpublish" : "Publish"}
                      disabled={loading}
                    >
                      {course.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => openDeleteModal(course)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      title="Delete"
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Course Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Course" size="md">
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
            <input
              type="text"
              required
              value={courseForm.title}
              onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
              placeholder="e.g., Introduction to Programming"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={formLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Type</label>
            <select 
              required
              value={courseForm.courseType}
              onChange={(e) => setCourseForm({ ...courseForm, courseType: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={formLoading}
            >
              <option value="">Select type</option>
              {COURSE_TYPE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cohort</label>
            <select 
              required
              value={courseForm.cohortId}
              onChange={(e) => setCourseForm({ ...courseForm, cohortId: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={formLoading}
            >
              <option value="">Select cohort</option>
              {cohorts.map(cohort => (
                <option key={cohort.id} value={cohort.id}>
                  {cohort.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={4}
              required
              value={courseForm.description}
              onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              placeholder="Course description..."
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={formLoading}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button 
              type="submit" 
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all disabled:opacity-50"
              disabled={formLoading}
            >
              {formLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Create Course'}
            </button>
            <button 
              type="button" 
              onClick={() => setShowCreateModal(false)} 
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all disabled:opacity-50"
              disabled={formLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Course Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Course" size="md">
        <form onSubmit={handleUpdateCourse} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
            <input
              type="text"
              required
              value={courseForm.title}
              onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={formLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Type</label>
            <select 
              required
              value={courseForm.courseType}
              onChange={(e) => setCourseForm({ ...courseForm, courseType: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={formLoading}
            >
              <option value="">Select type</option>
              {COURSE_TYPE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={4}
              required
              value={courseForm.description}
              onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={formLoading}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button 
              type="submit" 
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all disabled:opacity-50"
              disabled={formLoading}
            >
              {formLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Update Course'}
            </button>
            <button 
              type="button" 
              onClick={() => setShowEditModal(false)} 
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all disabled:opacity-50"
              disabled={formLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Course" size="sm">
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <span className="font-semibold">{courseToDelete?.title}</span>? 
            This action cannot be undone.
          </p>
          <div className="flex gap-3 pt-4">
            <button 
              onClick={handleDeleteCourse} 
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all disabled:opacity-50"
              disabled={formLoading}
            >
              {formLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Delete'}
            </button>
            <button 
              type="button" 
              onClick={() => setShowDeleteModal(false)} 
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all disabled:opacity-50"
              disabled={formLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.show} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  );
}

