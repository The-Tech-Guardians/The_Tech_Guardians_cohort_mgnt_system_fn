const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface InstructorStats {
  totalCourses: number;
  totalEnrollments: number;
  activeStudents: number;
  completionRate: number;
  avgRating: number;
  newEnrollments: number;
  lessonsPublished: number;
  coursesCompleted: number;
}

interface InstructorCourse {
  id: string;
  title: string;
  enrolled: string;
  modules: number;
  lessons: number;
  cohort: string;
  published: boolean;
  completion: number;
  modules_data?: Array<{
    id: string;
    week: string;
    title: string;
    lessons: number;
    published: boolean;
  }>;
}

interface CourseFormData {
  title: string;
  description: string;
  cohortName?: string;
  isPublished?: boolean;
}

interface ModuleFormData {
  courseId: string;
  title: string;
  description: string;
  orderIndex: number;
  releaseWeek: number;
  isPublished?: boolean;
}

interface LessonFormData {
  moduleId: string;
  title: string;
  content?: string;
  videoUrl?: string;
  orderIndex: number;
  isPublished?: boolean;
  lessonType?: 'video' | 'text' | 'quiz' | 'assignment';
}

interface AssessmentFormData {
  courseId: string;
  moduleId?: string;
  title: string;
  description: string;
  questions: Array<{
    question: string;
    type: 'multiple-choice' | 'true-false' | 'short-answer';
    options?: string[];
    correctAnswer: string | number;
    points: number;
  }>;
  timeLimit?: number;
  passingScore?: number;
  isPublished?: boolean;
}

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token') || localStorage.getItem('token');
  }
  return null;
};

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getAuthToken() && { 'Authorization': `Bearer ${getAuthToken()}` }),
});

