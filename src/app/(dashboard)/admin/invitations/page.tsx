'use client';

import React, { useState } from 'react';
import { Mail, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import InvitationManagement from '@/components/admin/InvitationManagement';
import InvitationNavigation from '@/components/admin/InvitationNavigation';

export default function AdminInvitationsPage() {
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  return (
    <div className="flex space-x-6">
      {/* Sidebar Navigation */}
      <div className="w-80 flex-shrink-0">
        <InvitationNavigation />
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invitation Management</h1>
            <p className="text-gray-600 mt-1">Manage user invitations and monitor acceptance rates</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Mail className="w-4 h-4" />
            <span>Email notifications enabled</span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Sent</p>
                <p className="text-lg font-semibold text-gray-900">-</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-lg font-semibold text-gray-900">-</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Accepted</p>
                <p className="text-lg font-semibold text-gray-900">-</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Expired</p>
                <p className="text-lg font-semibold text-gray-900">-</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Invitations</h2>
                <p className="text-sm text-gray-600 mt-1">View and manage all user invitations</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <AlertCircle className="w-4 h-4" />
                <span>Admins are notified when invitations are sent or accepted</span>
              </div>
            </div>
          </div>
          
          <InvitationManagement
            onError={(message) => showToast(message, 'error')}
            onSuccess={(message) => showToast(message, 'success')}
          />
        </div>

        {/* Toast Notification */}
        {toast.show && (
          <div className={`fixed bottom-4 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg ${
            toast.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
