'use client';

import React, { useState, useEffect } from 'react';
import { invitationAuditService, AuditLogEntry, AuditAction, AuditFilter } from '@/services/invitationAuditService';
import Button from '@/components/ui/Button';
import { Search, Filter, Download, Calendar, User, Activity, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';

const ACTION_LABELS: Record<AuditAction, string> = {
  invitation_created: 'Invitation Created',
  invitation_sent: 'Invitation Sent',
  invitation_viewed: 'Invitation Viewed',
  invitation_accepted: 'Invitation Accepted',
  invitation_resend: 'Invitation Resent',
  invitation_cancelled: 'Invitation Cancelled',
  invitation_expired: 'Invitation Expired',
  reminder_sent: 'Reminder Sent',
  reminder_failed: 'Reminder Failed',
  bulk_upload_started: 'Bulk Upload Started',
  bulk_upload_completed: 'Bulk Upload Completed',
  export_downloaded: 'Export Downloaded',
};

const ACTION_COLORS: Record<AuditAction, string> = {
  invitation_created: 'bg-blue-100 text-blue-800',
  invitation_sent: 'bg-green-100 text-green-800',
  invitation_viewed: 'bg-gray-100 text-gray-800',
  invitation_accepted: 'bg-green-100 text-green-800',
  invitation_resend: 'bg-yellow-100 text-yellow-800',
  invitation_cancelled: 'bg-red-100 text-red-800',
  invitation_expired: 'bg-orange-100 text-orange-800',
  reminder_sent: 'bg-purple-100 text-purple-800',
  reminder_failed: 'bg-red-100 text-red-800',
  bulk_upload_started: 'bg-indigo-100 text-indigo-800',
  bulk_upload_completed: 'bg-green-100 text-green-800',
  export_downloaded: 'bg-gray-100 text-gray-800',
};

export default function InvitationAuditLog() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AuditFilter>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLogs();
  }, [currentPage, filters, searchTerm]);

  const loadLogs = () => {
    setLoading(true);
    try {
      const filter = {
        ...filters,
        ...(searchTerm && { search: searchTerm }),
      };
      
      const result = invitationAuditService.getLogs(filter, currentPage, 50);
      setLogs(result.logs);
      setTotalLogs(result.total);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<AuditFilter>) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleExport = () => {
    try {
      const csvContent = invitationAuditService.exportLogs(filters);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export logs:', error);
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  const getActionIcon = (action: AuditAction) => {
    switch (action) {
      case 'invitation_created':
      case 'invitation_sent':
        return <CheckCircle className="w-4 h-4" />;
      case 'invitation_accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'invitation_cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'invitation_expired':
        return <Clock className="w-4 h-4" />;
      case 'reminder_sent':
        return <Activity className="w-4 h-4" />;
      case 'reminder_failed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDetails = (details: Record<string, any>) => {
    return Object.entries(details)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Audit Log</h3>
          <p className="text-sm text-gray-600 mt-1">Complete history of all invitation activities</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search logs by user, invitation ID, or details..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {(filters.action || filters.dateRange || filters.invitationId || filters.success !== undefined) && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Action Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {Object.entries(ACTION_LABELS).map(([action, label]) => (
                  <label key={action} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.action?.includes(action as AuditAction) || false}
                      onChange={(e) => {
                        const currentActions = filters.action || [];
                        if (e.target.checked) {
                          handleFilterChange({
                            action: [...currentActions, action as AuditAction]
                          });
                        } else {
                          handleFilterChange({
                            action: currentActions.filter(a => a !== action)
                          });
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.dateRange?.start || ''}
                  onChange={(e) => {
                    const currentRange = filters.dateRange || { start: '', end: '' };
                    handleFilterChange({
                      dateRange: { ...currentRange, start: e.target.value || '' }
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="date"
                  value={filters.dateRange?.end || ''}
                  onChange={(e) => {
                    const currentRange = filters.dateRange || { start: '', end: '' };
                    handleFilterChange({
                      dateRange: { ...currentRange, end: e.target.value || '' }
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    checked={filters.success === undefined}
                    onChange={() => handleFilterChange({ success: undefined })}
                    className="mr-2"
                  />
                  <span className="text-sm">All</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    checked={filters.success === true}
                    onChange={() => handleFilterChange({ success: true })}
                    className="mr-2"
                  />
                  <span className="text-sm">Successful</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    checked={filters.success === false}
                    onChange={() => handleFilterChange({ success: false })}
                    className="mr-2"
                  />
                  <span className="text-sm">Failed</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Showing {logs.length} of {totalLogs} logs</span>
        <span>Page {currentPage} of {totalPages}</span>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invitation ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Loading audit logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No audit logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${ACTION_COLORS[log.action]}`}>
                          {getActionIcon(log.action)}
                          <span className="ml-1">{ACTION_LABELS[log.action]}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{log.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {log.invitationId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.success ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <div className="flex items-center space-x-1">
                          <XCircle className="w-5 h-5 text-red-500" />
                          {log.errorMessage && (
                            <span className="text-xs text-red-600 max-w-xs truncate" title={log.errorMessage}>
                              {log.errorMessage}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={formatDetails(log.details)}>
                        {formatDetails(log.details)}
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
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                className="px-3 py-1 text-xs"
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outline"
                className="px-3 py-1 text-xs"
              >
                Next
              </Button>
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
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="px-3 py-1 text-xs rounded-l-md"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="px-3 py-1 text-xs rounded-r-md"
                  >
                    Next
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
