"use client";

import { useState, useEffect } from "react";
import { useSidebar } from "../layout";
import { cohortService, type Cohort } from "@/services/cohortService";
import { Users, Calendar, BookOpen, Loader2 } from "lucide-react";

export default function LearnerCohortsPage() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolledCohortId, setEnrolledCohortId] = useState<string | null>(null);
  const [joiningCohortId, setJoiningCohortId] = useState<string | null>(null);
  const { collapsed } = useSidebar();

  useEffect(() => {
    fetchCohorts();
    checkEnrolledCohort();
  }, []);

  const fetchCohorts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cohortService.getAllCohorts(1, 50);
      setCohorts(response.cohorts);
    } catch (err: any) {
      console.error('Error fetching cohorts:', err);
      setError(err.message || 'Failed to fetch cohorts');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrolledCohort = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) return;

      const response = await fetch('http://localhost:3000/api/learner/cohort', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data?.cohortId) {
          setEnrolledCohortId(data.data.cohortId);
        }
      }
    } catch (err) {
      console.error('Error checking enrolled cohort:', err);
    }
  };

  const isEnrollmentPeriodActive = (cohort: Cohort): boolean => {
    if (!cohort.enrollmentOpenDate || !cohort.enrollmentCloseDate) {
      return true;
    }

    const now = new Date();
    const openDate = new Date(cohort.enrollmentOpenDate);
    const closeDate = new Date(cohort.enrollmentCloseDate);

    return now >= openDate && now <= closeDate;
  };

  const handleJoinCohort = async (cohortId: string) => {
    if (!cohortId) {
      setError('Cohort ID is missing');
      return;
    }

    try {
      setJoiningCohortId(cohortId);
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch('http://localhost:3000/api/cohorts/join', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cohort_id: cohortId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join cohort');
      }

      setEnrolledCohortId(cohortId);
    } catch (err: any) {
      console.error('Error joining cohort:', err);
      setError(err.message || 'Failed to join cohort');
    } finally {
      setJoiningCohortId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className={`transition-all duration-300 space-y-6 ${collapsed ? 'mx-4' : 'max-w-6xl mx-auto'}`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900" style={{fontFamily:"'Bricolage Grotesque',sans-serif"}}>Available Cohorts</h1>
          <p className="text-sm text-gray-500 mt-1">Join a cohort to access courses</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cohorts.map((cohort, index) => {
          const cohortId = cohort.id;
          const enrollmentActive = isEnrollmentPeriodActive(cohort);
          const isEnrolled = enrolledCohortId === cohortId;
          const isJoining = joiningCohortId === cohortId;

          return (
            <div key={cohortId || `cohort-${index}`} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 text-white">
                <h3 className="text-lg font-bold mb-2">{cohort.name}</h3>
                <p className="text-sm text-white/80">{cohort.courseType}</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>
                      {new Date(cohort.startDate).toLocaleDateString()} - {new Date(cohort.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>{cohort.currentStudents || 0} / {cohort.maxStudents || 30} Students</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      cohort.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {cohort.isActive ? 'Active' : 'Upcoming'}
                    </span>
                  </div>
                </div>

                {cohort.enrollmentOpenDate && (
                  <div className={`text-xs p-3 rounded-lg ${
                    enrollmentActive
                      ? 'text-gray-500 bg-gray-50'
                      : 'text-red-600 bg-red-50 border border-red-200'
                  }`}>
                    <p className="font-semibold mb-1">Enrollment Period:</p>
                    <p>
                      {new Date(cohort.enrollmentOpenDate).toLocaleDateString()} - {
                        cohort.enrollmentCloseDate 
                          ? new Date(cohort.enrollmentCloseDate).toLocaleDateString()
                          : 'Open'
                      }
                    </p>
                    {!enrollmentActive && (
                      <p className="mt-2 font-semibold">Enrollment period has ended</p>
                    )}
                  </div>
                )}

                <button
                  onClick={() => handleJoinCohort(cohortId)}
                  disabled={isEnrolled || isJoining || !enrollmentActive}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    isEnrolled
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : isJoining
                      ? 'bg-gray-100 text-gray-500 cursor-wait'
                      : !enrollmentActive
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isJoining ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Joining...
                    </span>
                  ) : isEnrolled ? (
                    'Enrolled ✓'
                  ) : !enrollmentActive ? (
                    'Enrollment Closed'
                  ) : (
                    'Join Cohort'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {cohorts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No cohorts available at the moment</p>
        </div>
      )}
    </div>
  );
}
