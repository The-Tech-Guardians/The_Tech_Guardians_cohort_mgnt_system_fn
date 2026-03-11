const API_BASE_URL = 'http://localhost:3000/api';

export const formatCourseType = (type: string): string => {
  const formatted: { [key: string]: string } = {
    COMPUTER_PROGRAMMING: 'Computer Programming',
    SOCIAL_MEDIA_BRANDING: 'Social Media Branding',
    ENTREPRENEURSHIP: 'Entrepreneurship',
    TEAM_MANAGEMENT: 'Team Management',
    SRHR: 'SRHR',
  };
  return formatted[type] || type;
};

export interface Course {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  instructorId: string;
  cohortId: string;
  courseType: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  orderIndex: number;
  releaseWeek: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  contentType: 'video' | 'pdf' | 'text';
  contentUrl: string;
  contentBody: string;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ApiResponse<T> {
  courses?: T[];
  course?: T;
  message?: string;
  error?: string;
  pagination?: PaginationInfo;
}

export const courseService = {
  async getLearnerEnrolledCourses(
    page: number = 1,
    limit: number = 20
  ): Promise<{ courses: Course[]; pagination: PaginationInfo }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/courses/learner/my-courses?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch courses');
      }

      const data: ApiResponse<Course> = await response.json();

      return {
        courses: data.courses || [],
        pagination: data.pagination || {
          page,
          limit,
          total: data.courses?.length || 0,
          pages: 1,
        },
      };
    } catch (error: any) {
      console.error('Course fetch error:', error);
      throw new Error(error.message || 'Failed to fetch courses');
    }
  },

  async getLearnerCohortCourses(
    page: number = 1,
    limit: number = 10
  ): Promise<{ courses: Course[]; pagination: PaginationInfo }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/courses/learner/my-courses?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch courses');
      }

      const data: ApiResponse<Course> = await response.json();

      return {
        courses: data.courses || [],
        pagination: data.pagination || {
          page,
          limit,
          total: data.courses?.length || 0,
          pages: 1,
        },
      };
    } catch (error: any) {
      console.error('Course fetch error:', error);
      throw new Error(error.message || 'Failed to fetch courses');
    }
  },

  async getCourseById(id: string): Promise<{ course: Course }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch course');
      }

      const data: ApiResponse<Course> = await response.json();

      if (!data.course) {
        throw new Error('Course not found');
      }

      return { course: data.course };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch course');
    }
  },

  async getCourseWithModulesAndLessons(courseId: string): Promise<{ course: Course; modules: Module[]; lessons: Lesson[] }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const courseUrl = `${API_BASE_URL}/courses/${courseId}`;
      const modulesUrl = `${API_BASE_URL}/modules/course/${courseId}`;
      
      console.log('Fetching course from:', courseUrl);
      console.log('Fetching modules from:', modulesUrl);

      const [courseRes, modulesRes] = await Promise.all([
        fetch(courseUrl, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }),
        fetch(modulesUrl, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }),
      ]);

      if (!courseRes.ok) {
        const errorData = await courseRes.json().catch(() => ({}));
        console.error('Course fetch error:', courseRes.status, errorData);
        throw new Error(`Failed to fetch course: ${courseRes.status}`);
      }

      const courseData = await courseRes.json();
      const modulesData = modulesRes.ok ? await modulesRes.json() : { modules: [] };

      const modules = modulesData.modules || [];
      const allLessons: Lesson[] = [];

      for (const module of modules) {
        try {
          const lessonsRes = await fetch(`${API_BASE_URL}/lessons/module/${module.id}`, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          });
          if (lessonsRes.ok) {
            const lessonsData = await lessonsRes.json();
            allLessons.push(...(lessonsData.lessons || []));
          }
        } catch (err) {
          console.error(`Failed to fetch lessons for module ${module.id}:`, err);
        }
      }

      return {
        course: courseData.course,
        modules,
        lessons: allLessons,
      };
    } catch (error: any) {
      console.error('getCourseWithModulesAndLessons error:', error);
      throw new Error(error.message || 'Failed to fetch course details');
    }
  },

  async getAllCourses(
    page: number = 1,
    limit: number = 20
  ): Promise<{ courses: Course[]; pagination: PaginationInfo }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/courses?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch courses');
      }

      const data: ApiResponse<Course> = await response.json();

      return {
        courses: data.courses || [],
        pagination: data.pagination || {
          page,
          limit,
          total: data.courses?.length || 0,
          pages: 1,
        },
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch courses');
    }
  },
};
