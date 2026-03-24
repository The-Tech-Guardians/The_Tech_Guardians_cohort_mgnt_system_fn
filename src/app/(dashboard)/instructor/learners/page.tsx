"use client";

import { useState, useEffect } from "react";
import { Search, Users, MessageCircle, Flag } from "lucide-react";
import Button from "@/components/ui/Button";
import { tokenManager } from "@/lib/auth";
import { courseService } from "@/services/courseService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface Learner {
  id: string;
  name: string;
  email: string;
  cohort: string;
  cohortId?: string;
  progress: number;
  status: "active" | "at-risk" | "inactive";
  lastSeen: string;
  avgScore: number;
  submissions: number;
}

type RawRecord = Record<string, unknown>;

const asRecord = (value: unknown): RawRecord | null => {
  return value !== null && typeof value === "object" ? (value as RawRecord) : null;
};

const getStringValue = (...values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return "";
};

const getNumberValue = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const extractCohortId = (raw: RawRecord): string => {
  const cohort = asRecord(raw.cohort);
  return getStringValue(raw.cohortId, raw.cohort_id, cohort?.id, cohort?.uuid);
};

const extractCohortName = (raw: RawRecord, cohortNameById: Map<string, string>): string => {
  const cohort = asRecord(raw.cohort);
  const cohortId = extractCohortId(raw);
  return getStringValue(
    typeof raw.cohort === "string" ? raw.cohort : undefined,
    raw.cohortName,
    raw.cohort_name,
    cohort?.name,
    cohortNameById.get(cohortId),
    "Unassigned Cohort"
  );
};

const normalizeStatus = (rawStatus: unknown, progress: number): "active" | "at-risk" | "inactive" => {
  const status = typeof rawStatus === "string" ? rawStatus.toLowerCase() : "";
  if (status === "active" || status === "at-risk" || status === "inactive") {
    return status;
  }

  if (progress <= 0) return "inactive";
  if (progress < 40) return "at-risk";
  return "active";
};

const normalizeLearner = (raw: RawRecord, cohortNameById: Map<string, string>): Learner | null => {
  const id = getStringValue(raw.id, raw.uuid, raw.userId, raw.user_id);
  const name = getStringValue(
    raw.name,
    `${getStringValue(raw.firstName, raw.first_name)} ${getStringValue(raw.lastName, raw.last_name)}`.trim(),
    raw.fullName,
    raw.full_name
  );
  const email = getStringValue(raw.email);
  if (!id || !name || !email) return null;

  const cohortId = extractCohortId(raw);
  const progress = getNumberValue(raw.progress, 0);
  const avgScore = getNumberValue(raw.avgScore ?? raw.averageScore ?? raw.average_grade, 0);

  return {
    id,
    name,
    email,
    cohort: extractCohortName(raw, cohortNameById),
    cohortId,
    progress,
    status: normalizeStatus(raw.status, progress),
    lastSeen: getStringValue(raw.lastSeen, raw.last_seen, raw.lastLogin, raw.last_login, "N/A"),
    avgScore,
    submissions: getNumberValue(raw.submissions ?? raw.submissionCount ?? raw.assignmentsSubmitted, 0),
  };
};

// Simple Badge component without className prop
const Badge = ({ 
  variant = "outline" as const, 
  children 
}: { 
  variant?: "success" | "warning" | "secondary" | "outline"; 
  children: React.ReactNode 
}) => {
  const baseClasses = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold";
  
  const variantClasses = {
    outline: "bg-white border border-gray-200 text-gray-700",
    success: "bg-emerald-100 text-emerald-800",
    warning: "bg-amber-100 text-amber-800",
    secondary: "bg-gray-100 text-gray-800",
    default: "bg-blue-100 text-blue-800"
  }[variant] || "bg-blue-100 text-blue-800";
  
  return <span className={`${baseClasses} ${variantClasses}`}>{children}</span>;
};

// Simple Card wrapper
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

