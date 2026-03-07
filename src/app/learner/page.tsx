
"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useSidebar } from "@/components/ui/SideBarContext";
import { Monitor, BookOpen, BarChart3, Bot, Gamepad2, Camera, Leaf, Smartphone, FileText, Lightbulb, TrendingUp, BookMarked, Users, Clock } from "lucide-react";
import { authAPI, tokenManager } from "@/lib/auth";

export default function LearnerDashboardPage() {
  const { collapsed } = useSidebar();
  const [user, setUser] = useState({ name: 'Loading...', initials: 'L' });
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [currentCohort, setCurrentCohort] = useState<any>(null);
  const [availableCohorts, setAvailableCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userData = tokenManager.getUser();
        if (userData) {
          const name =
            (userData.firstName || userData.lastName)
              ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
              : userData.name || userData.email?.split('@')[0] || 'User';
          const initials =
            name
              .split(' ')
              .filter(Boolean)
              .map((n) => n[0])
              .join('')
              .toUpperCase() || 'U';
          setUser({ name, initials });
        }

        // Fetch courses data
        const coursesResponse = await authAPI.getLearnerCourses();
        if (coursesResponse.success) {
          setMyCourses(coursesResponse.data || []);
        }

        // Fetch current cohort
        const cohortResponse = await authAPI.getLearnerCohort();
        console.log('Cohort Response:', cohortResponse);
        if (cohortResponse.success) {
          setCurrentCohort(cohortResponse.data);
        }

        // Fetch available cohorts
        const availableResponse = await authAPI.getAvailableCohorts();
        console.log('Available Cohorts Response:', availableResponse);
        if (availableResponse.success) {
          setAvailableCohorts(availableResponse.data || []);
        }

        // For now, set empty arrays for recommended courses
        setRecommendedCourses([]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
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
      
      if (response.success) {
        // Refresh cohort data
        const cohortResponse = await authAPI.getLearnerCohort();
        if (cohortResponse.success) {
          setCurrentCohort(cohortResponse.data);
        }

        // Refresh available cohorts
        const availableResponse = await authAPI.getAvailableCohorts();
        if (availableResponse.success) {
          setAvailableCohorts(availableResponse.data || []);
        }

        console.log('Successfully joined cohort:', response.data);
      } else {
        console.error('Error joining cohort:', response.message);
        alert('Failed to join cohort: ' + response.message);
      }
    } catch (error) {
      console.error('Error enrolling in cohort:', error);
      alert('Failed to join cohort');
    } finally {
      setEnrolling(null);
    }
  };

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  if (loading) {
    return (
      <div className={`flex gap-5 min-h-full ${collapsed ? "p-4 sm:p-5" : ""}`}>
        <div className="flex-1 min-w-0 space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="space-y-2">
                  <div className="h-32 bg-gray-200 rounded-xl"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-[280px] xl:w-[300px] flex-shrink-0 space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-48 bg-gray-200 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-5 min-h-full ${collapsed ? "p-4 sm:p-5" : ""}`}>
      <div className="flex-1 min-w-0 space-y-5">
        {currentCohort && (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100 shadow-sm">
            <h2 className="text-[14px] font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Users size={16} className="text-blue-600"/>
              My Current Cohort
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-[13px] text-gray-600 font-medium">Cohort Name</p>
                <p className="text-[15px] font-bold text-gray-900 mt-1">{currentCohort.name || 'N/A'}</p>
              </div>
              {currentCohort.description && (
                <div>
                  <p className="text-[13px] text-gray-600 font-medium">Description</p>
                  <p className="text-[12px] text-gray-600 mt-1">{currentCohort.description}</p>
                </div>
              )}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-blue-200">
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Status</p>
                  <p className="text-[12px] font-bold text-blue-600 capitalize mt-1">{currentCohort.status || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Students</p>
                  <p className="text-[12px] font-bold text-blue-600 mt-1">{currentCohort.currentStudents || 0}/{currentCohort.maxStudents || 0}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Start Date</p>
                  <p className="text-[12px] font-bold text-blue-600 mt-1">
                    {currentCohort.startDate ? new Date(currentCohort.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!currentCohort && !loading && (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-5 border border-yellow-100 shadow-sm">
            <h2 className="text-[14px] font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Users size={16} className="text-yellow-600"/>
              No Cohort
            </h2>
            <p className="text-[12px] text-gray-600">You're not enrolled in any cohort yet. Check available cohorts on the right to join one!</p>
          </div>
        )}

        {myCourses.length > 0 && (
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14px] font-bold text-gray-900">My Courses</h2>
              <button className="text-[12px] font-semibold text-blue-600 hover:underline">View all</button>
            </div>
            <div className="space-y-2">
              {myCourses.slice(0, 4).map((course: any) => {
                const pct = Math.round((course.progress || 0));
                return (
                  <div key={course.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-white text-sm font-bold">{course.title?.charAt(0) || 'C'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">{course.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{width:`${pct}%`}}/>
                        </div>
                        <span className="text-[10.5px] text-gray-400 font-medium flex-shrink-0">Progress: {pct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {myCourses.length === 0 && !loading && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
            <div className="text-gray-400 text-lg font-semibold mb-2">No courses enrolled</div>
            <p className="text-gray-500 text-sm">Start your learning journey by enrolling in a course.</p>
          </div>
        )}
      </div>

      <div className="w-[280px] xl:w-[300px] flex-shrink-0 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-black text-gray-900 leading-tight">Hi, {user.name}</h2>
            <p className="text-[11.5px] text-gray-400 font-medium">{dayName} · {dateStr}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm relative">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full"/>
            </button>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
              {user.initials}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center py-8">
          <div className="text-gray-400 text-sm font-semibold mb-2">Welcome to your dashboard</div>
          <p className="text-gray-500 text-xs">Your learning activities will appear here.</p>
        </div>

        {currentCohort && (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100 shadow-sm">
            <h3 className="text-[12px] font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Users size={14} className="text-blue-600"/>
              Current Cohort
            </h3>
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-gray-900 truncate" title={currentCohort.name || 'Cohort'}>
                    {currentCohort.name ? currentCohort.name : 'Unnamed Cohort'}
                  </p>
                  {currentCohort.description && (
                    <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{currentCohort.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-[11px] pt-2 border-t border-blue-200">
                <div>
                  <p className="text-gray-500 font-medium">Status</p>
                  <p className="text-blue-600 font-bold capitalize">{currentCohort.status || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Students</p>
                  <p className="text-blue-600 font-bold">{currentCohort.currentStudents || 0}/{currentCohort.maxStudents || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {availableCohorts.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <h3 className="text-[12px] font-bold text-gray-700 mb-3 flex items-center gap-2">
              <BookMarked size={14} className="text-cyan-600"/>
              Available Cohorts ({availableCohorts.length})
            </h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {availableCohorts.slice(0, 3).map((cohort: any) => (
                <div key={cohort.cohortId} className="p-2.5 rounded-lg bg-gray-50 hover:bg-cyan-50 transition-colors cursor-pointer border border-transparent hover:border-cyan-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-[11.5px] font-bold text-gray-800 truncate">{cohort.name}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {new Date(cohort.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${
                      cohort.status === 'active' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {cohort.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[10px]">
                    <span className="text-gray-500">{cohort.currentStudents}/{cohort.maxStudents} students</span>
                    <button 
                      onClick={() => handleEnrollCohort(cohort.cohortId)}
                      disabled={enrolling === cohort.cohortId}
                      className="text-cyan-600 font-bold hover:text-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enrolling === cohort.cohortId ? 'Enrolling...' : 'Enroll'}
                    </button>
                  </div>
                </div>
              ))}
              {availableCohorts.length > 3 && (
                <button className="w-full text-[11px] font-semibold text-cyan-600 hover:text-cyan-700 py-2 rounded-lg hover:bg-cyan-50 transition-colors">
                  View all cohorts
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}