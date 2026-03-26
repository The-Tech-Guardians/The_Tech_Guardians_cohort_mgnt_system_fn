"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Eye, Filter, Download, Calendar, TrendingUp, Loader2, HelpCircle } from "lucide-react";
import { adminApi } from "@/lib/adminApi";
import Modal from "@/components/admin/Modal";
import Toast from "@/components/admin/Toast";
import Pagination from "@/components/shared/Pagination";

interface Assessment {
  id: string;
  title: string;
  description: string;
  type: string;
  courseTitle?: string;
  moduleTitle?: string;
  timeLimit?: number;
  passingScore?: number;
  status: 'PUBLISHED' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
  questions: number;
  submissions: number;
  avgScore?: number;
  completionRate?: number;
}

export default function AdminAssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'PUBLISHED' | 'DRAFT' | 'CLOSED'>('all');
  const [filterType, setFilterType] = useState<'all' | string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Assessment>>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  
  // Questions management state
  const [questions, setQuestions] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [showCreateQuestionModal, setShowCreateQuestionModal] = useState(false);
  const [showEditQuestionModal, setShowEditQuestionModal] = useState(false);
  const [showDeleteQuestionModal, setShowDeleteQuestionModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [questionFormData, setQuestionFormData] = useState({
    questionText: '',
    type: 'MCQ' as 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY',
    points: 1,
    options: [{ optionText: '', isCorrect: false, orderIndex: 0 }] as { optionText: string; isCorrect: boolean; orderIndex: number }[],
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      // Use admin API to get all assessments from all instructors
      const assessmentsData = await adminApi.getAllAssessments();
      console.log('Fetched assessments:', assessmentsData);
      
      if (!Array.isArray(assessmentsData)) {
        console.error('Expected array but got:', typeof assessmentsData, assessmentsData);
        setAssessments([]);
        return;
      }
      
      // Transform data to match Assessment interface
      const transformedAssessments: Assessment[] = assessmentsData.map((assessment: any) => ({
        id: assessment.id,
        title: assessment.title,
        description: assessment.description || '',
        type: assessment.type || 'QUIZ',
        courseTitle: assessment.courseTitle || 'Unknown Course',
        moduleTitle: assessment.moduleTitle || '',
        timeLimit: assessment.timeLimitMinutes || assessment.timeLimit,
        passingScore: assessment.passingScore || assessment.passMark,
        status: assessment.status || 'DRAFT',  // Backend already provides status
        createdAt: assessment.createdAt || new Date().toISOString(),
        updatedAt: assessment.updatedAt || new Date().toISOString(),
        questions: assessment.questions || assessment.questionCount || 0,
        submissions: assessment.submissions || 0,
        avgScore: assessment.avgScore,
        completionRate: assessment.completionRate,
      }));
      
      console.log('Transformed assessments:', transformedAssessments);
      setAssessments(transformedAssessments);
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAssessment) return;
    
    try {
      await adminApi.deleteAssessment(selectedAssessment.id);
      setAssessments(assessments.filter(a => a.id !== selectedAssessment.id));
      setShowDeleteModal(false);
      setSelectedAssessment(null);
      setToastMessage('Assessment deleted successfully');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Failed to delete assessment:', error);
      setToastMessage('Failed to delete assessment');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleView = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setShowViewModal(true);
  };

  const handleEdit = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setEditFormData({
      title: assessment.title,
      description: assessment.description,
      type: assessment.type,
      passingScore: assessment.passingScore,
      timeLimit: assessment.timeLimit,
      status: assessment.status,
    });
    setShowEditModal(true);
  };

  const handleManageQuestions = async (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setShowQuestionsModal(true);
    await loadQuestions(assessment.id);
  };

  const loadQuestions = async (assessmentId: string) => {
    try {
      setLoadingQuestions(true);
      const questionsData = await adminApi.getQuestionsByAssessment(assessmentId);
      setQuestions(questionsData);
    } catch (error) {
      console.error('Failed to load questions:', error);
      setToastMessage('Failed to load questions');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleCreateQuestion = async () => {
    if (!selectedAssessment) return;
    
    try {
      await adminApi.createQuestion(selectedAssessment.id, {
        questionText: questionFormData.questionText,
        type: questionFormData.type,
        points: questionFormData.points,
        orderIndex: questions.length,
        options: questionFormData.options.filter(o => o.optionText.trim()),
      });
      
      setToastMessage('Question created successfully');
      setToastType('success');
      setShowToast(true);
      setShowCreateQuestionModal(false);
      resetQuestionForm();
      await loadQuestions(selectedAssessment.id);
      fetchAssessments(); // Refresh to update question count
    } catch (error) {
      console.error('Failed to create question:', error);
      setToastMessage('Failed to create question');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleUpdateQuestion = async () => {
    if (!selectedQuestion) return;
    
    try {
      await adminApi.updateQuestion(selectedQuestion.id, {
        questionText: questionFormData.questionText,
        type: questionFormData.type,
        points: questionFormData.points,
        options: questionFormData.options.filter(o => o.optionText.trim()),
      });
      
      setToastMessage('Question updated successfully');
      setToastType('success');
      setShowToast(true);
      setShowEditQuestionModal(false);
      resetQuestionForm();
      if (selectedAssessment) {
        await loadQuestions(selectedAssessment.id);
      }
    } catch (error) {
      console.error('Failed to update question:', error);
      setToastMessage('Failed to update question');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!selectedQuestion || !selectedAssessment) return;
    
    try {
      await adminApi.deleteQuestion(selectedQuestion.id);
      setToastMessage('Question deleted successfully');
      setToastType('success');
      setShowToast(true);
      setShowDeleteQuestionModal(false);
      await loadQuestions(selectedAssessment.id);
      fetchAssessments(); // Refresh to update question count
    } catch (error) {
      console.error('Failed to delete question:', error);
      setToastMessage('Failed to delete question');
      setToastType('error');
      setShowToast(true);
    }
  };

  const resetQuestionForm = () => {
    setQuestionFormData({
      questionText: '',
      type: 'MCQ',
      points: 1,
      options: [{ optionText: '', isCorrect: false, orderIndex: 0 }],
    });
    setSelectedQuestion(null);
  };

  const openEditQuestion = (question: any) => {
    setSelectedQuestion(question);
    setQuestionFormData({
      questionText: question.questionText,
      type: question.type,
      points: question.points,
      options: question.options?.length > 0 
        ? question.options.map((o: any) => ({ 
            optionText: o.optionText, 
            isCorrect: o.isCorrect, 
            orderIndex: o.orderIndex 
          }))
        : [{ optionText: '', isCorrect: false, orderIndex: 0 }],
    });
    setShowEditQuestionModal(true);
  };

  const addOption = () => {
    setQuestionFormData({
      ...questionFormData,
      options: [...questionFormData.options, { optionText: '', isCorrect: false, orderIndex: questionFormData.options.length }],
    });
  };

  const removeOption = (index: number) => {
    const newOptions = questionFormData.options.filter((_, i) => i !== index);
    setQuestionFormData({ ...questionFormData, options: newOptions });
  };

  const updateOption = (index: number, field: string, value: any) => {
    const newOptions = questionFormData.options.map((o, i) => 
      i === index ? { ...o, [field]: value } : o
    );
    setQuestionFormData({ ...questionFormData, options: newOptions });
  };

  const handleUpdate = async () => {
    if (!selectedAssessment) return;

    try {
      const success = await adminApi.updateAssessment(selectedAssessment.id, editFormData);
      if (success) {
        setToastMessage('Assessment updated successfully');
        setToastType('success');
        setShowToast(true);
        setShowEditModal(false);
        fetchAssessments();
      } else {
        setToastMessage('Failed to update assessment');
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Failed to update assessment:', error);
      setToastMessage('Failed to update assessment');
      setToastType('error');
      setShowToast(true);
    }
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || assessment.status === filterStatus;
    const matchesType = filterType === 'all' || assessment.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredAssessments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAssessments = filteredAssessments.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'QUIZ': 'bg-blue-100 text-blue-800',
      'EXAM': 'bg-purple-100 text-purple-800',
      'ASSIGNMENT': 'bg-amber-100 text-amber-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <span className="text-gray-600">Loading assessments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assessment Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all assessments across the platform</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Assessment
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{assessments.length}</h3>
          <p className="text-sm text-gray-500">Total Assessments</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">Active</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {assessments.filter(a => a.status === 'PUBLISHED').length}
          </h3>
          <p className="text-sm text-gray-500">Published</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">Average</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {(() => {
              const assessmentsWithScores = assessments.filter(a => a.avgScore && a.avgScore > 0);
              if (assessmentsWithScores.length === 0) return 'N/A';
              const avg = assessmentsWithScores.reduce((sum, a) => sum + (a.avgScore || 0), 0) / assessmentsWithScores.length;
              return `${avg.toFixed(1)}%`;
            })()}
          </h3>
          <p className="text-sm text-gray-500">Average Score</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search assessments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              />
            </div>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="CLOSED">Closed</option>
          </select>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="QUIZ">Quiz</option>
            <option value="EXAM">Exam</option>
            <option value="ASSIGNMENT">Assignment</option>
          </select>
        </div>
      </div>

      {/* Assessments Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">Assessment</th>
                <th className="text-left p-4 font-medium text-gray-700">Course</th>
                <th className="text-left p-4 font-medium text-gray-700">Type</th>
                <th className="text-left p-4 font-medium text-gray-700">Questions</th>
                <th className="text-left p-4 font-medium text-gray-700">Submissions</th>
                <th className="text-left p-4 font-medium text-gray-700">Avg Score</th>
                <th className="text-left p-4 font-medium text-gray-700">Status</th>
                <th className="text-left p-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAssessments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-gray-500">
                    <div className="flex flex-col items-center">
                      <Calendar className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-lg font-medium mb-1">No assessments found</p>
                      <p className="text-sm">Create your first assessment to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedAssessments.map((assessment) => (
                  <tr key={assessment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900">{assessment.title}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{assessment.description}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-900">{assessment.courseTitle}</p>
                      {assessment.moduleTitle && (
                        <p className="text-xs text-gray-500">{assessment.moduleTitle}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(assessment.type)}`}>
                        {assessment.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-900">{assessment.questions}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-900">{assessment.submissions}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-900">
                        {assessment.avgScore ? `${assessment.avgScore}%` : 'N/A'}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assessment.status)}`}>
                        {assessment.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleManageQuestions(assessment)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Manage Questions"
                        >
                          <HelpCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleView(assessment)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" 
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(assessment)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" 
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedAssessment(assessment);
                            setShowDeleteModal(true);
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredAssessments.length}
          />
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedAssessment && (
        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Assessment">
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete "{selectedAssessment.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {showViewModal && selectedAssessment && (
        <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Assessment Details">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Title</label>
                <p className="text-gray-900">{selectedAssessment.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Type</label>
                <p className="text-gray-900">{selectedAssessment.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Course</label>
                <p className="text-gray-900">{selectedAssessment.courseTitle}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Module</label>
                <p className="text-gray-900">{selectedAssessment.moduleTitle || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAssessment.status)}`}>
                  {selectedAssessment.status}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Passing Score</label>
                <p className="text-gray-900">{selectedAssessment.passingScore || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Time Limit</label>
                <p className="text-gray-900">{selectedAssessment.timeLimit ? `${selectedAssessment.timeLimit} mins` : 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Questions</label>
                <p className="text-gray-900">{selectedAssessment.questions}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Description</label>
              <p className="text-gray-900 text-sm mt-1">{selectedAssessment.description}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedAssessment && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Assessment">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={editFormData.title || ''}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={editFormData.description || ''}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={editFormData.type || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="QUIZ">Quiz</option>
                  <option value="ASSIGNMENT">Assignment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editFormData.status || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as 'PUBLISHED' | 'DRAFT' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passing Score (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editFormData.passingScore || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, passingScore: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
                <input
                  type="number"
                  min="1"
                  value={editFormData.timeLimit || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, timeLimit: parseInt(e.target.value) || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Questions Management Modal */}
      {showQuestionsModal && selectedAssessment && (
        <Modal isOpen={showQuestionsModal} onClose={() => setShowQuestionsModal(false)} title={`Questions - ${selectedAssessment.title}`}>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">{questions.length} question(s)</p>
              <button
                onClick={() => {
                  resetQuestionForm();
                  setShowCreateQuestionModal(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            </div>
            
            {loadingQuestions ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>No questions yet. Add your first question!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-500">Q{index + 1}.</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            question.type === 'MCQ' ? 'bg-blue-100 text-blue-800' :
                            question.type === 'TRUE_FALSE' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {question.type}
                          </span>
                          <span className="text-xs text-gray-500">{question.points} pts</span>
                        </div>
                        <p className="text-gray-900 font-medium">{question.questionText}</p>
                        {question.options && question.options.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {question.options.map((option: any) => (
                              <div key={option.id} className="flex items-center gap-2 text-sm">
                                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                                  option.isCorrect ? 'bg-green-500 text-white' : 'bg-gray-200'
                                }`}>
                                  {option.isCorrect ? '✓' : ''}
                                </span>
                                <span className={option.isCorrect ? 'text-green-700 font-medium' : 'text-gray-600'}>
                                  {option.optionText}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={() => openEditQuestion(question)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedQuestion(question);
                            setShowDeleteQuestionModal(true);
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setShowQuestionsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Question Modal */}
      {showCreateQuestionModal && (
        <Modal isOpen={showCreateQuestionModal} onClose={() => setShowCreateQuestionModal(false)} title="Create Question">
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
              <textarea
                value={questionFormData.questionText}
                onChange={(e) => setQuestionFormData({ ...questionFormData, questionText: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your question..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={questionFormData.type}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="MCQ">Multiple Choice</option>
                  <option value="TRUE_FALSE">True/False</option>
                  <option value="SHORT_ANSWER">Short Answer</option>
                  <option value="ESSAY">Essay</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                <input
                  type="number"
                  min="1"
                  value={questionFormData.points}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, points: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {(questionFormData.type === 'MCQ' || questionFormData.type === 'TRUE_FALSE') && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Options</label>
                  <button
                    onClick={addOption}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Add Option
                  </button>
                </div>
                <div className="space-y-2">
                  {questionFormData.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={(e) => updateOption(index, 'isCorrect', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        title="Mark as correct answer"
                      />
                      <input
                        type="text"
                        value={option.optionText}
                        onChange={(e) => updateOption(index, 'optionText', e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {questionFormData.options.length > 1 && (
                        <button
                          onClick={() => removeOption(index)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Check the box next to the correct answer(s)</p>
              </div>
            )}
            
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowCreateQuestionModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateQuestion}
                disabled={!questionFormData.questionText.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg"
              >
                Create Question
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Question Modal */}
      {showEditQuestionModal && selectedQuestion && (
        <Modal isOpen={showEditQuestionModal} onClose={() => setShowEditQuestionModal(false)} title="Edit Question">
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
              <textarea
                value={questionFormData.questionText}
                onChange={(e) => setQuestionFormData({ ...questionFormData, questionText: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={questionFormData.type}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="MCQ">Multiple Choice</option>
                  <option value="TRUE_FALSE">True/False</option>
                  <option value="SHORT_ANSWER">Short Answer</option>
                  <option value="ESSAY">Essay</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                <input
                  type="number"
                  min="1"
                  value={questionFormData.points}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, points: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {(questionFormData.type === 'MCQ' || questionFormData.type === 'TRUE_FALSE') && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Options</label>
                  <button
                    onClick={addOption}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Add Option
                  </button>
                </div>
                <div className="space-y-2">
                  {questionFormData.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={(e) => updateOption(index, 'isCorrect', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        title="Mark as correct answer"
                      />
                      <input
                        type="text"
                        value={option.optionText}
                        onChange={(e) => updateOption(index, 'optionText', e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {questionFormData.options.length > 1 && (
                        <button
                          onClick={() => removeOption(index)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Check the box next to the correct answer(s)</p>
              </div>
            )}
            
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowEditQuestionModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateQuestion}
                disabled={!questionFormData.questionText.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Question Modal */}
      {showDeleteQuestionModal && selectedQuestion && (
        <Modal isOpen={showDeleteQuestionModal} onClose={() => setShowDeleteQuestionModal(false)} title="Delete Question">
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete this question? This action cannot be undone.
            </p>
            <p className="text-sm text-gray-500 italic">&quot;{selectedQuestion.questionText}&quot;</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteQuestionModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteQuestion}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          isVisible={showToast}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
