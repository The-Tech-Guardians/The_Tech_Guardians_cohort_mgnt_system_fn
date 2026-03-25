'use client';

import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock, User, Calendar, Search, Filter, Eye } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';

interface ModerationReport {
  id: string;
  reportedUserId: string;
  requestedBy: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'AWAITING_INSTRUCTOR_APPROVAL';
  banDuration?: number;
  reviewedBy?: string;
  reviewNote?: string;
  instructorApprovals?: string[];
  createdAt: string;
  reviewedAt?: Date;
  reportedUser?: {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    cohortId?: string;
  };
  requestedByUser?: {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  reviewedByUser?: {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface InstructorModerationStats {
  pendingApprovals: number;
  approvedByMe: number;
  totalApproved: number;
  totalRejected: number;
}

interface InstructorModerationDashboardProps {
  onError?: (message: string) => void;
  onSuccess?: (message: string) => void;
}

export default function InstructorModerationDashboard({ onError, onSuccess }: InstructorModerationDashboardProps) {
  const [reports, setReports] = useState<ModerationReport[]>([]);
  const [stats, setStats] = useState<InstructorModerationStats>({
    pendingApprovals: 0,
    approvedByMe: 0,
    totalApproved: 0,
    totalRejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<ModerationReport | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [showDenyModal, setShowDenyModal] = useState(false);
  const [denyReason, setDenyReason] = useState('');
  const [instructorId, setInstructorId] = useState<string>('');

  useEffect(() => {
    // Get current instructor ID from JWT token
    const getCurrentInstructor = () => {
      try {
        // Check multiple storage locations for token
        let token = localStorage.getItem('auth_token');
        console.log('INSTRUCTOR DASHBOARD - localStorage auth_token:', !!token);
        
        if (!token) {
          token = sessionStorage.getItem('auth_token');
          console.log('INSTRUCTOR DASHBOARD - sessionStorage auth_token:', !!token);
        }
        
        if (!token) {
          // Check for cookies
          const cookies = document.cookie.split(';');
          console.log('INSTRUCTOR DASHBOARD - Checking cookies:', cookies.length);
          
          for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'auth_token' || name === 'token') {
              token = value;
              console.log('INSTRUCTOR DASHBOARD - Found token in cookie:', name);
              break;
            }
          }
        }
        
        if (!token) {
          // Check if NotificationService has access to token (from the console output)
          console.log('INSTRUCTOR DASHBOARD - No token found in any storage');
          return;
        }
        
        console.log('INSTRUCTOR DASHBOARD - Token found:', !!token);
        console.log('INSTRUCTOR DASHBOARD - Token length:', token.length);
        console.log('INSTRUCTOR DASHBOARD - Token parts:', token.split('.').length);
        
        // Decode JWT token (simple decode without verification for getting user ID)
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('INSTRUCTOR DASHBOARD - Token payload:', payload);
        
        if (payload.uuid) {
          setInstructorId(payload.uuid);
          console.log('INSTRUCTOR DASHBOARD - Set instructor ID from token:', payload.uuid);
        } else {
          console.log('INSTRUCTOR DASHBOARD - No UUID in token payload');
        }
      } catch (error) {
        console.error('Failed to get instructor ID from token:', error);
      }
    };

    getCurrentInstructor();
    loadPendingApprovals();
    loadStats();
  }, [currentPage]);

  const loadPendingApprovals = async () => {
    try {
      console.log('INSTRUCTOR DASHBOARD - Loading pending approvals...');
      setLoading(true);
      const response = await adminApi.getPendingInstructorApprovals({
        page: currentPage,
        limit: 10
      });
      console.log('INSTRUCTOR DASHBOARD - API Response:', response);
      console.log('INSTRUCTOR DASHBOARD - Reports found:', response.reports?.length || 0);
      console.log('INSTRUCTOR DASHBOARD - Full response data:', JSON.stringify(response, null, 2));
      setReports(response.reports || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Failed to load pending approvals:', error);
      setError('Failed to load pending approvals');
      onError?.('Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      console.log('INSTRUCTOR DASHBOARD - Loading stats...');
      // Get instructor's current user info
      const response = await adminApi.getPendingInstructorApprovals({ limit: 1000 });
      const allReports = response.reports || [];
      console.log('INSTRUCTOR DASHBOARD - Stats - All reports for stats:', allReports.length);
      
      // Calculate stats based on current instructor
      console.log('INSTRUCTOR DASHBOARD - Calculating stats with instructorId:', instructorId);
      const approvedByMeCount = allReports.filter((report: any) => {
        const hasApproved = report.instructorApprovals?.includes(instructorId);
        console.log('INSTRUCTOR DASHBOARD - Report approvals:', report.instructorApprovals, 'Has approved:', hasApproved);
        return hasApproved;
      }).length;
      
      const rejectedByMeCount = 0; // Would need separate tracking
      
      const finalStats = {
        pendingApprovals: allReports.length,
        approvedByMe: approvedByMeCount,
        totalApproved: 0, // Would need broader stats endpoint
        totalRejected: rejectedByMeCount // Would need broader stats endpoint
      };
      
      console.log('INSTRUCTOR DASHBOARD - Final stats:', finalStats);
      setStats(finalStats);
      console.log('INSTRUCTOR DASHBOARD - Stats updated:', { pendingApprovals: allReports.length });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleApproveBan = async (reportId: string) => {
    try {
      await adminApi.approveInstructorBan(reportId);
      loadPendingApprovals();
      loadStats();
      
      onSuccess?.('Ban approved successfully. Waiting for final admin approval.');
    } catch (error) {
      console.error('Failed to approve ban:', error);
      onError?.('Failed to approve ban');
    }
  };

  const handleDenyBan = async (reportId: string, reason?: string) => {
    try {
      await adminApi.denyInstructorBan(reportId, reason);
      loadPendingApprovals();
      loadStats();
      
      onSuccess?.('Ban request rejected successfully');
    } catch (error) {
      console.error('Failed to deny ban:', error);
      onError?.('Failed to deny ban');
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      onError?.('Please enter feedback before submitting');
      return;
    }

    try {
      await adminApi.submitModerationFeedback(feedbackText);
      
      setFeedbackText('');
      setShowFeedbackModal(false);
      onSuccess?.('Feedback submitted successfully');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      onError?.('Failed to submit feedback');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-red-100 text-red-800';
      case 'REJECTED':
        return 'bg-green-100 text-green-800';
      case 'AWAITING_INSTRUCTOR_APPROVAL':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'APPROVED':
        return <AlertTriangle className="w-4 h-4" />;
      case 'REJECTED':
        return <CheckCircle className="w-4 h-4" />;
      case 'AWAITING_INSTRUCTOR_APPROVAL':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredReports = reports.filter(report => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      report.reportedUser?.firstName?.toLowerCase().includes(searchLower) ||
      report.reportedUser?.lastName?.toLowerCase().includes(searchLower) ||
      report.reportedUser?.email?.toLowerCase().includes(searchLower) ||
      report.reason.toLowerCase().includes(searchLower)
    );
  });

  const canApprove = (report: ModerationReport) => {
    // Check if current instructor can approve this report
    return report.status === 'AWAITING_INSTRUCTOR_APPROVAL' && 
           !report.instructorApprovals?.includes(instructorId);
  };

  const hasApproved = (report: ModerationReport) => {
    return report.instructorApprovals?.includes(instructorId);
  };

  const getApprovalCount = (report: ModerationReport) => {
    return report.instructorApprovals?.length || 0;
  };

  const getStatusBadge = (report: ModerationReport) => {
    switch (report.status) {
      case 'AWAITING_INSTRUCTOR_APPROVAL':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-red-100 text-red-800';
      case 'REJECTED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Instructor Moderation</h1>
          <p className="text-gray-600 mt-1">Review and approve learner ban requests</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-sm text-sm"
          >
            <Shield className="w-4 h-4" />
            Submit Feedback
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Approvals</p>
              <p className="text-2xl font-bold text-blue-600">{stats.pendingApprovals}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved by Me</p>
              <p className="text-2xl font-bold text-green-600">{stats.approvedByMe}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Approved</p>
              <p className="text-2xl font-bold text-red-600">{stats.totalApproved}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Rejected</p>
              <p className="text-2xl font-bold text-gray-600">{stats.totalRejected}</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg">
              <XCircle className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by learner name, email, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Ban Requests Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Ban Requests</h3>
          <p className="text-sm text-gray-600">Requests awaiting instructor approval</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approvals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Loading ban requests...
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No pending ban requests found
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {report.reportedUser?.firstName} {report.reportedUser?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{report.reportedUser?.email}</div>
                          <div className="text-xs text-gray-400">Learner</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={report.reason}>
                        {report.reason}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {report.requestedByUser?.firstName} {report.requestedByUser?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{report.requestedByUser?.email}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(report)}`}>
                        {report.status === 'AWAITING_INSTRUCTOR_APPROVAL' ? 'Awaiting Instructor Approval' :
                         report.status === 'PENDING' ? 'Pending' :
                         report.status === 'APPROVED' ? 'Approved' : 
                         report.status === 'REJECTED' ? 'Rejected' : report.status}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1">
                          {[...Array(getApprovalCount(report))].map((_, i) => (
                            <div key={i} className="w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          ))}
                          {[...Array(3 - getApprovalCount(report))].map((_, i) => (
                            <div key={i} className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center">
                              <Clock className="w-3 h-3 text-white" />
                            </div>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {getApprovalCount(report)}/3
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {canApprove(report) && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApproveBan(report.id)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium"
                            >
                              Approve Ban
                            </button>
                            <button
                              onClick={() => {
                                setSelectedReport(report);
                                setDenyReason('');
                                setShowDenyModal(true);
                              }}
                              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg font-medium"
                            >
                              Deny
                            </button>
                          </div>
                        )}
                        
                        {hasApproved(report) && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-lg">
                            Approved by You
                          </span>
                        )}
                        
                        {report.status === 'APPROVED' && !hasApproved(report) && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-lg">
                            Approved
                          </span>
                        )}
                        
                        {report.status === 'REJECTED' && (
                          <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-lg">
                            Rejected
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Ban Request Details
              </h3>
              
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Learner</label>
                  <p className="text-sm text-gray-900">
                    {selectedReport.reportedUser?.firstName} {selectedReport.reportedUser?.lastName} ({selectedReport.reportedUser?.email})
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason</label>
                  <p className="text-sm text-gray-900">{selectedReport.reason}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Requested By</label>
                  <p className="text-sm text-gray-900">
                    {selectedReport.requestedByUser?.firstName} {selectedReport.requestedByUser?.lastName}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Approvals</label>
                  <p className="text-sm text-gray-900">{getApprovalCount(selectedReport)} of 2 instructors</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ban Duration</label>
                  <p className="text-sm text-gray-900">
                    {selectedReport.banDuration ? `${selectedReport.banDuration} hours` : 'Permanent'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedReport(null);
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Submit Moderation Feedback
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback for Admins
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Share your thoughts about the moderation process, suggest improvements, or report issues..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setFeedbackText('');
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deny Ban Modal */}
      {showDenyModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Deny Ban Request</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Reported User</label>
                <p className="text-sm text-gray-900">
                  {selectedReport.reportedUser?.firstName} {selectedReport.reportedUser?.lastName} ({selectedReport.reportedUser?.email})
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Reason for Ban</label>
                <p className="text-sm text-gray-900">{selectedReport.reason}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Denial *</label>
                <textarea
                  value={denyReason}
                  onChange={(e) => setDenyReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Please explain why you are denying this ban request..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDenyModal(false);
                  setDenyReason('');
                  setSelectedReport(null);
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (denyReason.trim()) {
                    handleDenyBan(selectedReport.id, denyReason);
                    setShowDenyModal(false);
                    setDenyReason('');
                    setSelectedReport(null);
                  }
                }}
                disabled={!denyReason.trim()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Deny Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
