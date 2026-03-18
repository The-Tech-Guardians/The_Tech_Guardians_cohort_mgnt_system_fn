'use client';

import { useState, useEffect, useCallback } from "react";
import Modal from "@/components/admin/Modal";
import Toast from "@/components/admin/Toast";
import { Plus, Search, Edit, Trash2, Loader2, Eye, EyeOff, BookOpen, LayoutGrid, List } from "lucide-react";
import {
  courseService,
  type BackendCourse,
  type Instructor,
  formatCourseType,
} from "@/services/courseService";
import { cohortService, type Cohort } from "@/services/cohortService";

const API_BASE_URL = "http://localhost:3000/api";

const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
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

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<BackendCourse[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState<BackendCourse | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<BackendCourse | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });
  const [courseForm, setCourseForm] = useState(initialCourseForm);
  const [formLoading, setFormLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const getToken = () => localStorage.getItem("auth_token") || localStorage.getItem("token");

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const currentUser = getCurrentUser();
      let response;
      
      if (currentUser?.role === 'INSTRUCTOR') {
        // Instructor should only see their own courses
        response = await courseService.getInstructorCourses(currentUser.uuid);
      } else {
        // Admin sees all courses
        response = await courseService.getAllCourses(1, 100);
      }
      
      setCourses(response.courses || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch courses');
      showToast(err.message || 'Failed to fetch courses', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCohorts = useCallback(async () => {
    try {
      const { cohorts: rawCohorts } = await cohortService.getAllCohorts(1, 100);
      // Filter valid cohorts only (has id and name)
      const validCohorts = rawCohorts.filter((cohort: Cohort) => cohort.id && cohort.name);
      console.log('Valid cohorts loaded:', validCohorts.length, validCohorts);
      setCohorts(validCohorts);
    } catch (err: unknown) {
      console.error('Failed to fetch cohorts:', err);
      setCohorts([]);
    }
  }, []);

  const fetchInstructors = useCallback(async () => {
    try {
      const response = await courseService.getInstructors(1, 100);
      setInstructors(response.instructors || []);
    } catch (err) {
      console.error('Failed to fetch instructors:', err);
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
    if (!courseForm.cohortId || !selectedCohort) {
      showToast('Please select a valid cohort', 'error');
      return;
    }

    if (!courseForm.instructorId) {
      showToast('Please select an instructor', 'error');
      return;
    }

    try {
      setFormLoading(true);
      
      const created = await courseService.createCourse({
        title: courseForm.title,
        description: courseForm.description,
        instructorId: courseForm.instructorId,
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

    // Validate cohort for update too
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
        instructorId: courseForm.instructorId
      });

      if (updated) {
        // Update local state immediately for better UX
        setCourses(prevCourses => 
          prevCourses.map(course => 
            course.id === selectedCourse.id 
              ? { ...course, ...updated.course }
              : course
          )
        );
        showToast("Course updated successfully!");
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
      
      // Get the current course first to determine its status
      const currentCourse = await courseService.getCourseById(courseId);
      
      if (!currentCourse) {
        throw new Error('Course not found');
      }
      
      // Toggle the publish status
      const updatedCourse = await courseService.updateCourse(courseId, {
        ...currentCourse.course,
        isPublished: currentCourse?.course?.isPublished !== undefined ? !currentCourse.course.isPublished : false
      });
      
      if (updatedCourse) {
        // Immediately update local state for better UX
        setCourses(prevCourses => 
          prevCourses.map(course => 
            course.id === courseId 
              ? { ...course, isPublished: updatedCourse.course.isPublished }
              : course
          )
        );
        showToast(`Course ${updatedCourse.course.isPublished ? 'published' : 'unpublished'} successfully!`);
      } else {
        // Fallback: refresh all courses
        fetchCourses();
      }
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
      cohortId: course.cohortId,
      instructorId: course.instructorId || "",
      isPublished: course.isPublished || false,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (course: BackendCourse) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const toggleExpanded = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const instructorNameById = (id?: string) => {
    if (!id) return "N/A";
    const inst = instructors.find((i) => i.uuid === id);
    return inst ? `${inst.firstName} ${inst.lastName}`.trim() : "N/A";
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
                viewMode === "card" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
              title="Card view"
            >
              <LayoutGrid className="w-4 h-4" />
              Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
                viewMode === "list" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>

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
        </div>
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

      {filteredCourses.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">No courses found</p>
        </div>
      ) : (
        viewMode === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredCourses.map((course) => {
              const cohort = cohorts.find(c => c.id === course.cohortId);
              const isOpen = !!expanded[course.id];
              const desc = (course.description || "No description provided.").trim();
              const showToggle = desc.length > 240;
              const visibleDesc = isOpen || !showToggle ? desc : `${desc.slice(0, 240)}…`;

              return (
                <div
                  key={course.id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 line-clamp-2" title={course.title}>
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

                    <div className="formatted-content text-gray-600 text-sm leading-relaxed [&strong]:font-bold whitespace-pre-wrap">
                      {visibleDesc}
                    </div>
                    {showToggle && (
                      <button
                        type="button"
                        onClick={() => toggleExpanded(course.id)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        {isOpen ? "Show less" : "Show more"}
                      </button>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500">
                      <span className="truncate">Cohort: {cohort?.name || "N/A"}</span>
                      <span className="text-right">Instructor: {instructorNameById(course.instructorId)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <span>{course.isPublished ? "Visible to learners" : "Hidden from learners"}</span>
                      <span>{course.createdAt ? new Date(course.createdAt).toLocaleDateString() : "N/A"}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button onClick={() => openEditModal(course)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handlePublishCourse(course.id)} className={`p-2 rounded-lg ${course.isPublished ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"}`} title={course.isPublished ? "Unpublish" : "Publish"}>
                      {course.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => openDeleteModal(course)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Cohort</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Instructor</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Created</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCourses.map((course) => {
                    const cohort = cohorts.find(c => c.id === course.cohortId);
                    const isOpen = !!expanded[course.id];
                    const desc = (course.description || "No description provided.").trim();
                    const showToggle = desc.length > 240;
                    const visibleDesc = isOpen || !showToggle ? desc : `${desc.slice(0, 240)}…`;

                    return (
                      <tr key={course.id} className="hover:bg-gray-50 transition-colors align-top">
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">{course.title}</div>
                          <div className="formatted-content text-xs text-gray-600 mt-1 whitespace-pre-wrap">{visibleDesc}</div>
                          {showToggle && (
                            <button
                              type="button"
                              onClick={() => toggleExpanded(course.id)}
                              className="mt-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                            >
                              {isOpen ? "Show less" : "Show more"}
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatCourseType(course.courseType)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{cohort?.name || "N/A"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{instructorNameById(course.instructorId)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full border inline-block ${
                            course.isPublished ? "bg-green-50 text-green-600 border-green-200" : "bg-amber-50 text-amber-600 border-amber-200"
                          }`}>
                            {course.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEditModal(course)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100" title="Edit">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handlePublishCourse(course.id)} className={`p-2 rounded-lg ${course.isPublished ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"}`} title={course.isPublished ? "Unpublish" : "Publish"}>
                              {course.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button onClick={() => openDeleteModal(course)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

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
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900"
              disabled={formLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Type</label>
            <select 
              required
              value={courseForm.courseType}
              onChange={(e) => setCourseForm({ ...courseForm, courseType: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900"
              disabled={formLoading}
            >
              <option key="select-type" value="">Select type</option>
              {COURSE_TYPE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cohort</label>
            <select 
              required
              value={courseForm.cohortId}
              onChange={(e) => setCourseForm({ ...courseForm, cohortId: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900"
              disabled={formLoading}
            >
            <option value="">Select cohort</option>
              {cohorts.map((cohort, index) => cohort.id && (
                <option key={`${cohort.id}-${index}`} value={cohort.id}>{cohort.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
            <select 
              required
              value={courseForm.instructorId}
              onChange={(e) => setCourseForm({ ...courseForm, instructorId: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900"
              disabled={formLoading}
            >
              <option value="">Select instructor</option>
              {instructors.map(instructor => (
                <option key={instructor.uuid} value={instructor.uuid}>
                  {instructor.firstName} {instructor.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={6}
              required
              value={courseForm.description}
              onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              placeholder="Course description..."
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900"
              disabled={formLoading}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button 
              type="submit" 
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium"
              disabled={formLoading}
            >
              {formLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Create Course'}
            </button>
            <button 
              type="button" 
              onClick={() => setShowCreateModal(false)} 
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium"
              disabled={formLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Course" size="md">
        <form onSubmit={handleUpdateCourse} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
            <input
              type="text"
              required
              value={courseForm.title}
              onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900"
              disabled={formLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Type</label>
            <select 
              required
              value={courseForm.courseType}
              onChange={(e) => setCourseForm({ ...courseForm, courseType: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900"
              disabled={formLoading}
            >
              <option value="">Select type</option>
              {COURSE_TYPE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cohort</label>
            <select 
              required
              value={courseForm.cohortId}
              onChange={(e) => setCourseForm({ ...courseForm, cohortId: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900"
              disabled={formLoading}
            >
              <option value="">Select cohort</option>
              {cohorts.map(cohort => (
                <option key={cohort.id} value={cohort.id}>{cohort.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
            <select 
              required
              value={courseForm.instructorId}
              onChange={(e) => setCourseForm({ ...courseForm, instructorId: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900"
              disabled={formLoading}
            >
              <option value="">Select instructor</option>
              {instructors.map(instructor => (
                <option key={instructor.uuid} value={instructor.uuid}>
                  {instructor.firstName} {instructor.lastName}
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
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900"
              disabled={formLoading}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={courseForm.isPublished}
                onChange={(e) => setCourseForm({ ...courseForm, isPublished: e.target.checked })}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                disabled={formLoading}
              />
              <span className="text-sm font-medium text-gray-700">Publish course (visible to learners)</span>
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <button 
              type="submit" 
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium"
              disabled={formLoading}
            >
              {formLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Update Course'}
            </button>
            <button 
              type="button" 
              onClick={() => setShowEditModal(false)} 
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium"
              disabled={formLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Course" size="sm">
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <span className="font-semibold">{courseToDelete?.title}</span>? 
          </p>
          <div className="flex gap-3 pt-4">
            <button 
              onClick={handleDeleteCourse} 
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium"
              disabled={formLoading}
            >
              {formLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Delete'}
            </button>
            <button 
              type="button" 
              onClick={() => setShowDeleteModal(false)} 
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium"
              disabled={formLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Toast message={toast.message} type={toast.type} isVisible={toast.show} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}

