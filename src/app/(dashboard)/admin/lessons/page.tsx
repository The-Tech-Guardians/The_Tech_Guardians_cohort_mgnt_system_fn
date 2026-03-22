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
  ExternalLink,
  Play,
  Layers
} from "lucide-react";
import { BackendLesson } from "@/types/lesson";
import { lessonService } from "@/services/lessonService";
import { moduleService, type Module } from "@/services/moduleService";
import { courseService, type BackendCourse } from "@/services/courseService";

const CONTENT_TYPE_OPTIONS = [
  { value: "video", label: "Video" },
  { value: "pdf", label: "PDF" },
  { value: "text", label: "Text" },
];

const initialLessonForm = {
  moduleId: "",
  title: "",
  contentType: "text",
  contentBody: "",
  orderIndex: 0,
  file: null as File | null,
};

interface LessonFormProps {
  form: typeof initialLessonForm;
  onChange: (updates: Partial<typeof initialLessonForm>) => void;
  onFileChange: (file: File | null) => void;
  modules: Module[];
  selectedModuleId: string;
  contentTypeOptions: typeof CONTENT_TYPE_OPTIONS;
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

function getModuleName(moduleId: string, modules: Module[]): string {
  return modules.find(m => m.id === moduleId)?.title || "Unknown Module";
}

// Child Components
interface LessonCardProps {
  lesson: BackendLesson;
  modules: Module[];
  onEdit: () => void;
  onDelete: () => void;
}

function LessonCard({ lesson, modules, onEdit, onDelete }: LessonCardProps) {
  const moduleName = getModuleName(lesson.moduleId, modules);
  const hasContent = lesson.contentUrl || lesson.contentBody;
  const isVideo = lesson.contentType === "video";
  const isTextOrPDF = lesson.contentType === "text" || lesson.contentType === "pdf";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{lesson.title}</h3>
          <p className="text-xs text-gray-500 mt-1">{moduleName}</p>
        </div>
        <span className="px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full whitespace-nowrap">
          {lesson.contentType.toUpperCase()}
        </span>
      </div>

{isVideo && lesson.contentUrl && (
        <div className="mb-3">
          <video 
            controls 
            className="w-full rounded-lg shadow-sm border"
            preload="metadata"
          >
            <source src={lesson.contentUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {isVideo && lesson.contentBody && (
        <div className="text-sm text-gray-600 leading-relaxed mb-3 [&_strong]:font-bold whitespace-pre-wrap line-clamp-3">
          {lesson.contentBody.substring(0, 150)}...
        </div>
      )}
      {(lesson.contentBody || "").trim() && (
        <div className="text-sm text-gray-600 leading-relaxed mb-3 [&_strong]:font-bold [&_p]:mb-2 whitespace-pre-wrap max-h-24 overflow-y-auto">
          {lesson.contentBody?.split('\n').map((line, i) => {
            if (/^\d/.test(line.trim())) {
              return <p key={i} className="font-medium">{line}</p>;
            }
            return <span key={i}>{line}</span>;
          })}
        </div>
      )}


      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
        <span className="truncate">Order: #{lesson.orderIndex}</span>
        <span>{formatDate(lesson.createdAt)}</span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="Edit lesson"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            title="Delete lesson"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface LessonRowProps {
  lesson: BackendLesson;
  modules: Module[];
  onEdit: () => void;
  onDelete: () => void;
}

function LessonRow({ lesson, modules, onEdit, onDelete }: LessonRowProps) {
  const moduleName = getModuleName(lesson.moduleId, modules);
  const isVideo = lesson.contentType === "video";

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900">{lesson.title}</div>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
          {lesson.contentType.toUpperCase()}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">{moduleName}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(lesson.createdAt)}</td>
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

function LessonFormModal({ 
  form, 
  onChange, 
  onFileChange, 
  modules, 
  selectedModuleId, 
  contentTypeOptions, 
  onClose, 
  onSubmit, 
  loading, 
  title 
}: LessonFormProps & { 
  onClose: () => void; 
  onSubmit: (e: React.FormEvent) => void; 
  loading: boolean; 
  title: string;
  lesson?: BackendLesson;
}) {
  return (
    <Modal isOpen onClose={onClose} title={title} size="md">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Module *</label>
          <select
            value={form.moduleId}
            onChange={e => onChange({ moduleId: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Select Module</option>
            {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
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
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Content Type *</label>
          <select
            value={form.contentType}
            onChange={e => {
              onChange({ contentType: e.target.value as 'video' | 'pdf' | 'text' });
              onFileChange(null);
            }}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            required
          >
            {contentTypeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Content Body * 
            {(form.contentType === "text" || form.contentType === "pdf") && "(Markdown supported)"}
          </label>
          <textarea
            rows={5}
            value={form.contentBody}
            onChange={e => onChange({ contentBody: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-vertical"
            required
            placeholder="Enter lesson content..."
          />
        </div>
        {form.contentType !== "text" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Upload File</label>
            <input
              type="file"
              accept={form.contentType === "video" ? ".mp4,.avi,.mov" : ".pdf"}
              onChange={e => onFileChange(e.target.files?.[0] || null)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {form.file && <p className="mt-1 text-sm text-gray-500">Selected: {form.file.name}</p>}
          </div>
        )}
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl flex items-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {title.includes("Create") ? "Create Lesson" : "Update Lesson"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function DeleteLessonModal({ lesson, onClose, onDelete, loading }: {
  lesson: BackendLesson;
  onClose: () => void;
  onDelete: () => void;
  loading: boolean;
}) {
  return (
    <Modal isOpen onClose={onClose} title="Delete Lesson" size="sm">
      <div className="space-y-4">
        <div className="text-center">
          <Trash2 className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Delete "{lesson.title}"?</h3>
          <p className="text-sm text-gray-500">This action cannot be undone. This will permanently delete the lesson and associated data.</p>
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

export default function AdminLessonsPage() {
  // States
  const [courses, setCourses] = useState<BackendCourse[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<BackendLesson[]>([]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedModule, setSelectedModule] = useState("");

  const [loading, setLoading] = useState(true);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedLesson, setSelectedLesson] = useState<BackendLesson | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<BackendLesson | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({ show: false, message: "", type: "success" });

  const [lessonForm, setLessonForm] = useState(initialLessonForm);
  const [formLoading, setFormLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  // Handlers
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  const updateLessonForm = (updates: Partial<typeof initialLessonForm>) => {
    setLessonForm(prev => ({ ...prev, ...updates }));
  };

  const onFileChange = (file: File | null) => {
    setLessonForm(prev => ({ ...prev, file }));
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
      setSelectedModule("");
      setLessons([]);
      return;
    }
    try {
      setModulesLoading(true);
      setError(null);
      const data = await moduleService.getModulesByCourse(selectedCourse);
      setModules(data);
      if (data.length > 0) setSelectedModule(data[0].id);
      else setSelectedModule("");
    } catch (err: any) {
      setModules([]);
      setSelectedModule("");
      setError(err.message || "Failed to load modules");
      showToast(err.message || "Failed to load modules", "error");
    } finally {
      setModulesLoading(false);
    }
  }, [selectedCourse]);

  const fetchLessons = useCallback(async () => {
    if (!selectedModule) {
      setLessons([]);
      return;
    }
    try {
      setLessonsLoading(true);
      setError(null);
      const data = await lessonService.getLessonsByModule(selectedModule);
      setLessons(data);
    } catch (err: any) {
      setLessons([]);
      setError(err.message || "Failed to load lessons");
      showToast(err.message || "Failed to load lessons", "error");
    } finally {
      setLessonsLoading(false);
    }
  }, [selectedModule]);

  // Effects
  useEffect(() => { fetchCourses(); }, [fetchCourses]);
  useEffect(() => { fetchModules(); }, [fetchModules]);
  useEffect(() => { fetchLessons(); }, [fetchLessons]);

  const filteredLessons = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return lessons.filter(l => 
      l.title.toLowerCase().includes(q) || 
      l.contentType.toLowerCase().includes(q) ||
      getModuleName(l.moduleId, modules).toLowerCase().includes(q)
    );
  }, [lessons, searchTerm, modules]);

  // CRUD handlers
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonForm.moduleId || !lessonForm.title.trim() || !lessonForm.contentBody?.trim()) {
      showToast("Please fill all required fields", "error");
      return;
    }
    try {
      setFormLoading(true);
      const formData = new FormData();
      Object.entries(lessonForm).forEach(([key, val]) => {
        if (key === "file" && val instanceof File) formData.append("file", val);
        else if (val !== null && val !== "") formData.append(key, String(val));
      });
      await lessonService.createLesson(formData);
      showToast("Lesson created successfully!");
      setShowCreateModal(false);
      setLessonForm(initialLessonForm);
      fetchLessons();
    } catch (err: any) {
      showToast(err.message || "Failed to create lesson", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLesson || !lessonForm.title.trim() || !lessonForm.contentBody?.trim()) return;
    try {
      setFormLoading(true);
      const formData = new FormData();
      Object.entries(lessonForm).forEach(([key, val]) => {
        if (key === "file" && val instanceof File) formData.append("file", val);
        else if (val !== null && val !== "") formData.append(key, String(val));
      });
      await lessonService.updateLesson(selectedLesson.id, formData);
      showToast("Lesson updated successfully!");
      setShowEditModal(false);
      setSelectedLesson(null);
      setLessonForm(initialLessonForm);
      fetchLessons();
    } catch (err: any) {
      showToast(err.message || "Failed to update lesson", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!lessonToDelete) return;
    try {
      setFormLoading(true);
      await lessonService.deleteLesson(lessonToDelete.id);
      showToast("Lesson deleted successfully!");
      setShowDeleteModal(false);
      setLessonToDelete(null);
      fetchLessons();
    } catch (err: any) {
      showToast(err.message || "Failed to delete lesson", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const openCreateModal = () => {
    if (!selectedModule) return showToast("Please select a module first", "error");
    setLessonForm({ ...initialLessonForm, moduleId: selectedModule, orderIndex: lessons.length });
    setShowCreateModal(true);
  };

  const openEditModal = (lesson: BackendLesson) => {
    setSelectedLesson(lesson);
    setLessonForm({
      moduleId: lesson.moduleId,
      title: lesson.title,
      contentType: lesson.contentType,
      contentBody: lesson.contentBody || "",
      orderIndex: lesson.orderIndex || 0,
      file: null,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (lesson: BackendLesson) => {
    setLessonToDelete(lesson);
    setShowDeleteModal(true);
  };

  const selectedModuleData = modules.find(m => m.id === selectedModule);

  if (loading && !courses.length) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="space-y-6">

{/* Header */}
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
  <div>
    <h1 className="text-2xl font-bold text-gray-900">Lesson Management</h1>
    <p className="text-sm text-gray-500 mt-1">Create and manage course lessons</p>
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
      disabled={!selectedModule || formLoading}
      className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Plus className="w-4 h-4" />
      Add Lesson
    </button>
  </div>
</div>

{/* Search */}
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
  <input
    value={searchTerm}
    onChange={e => setSearchTerm(e.target.value)}
    placeholder="Search lessons by title, type or module..."
    className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full max-w-md"
  />
</div>


      {/* Course/Module Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Module</label>
          <select
            value={selectedModule}
            onChange={e => setSelectedModule(e.target.value)}
            disabled={modulesLoading}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Module</option>
            {modules.map(module => (
              <option key={module.id} value={module.id}>{module.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Content */}
      {lessonsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-64" />
          ))}
        </div>
      ) : filteredLessons.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No lessons found</h3>
          <p className="text-gray-500 mb-6">Select a module above to view lessons or create the first one.</p>
          <button 
            onClick={openCreateModal} 
            disabled={!selectedModule} 
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create First Lesson
          </button>
        </div>
      ) : viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredLessons.map(lesson => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              modules={modules}
              onEdit={() => openEditModal(lesson)}
              onDelete={() => openDeleteModal(lesson)}
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Module</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLessons.map(lesson => (
                  <LessonRow
                    key={lesson.id}
                    lesson={lesson}
                    modules={modules}
                    onEdit={() => openEditModal(lesson)}
                    onDelete={() => openDeleteModal(lesson)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <LessonFormModal
          form={lessonForm}
          onChange={updateLessonForm}
          onFileChange={onFileChange}
          modules={modules}
          selectedModuleId={selectedModule}
          contentTypeOptions={CONTENT_TYPE_OPTIONS}
          onClose={() => {
            setShowCreateModal(false);
            setLessonForm(initialLessonForm);
          }}
          onSubmit={handleCreate}
          loading={formLoading}
          title="Create New Lesson"
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedLesson && (
        <LessonFormModal
          form={lessonForm}
          onChange={updateLessonForm}
          onFileChange={onFileChange}
          modules={modules}
          selectedModuleId={selectedModule}
          contentTypeOptions={CONTENT_TYPE_OPTIONS}
          lesson={selectedLesson}
          onClose={() => {
            setShowEditModal(false);
            setSelectedLesson(null);
            setLessonForm(initialLessonForm);
          }}
          onSubmit={handleUpdate}
          loading={formLoading}
          title={`Edit ${selectedLesson.title}`}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && lessonToDelete && (
        <DeleteLessonModal
          lesson={lessonToDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setLessonToDelete(null);
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

