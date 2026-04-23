"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSidebar } from "@/components/ui/SideBarContext";
import { useTranslation } from "@/components/i18n/LanguageProvider";
import { Users, BookMarked, GraduationCap, Calendar, CheckCircle } from "lucide-react";
import { authAPI, tokenManager } from "@/lib/auth";
import { cohortService } from "@/services/cohortService";
import { courseService } from "@/services/courseService";

type User = {
  name: string;
  initials: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

type Course = {
  id: string;
  title: string;
  progress: number;
};

type LearnerCourseApiItem = {
  id?: string;
  courseId?: string;
  _id?: string;
  title?: string;
  cohortId?: string;
  isPublished?: boolean;
};

const getLearnerCourseId = (course: LearnerCourseApiItem) =>
  course.courseId || course.id || course._id || "";

type Cohort = {
  cohortId: string;
  name: string;
  description?: string;
  status: string;
  startDate: string;
  currentStudents: number;
  maxStudents: number;
  isActive?: boolean;
  enrollmentOpenDate?: string;
  enrollmentCloseDate?: string;
  extensionDate?: string;
};

const getCohortId = (cohort: Partial<Cohort> & { id?: string }) =>
  cohort.cohortId || cohort.id || "";

const getEndOfDay = (value: string) => {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
};

const isEnrollmentAvailable = (cohort: Partial<Cohort>) => {
  if (cohort.isActive === false) return false;

  const now = new Date();
  const openDate = cohort.enrollmentOpenDate ? new Date(cohort.enrollmentOpenDate) : null;
  const closeSource = cohort.extensionDate || cohort.enrollmentCloseDate;
  const closeDate = closeSource ? getEndOfDay(closeSource) : null;

  if (openDate && now < openDate) return false;
  if (closeDate && now > closeDate) return false;

  return true;
};

const normalizeAvailableCohorts = (cohorts: Array<Partial<Cohort> & { id?: string }>, enrolledCohortId?: string | null) =>
  cohorts
    .map((cohort) => ({
      ...cohort,
      cohortId: getCohortId(cohort),
      currentStudents: Number(cohort.currentStudents ?? 0),
      maxStudents: Number(cohort.maxStudents ?? 0),
      status: cohort.status || "upcoming",
    }))
    .filter((cohort): cohort is Cohort => Boolean(cohort.cohortId && cohort.name && isEnrollmentAvailable(cohort)))
    .filter((cohort) => cohort.cohortId !== enrolledCohortId);

export default function LearnerDashboardPage() {
  const { collapsed } = useSidebar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const [user, setUser] = useState<User>({ name: "Loading...", initials: "L" });
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [currentCohort, setCurrentCohort] = useState<Cohort | null>(null);
  const [availableCohorts, setAvailableCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);

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

        const coursesRes = await authAPI.getLearnerCohortCourses();
        const cohortRes = await authAPI.getLearnerCohort();
        console.log('Cohort API response:', cohortRes); // Debug
        let enrolledCohortId: string | null = null;
        if (cohortRes?.success && cohortRes.data !== null) {
          setCurrentCohort(cohortRes.data as Cohort);
          enrolledCohortId = (cohortRes.data as Partial<Cohort> & { id?: string }).cohortId || (cohortRes.data as { id?: string }).id || null;
        }

        console.log('Courses API response:', coursesRes); // Debug
        const cohortCourses = coursesRes?.success && Array.isArray(coursesRes.data)
          ? coursesRes.data as LearnerCourseApiItem[]
          : [];
        const allCoursesRes = await courseService.getAllCourses(1, 100);
        const exactCohortCourses = allCoursesRes.courses.filter((course) => {
          if (course.isPublished === false) return false;
          if (!enrolledCohortId) return false;
          return course.cohortId === enrolledCohortId;
        });

        const mergedCourseMap = new Map<string, LearnerCourseApiItem>();
        [...cohortCourses, ...exactCohortCourses].forEach((course) => {
          const courseId = getLearnerCourseId(course);
          if (!courseId) return;
          mergedCourseMap.set(courseId, { ...mergedCourseMap.get(courseId), ...course });
        });

        setMyCourses(
          Array.from(mergedCourseMap.values()).map((course) => ({
            id: getLearnerCourseId(course),
            title: course.title || 'Untitled Course',
            progress: 0,
          }))
        );

        const [availableRes, allCohortsRes] = await Promise.all([
          authAPI.getAvailableCohorts(),
          cohortService.getAllCohorts(1, 50),
        ]);

        const normalizedFromAvailable = availableRes?.success
          ? normalizeAvailableCohorts(availableRes.data || [], enrolledCohortId)
          : [];
        const normalizedFromAll = normalizeAvailableCohorts(allCohortsRes.cohorts || [], enrolledCohortId);

        const cohortMap = new Map<string, Cohort>();
        [...normalizedFromAvailable, ...normalizedFromAll].forEach((cohort) => {
          cohortMap.set(cohort.cohortId, cohort);
        });

        setAvailableCohorts(Array.from(cohortMap.values()));
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check for approved parameter and show congratulations modal
  useEffect(() => {
    const approved = searchParams.get('approved');
    if (approved === 'true') {
      setShowCongrats(true);
      // Hide the congrats message after 10 seconds or when user interacts
      const timer = setTimeout(() => {
        setShowCongrats(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleContinueToDashboard = () => {
    setShowCongrats(false);
    // Clean up the URL
    router.replace('/learner', { scroll: false });
  };

  const handleEnrollCohort = async (cohortId: string) => {
    try {
      setEnrolling(cohortId);

      const response = await authAPI.joinCohort(cohortId);

      if (response?.success) {
        const cohortRes = await authAPI.getLearnerCohort();
        let enrolledCohortId: string | null = cohortId;
        if (cohortRes?.success && cohortRes.data !== null) {
          setCurrentCohort(cohortRes.data as Cohort);
          enrolledCohortId = (cohortRes.data as Partial<Cohort> & { id?: string }).cohortId || (cohortRes.data as { id?: string }).id || cohortId;
        }

        const [availableRes, allCohortsRes] = await Promise.all([
          authAPI.getAvailableCohorts(),
          cohortService.getAllCohorts(1, 50),
        ]);

        const normalizedFromAvailable = availableRes?.success
          ? normalizeAvailableCohorts(availableRes.data || [], enrolledCohortId)
          : [];
        const normalizedFromAll = normalizeAvailableCohorts(allCohortsRes.cohorts || [], enrolledCohortId);

        const cohortMap = new Map<string, Cohort>();
        [...normalizedFromAvailable, ...normalizedFromAll].forEach((cohort) => {
          cohortMap.set(cohort.cohortId, cohort);
        });

        setAvailableCohorts(Array.from(cohortMap.values()));
      } else {
        alert(response?.message || t("learner.dashboard.joinFailed"));
      }
    } catch (error) {
      console.error("Enroll error:", error);
      alert(t("learner.dashboard.joinFailed"));
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
        <p>{t("learner.dashboard.loading")}</p>
      </div>
    );
  }

  return (
    <>
      {/* Congratulations Modal */}
      {showCongrats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("learner.dashboard.congratsTitle")}
              </h2>
              <p className="text-gray-600 mb-6">
                {t("learner.dashboard.congratsBody")}
              </p>
            </div>
            
            <button
              onClick={handleContinueToDashboard}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {t("learner.dashboard.continue")}
            </button>
          </div>
        </div>
      )}

      <div className={`flex gap-5 min-h-full ${collapsed ? "p-4" : ""}`}>
      
      {/* LEFT SECTION */}
      <div className="flex-1 space-y-5">

        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className="w-5 h-5" />
                <span className="text-sm font-medium text-white/80">{t("learner.dashboard.enrolledCohort")}</span>
              </div>
              <h1 className="text-xl font-black">{currentCohort?.name || t("learner.dashboard.noCohort")}</h1>
            </div>
            {currentCohort && (
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>
                    {t("learner.dashboard.students", { current: currentCohort.currentStudents, max: currentCohort.maxStudents })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                <span>
                  {new Date(currentCohort!.startDate).toLocaleDateString()} - {new Date(currentCohort!.startDate).toLocaleDateString()}
                </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {myCourses.length > 0 ? (
          <div className="bg-white rounded-xl p-5 border">
            <h2 className="font-bold mb-4">{t("learner.dashboard.myCourses")}</h2>

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
                  {t("learner.dashboard.complete", { progress: course.progress })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl border text-center">
            {t("learner.dashboard.noCourses")}
          </div>
        )}
      </div>

      {/* RIGHT SECTION */}
      <div className="w-[300px] space-y-4">

        <div>
          <h2 className="font-bold text-lg">{t("learner.dashboard.hi", { name: user.name })}</h2>
          <p className="text-xs text-gray-500">
            {dayName} · {dateStr}
          </p>
        </div>

        {availableCohorts.length > 0 && (
          <div className="bg-white rounded-xl p-4 border">
            <h3 className="font-bold flex items-center gap-2 mb-3">
              <BookMarked size={14} />
              {t("learner.dashboard.availableCohorts")}
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
                    ? t("learner.dashboard.enrolling")
                    : t("learner.dashboard.enroll")}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  
</>
  );
}
