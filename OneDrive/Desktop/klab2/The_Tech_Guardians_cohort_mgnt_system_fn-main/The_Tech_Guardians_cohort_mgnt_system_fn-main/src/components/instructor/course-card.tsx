'use client'

import { Edit3, Trash2, Users, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { instructorApi } from '@/lib/instructorApi'
import { useTransition } from 'react'
import type { Course } from '@/types/instructor'

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm('Delete this course? This cannot be undone.')) return
    startTransition(async () => {
      const result = await instructorApi.courses.deleteCourse(course.id)
      if (result.success) {
        alert('Course deleted')
        window.location.reload()
      } else {
        alert(result.message || 'Delete failed')
      }
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition overflow-hidden h-full flex flex-col">
      <div className="aspect-video bg-gradient-to-r from-gray-200 to-gray-100 relative overflow-hidden">
        {course.thumbnail ? (
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <BookOpen className="h-12 w-12" />
          </div>
        )}
        <div className="absolute top-3 right-3 space-x-1 flex">
          <span className={`px-2 py-1 rounded text-xs font-medium ${course.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {course.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-lg line-clamp-2 mb-1">{course.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3 flex-1">{course.description}</p>

        <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.learnerCount || 0} learners</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{course.moduleCount || 0} modules</span>
          </div>
        </div>

        <div className="flex gap-2 pt-3 border-t">
          <Link href={`/instructor/courses/${course.id}`} className="flex-1">
            <button className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition flex items-center justify-center gap-2">
              <Edit3 className="h-4 w-4" />
              Edit
            </button>
          </Link>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
