'use client';

import type { Assessment, CreateAssessmentForm, Question } from "@/types/assessment";

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
  Clock,
  FileText,
  CheckCircle,
} from "lucide-react";
import { instructorApi } from "@/lib/instructorApi";

// interface Question replaced by src/types/assessment.ts


// interface Assessment replaced by src/types/assessment.ts


interface Course {
  id: string;
  title: string;
  description?: string;
}

interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  orderIndex: number;
  releaseWeek: number;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const initialAssessmentForm: CreateAssessmentForm = {
  courseId: "",
  moduleId: "",
  title: "",
  description: "",
  questions: [
    {
      question: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 1,
    }
  ],
  timeLimit: 30,
  passingScore: 70,
  isPublished: false,
};

interface AssessmentFormProps {
  form: CreateAssessmentForm;
  onChange: (updates: Partial<CreateAssessmentForm>) => void;
  courses: Course[];
  modules: Module[];
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

function getCourseName(courseId: string, courses: Course[]): string {
  return courses.find(c => c.id === courseId)?.title || "Unknown Course";
}

function getModuleName(moduleId: string, modules: Module[]): string {
  return modules.find(m => m.id === moduleId)?.title || "General";
}

interface AssessmentCardProps {
  assessment: Assessment;
  courses: Course[];
  modules: Module[];
  onEdit: () => void;
  onDelete: () => void;
}

function AssessmentCard({ assessment, courses, modules, onEdit, onDelete }: AssessmentCardProps) {
  const courseName = getCourseName(assessment.courseId, courses);
  const moduleName = assessment.moduleId ? getModuleName(assessment.moduleId, modules) : null;
  const totalPoints = assessment.questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{assessment.title}</h3>
          <p className="text-xs text-gray-500 mt-1">{courseName}</p>
          {moduleName && <p className="text-xs text-gray-400">{moduleName}</p>}
        </div>
        <span className="px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full whitespace-nowrap">
          {assessment.questions.length} Questions
        </span>
      </div>

      {assessment.description && (
        <div className="text-sm text-gray-600 leading-relaxed mb-3 [&_strong]:font-bold whitespace-pre-wrap line-clamp-3">
          {assessment.description.substring(0, 150)}...
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
        <span className="truncate">Total Points: {totalPoints}</span>
        <span>Time Limit: {assessment.timeLimit || 'No limit'} min</span>
        <span>Passing: {assessment.passingScore || 70}%</span>
        <span>{formatDate(assessment.createdAt)}</span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {assessment.isPublished ? (
            <>
              <CheckCircle className="w-3 h-3 text-green-500" />
              Published
            </>
          ) : (
            <>
              <FileText className="w-3 h-3 text-gray-400" />
              Draft
            </>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="Edit assessment"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            title="Delete assessment"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AssessmentFormModal({ 
  form, 
  onChange, 
  courses, 
  modules, 
  onClose, 
  onSubmit, 
  loading, 
  title 
}: AssessmentFormProps) {
  const addQuestion = () => {
    onChange({
      questions: [...form.questions, {
        question: "",
        type: "multiple-choice",
        options: ["", "", "", ""],
        correctAnswer: 0,
        points: 1,
      } as Question]
    });
  };

  const removeQuestion = (index: number) => {
    onChange({
      questions: form.questions.filter((_, i) => i !== index)
    });
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const newQuestions = [...form.questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    onChange({ questions: newQuestions });
  };

  const filteredModules = modules.filter(m => m.courseId === form.courseId);

  return (
    <Modal isOpen onClose={onClose} title={title} size="lg">
      <form onSubmit={onSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Course *</label>
            <select
              value={form.courseId}
              onChange={e => onChange({ courseId: e.target.value, moduleId: "" })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select Course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Module (Optional)</label>
            <select
              value={form.moduleId}
              onChange={e => onChange({ moduleId: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">General Assessment</option>
              {filteredModules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
          </div>
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
            rows={3}
            value={form.description}
            onChange={e => onChange({ description: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-vertical"
            placeholder="Enter assessment description..."
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Time Limit (minutes)</label>
            <input
              type="number"
              value={form.timeLimit}
              onChange={e => onChange({ timeLimit: parseInt(e.target.value) || 0 })}
              min={0}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Passing Score (%)</label>
            <input
              type="number"
              value={form.passingScore}
              onChange={e => onChange({ passingScore: parseInt(e.target.value) || 70 })}
              min={0}
              max={100}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={e => onChange({ isPublished: e.target.checked })}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700">Publish immediately</label>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">Questions</label>
            <button
              type="button"
              onClick={addQuestion}
              className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-3 h-3 inline mr-1" />
              Add Question
            </button>
          </div>
          <div className="space-y-3">
            {form.questions.map((question, qIndex) => (
              <div key={qIndex} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">Question {qIndex + 1}</h4>
                  {form.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Question *</label>
                    <textarea
                      rows={2}
                      value={question.question}
                      onChange={e => updateQuestion(qIndex, { question: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter your question..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                      <select
                        value={question.type}
                        onChange={e => updateQuestion(qIndex, { type: e.target.value as Question['type'], options: e.target.value === "multiple-choice" ? ["", "", "", ""] : [] })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true-false">True/False</option>
                        <option value="short-answer">Short Answer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Points</label>
                      <input
                        type="number"
                        value={question.points}
                        onChange={e => updateQuestion(qIndex, { points: parseInt(e.target.value) || 1 })}
                        min={1}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                  </div>

                  {question.type === "multiple-choice" && question.options && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Options</label>
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={typeof question.correctAnswer === 'number' && question.correctAnswer === oIndex}
                              onChange={() => updateQuestion(qIndex, { correctAnswer: oIndex })}
                              className="text-indigo-600"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={e => {
                                const newOptions = [...question.options!];
                                newOptions[oIndex] = e.target.value;
                                updateQuestion(qIndex, { options: newOptions });
                              }}
                              placeholder={`Option ${oIndex + 1}`}
                              className="flex-1 px-3 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {question.type === "true-false" && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Correct Answer</label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={question.correctAnswer === "true"}
                            onChange={() => updateQuestion(qIndex, { correctAnswer: "true" as const })}
                            className="mr-2"
                          />
                          True
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={question.correctAnswer === "false"}
                            onChange={() => updateQuestion(qIndex, { correctAnswer: "false" as const })}
                            className="mr-2"
                          />
                          False
                        </label>
                      </div>
                    </div>
                  )}

                  {question.type === "short-answer" && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Correct Answer</label>
                      <input
                        type="text"
                        value={question.correctAnswer}
                        onChange={e => updateQuestion(qIndex, { correctAnswer: e.target.value })}
                        placeholder="Enter the correct answer"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl flex items-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {title.includes("Create") ? "Create Assessment" : "Update Assessment"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function DeleteAssessmentModal({ assessment, onClose, onDelete, loading }: {
  assessment: Assessment;
  onClose: () => void;
  onDelete: () => void;
  loading: boolean;
}) {
  return (
    <Modal isOpen onClose={onClose} title="Delete Assessment" size="sm">
      <div className="space-y-4">
        <div className="text-center">
          <Trash2 className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Delete "{assessment.title}"?</h3>
          <p className="text-sm text-gray-500">This action cannot be undone. All student submissions and results will be lost.</p>
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

export default function InstructorAssessmentsPage() {
  // States
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  const [selectedCourse, setSelectedCourse] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [assessmentToDelete, setAssessmentToDelete] = useState<Assessment | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({ show: false, message: "", type: "success" });

  const [assessmentForm, setAssessmentForm] = useState(initialAssessmentForm);
  const [formLoading, setFormLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  // Handlers
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  const updateAssessmentForm = (updates: Partial<typeof initialAssessmentForm>) => {
    setAssessmentForm(prev => ({ ...prev, ...updates }));
  };

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const instructorCourses = await instructorApi.getInstructorCourses();
      // Transform to Course interface
      const courses: Course[] = instructorCourses.map(course => ({
        id: course.id,
        title: course.title,
        description: course.modules_data ? `${course.modules} modules, ${course.lessons} lessons` : undefined
      }));
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
      const data = await instructorApi.getCourseModules(selectedCourse);
      setModules(data);
    } catch (err: any) {
      setModules([]);
      showToast(err.message || "Failed to load modules", "error");
    }
  }, [selectedCourse]);

  const fetchAssessments = useCallback(async () => {
    if (!selectedCourse) {
      setAssessments([]);
      return;
    }
    try {
      const data = await instructorApi.getCourseAssessments(selectedCourse);
      setAssessments(data);
    } catch (err: any) {
      setAssessments([]);
      showToast(err.message || "Failed to load assessments", "error");
    }
  }, [selectedCourse]);

  // Effects
  useEffect(() => { fetchCourses(); }, [fetchCourses]);
  useEffect(() => { fetchModules(); }, [fetchModules]);
  useEffect(() => { fetchAssessments(); }, [fetchAssessments]);

  const filteredAssessments = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return assessments.filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.description.toLowerCase().includes(q) ||
      getCourseName(a.courseId, courses).toLowerCase().includes(q)
    );
  }, [assessments, searchTerm, courses]);

  // CRUD handlers
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assessmentForm.courseId || !assessmentForm.title.trim()) {
      showToast("Please fill all required fields", "error");
      return;
    }
    try {
      setFormLoading(true);
      await instructorApi.createAssessment(assessmentForm);
      showToast("Assessment created successfully!");
      setShowCreateModal(false);
      setAssessmentForm(initialAssessmentForm);
      fetchAssessments();
    } catch (err: any) {
      showToast(err.message || "Failed to create assessment", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssessment || !assessmentForm.title.trim()) return;
    try {
      setFormLoading(true);
      await instructorApi.updateAssessment(selectedAssessment.id, assessmentForm);
      showToast("Assessment updated successfully!");
      setShowEditModal(false);
      setSelectedAssessment(null);
      setAssessmentForm(initialAssessmentForm);
      fetchAssessments();
    } catch (err: any) {
      showToast(err.message || "Failed to update assessment", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!assessmentToDelete) return;
    try {
      setFormLoading(true);
      await instructorApi.deleteAssessment(assessmentToDelete.id);
      showToast("Assessment deleted successfully!");
      setShowDeleteModal(false);
      setAssessmentToDelete(null);
      fetchAssessments();
    } catch (err: any) {
      showToast(err.message || "Failed to delete assessment", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const openCreateModal = () => {
    if (!selectedCourse) return showToast("Please select a course first", "error");
    setAssessmentForm({ ...initialAssessmentForm, courseId: selectedCourse });
    setShowCreateModal(true);
  };

  const openEditModal = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setAssessmentForm({
      courseId: assessment.courseId,
      moduleId: assessment.moduleId || "",
      title: assessment.title,
      description: assessment.description,
      questions: assessment.questions,
      timeLimit: assessment.timeLimit || 30,
      passingScore: assessment.passingScore || 70,
      isPublished: assessment.isPublished || false,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (assessment: Assessment) => {
    setAssessmentToDelete(assessment);
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
          <h1 className="text-2xl font-bold text-gray-900">Assessment Management</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage course assessments</p>
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
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Assessment
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search assessments..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <select
          value={selectedCourse}
          onChange={e => setSelectedCourse(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 min-w-[200px]"
        >
          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      {/* Content */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && filteredAssessments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments found</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first assessment.</p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium"
          >
            Create Assessment
          </button>
        </div>
      ) : (
        <div className={viewMode === "card" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" : "bg-white border border-gray-200 rounded-xl overflow-hidden"}>
          {filteredAssessments.map(assessment => (
            viewMode === "card" ? (
              <AssessmentCard
                key={assessment.id}
                assessment={assessment}
                courses={courses}
                modules={modules}
                onEdit={() => openEditModal(assessment)}
                onDelete={() => openDeleteModal(assessment)}
              />
            ) : (
              <div key={assessment.id} className="border-b border-gray-100 last:border-b-0">
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-gray-900">{assessment.title}</h3>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                          {assessment.questions.length} questions
                        </span>
                        {assessment.isPublished && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Published
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {getCourseName(assessment.courseId, courses)}
                        {assessment.moduleId && ` • ${getModuleName(assessment.moduleId, modules)}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(assessment)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(assessment)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <AssessmentFormModal
          form={assessmentForm}
          onChange={updateAssessmentForm}
          courses={courses}
          modules={modules}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
          loading={formLoading}
          title="Create New Assessment"
        />
      )}

      {showEditModal && (
        <AssessmentFormModal
          form={assessmentForm}
          onChange={updateAssessmentForm}
          courses={courses}
          modules={modules}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAssessment(null);
          }}
          onSubmit={handleUpdate}
          loading={formLoading}
          title="Edit Assessment"
        />
      )}

      {showDeleteModal && assessmentToDelete && (
        <DeleteAssessmentModal
          assessment={assessmentToDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setAssessmentToDelete(null);
          }}
          onDelete={handleDelete}
          loading={formLoading}
        />
      )}

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.show}
          onClose={() => setToast({ show: false, message: "", type: "success" })}
        />
      )}
    </div>
  );
}
