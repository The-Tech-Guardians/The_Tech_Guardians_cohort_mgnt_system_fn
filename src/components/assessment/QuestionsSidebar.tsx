'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, Plus, Edit, Trash2, Loader2, Clock, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

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

interface QuestionsSidebarProps {
  assessment: any;
  isOpen: boolean;
  onClose: () => void;
  questions?: Question[];
  onAddQuestion?: () => void;
  onEditQuestion?: (question: Question) => void;
  onDeleteQuestion?: (questionId: string) => void;
  loading?: boolean;
}

export default function QuestionsSidebar({ 
  assessment, 
  isOpen, 
  onClose, 
  questions = [], 
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  loading = false 
}: QuestionsSidebarProps) {
  const router = useRouter();
  
  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'MCQ': return 'Multiple Choice';
      case 'TRUE_FALSE': return 'True/False';
      case 'SHORT_ANSWER': return 'Short Answer';
      case 'ESSAY': return 'Essay';
      default: return type;
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'MCQ': return '📝';
      case 'TRUE_FALSE': return '✓';
      case 'SHORT_ANSWER': return '📄';
      case 'ESSAY': return '📖';
      default: return '❓';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
            <p className="text-sm text-gray-600 mt-1">{assessment?.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading questions...</span>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
              <p className="text-gray-600 mb-6">Add your first question to get started</p>
              <button
                onClick={onAddQuestion}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">
                  {questions.length} {questions.length === 1 ? 'Question' : 'Questions'}
                </h3>
                <button
                  onClick={onAddQuestion}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getQuestionTypeIcon(question.type)}</span>
                        <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
                          {getQuestionTypeLabel(question.type)}
                        </span>
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          {question.points} {question.points === 1 ? 'point' : 'points'}
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium mb-2">{question.questionText}</p>
                      
                      {question.options && question.options.length > 0 && (
                        <div className="space-y-1">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={option.id}
                              className={`flex items-center gap-2 text-sm ${
                                option.isCorrect ? 'text-green-700' : 'text-gray-600'
                              }`}
                            >
                              {option.isCorrect ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-gray-400" />
                              )}
                              <span>{option.optionText}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 ml-4">
                      <button
                        onClick={() => onEditQuestion?.(question)}
                        className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteQuestion?.(question.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Total Points: {questions.reduce((sum, q) => sum + q.points, 0)}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (assessment?.id) {
                    router.push(`/instructor/assessments/questions/${assessment.id}`);
                  }
                }}
                className="px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
                Full Page
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
