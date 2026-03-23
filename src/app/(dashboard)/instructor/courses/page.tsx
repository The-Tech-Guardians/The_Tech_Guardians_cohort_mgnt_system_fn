"use client";

import { useState, useEffect, useCallback } from "react";
import Modal from "@/components/admin/Modal";
import Toast from "@/components/admin/Toast";
import FormattedTextEditor from "@/components/editor/FormattedTextEditor";
import { Plus, Search, Edit, Trash2, Loader2, Eye, EyeOff, BookOpen, LayoutGrid, List } from "lucide-react";
import { instructorApi } from "@/lib/instructorApi";
import { courseService, formatCourseType, type BackendCourse, type Instructor } from "@/services/courseService";
import { cohortService, type Cohort } from "@/services/cohortService";
import type { User } from "@/types/user";

const API_BASE_URL = "http://localhost:3000/api";

const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  // Prioritize standard user data
  const userDataStr = localStorage.getItem('user_data') || localStorage.getItem('user') || localStorage.getItem('auth_data');
  if (!userDataStr) return null;
  
  try {
    const userData = JSON.parse(userDataStr);
    // Ensure it has uuid for instructor check
    return userData as User;
  } catch (e) {
    console.error('Failed to parse user data:', e);
    return null;
  }
};

const initialCourseForm = {
  title: "",
  courseType: "",
  description: "",
  cohortId: "",
  instructorId: "",
  isPublished: false,
};

