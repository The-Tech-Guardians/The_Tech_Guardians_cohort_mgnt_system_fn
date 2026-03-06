'use client';

import { useState, useEffect, useCallback } from "react";
import Modal from "@/components/admin/Modal";
import Toast from "@/components/admin/Toast";
import { Plus, Search, Edit, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import { 
  courseService, 
  type BackendCourse,
  formatCourseType
} from "@/services/courseService";

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
};

const COURSE_TYPE_OPTIONS = [
  { value: "SOCIAL_MEDIA_BRANDING", label: "Social Media Branding" },
  { value: "COMPUTER_PROGRAMMING", label: "Computer Programming" },
  { value: "ENTREPRENEURSHIP", label: "Entrepreneurship" },
  { value: "TEAM_MANAGEMENT", label: "Team Management" },
  { value: "SRHR", label: "SRHR" },
];

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<BackendCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Selected items
  const [selectedCourse, setSelectedCourse] = useState<BackendCourse | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<BackendCourse | null>(null);

  // Search and UI states
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });
  const [courseForm, setCourseForm] = useState(initialCourseForm);

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Fetch courses
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await courseService.getAllCourses(pagination.page, pagination.limit);
      
      setCourses(response.courses || []);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch courses');
      showToast(err.message || 'Failed to fetch courses', 'error');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = getCurrentUser();
    if (!user) {
      showToast('Please log in to create a course', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const response = await courseService.createCourse({
        title: courseForm.title,
        description: courseForm.description,
        instructorId: user.uuid || user.id || "",
        cohortId: user.cohortId || "",
        courseType: courseForm.courseType,
      });

      if (response.course) {
        showToast("Course created successfully!");
        setCourseForm(initialCourseForm);
        setShowCreateModal(false);
        fetchCourses();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to create course', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    try {
      setLoading(true);
      const response = await courseService.updateCourse(selectedCourse.id, {
        title: courseForm.title,
        description: courseForm.description,
        courseType: courseForm.courseType,
      });

      if (response.course) {
        showToast("Course updated successfully!");
        setCourseForm(initialCourseForm);
        setShowEditModal(false);
        setSelectedCourse(null);
        fetchCourses();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update course', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      setLoading(true);
      await courseService.deleteCourse(courseToDelete.id);
      
      showToast("Course deleted successfully!");
      setShowDeleteModal(false);
      setCourseToDelete(null);
      fetchCourses();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete course', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishCourse = async (courseId: string) => {
    try {
      setLoading(true);
      await courseService.togglePublish(courseId);
      showToast("Course status updated successfully!");
      fetchCourses();
    } catch (err: any) {
      showToast(err.message || 'Failed to update course status', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (course: BackendCourse) => {
    setSelectedCourse(course);
    setCourseForm({
      title: course.title,
      courseType: course.courseType,
      description: course.description,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (course: BackendCourse) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const filteredCourses = courses.filter(course =>
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

      {/* Courses Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Course Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Instructor</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Created</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <p className="text-gray-500">No courses found</p>
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{course.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{formatCourseType(course.courseType)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 max-w-xs truncate" title={course.description}>
                        {course.description || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {getCurrentUser()?.uuid === course.instructorId 
                          ? (getCurrentUser()?.name || getCurrentUser()?.email || "You")
                          : (course.instructorId?.substring(0, 8) + "...")
                        }
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border inline-block ${
                        course.isPublished
                          ? "bg-green-50 text-green-600 border-green-200"
                          : "bg-amber-50 text-amber-600 border-amber-200"
                      }`}>
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
            disabled={pagination.page === 1 || loading}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.page + 1, prev.pages) }))}
            disabled={pagination.page === pagination.pages || loading}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
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
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Type</label>
            <select 
              required
              value={courseForm.courseType}
              onChange={(e) => setCourseForm({ ...courseForm, courseType: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
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
              value={courseForm.description}
              onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              placeholder="Course description..."
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button 
              type="submit" 
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Create Course'}
            </button>
            <button 
              type="button" 
              onClick={() => setShowCreateModal(false)} 
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all disabled:opacity-50"
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Type</label>
            <select 
              required
              value={courseForm.courseType}
              onChange={(e) => setCourseForm({ ...courseForm, courseType: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
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
              value={courseForm.description}
              onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button 
              type="submit" 
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Update Course'}
            </button>
            <button 
              type="button" 
              onClick={() => setShowEditModal(false)} 
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all disabled:opacity-50"
              disabled={loading}
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
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Delete'}
            </button>
            <button 
              type="button" 
              onClick={() => setShowDeleteModal(false)} 
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all disabled:opacity-50"
              disabled={loading}
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
