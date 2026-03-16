export interface BackendCourse {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  cohortId: string;
  courseType: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Course extends BackendCourse {
  instructor?: string;
  progress?: number;
  modules?: number;
  lessons?: number;
}

export interface ExtendedCourse extends Course {
  instructor?: string;
  progress?: number;
  modules?: number;
  lessons?: number;
  nextLesson?: string;
  status?: string;
  thumbnail?: string;
  color?: string;
  enrolled?: number;
  cohort?: string;
  completion?: number;
  published?: boolean;
  modules_data?: Array<{
    id: string;
    week: string;
    title: string;
    lessons: number;
    published: boolean;
  }>;
}
