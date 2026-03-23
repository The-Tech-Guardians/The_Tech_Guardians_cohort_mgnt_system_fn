'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';
import InvitationAnalytics from '@/components/admin/InvitationAnalytics';

export default function AdminInvitationAnalyticsPage() {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invitation Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into invitation performance and trends</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <BarChart3 className="w-4 h-4" />
          <span>Real-time data</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Sent</p>
              <p className="text-2xl font-bold">-</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Acceptance Rate</p>
              <p className="text-2xl font-bold">-</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending</p>
              <p className="text-2xl font-bold">-</p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Expired</p>
              <p className="text-2xl font-bold">-</p>
            </div>
            <BarChart3 className="w-8 h-8 text-red-200" />
          </div>
        </div>
      </div>

      {/* Main Analytics Content */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Detailed Analytics</h2>
              <p className="text-sm text-gray-600 mt-1">View comprehensive invitation metrics and trends</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <TrendingUp className="w-4 h-4" />
              <span>Updated in real-time</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <InvitationAnalytics />
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
