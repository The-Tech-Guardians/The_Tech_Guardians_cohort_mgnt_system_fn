'use client';

import type { Assessment } from '@/types/assessment';

interface AssignmentTabProps {
  assessments: Assessment[];
}

export default function AssignmentTab({ assessments }: AssignmentTabProps) {
  if (assessments.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Assignment</h2>
        <p className="text-gray-600">No assignments available for this module.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Assignments</h2>
      {assessments.map((assessment) => (
        <div key={assessment.id} className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-900">{assessment.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{assessment.description || 'No description provided.'}</p>
            </div>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              Assignment
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-500">
            {assessment.passMark !== undefined && <span>Pass mark: {assessment.passMark}%</span>}
            {assessment.timeLimitMinutes !== undefined && <span>Time: {assessment.timeLimitMinutes} min</span>}
            {assessment.retakeLimit !== undefined && <span>Retakes: {assessment.retakeLimit}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
