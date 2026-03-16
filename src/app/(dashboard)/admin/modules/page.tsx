'use client';

import { useEffect, useState, useCallback } from "react";
import { RefreshCw, Search, Plus, Layers, Edit, Trash2, BookOpen, X, LayoutGrid, List } from "lucide-react";
import Modal from "@/components/admin/Modal";
import Toast from "@/components/admin/Toast";
import { moduleService, type Module } from "@/services/moduleService";
import { courseService, type BackendCourse } from "@/services/courseService";

const API_BASE_URL = "http://localhost:3000/api";

export default function ModulesManagementPage() {
  const [courses, setCourses] = useState<BackendCourse[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null);
  const [moduleToEdit, setModuleToEdit] = useState<Module | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    orderIndex: 0,
    releaseWeek: 1,
  });
  const [formLoading, setFormLoading] = useState(false);
  
  // Toast
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

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
      const coursesArray = response?.courses || [];
      setCourses(coursesArray);
      if (coursesArray.length > 0) {
        setSelectedCourse(coursesArray[0].id);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Fetch modules when course is selected
  const fetchModules = useCallback(async () => {
    if (!selectedCourse) {
      setModules([]);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const response = await moduleService.getModulesByCourse(selectedCourse);
      setModules(response || []);
    } catch (err: any) {
      setError(err.message || "Failed to load modules");
      setModules([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCourse]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  // Handle create module
  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    setFormLoading(true);

    try {
      await moduleService.createModule({
        courseId: selectedCourse,
        title: formData.title,
        description: formData.description,
        orderIndex: formData.orderIndex,
        releaseWeek: formData.releaseWeek,
      });
      
      showToast("Module created successfully!");
      setFormData({ title: "", description: "", orderIndex: 0, releaseWeek: 1 });
      setShowCreateModal(false);
      fetchModules();
    } catch (err: any) {
      showToast(err.message || "Failed to create module", "error");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle update module
  const handleUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleToEdit) return;
    setFormLoading(true);

    try {
      await moduleService.updateModule(moduleToEdit.id, {
        title: formData.title,
        description: formData.description,
        orderIndex: formData.orderIndex,
        releaseWeek: formData.releaseWeek,
      });
      
      showToast("Module updated successfully!");
      setShowEditModal(false);
      setModuleToEdit(null);
      fetchModules();
    } catch (err: any) {
      showToast(err.message || "Failed to update module", "error");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete module
  const handleDeleteModule = async () => {
    if (!moduleToDelete) return;
    setFormLoading(true);

    try {
      await moduleService.deleteModule(moduleToDelete.id);
      showToast("Module deleted successfully!");
      setShowDeleteModal(false);
      setModuleToDelete(null);
      fetchModules();
    } catch (err: any) {
      showToast(err.message || "Failed to delete module", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const openEditModal = (module: Module) => {
    setModuleToEdit(module);
    setFormData({
      title: module.title,
      description: module.description || "",
      orderIndex: module.orderIndex,
      releaseWeek: module.releaseWeek,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (module: Module) => {
    setModuleToDelete(module);
    setShowDeleteModal(true);
  };

  const toggleExpanded = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const filteredModules = modules.filter(m =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCourseData = courses.find(c => c.id === selectedCourse);

  if (loading && courses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Module Management</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage course modules</p>
        </div>
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
              setFormData({ title: "", description: "", orderIndex: modules.length + 1, releaseWeek: 1 });
              setShowCreateModal(true);
            }}
            disabled={!selectedCourse}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add Module
          </button>
        </div>
      </div>

      {/* Course Selection */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select a course...</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      {selectedCourse && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Modules</p>
              <p className="text-xl font-bold text-gray-900">{modules.length}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Course</p>
              <p className="text-sm font-bold text-gray-900 truncate">{selectedCourseData?.title || "N/A"}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Status</p>
              <p className="text-sm font-bold text-gray-900">{selectedCourseData?.isPublished ? "Published" : "Draft"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      {selectedCourse && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full max-w-md"
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Modules List */}
      {selectedCourse ? (
        filteredModules.length > 0 ? (
          viewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredModules.map((module) => {
                const isOpen = !!expanded[module.id];
                const desc = (module.description || "").trim();
                const showToggle = desc.length > 220;
                const visibleDesc = isOpen || !showToggle ? desc : `${desc.slice(0, 220)}…`;

                return (
                  <div
                    key={module.id}
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                          <Layers className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-gray-500">Week {module.releaseWeek}</span>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                        #{module.orderIndex}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-gray-900 mb-2">{module.title}</h3>

                    {desc ? (
                      <div className="space-y-1 mb-4">
                        <div className="formatted-content text-gray-600 text-sm leading-relaxed [&strong]:font-bold whitespace-pre-wrap">
                          {visibleDesc}
                        </div>
                        {showToggle && (
                          <button
                            type="button"
                            onClick={() => toggleExpanded(module.id)}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                          >
                            {isOpen ? "Show less" : "Show more"}
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 mb-4">No description.</p>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => openEditModal(module)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(module)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
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
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Module</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Week</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Order</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredModules.map((module) => {
                      const isOpen = !!expanded[module.id];
                      const desc = (module.description || "").trim();
                      const showToggle = desc.length > 220;
                      const visibleDesc = isOpen || !showToggle ? desc : `${desc.slice(0, 220)}…`;

                      return (
                        <tr key={module.id} className="hover:bg-gray-50 transition-colors align-top">
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-900">{module.title}</div>
                            {desc ? (
                              <>
                                <div className="formatted-content text-xs text-gray-600 mt-1 whitespace-pre-wrap">{visibleDesc}</div>
                                {showToggle && (
                                  <button
                                    type="button"
                                    onClick={() => toggleExpanded(module.id)}
                                    className="mt-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                                  >
                                    {isOpen ? "Show less" : "Show more"}
                                  </button>
                                )}
                              </>
                            ) : (
                              <div className="text-xs text-gray-400 mt-1">No description.</div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">Week {module.releaseWeek}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">#{module.orderIndex}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditModal(module)}
                                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(module)}
                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                title="Delete"
                              >
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
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No modules found</p>
            <p className="text-xs text-gray-400">
              {searchTerm ? "Try adjusting your search" : "Click 'Add Module' to create the first module"}
            </p>
          </div>
        )
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Select a course to view its modules</p>
        </div>
      )}

      {/* Create Module Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Module"
        size="md"
      >
        <form onSubmit={handleCreateModule} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Module Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Introduction to the Course"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Module description..."
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Index</label>
              <input
                type="number"
                required
                min={0}
                value={formData.orderIndex}
                onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Release Week</label>
              <input
                type="number"
                required
                min={1}
                value={formData.releaseWeek}
                onChange={(e) => setFormData({ ...formData, releaseWeek: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={formLoading}
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all disabled:opacity-50"
            >
              {formLoading ? <RefreshCw className="w-5 h-5 animate-spin mx-auto" /> : "Create Module"}
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Module Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Module"
        size="md"
      >
        <form onSubmit={handleUpdateModule} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Module Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Index</label>
              <input
                type="number"
                required
                min={0}
                value={formData.orderIndex}
                onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Release Week</label>
              <input
                type="number"
                required
                min={1}
                value={formData.releaseWeek}
                onChange={(e) => setFormData({ ...formData, releaseWeek: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={formLoading}
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all disabled:opacity-50"
            >
              {formLoading ? <RefreshCw className="w-5 h-5 animate-spin mx-auto" /> : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Module"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <span className="font-semibold">{moduleToDelete?.title}</span>? 
            This action cannot be undone.
          </p>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleDeleteModule}
              disabled={formLoading}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all disabled:opacity-50"
            >
              {formLoading ? <RefreshCw className="w-5 h-5 animate-spin mx-auto" /> : "Delete"}
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.show} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  );
}

