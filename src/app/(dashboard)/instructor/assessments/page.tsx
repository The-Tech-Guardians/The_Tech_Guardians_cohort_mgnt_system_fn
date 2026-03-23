"use client";



import { useState, useEffect, useCallback, useMemo } from "react";

import { Plus, Search, Edit, Trash2, Loader2, Eye, EyeOff, BookOpen, LayoutGrid, List } from "lucide-react";

import Modal from "@/components/admin/Modal";

import Toast from "@/components/admin/Toast";

import FormattedTextEditor from "@/components/editor/FormattedTextEditor";

import QuestionsSidebar from "@/components/assessment/QuestionsSidebar";

import { instructorApi } from "@/lib/instructorApi";

import { moduleService } from "@/services/moduleService";

import type { BackendCourse } from "@/types/course";

import type { Module } from "@/services/moduleService";



// Local Module interface matches service type

interface LocalModule {

  id: string;

  courseId: string;

  title: string;

  description?: string;

  orderIndex?: number;

  releaseWeek?: number;

  isPublished?: boolean;

  createdAt?: string;

  updatedAt?: string;

}



interface CreateAssessmentForm {

  courseId: string;

  moduleId: string;

  title: string;

  description: string;

  type: 'QUIZ' | 'ASSIGNMENT';

  passMark?: number;

  retakeLimit?: number;

  timeLimitMinutes?: number;

  instantFeedback: boolean;

  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';

}



const initialAssessmentForm: CreateAssessmentForm = {

  courseId: "",

  moduleId: "",

  title: "",

  description: "",

  type: "QUIZ",

  passMark: 70,

  retakeLimit: 0,

  timeLimitMinutes: 60,

  instantFeedback: true,

  status: "DRAFT",

};



interface AssessmentFormProps {

  form: CreateAssessmentForm;

  onChange: (updates: Partial<CreateAssessmentForm>) => void;

  courses: any[];

  modules: LocalModule[];

  onClose: () => void;

  onSubmit: (e: React.FormEvent) => void;

  loading: boolean;

  title: string;

}