export default function InstructorLearnersPage() {
  const [learners, setLearners] = useState<Learner[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLearners();
  }, []);

  const loadLearners = async () => {
    setLoading(true);
    try {
      const token = tokenManager.getToken();
      if (!token) {
        setLearners([]);
        return;
      }

      const instructorCoursesResponse = await courseService.getInstructorCourses();
      const assignedCourses = instructorCoursesResponse.courses || [];
      const assignedCohortIds = new Set<string>();
      const cohortNameById = new Map<string, string>();

      for (const course of assignedCourses as RawRecord[]) {
        const courseCohort = asRecord(course.cohort);
        const cohortId = getStringValue(course.cohortId, course.cohort_id, courseCohort?.id);
        if (!cohortId) continue;
        assignedCohortIds.add(cohortId);
        const cohortName = getStringValue(course.cohortName, course.cohort_name, courseCohort?.name);
        if (cohortName) {
          cohortNameById.set(cohortId, cohortName);
        }
      }

      if (assignedCohortIds.size === 0) {
        setLearners([]);
        return;
      }

      const instructorLearnersResponse = await fetch(`${API_BASE_URL}/instructor/learners`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      let rawLearners: unknown[] = [];

      if (instructorLearnersResponse.ok) {
        const data = await instructorLearnersResponse.json();
        rawLearners = data.data || data.learners || [];
      } else {
        const usersResponse = await fetch(`${API_BASE_URL}/users?page=1&limit=500`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          rawLearners = usersData.users || usersData.data || [];
        }
      }

      const normalized = rawLearners
        .map((raw) => asRecord(raw))
        .filter((raw): raw is RawRecord => Boolean(raw))
        .filter((raw) => getStringValue(raw.role).toUpperCase() === "LEARNER" || !raw.role)
        .map((raw) => normalizeLearner(raw, cohortNameById))
        .filter((learner): learner is Learner => Boolean(learner))
        .filter((learner) => learner.cohortId && assignedCohortIds.has(learner.cohortId));

      setLearners(normalized);
    } catch (error) {
      console.error('Failed to load learners:', error);
      setLearners([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLearners = learners.filter((learner) => {
    if (filter !== "all" && learner.status !== filter) return false;
    const searchLower = search.toLowerCase();
    return (
      learner.name.toLowerCase().includes(searchLower) ||
      learner.email.toLowerCase().includes(searchLower) ||
      learner.cohort.toLowerCase().includes(searchLower)
    );
  });

  const selectedLearner = learners.find((learner) => learner.id === selected);
  const activeCount = learners.filter((l) => l.status === "active").length;
  const atRiskCount = learners.filter((l) => l.status === "at-risk").length;
  const averageProgress = learners.length
    ? Math.round(learners.reduce((sum, learner) => sum + learner.progress, 0) / learners.length)
    : 0;

  if (loading) {
    return (
      <div className="min-h-[420px] flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <Users className="w-7 h-7 text-indigo-600" />
          </div>
          <p className="text-lg font-semibold text-gray-700">Loading learners</p>
          <p className="text-sm text-gray-500">Preparing cohort enrollment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">Instructor Insights</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Learner Management</h1>
            <p className="mt-2 text-sm text-gray-600 max-w-3xl">
              Track enrolled learners across your assigned cohorts, review progress trends, and identify support priorities.
            </p>
          </div>
          <div className="w-full lg:w-auto overflow-x-auto">
            <div className="flex items-stretch gap-3 min-w-max">
              <div className="rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 ">
                <p className="text-xs font-medium text-gray-500">Total Learners</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{learners.length}</p>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 ">
                <p className="text-xs font-medium text-emerald-700">Active</p>
                <p className="mt-1 text-2xl text-center font-bold text-emerald-700">{activeCount}</p>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 ">
                <p className="text-xs font-medium text-amber-700">At Risk</p>
                <p className="mt-1 text-2xl font-bold text-amber-700">{atRiskCount}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 ">
                <p className="text-xs font-medium text-gray-500">Avg. Progress</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{averageProgress}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3 overflow-x-auto">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by learner name, email, or cohort"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
            />
          </div>
          <div className="flex items-center gap-2 flex-nowrap whitespace-nowrap">
            {(["all", "active", "at-risk", "inactive"] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? "primary" : "ghost"}
                className="px-4 py-2 h-auto whitespace-nowrap capitalize text-sm font-medium flex-none"
                onClick={() => setFilter(status)}
              >
                {status.replace("-", " ")}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Learner Roster</h3>
              <p className="text-sm text-gray-500">{filteredLearners.length} shown</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Learner</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Cohort</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Progress</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Last Seen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredLearners.map((learner) => (
                    <tr
                      key={learner.id}
                      className={`hover:bg-gray-50/80 cursor-pointer transition-colors ${selected === learner.id ? "bg-indigo-50/50" : ""}`}
                      onClick={() => setSelected(selected === learner.id ? null : learner.id)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold">
                            {learner.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{learner.name}</p>
                            <p className="text-xs text-gray-500">{learner.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="outline">{learner.cohort}</Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 rounded-full bg-gray-200 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                learner.progress > 80 ? "bg-emerald-500" :
                                learner.progress > 50 ? "bg-amber-500" : "bg-rose-500"
                              }`}
                              style={{ width: `${learner.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-700 w-10">{learner.progress}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={learner.status === "active" ? "success" : learner.status === "at-risk" ? "warning" : "secondary"}>
                          {learner.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{learner.lastSeen}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredLearners.length === 0 && (
              <div className="p-12 text-center border-t border-gray-100">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-base font-semibold text-gray-900">No learners found</p>
                <p className="mt-1 text-sm text-gray-500">
                  Update filters or cohort assignments to see learners here.
                </p>
              </div>
            )}
          </Card>
        </div>

        <div>
          {selectedLearner ? (
            <Card className="h-full">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-base font-semibold">
                    {selectedLearner.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 truncate">{selectedLearner.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{selectedLearner.email}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Badge variant="outline">{selectedLearner.cohort}</Badge>
                </div>
              </div>

              <div className="p-5 space-y-5">
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedLearner.progress}%</p>
                  <div className="mt-3 h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${selectedLearner.progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-xs text-gray-500">Average Score</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{selectedLearner.avgScore}%</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-xs text-gray-500">Submissions</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{selectedLearner.submissions}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs text-gray-500">Last Seen</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{selectedLearner.lastSeen}</p>
                </div>

                <div className="space-y-2 pt-1">
                  <Button className="w-full h-11 text-sm font-semibold">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  {selectedLearner.status === "at-risk" && (
                    <Button variant="outline" className="w-full h-11 text-sm font-semibold">
                      <Flag className="w-4 h-4 mr-2" />
                      Flag for Review
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-full">
              <div className="p-8 text-center">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Users className="w-7 h-7 text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Select a learner</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Choose a learner from the roster to view performance details and actions.
                </p>
                <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-left">
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Tip</p>
                  <p className="mt-1 text-sm text-indigo-700">
                    Use status filters to quickly focus on at-risk learners.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

