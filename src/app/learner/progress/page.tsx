import CouserPregress from "@/components/learner/progress/CoursePregress";
import RecentActivity from "@/components/learner/progress/RecentActivity";
import WeeklyLearningTime from "@/components/learner/progress/WeeklyLearningTime";
import { BookOpen, CheckCircle, Clock, Award, TrendingUp } from "lucide-react";

export default function ProgressPage() {
  const stats = [
    {
      label: "Lessons Completed",
      value: "17",
      total: "48",
      icon: BookOpen,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Assignments Done",
      value: "3",
      total: "8",
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Hours Learned",
      value: "47",
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Average Score",
      value: "85%",
      icon: Award,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <main className="  flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Progress</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-lg border border-gray-200 p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  {stat.total && (
                    <p className="text-sm text-gray-400">/ {stat.total}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className=" grid grid-cols-2 gap-6 mb-8">
          <div>
            <CouserPregress />
          </div>
          <div>
            <RecentActivity />
          </div>
          
        </div>
        <div>
            <WeeklyLearningTime />
          </div>
      </div>
    </main>
  );
}
