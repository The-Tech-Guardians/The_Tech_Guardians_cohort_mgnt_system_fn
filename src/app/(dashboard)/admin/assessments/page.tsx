"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Eye, Filter, Download, Calendar, Users, Clock, TrendingUp, Loader2 } from "lucide-react";
import { instructorApi } from "@/lib/instructorApi";
import Modal from "@/components/admin/Modal";
import Toast from "@/components/admin/Toast";

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
  const [filterStatus, setFilterStatus] = useState<'all' | 'PUBLISHED' | 'DRAFT'>('all');
  const [filterType, setFilterType] = useState<'all' | string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      // Use the instructor API to get assessments (admin can access all)
      const assessmentsData = await instructorApi.getInstructorAssessments();
      
      // Transform data to match Assessment interface
      const transformedAssessments: Assessment[] = assessmentsData.map((assessment: any) => ({
        id: assessment.id,
        title: assessment.title,
        description: assessment.description || '',
        type: assessment.type || 'QUIZ',
        courseTitle: assessment.courseTitle || 'Unknown Course',
        moduleTitle: assessment.moduleTitle || '',
        timeLimit: assessment.timeLimit,
        passingScore: assessment.passingScore || assessment.passMark,
        status: assessment.isPublished ? 'PUBLISHED' : 'DRAFT',
        createdAt: assessment.createdAt || new Date().toISOString(),
        updatedAt: assessment.updatedAt || new Date().toISOString(),
        questions: assessment.questions?.length || 0,
        submissions: assessment.submissions || 0,
        avgScore: assessment.avgScore,
        completionRate: assessment.completionRate,
      }));
      
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
      await instructorApi.deleteAssessment(selectedAssessment.id);
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

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || assessment.status === filterStatus;
    const matchesType = filterType === 'all' || assessment.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    return status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {assessments.reduce((sum, a) => sum + a.submissions, 0)}
          </h3>
          <p className="text-sm text-gray-500">Submissions</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">Average</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {assessments.length > 0 
              ? (assessments.reduce((sum, a) => sum + (a.avgScore || 0), 0) / assessments.length).toFixed(1)
              : '0'
            }%
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
              {filteredAssessments.length === 0 ? (
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
                filteredAssessments.map((assessment) => (
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
                        <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedAssessment(assessment);
                            setShowEditModal(true);
                          }}
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
