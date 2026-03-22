"use client";

<<<<<<< HEAD
import type { Assessment, CreateAssessmentForm, Question } from "@/types/assessment";

import { useState, useEffect, useCallback, useMemo } from "react";
=======
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Loader2, Clock, CheckCircle, XCircle, Search, Filter, Grid, List, BookOpen, Users, AlertCircle, Eye, ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { assessmentService, courseService, moduleService } from "@/services";
import { tokenManager } from "@/lib/auth";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/backend';
>>>>>>> 3b5ef9c (Fixing Assesment Integration issues)
import Modal from "@/components/admin/Modal";
import Toast from "@/components/admin/Toast";
import FormattedTextEditor from "@/components/editor/FormattedTextEditor";
import QuestionsSidebar from "@/components/assessment/QuestionsSidebar";
import type { CreateAssessment, UpdateAssessment, Assessment as TypedAssessment } from "@/types/assessment";
import { Question, Course } from "@/types";
import type { BackendCourse } from "@/types/course";
import type { Module } from "@/services/moduleService";

<<<<<<< HEAD
// interface Question replaced by src/types/assessment.ts


// interface Assessment replaced by src/types/assessment.ts

=======
interface ExtendedAssessmentFormData extends CreateAssessment {
  courseId: string;
}
>>>>>>> 3b5ef9c (Fixing Assesment Integration issues)

type AssessmentFormData = ExtendedAssessmentFormData;

<<<<<<< HEAD
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
=======
const initialAssessmentForm: ExtendedAssessmentFormData = {
>>>>>>> 3b5ef9c (Fixing Assesment Integration issues)
  title: "",
  description: "",
  type: "QUIZ",
  moduleId: "",
  timeLimitMinutes: 60,
  passMark: 70,
  retakeLimit: 3,
  instantFeedback: true,
  courseId: "",
};

