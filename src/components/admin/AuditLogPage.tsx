'use client';

import React, { useState, useEffect } from 'react';
import { Filter, Calendar, User, Activity, AlertCircle, CheckCircle, XCircle, Shield, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

interface AuditLog {
  uuid: string;
  actorId: string;
  actorType: 'ADMIN' | 'INSTRUCTOR' | 'LEARNER' | 'SYSTEM';
  actorEmail: string;
  actorName: string;
  action: string;
  entityType: 'USER' | 'COURSE' | 'COHORT' | 'APPLICATION' | 'ANNOUNCEMENT' | 'MODERATION' | 'LESSON' | 'MODULE';
  entityId: string;
  entityName?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  description: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  status: 'SUCCESS' | 'FAILED';
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

interface AuditStats {
  totalActions: number;
  actionsByType: Record<string, number>;
  actionsBySeverity: Record<string, number>;
  topActors: Array<{ actorId: string; actorName: string; count: number }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const SEVERITY_COLORS = {
  INFO: 'bg-blue-100 text-blue-800',
  WARNING: 'bg-yellow-100 text-yellow-800',
  CRITICAL: 'bg-red-100 text-red-800'
};

const STATUS_ICONS = {
  SUCCESS: CheckCircle,
  FAILED: XCircle
};

const ENTITY_ICONS: Record<string, any> = {
  USER: User,
  COURSE: Activity,
  COHORT: Calendar,
  APPLICATION: Shield,
  MODERATION: AlertCircle
};

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [newLogDetected, setNewLogDetected] = useState(false);
  const [filters, setFilters] = useState({
    entityType: '',
    action: '',
    severity: '',
    actorId: ''
  });
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ 
      entityType: '', 
      action: '', 
      severity: '', 
      actorId: '' 
    });
    setCurrentPage(1);
  };

  // Auto-refresh every minute - only fetch new entries
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
        
        // Only fetch the most recent log to check for new entries
        const response = await fetch(`${API_URL}/audit-logs/logs?limit=1&offset=0`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.logs.length > 0) {
            const newLog = data.logs[0];
            
            // Check if this is a new log (different from current first log)
            if (logs.length === 0 || newLog.uuid !== logs[0].uuid) {
              setNewLogDetected(true);
              setTimeout(() => setNewLogDetected(false), 3000); // Reset after 3 seconds
              // Fetch all logs to update the list
              loadLogs();
              loadStats();
            }
          }
        }
      } catch (error) {
        console.error('Error checking for new logs:', error);
      }
    }, 60000); // 1 minute = 60000ms

    return () => clearInterval(interval);
  }, [logs]); // Include logs in dependency to check against current logs

  useEffect(() => {
    loadLogs();
    loadStats();
  }, [currentPage, filters]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      
      const queryParams = new URLSearchParams({
        limit: '20',
        offset: ((currentPage - 1) * 20).toString()
      });

      if (filters.entityType) queryParams.append('entityType', filters.entityType);
      if (filters.action) queryParams.append('action', filters.action);
      if (filters.severity) queryParams.append('severity', filters.severity);
      // Only send actorId if it's explicitly set by the user (not empty string)
      if (filters.actorId && filters.actorId.trim() !== '') {
        queryParams.append('actorId', filters.actorId);
      }

      const response = await fetch(`${API_URL}/audit-logs/logs?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch audit logs');

      const data = await response.json();
      if (data.success) {
        setLogs(data.logs);
        setTotalLogs(data.pagination.total);
        setTotalPages(Math.ceil(data.pagination.total / 20));
      }
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const response = await fetch(
        `${API_URL}/audit-logs/stats?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch audit stats');

      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading audit stats:', error);
    }
  };

  const exportLogs = () => {
    const csvContent = [
      ['Date', 'Actor', 'Action', 'Entity Type', 'Entity', 'Description', 'Severity', 'Status'].join(','),
      ...logs.map(log => [
        new Date(log.createdAt).toLocaleString(),
        log.actorName || log.actorEmail,
        log.action,
        log.entityType,
        log.entityName || log.entityId,
        `"${log.description.replace(/"/g, '""')}"`,
        log.severity,
        log.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

return (
<div className="min-h-screen bg-gray-50 p-6">
<div className="max-w-7xl mx-auto">
{/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        </div>

{/* Stats Cards */}
{stats && (
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
<div className="bg-white rounded-lg shadow p-6">
<div className="flex items-center">
<Activity className="w-8 h-8 text-blue-500 mr-3" />
<div>
<p className="text-sm text-gray-600">Total Actions</p>
<p className="text-2xl font-bold">{stats.totalActions}</p>
</div>
</div>
</div>
<div className="bg-white rounded-lg shadow p-6">
<div className="flex items-center">
<CheckCircle className="w-8 h-8 text-green-500 mr-3" />
<div>
<p className="text-sm text-gray-600">Info Level</p>
<p className="text-2xl font-bold">{stats.actionsBySeverity?.INFO || 0}</p>
</div>
</div>
</div>
<div className="bg-white rounded-lg shadow p-6">
<div className="flex items-center">
<AlertCircle className="w-8 h-8 text-yellow-500 mr-3" />
<div>
<p className="text-sm text-gray-600">Warnings</p>
<p className="text-2xl font-bold">{stats.actionsBySeverity?.WARNING || 0}</p>
</div>
</div>
</div>
<div className="bg-white rounded-lg shadow p-6">
<div className="flex items-center">
<Shield className="w-8 h-8 text-red-500 mr-3" />
<div>
<p className="text-sm text-gray-600">Critical</p>
<p className="text-2xl font-bold">{stats.actionsBySeverity?.CRITICAL || 0}</p>
</div>
</div>
</div>
</div>
)}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {(filters.entityType || filters.action || filters.severity || (filters.actorId && filters.actorId.trim() !== '')) && (
                    <span className="ml-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                      Active
                    </span>
                  )}
                </button>
                {(filters.entityType || filters.action || filters.severity || (filters.actorId && filters.actorId.trim() !== '')) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear filters
                  </button>
                )}
                <button
                  onClick={() => {
                    clearFilters();
                    loadLogs();
                  }}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Show All Logs
                </button>
              </div>
              <button
                onClick={() => {
                  loadLogs();
                  loadStats();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Now
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
                <select
                  value={filters.entityType}
                  onChange={(e) => handleFilterChange('entityType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="USER">User</option>
                  <option value="COURSE">Course</option>
                  <option value="COHORT">Cohort</option>
                  <option value="APPLICATION">Application</option>
                  <option value="MODERATION">Moderation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select
                  value={filters.severity}
                  onChange={(e) => handleFilterChange('severity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Severities</option>
                  <option value="INFO">Info</option>
                  <option value="WARNING">Warning</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                <input
                  type="text"
                  value={filters.action}
                  onChange={(e) => handleFilterChange('action', e.target.value)}
                  placeholder="Filter by action..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Actor ID</label>
                <input
                  type="text"
                  value={filters.actorId}
                  onChange={(e) => handleFilterChange('actorId', e.target.value)}
                  placeholder="Filter by actor..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Logs Terminal */}
        <div className="bg-gray-900 rounded-lg shadow overflow-hidden font-mono text-sm">
          {/* Terminal Header */}
          <div className="bg-gray-800 px-4 py-2 flex items-center justify-end border-b border-gray-700">
            <p className="text-xs text-gray-500">
              Showing {logs.length} of {totalLogs} entries
            </p>
          </div>
          
          {/* Terminal Body */}
          <div className="p-4 min-h-[400px] max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Activity className="w-12 h-12 mb-4" />
                <p className="text-lg">No audit logs found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {logs.map((log, index) => {
                  const timestamp = new Date(log.createdAt).toISOString();
                  const severityColor = {
                    INFO: 'text-blue-400',
                    WARNING: 'text-yellow-400',
                    CRITICAL: 'text-red-400'
                  }[log.severity];
                  
                  const statusColor = log.status === 'SUCCESS' ? 'text-green-400' : 'text-red-400';
                  
                  return (
                    <div key={log.uuid} className="flex items-start gap-2 hover:bg-gray-800 p-2 rounded border-l-2 border-transparent hover:border-green-500">
                      <span className="text-gray-600 select-none w-6 text-right">{index + 1}</span>
                      <span className="text-gray-500 shrink-0">[{new Date(log.createdAt).toLocaleString()}]</span>
                      <span className="text-green-400 font-semibold shrink-0">{log.actorName || log.actorEmail}</span>
                      <span className="text-purple-400 shrink-0">performed</span>
                      <span className="text-yellow-400 font-bold shrink-0">{log.action}</span>
                      <span className="text-gray-400 shrink-0">on</span>
                      <span className="text-orange-400 shrink-0">{log.entityType}:{log.entityName || log.entityId}</span>
                      <span className="text-gray-300 flex-1">- {log.description}</span>
                      <span className={`${severityColor} shrink-0 px-2 py-0.5 rounded bg-gray-800 text-xs`}>[{log.severity}]</span>
                      <span className={`${statusColor} shrink-0`}>[{log.status}]</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalLogs)} of {totalLogs} logs
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  ← Previous
                </button>
                <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-lg">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Indicator */}
        <div className={`fixed bottom-4 right-4 px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors ${
          newLogDetected ? 'bg-orange-500' : 'bg-green-500'
        } text-white`}>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm">
            {newLogDetected ? '🔔 New Activity Detected!' : 'Live'}
          </span>
        </div>
      </div>
    </div>
  );
}
