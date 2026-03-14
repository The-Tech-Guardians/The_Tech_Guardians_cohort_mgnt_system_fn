'use client'

import { useState, useEffect } from "react";
import { Calendar, Clock, Play, Pause, Edit, Plus, Trash2, CheckCircle, AlertCircle } from "lucide-react";

interface ScheduledContent {
  id: string;
  title: string;
  type: 'lesson' | 'module' | 'assessment';
  contentType: 'video' | 'pdf' | 'text' | 'quiz' | 'assignment';
  courseId: string;
  courseName: string;
  moduleId?: string;
  moduleName?: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'published' | 'draft';
  isRecurring: boolean;
  recurrencePattern?: 'weekly' | 'monthly';
  cohortId: string;
  cohortName: string;
  createdAt: string;
  updatedAt: string;
}

export default function SchedulePage() {
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduledContent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'lesson' as 'lesson' | 'module' | 'assessment',
    contentType: 'video' as 'video' | 'pdf' | 'text' | 'quiz' | 'assignment',
    courseId: '',
    moduleId: '',
    scheduledDate: '',
    scheduledTime: '09:00',
    status: 'scheduled' as 'scheduled' | 'published' | 'draft',
    isRecurring: false,
    recurrencePattern: 'weekly' as 'weekly' | 'monthly',
    cohortId: ''
  });

  useEffect(() => {
    fetchScheduledContent();
  }, []);

  const fetchScheduledContent = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockScheduledContent: ScheduledContent[] = [
        {
          id: '1',
          title: 'HTML Fundamentals - Introduction',
          type: 'lesson',
          contentType: 'video',
          courseId: 'course-1',
          courseName: 'Full Stack Web Development',
          moduleId: 'module-1',
          moduleName: 'HTML & CSS Fundamentals',
          scheduledDate: '2024-03-15',
          scheduledTime: '09:00',
          status: 'scheduled',
          isRecurring: false,
          cohortId: 'cohort-1',
          cohortName: 'Tech Guardians Cohort 2024',
          createdAt: '2024-03-10T10:00:00Z',
          updatedAt: '2024-03-10T10:00:00Z'
        },
        {
          id: '2',
          title: 'CSS Styling Workshop',
          type: 'lesson',
          contentType: 'video',
          courseId: 'course-1',
          courseName: 'Full Stack Web Development',
          moduleId: 'module-1',
          moduleName: 'HTML & CSS Fundamentals',
          scheduledDate: '2024-03-22',
          scheduledTime: '09:00',
          status: 'scheduled',
          isRecurring: true,
          recurrencePattern: 'weekly',
          cohortId: 'cohort-1',
          cohortName: 'Tech Guardians Cohort 2024',
          createdAt: '2024-03-10T10:30:00Z',
          updatedAt: '2024-03-10T10:30:00Z'
        },
        {
          id: '3',
          title: 'JavaScript Basics Quiz',
          type: 'assessment',
          contentType: 'quiz',
          courseId: 'course-1',
          courseName: 'Full Stack Web Development',
          moduleId: 'module-2',
          moduleName: 'JavaScript ES6+ Features',
          scheduledDate: '2024-03-29',
          scheduledTime: '14:00',
          status: 'draft',
          isRecurring: false,
          cohortId: 'cohort-1',
          cohortName: 'Tech Guardians Cohort 2024',
          createdAt: '2024-03-11T11:00:00Z',
          updatedAt: '2024-03-11T11:00:00Z'
        }
      ];
      
      setScheduledContent(mockScheduledContent);
    } catch (error) {
      console.error('Failed to fetch scheduled content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSchedule) {
        // Update existing schedule
        setScheduledContent(prev => prev.map(item => 
          item.id === editingSchedule.id 
            ? { ...item, ...formData, updatedAt: new Date().toISOString() }
            : item
        ));
      } else {
        // Create new schedule
        const newSchedule: ScheduledContent = {
          id: Date.now().toString(),
          ...formData,
          courseName: 'Full Stack Web Development',
          moduleName: formData.moduleId ? 'HTML & CSS Fundamentals' : undefined,
          cohortName: 'Tech Guardians Cohort 2024',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setScheduledContent(prev => [newSchedule, ...prev]);
      }
      
      // Reset form
      setFormData({
        title: '',
        type: 'lesson',
        contentType: 'video',
        courseId: '',
        moduleId: '',
        scheduledDate: '',
        scheduledTime: '09:00',
        status: 'scheduled',
        isRecurring: false,
        recurrencePattern: 'weekly',
        cohortId: ''
      });
      
      setShowCreateModal(false);
      setEditingSchedule(null);
    } catch (error) {
      console.error('Failed to save schedule:', error);
    }
  };

  const handleEdit = (schedule: ScheduledContent) => {
    setEditingSchedule(schedule);
    setFormData({
      title: schedule.title,
      type: schedule.type,
      contentType: schedule.contentType,
      courseId: schedule.courseId,
      moduleId: schedule.moduleId || '',
      scheduledDate: schedule.scheduledDate,
      scheduledTime: schedule.scheduledTime,
      status: schedule.status,
      isRecurring: schedule.isRecurring,
      recurrencePattern: schedule.recurrencePattern || 'weekly',
      cohortId: schedule.cohortId
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this scheduled content?')) {
      setScheduledContent(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleStatusToggle = async (id: string, newStatus: 'scheduled' | 'published' | 'draft') => {
    setScheduledContent(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: newStatus, updatedAt: new Date().toISOString() }
        : item
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return <Play size={16} />;
      case 'module': return <CheckCircle size={16} />;
      case 'assessment': return <AlertCircle size={16} />;
      default: return <Calendar size={16} />;
    }
  };

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'video': return '🎥';
      case 'pdf': return '📄';
      case 'text': return '📝';
      case 'quiz': return '❓';
      case 'assignment': return '📋';
      default: return '📁';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Content Schedule</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Schedule</h1>
          <p className="text-gray-600">Manage weekly content release and cohort timelines</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          Schedule Content
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-indigo-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{scheduledContent.length}</p>
              <p className="text-sm text-gray-600">Total Scheduled</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <Play className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {scheduledContent.filter(item => item.status === 'published').length}
              </p>
              <p className="text-sm text-gray-600">Published</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {scheduledContent.filter(item => item.status === 'scheduled').length}
              </p>
              <p className="text-sm text-gray-600">Scheduled</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {scheduledContent.filter(item => item.isRecurring).length}
              </p>
              <p className="text-sm text-gray-600">Recurring</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Calendar View */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Content Releases</h3>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={day} className="text-center">
              <div className="text-sm font-medium text-gray-600 mb-2">{day}</div>
              <div className="bg-gray-50 rounded-lg p-2 min-h-[100px]">
                {/* Calendar content would go here */}
                <div className="text-sm text-gray-500">15</div>
                {index === 4 && (
                  <div className="mt-1 text-xs bg-blue-100 text-blue-800 rounded p-1">
                    HTML Intro
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Content List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recurring
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scheduledContent.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getContentTypeIcon(item.contentType)}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.courseName}</div>
                        {item.moduleName && (
                          <div className="text-xs text-gray-400">{item.moduleName}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-900">
                      {getTypeIcon(item.type)}
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{item.scheduledDate}</div>
                      <div className="text-sm text-gray-500">{item.scheduledTime}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.isRecurring ? (
                      <span className="inline-flex items-center gap-1 text-sm text-blue-600">
                        <Clock size={16} />
                        {item.recurrencePattern}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {item.status === 'scheduled' && (
                        <button
                          onClick={() => handleStatusToggle(item.id, 'published')}
                          className="text-green-600 hover:text-green-900"
                          title="Publish now"
                        >
                          <Play size={16} />
                        </button>
                      )}
                      {item.status === 'published' && (
                        <button
                          onClick={() => handleStatusToggle(item.id, 'scheduled')}
                          className="text-blue-600 hover:text-blue-900"
                          title="Unpublish"
                        >
                          <Pause size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingSchedule ? 'Edit Schedule' : 'Schedule Content'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingSchedule(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter content title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'lesson' | 'module' | 'assessment' }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="lesson">Lesson</option>
                      <option value="module">Module</option>
                      <option value="assessment">Assessment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Type
                    </label>
                    <select
                      value={formData.contentType}
                      onChange={(e) => setFormData(prev => ({ ...prev, contentType: e.target.value as any }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="video">Video</option>
                      <option value="pdf">PDF</option>
                      <option value="text">Text</option>
                      <option value="quiz">Quiz</option>
                      <option value="assignment">Assignment</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.scheduledTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isRecurring}
                      onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Recurring</span>
                  </label>

                  {formData.isRecurring && (
                    <select
                      value={formData.recurrencePattern}
                      onChange={(e) => setFormData(prev => ({ ...prev, recurrencePattern: e.target.value as 'weekly' | 'monthly' }))}
                      className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'scheduled' | 'published' | 'draft' }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingSchedule(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