export default function InstructorAssessmentsPage() {

  const [courses, setCourses] = useState<any[]>([]);

  const [modules, setModules] = useState<LocalModule[]>([]);

  const [assessments, setAssessments] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [assessmentForm, setAssessmentForm] = useState(initialAssessmentForm);

  const [formLoading, setFormLoading] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [assessmentToDelete, setAssessmentToDelete] = useState<any | null>(null);

  

  // View and pagination state

  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage] = useState(9); // 3x3 grid for card view

  

  // Question management state

  const [selectedAssessment, setSelectedAssessment] = useState<any | null>(null);

  const [questions, setQuestions] = useState<any[]>([]);

  const [showQuestionsModal, setShowQuestionsModal] = useState(false);

  const [showCreateQuestionModal, setShowCreateQuestionModal] = useState(false);

  const [showEditQuestionModal, setShowEditQuestionModal] = useState(false);

  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);

  const [questionForm, setQuestionForm] = useState({

    questionText: '',

    type: 'MCQ' as 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY',

    points: 1,

    options: [{ optionText: '', isCorrect: false }]

  });

  const [questionFormLoading, setQuestionFormLoading] = useState(false);



  const fetchCourses = useCallback(async () => {

    try {

      setLoading(true);

      const courses = await instructorApi.getInstructorCourses();

      setCourses(courses);

    } catch (err) {

      setError('Failed to fetch courses');

    } finally {

      setLoading(false);

    }

  }, []);



  const fetchModules = useCallback(async (courseId: string) => {

    try {

      const data = await moduleService.getModulesByCourse(courseId);

      setModules(data || []);

    } catch (err) {

      setModules([]);

    }

  }, []);



  const fetchAssessments = useCallback(async () => {

    try {

      const assessments = await instructorApi.getInstructorAssessments();

      setAssessments(assessments);

    } catch (err) {

      console.error('Failed to fetch assessments:', err);

      setAssessments([]);

    }

  }, []);



  useEffect(() => {

    fetchCourses();

    fetchAssessments();

  }, [fetchCourses, fetchAssessments]);



  const handleCreateAssessment = async (e: React.FormEvent) => {

    e.preventDefault();

    try {

      setFormLoading(true);

      // await assessmentService.createAssessment(assessmentForm);

      setShowCreateModal(false);

      setAssessmentForm(initialAssessmentForm);

      fetchAssessments();

    } catch (err) {

      // error handling

    } finally {

      setFormLoading(false);

    }

  };



  // Delete assessment functionality

  const handleDeleteAssessment = (assessment: any) => {

    setAssessmentToDelete(assessment);

    setShowDeleteModal(true);

  };



  const confirmDeleteAssessment = async () => {

    if (!assessmentToDelete) return;



    try {

      await instructorApi.deleteAssessment(assessmentToDelete.id);

      setShowDeleteModal(false);

      setAssessmentToDelete(null);

      fetchAssessments();

    } catch (err) {

      console.error('Failed to delete assessment:', err);

    }

  };



  // Search and pagination logic

  const filteredAssessments = assessments.filter(assessment =>

    assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||

    assessment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||

    assessment.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||

    assessment.moduleTitle.toLowerCase().includes(searchTerm.toLowerCase())

  );



  const totalPages = Math.ceil(filteredAssessments.length / itemsPerPage);

  const paginatedAssessments = filteredAssessments.slice(

    (currentPage - 1) * itemsPerPage,

    currentPage * itemsPerPage

  );



  const handlePageChange = (page: number) => {

    setCurrentPage(page);

  };



  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setSearchTerm(e.target.value);

    setCurrentPage(1); // Reset to first page when searching

  };



  // Question management functions

  const fetchQuestions = useCallback(async (assessmentId: string) => {

    try {

      const questions = await instructorApi.getAssessmentQuestions(assessmentId);

      setQuestions(questions);

    } catch (err) {

      console.error('Failed to fetch questions:', err);

      setQuestions([]);

    }

  }, []);



  const handleManageQuestions = (assessment: any) => {

    setSelectedAssessment(assessment);

    setShowQuestionsModal(true);

    fetchQuestions(assessment.id);

  };



  const handleCreateQuestion = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!selectedAssessment) return;



    try {

      setQuestionFormLoading(true);

      

      // Prepare question data

      const questionData = {

        questionText: questionForm.questionText,

        type: questionForm.type,

        points: questionForm.points,

        options: questionForm.type === 'MCQ' || questionForm.type === 'TRUE_FALSE' 

          ? questionForm.options.filter(opt => opt.optionText.trim() !== '')

          : undefined

      };



      await instructorApi.createAssessmentQuestion(selectedAssessment.id, questionData);

      

      setShowCreateQuestionModal(false);

      setQuestionForm({

        questionText: '',

        type: 'MCQ',

        points: 1,

        options: [{ optionText: '', isCorrect: false }]

      });

      fetchQuestions(selectedAssessment.id);

    } catch (err) {

      console.error('Failed to create question:', err);

    } finally {

      setQuestionFormLoading(false);

    }

  };



  const handleEditQuestion = (question: any) => {

    setSelectedQuestion(question);

    setQuestionForm({

      questionText: question.questionText,

      type: question.type,

      points: question.points,

      options: question.options || [{ optionText: '', isCorrect: false }]

    });

    setShowEditQuestionModal(true);

  };



  const handleUpdateQuestion = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!selectedAssessment || !selectedQuestion) return;



    try {

      setQuestionFormLoading(true);

      

      const questionData = {

        questionText: questionForm.questionText,

        type: questionForm.type,

        points: questionForm.points,

        options: questionForm.type === 'MCQ' || questionForm.type === 'TRUE_FALSE' 

          ? questionForm.options.filter(opt => opt.optionText.trim() !== '')

          : undefined

      };



      await instructorApi.updateAssessmentQuestion(selectedAssessment.id, selectedQuestion.id, questionData);

      

      setShowEditQuestionModal(false);

      setSelectedQuestion(null);

      fetchQuestions(selectedAssessment.id);

    } catch (err) {

      console.error('Failed to update question:', err);

    } finally {

      setQuestionFormLoading(false);

    }

  };



  const handleDeleteQuestion = async (questionId: string) => {

    if (!selectedAssessment) return;



    try {

      await instructorApi.deleteAssessmentQuestion(selectedAssessment.id, questionId);

      fetchQuestions(selectedAssessment.id);

    } catch (err) {

      console.error('Failed to delete question:', err);

    }

  };



  const addQuestionOption = () => {

    setQuestionForm(prev => ({

      ...prev,

      options: [...prev.options, { optionText: '', isCorrect: false }]

    }));

  };



  const updateQuestionOption = (index: number, field: 'optionText' | 'isCorrect', value: string | boolean) => {

    setQuestionForm(prev => ({

      ...prev,

      options: prev.options.map((opt, i) => 

        i === index ? { ...opt, [field]: value } : opt

      )

    }));

  };



  const removeQuestionOption = (index: number) => {

    setQuestionForm(prev => ({

      ...prev,

      options: prev.options.filter((_, i) => i !== index)

    }));

  };



  const handleEditAssessment = (assessment: any) => {

    setAssessmentForm({

      courseId: assessment.courseId,

      moduleId: assessment.moduleId,

      title: assessment.title,

      description: assessment.description,

      type: assessment.type,

      passMark: assessment.passMark,

      retakeLimit: assessment.retakeLimit,

      timeLimitMinutes: assessment.timeLimitMinutes,

      instantFeedback: assessment.instantFeedback,

      status: assessment.status

    });

    setSelectedAssessment(assessment);

    setShowEditModal(true);

    if (assessment.courseId) {

      fetchModules(assessment.courseId);

    }

  };



  const handleUpdateAssessment = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!selectedAssessment) return;



    try {

      setFormLoading(true);

      await instructorApi.updateAssessment(selectedAssessment.id, assessmentForm);

      setShowEditModal(false);

      setSelectedAssessment(null);

      setAssessmentForm(initialAssessmentForm);

      fetchAssessments();

    } catch (err) {

      console.error('Failed to update assessment:', err);

    } finally {

      setFormLoading(false);

    }

  };



  return (

    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>

          <p className="text-gray-600 mt-1">Manage your course assessments and quizzes</p>

        </div>

        <button

          onClick={() => setShowCreateModal(true)}

          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"

        >

          Create Assessment

        </button>

      </div>



      {/* Search and View Controls */}

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">

        <div className="relative flex-1 max-w-md">

          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

          <input

            type="text"

            placeholder="Search assessments..."

            value={searchTerm}

            onChange={handleSearchChange}

            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"

          />

        </div>

        <div className="flex items-center gap-2">

          <span className="text-sm text-gray-500">View:</span>

          <div className="flex bg-gray-100 rounded-lg p-1">

            <button

              onClick={() => setViewMode('card')}

              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${

                viewMode === 'card'

                  ? 'bg-white text-gray-900 shadow-sm'

                  : 'text-gray-600 hover:text-gray-900'

              }`}

            >

              <LayoutGrid className="w-4 h-4 inline mr-1" />

              Cards

            </button>

            <button

              onClick={() => setViewMode('list')}

              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${

                viewMode === 'list'

                  ? 'bg-white text-gray-900 shadow-sm'

                  : 'text-gray-600 hover:text-gray-900'

              }`}

            >

              <List className="w-4 h-4 inline mr-1" />

              List

            </button>

          </div>

        </div>

      </div>



      {loading && (

        <div className="flex items-center justify-center py-12">

          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>

        </div>

      )}



      {error && (

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">

          <p className="text-red-600">{error}</p>

        </div>

      )}



      {!loading && !error && paginatedAssessments.length === 0 && (

        <div className="text-center py-12">

          <h3 className="text-lg font-medium text-gray-900 mb-2">

            {searchTerm ? 'No assessments found' : 'No assessments found'}

          </h3>

          <p className="text-gray-600 mb-4">

            {searchTerm ? 'Try adjusting your search terms' : 'Create your first assessment to get started'}

          </p>

          {!searchTerm && (

            <button

              onClick={() => setShowCreateModal(true)}

              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"

            >

              Create Assessment

            </button>

          )}

        </div>

      )}



      {/* Card View */}

      {!loading && !error && viewMode === 'card' && paginatedAssessments.length > 0 && (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {paginatedAssessments.map((assessment) => (

            <div key={assessment.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">

              <div className="flex justify-between items-start mb-4">

                <div className="flex-1">

                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{assessment.title}</h3>

                  <p className="text-sm text-gray-500 mb-2">{assessment.type}</p>

                </div>

                <span className={`px-2 py-1 text-xs rounded-full ${

                  assessment.status === 'PUBLISHED' ? "bg-green-100 text-green-700" : 

                  assessment.status === 'DRAFT' ? "bg-yellow-100 text-yellow-700" : 

                  "bg-red-100 text-red-700"

                }`}>

                  {assessment.status}

                </span>

              </div>

              

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{assessment.description}</p>

              

              <div className="space-y-2 mb-4">

                <div className="flex items-center text-sm text-gray-500">

                  <span className="font-medium">Course:</span> {assessment.courseTitle}

                </div>

                <div className="flex items-center text-sm text-gray-500">

                  <span className="font-medium">Module:</span> {assessment.moduleTitle}

                </div>

                <div className="flex items-center text-sm text-gray-500">

                  <span className="font-medium">Questions:</span> {assessment.questionsCount}

                </div>

              </div>

              

              <div className="flex justify-end gap-2">

                <button 

                  onClick={() => handleManageQuestions(assessment)}

                  className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"

                  title="Manage Questions"

                >

                  <BookOpen className="w-4 h-4" />

                </button>

                <button 

                  onClick={() => handleEditAssessment(assessment)}

                  className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"

                >

                  <Edit className="w-4 h-4" />

                </button>

                <button

                  onClick={() => handleDeleteAssessment(assessment)}

                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"

                >

                  <Trash2 className="w-4 h-4" />

                </button>

              </div>

            </div>

          ))}

        </div>

      )}



      {/* List View */}

      {!loading && !error && viewMode === 'list' && paginatedAssessments.length > 0 && (

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-50 border-b border-gray-200">

              <tr>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                  Assessment

                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                  Course

                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                  Status

                </th>

                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">

                  Actions

                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-200">

              {paginatedAssessments.map((assessment) => (

                <tr key={assessment.id} className="hover:bg-gray-50">

                  <td className="px-6 py-4">

                    <div>

                      <div className="text-sm font-medium text-gray-900">{assessment.title}</div>

                      <div className="text-sm text-gray-500">{assessment.type}</div>

                    </div>

                  </td>

                  <td className="px-6 py-4">

                    <div className="text-sm text-gray-900">{assessment.courseTitle}</div>

                    <div className="text-xs text-gray-500">{assessment.moduleTitle}</div>

                  </td>

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-2">

                      <span className={`px-2 py-1 text-xs rounded-full ${

                        assessment.status === 'PUBLISHED' ? "bg-green-100 text-green-700" : 

                        assessment.status === 'DRAFT' ? "bg-yellow-100 text-yellow-700" : 

                        "bg-red-100 text-red-700"

                      }`}>

                        {assessment.status}

                      </span>

                      <span className="text-xs text-gray-500">{assessment.questionsCount} questions</span>

                    </div>

                  </td>

                  <td className="px-6 py-4 text-right">

                    <div className="flex justify-end gap-2">

                      <button 

                        onClick={() => handleManageQuestions(assessment)}

                        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"

                        title="Manage Questions"

                      >

                        <BookOpen className="w-4 h-4" />

                      </button>

                      <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">

                        <Edit className="w-4 h-4" />

                      </button>

                      <button

                        onClick={() => handleDeleteAssessment(assessment)}

                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"

                      >

                        <Trash2 className="w-4 h-4" />

                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}



      {/* Pagination */}

      {!loading && !error && totalPages > 1 && (

        <div className="flex justify-center items-center space-x-2">

          <button

            onClick={() => handlePageChange(currentPage - 1)}

            disabled={currentPage === 1}

            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"

          >

            Previous

          </button>

          

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (

            <button

              key={page}

              onClick={() => handlePageChange(page)}

              className={`px-3 py-1 text-sm border rounded-md ${

                currentPage === page

                  ? 'bg-indigo-600 text-white border-indigo-600'

                  : 'border-gray-300 hover:bg-gray-50'

              }`}

            >

              {page}

            </button>

          ))}

          

          <button

            onClick={() => handlePageChange(currentPage + 1)}

            disabled={currentPage === totalPages}

            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"

          >

            Next

          </button>

        </div>

      )}



      {/* Create Assessment Modal */}

      <Modal

        isOpen={showCreateModal}

        onClose={() => {

          setShowCreateModal(false);

          setAssessmentForm(initialAssessmentForm);

        }}

        title="Create Assessment"

      >

        <form onSubmit={handleCreateAssessment} className="space-y-4">

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">

              Course

            </label>

            <select

              value={assessmentForm.courseId}

              onChange={(e) => {

                setAssessmentForm({ ...assessmentForm, courseId: e.target.value });

                if (e.target.value) {

                  fetchModules(e.target.value);

                }

              }}

              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"

              required

            >

              <option value="">Select a course</option>

              {courses.map((course) => (

                <option key={course.id} value={course.id}>

                  {course.title}

                </option>

              ))}

            </select>

          </div>



          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">

              Module

            </label>

            <select

              value={assessmentForm.moduleId}

              onChange={(e) => setAssessmentForm({ ...assessmentForm, moduleId: e.target.value })}

              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"

            >

              <option value="">Select a module (optional)</option>

              {modules.map((module) => (

                <option key={module.id} value={module.id}>

                  {module.title}

                </option>

              ))}

            </select>

          </div>



          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">

              Assessment Type

            </label>

            <select

              value={assessmentForm.type}

              onChange={(e) => setAssessmentForm({ ...assessmentForm, type: e.target.value as 'QUIZ' | 'ASSIGNMENT' })}

              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"

              required

            >

              <option value="QUIZ">Quiz</option>

              <option value="ASSIGNMENT">Assignment</option>

            </select>

          </div>



          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">

              Title

            </label>

            <input

              type="text"

              value={assessmentForm.title}

              onChange={(e) => setAssessmentForm({ ...assessmentForm, title: e.target.value })}

              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"

              required

            />

          </div>



          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">

              Description

            </label>

            <textarea

              value={assessmentForm.description}

              onChange={(e) => setAssessmentForm({ ...assessmentForm, description: e.target.value })}

              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"

              rows={3}

              required

            />

          </div>



          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">

                Time Limit (minutes)

              </label>

              <input

                type="number"

                value={assessmentForm.timeLimitMinutes}

                onChange={(e) => setAssessmentForm({ ...assessmentForm, timeLimitMinutes: parseInt(e.target.value) })}

                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"

                min="1"

              />

            </div>

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">

                Passing Score (%)

              </label>

              <input

                type="number"

                value={assessmentForm.passMark}

                onChange={(e) => setAssessmentForm({ ...assessmentForm, passMark: parseInt(e.target.value) })}

                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"

                min="0"

                max="100"

              />

            </div>

          </div>



          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">

                Retake Limit

              </label>

              <input

                type="number"

                value={assessmentForm.retakeLimit}

                onChange={(e) => setAssessmentForm({ ...assessmentForm, retakeLimit: parseInt(e.target.value) })}

                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"

                min="0"

              />

            </div>

            <div className="flex items-center">

              <input

                type="checkbox"

                id="instantFeedback"

                checked={assessmentForm.instantFeedback}

                onChange={(e) => setAssessmentForm({ ...assessmentForm, instantFeedback: e.target.checked })}

                className="mr-2"

              />

              <label htmlFor="instantFeedback" className="text-sm font-medium text-gray-700">

                Instant Feedback

              </label>

            </div>

          </div>



          <div className="flex justify-end gap-3 pt-4">

            <button

              type="button"

              onClick={() => {

                setShowCreateModal(false);

                setAssessmentForm(initialAssessmentForm);

              }}

              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"

            >

              Cancel

            </button>

            <button

              type="submit"

              disabled={formLoading}

              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"

            >

              {formLoading ? "Creating..." : "Create Assessment"}

            </button>

          </div>

        </form>

      </Modal>

      {/* Edit Assessment Modal */}

      <Modal

        isOpen={showEditModal}

        onClose={() => {

          setShowEditModal(false);

          setSelectedAssessment(null);

          setAssessmentForm(initialAssessmentForm);

        }}

        title="Edit Assessment"

      >

        <form onSubmit={handleUpdateAssessment} className="space-y-4">

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">

              Course

            </label>

            <select

              value={assessmentForm.courseId}

              onChange={(e) => {

                setAssessmentForm({ ...assessmentForm, courseId: e.target.value });

                if (e.target.value) {

                  fetchModules(e.target.value);

                }

              }}

              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"

              required

            >

              <option value="">Select a course</option>

              {courses.map((course) => (

                <option key={course.id} value={course.id}>

                  {course.title}

                </option>

              ))}

            </select>

          </div>

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">

              Module

            </label>

            <select

              value={assessmentForm.moduleId}

              onChange={(e) => setAssessmentForm({ ...assessmentForm, moduleId: e.target.value })}

              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"

            >

              <option value="">Select a module (optional)</option>

              {modules.map((module) => (

                <option key={module.id} value={module.id}>

                  {module.title}

                </option>

              ))}

            </select>

          </div>

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">

              Assessment Type

            </label>

            <select

              value={assessmentForm.type}

              onChange={(e) => setAssessmentForm({ ...assessmentForm, type: e.target.value as 'QUIZ' | 'ASSIGNMENT' })}

              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"

              required

            >

              <option value="QUIZ">Quiz</option>

              <option value="ASSIGNMENT">Assignment</option>

            </select>

          </div>

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">

              Title

            </label>

            <input

              type="text"

              value={assessmentForm.title}

              onChange={(e) => setAssessmentForm({ ...assessmentForm, title: e.target.value })}

              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"

              required

            />

          </div>

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">

              Description

            </label>

            <textarea

              value={assessmentForm.description}

              onChange={(e) => setAssessmentForm({ ...assessmentForm, description: e.target.value })}

              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"

              rows={3}

              required

            />

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">

                Time Limit (minutes)

              </label>

              <input

                type="number"

                value={assessmentForm.timeLimitMinutes}

                onChange={(e) => setAssessmentForm({ ...assessmentForm, timeLimitMinutes: parseInt(e.target.value) })}

                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"

                min="1"

              />

            </div>

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">

                Passing Score (%)

              </label>

              <input

                type="number"

                value={assessmentForm.passMark}

                onChange={(e) => setAssessmentForm({ ...assessmentForm, passMark: parseInt(e.target.value) })}

                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"

                min="0"

                max="100"

              />

            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">

                Retake Limit

              </label>

              <input

                type="number"

                value={assessmentForm.retakeLimit}

                onChange={(e) => setAssessmentForm({ ...assessmentForm, retakeLimit: parseInt(e.target.value) })}

                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"

                min="0"

              />

            </div>

            <div className="flex items-center">

              <input

                type="checkbox"

                id="editInstantFeedback"

                checked={assessmentForm.instantFeedback}

                onChange={(e) => setAssessmentForm({ ...assessmentForm, instantFeedback: e.target.checked })}

                className="mr-2"

              />

              <label htmlFor="editInstantFeedback" className="text-sm font-medium text-gray-700">

                Instant Feedback

              </label>

            </div>

          </div>

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">

              Status

            </label>

            <select

              value={assessmentForm.status}

              onChange={(e) => setAssessmentForm({ ...assessmentForm, status: e.target.value as 'DRAFT' | 'PUBLISHED' | 'CLOSED' })}

              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"

              required

            >

              <option value="DRAFT">Draft</option>

              <option value="PUBLISHED">Published</option>

              <option value="CLOSED">Closed</option>

            </select>

          </div>

          <div className="flex justify-end gap-3 pt-4">

            <button

              type="button"

              onClick={() => {

                setShowEditModal(false);

                setSelectedAssessment(null);

                setAssessmentForm(initialAssessmentForm);

              }}

              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"

            >

              Cancel

            </button>

            <button

              type="submit"

              disabled={formLoading}

              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"

            >

              {formLoading ? "Updating..." : "Update Assessment"}

            </button>

          </div>

        </form>

      </Modal>

      {/* Questions Management Modal */}

      <Modal

        isOpen={showQuestionsModal}

        onClose={() => {

          setShowQuestionsModal(false);

          setSelectedAssessment(null);

          setQuestions([]);

        }}

        title={`Questions - ${selectedAssessment?.title || ''}`}

      >

        <div className="space-y-4">

          <div className="flex justify-between items-center">

            <h3 className="text-lg font-medium text-gray-900">

              {questions.length} question{questions.length !== 1 ? 's' : ''}

            </h3>

            <button

              onClick={() => setShowCreateQuestionModal(true)}

              className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"

            >

              Add Question

            </button>

          </div>



          {questions.length === 0 ? (

            <div className="text-center py-8">

              <p className="text-gray-500">No questions yet. Add your first question.</p>

            </div>

          ) : (

            <div className="space-y-3">

              {questions.map((question, index) => (

                <div key={question.id} className="border border-gray-200 rounded-lg p-4">

                  <div className="flex justify-between items-start">

                    <div className="flex-1">

                      <div className="flex items-center gap-2 mb-2">

                        <span className="text-sm font-medium text-gray-900">Q{index + 1}</span>

                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">

                          {question.type}

                        </span>

                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">

                          {question.points} point{question.points !== 1 ? 's' : ''}

                        </span>

                      </div>

                      <p className="text-gray-900 mb-2">{question.questionText}</p>

                      {question.options && question.options.length > 0 && (

                        <div className="space-y-1">

                          {question.options.map((option: any, optIndex: number) => (

                            <div key={optIndex} className="flex items-center gap-2 text-sm">

                              <span className={`w-4 h-4 rounded-full border-2 ${

                                option.isCorrect ? 'bg-green-500 border-green-500' : 'border-gray-300'

                              }`}>

                                {option.isCorrect && (

                                  <div className="w-full h-full flex items-center justify-center text-white text-xs">✓</div>

                                )}

                              </span>

                              <span className={option.isCorrect ? 'text-green-700 font-medium' : 'text-gray-600'}>

                                {option.optionText}

                              </span>

                            </div>

                          ))}

                        </div>

                      )}

                    </div>

                    <div className="flex gap-2 ml-4">

                      <button

                        onClick={() => handleEditQuestion(question)}

                        className="p-1 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"

                      >

                        <Edit className="w-4 h-4" />

                      </button>

                      <button

                        onClick={() => handleDeleteQuestion(question.id)}

                        className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"

                      >

                        <Trash2 className="w-4 h-4" />

                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </Modal>



      {/* Create/Edit Question Modal */}

      <Modal

        isOpen={showCreateQuestionModal || showEditQuestionModal}

        onClose={() => {

          setShowCreateQuestionModal(false);

          setShowEditQuestionModal(false);

          setSelectedQuestion(null);

          setQuestionForm({

            questionText: '',

            type: 'MCQ',

            points: 1,

            options: [{ optionText: '', isCorrect: false }]

          });

        }}

        title={showEditQuestionModal ? 'Edit Question' : 'Create Question'}

      >

        <form onSubmit={showEditQuestionModal ? handleUpdateQuestion : handleCreateQuestion} className="space-y-4">

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">

              Question Type

            </label>

            <select

              value={questionForm.type}

              onChange={(e) => setQuestionForm({ ...questionForm, type: e.target.value as any })}

              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"

            >

              <option value="MCQ">Multiple Choice</option>

              <option value="TRUE_FALSE">True/False</option>

              <option value="SHORT_ANSWER">Short Answer</option>

              <option value="ESSAY">Essay</option>

            </select>

          </div>



          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">

              Question Text

            </label>

            <textarea

              value={questionForm.questionText}

              onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}

              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"

              rows={3}

              required

            />

          </div>



          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">

              Points

            </label>

            <input

              type="number"

              value={questionForm.points}

              onChange={(e) => setQuestionForm({ ...questionForm, points: parseInt(e.target.value) })}

              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"

              min="1"

              required

            />

          </div>



          {(questionForm.type === 'MCQ' || questionForm.type === 'TRUE_FALSE') && (

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">

                Answer Options

              </label>

              <div className="space-y-2">

                {questionForm.options.map((option, index) => (

                  <div key={index} className="flex items-center gap-2">

                    <input

                      type="checkbox"

                      checked={option.isCorrect}

                      onChange={(e) => updateQuestionOption(index, 'isCorrect', e.target.checked)}

                      className="rounded"

                    />

                    <input

                      type="text"

                      value={option.optionText}

                      onChange={(e) => updateQuestionOption(index, 'optionText', e.target.value)}

                      placeholder={`Option ${index + 1}`}

                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"

                      required

                    />

                    {questionForm.type === 'MCQ' && questionForm.options.length > 2 && (

                      <button

                        type="button"

                        onClick={() => removeQuestionOption(index)}

                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"

                      >

                        <Trash2 className="w-4 h-4" />

                      </button>

                    )}

                  </div>

                ))}

                {questionForm.type === 'MCQ' && (

                  <button

                    type="button"

                    onClick={addQuestionOption}

                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"

                  >

                    Add Option

                  </button>

                )}

              </div>

            </div>

          )}



          <div className="flex justify-end gap-3 pt-4">

            <button

              type="button"

              onClick={() => {

                setShowCreateQuestionModal(false);

                setShowEditQuestionModal(false);

                setSelectedQuestion(null);

                setQuestionForm({

                  questionText: '',

                  type: 'MCQ',

                  points: 1,

                  options: [{ optionText: '', isCorrect: false }]

                });

              }}

              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"

            >

              Cancel

            </button>

            <button

              type="submit"

              disabled={questionFormLoading}

              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"

            >

              {questionFormLoading ? "Saving..." : (showEditQuestionModal ? "Update" : "Create")}

            </button>

          </div>

        </form>

      </Modal>



      {/* Delete Assessment Confirmation Modal */}

      <Modal

        isOpen={showDeleteModal}

        onClose={() => {

          setShowDeleteModal(false);

          setAssessmentToDelete(null);

        }}

        title="Delete Assessment"

      >

        <div className="space-y-4">

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">

            <div className="flex items-center">

              <div className="flex-shrink-0">

                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">

                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />

                </svg>

              </div>

              <div className="ml-3">

                <h3 className="text-sm font-medium text-yellow-800">

                  Warning

                </h3>

                <div className="mt-2 text-sm text-yellow-700">

                  <p>

                    Are you sure you want to delete "{assessmentToDelete?.title}"? This action cannot be undone and will also delete all questions associated with this assessment.

                  </p>

                </div>

              </div>

            </div>

          </div>



          <div className="flex justify-end gap-3 pt-4">

            <button

              type="button"

              onClick={() => {

                setShowDeleteModal(false);

                setAssessmentToDelete(null);

              }}

              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"

            >

              Cancel

            </button>

            <button

              onClick={confirmDeleteAssessment}

              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"

            >

              Delete Assessment

            </button>

          </div>

        </div>

      </Modal>

    </div>

  );

}

