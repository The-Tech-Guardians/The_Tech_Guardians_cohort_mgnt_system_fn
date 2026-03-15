 "use client";

import { Megaphone, Pin, Clock } from "lucide-react";
import { useSidebar } from "../layout";
import { useState, useEffect } from "react";

// Using announcementService

interface Announcement {
  id: string;
  cohortId: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export default function AnnouncementsPage() {
  const { collapsed } = useSidebar();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await import('@/services/announcementService').then(m => m.announcementService.getLearnerAnnouncements());
        setAnnouncements(data.announcements || []);
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError('Failed to load announcements');
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };
  
  return (
    <div className={`transition-all duration-300 ${collapsed ? 'mx-4' : 'max-w-6xl mx-auto'}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Announcements</h1>
        <p className="text-sm text-gray-500">Stay updated with the latest news and updates</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-500">Loading announcements...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-xl border border-red-200">
            <Megaphone className="w-12 h-12 text-red-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to load announcements</h3>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        ) : announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-100">
                  <Megaphone className="w-6 h-6 text-blue-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-900">{announcement.title}</h3>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{announcement.content}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="font-medium">{announcement.createdBy}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(announcement.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No announcements yet</h3>
            <p className="text-sm text-gray-500">Check back later for updates</p>
          </div>
        )}
      </div>
    </div>
  );
}