interface AssessmentFormProps {
<<<<<<< HEAD
  form: CreateAssessmentForm;
  onChange: (updates: Partial<CreateAssessmentForm>) => void;
=======
  form: AssessmentFormData;
  onChange: (updates: Partial<AssessmentFormData>) => void;
  setForm: React.Dispatch<React.SetStateAction<AssessmentFormData>>;
>>>>>>> 3b5ef9c (Fixing Assesment Integration issues)
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

function getModuleName(moduleId: string, modules: any): string {
  return modules.find((m: any) => m.id === moduleId)?.title || "Unknown Module";
}

interface AssessmentCardProps {
  assessment: any;
  modules: Module[];
  courses: Course[];
  onEdit: () => void;
  onDelete: () => void;
  onViewQuestions: () => void;
}

function AssessmentCard({ assessment, courses, modules, onEdit, onDelete, onViewQuestions }: AssessmentCardProps) {
  const courseName = getCourseName(assessment.courseId, courses);
  const moduleName = assessment.moduleId ? getModuleName(assessment.moduleId, modules) : null;
  const totalPoints = (assessment.questions || []).reduce((sum: number, q: any) => sum + (q.points || 0), 0);
  const questionCount = assessment.questions?.length || 0;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden">
      {/* Card Header */}
      <div className="relative h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      
      <div className="p-6">
        {/* Title and Actions */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {assessment.title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                assessment.type === 'QUIZ' 
                  ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300' 
                  : 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300'
              }`}>
                {assessment.type === 'QUIZ' ? 'Quiz' : 'Assignment'}
              </span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                assessment.isPublished 
                  ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300' 
                  : 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300'
              }`}>
                {assessment.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onViewQuestions}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
              title="View Questions"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">{assessment.description}</p>

        {/* Course and Date Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            <span className="font-medium">{courseName}</span>
          </div>
          <span>{formatDate(assessment.createdAt)}</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span className="text-lg font-bold text-blue-900">{questionCount}</span>
            </div>
            <span className="text-xs text-blue-700 font-medium">Questions</span>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-lg font-bold text-green-900">{totalPoints}</span>
            </div>
            <span className="text-xs text-green-700 font-medium">Points</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            {assessment.timeLimit && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5" />
                <span>{assessment.timeLimit}m</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Users className="h-3.5 w-3.5" />
              <span>{assessment.attempts?.length || 0} attempts</span>
            </div>
          </div>
          <button
            onClick={onViewQuestions}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
          >
            Manage Questions
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AssessmentForm({ form, onChange, courses, modules, onClose, onSubmit, loading, title }: AssessmentFormProps) {
const filteredModules = (modules as any[]).filter((m: any) => m.courseId === form.courseId);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <FormattedTextEditor
          content={form.description}
          onChange={(content) => onChange({ description: content })}
          placeholder="Enter assessment description..."
          minHeight="150px"
          showToolbar={true}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={form.type}
            onChange={(e) => onChange({ type: e.target.value as "QUIZ" | "ASSIGNMENT" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="QUIZ">Quiz</option>
            <option value="ASSIGNMENT">Assignment</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
          <select
            value={form.courseId}
            onChange={(e) => onChange({ courseId: e.target.value, moduleId: "" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredModules.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
          <select
            value={form.moduleId}
            onChange={(e) => onChange({ moduleId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Module</option>
{filteredModules.map((module: any) => (
              <option key={module.id} value={module.id}>{module.title}</option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (min)</label>
          <input
            type="number"
            value={form.timeLimitMinutes}
            onChange={(e) => onChange({ timeLimitMinutes: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pass Mark (%)</label>
          <input
            type="number"
            value={form.passMark}
            onChange={(e) => onChange({ passMark: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            max="100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Retake Limit</label>
          <input
            type="number"
            value={form.retakeLimit}
            onChange={(e) => onChange({ retakeLimit: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            required
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="instantFeedback"
          type="checkbox"
          checked={form.instantFeedback}
          onChange={(e) => onChange({ instantFeedback: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="instantFeedback" className="ml-2 text-sm text-gray-700">
          Show instant feedback
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Assessment'}
        </button>
      </div>
    </form>
  );
}

function DeleteConfirmModal({ assessment, onClose, onConfirm, loading }: {
  assessment: any;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {

  return (
    <Modal isOpen={true} onClose={onClose} title="Delete Assessment">
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
          onClick={onConfirm}
          disabled={loading}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium disabled:opacity-50"
        >
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
}

export default function InstructorAssessmentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [showQuestionsSidebar, setShowQuestionsSidebar] = useState(false);
const [selectedAssessmentForSidebar, setSelectedAssessmentForSidebar] = useState<TypedAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assessmentsLoading, setAssessmentsLoading] = useState(false);
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [assessmentForm, setAssessmentForm] = useState<ExtendedAssessmentFormData>(initialAssessmentForm);

  const [formLoading, setFormLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editModalTab, setEditModalTab] = useState<'details' | 'questions'>('details');
  const [questionDeleting, setQuestionDeleting] = useState<string | null>(null);
  const [assessmentToDelete, setAssessmentToDelete] = useState<TypedAssessment | null>(null);
  
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user ID from token for more reliable authentication
      const userId = currentUser?.uuid || tokenManager.getUserIdFromToken();
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Get all courses and filter by instructor ID (using existing API)
      const response = await courseService.getAllCourses(1, 100);
      const allCourses = response.courses || [];
      const instructorCourses = allCourses.filter((course: BackendCourse) => 
        course.instructorId === userId
      );
      
      // Transform to Course interface
      const courses: Course[] = instructorCourses.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        instructorId: course.instructorId,
        cohortId: course.cohortId,
        courseType: course.courseType,
        isPublished: course.isPublished,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt
      }));
      
      setCourses(courses);
      if (courses.length > 0) setSelectedCourse(courses[0].id);
      console.log('Fetched courses successfully:', courses.length, 'courses');
    } catch (err: any) {
      setError(err.message || "Failed to load courses");
      showToast(err.message || "Failed to load courses", "error");
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uuid]);

  const fetchModules = useCallback(async () => {
    if (!selectedCourse) {
      setModules([]);
      return;
    }
    try {
      setError(null);
      const data = await moduleService.getModulesByCourse(selectedCourse);
      setModules(data || []);
    } catch (err: any) {
      setModules([]);
      setError(err.message || "Failed to load modules");
    }
  }, [selectedCourse]);

  const fetchAssessments = useCallback(async () => {
    if (!selectedCourse) {
      setAssessments([]);
      return;
    }
    try {
      setAssessmentsLoading(true);
      console.log('Fetching assessments for course:', selectedCourse);
      const modules = await moduleService.getModulesByCourse(selectedCourse);
      console.log('Fetched modules:', modules);
      const allAssessments: TypedAssessment[] = [];
      
      for (const module of modules) {
        console.log('Fetching assessments for module:', module.id);
        const moduleAssessments = await assessmentService.getAssessmentsByModule(module.id);
        console.log('Module assessments:', moduleAssessments);
        
        for (const moduleAssessment of moduleAssessments) {
          const assessmentWithQuestions = await assessmentService.getAssessmentWithQuestions(moduleAssessment.id);
          
          const transformedQuestions = assessmentWithQuestions.questions.map((q: any) => ({
            questionText: q.questionText,
            type: q.type === 'MCQ' ? 'multiple-choice' : q.type === 'TRUE_FALSE' ? 'true-false' : 'short-answer' as const,
            points: q.points,
            correctAnswer: q.type === 'MCQ' ? q.options.findIndex((o: any) => o.isCorrect) : q.options.find((o: any) => o.isCorrect)?.optionText || '',
            options: q.type === 'MCQ' ? q.options.map((o: any) => o.optionText) : undefined
          }));

          allAssessments.push({
            ...moduleAssessment,
            courseId: selectedCourse,
            moduleId: module.id,
            modules: modules, // Fix 'modules' property error
            questions: transformedQuestions,
            timeLimit: moduleAssessment.timeLimitMinutes,
            passingScore: moduleAssessment.passMark,
            isPublished: moduleAssessment.status === 'PUBLISHED',
            type: moduleAssessment.type,
            attempts: [],
            averageScore: 0,
            completionRate: 0
          } as any);
        }
      }
      
      setAssessments(allAssessments);
    } catch (err: any) {
      setAssessments([]);
      showToast(err.message || "Failed to load assessments", "error");
    } finally {
      setAssessmentsLoading(false);
    }
  }, [selectedCourse, showToast]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);
  useEffect(() => { fetchModules(); }, [fetchModules]);
  useEffect(() => { fetchAssessments(); }, [fetchAssessments]);

  const filteredAssessments = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return assessments.filter((a: TypedAssessment) => 
      a.title.toLowerCase().includes(q) || 
      a.description?.toLowerCase().includes(q)
    );
  }, [assessments, searchTerm]);

  // CRUD handlers
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const { courseId, ...assessmentData } = assessmentForm;
      await assessmentService.createAssessment(assessmentData);
      setShowCreateModal(false);
      setAssessmentForm(initialAssessmentForm);
      fetchAssessments();
      showToast("Assessment created successfully", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to create assessment", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssessment) return;
    setFormLoading(true);
    try {
      const { courseId, ...assessmentData } = assessmentForm;
      await assessmentService.updateAssessment(editingAssessment.id, assessmentData);
      setShowEditModal(false);
      setEditingAssessment(null);
      setAssessmentForm(initialAssessmentForm);
      fetchAssessments();
      showToast("Assessment updated successfully", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update assessment", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!assessmentToDelete) return;
    setFormLoading(true);
    try {
      await assessmentService.deleteAssessment(assessmentToDelete.id);
      setShowDeleteModal(false);
      setAssessmentToDelete(null);
      fetchAssessments();
      showToast("Assessment deleted successfully", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to delete assessment", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const openCreateModal = () => {
    console.log('openCreateModal called - opening modal');
    setAssessmentForm(initialAssessmentForm);
    setShowCreateModal(true);
  };

const openEditModal = (assessment: any) => {
  setEditingAssessment(assessment);
  setEditModalTab('details'); // Reset to details tab
  setAssessmentForm({
    title: assessment.title,
    description: assessment.description || '',
    type: assessment.type,
    timeLimitMinutes: assessment.timeLimit || assessment.timeLimitMinutes || 60,
    passMark: assessment.passMark || assessment.passingScore || 50,
    retakeLimit: assessment.retakeLimit || 0,
    instantFeedback: assessment.instantFeedback || false,
    courseId: assessment.courseId,
    moduleId: assessment.moduleId || '',
  });
  setShowEditModal(true);
};

const openDeleteModal = (assessment: any) => {
  setAssessmentToDelete(assessment);
  setShowDeleteModal(true);
};

const openQuestionsSidebar = (assessment: any) => {
    setSelectedAssessmentForSidebar(assessment);
    setShowQuestionsSidebar(true);
  };

  // Question management functions for the edit modal
  const handleEditQuestion = (question: any) => {
    // Navigate to questions page with edit mode
    router.push(`/instructor/assessments/questions/${editingAssessment?.id}?edit=${question.id}`);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    try {
      setQuestionDeleting(questionId);
      const token = tokenManager.getToken();
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_BASE_URL}/assessments/questions/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete question');
      }

      // Update the editing assessment to reflect the deletion
      if (editingAssessment && editingAssessment.questions) {
        const updatedQuestions = editingAssessment.questions.filter((q: any) => q.id !== questionId);
        setEditingAssessment({
          ...editingAssessment,
          questions: updatedQuestions
        });
        
        // Also update the assessments array
        setAssessments(prevAssessments => 
          prevAssessments.map(assessment => 
            assessment.id === editingAssessment.id 
              ? { ...assessment, questions: updatedQuestions }
              : assessment
          )
        );
      }

      showToast('Question deleted successfully', 'success');
    } catch (error: any) {
      console.error('Error deleting question:', error);
      showToast(error.message || 'Failed to delete question', 'error');
    } finally {
      setQuestionDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex flex-col">
        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{assessments.length}</h3>
                <p className="text-sm text-gray-500">Total Assessments</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{courses.length}</h3>
                <p className="text-sm text-gray-500">Active Courses</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {assessments.reduce((total, assessment) => total + (assessment.submissions || 0), 0)}
                </h3>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>

            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">All Assessments</h2>
                  <p className="text-gray-500">Manage your course assessments and track student progress</p>
                </div>
                <button
                  onClick={openCreateModal}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                  Create Assessment
                </button>
              </div>

              {/* Search and Filter Section */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search assessments..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all"
                  />
                </div>
                <select
                  value={selectedCourse}
                  onChange={(e) => {
                    const newCourse = e.target.value;
                    setSelectedCourse(newCourse);
                  }}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all min-w-[200px]"
                >
                  <option value="">All Courses</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('card')}
                    className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                      viewMode === 'card' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                    <span className="text-sm font-medium">Card</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                      viewMode === 'list' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <List className="h-4 w-4" />
                    <span className="text-sm font-medium">List</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            {assessmentsLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <span className="text-gray-600">Loading assessments...</span>
                </div>
              </div>
            ) : filteredAssessments.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200 shadow-sm">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No assessments yet</h3>
                  <p className="text-gray-600 mb-8 text-lg">
                    {selectedCourse ? "No assessments found for this course." : "Select a course to see assessments or create your first one."}
                  </p>
                  <button
                    onClick={openCreateModal}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="h-5 w-5 inline mr-2" />
                    Create Your First Assessment
                  </button>
                </div>
              </div>
            ) : viewMode === 'card' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAssessments.map((assessment) => (
                  <AssessmentCard
                    key={assessment.id}
                    assessment={assessment}
                    courses={courses}
                    modules={modules}
                    onEdit={() => openEditModal(assessment)}
                    onDelete={() => openDeleteModal(assessment as TypedAssessment)}
                    onViewQuestions={() => openQuestionsSidebar(assessment as TypedAssessment)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessment</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredAssessments.map((assessment) => (
                        <tr key={assessment.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{assessment.title}</div>
                              <div className="text-sm text-gray-500">{assessment.description}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              assessment.type === 'QUIZ' 
                                ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300' 
                                : 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300'
                            }`}>
                              {assessment.type === 'QUIZ' ? 'Quiz' : 'Assignment'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {getCourseName(assessment.courseId, courses)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {(assessment.questions || []).length} questions
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              assessment.isPublished 
                                ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300' 
                                : 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300'
                            }`}>
                              {assessment.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openQuestionsSidebar(assessment)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openEditModal(assessment)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(assessment)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Questions Sidebar */}
      <QuestionsSidebar
        assessment={selectedAssessmentForSidebar}
        isOpen={showQuestionsSidebar}
        onClose={() => setShowQuestionsSidebar(false)}
        questions={selectedAssessmentForSidebar?.questions || []}
      />

      {/* Modals */}
      {showCreateModal && (
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Assessment">
          <AssessmentForm
            form={assessmentForm}
            setForm={setAssessmentForm}
            onChange={(updates) => setAssessmentForm(prev => ({...prev, ...updates}))}
            courses={courses}
            modules={modules}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreate}
            loading={formLoading}
            title="Create Assessment"
          />
        </Modal>
      )}

      {showEditModal && editingAssessment && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title={editingAssessment ? "Edit Assessment" : "Create Assessment"}>
          <div className="w-full max-w-4xl">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setEditModalTab('details')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    editModalTab === 'details'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Assessment Details
                </button>
                <button
                  onClick={() => setEditModalTab('questions')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    editModalTab === 'questions'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Questions ({editingAssessment.questions?.length || 0})
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {editModalTab === 'details' ? (
              <AssessmentForm
                form={assessmentForm}
                setForm={setAssessmentForm}
                onChange={(updates) => setAssessmentForm(prev => ({...prev, ...updates}))}
                courses={courses}
                modules={modules}
                onClose={() => setShowEditModal(false)}
                onSubmit={handleUpdate}
                loading={formLoading}
                title="Edit Assessment"
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Manage Questions</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        router.push(`/instructor/assessments/questions/${editingAssessment.id}`);
                      }}
                      className="px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Full Page
                    </button>
                    <button
                      onClick={() => {
                        router.push(`/instructor/assessments/questions/${editingAssessment.id}`);
                      }}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Question
                    </button>
                  </div>
                </div>

                {editingAssessment.questions && editingAssessment.questions.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {editingAssessment.questions.map((question: any, index: number) => (
                      <div key={question.id || index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                {question.type === 'multiple-choice' ? 'MCQ' : 
                                 question.type === 'true-false' ? 'True/False' : 
                                 question.type === 'short-answer' ? 'Short Answer' : 'Essay'}
                              </span>
                              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                {question.points} {question.points === 1 ? 'point' : 'points'}
                              </span>
                            </div>
                            <p className="text-gray-900 font-medium mb-2">{question.questionText}</p>
                            
                            {question.options && (
                              <div className="space-y-1">
                                {question.options.map((option: any, optIndex: number) => (
                                  <div key={optIndex} className="flex items-center gap-2 text-sm">
                                    {option.isCorrect && <CheckCircle className="w-4 h-4 text-green-600" />}
                                    <span className={option.isCorrect ? 'text-green-700 font-medium' : 'text-gray-600'}>
                                      {option.optionText || option}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1 ml-4">
                            <button
                              onClick={() => handleEditQuestion(question)}
                              className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                              title="Edit Question"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(question.id)}
                              disabled={questionDeleting === question.id}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete Question"
                            >
                              {questionDeleting === question.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                    <p className="text-gray-600 mb-6">Add your first question to get started</p>
                    <button
                      onClick={() => {
                        router.push(`/instructor/assessments/questions/${editingAssessment.id}`);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 mx-auto"
                    >
                      <Plus className="w-4 h-4" />
                      Add Your First Question
                    </button>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {showDeleteModal && assessmentToDelete && (
        <DeleteConfirmModal
          assessment={assessmentToDelete}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          loading={formLoading}
        />
      )}
    </div>
  );
}
