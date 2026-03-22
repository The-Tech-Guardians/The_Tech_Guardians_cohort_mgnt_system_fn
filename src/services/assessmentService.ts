import type { CreateAssessment, UpdateAssessment, Assessment } from '@/types/assessment';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/backend';

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  dataSource?: 'live' | 'fallback';
}

// Import required types
import type { BackendCourse } from '@/types/course';
import type { Module } from './moduleService';

// Local interfaces removed - use imported from '@/types/assessment'


export interface AssessmentQuestion {
  _id?: string;
  id: string;
  assessmentId: string;
  questionText: string;
  type: 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY';
  points: number;
  orderIndex?: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface QuestionOption {
  _id?: string;
  id: string;
  questionId: string;
  optionText: string;
  isCorrect: boolean;
  orderIndex: number;
  __v?: number;
}

export interface AssessmentAttempt {
  _id?: string;
  id: string;
  assessmentId: string;
  learnerId: string;
  attemptNumber: number;
  totalScore: number;
  passed?: boolean;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED';
  startedAt?: string;
  submittedAt?: string;
  completedAt?: string;
  __v?: number;
}

export interface AttemptAnswer {
  _id?: string;
  id: string;
  attemptId: string;
  questionId: string;
  answer: string;
  score?: number;
  createdAt: string;
  __v?: number;
}

const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token') || localStorage.getItem('auth_token');
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const error = await response.json().catch(() => ({ error: 'An error occurred' }));
      throw new Error(error.error || error.message || 'Request failed');
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  return response;
};