const COURSE_TYPE_OPTIONS = [
  { value: "SOCIAL_MEDIA_BRANDING", label: "Social Media Branding" },
  { value: "COMPUTER_PROGRAMMING", label: "Computer Programming" },
  { value: "ENTREPRENEURSHIP", label: "Entrepreneurship" },
  { value: "TEAM_MANAGEMENT", label: "Team Management" },
  { value: "SRHR", label: "SRHR" },
];

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<any | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });
  const [courseForm, setCourseForm] = useState(initialCourseForm);
  const [formLoading, setFormLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const currentUser = getCurrentUser();

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use instructor-specific endpoint
      const courses = await instructorApi.getInstructorCourses();
      setCourses(courses);
    } catch (err: unknown) {
      console.error('Failed to fetch instructor courses:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCohorts = useCallback(async () => {
    try {
      const result = await cohortService.getAllCohorts(1, 100);
      const rawCohorts = result.cohorts;
      const validCohorts = rawCohorts.filter((cohort: Cohort) => cohort.id && cohort.name);
      setCohorts(validCohorts);
    } catch (err: unknown) {
      console.error('Failed to fetch cohorts:', err);
      setCohorts([]);
    }
  }, []); 

  const fetchInstructors = useCallback(async () => {
    try {
      const result = await courseService.getInstructors(1, 100);
      setInstructors(result.instructors || []);
    } catch (err) {
      console.error('Failed to fetch instructors:', err);
      setInstructors([]);
    }
  }, []); 

  useEffect(() => {
    fetchCourses();
    fetchCohorts();
    fetchInstructors();
  }, [fetchCourses, fetchCohorts, fetchInstructors]);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate cohort exists in loaded cohorts
    const selectedCohort = cohorts.find(c => c.id === courseForm.cohortId);
    
    if (!courseForm.cohortId) {
      showToast('Please select a cohort', 'error');
      return;
    }

    if (!currentUser?.uuid) {
      showToast('User not authenticated', 'error');
      return;
    }

    if (!courseForm.title.trim() || !courseForm.description.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    if (!courseForm.courseType) {
      showToast('Please select a course type', 'error');
      return;
    }

    try {
      setFormLoading(true);
      
      const courseData = {
        title: courseForm.title.trim(),
        description: courseForm.description.trim(),
        instructorId: currentUser.uuid,
        cohortId: courseForm.cohortId,
        courseType: courseForm.courseType,
        isPublished: courseForm.isPublished,
      };
      
      const response = await courseService.createCourse(courseData);
      
      if (response && response.course) {
showToast("Course created successfully!", "success");
        setCourseForm(initialCourseForm);
        setShowCreateModal(false);
        
        // Add the new course directly to state for immediate display
        setCourses(prevCourses => [...prevCourses, response.course]);
        
        // Also refresh from server to ensure consistency
        fetchCourses();
      } else {
        showToast('Course creation failed - no response data', 'error');
      }
    } catch (err: any) {
      console.error('Course creation error:', err);
      showToast(err.message || 'Failed to create course', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const selectedCohort = cohorts.find(c => c.id === courseForm.cohortId);
    if (!courseForm.cohortId || !selectedCohort) {
      showToast('Please select a valid cohort', 'error');
      return;
    }

    try {
      setFormLoading(true);
      const updated = await courseService.updateCourse(selectedCourse.id, {
        title: courseForm.title,
        description: courseForm.description,
        courseType: courseForm.courseType,
        cohortId: courseForm.cohortId,
        instructorId: currentUser?.uuid || ""
      });

      if (updated) {
        setCourses(prevCourses => 
          prevCourses.map(course => 
            course.id === selectedCourse.id 
              ? { ...course, ...updated.course }
              : course
          )
        );
        showToast("Course updated successfully!", "success");
        setCourseForm(initialCourseForm);
        setShowEditModal(false);
        setSelectedCourse(null);
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
      
      showToast("Course deleted successfully!", "success");
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
      setFormLoading(true);
      
      const updatedCourse = await courseService.togglePublish(courseId);
      if (updatedCourse) {
        // Immediately update local state for better UX
        setCourses(prevCourses => 
          prevCourses.map(course => 
            course.id === courseId 
              ? { ...course, isPublished: Boolean(updatedCourse.isPublished) }
              : course
          )
        );
        showToast(`Course ${updatedCourse.isPublished ? 'published' : 'unpublished'} successfully!`, 'success');
      } else {
        // Fallback: refresh all courses
        fetchCourses();
        showToast('Failed to toggle course status', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update course status', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-1">Manage your courses and content</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Course
        </button>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("card")}
            className={`p-2 rounded-lg ${viewMode === "card" ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-600"}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg ${viewMode === "list" ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-600"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchCourses}
            className="mt-2 text-red-600 underline text-sm"
          >
            Try again
          </button>
        </div>
      )}

      {/* Courses Grid/List */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? "Try adjusting your search" : "Get started by creating your first course"}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Course
            </button>
          )}
        </div>
      ) : viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {formatCourseType(course.courseType)}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      course.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setCourseForm({
                        title: course.title,
                        description: course.description,
                        courseType: course.courseType,
                        cohortId: course.cohortId,
                        instructorId: course.instructorId,
                        isPublished: course.isPublished,
                      });
                      setShowEditModal(true);
                    }}
                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setCourseToDelete(course);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handlePublishCourse(course.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      course.isPublished 
                        ? "text-gray-600 hover:text-yellow-600 hover:bg-yellow-50" 
                        : "text-green-600 hover:text-green-700 hover:bg-green-50"
                    }`}
                    title={course.isPublished ? "Unpublish course" : "Publish course"}
                  >
                    {course.isPublished ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{course.title}</div>
                      <div className="text-sm text-gray-500">{course.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {formatCourseType(course.courseType)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      course.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedCourse(course);
                          setCourseForm({
                            title: course.title,
                            description: course.description,
                            courseType: course.courseType,
                            cohortId: course.cohortId,
                            instructorId: course.instructorId,
                            isPublished: course.isPublished,
                          });
                          setShowEditModal(true);
                        }}
                        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setCourseToDelete(course);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePublishCourse(course.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          course.isPublished 
                            ? "text-gray-600 hover:text-yellow-600 hover:bg-yellow-50" 
                            : "text-green-600 hover:text-green-700 hover:bg-green-50"
                        }`}
                        title={course.isPublished ? "Unpublish course" : "Publish course"}
                      >
                        {course.isPublished ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal || showEditModal}
        onClose={() => {
          setShowCreateModal(false);
          setShowEditModal(false);
          setSelectedCourse(null);
          setCourseForm(initialCourseForm);
        }}
        title={showCreateModal ? "Create New Course" : "Edit Course"}
      >
        <form onSubmit={showCreateModal ? handleCreateCourse : handleUpdateCourse} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Title
            </label>
            <input
              type="text"
              required
              value={courseForm.title}
              onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <FormattedTextEditor
              content={courseForm.description}
              onChange={(content) => setCourseForm(prev => ({ ...prev, description: content }))}
              placeholder="Enter course description..."
              minHeight="150px"
              showToolbar={true}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Type
            </label>
            <select
              required
              value={courseForm.courseType}
              onChange={(e) => setCourseForm({ ...courseForm, courseType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a type</option>
              {COURSE_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cohort
            </label>
              <select
              required
              value={courseForm.cohortId}
              onChange={(e) => setCourseForm({ ...courseForm, cohortId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a cohort</option>
              {cohorts.map((cohort) => (
                <option key={cohort.id} value={cohort.id}>
                  {cohort.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowCreateModal(false);
                setShowEditModal(false);
                setSelectedCourse(null);
                setCourseForm(initialCourseForm);
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {formLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                showCreateModal ? "Create Course" : "Update Course"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCourseToDelete(null);
        }}
        title="Delete Course"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setCourseToDelete(null);
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteCourse}
              disabled={formLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {formLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete Course"
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.show}
          onClose={() => setToast({ show: false, message: "", type: "success" })}
        />
      )}
    </div>
  );
}

