'use client';

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import { Users, GraduationCap, BookOpen, TrendingUp, Activity, Clock } from "lucide-react";

export default function AdminDashboard() {
  const [featureFlags, setFeatureFlags] = useState({
    newUI: true,
    betaCourse: false,
    advancedAnalytics: true,
    aiAssistant: false,
  });

  const toggleFlag = (key: string) => {
    setFeatureFlags(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Analytics Dashboard" 
        subtitle="Overview of platform metrics and system health"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Enrollments" 
          value="1,243" 
          icon={Users}
          trend={{ value: "12% from last month", positive: true }}
          color="blue"
        />
        <StatCard 
          title="Completion Rate" 
          value="72%" 
          icon={GraduationCap}
          trend={{ value: "5% from last month", positive: true }}
          color="green"
        />
        <StatCard 
          title="Active Users" 
          value="389" 
          icon={Activity}
          trend={{ value: "8% from last week", positive: true }}
          color="amber"
        />
        <StatCard 
          title="Total Courses" 
          value="24" 
          icon={BookOpen}
          color="blue"
        />
        <StatCard 
          title="Avg. Time Spent" 
          value="4.2h" 
          icon={Clock}
          trend={{ value: "0.5h from last week", positive: true }}
          color="green"
        />
        <StatCard 
          title="Engagement Rate" 
          value="85%" 
          icon={TrendingUp}
          trend={{ value: "3% from last month", positive: true }}
          color="amber"
        />
      </div>

      {/* Feature Flags */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Feature Flags</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(featureFlags).map(([key, enabled]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <button
                onClick={() => toggleFlag(key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white ${
                  enabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { user: "John Doe", action: "enrolled in", target: "Web Development Cohort", time: "2 minutes ago" },
            { user: "Jane Smith", action: "completed", target: "JavaScript Fundamentals", time: "15 minutes ago" },
            { user: "Admin", action: "created", target: "New Python Course", time: "1 hour ago" },
            { user: "Mike Johnson", action: "submitted", target: "Final Project Assignment", time: "2 hours ago" },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">{activity.user}</span> {activity.action} <span className="font-medium text-blue-600">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
