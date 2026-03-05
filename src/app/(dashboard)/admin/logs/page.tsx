'use client';

import { useState } from "react";
import { FileText, Filter, Search } from "lucide-react";

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
    { id: 1, timestamp: "2024-03-20 14:32:15", user: "Admin User", action: "Promoted user to Admin", category: "role_change", details: "Jane Smith promoted from Instructor to Admin", ipAddress: "192.168.1.100" },
    { id: 2, timestamp: "2024-03-20 13:15:42", user: "Admin User", action: "Banned user", category: "ban", details: "Bad Actor banned for inappropriate conduct", ipAddress: "192.168.1.100" },
    { id: 3, timestamp: "2024-03-20 11:20:30", user: "Instructor Smith", action: "Published course", category: "course", details: "Web Development Fundamentals published", ipAddress: "192.168.1.105" },
    { id: 4, timestamp: "2024-03-20 10:05:18", user: "Admin User", action: "Created cohort", category: "cohort", details: "Web Dev Cohort Q1 2024 created", ipAddress: "192.168.1.100" },
    { id: 5, timestamp: "2024-03-20 09:45:22", user: "Admin User", action: "Updated feature flag", category: "system", details: "Enabled 'advancedAnalytics' feature flag", ipAddress: "192.168.1.100" },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = logs.filter(log => {
    const matchesCategory = selectedCategory === "all" || log.category === selectedCategory;
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      role_change: "bg-blue-50 text-blue-600 border-blue-200",
      ban: "bg-red-50 text-red-600 border-red-200",
      course: "bg-green-50 text-green-600 border-green-200",
      cohort: "bg-purple-50 text-purple-600 border-purple-200",
      system: "bg-amber-50 text-amber-600 border-amber-200",
    };
    return colors[category as keyof typeof colors] || colors.system;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex gap-2">
            {[
              { value: "all", label: "All" },
              { value: "role_change", label: "Roles" },
              { value: "ban", label: "Bans" },
              { value: "course", label: "Courses" },
              { value: "cohort", label: "Cohorts" },
              { value: "system", label: "System" },
            ].map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
                  selectedCategory === category.value
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
          />
        </div>
      </div>

      {/* Audit Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-1">Audit Trail</h3>
            <p className="text-xs text-blue-700">
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
          { label: "Role Changes", value: logs.filter(l => l.category === "role_change").length },
          { label: "Bans", value: logs.filter(l => l.category === "ban").length },
          { label: "Course Actions", value: logs.filter(l => l.category === "course").length },
          { label: "Cohort Actions", value: logs.filter(l => l.category === "cohort").length },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Logs */}
      <div className="space-y-3">
        {filteredLogs.map((log) => (
          <div key={log.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getCategoryColor(log.category)}`}>
                    {log.category.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-bold text-gray-900">{log.action}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>By: {log.user}</span>
                  <span>•</span>
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                  <span>•</span>
                  <span className="font-mono">{log.ipAddress}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
