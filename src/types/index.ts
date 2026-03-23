export * from './course';
export * from './user';
export * from './cohort';
export * from './lesson';

// Assessment related types
export interface Question {
  id?: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY';
  questionText: string;
  question?: string;
  options?: string[];
  correctAnswer: string | number;
  points: number;
}

export interface AssessmentAttempt {
  id: string;
  userId: string;
  assessmentId: string;
  score: number;
  submittedAt: string;
  status: 'PASSED' | 'FAILED' | 'PENDING';
}

export interface BackendModule {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  week?: string;
  published?: boolean;
  lessons?: number;
}

export interface Assessment {
  id: string;
  courseId: string;
  moduleId?: string;
  title: string;
  description: string;
  type: 'QUIZ' | 'ASSIGNMENT';
  questions: Question[];
  timeLimit?: number;
  timeLimitMinutes?: number;
  passingScore?: number;
  passMark?: number;
  isPublished?: boolean;
  status?: 'PUBLISHED' | 'DRAFT';
  createdAt?: string;
  updatedAt?: string;
  attempts?: AssessmentAttempt[];
  averageScore?: number;
  completionRate?: number;
  retakeLimit?: number;
  instantFeedback?: boolean;
}
