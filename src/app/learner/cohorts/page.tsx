"use client";

import { useState, useEffect } from "react";
import { useSidebar } from "../FixedLayout";
import { cohortService, type Cohort } from "@/services/cohortService";
import { authAPI } from "@/lib/auth";
import { Users, Calendar, BookOpen, Loader2, ChevronDown, LogOut } from "lucide-react";

export default function LearnerCohortsPage() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolledCohortId, setEnrolledCohortId] = useState<string | null>(null);
  const [joiningCohortId, setJoiningCohortId] = useState<string | null>(null);
  const [unenrolling, setUnenrolling] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
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
    } catch (err: unknown) {
      console.error('Error fetching cohorts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch cohorts');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrolledCohort = async () => {
    try {
      const response = await authAPI.getLearnerCohort();
      if (response.success && response.data) {
        const cohortData = response.data as Cohort & { cohortId?: string; id?: string };
        const normalizedCohortId = cohortData.id || cohortData.cohortId || null;
        if (normalizedCohortId) {
          setEnrolledCohortId(normalizedCohortId);
        }
      }
    } catch {
      // Auth API already returns a safe error shape for network/server failures.
    }
  };

  const isEnrollmentPeriodActive = (cohort: Cohort): boolean => {
    if (!cohort.enrollmentOpenDate || !cohort.enrollmentCloseDate) {
      return true;
    }

    const now = new Date();
    const openDate = new Date(cohort.enrollmentOpenDate);
    const closeDate = new Date(cohort.extensionDate || cohort.enrollmentCloseDate);
    closeDate.setHours(23, 59, 59, 999);

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
      setShowDropdown(false);
      
      // Refresh cohorts to get updated student count
      await fetchCohorts();
    } catch (err: unknown) {
      console.error('Error joining cohort:', err);
      setError(err instanceof Error ? err.message : 'Failed to join cohort');
    } finally {
      setJoiningCohortId(null);
    }
  };

  const handleUnenroll = async () => {
    try {
      setUnenrolling(true);
      setError(null);

  await cohortService.unenrollFromCohort(enrolledCohortId!);
      
      // Clear enrolled cohort and refresh the list
      setEnrolledCohortId(null);
      setShowDropdown(false);
      
      // Refresh cohorts to show all available options and updated student counts
      await fetchCohorts();
    } catch (err: unknown) {
      console.error('Error unenrolling from cohort:', err);
      setError(err instanceof Error ? err.message : 'Failed to unenroll from cohort');
    } finally {
      setUnenrolling(false);
    }
  };

  // Filter cohorts: show only enrolled cohort if enrolled, otherwise show all
  const displayedCohorts = enrolledCohortId 
    ? cohorts.filter(c => c.id === enrolledCohortId)
    : cohorts;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[24rem]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className={`transition-all duration-300 space-y-6 ${collapsed ? 'mx-4' : 'max-w-6xl mx-auto'}`}>
      {/* Enrolled Cohort Banner - Show when enrolled */}


      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900" style={{fontFamily:"'Bricolage Grotesque',sans-serif"}}>
            {enrolledCohortId ? 'Your Cohort' : 'Available Cohorts'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {enrolledCohortId 
              ? 'You are enrolled in this cohort. You can unenroll to join a different one.' 
              : 'Join a cohort to access courses'}
          </p>
        </div>
        
        {enrolledCohortId && (
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-sm transition-all"
          >
            <LogOut className="w-4 h-4" />
            Unenroll Options
            <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
        )}
        
        {showDropdown && (
          <div className="absolute right-4 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
            <button
              onClick={handleUnenroll}
              disabled={unenrolling}
              className="w-full flex items-center gap-2 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors rounded-xl"
            >
              {unenrolling ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span className="font-medium">
                {unenrolling ? 'Unenrolling...' : 'Unenroll from this cohort'}
              </span>
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Cohort Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedCohorts.map((cohort, index) => {
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
                    <span>0 / 30 Students</span>
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

                {enrolledCohortId ? (
                  // Show enrolled status with unenroll option
                  <div className="space-y-2">
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl font-semibold text-sm bg-green-100 text-green-700 cursor-default"
                    >
                      Enrolled ✓
                    </button>
                    <p className="text-xs text-center text-gray-500">
                      Click &quot;Unenroll Options&quot; above to leave this cohort
                    </p>
                  </div>
                ) : (
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
                )}
              </div>
            </div>
          );
        })}
      </div>

      {displayedCohorts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No cohorts available at the moment</p>
        </div>
      )}
    </div>
  );
}

