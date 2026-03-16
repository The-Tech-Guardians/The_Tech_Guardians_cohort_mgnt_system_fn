export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  instructorId: string;
  cohortId: string;
  courseType?: string;
  status: 'draft' | 'published';
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  moduleCount: number;
  learnerCount: number;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  orderIndex: number;
  releaseWeek: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  contentType: 'video' | 'pdf' | 'text';
  contentUrl: string;
  contentBody: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface Learner {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  cohortId: string;
  enrolledCourses: number;
  joinDate: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  courses?: Course[];
  modules?: Module[];
  lessons?: Lesson[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
