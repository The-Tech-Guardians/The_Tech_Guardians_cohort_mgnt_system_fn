'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Course, Module, Lesson } from '@/services/courseService';

interface CourseSidebarProps {
  course: Course;
  modules: Module[];
  lessons: Lesson[];
  selectedModuleId: string | null;
  onModuleSelect: (moduleId: string) => void;
  onLessonSelect: (lessonId: string) => void;
}

export default function CourseSidebar({ course, modules, lessons, selectedModuleId, onModuleSelect, onLessonSelect }: CourseSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(modules.map(m => m.id)));

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const getLessonsForModule = (moduleId: string) => {
    return lessons.filter(l => l.moduleId === moduleId).sort((a, b) => a.orderIndex - b.orderIndex);
  };

  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Course Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-blue-600 truncate">{course.title}</h2>
        <p className="text-xs text-gray-500 mt-1">{course.courseType}</p>
      </div>

      {/* Modules and Lessons */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {modules.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No modules available</p>
        ) : (
          modules.map(module => (
            <div key={module.id} className="space-y-1">
<button
                onClick={() => {
                  onModuleSelect(module.id);
                  toggleModule(module.id);
                }}
                className={`w-full flex flex-col items-start gap-1 px-3 py-4 rounded-lg hover:bg-gray-100 transition-colors text-left min-h-[60px] ${
                  selectedModuleId === module.id ? 'bg-blue-50 border-2 border-blue-200 ring-2 ring-blue-100/50' : ''
                }`}
              >
                <ChevronDown
                  size={16}
                  className={`flex-shrink-0 transition-transform ${
                    expandedModules.has(module.id) ? 'rotate-0' : '-rotate-90'
                  }`}
                />
                <span className="font-semibold text-sm text-gray-900 min-w-0 flex-1 whitespace-normal break-words leading-tight" title={module.title}>
                  {module.title}
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex-shrink-0">
                  Week {module.releaseWeek}
                </span>
              </button>
              

              {/* Lessons */}
              {expandedModules.has(module.id) && (
                <div className="ml-6 space-y-1">
                  {getLessonsForModule(module.id).length === 0 ? (
                    <p className="text-xs text-gray-400 py-2">No lessons</p>
                  ) : (
                    getLessonsForModule(module.id).map(lesson => (
                      <button
                        key={lesson.id}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors text-left group"
                      >
                        <span className="text-xs font-semibold text-gray-400 group-hover:text-blue-600">
                          {lesson.contentType === 'video' && '▶'}
                          {lesson.contentType === 'pdf' && '📄'}
                          {lesson.contentType === 'text' && '📝'}
                        </span>
                        <span className="text-sm text-gray-700 group-hover:text-blue-600 flex-1 truncate">
                          {lesson.title}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Course Description */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600 line-clamp-3">{course.description}</p>
      </div>
    </aside>
  );
}
