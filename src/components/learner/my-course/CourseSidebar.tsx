'use client';

import { Lock } from 'lucide-react';
import { useState } from 'react';

interface Lesson {
  id: string;
  name: string;
  duration: string;
  status: 'completed' | 'active' | 'locked' | 'available';
}

interface Module {
  id: string;
  title: string;
  week: string;
  lessons: Lesson[];
  locked?: boolean;
}

export default function CourseSidebar() {
  const [openModules, setOpenModules] = useState<string[]>(['1', '2', '3']);

  const modules: Module[] = [
    {
      id: '1',
      title: 'HTML & CSS Foundations',
      week: 'W1–2',
      lessons: [
        { id: '1', name: 'Intro to HTML', duration: '8m', status: 'completed' },
        { id: '2', name: 'Semantic Elements', duration: '12m', status: 'completed' },
        { id: '3', name: 'CSS Box Model', duration: '15m', status: 'completed' },
        { id: '4', name: 'Flexbox Deep Dive', duration: '20m', status: 'completed' },
        { id: '5', name: 'CSS Grid Layout', duration: '18m', status: 'completed' },
      ],
    },
    {
      id: '2',
      title: 'JavaScript Core',
      week: 'W3–4',
      lessons: [
        { id: '6', name: 'Variables & Types', duration: '14m', status: 'completed' },
        { id: '7', name: 'Functions & Scope', duration: '22m', status: 'completed' },
        { id: '8', name: 'Async / Promises', duration: '25m', status: 'active' },
        { id: '9', name: 'ES6+ Features', duration: '19m', status: 'available' },
        { id: '10', name: 'DOM Manipulation', duration: '21m', status: 'available' },
      ],
    },
    {
      id: '3',
      title: 'React Fundamentals',
      week: 'W5–6',
      lessons: [
        { id: '11', name: 'Components & Props', duration: '24m', status: 'available' },
        { id: '12', name: 'State & Hooks', duration: '30m', status: 'available' },
        { id: '13', name: 'useEffect & Lifecycle', duration: '28m', status: 'locked' },
        { id: '14', name: 'Context API', duration: '20m', status: 'locked' },
      ],
    },
    {
      id: '4',
      title: 'Node.js & APIs',
      week: 'W7–8',
      lessons: [],
      locked: true,
    },
  ];

  const toggleModule = (id: string) => {
    setOpenModules(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  return (
    <aside className="w-[260px] lg:w-[240px] xl:w-[260px] border-r border-gray-200 bg-white overflow-y-auto py-5 h-full scrollbar-hide shadow-sm">
      <div className="px-5 pb-4 border-b border-gray-200 mb-4">
        <div className="font-['Syne'] font-bold text-sm mb-2 text-gray-900">Full-Stack Web Development</div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>🗓 12 Weeks</span>
          <span>·</span>
          <span>48 Lessons</span>
        </div>
      </div>

      <div className="mx-3 mb-4 flex items-center gap-2.5 p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
        <div className="relative w-10 h-10 flex-shrink-0">
          <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="16" fill="none" stroke="#E5E7EB" strokeWidth="3" />
            <circle cx="20" cy="20" r="16" fill="none" stroke="#10B981" strokeWidth="3"
              strokeDasharray="100.5" strokeDashoffset="65" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 grid place-items-center font-mono text-[10px] font-medium text-green-600">
            35%
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[11px] text-gray-600 mb-0.5">Overall Progress</div>
          <div className="font-['Syne'] text-[13px] font-semibold text-gray-900">17 / 48 Lessons</div>
        </div>
      </div>

      {modules.map(module => (
        <div key={module.id} className="mb-1">
          <div
            onClick={() => !module.locked && toggleModule(module.id)}
            className={`flex items-center justify-between px-5 py-2 font-['Syne'] text-[11px] font-semibold uppercase tracking-wider text-gray-600 hover:text-gray-900 cursor-pointer transition ${
              module.locked ? 'opacity-40' : ''
            }`}
          >
            <span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 mr-2">
                {module.week}
              </span>
              {module.title}
            </span>
            <span className={`text-[10px] transition-transform ${openModules.includes(module.id) ? 'rotate-180' : ''}`}>
              {module.locked ? <Lock className="w-3 h-3"/> : '▼'}
            </span>
          </div>
          {!module.locked && (
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: openModules.includes(module.id) ? '500px' : '0' }}
            >
              {module.lessons.map(lesson => (
                <div
                  key={lesson.id}
                  className={`flex items-center gap-2.5 px-5 pl-7 py-2 cursor-pointer transition border-l-2 border-transparent hover:bg-gray-50 ${
                    lesson.status === 'active' ? 'bg-indigo-50 border-l-indigo-500' : ''
                  } ${lesson.status === 'locked' ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <span className="text-sm w-4 text-center flex-shrink-0">
                    {lesson.status === 'completed' && <span className="text-green-500">✓</span>}
                    {lesson.status === 'active' && <span className="text-indigo-600">▶</span>}
                    {lesson.status === 'available' && <span className="text-gray-400">○</span>}
                    {lesson.status === 'locked' && '🔒'}
                  </span>
                  <span className={`text-[13px] flex-1 truncate ${
                    lesson.status === 'active' ? 'text-gray-900 font-medium' : 'text-gray-600'
                  }`}>
                    {lesson.name}
                  </span>
                  <span className="font-mono text-[10px] text-gray-500">{lesson.duration}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
}
