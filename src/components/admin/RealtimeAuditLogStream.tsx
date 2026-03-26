'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Activity, RefreshCw, Wifi, WifiOff, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';

interface AuditLog {
  id: string;
  actorId: string;
  actorName?: string;
  actorEmail?: string;
  action: string;
  entityType: string;
  entityId: string;
  entityName?: string;
  description: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  status: 'SUCCESS' | 'FAILED';
  createdAt: string;
  ipAddress?: string;
}

export default function RealtimeAuditLogStream() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState({ total: 0, last24Hours: 0 });
  const [showCount, setShowCount] = useState(7);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to show constant motion
  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (logsEndRef.current) {
        logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 3000);

    return () => clearInterval(scrollInterval);
  }, []);

  // Connect to SSE stream
  useEffect(() => {
    const connectStream = () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Close existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const eventSource = new EventSource(`/api/audit-logs/stream?token=${token}`);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        console.log('Audit log stream connected');
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'initial') {
            setLogs(data.logs.reverse()); // Show newest first
          } else if (data.type === 'new') {
            setLogs(prev => [data.log, ...prev].slice(0, 50)); // Keep max 50 logs
          }
        } catch (error) {
          console.error('Failed to parse audit log:', error);
        }
      };

      eventSource.onerror = () => {
        setIsConnected(false);
        eventSource.close();
        // Fallback to polling after 3 seconds
        setTimeout(startPolling, 3000);
      };
    };

    // Polling fallback
    const startPolling = () => {
      const poll = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('/api/audit-logs/recent?limit=20', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok) {
            const data = await response.json();
            setLogs(data.logs);
            setIsConnected(false);
          }
        } catch (error) {
          console.error('Polling failed:', error);
        }
      };

      poll();
      pollingIntervalRef.current = setInterval(poll, 5000); // Poll every 5 seconds
    };

    connectStream();
    fetchStats();

    // Cleanup
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/audit-logs/stats/realtime', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'WARNING':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'INFO':
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const classes = {
      INFO: 'bg-blue-100 text-blue-800',
      WARNING: 'bg-yellow-100 text-yellow-800',
      CRITICAL: 'bg-red-100 text-red-800'
    };
    return classes[severity as keyof typeof classes] || classes.INFO;
  };

  const getStatusBadge = (status: string) => {
    const classes = {
      SUCCESS: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800'
    };
    return classes[status as keyof typeof classes] || classes.SUCCESS;
  };

  const displayedLogs = logs.slice(0, showCount);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-indigo-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-800">Real-time Audit Log Stream</h2>
            <p className="text-sm text-gray-500">
              Showing {Math.min(displayedLogs.length, showCount)} of {logs.length} entries
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">Live</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Polling</span>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="px-3 py-1 bg-gray-100 rounded-full">
              <span className="text-gray-600">Total: </span>
              <span className="font-semibold text-gray-800">{stats.total}</span>
            </div>
            <div className="px-3 py-1 bg-indigo-100 rounded-full">
              <span className="text-indigo-600">24h: </span>
              <span className="font-semibold text-indigo-800">{stats.last24Hours}</span>
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => window.location.reload()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Log Entries - Constant Motion Display */}
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
          {displayedLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No audit logs available</p>
            </div>
          ) : (
            displayedLogs.map((log, index) => (
              <div
                key={log.id}
                className={`p-4 rounded-lg border-l-4 transition-all duration-500 ${
                  index === 0 ? 'animate-pulse bg-gray-800 border-l-indigo-500' : 'bg-gray-800 border-l-gray-600'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Timestamp */}
                <div className="text-xs text-gray-400 mb-2 font-mono">
                  [{formatDate(log.createdAt)}]
                </div>

                {/* Actor Info */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-white">
                    {log.actorName || log.actorEmail || 'Unknown User'}
                  </span>
                  <span className="text-gray-500 text-sm">performed</span>
                  <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs rounded font-medium">
                    {log.action}
                  </span>
                  <span className="text-gray-500 text-sm">on</span>
                  <span className="text-sm text-gray-300">
                    {log.entityType}:{log.entityName || log.entityId}
                  </span>
                </div>

                {/* Description */}
                <div className="text-sm text-gray-400 mb-2 pl-2 border-l-2 border-gray-700">
                  - {log.description}
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${getSeverityBadge(log.severity)}`}>
                    {getSeverityIcon(log.severity)}
                    [{log.severity}]
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${getStatusBadge(log.status)}`}>
                    {getStatusIcon(log.status)}
                    [{log.status}]
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>

        {/* Footer Controls */}
        <div className="p-3 bg-gray-800 border-t border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Show entries:</span>
            <select
              value={showCount}
              onChange={(e) => setShowCount(Number(e.target.value))}
              className="bg-gray-700 text-white text-xs rounded px-2 py-1 border border-gray-600"
            >
              <option value={5}>5</option>
              <option value={7}>7</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          
          <div className="text-xs text-gray-500">
            Auto-refreshing every {isConnected ? 'real-time' : '5 seconds'}
          </div>
        </div>
      </div>
    </div>
  );
}
