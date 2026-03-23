'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Clock, CheckCircle, XCircle, Search, Filter, Loader2, Grid, List, BookOpen, Users, AlertCircle, Eye } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { tokenManager } from '@/lib/auth';
import Modal from '@/components/admin/Modal';

interface Question {
  id: string;
  questionText: string;
  type: 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY';
  points: number;
  orderIndex?: number;
  options?: Array<{
    id: string;
    optionText: string;
    isCorrect: boolean;
    orderIndex?: number;
  }>;
}

interface QuestionForm {
  questionText: string;
  type: 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY';
  points: number;
  options: Array<{
    optionText: string;
    isCorrect: boolean;
  }>;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  type: 'QUIZ' | 'ASSIGNMENT';
  moduleId: string;
  isPublished: boolean;
  createdAt: string;
}

export default function QuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.assessmentId as string;
  const { showToast } = useToast();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  
  // Question modal state
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    questionText: '',
    type: 'MCQ' as 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY',
    points: 1,
    options: [
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false }
    ]
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/backend';

  useEffect(() => {
    if (assessmentId) {
      fetchAssessment();
      fetchQuestions();
    }
  }, [assessmentId]);

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token');

      console.log('Fetching assessment for ID:', assessmentId);

      // Try the simpler endpoint first
      let response = await fetch(`${API_BASE_URL}/assessments/${assessmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Fallback to the with-questions endpoint
        response = await fetch(`${API_BASE_URL}/assessments/${assessmentId}/with-questions`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      if (!response.ok) {
        throw new Error('Failed to fetch assessment');
      }

      const data = await response.json();
      console.log('Assessment data:', data);
      setAssessment(data.assessment || data);
      
      // Set questions if they come with the assessment
      if (data.questions && Array.isArray(data.questions)) {
        console.log('Setting questions from assessment:', data.questions);
        setQuestions(data.questions);
      }
    } catch (error) {
      console.error('Error fetching assessment:', error);
      showToast('Failed to load assessment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      setQuestionsLoading(true);
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`${API_BASE_URL}/assessments/${assessmentId}/questions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      const data = await response.json();
      console.log('Questions data:', data);
      
      // Handle different response formats
      let questionsData = [];
      if (Array.isArray(data)) {
        questionsData = data;
      } else if (data.questions && Array.isArray(data.questions)) {
        questionsData = data.questions;
      } else if (data.data && Array.isArray(data.data)) {
        questionsData = data.data;
      }
      
      setQuestions(questionsData);
      console.log('Set questions:', questionsData);
    } catch (error) {
      console.error('Error fetching questions:', error);
      showToast('Failed to load questions', 'error');
      setQuestions([]); // Set empty array on error
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleCreateQuestion = async () => {
    try {
      setFormLoading(true);
      const token = tokenManager.getToken();
      if (!token) throw new Error('Authentication required');

      const questionData = {
        questionText: questionForm.questionText,
        type: questionForm.type,
        points: questionForm.points,
        options: questionForm.type === 'MCQ' || questionForm.type === 'TRUE_FALSE' ? questionForm.options : undefined
      };

      const response = await fetch(`${API_BASE_URL}/assessments/${assessmentId}/questions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        throw new Error('Failed to create question');
      }

      await fetchQuestions();
      setShowQuestionModal(false);
      resetQuestionForm();
      showToast('Question created successfully', 'success');
    } catch (error) {
      console.error('Error creating question:', error);
      showToast('Failed to create question', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateQuestion = async () => {
    try {
      setFormLoading(true);
      const token = tokenManager.getToken();
      if (!token || !editingQuestion) throw new Error('Authentication required');

      const questionData = {
        questionText: questionForm.questionText,
        type: questionForm.type,
        points: questionForm.points,
        options: questionForm.type === 'MCQ' || questionForm.type === 'TRUE_FALSE' ? questionForm.options : undefined
      };

      const response = await fetch(`${API_BASE_URL}/assessments/questions/${editingQuestion.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        throw new Error('Failed to update question');
      }

      await fetchQuestions();
      setShowQuestionModal(false);
      setEditingQuestion(null);
      resetQuestionForm();
      showToast('Question updated successfully', 'success');
    } catch (error) {
      console.error('Error updating question:', error);
      showToast('Failed to update question', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
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

      await fetchQuestions();
      showToast('Question deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting question:', error);
      showToast('Failed to delete question', 'error');
    }
  };

  const resetQuestionForm = () => {
    setQuestionForm({
      questionText: '',
      type: 'MCQ',
      points: 1,
      options: [
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false }
      ]
    });
    setEditingQuestion(null);
  };

  const openQuestionModal = (question?: Question) => {
    if (question) {
      setEditingQuestion(question);
      setQuestionForm({
        questionText: question.questionText,
        type: question.type,
        points: question.points,
        options: question.options || [
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false }
        ]
      });
    } else {
      resetQuestionForm();
    }
    setShowQuestionModal(true);
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'MCQ': return 'Multiple Choice';
      case 'TRUE_FALSE': return 'True/False';
      case 'SHORT_ANSWER': return 'Short Answer';
      case 'ESSAY': return 'Essay';
      default: return type;
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'MCQ': return 'from-blue-100 to-blue-200 text-blue-800 border-blue-300';
      case 'TRUE_FALSE': return 'from-green-100 to-green-200 text-green-800 border-green-300';
      case 'SHORT_ANSWER': return 'from-purple-100 to-purple-200 text-purple-800 border-purple-300';
      case 'ESSAY': return 'from-orange-100 to-orange-200 text-orange-800 border-orange-300';
      default: return 'from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    }
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.questionText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || question.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  const handleSubmitQuestion = async () => {
    if (editingQuestion) {
      await handleUpdateQuestion();
    } else {
      await handleCreateQuestion();
    }
  };

  // Question Form Component
  const QuestionForm = ({ form, setForm, onSubmit, onCancel, loading }: {
    form: QuestionForm;
    setForm: React.Dispatch<React.SetStateAction<QuestionForm>>;
    onSubmit: () => void;
    onCancel: () => void;
    loading: boolean;
  }) => {
    const handleOptionChange = (index: number, field: 'optionText' | 'isCorrect', value: string | boolean) => {
      const newOptions = [...form.options];
      newOptions[index] = { ...newOptions[index], [field]: value };
      setForm((prev: QuestionForm) => ({ ...prev, options: newOptions }));
    };

    const addOption = () => {
      setForm((prev: QuestionForm) => ({
        ...prev,
        options: [...prev.options, { optionText: '', isCorrect: false }]
      }));
    };

    const removeOption = (index: number) => {
      if (form.options.length > 2) {
        const newOptions = form.options.filter((_: any, i: number) => i !== index);
        setForm((prev: QuestionForm) => ({ ...prev, options: newOptions }));
      }
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
          <textarea
            value={form.questionText}
            onChange={(e) => setForm((prev: QuestionForm) => ({ ...prev, questionText: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Enter your question..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm((prev: QuestionForm) => ({ ...prev, type: e.target.value as QuestionForm['type'] }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="MCQ">Multiple Choice</option>
            <option value="TRUE_FALSE">True/False</option>
            <option value="SHORT_ANSWER">Short Answer</option>
            <option value="ESSAY">Essay</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
          <input
            type="number"
            min="1"
            value={form.points}
            onChange={(e) => setForm((prev: QuestionForm) => ({ ...prev, points: parseInt(e.target.value) || 1 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {(form.type === 'MCQ' || form.type === 'TRUE_FALSE') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
            <div className="space-y-2">
              {form.options.map((option: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctOption"
                    checked={option.isCorrect}
                    onChange={() => {
                      const newOptions = form.options.map((opt: any, i: number) => ({
                        ...opt,
                        isCorrect: i === index
                      }));
                      setForm((prev: QuestionForm) => ({ ...prev, options: newOptions }));
                    }}
                    className="w-4 h-4 text-blue-600"
                  />
                  <input
                    type="text"
                    value={option.optionText}
                    onChange={(e) => handleOptionChange(index, 'optionText', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Option ${index + 1}`}
                  />
                  {form.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              {form.type === 'MCQ' && (
                <button
                  type="button"
                  onClick={addOption}
                  className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
                >
                  <Plus className="h-4 w-4 inline mr-2" />
                  Add Option
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading || !form.questionText.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : editingQuestion ? 'Update Question' : 'Create Question'}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{assessment?.title}</h1>
                <span className="text-sm text-gray-500">Manage questions for this assessment</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">John Doe</div>
                  <div className="text-xs text-gray-500">Instructor</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-sm text-green-600 font-medium">+12%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{questions.length}</h3>
                <p className="text-sm text-gray-500">Total Questions</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <div className="text-lg font-bold text-green-900">{totalPoints}</div>
                  </div>
                  <span className="text-sm text-green-600 font-medium">+8%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{totalPoints}</h3>
                <p className="text-sm text-gray-500">Total Points</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <div className="text-lg font-bold text-purple-900">{assessment?.type}</div>
                  </div>
                  <span className="text-sm text-green-600 font-medium">+5%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{assessment?.type}</h3>
                <p className="text-sm text-gray-500">Assessment Type</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <div className="text-lg font-bold text-orange-900">{assessment?.isPublished ? 'Active' : 'Draft'}</div>
                  </div>
                  <span className="text-sm text-green-600 font-medium">+3%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{assessment?.isPublished ? 'Active' : 'Draft'}</h3>
                <p className="text-sm text-gray-500">Status</p>
              </div>
            </div>

            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Questions Management</h2>
                  <p className="text-gray-500">{assessment?.description}</p>
                </div>
                <button
                  onClick={() => openQuestionModal()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                  Add Question
                </button>
              </div>

              {/* Search and Filter Section */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search questions..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all"
                >
                  <option value="all">All Types</option>
                  <option value="MCQ">Multiple Choice</option>
                  <option value="TRUE_FALSE">True/False</option>
                  <option value="SHORT_ANSWER">Short Answer</option>
                  <option value="ESSAY">Essay</option>
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
            {questionsLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <span className="text-gray-600">Loading questions...</span>
                </div>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200 shadow-sm">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No questions yet</h3>
                  <p className="text-gray-600 mb-8 text-lg">Start by adding your first question to this assessment.</p>
                  <button
                    onClick={() => openQuestionModal()}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="h-5 w-5 inline mr-2" />
                    Add Your First Question
                  </button>
                </div>
              </div>
            ) : viewMode === 'card' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuestions.map((question, index) => (
                  <div key={question.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getQuestionTypeColor(question.type)}`}>
                              {getQuestionTypeLabel(question.type)}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300">
                              {question.points} {question.points === 1 ? 'point' : 'points'}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">{question.questionText}</h3>
                          
                          {question.options && question.options.length > 0 && (
                            <div className="space-y-2">
                              {question.options.map((option, optionIndex) => (
                                <div
                                  key={option.id || optionIndex}
                                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                                    option.isCorrect 
                                      ? 'bg-green-50 border-green-200' 
                                      : 'bg-gray-50 border-gray-200'
                                  }`}
                                >
                                  {option.isCorrect ? (
                                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                  )}
                                  <span className={`text-sm ${
                                    option.isCorrect ? 'text-green-800 font-medium' : 'text-gray-700'
                                  }`}>
                                    {option.optionText}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => openQuestionModal(question)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Options</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredQuestions.map((question, index) => (
                        <tr key={question.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900 mb-1">Question {index + 1}</div>
                              <div className="text-sm text-gray-700">{question.questionText}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getQuestionTypeColor(question.type)}`}>
                              {getQuestionTypeLabel(question.type)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300">
                              {question.points} {question.points === 1 ? 'point' : 'points'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {question.options && question.options.length > 0 ? (
                              <div className="space-y-1">
                                {question.options.map((option, optionIndex) => (
                                  <div key={option.id || optionIndex} className="flex items-center gap-2 text-sm">
                                    {option.isCorrect ? (
                                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                    )}
                                    <span className={option.isCorrect ? 'text-green-800 font-medium' : 'text-gray-600'}>
                                      {option.optionText}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">No options</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openQuestionModal(question)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(question.id)}
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

      {/* Question Modal */}
      {showQuestionModal && (
        <Modal 
          isOpen={showQuestionModal} 
          onClose={() => {
            setShowQuestionModal(false);
            resetQuestionForm();
          }} 
          title={editingQuestion ? "Edit Question" : "Add New Question"}
        >
          <QuestionForm
            form={questionForm}
            setForm={setQuestionForm}
            onSubmit={handleSubmitQuestion}
            onCancel={() => {
              setShowQuestionModal(false);
              resetQuestionForm();
            }}
            loading={questionsLoading}
          />
        </Modal>
      )}
    </div>
  );
}
