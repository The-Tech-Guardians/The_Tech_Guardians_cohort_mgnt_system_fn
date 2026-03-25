'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/application-component/input';
import { Textarea } from '@/components/application-component/textarrea';
import { Trash2, Send, Users, BookOpen } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import { announcementApi } from '@/lib/announcementApi';

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
  <select
    value={value}
    onChange={(e) => onValueChange?.(e.target.value)}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
  >
    {children}
  </select>
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
  <option key={value} value={value} className={className}>
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
  readCount?: number;
  totalRecipients?: number;
  readByUsers?: Array<{
    id: string;
    name: string;
    email: string;
    readAt: string;
  }>;
  emailSent: boolean;
}

interface Cohort {
  id: string;
  name: string;
}

interface Course {
  id: string;
  title: string;
}

export const AnnouncementManagement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [showReadDetails, setShowReadDetails] = useState(false);
  const [searchUser, setSearchUser] = useState('');
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning';
    timestamp: Date;
    read: boolean;
  }>>([]);
  const [formData, setFormData] = useState({
    type: 'COHORT' as 'COHORT' | 'COURSE',
    cohortId: '',
    courseId: '',
    title: '',
    content: '',
    sendEmailNotification: true
  });

  useEffect(() => {
    loadAnnouncements();
    loadCohorts();
    loadCourses();

    // Start real-time notification simulation
    const cleanup = simulateRealTimeUpdates();
    
    return cleanup;
  }, []);

  useEffect(() => {
    // Add notification when announcement is created successfully
    if (announcements.length > 0) {
      addNotification('Announcement management system is active', 'info');
    }
  }, [announcements.length]);

  const loadAnnouncements = async () => {
    try {
      const data = await announcementApi.getAllAnnouncements();
      setAnnouncements(data.announcements || []);
    } catch (error) {
      console.error('Failed to load announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCohorts = async () => {
    try {
      const response = await adminApi.getCohorts();
      setCohorts(response.cohorts || []);
    } catch (error) {
      console.error('Failed to load cohorts:', error);
    }
  };

  const loadCourses = async () => {
    try {
      const response = await adminApi.getCourses();
      setCourses(response.courses || []);
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };

  const sendNotificationToAllCohorts = async (title: string, content: string) => {
    try {
      // In production, this would be a real email service
      // For now, we'll simulate the email sending
      const allCohorts = await adminApi.getCohorts();
      
      if (allCohorts.cohorts && allCohorts.cohorts.length > 0) {
        // Simulate sending emails to all cohort members
        const emailPromises = allCohorts.cohorts.map((cohort: any) => 
          simulateEmailSending(cohort.name, title, content)
        );
        
        await Promise.all(emailPromises);
        addNotification(
          `Email notification sent to ${allCohorts.cohorts.length} cohorts successfully!`,
          'success'
        );
      } else {
        addNotification('No cohorts found to send notifications', 'warning');
      }
    } catch (error: any) {
      addNotification(`Failed to send cohort notifications: ${error.message}`, 'warning');
    }
  };

  const simulateEmailSending = async (cohortName: string, title: string, content: string) => {
    // Simulate email sending delay
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Email sent to ${cohortName}: ${title}`);
        resolve({ success: true, cohortName });
      }, Math.random() * 1000 + 500); // Random delay between 0.5-1.5 seconds
    });
  };

  const handleCreateAnnouncement = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      addNotification('Please fill in all required fields', 'warning');
      return;
    }

    if (formData.type === 'COHORT' && !formData.cohortId) {
      addNotification('Please select a cohort for cohort-level announcements', 'warning');
      return;
    }

    if (formData.type === 'COURSE' && !formData.courseId) {
      addNotification('Please select a course for course-level announcements', 'warning');
      return;
    }

    try {
      await announcementApi.createAnnouncement({
        type: formData.type,
        cohortId: formData.type === 'COHORT' ? formData.cohortId : undefined,
        courseId: formData.type === 'COURSE' ? formData.courseId : undefined,
        title: formData.title,
        content: formData.content,
        sendEmailNotification: formData.sendEmailNotification
      });

      // Send email notification to all cohorts if requested
      if (formData.sendEmailNotification) {
        await sendNotificationToAllCohorts(formData.title, formData.content);
      }

      // Reset form
      setFormData({
        type: 'COHORT',
        cohortId: '',
        courseId: '',
        title: '',
        content: '',
        sendEmailNotification: true
      });
      setShowCreateForm(false);
      
      await loadAnnouncements();
      addNotification(`Announcement "${formData.title}" created successfully!`, 'success');
    } catch (error: any) {
      addNotification(`Failed to create announcement: ${error.message}`, 'warning');
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      await announcementApi.deleteAnnouncement(id);
      await loadAnnouncements();
      addNotification('Announcement deleted successfully!', 'success');
    } catch (error: any) {
      addNotification(`Failed to delete announcement: ${error.message}`, 'warning');
    }
  };

  const handleViewReadDetails = async (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setShowReadDetails(true);
    setSearchUser('');
  };

  const getFilteredReadUsers = () => {
    if (!selectedAnnouncement?.readByUsers) return [];
    
    return selectedAnnouncement.readByUsers.filter(user => 
      user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.email.toLowerCase().includes(searchUser.toLowerCase())
    );
  };

  const addNotification = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const newNotification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep max 10 notifications
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const simulateRealTimeUpdates = () => {
    // Simulate real-time notification when users read announcements
    const interval = setInterval(() => {
      // In real implementation, this would be WebSocket or Server-Sent Events
      const randomRead = Math.random() > 0.7; // 30% chance of new read
      if (randomRead && announcements.length > 0) {
        const randomAnnouncement = announcements[Math.floor(Math.random() * announcements.length)];
        const randomUser = `User${Math.floor(Math.random() * 1000)}`;
        addNotification(
          `${randomUser} read announcement: "${randomAnnouncement.title}"`,
          'success'
        );
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  };

  const getTypeIcon = (type: string) => {
    return type === 'COHORT' ? <Users className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />;
  };

  const getTypeBadgeColor = (type: string) => {
    return type === 'COHORT' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  if (loading) {
    return <div className="p-6">Loading announcements...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Notification Statistics */}
      <div className="mb-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{notifications.length}</div>
            <div className="text-xs text-blue-500">Total Notifications</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{notifications.filter(n => n.read).length}</div>
            <div className="text-xs text-green-500">Read Notifications</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{notifications.filter(n => !n.read).length}</div>
            <div className="text-xs text-red-500">Unread Notifications</div>
          </div>
        </div>
      </div>
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-xs font-semibold">System Notifications</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setNotifications([])}
          >
            Clear All
          </Button>
        </div>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-gray-500 text-xs p-1 bg-gray-50 rounded">
              No new notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`p-1 rounded border border-l-1 text-xs ${
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markNotificationAsRead(notification.id)}
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

      <div className="flex justify-between items-center">
        <Button onClick={() => setShowCreateForm(true)}>
          New
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
                <option key="placeholder" value="">Select announcement type</option>
                <option key="cohort" value="COHORT">Cohort-level Announcement</option>
                <option key="course" value="COURSE">Course-level Announcement</option>
              </Select>
            </div>

            {formData.type === 'COHORT' && (
              <div>
                <label className="block text-sm font-medium mb-2">Select Cohort</label>
                <Select value={formData.cohortId} onValueChange={(value: string) => 
                  setFormData({ ...formData, cohortId: value })
                }>
                  <option key="cohort-placeholder" value="">Select a cohort</option>
                  {cohorts.map(cohort => (
                    <option key={cohort.id} value={cohort.id}>
                      {cohort.name}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            {formData.type === 'COURSE' && (
              <div>
                <label className="block text-sm font-medium mb-2">Select Course</label>
                <Select value={formData.courseId} onValueChange={(value: string) => 
                  setFormData({ ...formData, courseId: value })
                }>
                  <option key="course-placeholder" value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
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
                onChange={(e) => setFormData({ ...formData, sendEmailNotification: e.target.checked })}
              />
              <label htmlFor="sendEmail" className="text-sm font-medium">
                Send email notification to all recipients
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendNotificationToAllCohorts('System Notification', 'Important system update for all cohorts')}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Notify All Cohorts
              </Button>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateAnnouncement} className="flex items-center gap-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700">
                <Send className="h-4 w-4" />
                Send
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Announcements List */}
      <div className="grid gap-4">
        {announcements.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No announcements found.
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(announcement.type)}
                      <Badge className={getTypeBadgeColor(announcement.type)}>
                        {announcement.type}
                      </Badge>
                      {announcement.sendEmailNotification && (
                        <Badge className="bg-green-100 text-green-800">
                          Email Sent
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold">{announcement.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-blue-600 font-medium">
                        👁️ {announcement.readCount || 0} / {announcement.totalRecipients || 0} read
                      </span>
                      <span className="text-gray-500">
                        {announcement.totalRecipients ? 
                          Math.round(((announcement.readCount || 0) / announcement.totalRecipients) * 100) : 0
                        }% read rate
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewReadDetails(announcement)}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
                {announcement.type === 'COHORT' && announcement.cohortId && (
                  <p className="text-sm text-gray-500 mt-2">
                    Target Cohort: {cohorts.find(c => c.id === announcement.cohortId)?.name || announcement.cohortId}
                  </p>
                )}
                {announcement.type === 'COURSE' && announcement.courseId && (
                  <p className="text-sm text-gray-500 mt-2">
                    Target Course: {courses.find(c => c.id === announcement.courseId)?.title || announcement.courseId}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Read Details Modal */}
      {showReadDetails && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Notification Read Details</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{selectedAnnouncement.title}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowReadDetails(false)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-blue-600 font-medium">
                    👁️ {selectedAnnouncement.readCount || 0} / {selectedAnnouncement.totalRecipients || 0} users read
                  </span>
                  <span className="text-gray-500">
                    {selectedAnnouncement.totalRecipients ? 
                      Math.round(((selectedAnnouncement.readCount || 0) / selectedAnnouncement.totalRecipients) * 100) : 0
                    }% read rate
                  </span>
                </div>
                
                <div>
                  <Input
                    placeholder="Search by name or email..."
                    value={searchUser}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchUser(e.target.value)}
                  />
                </div>

                <div className="max-h-60 overflow-y-auto">
                  {getFilteredReadUsers().length === 0 ? (
                    <p className="text-center text-gray-500 py-4">
                      {searchUser ? 'No users found matching your search' : 'No users have read this notification yet'}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {getFilteredReadUsers().map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-green-600">✓ Read</p>
                            <p className="text-xs text-gray-500">
                              {new Date(user.readAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
