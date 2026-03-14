'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X } from "lucide-react";
import Link from "next/link";
import { courses, cohorts } from "@/lib/instructorApi";

interface Cohort {
  id: string;
  name: string;
  course_type: string;
}

export default function NewCoursePage() {
  const router = useRouter();
  const [cohortsList, setCohortsList] = useState<Cohort[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    duration: '',
    prerequisites: '',
    learningObjectives: '',
    status: 'draft',
    cohortId: '',
    courseType: 'COMPUTER_PROGRAMMING',
    thumbnail: null as File | null
  });
  const [loading, setLoading] = useState(false);
  const [fetchingCohorts, setFetchingCohorts] = useState(true);

  useEffect(() => {
    fetchCohorts();
  }, []);

  const fetchCohorts = async () => {
    try {
      const data = await cohorts.fetchCohorts();
      setCohortsList(data);
    } catch (error) {
      console.error('Failed to fetch cohorts:', error);
    } finally {
      setFetchingCohorts(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      thumbnail: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user info from localStorage or context
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Decode token to get user info (simplified - you might want to use a proper JWT library)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const instructorId = payload.uuid;

      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category || 'programming');
      submitData.append('instructorId', instructorId);
      submitData.append('cohortId', formData.cohortId);
      submitData.append('courseType', formData.courseType);
      submitData.append('status', formData.status);

      if (formData.thumbnail && formData.thumbnail instanceof File) {
        submitData.append('thumbnail', formData.thumbnail);
      }

      const result = await courses.createCourse(submitData);
      
      console.log('Course creation result:', result);

      if (result.success === false) {
        console.error('Course creation failed:', result.message);
        throw new Error(result.message || 'Failed to create course');
      }

      console.log('Course created successfully, redirecting...');
      // Redirect to courses list
      router.push('/instructor/courses');
    } catch (error) {
      console.error('Failed to create course:', error);
      alert('Failed to create course: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/instructor/courses"
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-gray-600">Set up the basic information for your course</p>
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
                  Course Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cohort *
                </label>
                <select
                  name="cohortId"
                  value={formData.cohortId}
                  onChange={handleInputChange}
                  required
                  disabled={fetchingCohorts}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                >
                  <option value="">
                    {fetchingCohorts ? 'Loading cohorts...' : 'Select a cohort'}
                  </option>
                  {cohortsList.map((cohort) => (
                    <option key={cohort.id} value={cohort.id}>
                      {cohort.name} ({cohort.course_type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Type *
                </label>
                <select
                  name="courseType"
                  value={formData.courseType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="COMPUTER_PROGRAMMING">Computer Programming</option>
                  <option value="SOCIAL_MEDIA_BRANDING">Social Media Branding</option>
                  <option value="ENTREPRENEURSHIP">Entrepreneurship</option>
                  <option value="TEAM_MANAGEMENT">Team Management</option>
                  <option value="SRHR">SRHR</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select category</option>
                  <option value="web-development">Web Development</option>
                  <option value="data-science">Data Science</option>
                  <option value="mobile-development">Mobile Development</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                  <option value="marketing">Marketing</option>
                  <option value="programming">Programming</option>
                  <option value="management">Management</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Thumbnail (Optional)
                </label>
                <input
                  type="file"
                  name="thumbnail"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe what students will learn in this course"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prerequisites
                </label>
                <textarea
                  name="prerequisites"
                  value={formData.prerequisites}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="What knowledge or skills are required before taking this course?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Objectives
                </label>
                <textarea
                  name="learningObjectives"
                  value={formData.learningObjectives}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="What will students be able to do after completing this course? (One objective per line)"
                />
              </div>
            </div>
          </div>

          {/* Course Structure Preview */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Course Structure</h3>
            <p className="text-sm text-gray-600 mb-4">
              After creating the course, you'll be able to add modules and lessons.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div>📚 Course: {formData.title || 'Course Title'}</div>
              <div className="ml-4">📖 Module 1: Getting Started</div>
              <div className="ml-8">📄 Lesson 1.1: Introduction</div>
              <div className="ml-8">📄 Lesson 1.2: Setup</div>
              <div className="ml-4">📖 Module 2: Core Concepts</div>
              <div className="ml-8">📄 Lesson 2.1: Fundamentals</div>
              <div className="ml-8">📄 Lesson 2.2: Practice</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 mt-6">
          <Link
            href="/instructor/courses"
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
                Create Course
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}