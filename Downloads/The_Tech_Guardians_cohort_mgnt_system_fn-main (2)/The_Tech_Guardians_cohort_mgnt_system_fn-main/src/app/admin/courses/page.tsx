'use client';

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { Plus, BookOpen, FileText, Video, File } from "lucide-react";

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

  const columns = [
    {
      key: "name",
      label: "Course",
      render: (course: Course) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-white">{course.name}</p>
            <p className="text-xs text-gray-400">{course.type}</p>
          </div>
        </div>
      ),
    },
    {
      key: "structure",
      label: "Structure",
      render: (course: Course) => (
        <div className="text-xs text-gray-300">
          <p>{course.modules} Modules • {course.lessons} Lessons</p>
          <p className="text-gray-500">{course.assessments} Assessments</p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (course: Course) => (
        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
          course.status === "published"
            ? "bg-green-600/20 text-green-400 border-green-500/30"
            : "bg-amber-600/20 text-amber-400 border-amber-500/30"
        }`}>
          {course.status}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (course: Course) => new Date(course.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (course: Course) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedCourse(course);
              setShowModuleModal(true);
            }}
            className="px-3 py-1 text-xs font-medium rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-all"
          >
            Manage Content
          </button>
          {course.status === "draft" && (
            <button className="px-3 py-1 text-xs font-medium rounded-lg bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30 transition-all">
              Publish
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Course Management" 
        subtitle="Create and manage course content"
      />

      {/* Action Button */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-600/50"
        >
          <Plus className="w-4 h-4" />
          Create Course
        </button>
      </div>

      {/* Course Structure Info */}
      <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-400 mb-2">Course Structure</h3>
        <div className="text-xs text-blue-300/80 space-y-1">
          <p>• Course → Modules → Lessons (hierarchical structure)</p>
          <p>• Content types: Video, PDF, Text/Markdown</p>
          <p>• Weekly release schedule for modules</p>
          <p>• Assessments: Assignments, Quizzes (MCQ, True/False)</p>
          <p>• Grading: Pass/Fail or Percentage-based</p>
        </div>
      </div>

      {/* Courses Table */}
      <DataTable 
        columns={columns} 
        data={courses}
        searchPlaceholder="Search courses..."
      />

      {/* Create Course Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Course"
        size="md"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Course Name</label>
            <input
              type="text"
              placeholder="e.g., Web Development Fundamentals"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Course Type</label>
            <select className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:bg-gray-800 [&>option]:text-white">
              <option value="">Select type</option>
              <option value="social-media-branding">Social Media Branding</option>
              <option value="computer-programming">Beginner Level Computer Programming</option>
              <option value="entrepreneurship">Entrepreneurship</option>
              <option value="srhr">SRHR</option>
              <option value="team-management">Team Management</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              rows={4}
              placeholder="Course description..."
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
            >
              Create Course
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg font-medium transition-all"
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
          <button className="w-full px-4 py-3 bg-blue-600/20 border-2 border-dashed border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-600/30 transition-all font-medium">
            + Add Module
          </button>

          {/* Sample Modules */}
          <div className="space-y-4">
            {[1, 2].map((moduleNum) => (
              <div key={moduleNum} className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">Module {moduleNum}: Introduction</h4>
                  <button className="text-xs px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
                    Edit
                  </button>
                </div>
                
                {/* Lessons */}
                <div className="space-y-2 ml-4">
                  {[1, 2, 3].map((lessonNum) => (
                    <div key={lessonNum} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Video className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">Lesson {lessonNum}: Getting Started</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">15 min</span>
                        <button className="text-xs px-2 py-1 text-gray-400 hover:text-white">Edit</button>
                      </div>
                    </div>
                  ))}
                  <button className="w-full px-3 py-2 bg-white/5 border border-dashed border-white/10 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all">
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
