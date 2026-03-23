'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import Toast from './Toast';
import { Loader2, Edit } from 'lucide-react';
import { BackendLesson } from '@/types/lesson';
import { moduleService, type Module } from '@/services/moduleService';
import { lessonService } from '@/services/lessonService';
import { courseService } from '@/services/courseService';

const CONTENT_TYPE_OPTIONS = [
  { value: "video", label: "Video" },
  { value: "pdf", label: "PDF" },
  { value: "text", label: "Text" },
];

const initialEditForm = {
  moduleId: "",
  title: "",
  contentType: "text" as "video" | "pdf" | "text",
  contentBody: "",
  orderIndex: 0,
  file: null as File | null,
};

interface EditLessonFormProps {
  lesson: BackendLesson;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedLesson: BackendLesson) => void;
}

export default function EditLessonForm({ lesson, isOpen, onClose, onUpdate }: EditLessonFormProps) {
  const [form, setForm] = useState(initialEditForm);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load modules and populate form when lesson changes
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get modules from the first course (or you can pass courseId as prop)
        const coursesRes = await courseService.getAllCourses(1, 10);
        if (coursesRes.courses.length > 0) {
          const firstCourse = coursesRes.courses[0];
          const modulesRes = await moduleService.getModulesByCourse(firstCourse.id);
          setModules(modulesRes);
        }
      } catch (error) {
        console.error('Failed to load modules:', error);
      }
    };

    if (isOpen) {
      loadData();
      // Populate form with lesson data
      setForm({
        moduleId: lesson.moduleId || "",
        title: lesson.title || "",
        contentType: lesson.contentType || "text",
        contentBody: lesson.contentBody || "",
        orderIndex: lesson.orderIndex || 0,
        file: null,
      });
    }
  }, [lesson, isOpen]);

  const handleChange = (updates: Partial<typeof form>) => {
    console.log('Form changing:', updates); // Debug
    setForm(prev => {
      console.log('Previous form:', prev); // Debug
      const newForm = { ...prev, ...updates };
      console.log('New form:', newForm); // Debug
      return newForm;
    });
  };

  const handleFileChange = (file: File | null) => {
    setForm(prev => ({ ...prev, file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for the API
      const formData = new FormData();
      formData.append('moduleId', form.moduleId);
      formData.append('title', form.title);
      formData.append('contentType', form.contentType);
      formData.append('contentBody', form.contentBody);
      formData.append('orderIndex', form.orderIndex.toString());

      // Handle file upload for video/pdf
      if (form.contentType !== "text" && form.file) {
        formData.append('file', form.file);
      }

      // Update lesson
      const updatedLesson = await lessonService.updateLesson(lesson.id, formData);
      
      setToast({ type: 'success', message: 'Lesson updated successfully!' });
      onUpdate(updatedLesson);
      setTimeout(() => {
        onClose();
        setToast(null);
      }, 1500);
    } catch (error) {
      console.error('Error updating lesson:', error);
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Failed to update lesson' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Lesson" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Module *</label>
            <select
              value={form.moduleId}
              onChange={e => handleChange({ moduleId: e.target.value })}
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
              onChange={e => handleChange({ title: e.target.value })}
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
                handleChange({ contentType: e.target.value as 'video' | 'pdf' | 'text' });
                handleFileChange(null);
              }}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              required
            >
              {CONTENT_TYPE_OPTIONS.map(opt => (
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
              onChange={(e) => {
                console.log('Content body changing:', e.target.value); // Debug
                handleChange({ contentBody: e.target.value });
              }}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-vertical"
              required
              placeholder="Enter lesson content..."
              style={{ minHeight: '120px' }}
            />
          </div>

          {form.contentType !== "text" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Upload File</label>
              <input
                type="file"
                accept={form.contentType === "video" ? ".mp4,.avi,.mov" : ".pdf"}
                onChange={e => handleFileChange(e.target.files?.[0] || null)}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {form.file && <p className="mt-1 text-sm text-gray-500">Selected: {form.file.name}</p>}
              {lesson.contentUrl && !form.file && (
                <p className="mt-1 text-sm text-gray-500">Current file: {lesson.contentUrl.split('/').pop()}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Order Index</label>
            <input
              type="number"
              value={form.orderIndex}
              onChange={e => handleChange({ orderIndex: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              min="0"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl flex items-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit className="w-4 h-4" />}
              Update Lesson
            </button>
          </div>
        </form>
      </Modal>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          isVisible={true}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
