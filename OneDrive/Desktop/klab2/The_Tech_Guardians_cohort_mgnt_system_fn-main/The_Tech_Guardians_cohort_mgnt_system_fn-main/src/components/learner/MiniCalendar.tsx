"use client";

import { useState } from "react";


interface CalEvent {
  date: number; 
  color: "blue" | "purple" | "black";
}

interface MiniCalendarProps {
  events?: CalEvent[]; 
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay(); 
  return (day + 6) % 7; 
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ── Component ───────────────────────────────────────────────
export function MiniCalendar({ events = [] }: MiniCalendarProps) {
  const now   = new Date();
  const [viewYear,  setViewYear]  = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-indexed

  const todayDay   = now.getDate();
  const todayMonth = now.getMonth();
  const todayYear  = now.getFullYear();

  const daysInMonth  = getDaysInMonth(viewYear, viewMonth);
  const firstDayIdx  = getFirstDayOfMonth(viewYear, viewMonth); // 0=Mon
  const totalCells   = Math.ceil((firstDayIdx + daysInMonth) / 7) * 7;

  // Build a map: day → dots[]
  const eventMap = new Map<number, ("blue"|"purple"|"black")[]>();
  events.forEach(({ date, color }) => {
    if (!eventMap.has(date)) eventMap.set(date, []);
    eventMap.get(date)!.push(color);
  });

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const isToday = (d: number) =>
    d === todayDay && viewMonth === todayMonth && viewYear === todayYear;

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          aria-label="Previous month"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <div className="flex items-center gap-1.5 text-[12.5px] font-bold text-gray-700">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8"  y1="2" x2="8"  y2="6"/>
            <line x1="3"  y1="10" x2="21" y2="10"/>
          </svg>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </div>

        <button
          onClick={nextMonth}
          className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          aria-label="Next month"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {["Mo","Tu","We","Th","Fr","Sa","Su"].map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-0.5">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: totalCells }).map((_, cellIdx) => {
          const dayNum = cellIdx - firstDayIdx + 1;
          const valid  = dayNum >= 1 && dayNum <= daysInMonth;
          const dots   = valid ? (eventMap.get(dayNum) ?? []) : [];

          return (
            <div key={cellIdx} className="flex flex-col items-center gap-0.5">
              {valid ? (
                <>
                  <div className={`
                    w-7 h-7 rounded-full flex items-center justify-center
                    text-[12px] font-semibold cursor-pointer transition-all
                    ${isToday(dayNum)
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "text-gray-600 hover:bg-gray-100"}
                  `}>
                    {dayNum}
                  </div>
                  <div className="flex gap-0.5 h-1">
                    {dots.map((dot, i) => (
                      <span key={i} className={`w-1 h-1 rounded-full ${
                        dot === "blue"   ? "bg-blue-500"   :
                        dot === "purple" ? "bg-purple-500" :
                                           "bg-gray-800"
                      }`}/>
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-7 h-7" /> // empty cell
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}