"use client";

import { useState, useEffect } from "react";
import { BookOpen, CheckCircle, Clock, Award } from "lucide-react";
import { useSidebar } from "../layout";
import { authAPI } from "@/lib/auth";

export default function ProgressPage() {
  const { collapsed } = useSidebar();
  const [stats, setStats] = useState({
    lessonsCompleted: 0,
    totalLessons: 12,
    assignmentsDone: 0,
    totalAssignments: 4,
    hoursLearned: 0,
    averageScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        // Fetch real progress data from API
        const response = await authAPI.getLearnerCourses();
        if (response.success && response.data) {
          // Calculate stats from real course data
          let totalLessons = 0;
          let completedLessons = 0;
          let totalHours = 0;
          let totalScore = 0;
          let courseCount = 0;

          response.data.forEach((course: any) => {
            totalLessons += course.totalLessons || 0;
            completedLessons += Math.floor((course.progress || 0) * (course.totalLessons || 0) / 100);
            totalHours += course.hoursSpent || 0;
            if (course.averageScore) {
              totalScore += course.averageScore;
              courseCount++;
            }
          });

          setStats({
            lessonsCompleted: completedLessons,
            totalLessons: totalLessons,
            assignmentsDone: 0, // Will be calculated when assignment data is available
            totalAssignments: 0,
            hoursLearned: totalHours,
            averageScore: courseCount > 0 ? Math.round(totalScore / courseCount) : 0
          });
        }
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  const statCards = [
    {
      label: "Lessons Completed",
      value: stats.lessonsCompleted.toString(),
      total: stats.totalLessons.toString(),
      icon: BookOpen,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Assignments Done",
      value: stats.assignmentsDone.toString(),
      total: stats.totalAssignments.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Hours Learned",
      value: stats.hoursLearned.toString(),
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Average Score",
      value: `${stats.averageScore}%`,
      icon: Award,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  if (loading) {
    return (
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${collapsed ? 'mx-4' : 'max-w-6xl mx-auto'}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Progress</h1>
            <p className="text-sm text-gray-500 mt-1">Loading your progress...</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse">
                <div className="h-12 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`flex-1 overflow-y-auto transition-all duration-300 ${collapsed ? 'mx-4' : 'max-w-6xl mx-auto'}`}>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Progress</h1>
          <p className="text-sm text-gray-500 mt-1">Track your learning journey</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  {stat.total && stat.total !== '0' && (
                    <p className="text-sm text-gray-400">/ {stat.total}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-gray-400 text-lg font-semibold mb-2">Progress Details</div>
          <p className="text-gray-500 text-sm">Detailed progress tracking will be available soon.</p>
        </div>
      </div>
    </main>
  );
}
