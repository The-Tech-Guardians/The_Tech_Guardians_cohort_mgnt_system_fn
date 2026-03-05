'use client';

import { Users, GraduationCap, BookOpen, TrendingUp, Activity, Clock, ArrowUp, ArrowDown } from "lucide-react";
import {LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const enrollmentData = [
  { month: 'Jan', enrollments: 120 },
  { month: 'Feb', enrollments: 180 },
  { month: 'Mar', enrollments: 150 },
  { month: 'Apr', enrollments: 220 },
  { month: 'May', enrollments: 280 },
  { month: 'Jun', enrollments: 320 },
];

const courseData = [
  { name: 'Web Dev', value: 450 },
  { name: 'Python', value: 320 },
  { name: 'Data Science', value: 280 },
  { name: 'Design', value: 180 },
];

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
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
          color="purple"
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
          color="blue"
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

        {/* Course Distribution */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Course Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={courseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
