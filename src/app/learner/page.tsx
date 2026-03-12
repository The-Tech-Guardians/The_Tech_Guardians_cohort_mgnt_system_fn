"use client";

import { useState, useEffect } from "react";
import { useSidebar } from "@/components/ui/SideBarContext";
import { Users, BookMarked, GraduationCap, Calendar } from "lucide-react";
import { authAPI, tokenManager } from "@/lib/auth";

type User = {
  name: string;
  initials: string;
};

type Course = {
  id: string;
  title: string;
  progress: number;
};

type Cohort = {
  cohortId: string;
  name: string;
  description?: string;
  status: string;
  startDate: string;
  currentStudents: number;
  maxStudents: number;
};

export default function LearnerDashboardPage() {
  const { collapsed } = useSidebar();

  const [user, setUser] = useState<User>({ name: "Loading...", initials: "L" });
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [currentCohort, setCurrentCohort] = useState<Cohort | null>(null);
  const [availableCohorts, setAvailableCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = tokenManager.getUser();

        if (userData) {
          const name =
            userData.firstName || userData.lastName
              ? `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
              : userData.name ||
                userData.email?.split("@")[0] ||
                "User";

          const initials =
            name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase() || "U";

          setUser({ name, initials });
        }

        const coursesRes = await authAPI.getLearnerCourses();
        if (coursesRes?.success) {
          setMyCourses(coursesRes.data || []);
        }

        const cohortRes = await authAPI.getLearnerCohort();
        if (cohortRes?.success) {
          setCurrentCohort(cohortRes.data);
        }

        const availableRes = await authAPI.getAvailableCohorts();
        if (availableRes?.success) {
          setAvailableCohorts(availableRes.data || []);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEnrollCohort = async (cohortId: string) => {
    try {
      setEnrolling(cohortId);

      const response = await authAPI.joinCohort(cohortId);

      if (response?.success) {
        const cohortRes = await authAPI.getLearnerCohort();
        if (cohortRes?.success) {
          setCurrentCohort(cohortRes.data);
        }

        const availableRes = await authAPI.getAvailableCohorts();
        if (availableRes?.success) {
          setAvailableCohorts(availableRes.data || []);
        }
      } else {
        alert(response?.message || "Failed to join cohort");
      }
    } catch (error) {
      console.error("Enroll error:", error);
      alert("Failed to join cohort");
    } finally {
      setEnrolling(null);
    }
  };

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className={`flex gap-5 min-h-full ${collapsed ? "p-4" : ""}`}>
      
      {/* LEFT SECTION */}
      <div className="flex-1 space-y-5">

        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className="w-5 h-5" />
                <span className="text-sm font-medium text-white/80">Enrolled Cohort</span>
              </div>
              <h1 className="text-xl font-black">{currentCohort?.name || 'No Cohort'}</h1>
            </div>
            {currentCohort && (
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>
                    {currentCohort.currentStudents} / {currentCohort.maxStudents} Students
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>
                    {new Date(currentCohort.startDate).toLocaleDateString()} - {new Date(currentCohort.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {myCourses.length > 0 ? (
          <div className="bg-white rounded-xl p-5 border">
            <h2 className="font-bold mb-4">My Courses</h2>

            {myCourses.slice(0, 4).map((course) => (
              <div key={course.id} className="mb-3">
                <p className="text-sm font-semibold">{course.title}</p>

                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className="bg-blue-500 h-2 rounded"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>

                <p className="text-xs text-gray-500">
                  {course.progress}% complete
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl border text-center">
            No courses yet
          </div>
        )}
      </div>

      {/* RIGHT SECTION */}
      <div className="w-[300px] space-y-4">

        <div>
          <h2 className="font-bold text-lg">Hi, {user.name}</h2>
          <p className="text-xs text-gray-500">
            {dayName} · {dateStr}
          </p>
        </div>

        {availableCohorts.length > 0 && (
          <div className="bg-white rounded-xl p-4 border">
            <h3 className="font-bold flex items-center gap-2 mb-3">
              <BookMarked size={14} />
              Available Cohorts
            </h3>

            {availableCohorts.slice(0, 3).map((cohort) => (
              <div
                key={cohort.cohortId}
                className="flex justify-between items-center mb-2"
              >
                <span className="text-sm">{cohort.name}</span>

                <button
                  onClick={() => handleEnrollCohort(cohort.cohortId)}
                  disabled={enrolling === cohort.cohortId}
                  className="text-blue-600 text-sm font-semibold"
                >
                  {enrolling === cohort.cohortId
                    ? "Enrolling..."
                    : "Enroll"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}