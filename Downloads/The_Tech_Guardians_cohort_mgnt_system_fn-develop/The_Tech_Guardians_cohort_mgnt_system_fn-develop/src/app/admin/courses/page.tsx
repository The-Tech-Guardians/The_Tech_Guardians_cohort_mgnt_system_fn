'use client';

import { useState } from "react";
import Modal from "@/components/admin/Modal";
import { Plus, BookOpen, Video, Search, Edit } from "lucide-react";

interface Course {
  id: number;
  name: string;
  type: string;
  modules: number;
  lessons: number;
  assessments: number;
  status: "draft" | "published";
  createdAt: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      name: "Social Media Branding",
      type: "Social Media Branding",
      modules: 8,
      lessons: 24,
      assessments: 6,
      status: "published",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Beginner Level Computer Programming",
      type: "Computer Programming",
      modules: 12,
      lessons: 48,
      assessments: 15,
      status: "published",
      createdAt: "2024-02-01",
    },
    {
      id: 3,
      name: "Entrepreneurship",
      type: "Entrepreneurship",
      modules: 10,
      lessons: 32,
      assessments: 8,
      status: "published",
      createdAt: "2024-03-10",
    },
    {
      id: 4,
      name: "SRHR",
      type: "SRHR",
      modules: 6,
      lessons: 18,
      assessments: 4,
      status: "published",
      createdAt: "2024-04-05",
    },
    {
      id: 5,
      name: "Team Management",
      type: "Team Management",
      modules: 8,
      lessons: 24,
      assessments: 6,
      status: "draft",
      createdAt: "2024-05-01",
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-sm text-sm"
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
          />
        </div>
      </div>

      {/* Course Structure Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Course Structure</h3>
        <div className="text-xs text-blue-700 space-y-1">
          <p>• Course → Modules → Lessons (hierarchical structure)</p>
          <p>• Content types: Video, PDF, Text/Markdown</p>
          <p>• Weekly release schedule for modules</p>
          <p>• Assessments: Assignments, Quizzes (MCQ, True/False)</p>
          <p>• Grading: Pass/Fail or Percentage-based</p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{course.name}</h3>
                  <p className="text-xs text-gray-500">{course.type}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                course.status === "published"
                  ? "bg-green-50 text-green-600 border-green-200"
                  : "bg-amber-50 text-amber-600 border-amber-200"
              }`}>
                {course.status}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Modules</p>
                <p className="text-lg font-bold text-gray-900">{course.modules}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Lessons</p>
                <p className="text-lg font-bold text-gray-900">{course.lessons}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Assessments</p>
                <p className="text-lg font-bold text-gray-900">{course.assessments}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedCourse(course);
                  setShowModuleModal(true);
                }}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all"
              >
                Manage Content
              </button>
              {course.status === "draft" && (
                <button className="px-4 py-2 text-sm font-medium rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-all">
                  Publish
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Course Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Course"
        size="md"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
            <input
              type="text"
              placeholder="e.g., Web Development Fundamentals"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Type</label>
            <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="">Select type</option>
              <option value="social-media-branding">Social Media Branding</option>
              <option value="computer-programming">Beginner Level Computer Programming</option>
              <option value="entrepreneurship">Entrepreneurship</option>
              <option value="srhr">SRHR</option>
              <option value="team-management">Team Management</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={4}
              placeholder="Course description..."
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all"
            >
              Create Course
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

      {/* Module Management Modal */}
      <Modal
        isOpen={showModuleModal}
        onClose={() => setShowModuleModal(false)}
        title={`Manage Content: ${selectedCourse?.name}`}
        size="xl"
      >
        <div className="space-y-6">
          {/* Add Module Button */}
          <button className="w-full px-4 py-3 bg-indigo-50 border-2 border-dashed border-indigo-300 rounded-xl text-indigo-600 hover:bg-indigo-100 transition-all font-medium">
            + Add Module
          </button>

          {/* Sample Modules */}
          <div className="space-y-4">
            {[1, 2].map((moduleNum) => (
              <div key={moduleNum} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">Module {moduleNum}: Introduction</h4>
                  <button className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100">
                    Edit
                  </button>
                </div>
                
                {/* Lessons */}
                <div className="space-y-2 ml-4">
                  {[1, 2, 3].map((lessonNum) => (
                    <div key={lessonNum} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3">
                        <Video className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">Lesson {lessonNum}: Getting Started</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">15 min</span>
                        <button className="text-xs px-2 py-1 text-gray-600 hover:text-gray-900">Edit</button>
                      </div>
                    </div>
                  ))}
                  <button className="w-full px-3 py-2 bg-white border border-dashed border-gray-300 rounded-xl text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all">
                    + Add Lesson
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
