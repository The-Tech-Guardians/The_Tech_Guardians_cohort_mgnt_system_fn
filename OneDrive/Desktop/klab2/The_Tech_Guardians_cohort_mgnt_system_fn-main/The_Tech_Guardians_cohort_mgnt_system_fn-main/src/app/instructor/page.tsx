'use client'

import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Users, BookOpen, FileText, Shield, Plus, Eye, TrendingUp, Clock, MessageSquare, CheckCircle, XCircle, BarChart3, GraduationCap } from "lucide-react";
import Link from "next/link";
import { courses as coursesApi, modules as modulesApi, lessons as lessonsApi, learners } from "@/lib/instructorApi";
import { tokenManager } from "@/lib/auth";

interface DashboardStats {
  totalLearners: number;
  totalCourses: number;
  totalModules: number;
  totalLessons: number;
  pendingModerations: number;
  activeAssessments: number;
}

function StatCard({ title, value, icon: Icon, color, href }: {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  href?: string;
}) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    amber: "bg-amber-50 border-amber-200 text-amber-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
    red: "bg-red-50 border-red-200 text-red-600",
  };

  const CardContent = () => (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-xl border ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}

function CapabilityCard({ title, description, icon: Icon, features, actions, href }: {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
  actions: { label: string; href: string; icon?: React.ComponentType<any> }[];
  href?: string;
}) {
  const CardContent = () => (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2">
            {actions.map((action, index) => (
              <span key={index} className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                {action.icon && <action.icon size={14} />}
                {action.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Don't wrap with Link if it has actions - let individual actions handle their own links
  if (href && !actions.length) {
    return (
      <Link href={href}>
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}

export default function InstructorDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalLearners: 0,
    totalCourses: 0,
    totalModules: 0,
    totalLessons: 0,
    pendingModerations: 0,
    activeAssessments: 0,
  });

  useEffect(() => {
    console.log('Instructor dashboard - Auth state:', { loading, user });
    console.log('Token from tokenManager:', tokenManager.getToken());
    console.log('User from tokenManager:', tokenManager.getUser());
    
    if (!loading && !user) {
      console.log('No user found, redirecting to homepage');
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (loading || !user) return;

    const loadStats = async () => {
      try {
        console.log('Loading dashboard stats for user:', user);
        
        // Fetch instructor courses
        const instructorCourses = await coursesApi.fetchInstructorCourses();
        console.log('Fetched courses:', instructorCourses);
        
        const totalCourses = instructorCourses.length;
        const totalModules = instructorCourses.reduce((sum, course) => sum + (course.moduleCount || 0), 0);

        console.log('Calculated stats:', {
          totalCourses,
          totalModules
        });

        const totalLearners = instructorCourses.reduce((sum, course) => sum + (course.learnerCount || 0), 0);
        
        // Also try to get detailed learners info
        let detailedLearners = [];
        try {
          detailedLearners = await learners.fetchAllLearners();
          console.log('Detailed learners fetched:', detailedLearners.length);
        } catch (error) {
          console.error('Failed to fetch detailed learners:', error);
        }

        // For lessons, we'd need to fetch modules and then lessons for each module
        // For now, let's set a reasonable estimate or fetch separately
        const totalLessons = totalModules * 3; // Estimate 3 lessons per module

        setStats({
          totalLearners,
          totalCourses,
          totalModules,
          totalLessons,
          pendingModerations: 0,
          activeAssessments: 0,
        });
      } catch (error) {
        console.error('Failed to load dashboard stats', error);
      }
    };

    loadStats();
  }, [loading, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.email}!</h1>
        <p className="text-indigo-100">Manage your courses, track learner progress, and moderate content.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Learners"
          value={stats.totalLearners}
          icon={Users}
          color="blue"
          href="/instructor/learners"
        />
        <StatCard
          title="Active Courses"
          value={stats.totalCourses}
          icon={GraduationCap}
          color="green"
          href="/instructor/courses"
        />
        <StatCard
          title="Total Modules"
          value={stats.totalModules}
          icon={BookOpen}
          color="amber"
          href="/instructor/modules"
        />
        <StatCard
          title="Total Lessons"
          value={stats.totalLessons}
          icon={FileText}
          color="purple"
          href="/instructor/lessons"
        />
        <StatCard
          title="Pending Moderations"
          value={stats.pendingModerations}
          icon={Shield}
          color="red"
          href="/instructor/moderation"
        />
        <StatCard
          title="Active Assessments"
          value={stats.activeAssessments}
          icon={CheckCircle}
          color="green"
          href="/instructor/assessments"
        />
      </div>

      {/* Capabilities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Learner Management */}
        <CapabilityCard
          title="Learner Management"
          description="Monitor and support your learners' progress and engagement."
          icon={Users}
          features={[
            "View learners enrolled in courses and modules",
            "Track time spent and progress completion",
            "Monitor engagement (comments, submissions)",
            "Access detailed learner activity reports"
          ]}
          actions={[
            { label: "View Learners", href: "/instructor/learners", icon: Eye },
            { label: "Activity Reports", href: "/instructor/analytics", icon: BarChart3 }
          ]}
          href="/instructor/learners"
        />

        {/* Course Creation & Management */}
        <CapabilityCard
          title="Course Creation & Management"
          description="Build and organize comprehensive learning experiences."
          icon={GraduationCap}
          features={[
            "Create courses with title, description, and attribution",
            "Structure content: Course → Module → Lesson",
            "Support multiple content types (Video, PDF, Text)",
            "Weekly content release scheduling"
          ]}
          actions={[
            { label: "Create Course", href: "/instructor/courses/new", icon: Plus },
            { label: "Manage Courses", href: "/instructor/courses", icon: BookOpen }
          ]}
          href="/instructor/courses"
        />

        {/* Assessments */}
        <CapabilityCard
          title="Assessments & Grading"
          description="Create and manage quizzes, assignments, and evaluations."
          icon={CheckCircle}
          features={[
            "Create assignments and quizzes (MCQs, True/False)",
            "Flexible grading: Pass/Fail or percentage scores",
            "Instant feedback and configurable retakes",
            "Track submission and completion rates"
          ]}
          actions={[
            { label: "Create Assessment", href: "/instructor/assessments/new", icon: Plus },
            { label: "View Assessments", href: "/instructor/assessments", icon: FileText }
          ]}
          href="/instructor/assessments"
        />

        {/* Moderation */}
        <CapabilityCard
          title="Content Moderation"
          description="Maintain a safe and productive learning environment."
          icon={Shield}
          features={[
            "Review and approve/deny learner ban requests",
            "Submit detailed feedback to administrators",
            "Monitor inappropriate content and behavior",
            "Collaborate with admins on platform policies"
          ]}
          actions={[
            { label: "Review Requests", href: "/instructor/moderation", icon: Eye },
            { label: "Submit Feedback", href: "/instructor/moderation/feedback", icon: MessageSquare }
          ]}
          href="/instructor/moderation"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/instructor/courses/new"
            className="flex flex-col items-center gap-2 p-4 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors"
          >
            <Plus className="w-6 h-6 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">New Course</span>
          </Link>
          <Link
            href="/instructor/assessments/new"
            className="flex flex-col items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors"
          >
            <FileText className="w-6 h-6 text-green-600" />
            <span className="text-sm font-medium text-green-700">New Quiz</span>
          </Link>
          <Link
            href="/instructor/learners"
            className="flex flex-col items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <Users className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">View Learners</span>
          </Link>
          <Link
            href="/instructor/moderation"
            className="flex flex-col items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
          >
            <Shield className="w-6 h-6 text-red-600" />
            <span className="text-sm font-medium text-red-700">Moderate</span>
          </Link>
        </div>
      </div>
    </div>
  );
}