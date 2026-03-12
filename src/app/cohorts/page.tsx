'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Clock, Users, GraduationCap, ArrowRight } from "lucide-react";

interface Cohort {
  id: string;
  name: string;
  courseType: string;
  startDate: string;
  endDate: string;
  currentStudents: number;
  maxStudents: number;
  isActive: boolean;
  instructorIds?: string[];
}

export default function CohortsPage() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAvailableCohorts();
  }, []);

  const fetchAvailableCohorts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://localhost:3000/api/cohorts?page=1&limit=20");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const result = await response.json();
      setCohorts(result.cohorts || []);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError("Failed to load cohorts. Backend running?");
    } finally {
      setLoading(false);
    }
  };

  const filteredCohorts = cohorts.filter((cohort) =>
    cohort.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cohort.courseType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatCourseType = (type: string) => {
    const types: Record<string, string> = {
      COMPUTER_PROGRAMMING: "Computer Programming",
      SOCIAL_MEDIA_BRANDING: "Social Media Branding",
      ENTREPRENEURSHIP: "Entrepreneurship",
      DATA_SCIENCE: "Data Science",
      SRHR: "SRHR",
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p>Loading cohorts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24">
      {/* Hero Header */}
      <section className="pt-24 pb-20 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-center mb-6">
            Available Cohorts
          </h1>
          <p className="text-xl text-indigo-100 text-center max-w-2xl mx-auto mb-12">
            Join live, cohort-based learning with expert instructors. Limited spots available.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-12">
        {/* Search */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search cohorts by name or course type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-lg placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            {error && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500 mb-4">{error}</p>
                <button
                  onClick={fetchAvailableCohorts}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl hover:bg-indigo-700 font-medium transition-all"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cohorts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
{filteredCohorts.map((cohort, index) => (
<div key={`cohort-${index}`} className="group">
              <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full border border-gray-100 hover:border-indigo-200">
                {/* Cohort Image */}
                <div className="h-48 bg-gradient-to-r from-blue-600 to-cyan-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30">
                      <GraduationCap className="w-3 h-3 mr-1" />
                      {formatCourseType(cohort.courseType)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
                    {cohort.name}
                  </h3>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                      <span>
                        {formatDate(cohort.startDate)} - {formatDate(cohort.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-end text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1 text-indigo-500" />
                      <span>{cohort.currentStudents}/{cohort.maxStudents}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
                    cohort.isActive 
                      ? "bg-green-100 text-green-800 border border-green-200" 
                      : "bg-orange-100 text-orange-800 border border-orange-200"
                  }`}>
                    {cohort.isActive ? "🟢 Open for Enrollment" : "🔄 Upcoming"}
                  </div>

                  {/* CTA */}
                    <Link
                    href={`/learner/cohorts/${cohort.id}`}
                    className="w-full block text-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group-hover:scale-[1.02]"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Join Cohort <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCohorts.length === 0 && !loading && !error && (
          <div className="text-center py-24">
            <GraduationCap className="w-24 h-24 text-gray-300 mx-auto mb-8" />
            <h3 className="text-3xl font-bold text-gray-900 mb-4">No Cohorts Available</h3>
            <p className="text-xl text-gray-500 max-w-md mx-auto mb-8">
              Check back soon for upcoming cohorts and enrollment opportunities.
            </p>
            <Link href="/courses" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:bg-indigo-700 text-white font-semibold rounded-2xl transition-all">
              Browse All Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