export const instructorApi = {
  async getDashboardStats(): Promise<InstructorStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/instructor/dashboard`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Instructor dashboard stats error:', error);
      // Return mock data for development
      return {
        totalCourses: 5,
        totalEnrollments: 142,
        activeStudents: 89,
        completionRate: 78.5,
        avgRating: 4.6,
        newEnrollments: 12,
        lessonsPublished: 67,
        coursesCompleted: 23
      };
    }
  },

  async getInstructorCourses(): Promise<InstructorCourse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch instructor courses');
      }

      const data = await response.json();
      return data.courses || data.data || data;
    } catch (error) {
      console.error('Instructor courses error:', error);
      // Return mock data for development
      return [
        {
          id: '1',
          title: 'Advanced JavaScript',
          enrolled: '45',
          modules: 8,
          lessons: 32,
          cohort: 'Cohort A',
          published: true,
          completion: 78,
          modules_data: [
            { id: '1', week: 'Week 1', title: 'Introduction', lessons: 4, published: true },
            { id: '2', week: 'Week 2', title: 'ES6 Features', lessons: 4, published: true },
            { id: '3', week: 'Week 3', title: 'Async Programming', lessons: 4, published: true },
            { id: '4', week: 'Week 4', title: 'React Basics', lessons: 4, published: true },
            { id: '5', week: 'Week 5', title: 'Advanced React', lessons: 4, published: true },
            { id: '6', week: 'Week 6', title: 'State Management', lessons: 4, published: true },
            { id: '7', week: 'Week 7', title: 'Testing', lessons: 4, published: true },
            { id: '8', week: 'Week 8', title: 'Project', lessons: 4, published: true }
          ]
        },
        {
          id: '2',
          title: 'Python for Data Science',
          enrolled: '38',
          modules: 6,
          lessons: 24,
          cohort: 'Cohort B',
          published: true,
          completion: 65,
          modules_data: [
            { id: '1', week: 'Week 1', title: 'Python Basics', lessons: 4, published: true },
            { id: '2', week: 'Week 2', title: 'NumPy & Pandas', lessons: 4, published: true },
            { id: '3', week: 'Week 3', title: 'Data Visualization', lessons: 4, published: true },
            { id: '4', week: 'Week 4', title: 'Machine Learning Intro', lessons: 4, published: true },
            { id: '5', week: 'Week 5', title: 'Deep Learning', lessons: 4, published: true },
            { id: '6', week: 'Week 6', title: 'Final Project', lessons: 4, published: true }
          ]
        },
        {
          id: '3',
          title: 'Web Development Bootcamp',
          enrolled: '59',
          modules: 10,
          lessons: 40,
          cohort: 'Cohort C',
          published: true,
          completion: 82,
          modules_data: [
            { id: '1', week: 'Week 1', title: 'HTML & CSS', lessons: 4, published: true },
            { id: '2', week: 'Week 2', title: 'JavaScript Fundamentals', lessons: 4, published: true },
            { id: '3', week: 'Week 3', title: 'DOM Manipulation', lessons: 4, published: true },
            { id: '4', week: 'Week 4', title: 'Advanced JavaScript', lessons: 4, published: true },
            { id: '5', week: 'Week 5', title: 'React Introduction', lessons: 4, published: true },
            { id: '6', week: 'Week 6', title: 'React Advanced', lessons: 4, published: true },
            { id: '7', week: 'Week 7', title: 'Node.js', lessons: 4, published: true },
            { id: '8', week: 'Week 8', title: 'Databases', lessons: 4, published: true },
            { id: '9', week: 'Week 9', title: 'Deployment', lessons: 4, published: true },
            { id: '10', week: 'Week 10', title: 'Capstone Project', lessons: 4, published: true }
          ]
        }
      ];
    }
  },

  async getRecentStudentActivity(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/instructor/activity`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recent activity');
      }

      const data = await response.json();
      return data.activities || data.data || data;
    } catch (error) {
      console.error('Recent activity error:', error);
      // Return mock data for development
      return [
        { student: "Sarah Johnson", action: "completed", target: "Module 3", time: "2 min ago" },
        { student: "Mike Chen", action: "started", target: "Lesson 4", time: "15 min ago" },
        { student: "Emma Davis", action: "submitted", target: "Assessment 2", time: "1 hour ago" },
        { student: "James Wilson", action: "completed", target: "Course Introduction", time: "2 hours ago" },
        { student: "Lisa Brown", action: "enrolled", target: "Advanced JavaScript", time: "3 hours ago" }
      ];
    }
  },

  // Course Management
  async createCourse(courseData: CourseFormData): Promise<InstructorCourse> {
    try {
      const response = await fetch(`${API_BASE_URL}/instructor/courses`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error('Failed to create course');
      }

      const data = await response.json();
      return data.course || data.data || data;
    } catch (error) {
      console.error('Create course error:', error);
      throw new Error('Failed to create course');
    }
  },

  async updateCourse(courseId: string, courseData: Partial<CourseFormData>): Promise<InstructorCourse> {
    try {
      const response = await fetch(`${API_BASE_URL}/instructor/courses/${courseId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error('Failed to update course');
      }

      const data = await response.json();
      return data.course || data.data || data;
    } catch (error) {
      console.error('Update course error:', error);
      throw new Error('Failed to update course');
    }
  },

  async deleteCourse(courseId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/instructor/courses/${courseId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }
    } catch (error) {
      console.error('Delete course error:', error);
      throw new Error('Failed to delete course');
    }
  },

  // Module Management
  async getCourseModules(courseId: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/instructor/courses/${courseId}/modules`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch course modules');
      }

      const data = await response.json();
      return data.modules || data.data || data;
    } catch (error) {
      console.error('Get course modules error:', error);
      throw new Error('Failed to fetch course modules');
    }
  },

  async createModule(moduleData: ModuleFormData): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/instructor/modules`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(moduleData),
      });

      if (!response.ok) {
        throw new Error('Failed to create module');
      }

      const data = await response.json();
      return data.module || data.data || data;
    } catch (error) {
      console.error('Create module error:', error);
      throw new Error('Failed to create module');
    }
  },

  async updateModule(moduleId: string, moduleData: Partial<ModuleFormData>): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/instructor/modules/${moduleId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(moduleData),
      });

      if (!response.ok) {
        throw new Error('Failed to update module');
      }

      const data = await response.json();
      return data.module || data.data || data;
    } catch (error) {
      console.error('Update module error:', error);
      throw new Error('Failed to update module');
    }
  },

  async deleteModule(moduleId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/instructor/modules/${moduleId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete module');
      }
    } catch (error) {
      console.error('Delete module error:', error);
      throw new Error('Failed to delete module');
    }
  },

  // Lesson Management
  async getModuleLessons(moduleId: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/instructor/modules/${moduleId}/lessons`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch module lessons');
      }

      const data = await response.json();
      return data.lessons || data.data || data;
    } catch (error) {
      console.error('Get module lessons error:', error);
      throw new Error('Failed to fetch module lessons');
    }
  },

  async createLesson(lessonData: LessonFormData): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/instructor/lessons`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(lessonData),
      });

      if (!response.ok) {
        throw new Error('Failed to create lesson');
      }

      const data = await response.json();
      return data.lesson || data.data || data;
    } catch (error) {
      console.error('Create lesson error:', error);
      throw new Error('Failed to create lesson');
    }
  },

  async updateLesson(lessonId: string, lessonData: Partial<LessonFormData>): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/instructor/lessons/${lessonId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(lessonData),
      });

      if (!response.ok) {
        throw new Error('Failed to update lesson');
      }

      const data = await response.json();
      return data.lesson || data.data || data;
    } catch (error) {
      console.error('Update lesson error:', error);
      throw new Error('Failed to update lesson');
    }
  },

  async deleteLesson(lessonId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/instructor/lessons/${lessonId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete lesson');
      }
    } catch (error) {
      console.error('Delete lesson error:', error);
      throw new Error('Failed to delete lesson');
    }
  },

  // Assessment Management
  async getCourseAssessments(courseId: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/instructor/courses/${courseId}/assessments`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch course assessments');
      }

      const data = await response.json();
      return data.assessments || data.data || data;
    } catch (error) {
      console.error('Get course assessments error:', error);
      throw new Error('Failed to fetch course assessments');
    }
  },

  async createAssessment(assessmentData: AssessmentFormData): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/instructor/assessments`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(assessmentData),
      });

      if (!response.ok) {
        throw new Error('Failed to create assessment');
      }

      const data = await response.json();
      return data.assessment || data.data || data;
    } catch (error) {
      console.error('Create assessment error:', error);
      throw new Error('Failed to create assessment');
    }
  },

  async updateAssessment(assessmentId: string, assessmentData: Partial<AssessmentFormData>): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/instructor/assessments/${assessmentId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(assessmentData),
      });

      if (!response.ok) {
        throw new Error('Failed to update assessment');
      }

      const data = await response.json();
      return data.assessment || data.data || data;
    } catch (error) {
      console.error('Update assessment error:', error);
      throw new Error('Failed to update assessment');
    }
  },

  async deleteAssessment(assessmentId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/instructor/assessments/${assessmentId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete assessment');
      }
    } catch (error) {
      console.error('Delete assessment error:', error);
      throw new Error('Failed to delete assessment');
    }
  },
};
