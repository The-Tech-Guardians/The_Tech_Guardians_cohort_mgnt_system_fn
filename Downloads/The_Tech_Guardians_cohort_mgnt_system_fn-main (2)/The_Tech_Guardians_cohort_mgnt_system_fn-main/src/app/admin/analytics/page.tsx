'use client';

import { TrendingUp, Users, BookOpen, Clock, Activity } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of platform metrics and system health</p>
      </div>

      {/* USER INFO - PLAIN TEXT, NO CARD, NO AVATAR, NO DOT */}
      <div>
        <p className="font-bold text-gray-900">Admin User</p>
        <p className="text-sm text-gray-500">2FA Enabled</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4">
        {/* Total Enrollments */}
        <div className="border border-gray-200 rounded-xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Enrollments</p>
              <p className="text-2xl font-bold text-gray-900">1,243</p>
            </div>
          </div>
          <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">↑ 12%</span>
        </div>

        {/* Completion Rate */}
        <div className="border border-gray-200 rounded-xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">72%</p>
            </div>
          </div>
          <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">↑ 5%</span>
        </div>

        {/* Active Users */}
        <div className="border border-gray-200 rounded-xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">389</p>
            </div>
          </div>
          <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">↑ 8%</span>
        </div>
      </div>
    </div>
  );
}