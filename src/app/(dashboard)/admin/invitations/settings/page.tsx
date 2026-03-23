'use client';

import React, { useState } from 'react';
import { Settings, Mail, Clock, Bell, Shield, Save } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function AdminInvitationSettingsPage() {
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const [settings, setSettings] = useState({
    // Email Settings
    emailNotifications: true,
    adminNotifications: true,
    reminderEmails: true,
    
    // Reminder Settings
    reminder24Hours: true,
    reminder6Hours: true,
    defaultExpirationHours: 72,
    
    // Security Settings
    requireEmailVerification: true,
    maxInvitationsPerDay: 100,
    tokenExpirationHours: 168, // 7 days
    
    // UI Settings
    showAdvancedAnalytics: true,
    enableAuditLog: true,
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleSave = () => {
    // Save settings logic here
    showToast('Settings saved successfully', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invitation Settings</h1>
          <p className="text-gray-600 mt-1">Configure invitation system preferences and policies</p>
        </div>
        <Button onClick={handleSave} className="flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Settings */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Mail className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Email Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                  <p className="text-xs text-gray-500">Send emails to invitees</p>
                </div>
                <button
                  onClick={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Admin Notifications</label>
                  <p className="text-xs text-gray-500">Notify admins of invitation events</p>
                </div>
                <button
                  onClick={() => setSettings({...settings, adminNotifications: !settings.adminNotifications})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.adminNotifications ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.adminNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Reminder Emails</label>
                  <p className="text-xs text-gray-500">Send reminders for expiring invitations</p>
                </div>
                <button
                  onClick={() => setSettings({...settings, reminderEmails: !settings.reminderEmails})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.reminderEmails ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.reminderEmails ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reminder Settings */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Reminder Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">24-Hour Reminder</label>
                  <p className="text-xs text-gray-500">Send reminder 24h before expiry</p>
                </div>
                <button
                  onClick={() => setSettings({...settings, reminder24Hours: !settings.reminder24Hours})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.reminder24Hours ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.reminder24Hours ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">6-Hour Reminder</label>
                  <p className="text-xs text-gray-500">Send final reminder 6h before expiry</p>
                </div>
                <button
                  onClick={() => setSettings({...settings, reminder6Hours: !settings.reminder6Hours})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.reminder6Hours ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.reminder6Hours ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Default Expiration</label>
                <p className="text-xs text-gray-500 mb-2">Hours before invitations expire</p>
                <select
                  value={settings.defaultExpirationHours}
                  onChange={(e) => setSettings({...settings, defaultExpirationHours: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value={24}>24 hours</option>
                  <option value={48}>48 hours</option>
                  <option value={72}>72 hours</option>
                  <option value={168}>7 days</option>
                  <option value={336}>14 days</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Verification</label>
                  <p className="text-xs text-gray-500">Require email verification</p>
                </div>
                <button
                  onClick={() => setSettings({...settings, requireEmailVerification: !settings.requireEmailVerification})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.requireEmailVerification ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.requireEmailVerification ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Max Invitations/Day</label>
                <p className="text-xs text-gray-500 mb-2">Per admin user</p>
                <input
                  type="number"
                  value={settings.maxInvitationsPerDay}
                  onChange={(e) => setSettings({...settings, maxInvitationsPerDay: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  min="1"
                  max="1000"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Token Expiration</label>
                <p className="text-xs text-gray-500 mb-2">Hours for invitation tokens</p>
                <select
                  value={settings.tokenExpirationHours}
                  onChange={(e) => setSettings({...settings, tokenExpirationHours: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value={72}>3 days</option>
                  <option value={168}>7 days</option>
                  <option value={336}>14 days</option>
                  <option value={720}>30 days</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Advanced Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Advanced Analytics</label>
              <p className="text-xs text-gray-500">Enable detailed analytics</p>
            </div>
            <button
              onClick={() => setSettings({...settings, showAdvancedAnalytics: !settings.showAdvancedAnalytics})}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.showAdvancedAnalytics ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.showAdvancedAnalytics ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Audit Logging</label>
              <p className="text-xs text-gray-500">Enable comprehensive audit trail</p>
            </div>
            <button
              onClick={() => setSettings({...settings, enableAuditLog: !settings.enableAuditLog})}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.enableAuditLog ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.enableAuditLog ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
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
