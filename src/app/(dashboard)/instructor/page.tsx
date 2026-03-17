"use client";

import { useState, useEffect } from 'react';
import { Users, GraduationCap, BookOpen, TrendingUp, Activity, Clock, ArrowUp, ArrowDown, Loader2, FileText, Layers, Play } from "lucide-react";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminApi, type DashboardStats } from '@/lib/adminApi';


const COLORS = ['#2563EB', '#06B6D4', '#10B981', '#F59E0B'];

function StatCard({ title, value, icon: Icon, trend, color }: any) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    amber: "bg-amber-50 border-amber-200 text-amber-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-semibold ${
              trend.positive ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.positive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl border ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export default function InstructorDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInstructorStats = async () => {
    try {
      setLoading(true);
      setError(null);
      // Mock instructor-specific stats - replace with real API call
      const instructorStats = {
        totalCourses: 12,
        totalEnrollments: 245,
        activeStudents: 89,
        completionRate: 67,
        avgRating: 4.6,
        newEnrollments: 23,
        lessonsPublished: 156,
        coursesCompleted: 8,
      };
      setStats(instructorStats);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch instructor dashboard stats');
      console.error('Instructor dashboard stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorStats();
  }, []);

  const enrollmentData = [
    { month: 'Jan', enrollments: 12 },
    { month: 'Feb', enrollments: 28 },
    { month: 'Mar', enrollments: 45 },
    { month: 'Apr', enrollments: 67 },
    { month: 'May', enrollments: 89 },
    { month: 'Jun', enrollments: 112 },
  ];

  const ratingData = [
    { name: '5 stars', value: 67 },
    { name: '4 stars', value: 23 },
    { name: '3 stars', value: 8 },
    { name: '2 stars', value: 2 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-200">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchInstructorStats}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard 
          title="Total Courses"
          value={stats?.totalCourses || '0'}
          icon={BookOpen}
          color="blue"
        />
        <StatCard 
          title="Total Students"
          value={stats?.totalEnrollments || '0'}
          icon={Users}
          color="green"
        />
        <StatCard 
          title="Active Students" 
          value={stats?.activeStudents || '0'}
          icon={Activity}
          color="amber"
        />
        <StatCard 
          title="Avg Rating" 
          value={stats?.avgRating ? `${stats.avgRating}/5` : '0'}
          icon={GraduationCap}
          color="purple"
        />
        <StatCard 
          title="Completion Rate" 
          value={`${stats?.completionRate || 0}%`}
          icon={TrendingUp}
          color="blue"
        />
        <StatCard 
          title="New Students"
          value={stats?.newEnrollments || '0'}
          icon={Users}
          color="green"
          trend={{ positive: true, value: "+12.5%" }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Enrollment Trend */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Student Enrollment Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="enrollments" stroke="#2563EB" strokeWidth={3} dot={{ fill: '#2563EB', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Course Ratings</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={ratingData}
                cx="50%"
                cy="50%"
                labelLine={false}
  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {ratingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Review Lessons</h4>
              <p className="text-sm text-gray-500">{stats?.lessonsPublished || 0} lessons published</p>
            </div>
          </div>
          <button className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm">
            Go to Lessons
          </button>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Create Module</h4>
              <p className="text-sm text-gray-500">Organize your content</p>
            </div>
          </div>
          <button className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium text-sm">
            New Module
          </button>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Course Analytics</h4>
              <p className="text-sm text-gray-500">View student progress</p>
            </div>
          </div>
          <button className="w-full px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium text-sm">
            View Analytics
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Student Activity</h3>
        <div className="space-y-3">
          {[
            { student: "Sarah Johnson", action: "completed", target: "Module 3 - React Hooks", time: "2 min ago" },
            { student: "Mike Chen", action: "started", target: "Lesson 4 - State Management", time: "15 min ago" },
            { student: "Emma Rodriguez", action: "submitted", target: "Quiz 2", time: "1 hour ago" },
            { student: "David Kim", action: "completed", target: "Final Project", time: "2 hours ago" },
            { student: "Lisa Wang", action: "watched", target: "Intro Video", time: "3 hours ago" },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-xs">
                    {activity.student.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">{activity.student}</span> {activity.action} <span className="font-semibold text-indigo-600">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-indigo-600 font-medium">
                <Activity size={14} />
                Live
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