export const assessmentService = {
  // Create assessment
  async createAssessment(assessmentData: CreateAssessment): Promise<Assessment> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/assessments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({...assessmentData, status: 'DRAFT'}),
    });

    const data = await handleResponse(response);
    return data.assessment;
  },

  // Get assessments by module
  async getAssessmentsByModule(moduleId: string): Promise<Assessment[]> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/assessments/module/${moduleId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await handleResponse(response);
    return data.assessments || [];
  },

  // Get assessment by ID
  async getAssessmentById(assessmentId: string): Promise<{ assessment: Assessment; questions: AssessmentQuestion[]; options: QuestionOption[] }> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/assessments/${assessmentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await handleResponse(response);
    return {
      assessment: data.assessment,
      questions: data.questions || [],
      options: data.options || []
    };
  },

  // Update assessment
  async updateAssessment(assessmentId: string, assessmentData: UpdateAssessment): Promise<Assessment> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/assessments/${assessmentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assessmentData),
    });

    const data = await handleResponse(response);
    return data.assessment;
  },

  // Delete assessment
  async deleteAssessment(assessmentId: string): Promise<void> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/assessments/${assessmentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    await handleResponse(response);
  },

  // Create question
  async createQuestion(questionData: Partial<AssessmentQuestion>): Promise<AssessmentQuestion> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/assessments/questions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questionData),
    });

    const data = await handleResponse(response);
    return data.question;
  },

  // Get questions by assessment
  async getQuestionsByAssessment(assessmentId: string): Promise<{ questions: AssessmentQuestion[]; options: QuestionOption[] }> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/assessments/${assessmentId}/questions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await handleResponse(response);
    return {
      questions: data.questions || [],
      options: data.options || []
    };
  },

  // Update question
  async updateQuestion(questionId: string, questionData: Partial<AssessmentQuestion>): Promise<AssessmentQuestion> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/assessments/questions/${questionId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questionData),
    });

    const data = await handleResponse(response);
    return data.question;
  },

  // Delete question
  async deleteQuestion(questionId: string): Promise<void> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/assessments/questions/${questionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    await handleResponse(response);
  },

  // Create question option
  async createQuestionOption(optionData: Partial<QuestionOption>): Promise<QuestionOption> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/assessments/options`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(optionData),
    });

    const data = await handleResponse(response);
    return data.option;
  },

  // Update question option
  async updateQuestionOption(optionId: string, optionData: Partial<QuestionOption>): Promise<QuestionOption> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/assessments/options/${optionId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(optionData),
    });

    const data = await handleResponse(response);
    return data.option;
  },

  // Delete question option
  async deleteQuestionOption(optionId: string): Promise<void> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/assessments/options/${optionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    await handleResponse(response);
  },

  // Attempt-related methods
  // Start assessment attempt
  async startAttempt(assessmentId: string): Promise<AssessmentAttempt> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/assessments/${assessmentId}/attempts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await handleResponse(response);
    return data.attempt;
  },

  // Submit answer for a question
  async submitAnswer(attemptId: string, questionId: string, answer: string): Promise<void> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/assessments/attempts/${attemptId}/answers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ questionId, answer }),
    });

    await handleResponse(response);
  },

  // Submit assessment attempt for grading
  async submitAttempt(attemptId: string): Promise<{
    totalScore: number;
    maxScore: number;
    passed?: boolean;
    percentage: number;
  }> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/assessments/attempts/${attemptId}/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await handleResponse(response);
    return {
      totalScore: data.totalScore,
      maxScore: data.maxScore,
      passed: data.passed,
      percentage: data.percentage,
    };
  },

  // Get attempts for an assessment
  async getAttempts(assessmentId: string, page = 1, limit = 10): Promise<{
    attempts: AssessmentAttempt[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/assessments/${assessmentId}/attempts?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await handleResponse(response);
    return data;
  },

  // Get assessment with questions and options (comprehensive)
  async getAssessmentWithQuestions(assessmentId: string): Promise<{
    assessment: Assessment;
    questions: (AssessmentQuestion & { options: QuestionOption[] })[];
  }> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/assessments/${assessmentId}/with-questions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await handleResponse(response);
    return {
      assessment: data.assessment,
      questions: data.questions || [],
    };
  },

  // Get comprehensive instructor assessments with questions and attempts
  async getInstructorAssessmentsComprehensive(instructorId: string): Promise<{
    assessments: (Assessment & { 
      questions: (AssessmentQuestion & { options: QuestionOption[] })[];
      attempts: AssessmentAttempt[];
      modules: Module[];
      courses: BackendCourse;
    })[];
  }> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    try {
      // Get instructor courses first
      const coursesResponse = await fetch(`${API_BASE_URL}/admin/instructors/${instructorId}?page=1&limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!coursesResponse.ok) {
        throw new Error('Failed to fetch instructor courses');
      }

      const coursesData = await coursesResponse.json();
      const courses = coursesData.courses || [];

      // Get all assessments for all courses with questions
      const allAssessments = [];
      
      for (const course of courses) {
        // Get modules for this course
        const modulesResponse = await fetch(`${API_BASE_URL}/modules/course/${course.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const modulesData = modulesResponse.ok ? await modulesResponse.json() : { modules: [] };
        const modules = modulesData.modules || [];

        // Get assessments for each module
        for (const module of modules) {
          const assessmentsResponse = await fetch(`${API_BASE_URL}/assessments/module/${module.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          const assessmentsData = assessmentsResponse.ok ? await assessmentsResponse.json() : { assessments: [] };
          const moduleAssessments = assessmentsData.assessments || [];

          // For each assessment, get questions and attempts
          for (const assessment of moduleAssessments) {
            try {
              // Get questions for this assessment
              const questionsResponse = await fetch(`${API_BASE_URL}/assessments/${assessment.id}/with-questions`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });

              const questionsData = questionsResponse.ok ? await questionsResponse.json() : { questions: [] };
              const questions = questionsData.questions || [];

              // Get attempts for this assessment (optional - may not exist)
              let attempts = [];
              try {
                const attemptsResponse = await fetch(`${API_BASE_URL}/attempts/assessment/${assessment.id}?page=1&limit=100`, {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                });

                if (attemptsResponse.ok) {
                  const attemptsData = await attemptsResponse.json();
                  attempts = attemptsData.attempts || [];
                }
              } catch (attemptsError) {
                // Attempts endpoint may not exist - that's okay
                console.warn(`Attempts endpoint not available for assessment ${assessment.id}:`, attemptsError);
                attempts = [];
              }

              allAssessments.push({
                ...assessment,
                questions: questions,
                attempts: attempts,
                modules: modules,
                courses: course,
              });
            } catch (error) {
              console.warn(`Failed to fetch details for assessment ${assessment.id}:`, error);
              // Still add assessment without questions/attempts if there's an error
              allAssessments.push({
                ...assessment,
                questions: [],
                attempts: [],
                modules: modules,
                courses: course,
              });
            }
          }
        }
      }

      return { assessments: allAssessments };
    } catch (error) {
      console.error('Failed to fetch comprehensive instructor assessments:', error);
      return { assessments: [] };
    }
  },
};
