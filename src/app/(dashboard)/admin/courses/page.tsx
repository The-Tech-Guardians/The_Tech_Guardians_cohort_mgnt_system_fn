'use client';

import { useState } from "react";
import Modal from "@/components/admin/Modal";
import Toast from "@/components/admin/Toast";
import { Plus, BookOpen, Video, Search, Edit, FileText, Trash2 } from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  type: "video" | "pdf" | "text";
  duration: string;
}

interface Module {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Course {
  id: number;
  name: string;
  type: string;
  modules: Module[];
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
      modules: [
        {
          id: 1,
          title: "Introduction to Social Media",
          description: "Learn the basics",
          lessons: [
            { id: 1, title: "What is Social Media?", type: "video", duration: "15 min" },
            { id: 2, title: "Platform Overview", type: "pdf", duration: "10 min" },
          ]
        }
      ],
      assessments: 6,
      status: "published",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Beginner Level Computer Programming",
      type: "Computer Programming",
      modules: [],
      assessments: 15,
      status: "published",
      createdAt: "2024-02-01",
    },
    {
      id: 3,
      name: "Team Management",
      type: "Team Management",
      modules: [],
      assessments: 6,
      status: "draft",
      createdAt: "2024-05-01",
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [showEditModuleModal, setShowEditModuleModal] = useState(false);
  const [showEditLessonModal, setShowEditLessonModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  const [courseForm, setCourseForm] = useState({ name: "", type: "", description: "" });
  const [moduleForm, setModuleForm] = useState({ title: "", description: "" });
  const [lessonForm, setLessonForm] = useState({ title: "", type: "video" as "video" | "pdf" | "text", duration: "" });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const newCourse: Course = {
      id: courses.length + 1,
      name: courseForm.name,
      type: courseForm.type,
      modules: [],
      assessments: 0,
      status: "draft",
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCourses([...courses, newCourse]);
    setCourseForm({ name: "", type: "", description: "" });
    setShowCreateModal(false);
    showToast("Course created successfully!");
  };

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    
    const newModule: Module = {
      id: selectedCourse.modules.length + 1,
      title: moduleForm.title,
      description: moduleForm.description,
      lessons: [],
    };
    
    setCourses(courses.map(c => 
      c.id === selectedCourse.id 
        ? { ...c, modules: [...c.modules, newModule] }
        : c
    ));
    
    setSelectedCourse({ ...selectedCourse, modules: [...selectedCourse.modules, newModule] });
    setModuleForm({ title: "", description: "" });
    setShowAddModuleModal(false);
    showToast("Module added successfully!");
  };

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !selectedModule) return;
    
    const newLesson: Lesson = {
      id: selectedModule.lessons.length + 1,
      title: lessonForm.title,
      type: lessonForm.type,
      duration: lessonForm.duration,
    };
    
    const updatedModules = selectedCourse.modules.map(m =>
      m.id === selectedModule.id
        ? { ...m, lessons: [...m.lessons, newLesson] }
        : m
    );
    
    setCourses(courses.map(c =>
      c.id === selectedCourse.id
        ? { ...c, modules: updatedModules }
        : c
    ));
    
