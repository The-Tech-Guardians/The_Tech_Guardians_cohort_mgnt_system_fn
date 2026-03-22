"use client";

import { useState, useEffect } from "react";
import { Icon, I } from "@/components/instructor/ui/Icon";
import { Badge, ProgressBar, Btn, Card, SectionTitle } from "@/components/instructor/ui/SharedUI";
import { instructorApi } from "@/lib/instructorApi";

export default function InstructorOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats first
        const statsData = await instructorApi.getDashboardStats();
        setStats(statsData);
        
        // Try to fetch courses
        try {
          const coursesData = await instructorApi.getInstructorCourses();
          setCourses(coursesData);
        } catch (courseError) {
          console.error('Failed to fetch courses:', courseError);
          setCourses([]);
        }
        
        // Try to fetch modules
        try {
          const modulesData = await instructorApi.getInstructorModules();
          setModules(modulesData);
        } catch (moduleError) {
          console.error('Failed to fetch modules:', moduleError);
          setModules([]);
        }
        
        // Try to fetch lessons
        try {
          const lessonsData = await instructorApi.getInstructorLessons();
          setLessons(lessonsData);
        } catch (lessonError) {
          console.error('Failed to fetch lessons:', lessonError);
          setLessons([]);
        }
        
        // Try to fetch assessments
        try {
          const assessmentsData = await instructorApi.getInstructorAssessments();
          setAssessments(assessmentsData);
        } catch (assessmentError) {
          console.error('Failed to fetch assessments:', assessmentError);
          setAssessments([]);
        }
        
        // Try to fetch recent activity separately
        try {
          const activityData = await instructorApi.getRecentStudentActivity();
          setStats((prev: any) => ({ ...prev, recentActivity: activityData }));
        } catch (activityError) {
          console.error('Failed to fetch recent activity:', activityError);
          // Don't fail the whole page, just set empty activity
          setStats((prev: any) => ({ ...prev, recentActivity: [] }));
        }
      } catch (error) {
        console.error('Failed to fetch overview data:', error);
        setStats({
          totalCourses: 0,
          totalEnrollments: 0,
          activeStudents: 0,
          completionRate: 0,
          avgRating: 0,
          newEnrollments: 0,
          lessonsPublished: 0,
          coursesCompleted: 0,
          recentActivity: []
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label:"Total Courses",  value:courses.length || stats?.totalCourses || "0",  sub:`${stats?.totalEnrollments || 0} enrollments`,  icon:"courses",  accent:true  },
          { label:"Total Modules",  value:modules.length || "0",   sub:`Across all courses`, icon:"analytics",   accent:false },
          { label:"Total Lessons",  value:lessons.length || stats?.lessonsPublished || "0", sub:`Published content`,     icon:"learners", accent:false },
          { label:"Total Assessments",  value:assessments.length || "0",  sub:"Tests & quizzes",    icon:"quiz",      accent:false },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border p-5 hover:shadow-md transition-all  bg-white border-gray-200">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3  bg-gray-100">
              <Icon d={I[s.icon as keyof typeof I]} size={16} className="text-gray-600" />
            </div>
            <div className="text-3xl font-black tracking-tight mb-0.5  text-gray-900"
              style={{fontFamily:"'Bricolage Grotesque',sans-serif"}}>{s.value}</div>
            <div className="text-sm font-semibold  text-gray-700">{s.label}</div>
            <div className={`text-xs mt-0.5 ${s.accent ? "text-gray-500" : "text-gray-400"}`}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <SectionTitle>My Courses</SectionTitle>
            <Btn variant="indigo" size="xs" ><Icon d={I.plus} size={13}/>New Course</Btn>
          </div>
          <div className="divide-y divide-gray-50">
            {courses.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-500">
                <div className="text-lg font-medium mb-2">No courses yet</div>
                <div className="text-sm">Create your first course to get started</div>
              </div>
            ) : (
              courses.map(c => (
                <div key={c.id}>
                  <div className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setExpanded(expanded===c.id ? null : c.id)}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center font-black flex-shrink-0">{c.title?.[0] || 'C'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-sm text-gray-900 truncate">{c.title}</span>
                        <Badge variant={c.published?"green":"gray"}>{c.published?"● Live":"Draft"}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                        <span>{c.enrolled || 0} learners</span><span>·</span>
                      <span>{c.lessons} lessons</span><span>·</span>
                      <Badge variant="gray">{c.cohort}</Badge>
                    </div>
                    <div className="mt-2"><ProgressBar value={c.completion}/></div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xl font-black text-gray-900">{c.completion}%</div>
                    <div className="text-xs text-gray-400">done</div>
                  </div>
                  <Icon d={I.chevronD} size={15} className={`text-gray-400 transition-transform flex-shrink-0 ${expanded===c.id?"rotate-180":""}`}/>
                </div>
                {expanded===c.id && (
                  <div className="bg-gray-50 border-t border-gray-100 px-5 py-4">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Modules</div>
                    <div className="space-y-2">
                      {c.modules_data.map(m => (
                        <div key={m.id} className="flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                          <span className="text-xs font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-lg">{m.week}</span>
                          <span className="text-sm text-gray-700 flex-1 truncate">{m.title}</span>
                          <span className="text-xs text-gray-400 hidden sm:block">{m.lessons}L</span>
                          <Badge variant={m.published?"green":"amber"}>{m.published?"Live":"Draft"}</Badge>
                          <button className="text-gray-400 hover:text-gray-700 transition-colors"><Icon d={I.edit} size={13}/></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <SectionTitle>Recent Activity</SectionTitle>
              <button
                onClick={async () => {
                  try {
                    const activityData = await instructorApi.getRecentStudentActivity();
                    setStats(prev => ({ ...prev, recentActivity: activityData }));
                  } catch (error) {
                    console.error('Failed to fetch recent activity:', error);
                  }
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Retry
              </button>
            </div>
            <div className="space-y-3">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.slice(0, 3).map((activity: any, idx: number) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 mt-1.5 flex-shrink-0"/>
                    <div>
                      <p className="text-xs font-medium text-gray-800 leading-snug">{activity.title || 'Recent activity'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="gray">Activity</Badge>
                        <span className="text-xs text-gray-400">{activity.time || 'Just now'}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <div className="text-sm">No recent activity</div>
                  <div className="text-xs mt-1">Try refreshing to see the latest updates</div>
                </div>
              )}
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <SectionTitle>Quick Stats</SectionTitle>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Students</span>
                <span className="text-sm font-semibold">{stats?.activeStudents || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="text-sm font-semibold">{stats?.completionRate || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Rating</span>
                <span className="text-sm font-semibold">{stats?.avgRating ? `${stats.avgRating}/5` : "0"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Enrollments</span>
                <span className="text-sm font-semibold">{stats?.newEnrollments || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed Courses</span>
                <span className="text-sm font-semibold">{stats?.coursesCompleted || 0}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
              
