'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X, BookOpen, Clock, Target } from "lucide-react";
import Link from "next/link";
import { modules, courses } from "@/lib/instructorApi";

export default function NewModulePage() {
  const router = useRouter();
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    order: 1,
    isPublished: false,
    objectives: [] as string[],
    estimatedHours: 0
  });
  const [loading, setLoading] = useState(false);
  const [fetchingCourses, setFetchingCourses] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      console.log('Fetching courses for module creation...');
      
      // Check authentication status
      const token = localStorage.getItem('auth_token');
      console.log('Auth token found:', !!token);
      console.log('Token length:', token?.length || 0);
      
      if (!token) {
        console.error('No auth token found - user not logged in');
        setCoursesList([]);
        setFetchingCourses(false);
        return;
      }
      
      const data = await courses.fetchInstructorCourses();
      console.log('Courses fetched for module creation:', data);
      setCoursesList(data);
    } catch (error) {
      console.error('Failed to fetch courses for module creation:', error);
      // Set empty array to prevent crashes
      setCoursesList([]);
    } finally {
      setFetchingCourses(false);
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
      submitData.append('courseId', formData.courseId);
      submitData.append('order', formData.order.toString());
      submitData.append('estimatedHours', formData.estimatedHours.toString());
      submitData.append('isPublished', formData.isPublished.toString());
      
      // Add objectives as JSON array
      submitData.append('objectives', JSON.stringify(formData.objectives.filter(obj => obj.trim() !== '')));

      const result = await modules.createModule(submitData);

      if (result.success === false) {
        throw new Error(result.message || 'Failed to create module');
      }

      router.push('/instructor/modules');
    } catch (error) {
      console.error('Failed to create module:', error);
      alert('Failed to create module: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  const updateObjective = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/instructor/modules"
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Module</h1>
          <p className="text-gray-600">Organize your course content into structured modules</p>
        </div>
      </div>

      {/* Error State */}
      {fetchingCourses === false && coursesList.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            <strong>Unable to load courses.</strong> Please make sure:
          </p>
          <ul className="list-disc list-inside mt-2 text-yellow-700">
            <li>Backend server is running on localhost:3000</li>
            <li>You are logged in with valid instructor credentials</li>
            <li>Your browser has a valid authentication token</li>
            <li>You have created at least one course</li>
          </ul>
          <div className="mt-3 space-y-2">
            <p className="text-sm text-yellow-600">
              <strong>Debug steps:</strong>
            </p>
            <ol className="list-decimal list-inside text-sm text-yellow-600">
              <li>Check browser console for detailed error messages</li>
              <li>Try logging out and logging back in</li>
              <li>Check if you can see courses in the main courses page</li>
            </ol>
          </div>
          <div className="mt-3 flex gap-3">
            <Link href="/instructor/courses/new" className="text-indigo-600 hover:underline">
              Create a course first
            </Link>
            <span className="text-yellow-600">|</span>
            <Link href="/instructor/courses" className="text-indigo-600 hover:underline">
              View existing courses
            </Link>
            <span className="text-yellow-600">|</span>
            <Link href="/(auth)/login" className="text-indigo-600 hover:underline">
              Login again
            </Link>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Module Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter module title"
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
                  disabled={fetchingCourses || coursesList.length === 0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                >
                  <option value="">
                    {fetchingCourses ? 'Loading courses...' : 
                     coursesList.length === 0 ? 'No courses available - create a course first' : 'Select a course'}
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
                  Order in Course
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Module order"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Hours
                </label>
                <input
                  type="number"
                  name="estimatedHours"
                  value={formData.estimatedHours}
                  onChange={handleInputChange}
                  min="0.5"
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Time to complete"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Module Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe what students will learn in this module"
              />
            </div>
          </div>

          {/* Learning Objectives */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Objectives</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Define what students will be able to do after completing this module
              </p>
              {formData.objectives.map((objective, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-shrink-0 mt-2">
                    <Target size={16} className="text-indigo-600" />
                  </div>
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) => updateObjective(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter learning objective"
                  />
                  <button
                    type="button"
                    onClick={() => removeObjective(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addObjective}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center gap-2"
              >
                + Add Learning Objective
              </button>
            </div>
          </div>

          {/* Module Structure Preview */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Module Structure Preview</h3>
            <p className="text-sm text-gray-600 mb-4">
              After creating the module, you'll be able to add lessons and organize content.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div>📚 Module: {formData.title || 'Module Title'}</div>
              <div className="ml-4">📖 Lesson 1: Introduction</div>
              <div className="ml-4">📖 Lesson 2: Core Concepts</div>
              <div className="ml-4">📖 Lesson 3: Practice & Assessment</div>
              <div className="ml-8">📄 Quiz Module Completion</div>
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
                Publish module immediately
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              If not published, the module will be saved as a draft
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 mt-6">
          <Link
            href="/instructor/modules"
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
                Create Module
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
