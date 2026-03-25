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
      <div className="flex-1">
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
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
