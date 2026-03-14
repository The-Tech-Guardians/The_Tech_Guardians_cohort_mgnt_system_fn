'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { courses as coursesApi } from '@/lib/instructorApi';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const load = async () => {
    try {
      const c = await coursesApi.fetchCourse(id);
      if (!c) {
        setError('Course not found');
        return;
      }
      setCourse(c);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) load();
  }, [id]);

  const onDelete = async () => {
    try {
      const res: any = await coursesApi.deleteCourse(id);
      if (res?.success === false || res?.error) {
        setError(res?.message || 'Failed to delete course');
        return;
      }
      router.push('/instructor/courses');
    } catch (e: any) {
      setError(e?.message || 'Failed to delete course');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Course</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/instructor/courses" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Course</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/instructor/courses" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-600">{course.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/instructor/courses/${id}/edit`} className="text-gray-600 hover:text-gray-800 text-sm font-medium inline-flex items-center gap-1">
            <Edit size={16} /> Edit
          </Link>
          <button onClick={() => setConfirmOpen(true)} className="text-red-600 hover:text-red-800 text-sm font-medium inline-flex items-center gap-1">
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-500">Course Type</div>
            <div className="text-gray-900 font-medium">{course.courseType || 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Status</div>
            <div className="text-gray-900 font-medium">{course.status}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Modules</div>
            <div className="text-gray-900 font-medium">{course.moduleCount ?? '—'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Learners</div>
            <div className="text-gray-900 font-medium">{course.learnerCount ?? '—'}</div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onDelete}
        title="Delete course?"
        message="This action cannot be undone. Are you sure you want to permanently delete this course?"
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
