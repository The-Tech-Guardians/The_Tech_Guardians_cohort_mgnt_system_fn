'use client';

import React, { useState, useEffect } from 'react';
import { invitationService, Invitation, InvitationStats, CreateInvitationData } from '@/services/invitationService';
import { User } from '@/types/user';
import { tokenManager } from '@/lib/auth';

interface InvitationManagementProps {
  onError?: (message: string) => void;
  onSuccess?: (message: string) => void;
}

export default function InvitationManagement({ onError, onSuccess }: InvitationManagementProps) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [stats, setStats] = useState<InvitationStats>({
    totalInvitations: 0,
    pendingInvitations: 0,
    acceptedInvitations: 0,
    expiredInvitations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  // Check current user role
  useEffect(() => {
    const role = tokenManager.getRoleFromToken();
    setCurrentUserRole(role);
  }, []);

  const canManageInvitations = currentUserRole === 'ADMIN';

  useEffect(() => {
    loadInvitations();
    loadStats();
  }, [currentPage]);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const response = await invitationService.getInvitations(currentPage, 10);
      setInvitations(response.invitations);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      onError?.('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await invitationService.getInvitationStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load invitation stats:', error);
    }
  };

  const handleCreateInvitation = async (data: CreateInvitationData) => {
    // Double-check: only admins can create invitations
    if (!canManageInvitations) {
      onError?.('You don\'t have permission to create invitations');
      return;
    }
    
    try {
      await invitationService.createInvitation(data);
      onSuccess?.('Invitation sent successfully');
      setShowCreateModal(false);
      loadInvitations();
      loadStats();
    } catch (error) {
      onError?.('Failed to create invitation');
    }
  };

  const handleRenewInvitation = async (invitationId: string) => {
    if (!canManageInvitations) {
      onError?.('You don\'t have permission to renew invitations');
      return;
    }

    try {
      await invitationService.renewInvitation(invitationId);
      onSuccess?.('Invitation renewed successfully');
      loadInvitations();
      loadStats();
    } catch (error) {
      onError?.('Failed to renew invitation');
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    try {
      await invitationService.resendInvitation(invitationId);
      onSuccess?.('Invitation resent successfully');
    } catch (error) {
      onError?.('Failed to resend invitation');
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      await invitationService.cancelInvitation(invitationId);
      onSuccess?.('Invitation cancelled successfully');
      loadInvitations();
      loadStats();
    } catch (error) {
      onError?.('Failed to cancel invitation');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'INSTRUCTOR':
        return 'bg-blue-100 text-blue-800';
      case 'LEARNER':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Send Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invitation Management</h1>
        </div>
        {canManageInvitations && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-sm text-xs"
          >
            + Invite
          </button>
        )}
      </div>

      {/* Invitations Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Invitations</h2>
          <p className="text-sm text-gray-600">View and manage all user invitations</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invited By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invited At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires At
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
                    Loading...
                  </td>
                </tr>
              ) : invitations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No invitations found
                  </td>
                </tr>
              ) : (
                invitations.map((invitation) => (
                  <tr key={invitation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invitation.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(invitation.role)}`}>
                        {invitation.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invitation.status)}`}>
                        {invitation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invitation.invitedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(invitation.invitedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(invitation.expiresAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {invitation.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleResendInvitation(invitation.id)}
                              className="px-2 py-0.5 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                              title="Resend"
                            >
                              ↻
                            </button>
                            <button
                              onClick={() => handleCancelInvitation(invitation.id)}
                              className="px-2 py-0.5 text-xs text-red-600 bg-white border border-red-300 rounded hover:bg-red-50"
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </>
                        )}
                        {invitation.status === 'EXPIRED' && (
                          <button
                            onClick={() => handleRenewInvitation(invitation.id)}
                            className="px-2 py-0.5 text-xs text-green-600 bg-white border border-green-300 rounded hover:bg-green-50"
                            title="Renew"
                          >
                            ↻
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedInvitation(invitation)}
                          className="px-2 py-0.5 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                          title="View"
                        >
                          👁
                        </button>
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
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Invitation Modal */}
      {showCreateModal && (
        <CreateInvitationModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateInvitation}
        />
      )}

      {/* Invitation Details Modal */}
      {selectedInvitation && (
        <InvitationDetailsModal
          invitation={selectedInvitation}
          onClose={() => setSelectedInvitation(null)}
        />
      )}
    </div>
  );
}

// Create Invitation Modal Component
function CreateInvitationModal({ onClose, onSubmit }: {
  onClose: () => void;
  onSubmit: (data: CreateInvitationData) => void;
}) {
  const [formData, setFormData] = useState({
    email: '',
    role: 'INSTRUCTOR' as 'ADMIN' | 'INSTRUCTOR' | 'LEARNER',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Invite New User
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@example.com"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              >
                <option value="INSTRUCTOR">Instructor</option>
                <option value="LEARNER">Learner</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Invitation Details Modal Component
function InvitationDetailsModal({ invitation, onClose }: {
  invitation: Invitation;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Invitation Details
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <p className="text-sm text-gray-900">{invitation.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Role</label>
              <p className="text-sm text-gray-900">{invitation.role}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Status</label>
              <p className="text-sm text-gray-900">{invitation.status}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Invited By</label>
              <p className="text-sm text-gray-900">{invitation.invitedBy}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Invited At</label>
              <p className="text-sm text-gray-900">{new Date(invitation.invitedAt).toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Expires At</label>
              <p className="text-sm text-gray-900">{new Date(invitation.expiresAt).toLocaleString()}</p>
            </div>
            {invitation.acceptedAt && (
              <div>
                <label className="block text-sm font-medium text-gray-500">Accepted At</label>
                <p className="text-sm text-gray-900">{new Date(invitation.acceptedAt).toLocaleString()}</p>
              </div>
            )}
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
