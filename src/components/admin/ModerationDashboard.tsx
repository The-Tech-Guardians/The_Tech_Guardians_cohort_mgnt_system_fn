'use client';

import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock, User, Calendar, Search, Filter, Ban, Eye } from 'lucide-react';
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
  reviewedAt?: string;
  reportedUser?: {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
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

interface ModerationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  awaitingInstructorApproval: number;
}

interface ModerationDashboardProps {
  onError?: (message: string) => void;
  onSuccess?: (message: string) => void;
}

export default function ModerationDashboard({ onError, onSuccess }: ModerationDashboardProps) {
  const [reports, setReports] = useState<ModerationReport[]>([]);
  const [stats, setStats] = useState<ModerationStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    awaitingInstructorApproval: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<ModerationReport | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showFinalApprovalModal, setShowFinalApprovalModal] = useState(false);
  const [finalBanDuration, setFinalBanDuration] = useState<string>('');
  const [finalBanMessage, setFinalBanMessage] = useState<string>('');
  const [showAdminReviewModal, setShowAdminReviewModal] = useState(false);
  const [adminReviewStatus, setAdminReviewStatus] = useState<string>('');
  const [adminBanDuration, setAdminBanDuration] = useState<string>('');
  const [adminReviewNote, setAdminReviewNote] = useState<string>('');
  const [showDirectBanModal, setShowDirectBanModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserSearchModal, setShowUserSearchModal] = useState(false);
  const [userSearchResults, setUserSearchResults] = useState<any[]>([]);
  const [userSearchLoading, setUserSearchLoading] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    loadReports();
    loadStats();
  }, [currentPage, statusFilter]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserDropdown) {
        const target = event.target as Element;
        if (!target.closest('.user-search-dropdown')) {
          setShowUserDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserDropdown]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 10
      };
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await adminApi.getModerationReports(params);
      setReports(response.reports || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Failed to load reports:', error);
      setError('Failed to load moderation reports');
      onError?.('Failed to load moderation reports');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Calculate stats from reports or create a separate API call
      const response = await adminApi.getModerationReports({ limit: 1000 });
      const allReports = response.reports || [];
      
      setStats({
        total: allReports.length,
        pending: allReports.filter((r: ModerationReport) => r.status === 'PENDING').length,
        approved: allReports.filter((r: ModerationReport) => r.status === 'APPROVED').length,
        rejected: allReports.filter((r: ModerationReport) => r.status === 'REJECTED').length,
        awaitingInstructorApproval: allReports.filter((r: ModerationReport) => r.status === 'AWAITING_INSTRUCTOR_APPROVAL').length
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleReviewReport = async (reportId: string, status: string, banDuration?: number, reviewNote?: string) => {
    try {
      await adminApi.reviewModerationReport(reportId, {
        status,
        banDuration,
        reviewNote
      });
      
      setShowReviewModal(false);
      setSelectedReport(null);
      loadReports();
      loadStats();
      
      // Show success message
      onSuccess?.('Report reviewed successfully');
    } catch (error) {
      console.error('Failed to review report:', error);
      onError?.('Failed to review report');
    }
  };

  const handleDirectBan = async (userId: string, reason: string, banDuration?: number) => {
    try {
      const response = await adminApi.directBanUser(userId, { reason, banDuration });
      
      // Check if this requires instructor approval
      if (response.requiresInstructorApproval) {
        onSuccess?.(`Learner ban request created. Awaiting approval from ${response.requiredApprovals} instructors.`);
      } else {
        onSuccess?.('User banned successfully');
      }
      
      setShowDirectBanModal(false);
      setSelectedUser(null);
      loadReports();
      loadStats();
    } catch (error) {
      console.error('Failed to ban user:', error);
      onError?.('Failed to ban user');
    }
  };

  const searchUsers = async (term: string) => {
    if (!term.trim()) {
      setUserSearchResults([]);
      return;
    }

    try {
      setUserSearchLoading(true);
      const response = await adminApi.searchUsers(term);
      setUserSearchResults(response || []);
    } catch (error) {
      console.error('Failed to search users:', error);
      onError?.('Failed to search users');
    } finally {
      setUserSearchLoading(false);
    }
  };

  const handleUserSearch = (term: string) => {
    setUserSearchTerm(term);
    if (term) {
      searchUsers(term);
    } else {
      // Load all users when search is empty
      loadAllUsers();
    }
  };

  const loadAllUsers = async () => {
    try {
      setUserSearchLoading(true);
      const response = await adminApi.searchUsers(''); // Empty search to get all users
      setUserSearchResults(response || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      onError?.('Failed to load users');
    } finally {
      setUserSearchLoading(false);
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
        return <Ban className="w-4 h-4" />;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
          <p className="text-gray-600 mt-1">Manage user reports and moderation actions</p>
        </div>
        <div className="flex gap-3">
          {/* User Search Dropdown */}
          <div className="relative user-search-dropdown">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Select user to ban..."
                value={userSearchTerm}
                onChange={(e) => {
                  setUserSearchTerm(e.target.value);
                  handleUserSearch(e.target.value);
                  setShowUserDropdown(true);
                }}
                onFocus={() => {
                  setShowUserDropdown(true);
                  if (userSearchResults.length === 0) {
                    loadAllUsers();
                  }
                }}
                className="w-64 pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
            
            {/* Dropdown Results */}
            {showUserDropdown && (
              <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-hidden">
                {/* Dropdown Header */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {userSearchTerm ? 'Search Results' : 'All Users'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {userSearchResults.filter(user => 
                        !userSearchTerm || 
                        user.firstName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                        user.lastName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                        user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
                      ).length} users
                    </span>
                  </div>
                </div>

                {/* User List */}
                <div className="max-h-64 overflow-y-auto">
                  {userSearchLoading && (
                    <div className="px-4 py-8 text-center text-gray-500">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm">Loading users...</span>
                      </div>
                    </div>
                  )}
                  
                  {!userSearchLoading && userSearchResults.length > 0 && (
                    userSearchResults
                      .filter(user => 
                        !userSearchTerm || 
                        user.firstName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                        user.lastName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                        user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
                      )
                      .map((user) => (
                      <div 
                        key={user.uuid} 
                        className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserDropdown(false);
                          setUserSearchTerm('');
                          setUserSearchResults([]);
                          setShowDirectBanModal(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* User Avatar */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              user.role === 'INSTRUCTOR' 
                                ? 'bg-purple-100 text-purple-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              <span className="text-sm font-semibold">
                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                              </span>
                            </div>
                            
                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900 text-sm truncate">
                                  {user.firstName} {user.lastName}
                                </span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  user.role === 'INSTRUCTOR' 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {user.role}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {user.email}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                ID: {user.uuid.slice(0, 8)}...{user.uuid.slice(-4)}
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Icon */}
                          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                            <Ban className="w-4 h-4 text-red-500" />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {!userSearchLoading && userSearchResults.length === 0 && (
                    <div className="px-4 py-8 text-center text-gray-500">
                      <div className="inline-flex flex-col items-center gap-2">
                        <User className="w-8 h-8 text-gray-300" />
                        <span className="text-sm">
                          {userSearchTerm ? 'No users found' : 'No users available'}
                        </span>
                        {userSearchTerm && (
                          <span className="text-xs text-gray-400">
                            Try adjusting your search terms
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dropdown Footer */}
                {!userSearchLoading && userSearchResults.length > 0 && (
                  <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                      Click any user to ban • Requires admin approval
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <button
            onClick={() => setShowDirectBanModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all shadow-sm text-sm"
          >
            <Ban className="w-4 h-4" />
            Direct Ban
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg">
              <Shield className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-bold text-red-600">{stats.approved}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <Ban className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-green-600">{stats.rejected}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Awaiting Approval</p>
              <p className="text-2xl font-bold text-blue-600">{stats.awaitingInstructorApproval}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by user name, email, or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="AWAITING_INSTRUCTOR_APPROVAL">Awaiting Approval</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Moderation Reports</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reported User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reported By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Loading reports...
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No reports found
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
                          <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                            report.reportedUser?.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                            report.reportedUser?.role === 'INSTRUCTOR' ? 'bg-blue-100 text-blue-800' :
                            report.reportedUser?.role === 'LEARNER' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {report.reportedUser?.role || 'Unknown'}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {report.requestedByUser?.firstName} {report.requestedByUser?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{report.requestedByUser?.email}</div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={report.reason}>
                        {report.reason}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        {report.status.replace('_', ' ')}
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
                            setShowReviewModal(true);
                          }}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Edit Status"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <span className="text-xs text-gray-500">Edit</span>
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

      {/* Review Modal */}
      {showReviewModal && selectedReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Review Moderation Report
              </h3>
              
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reported User</label>
                  <p className="text-sm text-gray-900">
                    {selectedReport.reportedUser?.firstName} {selectedReport.reportedUser?.lastName} ({selectedReport.reportedUser?.email})
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason</label>
                  <p className="text-sm text-gray-900">{selectedReport.reason}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Status</label>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                    {getStatusIcon(selectedReport.status)}
                    {selectedReport.status.replace('_', ' ')}
                  </div>
                  {selectedReport.status === 'PENDING' && 
                 selectedReport.instructorApprovals && 
                 selectedReport.instructorApprovals.length >= 2 && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800 font-medium">
                        Ready for Final Approval
                      </p>
                      <p className="text-xs text-green-600">
                        {selectedReport.instructorApprovals.length} instructors have approved this ban request
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Change Status</label>
                  <select
                    value={selectedReport.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      if (newStatus === 'APPROVED' || newStatus === 'REJECTED') {
                        setAdminReviewStatus(newStatus);
                        setAdminBanDuration('');
                        setAdminReviewNote('');
                        setShowAdminReviewModal(true);
                      } else {
                        handleReviewReport(selectedReport.id, newStatus, undefined, undefined);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="AWAITING_INSTRUCTOR_APPROVAL">Awaiting Instructor Approval</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                {selectedReport.status === 'PENDING' && 
                 selectedReport.instructorApprovals && 
                 selectedReport.instructorApprovals.length >= 2 && (
                  <button
                    onClick={() => {
                      setFinalBanDuration('');
                      setFinalBanMessage('');
                      setShowFinalApprovalModal(true);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                  >
                    Give Final Approval
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedReport(null);
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Direct Ban Modal */}
      {showDirectBanModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[420px] shadow-xl rounded-xl bg-white">
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Ban className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Direct Ban User</h3>
                <p className="text-xs text-gray-600">Permanent or temporary user ban</p>
              </div>
            </div>
            
            {selectedUser ? (
              <div className="space-y-4">
                {/* User Info Card */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">User to Ban</label>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      selectedUser.role === 'INSTRUCTOR' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      <span className="text-sm font-bold">
                        {selectedUser.firstName?.charAt(0)}{selectedUser.lastName?.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900 text-sm">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          selectedUser.role === 'INSTRUCTOR' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {selectedUser.role}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">{selectedUser.email}</div>
                    </div>
                  </div>
                </div>
                
                {/* Ban Reason */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Ban Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="banReason"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none text-sm"
                    placeholder="Reason for banning this user..."
                  />
                </div>
                
                {/* Ban Duration */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Ban Duration
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      id="banDuration"
                      min="1"
                      max="8760"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                      placeholder="Hours (optional)"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const durationElement = document.getElementById('banDuration') as HTMLInputElement;
                        if (durationElement) durationElement.value = '24';
                      }}
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium"
                    >
                      24h
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const durationElement = document.getElementById('banDuration') as HTMLInputElement;
                        if (durationElement) durationElement.value = '168';
                      }}
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium"
                    >
                      7d
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const durationElement = document.getElementById('banDuration') as HTMLInputElement;
                        if (durationElement) durationElement.value = '';
                      }}
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium"
                    >
                      ∞
                    </button>
                  </div>
                </div>

                {/* Warning Message */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">
                      This action cannot be easily undone. User will lose access immediately.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                <User className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No user selected</p>
                <p className="text-xs text-gray-500">
                  Please select a user from the dropdown first
                </p>
              </div>
            )}
            
            {/* Modal Actions */}
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowDirectBanModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
              {selectedUser && (
                <button
                  onClick={() => {
                    const reasonElement = document.getElementById('banReason') as HTMLTextAreaElement;
                    const durationElement = document.getElementById('banDuration') as HTMLInputElement;
                    
                    const reason = reasonElement?.value?.trim();
                    const duration = durationElement?.value ? parseInt(durationElement.value) : undefined;
                    
                    if (!reason) {
                      onError?.('Please enter a ban reason');
                      reasonElement?.focus();
                      return;
                    }
                    
                    if (duration && (duration < 1 || duration > 8760)) {
                      onError?.('Ban duration must be between 1 and 8760 hours');
                      return;
                    }
                    
                    handleDirectBan(selectedUser.uuid, reason, duration);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                >
                  Ban User
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Final Approval Modal */}
      {showFinalApprovalModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Final Ban Approval</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">User to Ban</label>
                <p className="text-sm text-gray-900">
                  {selectedReport.reportedUser?.firstName} {selectedReport.reportedUser?.lastName} ({selectedReport.reportedUser?.email})
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Reason for Ban</label>
                <p className="text-sm text-gray-900">{selectedReport.reason}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Instructor Approvals</label>
                <p className="text-sm text-gray-900">{selectedReport.instructorApprovals?.length || 0} of 2 instructors have approved</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ban Duration (hours)</label>
                <input
                  type="number"
                  value={finalBanDuration}
                  onChange={(e) => setFinalBanDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Optional: Leave blank for permanent ban"
                  min="1"
                  max="8760"
                />
                <p className="text-xs text-gray-500 mt-1">Enter hours (1-8760) or leave blank for permanent ban</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Ban Message *</label>
                <textarea
                  value={finalBanMessage}
                  onChange={(e) => setFinalBanMessage(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter custom message for the banned user..."
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowFinalApprovalModal(false);
                  setFinalBanDuration('');
                  setFinalBanMessage('');
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!finalBanMessage.trim()) {
                    onError?.('Please enter a custom ban message');
                    return;
                  }
                  
                  const duration = finalBanDuration ? parseInt(finalBanDuration) : undefined;
                  handleReviewReport(selectedReport.id, 'APPROVED', duration, finalBanMessage);
                  setShowFinalApprovalModal(false);
                  setFinalBanDuration('');
                  setFinalBanMessage('');
                  setShowReviewModal(false);
                  setSelectedReport(null);
                }}
                disabled={!finalBanMessage.trim()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Execute Ban
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Review Modal */}
      {showAdminReviewModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {adminReviewStatus === 'APPROVED' ? 'Approve Ban Request' : 'Reject Ban Request'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">User</label>
                <p className="text-sm text-gray-900">
                  {selectedReport.reportedUser?.firstName} {selectedReport.reportedUser?.lastName} ({selectedReport.reportedUser?.email})
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Reason</label>
                <p className="text-sm text-gray-900">{selectedReport.reason}</p>
              </div>
              
              {adminReviewStatus === 'APPROVED' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ban Duration (hours)</label>
                  <input
                    type="number"
                    value={adminBanDuration}
                    onChange={(e) => setAdminBanDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Optional: Leave blank for permanent ban"
                    min="1"
                    max="8760"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter hours (1-8760) or leave blank for permanent ban</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {adminReviewStatus === 'APPROVED' ? 'Approval Note' : 'Rejection Reason'}
                </label>
                <textarea
                  value={adminReviewNote}
                  onChange={(e) => setAdminReviewNote(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={adminReviewStatus === 'APPROVED' ? 'Enter approval note (optional)...' : 'Enter rejection reason...'}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAdminReviewModal(false);
                  setAdminReviewStatus('');
                  setAdminBanDuration('');
                  setAdminReviewNote('');
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const duration = adminReviewStatus === 'APPROVED' && adminBanDuration ? parseInt(adminBanDuration) : undefined;
                  const note = adminReviewNote || (adminReviewStatus === 'REJECTED' ? 'Rejected by admin' : undefined);
                  handleReviewReport(selectedReport.id, adminReviewStatus, duration, note);
                  setShowAdminReviewModal(false);
                  setAdminReviewStatus('');
                  setAdminBanDuration('');
                  setAdminReviewNote('');
                  setShowReviewModal(false);
                  setSelectedReport(null);
                }}
                className={`px-4 py-2 rounded-lg font-medium ${
                  adminReviewStatus === 'APPROVED' 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                {adminReviewStatus === 'APPROVED' ? 'Approve Ban' : 'Reject Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
