'use client';

import type { Lesson } from '@/services/courseService';

interface OverviewTabProps {
  lesson: Lesson | null;
}

export default function OverviewTab({ lesson }: OverviewTabProps) {
  if (!lesson) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
        <p className="text-gray-600">Select a lesson to see its content.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">{lesson.title}</h2>
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {lesson.contentType.toUpperCase()}
        </span>
      </div>

      {lesson.contentBody ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: lesson.contentBody }}
          />
        </div>
      ) : (
        <p className="text-gray-600">No written lesson notes were added for this lesson.</p>
      )}

      {lesson.contentType === 'pdf' && lesson.contentUrl && (
        <div className="space-y-3">
          <a
            href={lesson.contentUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Open Lesson PDF
          </a>
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <iframe src={lesson.contentUrl} title={lesson.title} className="h-[600px] w-full" />
          </div>
        </div>
      )}
    </div>
  );
}
