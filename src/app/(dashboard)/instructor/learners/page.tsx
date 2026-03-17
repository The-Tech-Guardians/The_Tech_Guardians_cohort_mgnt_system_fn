"use client";

import { useState, useEffect } from "react";
import { Search, Users, Eye, MessageCircle, Flag } from "lucide-react";
import Button from "@/components/ui/Button";
import { authAPI, tokenManager } from "@/lib/auth";

interface Learner {
  id: string;
  name: string;
  email: string;
  cohort: string;
  progress: number;
  status: "active" | "at-risk" | "inactive";
  lastSeen: string;
  avgScore: number;
  submissions: number;
}

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
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/instructor/learners`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLearners(data.data || data.learners || []);
      }
    } catch (error) {
      console.warn('Instructor learners endpoint not ready - using demo data');
      console.error('Failed to load learners:', error);
      setLearners([
        {
          id: "1",
          name: "Sarah Johnson",
          email: "sarah@techguardians.com",
          cohort: "2025-A",
          progress: 85,
          status: "active",
          lastSeen: "2h ago",
          avgScore: 92,
          submissions: 6
        },
        {
          id: "2",
          name: "Mike Chen",
          email: "mike@techguardians.com",
          cohort: "2025-A",
          progress: 42,
          status: "at-risk",
          lastSeen: "5 days ago",
          avgScore: 67,
          submissions: 3
        },
        {
          id: "3",
          name: "Emily Davis",
          email: "emily@techguardians.com",
          cohort: "2025-B",
          progress: 98,
          status: "active",
          lastSeen: "1h ago",
          avgScore: 95,
          submissions: 6
        },
        {
          id: "4",
          name: "David Kim",
          email: "david@techguardians.com",
          cohort: "2025-B",
          progress: 12,
          status: "inactive",
          lastSeen: "3 weeks ago",
          avgScore: 45,
          submissions: 1
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLearners = learners.filter((learner) => {
    if (filter !== "all" && learner.status !== filter) return false;
    const searchLower = search.toLowerCase();
    return learner.name.toLowerCase().includes(searchLower) || learner.email.toLowerCase().includes(searchLower);
  });

  const selectedLearner = learners.find((learner) => learner.id === selected);

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-8">
        <div className="text-center">
          <Users className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <p className="text-2xl font-semibold text-gray-500">Loading your learners...</p>
        </div>
      </div>
    );
  }

  const atRiskCount = learners.filter((l) => l.status === "at-risk").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-slate-800 bg-clip-text text-transparent tracking-tight mb-2">
              Learners ({learners.length})
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
              Monitor individual progress, identify learners who need attention, and track cohort performance
            </p>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white/70 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-center">
              <div className="text-3xl font-black text-gray-900">{learners.length}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Total</div>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="text-center">
              <div className="text-3xl font-black text-orange-600">{atRiskCount}</div>
              <div className="text-sm text-orange-600 uppercase tracking-wide font-semibold">At Risk</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search learners by name, email or cohort..."
            className="w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl bg-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 shadow-sm transition-all hover:border-gray-300"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "active", "at-risk", "inactive"] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? "primary" : "ghost"}
              className="px-6 py-3 h-auto whitespace-nowrap capitalize font-semibold text-sm shadow-sm hover:shadow-md"
              onClick={() => setFilter(status)}
            >
              {status.replace("-", " ")}
            </Button>
          ))}
        </div>
      </div>

      {/* Learners Grid */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Table Column */}
        <div className="lg:col-span-3">
          <Card className="">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-white/60 backdrop-blur-sm">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                Learner Roster
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-100">
                <thead className="bg-white sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Learner Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Cohort
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Active
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredLearners.map((learner, index) => (
                    <tr
                      key={learner.id}
                      className="hover:bg-gray-50/70 transition-all duration-200 cursor-pointer h-16 group"
                      onClick={() => setSelected(selected === learner.id ? null : learner.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 group-hover:gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-xl ring-4 ring-white/30 flex-shrink-0 transition-transform group-hover:scale-105">
                            {learner.name.split(" ")[0][0]}{learner.name.split(" ").slice(1)[0]?.[0] || ""}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-sm leading-tight">{learner.name}</div>
                            <div className="text-xs text-gray-500">{learner.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{learner.cohort}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-28 h-2 bg-gray-200 rounded-full overflow-hidden shadow-sm">
                            <div className={`h-full rounded-full shadow-md transition-all duration-700 ease-out ${
                              learner.progress > 80 ? 'bg-emerald-500' :
                              learner.progress > 50 ? 'bg-amber-500' : 'bg-rose-500'
                            }`} style={{ width: `${learner.progress}%` }} />
                          </div>
                          <span className="font-mono font-bold text-sm text-gray-900 min-w-[3.5ch]">
                            {learner.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={learner.status === "active" ? "success" : learner.status === "at-risk" ? "warning" : "secondary"}>
                          {learner.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">{learner.lastSeen}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredLearners.length === 0 && (
              <div className="p-20 border-t border-gray-100 text-center bg-gradient-to-b from-white to-gray-50">
                <Users className="w-24 h-24 text-gray-300 mx-auto mb-8" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Learners Found</h3>
                <p className="text-lg text-gray-500 max-w-md mx-auto">
                  Your filters didn't match any learners. Try clearing search or adjusting status filters.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Selected Learner Detail */}
        <div className="space-y-6">
          {selectedLearner ? (
            <Card className="h-full flex flex-col max-h-[600px]">
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-4xl shadow-2xl ring-8 ring-white/50">
                    {selectedLearner.name.split(" ").slice(0,2).map(n => n[0]).join("").toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-3xl font-black text-gray-900 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                      {selectedLearner.name}
                    </h2>
                    <Badge variant="outline" className="!text-lg !px-6 !py-3">
                      {selectedLearner.cohort}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-8 flex-1 space-y-8">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wide">Performance Snapshot</h4>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold text-gray-700">Course Progress</span>
                        <span className="text-3xl font-black text-gray-900">{selectedLearner.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-6 rounded-3xl overflow-hidden shadow-lg">
                        <div className="h-6 bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl shadow-xl" style={{ width: `${selectedLearner.progress}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold text-gray-700">Average Grade</span>
                        <span className="text-3xl font-black text-gray-900">{selectedLearner.avgScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-6 rounded-3xl overflow-hidden shadow-lg">
                        <div className="h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl shadow-xl" style={{ width: `${selectedLearner.avgScore}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wide">Activity Metrics</h4>
                  <div className="grid grid-cols-2 gap-6 p-6 bg-gradient-to-br from-slate-50 to-gray-50 rounded-3xl">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-semibold text-gray-700">Assignments</span>
                        <span className="text-2xl font-black text-gray-900">{selectedLearner.submissions}</span>
                      </div>
                      <div className="text-2xl font-bold text-emerald-600">/ 12 complete</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-700">Last Seen</span>
                        <span className="text-lg font-bold text-gray-900">{selectedLearner.lastSeen}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 space-y-4">
                  <Button className="w-full h-16 px-8 py-4 text-xl font-black shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                    <MessageCircle className="w-7 h-7 mr-4" />
                    Send Message
                  </Button>
                  {selectedLearner.status === "at-risk" && (
                    <Button variant="outline" className="w-full h-16 px-8 py-4 text-xl font-black border-2 shadow-xl hover:shadow-2xl transition-all duration-300">
                      <Flag className="w-7 h-7 mr-4" />
                      Flag for Review
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-20">
              <Users className="w-32 h-32 text-gray-300 mb-12 p-8 bg-gray-50 rounded-3xl shadow-inner" />
              <h3 className="text-4xl font-black text-gray-900 mb-6 leading-tight">Choose Learner</h3>
              <p className="text-2xl text-gray-600 mb-12 max-w-lg text-center leading-relaxed">
                Click any row to review detailed analytics
              </p>
              <div className="w-full p-8 bg-gradient-to-r from-indigo-50/80 via-blue-50/80 to-emerald-50/80 backdrop-blur-sm rounded-3xl border-2 border-indigo-200 shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-xl">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-indigo-900 mb-2">Smart Filters</h4>
                    <p className="text-lg text-indigo-700">Prioritize at-risk learners automatically</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

