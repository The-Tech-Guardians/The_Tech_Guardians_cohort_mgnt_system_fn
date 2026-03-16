'use client';

import { useState, useEffect } from 'react';
import { Users, GraduationCap, BookOpen, TrendingUp, Activity, Clock, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
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

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard stats');
      console.error('Dashboard stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Generate enrollment trend data (mock for now - could be replaced with real data)
  const enrollmentData = [
    { month: 'Jan', enrollments: stats?.totalEnrollments ? Math.floor(stats.totalEnrollments * 0.3) : 0 },
    { month: 'Feb', enrollments: stats?.totalEnrollments ? Math.floor(stats.totalEnrollments * 0.4) : 0 },
    { month: 'Mar', enrollments: stats?.totalEnrollments ? Math.floor(stats.totalEnrollments * 0.5) : 0 },
    { month: 'Apr', enrollments: stats?.totalEnrollments ? Math.floor(stats.totalEnrollments * 0.6) : 0 },
    { month: 'May', enrollments: stats?.totalEnrollments ? Math.floor(stats.totalEnrollments * 0.8) : 0 },
    { month: 'Jun', enrollments: stats?.totalEnrollments ? stats.totalEnrollments : 0 },
  ];

  // Generate course distribution from role data
  const courseData = [
    { name: 'Learners', value: stats?.activeUsers || 0 },
    { name: 'Instructors', value: stats?.instructors || 0 },
    { name: 'Admins', value: stats?.admins || 0 },
  ].filter(item => item.value > 0);

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
          onClick={fetchDashboardStats}
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
          title="Total Enrollments" 
          value={stats?.totalEnrollments.toLocaleString() || '0'}
          icon={Users}
          color="blue"
        />
        <StatCard 
          title="Completion Rate" 
          value={`${stats?.completionRate || 0}%`}
          icon={GraduationCap}
          color="green"
        />
        <StatCard 
          title="Active Users" 
          value={stats?.activeUsers.toLocaleString() || '0'}
          icon={Activity}
          color="amber"
        />
        <StatCard 
          title="Total Courses" 
          value={stats?.totalCourses.toLocaleString() || '0'}
          icon={BookOpen}
          color="purple"
        />
        <StatCard 
          title="Total Cohorts" 
          value={stats?.totalCohorts.toLocaleString() || '0'}
          icon={TrendingUp}
          color="blue"
        />
        <StatCard 
          title="Instructors" 
          value={stats?.instructors.toLocaleString() || '0'}
          icon={Users}
          color="green"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Enrollment Trend */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Enrollment Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
              <Line type="monotone" dataKey="enrollments" stroke="#2563EB" strokeWidth={3} dot={{ fill: '#2563EB', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Distribution */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">User Distribution</h3>
          {courseData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={courseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {courseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { user: "John Doe", action: "enrolled in", target: "Web Development Cohort", time: "2 minutes ago" },
            { user: "Jane Smith", action: "completed", target: "JavaScript Fundamentals", time: "15 minutes ago" },
            { user: "Admin", action: "created", target: "New Python Course", time: "1 hour ago" },
            { user: "Mike Johnson", action: "submitted", target: "Final Project Assignment", time: "2 hours ago" },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">{activity.user}</span> {activity.action} <span className="font-semibold text-blue-600">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
