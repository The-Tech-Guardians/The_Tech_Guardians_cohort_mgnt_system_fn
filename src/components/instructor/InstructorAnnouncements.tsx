'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/application-component/input';
import { Textarea } from '@/components/application-component/textarrea';
import { Trash2, Send, Users, BookOpen, Plus, Eye } from 'lucide-react';

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
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

// Inline Badge component
const Badge = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

// Inline Select components
const Select = ({ value, onValueChange, children, className = '' }: {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`relative ${className}`}>
    <select
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    >
      {children}
    </select>
  </div>
);

const SelectTrigger = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);

const SelectValue = ({ placeholder, className = '' }: { placeholder?: string; className?: string }) => (
  <div className={className}>{placeholder}</div>
);

const SelectContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);

const SelectItem = ({ value, children, className = '' }: { value: string; children: React.ReactNode; className?: string }) => (
  <option value={value} className={className}>
    {children}
  </option>
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
  sendEmailNotification: boolean;
  emailSent: boolean;
  courseName?: string;
  cohortName?: string;
  creatorName?: string;
}

interface Course {
  id: string;
  title: string;
}

interface Cohort {
  id: string;
  name: string;
}

export const InstructorAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [showReadDetails, setShowReadDetails] = useState(false);
  const [searchUser, setSearchUser] = useState('');
  const [instructorNotifications, setInstructorNotifications] = useState<Array<{
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning';
    timestamp: Date;
    read: boolean;
  }>>([]);
  const [filter, setFilter] = useState<'ALL' | 'COHORT' | 'COURSE'>('ALL');
  const [formData, setFormData] = useState({
    type: 'COURSE' as 'COHORT' | 'COURSE',
    cohortId: '',
    courseId: '',
    title: '',
    content: '',
    sendEmailNotification: true
  });
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning';
    timestamp: Date;
    read: boolean;
  }>>([]);

  const addNotification = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const newNotification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
      read: false
    };
    setInstructorNotifications((prev: any) => [newNotification, ...prev.slice(0, 9)]);
  };

  const markAsRead = async (id: string) => {
    try {
      // In real implementation, this would call an API
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAnnouncements((prev: any) => 
        prev.map((announcement: any) => 
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
    loadCourses();
    loadCohorts();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements/instructor', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setAnnouncements(data.announcements || []);
    } catch (error) {
      console.error('Failed to load announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const response = await fetch('/api/courses/instructor', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };

  const loadCohorts = async () => {
    try {
      const response = await fetch('/api/cohorts/instructor', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCohorts(data.cohorts || []);
    } catch (error) {
      console.error('Failed to load cohorts:', error);
    }
  };

  const handleCreateAnnouncement = async () => {
    try {
      if (!formData.title || !formData.content) {
        alert('Please fill in all required fields');
        return;
      }

      if (formData.type === 'COHORT' && !formData.cohortId) {
        alert('Please select a cohort for cohort-level announcements');
        return;
      }

      if (formData.type === 'COURSE' && !formData.courseId) {
        alert('Please select a course for course-level announcements');
        return;
      }

      const payload = {
        type: formData.type,
        title: formData.title,
        content: formData.content,
        sendEmailNotification: formData.sendEmailNotification,
        ...(formData.type === 'COHORT' ? { cohortId: formData.cohortId } : {}),
        ...(formData.type === 'COURSE' ? { courseId: formData.courseId } : {})
      };

      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await loadAnnouncements();
        setShowCreateForm(false);
        setFormData({
          type: 'COURSE',
          cohortId: '',
          courseId: '',
          title: '',
          content: '',
          sendEmailNotification: true
        });
        alert('Announcement created successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to create announcement: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to create announcement:', error);
      alert('Failed to create announcement');
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await loadAnnouncements();
        alert('Announcement deleted successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to delete announcement: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to delete announcement:', error);
      alert('Failed to delete announcement');
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
    return <div className="p-6">Loading announcements...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Notifications Panel */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <div className="text-sm text-gray-500">
            {instructorNotifications.filter(n => !n.read).length} unread
          </div>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {instructorNotifications.length === 0 ? (
            <div className="text-gray-500 text-xs p-2 bg-gray-50 rounded">
              No new notifications
            </div>
          ) : (
            instructorNotifications.map((notification) => (
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
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {notification.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => {
                        setInstructorNotifications(prev => 
                          prev.map(notif => 
                            notif.id === notification.id ? { ...notif, read: true } : notif
                          )
                        );
                      }}
                      className="text-gray-400 hover:text-gray-600 text-xs ml-2"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Announcements</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Announcement
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        <Button
          variant={filter === 'ALL' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('ALL')}
        >
          All
        </Button>
        <Button
          variant={filter === 'COHORT' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('COHORT')}
        >
          <Users className="h-4 w-4 mr-1" />
          Cohort
        </Button>
        <Button
          variant={filter === 'COURSE' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('COURSE')}
        >
          <BookOpen className="h-4 w-4 mr-1" />
          Course
        </Button>
      </div>

      {/* Create Announcement Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Announcement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Announcement Type</label>
              <Select value={formData.type} onValueChange={(value: string) => 
                setFormData({ ...formData, type: value as 'COHORT' | 'COURSE', cohortId: '', courseId: '' })
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COHORT">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Cohort-level Announcement
                    </div>
                  </SelectItem>
                  <SelectItem value="COURSE">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Course-level Announcement
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type === 'COHORT' && (
              <div>
                <label className="block text-sm font-medium mb-2">Select Cohort</label>
                <Select value={formData.cohortId} onValueChange={(value: string) => 
                  setFormData({ ...formData, cohortId: value })
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a cohort" />
                  </SelectTrigger>
                  <SelectContent>
                    {cohorts.map(cohort => (
                      <SelectItem key={cohort.id} value={cohort.id}>
                        {cohort.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.type === 'COURSE' && (
              <div>
                <label className="block text-sm font-medium mb-2">Select Course</label>
                <Select value={formData.courseId} onValueChange={(value: string) => 
                  setFormData({ ...formData, courseId: value })
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={formData.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter announcement title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <Textarea
                id="announcement-content"
                name="content"
                placeholder="Enter announcement content"
                value={formData.content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, content: e.target.value })}
                required={false}
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sendEmail"
                checked={formData.sendEmailNotification}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, sendEmailNotification: e.target.checked })}
              />
              <label htmlFor="sendEmail" className="text-sm font-medium">
                Send email notification to all recipients
              </label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateAnnouncement} className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Create Announcement
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Announcements List */}
      {filteredAnnouncements.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {filter === 'ALL' ? 'No announcements yet' : `No ${filter.toLowerCase()} announcements`}
            </h3>
            <p className="text-gray-500">
              {filter === 'ALL' 
                ? 'Create your first announcement to keep your students informed.'
                : `No ${filter.toLowerCase()} announcements available at the moment.`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getTypeIcon(announcement.type)}
                      <Badge className={getTypeBadgeColor(announcement.type)}>
                        {announcement.type}
                      </Badge>
                      {announcement.sendEmailNotification && (
                        <Badge className={announcement.emailSent ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {announcement.emailSent ? 'Email Sent' : 'Email Pending'}
                        </Badge>
                      )}
                      <span className="text-sm text-gray-500">
                        {formatDate(announcement.createdAt)}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{announcement.title}</CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
                        {announcement.creatorName || 'You'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
