export interface Question {
  id?: string;
  type: 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY';
  questionText: string;
  question?: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  points: number;
  orderIndex?: number;
}

export interface CreateAssessment {
  title: string;
  description: string;
  type: "QUIZ" | "ASSIGNMENT";
  moduleId: string;
  timeLimitMinutes: number;
  passMark: number;
  retakeLimit: number;
  instantFeedback: boolean;
}

export interface UpdateAssessment {
  title?: string;
  description?: string;
  type?: "QUIZ" | "ASSIGNMENT";
  moduleId?: string;
  timeLimitMinutes?: number;
  passMark?: number;
  retakeLimit?: number;
  instantFeedback?: boolean;
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

// Re-export Assessment from index.ts for convenience in assessment-specific imports
import type { Assessment } from '@/types/index';
export { Assessment };
export type AssessmentResponse = {
  assessment: Assessment;
};


