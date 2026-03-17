'use client';

import { useState, useEffect, useCallback, useMemo } from "react";
import Modal from "@/components/admin/Modal";
import Toast from "@/components/admin/Toast";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  LayoutGrid,
  List,
  Layers
} from "lucide-react";
import { Module } from "@/services/moduleService";
import { moduleService } from "@/services/moduleService";
import { courseService } from "@/services/courseService";
import type { BackendCourse } from "@/types/course";
import { tokenManager } from "@/lib/auth";

const initialModuleForm = {
  courseId: "",
  title: "",
  description: "",
  orderIndex: 0,
  releaseWeek: 1,
};

interface ModuleFormProps {
  form: typeof initialModuleForm;
  onChange: (updates: Partial<typeof initialModuleForm>) => void;
  courses: BackendCourse[];
  selectedCourseId: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  title: string;
}

function formatDate(dateString?: string): string {
  if (!dateString) return "No date";
  try {
    return new Intl.DateTimeFormat("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    }).format(new Date(dateString));
  } catch {
    return "Invalid date";
  }
}

function getCourseName(courseId: string, courses: BackendCourse[]): string {
  return courses.find(c => c.id === courseId)?.title || "Unknown Course";
}

interface ModuleCardProps {
  module: Module;
  courses: BackendCourse[];
  onEdit: () => void;
  onDelete: () => void;
}

function ModuleCard({ module, courses, onEdit, onDelete }: ModuleCardProps) {
  const courseName = getCourseName(module.courseId, courses);
  const desc = (module.description || "").trim();

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{module.title}</h3>
          <p className="text-xs text-gray-500 mt-1">{courseName}</p>
        </div>
        <span className="px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full whitespace-nowrap">
          Week {module.releaseWeek}
        </span>
      </div>

      {desc && (
        <div className="text-sm text-gray-600 leading-relaxed mb-3 [&_strong]:font-bold whitespace-pre-wrap line-clamp-3">
          {desc.substring(0, 150)}...
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
        <span className="truncate">Order: #{module.orderIndex}</span>
        <span>{formatDate(module.createdAt)}</span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <a
          href="#"
          className="text-indigo-600 hover:text-indigo-500 text-xs font-medium"
        >
          View Lessons
        </a>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="Edit module"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            title="Delete module"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface ModuleRowProps {
  module: Module;
  courses: BackendCourse[];
  onEdit: () => void;
  onDelete: () => void;
}

function ModuleRow({ module, courses, onEdit, onDelete }: ModuleRowProps) {
  const courseName = getCourseName(module.courseId, courses);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900">{module.title}</div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">{courseName}</td>
      <td className="px-6 py-4">
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
          Week {module.releaseWeek}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(module.createdAt)}</td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2">
          <button onClick={onEdit} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100" title="Edit">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ModuleFormModal({ 
  form, 
  onChange, 
  courses, 
  selectedCourseId, 
  onClose, 
  onSubmit, 
  loading, 
  title 
}: ModuleFormProps) {
  return (
    <Modal isOpen onClose={onClose} title={title} size="md">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Course *</label>
          <select
            value={form.courseId}
            onChange={e => onChange({ courseId: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Select Course</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={e => onChange({ title: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            required
            maxLength={200}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={e => onChange({ description: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-vertical"
            placeholder="Enter module description..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Order Index *</label>
            <input
              type="number"
              value={form.orderIndex}
              onChange={e => onChange({ orderIndex: parseInt(e.target.value) || 0 })}
              min={0}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Release Week *</label>
            <input
              type="number"
              value={form.releaseWeek}
              onChange={e => onChange({ releaseWeek: parseInt(e.target.value) || 1 })}
              min={1}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl flex items-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {title.includes("Create") ? "Create Module" : "Update Module"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function DeleteModuleModal({ module, onClose, onDelete, loading }: {
  module: Module;
  onClose: () => void;
  onDelete: () => void;
  loading: boolean;
}) {
  return (
    <Modal isOpen onClose={onClose} title="Delete Module" size="sm">
      <div className="space-y-4">
        <div className="text-center">
          <Trash2 className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Delete "{module.title}"?</h3>
          <p className="text-sm text-gray-500">This action cannot be undone. Associated lessons may also be affected.</p>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium">
            Cancel
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={loading}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl flex items-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function InstructorModulesPage() {
  // States
  const [courses, setCourses] = useState<BackendCourse[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  const [loading, setLoading] = useState(true);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({ show: false, message: "", type: "success" });

  const [moduleForm, setModuleForm] = useState(initialModuleForm);
  const [formLoading, setFormLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  // Handlers
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  const updateModuleForm = (updates: Partial<typeof initialModuleForm>) => {
    setModuleForm(prev => ({ ...prev, ...updates }));
  };

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { courses } = await courseService.getAllCourses(1, 50);
      setCourses(courses);
      if (courses.length > 0) setSelectedCourse(courses[0].id);
    } catch (err: any) {
      setError(err.message || "Failed to load courses");
      showToast(err.message || "Failed to load courses", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchModules = useCallback(async () => {
    if (!selectedCourse) {
      setModules([]);
      return;
    }
    try {
      setModulesLoading(true);
      setError(null);
      const data = await moduleService.getModulesByCourse(selectedCourse);
      setModules(data);
    } catch (err: any) {
      setModules([]);
      setError(err.message || "Failed to load modules");
      showToast(err.message || "Failed to load modules", "error");
    } finally {
      setModulesLoading(false);
    }
  }, [selectedCourse]);

  // Effects
  useEffect(() => { fetchCourses(); }, [fetchCourses]);
  useEffect(() => { fetchModules(); }, [fetchModules]);

  const filteredModules = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return modules.filter(m => 
      m.title.toLowerCase().includes(q) || 
      m.description?.toLowerCase().includes(q) ||
      getCourseName(m.courseId, courses).toLowerCase().includes(q)
    );
  }, [modules, searchTerm, courses]);

  // CRUD handlers
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleForm.courseId || !moduleForm.title.trim()) {
      showToast("Please fill all required fields", "error");
      return;
    }
    try {
      setFormLoading(true);
      await moduleService.createModule(moduleForm);
      showToast("Module created successfully!");
      setShowCreateModal(false);
      setModuleForm(initialModuleForm);
      fetchModules();
    } catch (err: any) {
      showToast(err.message || "Failed to create module", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModule || !moduleForm.title.trim()) return;
    try {
      setFormLoading(true);
      await moduleService.updateModule(selectedModule.id, {
        title: moduleForm.title,
        description: moduleForm.description,
        orderIndex: moduleForm.orderIndex,
        releaseWeek: moduleForm.releaseWeek,
      });
      showToast("Module updated successfully!");
      setShowEditModal(false);
      setSelectedModule(null);
      setModuleForm(initialModuleForm);
      fetchModules();
    } catch (err: any) {
      showToast(err.message || "Failed to update module", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!moduleToDelete) return;
    try {
      setFormLoading(true);
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

  const openCreateModal = () => {
    if (!selectedCourse) return showToast("Please select a course first", "error");
    setModuleForm({ ...initialModuleForm, courseId: selectedCourse, orderIndex: modules.length });
    setShowCreateModal(true);
  };

  const openEditModal = (module: Module) => {
    setSelectedModule(module);
    setModuleForm({
      courseId: module.courseId,
      title: module.title,
      description: module.description || "",
      orderIndex: module.orderIndex || 0,
      releaseWeek: module.releaseWeek || 1,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (module: Module) => {
    setModuleToDelete(module);
    setShowDeleteModal(true);
  };

  if (loading && !courses.length) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
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
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${viewMode === "card" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"}`}
              title="Card view"
            >
              <LayoutGrid className="w-4 h-4" />
              Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${viewMode === "list" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"}`}
              title="List view"
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>
          <button
            onClick={openCreateModal}
            disabled={!selectedCourse || formLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add Module
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search modules by title, description or course..."
          className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full max-w-md"
        />
      </div>

      {/* Course Selector */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
        <select
          value={selectedCourse}
          onChange={e => setSelectedCourse(e.target.value)}
          disabled={loading || modulesLoading}
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Content */}
      {modulesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-64" />
          ))}
        </div>
      ) : filteredModules.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No modules found</h3>
          <p className="text-gray-500 mb-6">Select a course above to view modules or create the first one.</p>
          <button 
            onClick={openCreateModal} 
            disabled={!selectedCourse} 
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create First Module
          </button>
        </div>
      ) : viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredModules.map(module => (
            <ModuleCard
              key={module.id}
              module={module}
              courses={courses}
              onEdit={() => openEditModal(module)}
              onDelete={() => openDeleteModal(module)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Week</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredModules.map(module => (
                  <ModuleRow
                    key={module.id}
                    module={module}
                    courses={courses}
                    onEdit={() => openEditModal(module)}
                    onDelete={() => openDeleteModal(module)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <ModuleFormModal
          form={moduleForm}
          onChange={updateModuleForm}
          courses={courses}
          selectedCourseId={selectedCourse}
          onClose={() => {
            setShowCreateModal(false);
            setModuleForm(initialModuleForm);
          }}
          onSubmit={handleCreate}
          loading={formLoading}
          title="Create New Module"
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedModule && (
        <ModuleFormModal
          form={moduleForm}
          onChange={updateModuleForm}
          courses={courses}
          selectedCourseId={selectedCourse}
          onClose={() => {
            setShowEditModal(false);
            setSelectedModule(null);
            setModuleForm(initialModuleForm);
          }}
          onSubmit={handleUpdate}
          loading={formLoading}
          title={`Edit ${selectedModule.title}`}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && moduleToDelete && (
        <DeleteModuleModal
          module={moduleToDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setModuleToDelete(null);
          }}
          onDelete={handleDelete}
          loading={formLoading}
        />
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ show: false, message: "", type: "success" })}
      />
    </div>
  );
}

