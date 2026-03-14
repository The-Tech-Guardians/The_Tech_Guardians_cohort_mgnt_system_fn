'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X, Upload, FileText, Video, Image, Link2 } from "lucide-react";
import Link from "next/link";
import { lessons, courses, modules } from "@/lib/instructorApi";

export default function NewLessonPage() {
  const router = useRouter();
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [modulesList, setModulesList] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    type: 'text',
    courseId: '',
    moduleId: '',
    duration: '',
    order: 1,
    isPublished: false,
    resources: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [fetchingCourses, setFetchingCourses] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (formData.courseId) {
      fetchModules(formData.courseId);
    }
  }, [formData.courseId]);

  const fetchCourses = async () => {
    try {
      const data = await courses.fetchInstructorCourses();
      setCoursesList(data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setFetchingCourses(false);
    }
  };

  const fetchModules = async (courseId: string) => {
    try {
      const data = await modules.fetchModulesByCourse(courseId);
      setModulesList(data);
    } catch (error) {
      console.error('Failed to fetch modules:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('content', formData.content);
      submitData.append('type', formData.type);
      submitData.append('courseId', formData.courseId);
      submitData.append('moduleId', formData.moduleId);
      submitData.append('duration', formData.duration);
      submitData.append('order', formData.order.toString());
      submitData.append('isPublished', formData.isPublished.toString());
      
      // Add resources as JSON array
      submitData.append('resources', JSON.stringify(formData.resources.filter(r => r.trim() !== '')));

      const result = await lessons.createLesson(submitData);

      if (result.success === false) {
        throw new Error(result.message || 'Failed to create lesson');
      }

      router.push('/instructor/lessons');
    } catch (error) {
      console.error('Failed to create lesson:', error);
      alert('Failed to create lesson: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const addResource = () => {
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, '']
    }));
  };

  const updateResource = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.map((r, i) => i === index ? value : r)
    }));
  };

  const removeResource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'image': return Image;
      case 'link': return Link2;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/instructor/lessons"
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Lesson</h1>
          <p className="text-gray-600">Add a new lesson to your course module</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter lesson title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course *
                </label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  required
                  disabled={fetchingCourses}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                >
                  <option value="">
                    {fetchingCourses ? 'Loading courses...' : 'Select a course'}
                  </option>
                  {coursesList.map((course: any) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Module *
                </label>
                <select
                  name="moduleId"
                  value={formData.moduleId}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.courseId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                >
                  <option value="">
                    {!formData.courseId ? 'Select a course first' : 'Select a module'}
                  </option>
                  {modulesList.map((module: any) => (
                    <option key={module.id} value={module.id}>
                      {module.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="text">Text</option>
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                  <option value="link">External Link</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Estimated duration"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order in Module
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Lesson order"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesson Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe what students will learn in this lesson"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Lesson Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={
                    formData.type === 'text' ? 'Enter your lesson content here...' :
                    formData.type === 'video' ? 'Enter video URL or embed code...' :
                    formData.type === 'image' ? 'Enter image URL or description...' :
                    'Enter external link URL...'
                  }
                />
              </div>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Resources</h2>
            <div className="space-y-3">
              {formData.resources.map((resource, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={resource}
                    onChange={(e) => updateResource(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter resource URL or description"
                  />
                  <button
                    type="button"
                    onClick={() => removeResource(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addResource}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
              >
                + Add Resource
              </button>
            </div>
          </div>

          {/* Publishing Options */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Publishing Options</h2>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isPublished"
                id="isPublished"
                checked={formData.isPublished}
                onChange={handleInputChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                Publish lesson immediately
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 mt-6">
          <Link
            href="/instructor/lessons"
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <Save size={20} />
                Create Lesson
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
