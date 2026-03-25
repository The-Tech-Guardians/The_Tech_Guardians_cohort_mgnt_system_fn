'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { Users, BookOpen, Calendar, Bell } from 'lucide-react';

// Inline Card components to avoid import issues
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>
    {children}
  </h2>
);

// Inline Badge component
const Badge = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'COHORT' | 'COURSE';
  cohortId?: string;
  courseId?: string;
  createdBy: string;
  createdAt: string;
  creatorName?: string;
  courseName?: string;
  cohortName?: string;
  readAt?: string;
  isRead?: boolean;
}

export const AnnouncementView: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'COHORT' | 'COURSE'>('ALL');
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning';
    timestamp: Date;
    read: boolean;
  }>>([]);
  const [expandedNotifications, setExpandedNotifications] = useState<Set<string>>(new Set());

  const addNotification = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const newNotification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
  };

  const markAsRead = async (id: string) => {
    try {
      // In real implementation, this would call an API
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAnnouncements(prev => 
        prev.map(announcement => 
          announcement.id === id ? { ...announcement, isRead: true, readAt: new Date().toISOString() } : announcement
        )
      );
      
      addNotification(`Announcement marked as read`, 'success');
    } catch (error) {
      addNotification('Failed to mark announcement as read', 'warning');
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements/learner', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      // Mark all announcements as read when loaded
      const announcementsWithReadStatus = (data.announcements || []).map((announcement: any) => ({
        ...announcement,
        isRead: true, // Mark as read when loaded
        readAt: new Date().toISOString()
      }));
      
      setAnnouncements(announcementsWithReadStatus);
    } catch (error) {
      console.error('Failed to load announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'COHORT' ? <Users className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />;
  };

  const getTypeBadgeColor = (type: string) => {
    return type === 'COHORT' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const filteredAnnouncements = announcements.filter(announcement => 
    filter === 'ALL' || announcement.type === filter
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Notifications Panel */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setNotifications([])}
          >
            Clear All
          </Button>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-gray-500 text-xs p-2 bg-gray-50 rounded">
              No new notifications
            </div>
          ) : (
            notifications.map((notification: any) => (
              <div 
                key={notification.id}
                className={`p-2 rounded border-l-2 text-xs ${
                  notification.read 
                    ? 'bg-gray-50 border-gray-200' 
                    : notification.type === 'success' 
                      ? 'bg-green-50 border-green-400' 
                      : notification.type === 'warning'
                        ? 'bg-yellow-50 border-yellow-400'
                        : 'bg-blue-50 border-blue-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className={`text-xs ${
                      notification.read ? 'text-gray-600' : 
                      notification.type === 'success' ? 'text-green-700' :
                      notification.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                    }`}>
                      {expandedNotifications.has(notification.id) 
                        ? notification.message 
                        : notification.message.length > 100 
                          ? notification.message.substring(0, 100) + '...' 
                          : notification.message
                      }
                    </p>
                    {notification.message.length > 100 && (
                      <button
                        onClick={() => {
                          const newExpanded = new Set(expandedNotifications);
                          if (newExpanded.has(notification.id)) {
                            newExpanded.delete(notification.id);
                          } else {
                            newExpanded.add(notification.id);
                          }
                          setExpandedNotifications(newExpanded);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-xs mt-1 underline"
                      >
                        {expandedNotifications.has(notification.id) ? 'Show Less' : 'View All'}
                      </button>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {notification.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        markAsRead(notification.id);
                        setNotifications((prev: any) => 
                          prev.map((notif: any) => 
                            notif.id === notification.id ? { ...notif, read: true } : notif
                          )
                        );
                      }}
                      className="text-gray-400 hover:text-gray-600 text-xs"
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button
            variant={filter === 'ALL' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('ALL')}
          >
            All
          </Button>
          <Button
            variant={filter === 'COHORT' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('COHORT')}
          >
            <Users className="h-4 w-4" />
            Cohort
          </Button>
          <Button
            variant={filter === 'COURSE' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('COURSE')}
          >
            <BookOpen className="h-4 w-4" />
            Course
          </Button>
        </div>
        <div className="text-sm text-gray-500">
          {notifications.filter(n => !n.read).length} unread notifications
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Bell className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Announcements</h1>
        </div>
      </div>

      {filteredAnnouncements.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {filter === 'ALL' ? 'No announcements yet' : `No ${filter.toLowerCase()} announcements`}
            </h3>
            <p className="text-gray-500">
              {filter === 'ALL' 
                ? 'Check back later for important updates from your instructors and administrators.'
                : `No ${filter.toLowerCase()} announcements available at the moment.`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement: any) => (
            <div 
              key={announcement.id}
              onClick={() => {
                // Mark associated notifications as read when viewing announcement
                setNotifications((prev: any) => 
                  prev.map((notif: any) => 
                    notif.message.includes(announcement.title) 
                      ? { ...notif, read: true } 
                      : notif
                  )
                );
              }}
              className="cursor-pointer"
            >
              <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getTypeIcon(announcement.type)}
                      <Badge className={getTypeBadgeColor(announcement.type)}>
                        {announcement.type}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(announcement.createdAt)}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{announcement.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {announcement.content}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div>
                      {announcement.type === 'COHORT' ? (
                        <span>
                          Cohort: <span className="font-medium text-gray-700">
                            {announcement.cohortName || 'Your Cohort'}
                          </span>
                        </span>
                      ) : (
                        <span>
                          Course: <span className="font-medium text-gray-700">
                            {announcement.courseName || 'Your Course'}
                          </span>
                        </span>
                      )}
                    </div>
                    <div>
                      Posted by <span className="font-medium text-gray-700">
                        {announcement.creatorName || 'Instructor'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
