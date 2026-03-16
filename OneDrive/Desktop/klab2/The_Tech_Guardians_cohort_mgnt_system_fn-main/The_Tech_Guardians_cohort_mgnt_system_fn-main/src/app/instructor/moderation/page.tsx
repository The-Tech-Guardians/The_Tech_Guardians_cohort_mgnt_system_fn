'use client'

import { useState, useEffect } from "react";
import { Search, Shield, CheckCircle, XCircle, MessageSquare, Clock, User, AlertTriangle } from "lucide-react";
import { moderation } from '../../../lib/instructorApi';

interface ModerationRequest {
  id: string;
  type: 'ban-request' | 'content-report' | 'appeal';
  learnerId: string;
  learnerName: string;
  learnerEmail: string;
  reason: string;
  description: string;
  status: 'pending' | 'approved' | 'denied';
  submittedAt: string;
  reviewedAt?: string;
  reviewerNotes?: string;
}

export default function ModerationPage() {
  const [requests, setRequests] = useState<ModerationRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'denied'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'ban-request' | 'content-report' | 'appeal'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ModerationRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchModerationRequests();
  }, []);

  const fetchModerationRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await moderation.fetchBanRequests();

      if (response.success && response.requests) {
        // Transform the data to match our interface
        const transformedRequests = response.requests.map((req: any) => ({
          id: req.id,
          type: 'ban-request' as const,
          learnerId: req.learnerId,
          learnerName: req.learnerName || 'Unknown Learner',
          learnerEmail: req.learnerEmail || '',
          reason: req.reason || 'No reason provided',
          description: req.description || '',
          status: req.status || 'pending',
          submittedAt: req.submittedAt || new Date().toISOString(),
          reviewedAt: req.reviewedAt,
          reviewerNotes: req.reviewerNotes
        }));
        setRequests(transformedRequests);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error('Failed to fetch moderation requests:', err);
      setError('Failed to load moderation requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      setProcessing(true);
      await moderation.approveBanRequest(requestId);
      await fetchModerationRequests(); // Refresh the list
      setSelectedRequest(null);
      setReviewNotes("");
    } catch (err) {
      console.error('Failed to approve request:', err);
      setError('Failed to approve request');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeny = async (requestId: string) => {
    if (!reviewNotes.trim()) {
      setError('Please provide feedback for denial');
      return;
    }

    try {
      setProcessing(true);
      await moderation.denyBanRequest(requestId, reviewNotes);
      await fetchModerationRequests(); // Refresh the list
      setSelectedRequest(null);
      setReviewNotes("");
    } catch (err) {
      console.error('Failed to deny request:', err);
      setError('Failed to deny request');
    } finally {
      setProcessing(false);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.learnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.learnerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesType = typeFilter === 'all' || request.type === typeFilter;
    return matchesSearch && matchesFilter && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ban-request': return 'bg-red-100 text-red-800';
      case 'content-report': return 'bg-orange-100 text-orange-800';
      case 'appeal': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReview = async (requestId: string, action: 'approve' | 'deny') => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setRequests(prev => prev.map(req =>
        req.id === requestId
          ? {
              ...req,
              status: action === 'approve' ? 'approved' : 'denied',
              reviewedAt: new Date().toISOString(),
              reviewerNotes: reviewNotes
            }
          : req
      ));

      setSelectedRequest(null);
      setReviewNotes("");
    } catch (error) {
      console.error('Failed to review request:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Moderation</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Moderation</h1>
          <p className="text-gray-600">Review and manage learner requests and reports</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Types</option>
          <option value="ban-request">Ban Requests</option>
          <option value="content-report">Content Reports</option>
          <option value="appeal">Appeals</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests List */}
        <div className="lg:col-span-2">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
              <Shield className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filter !== 'all' || typeFilter !== 'all' ? 'Try adjusting your search or filters.' : 'No moderation requests at this time.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(request.type)}`}>
                          {request.type.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{request.reason}</h3>
                      <p className="text-sm text-gray-600 mb-2">{request.learnerName} ({request.learnerEmail})</p>
                      <p className="text-sm text-gray-500 line-clamp-2">{request.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>Submitted {new Date(request.submittedAt).toLocaleDateString()}</span>
                      </div>
                      {request.reviewedAt && (
                        <div className="flex items-center gap-1">
                          <CheckCircle size={14} />
                          <span>Reviewed {new Date(request.reviewedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Request Details */}
        <div className="lg:col-span-1">
          {selectedRequest ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(selectedRequest.type)}`}>
                    {selectedRequest.type.replace('-', ' ').toUpperCase()}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Learner</label>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedRequest.learnerName}</p>
                      <p className="text-sm text-gray-500">{selectedRequest.learnerEmail}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <p className="text-sm text-gray-900">{selectedRequest.reason}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-sm text-gray-600">{selectedRequest.description}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>

                {selectedRequest.reviewerNotes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Review Notes</label>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedRequest.reviewerNotes}</p>
                  </div>
                )}

                {selectedRequest.status === 'pending' && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Review Notes
                      </label>
                      <textarea
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add notes about your decision..."
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReview(selectedRequest.id, 'approve')}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReview(selectedRequest.id, 'deny')}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle size={16} />
                        Deny
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">Select a Request</h3>
              <p className="text-sm text-gray-500">Click on a moderation request to view details and take action.</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Moderation Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{requests.filter(r => r.status === 'pending').length}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{requests.filter(r => r.status === 'approved').length}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{requests.filter(r => r.status === 'denied').length}</div>
            <div className="text-sm text-gray-600">Denied</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{requests.length}</div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </div>
        </div>
      </div>
    </div>
  );
}