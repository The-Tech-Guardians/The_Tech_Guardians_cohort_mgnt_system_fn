"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Clock, 
  Award, 
  BarChart3, 
  PieChart, 
  Activity,
  Calendar,
  Download,
  Filter,
  ArrowUp,
  ArrowDown,
  Loader2
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart
} from 'recharts';
import { instructorApi } from "@/lib/instructorApi";

const COLORS = ['#2563EB', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'amber' | 'purple' | 'red';
}

function AnalyticsCard({ title, value, change, changeLabel, icon: Icon, color }: AnalyticsCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    amber: "bg-amber-50 border-amber-200 text-amber-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
    red: "bg-red-50 border-red-200 text-red-600",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {change !== undefined && changeLabel && (
            <div className={`flex items-center gap-1 text-xs font-semibold ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              <span>{Math.abs(change)}% {changeLabel}</span>
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

export default function InstructorAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [learners, setLearners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // Fetch basic stats
        const statsData = await instructorApi.getDashboardStats();
        setStats(statsData);
        
        // Fetch courses for filtering
        try {
          const coursesData = await instructorApi.getInstructorCourses();
          setCourses(coursesData);
        } catch (error) {
          setCourses([]);
        }
        
        // Fetch learner data (mock for now since endpoint doesn't exist)
        // This would be replaced with actual API call when available
        setLearners([]);
        
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
        setStats({
          totalCourses: 0,
          totalEnrollments: 0,
          activeStudents: 0,
          completionRate: 0,
          avgRating: 0,
          newEnrollments: 0,
          lessonsPublished: 0,
          coursesCompleted: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [timeRange, selectedCourse]);

  // Generate mock data for charts (replace with real data when API is available)
  const enrollmentData = stats && stats.totalEnrollments > 0 ? [
    { month: 'Jan', enrollments: Math.floor(stats.totalEnrollments * 0.1), completions: Math.floor(stats.totalEnrollments * 0.05) },
    { month: 'Feb', enrollments: Math.floor(stats.totalEnrollments * 0.2), completions: Math.floor(stats.totalEnrollments * 0.1) },
    { month: 'Mar', enrollments: Math.floor(stats.totalEnrollments * 0.3), completions: Math.floor(stats.totalEnrollments * 0.2) },
    { month: 'Apr', enrollments: Math.floor(stats.totalEnrollments * 0.5), completions: Math.floor(stats.totalEnrollments * 0.3) },
    { month: 'May', enrollments: Math.floor(stats.totalEnrollments * 0.7), completions: Math.floor(stats.totalEnrollments * 0.4) },
    { month: 'Jun', enrollments: stats.totalEnrollments, completions: Math.floor(stats.totalEnrollments * 0.5) },
  ] : [];

  const coursePerformanceData = courses.slice(0, 5).map(course => ({
    name: course.title?.substring(0, 20) || 'Unknown',
    enrollments: course.enrolled || 0,
    completion: course.completion || 0,
    rating: course.avgRating || 0,
  }));

  const ratingDistribution = stats && stats.avgRating > 0 ? [
    { name: '5 Stars', value: Math.floor(stats.avgRating * 20), count: Math.floor(stats.totalEnrollments * 0.4) },
    { name: '4 Stars', value: Math.floor(stats.avgRating * 15), count: Math.floor(stats.totalEnrollments * 0.3) },
    { name: '3 Stars', value: Math.floor(stats.avgRating * 10), count: Math.floor(stats.totalEnrollments * 0.2) },
    { name: '2 Stars', value: Math.floor(stats.avgRating * 5), count: Math.floor(stats.totalEnrollments * 0.08) },
    { name: '1 Star', value: Math.floor((5 - stats.avgRating) * 5), count: Math.floor(stats.totalEnrollments * 0.02) },
  ] : [];

  const engagementData = [
    { day: 'Mon', engagement: 65, completion: 45 },
    { day: 'Tue', engagement: 78, completion: 52 },
    { day: 'Wed', engagement: 82, completion: 58 },
    { day: 'Thu', engagement: 75, completion: 48 },
    { day: 'Fri', engagement: 70, completion: 42 },
    { day: 'Sat', engagement: 55, completion: 35 },
    { day: 'Sun', engagement: 48, completion: 30 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <span className="text-gray-600">Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Track your course performance and student engagement</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Enrollments"
          value={stats?.totalEnrollments || 0}
          icon={Users}
          color="blue"
        />
        <AnalyticsCard
          title="Completion Rate"
          value={`${stats?.completionRate || 0}%`}
          icon={Award}
          color="green"
        />
        <AnalyticsCard
          title="Active Students"
          value={stats?.activeStudents || 0}
          icon={Activity}
          color="amber"
        />
        <AnalyticsCard
          title="Average Rating"
          value={stats?.avgRating ? `${stats.avgRating}/5` : '0/5'}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Enrollment vs Completion Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Area type="monotone" dataKey="enrollments" stackId="1" stroke="#2563EB" fill="#2563EB" fillOpacity={0.6} />
              <Area type="monotone" dataKey="completions" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Course Performance */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Course Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={coursePerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Bar dataKey="enrollments" fill="#2563EB" />
              <Bar dataKey="completion" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating Distribution */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={ratingDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {ratingDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Engagement */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Engagement</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Line type="monotone" dataKey="engagement" stroke="#2563EB" strokeWidth={2} dot={{ fill: '#2563EB', r: 4 }} />
              <Line type="monotone" dataKey="completion" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Courses */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performing Courses</h3>
          <div className="space-y-3">
            {courses.slice(0, 5).map((course, index) => (
              <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                      {course.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {course.enrolled || 0} enrolled
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {course.completion || 0}%
                  </p>
                  <p className="text-xs text-gray-500">completion</p>
                </div>
              </div>
            ))}
            {courses.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No courses available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
