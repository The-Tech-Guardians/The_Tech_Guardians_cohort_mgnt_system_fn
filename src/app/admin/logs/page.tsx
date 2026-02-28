'use client';

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable from "@/components/admin/DataTable";
import { FileText, Filter } from "lucide-react";

interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  category: "role_change" | "ban" | "course" | "cohort" | "system";
  details: string;
  ipAddress: string;
}

export default function AuditLogsPage() {
  const [logs] = useState<AuditLog[]>([
    {
      id: 1,
      timestamp: "2024-03-20 14:32:15",
      user: "Admin User",
      action: "Promoted user to Admin",
      category: "role_change",
      details: "Jane Smith promoted from Instructor to Admin",
      ipAddress: "192.168.1.100",
    },
    {
      id: 2,
      timestamp: "2024-03-20 13:15:42",
      user: "Admin User",
      action: "Banned user",
      category: "ban",
      details: "Bad Actor banned for inappropriate conduct",
      ipAddress: "192.168.1.100",
    },
    {
      id: 3,
      timestamp: "2024-03-20 11:20:30",
      user: "Instructor Smith",
      action: "Published course",
      category: "course",
      details: "Web Development Fundamentals published",
      ipAddress: "192.168.1.105",
    },
    {
      id: 4,
      timestamp: "2024-03-20 10:05:18",
      user: "Admin User",
      action: "Created cohort",
      category: "cohort",
      details: "Web Dev Cohort Q1 2024 created",
      ipAddress: "192.168.1.100",
    },
    {
      id: 5,
      timestamp: "2024-03-20 09:45:22",
      user: "Admin User",
      action: "Updated feature flag",
      category: "system",
      details: "Enabled 'advancedAnalytics' feature flag",
      ipAddress: "192.168.1.100",
    },
    {
      id: 6,
      timestamp: "2024-03-19 16:30:45",
      user: "Instructor Jones",
      action: "Requested learner ban",
      category: "ban",
      details: "Ban request for John Problem - plagiarism",
      ipAddress: "192.168.1.110",
    },
    {
      id: 7,
      timestamp: "2024-03-19 14:22:10",
      user: "Admin User",
      action: "Invited instructor",
      category: "role_change",
      details: "Invitation sent to newteacher@example.com",
      ipAddress: "192.168.1.100",
    },
    {
      id: 8,
      timestamp: "2024-03-19 11:15:33",
      user: "Admin User",
      action: "Modified cohort",
      category: "cohort",
      details: "Extended enrollment deadline for Python Bootcamp",
      ipAddress: "192.168.1.100",
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredLogs = selectedCategory === "all" 
    ? logs 
    : logs.filter(log => log.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors = {
      role_change: "bg-blue-600/20 text-blue-400 border-blue-500/30",
      ban: "bg-red-600/20 text-red-400 border-red-500/30",
      course: "bg-green-600/20 text-green-400 border-green-500/30",
      cohort: "bg-purple-600/20 text-purple-400 border-purple-500/30",
      system: "bg-amber-600/20 text-amber-400 border-amber-500/30",
    };
    return colors[category as keyof typeof colors] || colors.system;
  };

  const columns = [
    {
      key: "timestamp",
      label: "Timestamp",
      render: (log: AuditLog) => (
        <div className="text-xs">
          <p className="text-white font-medium">{new Date(log.timestamp).toLocaleDateString()}</p>
          <p className="text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</p>
        </div>
      ),
    },
    {
      key: "user",
      label: "User",
      render: (log: AuditLog) => (
        <span className="text-sm text-gray-300 font-medium">{log.user}</span>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (log: AuditLog) => (
        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getCategoryColor(log.category)}`}>
          {log.category.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (log: AuditLog) => (
        <span className="text-sm text-white font-medium">{log.action}</span>
      ),
    },
    {
      key: "details",
      label: "Details",
      render: (log: AuditLog) => (
        <span className="text-sm text-gray-400">{log.details}</span>
      ),
    },
    {
      key: "ipAddress",
      label: "IP Address",
      render: (log: AuditLog) => (
        <span className="text-xs text-gray-500 font-mono">{log.ipAddress}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Audit Logs" 
        subtitle="Track all system changes and administrative actions"
      />

      {/* Filter Section */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">Filter by category:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: "all", label: "All" },
              { value: "role_change", label: "Role Changes" },
              { value: "ban", label: "Bans" },
              { value: "course", label: "Courses" },
              { value: "cohort", label: "Cohorts" },
              { value: "system", label: "System" },
            ].map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  selectedCategory === category.value
                    ? "bg-blue-600 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Info */}
      <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-400 mb-1">Audit Trail</h3>
            <p className="text-xs text-blue-300/80">
              All administrative actions are logged with timestamp, user, IP address, and details. 
              Logs are immutable and retained for compliance purposes.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Logs", value: logs.length, color: "blue" },
          { label: "Role Changes", value: logs.filter(l => l.category === "role_change").length, color: "blue" },
          { label: "Bans", value: logs.filter(l => l.category === "ban").length, color: "red" },
          { label: "Course Actions", value: logs.filter(l => l.category === "course").length, color: "green" },
          { label: "Cohort Actions", value: logs.filter(l => l.category === "cohort").length, color: "purple" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Logs Table */}
      <DataTable 
        columns={columns} 
        data={filteredLogs}
        searchPlaceholder="Search logs by user, action, or details..."
      />
    </div>
  );
}