    setSelectedCourse({ ...selectedCourse, modules: updatedModules });
    setSelectedModule({ ...selectedModule, lessons: [...selectedModule.lessons, newLesson] });
    setLessonForm({ title: "", type: "video", duration: "" });
    setShowAddLessonModal(false);
    showToast("Lesson added successfully!");
  };

  const handleEditModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !selectedModule) return;
    
    const updatedModules = selectedCourse.modules.map(m =>
      m.id === selectedModule.id
        ? { ...m, title: moduleForm.title, description: moduleForm.description }
        : m
    );
    
    setCourses(courses.map(c =>
      c.id === selectedCourse.id
        ? { ...c, modules: updatedModules }
        : c
    ));
    
    setSelectedCourse({ ...selectedCourse, modules: updatedModules });
    setShowEditModuleModal(false);
    showToast("Module updated successfully!");
  };

  const handleEditLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !selectedModule || !selectedLesson) return;
    
    const updatedModules = selectedCourse.modules.map(m =>
      m.id === selectedModule.id
        ? {
            ...m,
            lessons: m.lessons.map(l =>
              l.id === selectedLesson.id
                ? { ...l, title: lessonForm.title, type: lessonForm.type, duration: lessonForm.duration }
                : l
            )
          }
        : m
    );
    
    setCourses(courses.map(c =>
      c.id === selectedCourse.id
        ? { ...c, modules: updatedModules }
        : c
    ));
    
    setSelectedCourse({ ...selectedCourse, modules: updatedModules });
    setShowEditLessonModal(false);
    showToast("Lesson updated successfully!");
  };

  const handlePublishCourse = (courseId: number) => {
    setCourses(courses.map(c =>
      c.id === courseId ? { ...c, status: "published" as const } : c
    ));
    showToast("Course published successfully!");
  };

  const handleDeleteLesson = (moduleId: number, lessonId: number) => {
    if (!selectedCourse) return;
    
    const updatedModules = selectedCourse.modules.map(m =>
      m.id === moduleId
        ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
        : m
    );
    
    setCourses(courses.map(c =>
      c.id === selectedCourse.id
        ? { ...c, modules: updatedModules }
        : c
    ));
    
    setSelectedCourse({ ...selectedCourse, modules: updatedModules });
    showToast("Lesson deleted successfully!");
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="w-4 h-4 text-gray-400" />;
      case "pdf": return <FileText className="w-4 h-4 text-gray-400" />;
      default: return <BookOpen className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
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
                <p className="text-lg font-bold text-gray-900">{course.modules.length}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Lessons</p>
                <p className="text-lg font-bold text-gray-900">
                  {course.modules.reduce((sum, m) => sum + m.lessons.length, 0)}
                </p>
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
                <button 
                  onClick={() => handlePublishCourse(course.id)}
                  className="px-4 py-2 text-sm font-medium rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-all"
                >
                  Publish
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Course" size="md">
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
            <input
              type="text"
              required
              value={courseForm.name}
              onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
              placeholder="e.g., Web Development Fundamentals"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Type</label>
            <select 
              required
              value={courseForm.type}
              onChange={(e) => setCourseForm({ ...courseForm, type: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select type</option>
              <option value="Social Media Branding">Social Media Branding</option>
              <option value="Computer Programming">Computer Programming</option>
              <option value="Entrepreneurship">Entrepreneurship</option>
              <option value="SRHR">SRHR</option>
              <option value="Team Management">Team Management</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={4}
              value={courseForm.description}
              onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              placeholder="Course description..."
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all">
              Create Course
            </button>
            <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all">
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showModuleModal} onClose={() => setShowModuleModal(false)} title={`Manage Content: ${selectedCourse?.name}`} size="xl">
        <div className="space-y-6">
          <button 
            onClick={() => setShowAddModuleModal(true)}
            className="w-full px-4 py-3 bg-indigo-50 border-2 border-dashed border-indigo-300 rounded-xl text-indigo-600 hover:bg-indigo-100 transition-all font-medium"
          >
            + Add Module
          </button>

          <div className="space-y-4">
            {selectedCourse?.modules.map((module) => (
              <div key={module.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{module.title}</h4>
                  <button 
                    onClick={() => {
                      setSelectedModule(module);
                      setModuleForm({ title: module.title, description: module.description });
                      setShowEditModuleModal(true);
                    }}
                    className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
                  >
                    Edit
                  </button>
                </div>
                
                <div className="space-y-2 ml-4">
                  {module.lessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3">
                        {getLessonIcon(lesson.type)}
                        <span className="text-sm text-gray-700">{lesson.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{lesson.duration}</span>
                        <button 
                          onClick={() => {
                            setSelectedModule(module);
                            setSelectedLesson(lesson);
                            setLessonForm({ title: lesson.title, type: lesson.type, duration: lesson.duration });
                            setShowEditLessonModal(true);
                          }}
                          className="text-xs px-2 py-1 text-gray-600 hover:text-gray-900"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteLesson(module.id, lesson.id)}
                          className="text-xs px-2 py-1 text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      setSelectedModule(module);
                      setShowAddLessonModal(true);
                    }}
                    className="w-full px-3 py-2 bg-white border border-dashed border-gray-300 rounded-xl text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    + Add Lesson
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <Modal isOpen={showAddModuleModal} onClose={() => setShowAddModuleModal(false)} title="Add Module" size="md">
        <form onSubmit={handleAddModule} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Module Title</label>
            <input
              type="text"
              required
              value={moduleForm.title}
              onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
              placeholder="e.g., Introduction to Programming"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={3}
              value={moduleForm.description}
              onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
              placeholder="Module description..."
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all">
              Add Module
            </button>
            <button type="button" onClick={() => setShowAddModuleModal(false)} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all">
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showAddLessonModal} onClose={() => setShowAddLessonModal(false)} title="Add Lesson" size="md">
        <form onSubmit={handleAddLesson} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title</label>
            <input
              type="text"
              required
              value={lessonForm.title}
              onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
              placeholder="e.g., Getting Started"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
            <select
              value={lessonForm.type}
              onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value as "video" | "pdf" | "text" })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
              <option value="text">Text/Markdown</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
            <input
              type="text"
              required
              value={lessonForm.duration}
              onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
              placeholder="e.g., 15 min"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all">
              Add Lesson
            </button>
            <button type="button" onClick={() => setShowAddLessonModal(false)} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all">
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showEditModuleModal} onClose={() => setShowEditModuleModal(false)} title="Edit Module" size="md">
        <form onSubmit={handleEditModule} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Module Title</label>
            <input
              type="text"
              required
              value={moduleForm.title}
              onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={3}
              value={moduleForm.description}
              onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all">
              Update Module
            </button>
            <button type="button" onClick={() => setShowEditModuleModal(false)} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all">
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showEditLessonModal} onClose={() => setShowEditLessonModal(false)} title="Edit Lesson" size="md">
        <form onSubmit={handleEditLesson} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title</label>
            <input
              type="text"
              required
              value={lessonForm.title}
              onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
            <select
              value={lessonForm.type}
              onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value as "video" | "pdf" | "text" })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
              <option value="text">Text/Markdown</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
            <input
              type="text"
              required
              value={lessonForm.duration}
              onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all">
              Update Lesson
            </button>
            <button type="button" onClick={() => setShowEditLessonModal(false)} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all">
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <Toast message={toast.message} type={toast.type} isVisible={toast.show} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}
