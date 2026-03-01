"use client";

import { Megaphone, Pin, Clock } from "lucide-react";

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: "New Course Module Released: Advanced React Patterns",
    message: "We're excited to announce a new module covering advanced React patterns including render props, HOCs, and compound components. Check it out in your Full-Stack Web Development course!",
    author: "Dr. James Kowalski",
    date: "2 hours ago",
    pinned: true,
    type: "course"
  },
  {
    id: 2,
    title: "Upcoming Assignment Deadline - March 15",
    message: "Reminder: Your React Hooks assignment is due on March 15 at 11:59 PM. Make sure to submit your work on time to avoid late penalties.",
    author: "Prof. Sarah Chen",
    date: "5 hours ago",
    pinned: true,
    type: "deadline"
  },
  {
    id: 3,
    title: "Cohort Study Session - This Saturday",
    message: "Join us for a collaborative study session this Saturday at 2 PM. We'll be reviewing database design concepts and working through practice problems together.",
    author: "Admin Team",
    date: "1 day ago",
    pinned: false,
    type: "event"
  },
  {
    id: 4,
    title: "Platform Maintenance Scheduled",
    message: "The platform will undergo scheduled maintenance on March 20 from 2 AM to 4 AM EST. During this time, access may be temporarily unavailable.",
    author: "System Admin",
    date: "2 days ago",
    pinned: false,
    type: "system"
  },
  {
    id: 5,
    title: "New Learning Resources Added",
    message: "We've added supplementary materials including video tutorials and practice exercises to help you master JavaScript design patterns.",
    author: "Dr. Michael Torres",
    date: "3 days ago",
    pinned: false,
    type: "resource"
  }
];

export default function AnnouncementsPage() {
  return (
    <div className="max-w-6xl mx-auto ">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Announcements</h1>
        <p className="text-sm text-gray-500">Stay updated with the latest news and updates</p>
      </div>

      <div className="space-y-4">
        {ANNOUNCEMENTS.map((announcement) => (
          <div
            key={announcement.id}
            className={`bg-white rounded-xl border ${
              announcement.pinned ? "border-indigo-200 shadow-sm" : "border-gray-200"
            } p-6 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                announcement.type === "course" ? "bg-blue-100" :
                announcement.type === "deadline" ? "bg-red-100" :
                announcement.type === "event" ? "bg-green-100" :
                announcement.type === "system" ? "bg-yellow-100" :
                "bg-purple-100"
              }`}>
                <Megaphone className={`w-6 h-6 ${
                  announcement.type === "course" ? "text-blue-600" :
                  announcement.type === "deadline" ? "text-red-600" :
                  announcement.type === "event" ? "text-green-600" :
                  announcement.type === "system" ? "text-yellow-600" :
                  "text-purple-600"
                }`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {announcement.pinned && (
                      <Pin className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    )}
                    <h3 className="font-bold text-gray-900">{announcement.title}</h3>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">{announcement.message}</p>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="font-medium">{announcement.author}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{announcement.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {ANNOUNCEMENTS.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No announcements yet</h3>
          <p className="text-sm text-gray-500">Check back later for updates</p>
        </div>
      )}
    </div>
  );
}
