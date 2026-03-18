export interface Question {
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | number;
  points: number;
}

export interface Assessment {
  id: string;
  courseId: string;
  moduleId?: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number;
  passingScore?: number;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAssessmentForm {
  courseId: string;
  moduleId: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number;
  passingScore: number;
  isPublished: boolean;
}
