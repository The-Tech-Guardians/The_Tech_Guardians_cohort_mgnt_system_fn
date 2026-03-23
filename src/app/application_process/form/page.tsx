"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { tokenManager } from '@/lib/auth';
import { ApplicationForm } from "@/components/application-component/application-form";
import { cohortService, Cohort } from "@/services/cohortService";
import Link from "next/link";
import { ChevronRight, Calendar, Users } from "lucide-react";

export default function FormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCohortId = searchParams.get('cohortId') || '';
  const [selectedCohortId, setSelectedCohortId] = useState(urlCohortId);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!tokenManager.getUser()) {
      router.replace('/login?redirect=/application_process/form');
      return;
    }

    const fetchCohorts = async () => {
      try {
        const { cohorts: availableCohorts } = await cohortService.getAllCohorts(1, 50);
        // Filter for active cohorts that are accepting applications
        const activeCohorts = availableCohorts.filter(cohort => 
          cohort.isActive && cohort.status === 'active'
        );
        setCohorts(activeCohorts);
        
        // Auto-select first cohort if none selected and cohorts exist
        if (!urlCohortId && activeCohorts.length > 0) {
          setSelectedCohortId(activeCohorts[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch cohorts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCohorts();
  }, [router, urlCohortId]);

  const selectedCohort = cohorts.find(c => c.id === selectedCohortId);

  if (loading) {
    return (
      <div className="mt-44 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading available cohorts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-44 py-8 sm:py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back link */}
        <Link 
          href="/application_process"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Application Process
        </Link>

        {/* Cohort Selection */}
        {cohorts.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Cohort</h2>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cohorts.map((cohort) => (
                <div
                  key={cohort.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedCohortId === cohort.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedCohortId(cohort.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{cohort.name}</h3>
                    {selectedCohortId === cohort.id && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(cohort.startDate).toLocaleDateString()} - {new Date(cohort.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>
                        {cohort.currentStudents || 0} / {cohort.maxStudents || '∞'} students
                      </span>
                    </div>
                    
                    <div className="text-xs">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {cohort.courseType}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No cohorts available */}
        {cohorts.length === 0 && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">No Available Cohorts</h3>
            <p className="text-yellow-600">
              There are currently no active cohorts accepting applications. Please check back later.
            </p>
          </div>
        )}

        {/* Application Form */}
        {selectedCohortId && selectedCohort && (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-medium text-blue-900">Applying to: {selectedCohort.name}</h3>
                  <p className="text-sm text-blue-700">
                    {selectedCohort.courseType} • {new Date(selectedCohort.startDate).toLocaleDateString()} - {new Date(selectedCohort.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            
            <ApplicationForm cohortId={selectedCohortId} />
          </>
        )}
      </div>
    </div>
  );
}
