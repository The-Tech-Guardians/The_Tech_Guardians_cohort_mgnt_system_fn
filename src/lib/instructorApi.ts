const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';interface InstructorStats {  totalCourses: number;  totalEnrollments: number;  activeStudents: number;  completionRate: number;  avgRating: number;  newEnrollments: number;  lessonsPublished: number;  coursesCompleted: number;}



interface InstructorCourse {  id: string;

  title: string;

  enrolled: string;  modules: number;  lessons: number;

  cohort: string;  published: boolean;

  completion: number;  modules_data?: Array<{    id: string;    week: string;    title: string;    lessons: number;    published: boolean;  }>;

}



interface CourseFormData {  title: string;

  description: string;

  cohortId?: string;
  cohortName?: string;
  courseType?: string;
  instructorId?: string;
  isPublished?: boolean;

}



interface ModuleFormData {  courseId: string;

  title: string;

  description: string;

  orderIndex: number;

  releaseWeek: number;  isPublished?: boolean;

}



interface LessonFormData {  moduleId: string;  title: string;

  content?: string;  videoUrl?: string;  orderIndex: number;

  isPublished?: boolean;

  lessonType?: 'video' | 'text' | 'quiz' | 'assignment';}



interface AssessmentFormData {  courseId: string;

  moduleId?: string;  title: string;

  description: string;

  questions: Array<{    question: string;    type: 'multiple-choice' | 'true-false' | 'short-answer';    options?: string[];    correctAnswer: string | number;    points: number;  }>;

  timeLimit?: number;  passingScore?: number;  isPublished?: boolean;

}



const getAuthToken = () => {  if (typeof window !== 'undefined') {    return localStorage.getItem('auth_token') || localStorage.getItem('token');  }

  return null;};



const getHeaders = () => ({  'Content-Type': 'application/json',  ...(getAuthToken() && { 'Authorization': `Bearer ${getAuthToken()}` }),});



export const instructorApi = {  async getDashboardStats(): Promise<InstructorStats> {    try {

      const response = await fetch(`${API_BASE_URL}/instructor/dashboard`, {        method: 'GET',

        headers: getHeaders(),

      });



      if (!response.ok) {

        throw new Error('Failed to fetch dashboard stats');      }



      const data = await response.json();

      return data.data || data;    } catch (error) {

      console.error('Instructor dashboard stats error:', error);      throw new Error('Failed to fetch dashboard stats');

    }

  },



  async getInstructorCourses(): Promise<InstructorCourse[]> {

    try {

      const response = await fetch(`${API_BASE_URL}/instructor/courses`, {

        method: 'GET',

        headers: getHeaders(),

      });



      if (!response.ok) {

        return [];

      }



      const data = await response.json();

      return data.courses || data.data || data;

    } catch (error) {

      // Silently handle the error

      return [];

    }

  },



  async getInstructorAssessments(): Promise<any[]> {

    try {

      const response = await fetch(`${API_BASE_URL}/instructor/assessments`, {

        method: 'GET',

        headers: getHeaders(),

      });



      if (!response.ok) {

        return [];

      }



      const data = await response.json();

      return data.assessments || data.data || data;

    } catch (error) {

      // Silently handle the error

      return [];

    }

  },



  async getAssessment(assessmentId: string): Promise<any> {

    try {

      const response = await fetch(`${API_BASE_URL}/instructor/assessments/${assessmentId}`, {

        method: 'GET',

        headers: getHeaders(),

      });



      if (!response.ok) {

        throw new Error('Failed to fetch assessment');

      }



      const data = await response.json();

      return data.assessment || data.data || data;

    } catch (error) {

      console.error('Get assessment error:', error);

      throw new Error('Failed to fetch assessment');

    }

  },



  async getAssessmentQuestions(assessmentId: string): Promise<any[]> {

    try {

      const response = await fetch(`${API_BASE_URL}/instructor/assessments/${assessmentId}/questions`, {

        method: 'GET',

        headers: getHeaders(),

      });



      if (!response.ok) {

        return [];

      }



      const data = await response.json();

      return data.questions || [];

    } catch (error) {

      // Silently handle the error

      return [];

    }

  },



  async createAssessmentQuestion(assessmentId: string, questionData: any): Promise<any> {

    try {

      const response = await fetch(`${API_BASE_URL}/instructor/assessments/${assessmentId}/questions`, {

        method: 'POST',

        headers: getHeaders(),

        body: JSON.stringify(questionData),

      });



      if (!response.ok) {

        throw new Error('Failed to create question');

      }



      const data = await response.json();

      return data.question || data.data || data;

    } catch (error) {

      console.error('Create assessment question error:', error);

      throw new Error('Failed to create assessment question');

    }

  },



  async updateAssessmentQuestion(assessmentId: string, questionId: string, questionData: any): Promise<any> {

    try {

      const response = await fetch(`${API_BASE_URL}/instructor/assessments/${assessmentId}/questions/${questionId}`, {

        method: 'PUT',

        headers: getHeaders(),

        body: JSON.stringify(questionData),

      });



      if (!response.ok) {

        throw new Error('Failed to update question');

      }



      const data = await response.json();

      return data.question || data.data || data;

    } catch (error) {

      console.error('Update assessment question error:', error);

      throw new Error('Failed to update assessment question');

    }

  },



  async deleteAssessmentQuestion(assessmentId: string, questionId: string): Promise<void> {

    try {

      const response = await fetch(`${API_BASE_URL}/instructor/assessments/${assessmentId}/questions/${questionId}`, {

        method: 'DELETE',

        headers: getHeaders(),

      });



      if (!response.ok) {

        throw new Error('Failed to delete question');

      }

    } catch (error) {

      console.error('Delete assessment question error:', error);

      throw new Error('Failed to delete assessment question');

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



  async getRecentStudentActivity(): Promise<any[]> {

    try {

      const response = await fetch(`${API_BASE_URL}/instructor/recent-activity`, {

        method: 'GET',

        headers: getHeaders(),

      });



      if (!response.ok) {

        console.warn('Recent activity endpoint not available:', response.status);

        return [];

      }



      const data = await response.json();

      return data.activities || data.data || data;

    } catch (error) {

      // Silently handle the error - don't log to console to prevent spam

      return [];

    }

  },



  // Course Management

  async createCourse(courseData: CourseFormData): Promise<InstructorCourse> {

    try {

      const parseApiError = async (response: Response): Promise<string> => {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errorData = await response.json().catch(() => ({}));
          return errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        }
        const text = await response.text().catch(() => '');
        return text || `HTTP ${response.status}: ${response.statusText}`;
      };

      const endpoints = [
        `${API_BASE_URL}/instructor/courses`,
        `${API_BASE_URL}/courses`,
      ];

      let lastErrorMessage = 'Failed to create course';

      for (let i = 0; i < endpoints.length; i++) {
        const endpoint = endpoints[i];
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(courseData),
        });

        if (response.ok) {
          const data = await response.json().catch(() => ({}));
          return data.course || data.data || data;
        }

        const errorMessage = await parseApiError(response);
        lastErrorMessage = errorMessage;

        const isInstructorEndpoint = i === 0;
        const shouldTryFallback = isInstructorEndpoint && (response.status === 404 || response.status === 405);
        if (!shouldTryFallback) {
          break;
        }
      }

      throw new Error(lastErrorMessage);

    } catch (error) {

      console.error('Create course error:', error);

      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create course');

    }

  },



  async updateCourse(courseId: string, courseData: Partial<CourseFormData>): Promise<InstructorCourse> {

    try {

      const parseApiError = async (response: Response): Promise<string> => {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errorData = await response.json().catch(() => ({}));
          return errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        }
        const text = await response.text().catch(() => '');
        return text || `HTTP ${response.status}: ${response.statusText}`;
      };

      const endpoints = [
        `${API_BASE_URL}/instructor/courses/${courseId}`,
        `${API_BASE_URL}/courses/${courseId}`,
      ];

      let lastErrorMessage = 'Failed to update course';

      for (let i = 0; i < endpoints.length; i++) {
        const endpoint = endpoints[i];
        const response = await fetch(endpoint, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(courseData),
        });

        if (response.ok) {
          const data = await response.json().catch(() => ({}));
          return data.course || data.data || data;
        }

        const errorMessage = await parseApiError(response);
        lastErrorMessage = errorMessage;

        const isInstructorEndpoint = i === 0;
        const shouldTryFallback = isInstructorEndpoint && (response.status === 404 || response.status === 405);
        if (!shouldTryFallback) {
          break;
        }
      }

      throw new Error(lastErrorMessage);

    } catch (error) {

      console.error('Update course error:', error);

      if (error instanceof Error) {
        throw error;
      }
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

      console.log('Fetching modules for course:', courseId);

      const response = await fetch(`${API_BASE_URL}/modules/course/${courseId}`, {

        method: 'GET',

        headers: getHeaders(),

      });



      if (!response.ok) {

        console.error('Module fetch failed with status:', response.status);

        throw new Error('Failed to fetch course modules');

      }



      const data = await response.json();

      console.log('Modules API response:', data);

      const modules = data.modules || data.data || data;

      console.log('Extracted modules:', modules);

      return modules;

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

      // Get all modules for this course first

      const modulesResponse = await fetch(`${API_BASE_URL}/modules/course/${courseId}`, {

        method: 'GET',

        headers: getHeaders(),

      });



      if (!modulesResponse.ok) {

        throw new Error('Failed to fetch course modules');

      }



      const modulesData = await modulesResponse.json();

      const moduleIds = modulesData.modules?.map((m: any) => m.id) || [];



      // Get assessments for each module with questions and options

      const allAssessments = [];

      for (const moduleId of moduleIds) {

        const response = await fetch(`${API_BASE_URL}/assessments/module/${moduleId}`, {

          method: 'GET',

          headers: getHeaders(),

        });



        if (response.ok) {

          const data = await response.json();

          const assessments = data.assessments || [];

          

          // Fetch questions and options for each assessment using the new endpoint

          for (const assessment of assessments) {

            const questionsResponse = await fetch(`${API_BASE_URL}/assessments/${assessment.id}/with-questions`, {

              method: 'GET',

              headers: getHeaders(),

            });



            if (questionsResponse.ok) {

              const questionsData = await questionsResponse.json();

              const questions = questionsData.questions || [];



              // Transform questions to match frontend format

              const transformedQuestions = questions.map((q: any) => {

                const questionOptions = q.options || [];

                const transformedQuestion: any = {

                  question: q.questionText,

                  type: q.type === 'MCQ' ? 'multiple-choice' : 

                         q.type === 'TRUE_FALSE' ? 'true-false' : 

                         q.type === 'SHORT_ANSWER' ? 'short-answer' : 'essay',

                  points: q.points,

                  correctAnswer: q.type === 'TRUE_FALSE' ? 

                    (questionOptions.find((o: any) => o.isCorrect)?.optionText === 'true' ? 'true' : 'false') :

                    q.type === 'SHORT_ANSWER' ? 

                    (questionOptions.find((o: any) => o.isCorrect)?.optionText || '') :

                    questionOptions.findIndex((o: any) => o.isCorrect)

                };



                if (q.type === 'MCQ') {

                  transformedQuestion.options = questionOptions.map((o: any) => o.optionText);

                }



                return transformedQuestion;

              });



              // Add transformed assessment to list with questions

              allAssessments.push({

                ...assessment,

                courseId: courseId,

                moduleId: moduleId,

                questions: transformedQuestions,

                timeLimit: assessment.timeLimitMinutes,

                passingScore: assessment.passMark,

                isPublished: assessment.status === 'PUBLISHED',

                type: assessment.type === 'QUIZ' ? 'Quiz' : 'Assignment'

              });

            } else {

              // Still add assessment without questions

              allAssessments.push({

                ...assessment,

                courseId: courseId,

                moduleId: moduleId,

                questions: [],

                timeLimit: assessment.timeLimitMinutes,

                passingScore: assessment.passMark,

                isPublished: assessment.status === 'PUBLISHED',

                type: assessment.type === 'QUIZ' ? 'Quiz' : 'Assignment'

              });

            }

          }

        }

      }



      return allAssessments;

    } catch (error) {

      console.error('Get course assessments error:', error);

      throw new Error('Failed to fetch course assessments');

    }

  },



  async createAssessment(assessmentData: AssessmentFormData): Promise<any> {

    try {

      // Validate required fields

      if (!assessmentData.moduleId) {

        throw new Error('Module is required for creating assessments');

      }



      // Transform data to match backend format

      const backendData = {

        moduleId: assessmentData.moduleId,

        title: assessmentData.title,

        description: assessmentData.description || '',

        type: 'QUIZ',

        passMark: assessmentData.passingScore || 70,

        timeLimitMinutes: assessmentData.timeLimit,

        instantFeedback: true,

        status: assessmentData.isPublished ? 'PUBLISHED' : 'DRAFT'

      };



      const response = await fetch(`${API_BASE_URL}/assessments`, {

        method: 'POST',

        headers: getHeaders(),

        body: JSON.stringify(backendData),

      });



      if (!response.ok) {

        throw new Error('Failed to create assessment');

      }



      const data = await response.json();

      console.log('Assessment created successfully:', data.assessment);

      console.log('Questions to create:', assessmentData.questions);

      

      // Create questions if provided

      if (assessmentData.questions && assessmentData.questions.length > 0) {

        console.log('Creating', assessmentData.questions.length, 'questions...');

        for (const question of assessmentData.questions) {

          const questionData: any = {

            assessmentId: data.assessment.id,

            questionText: question.question,

            type: question.type === 'multiple-choice' ? 'MCQ' : 

                   question.type === 'true-false' ? 'TRUE_FALSE' : 'SHORT_ANSWER',

            points: question.points,

            orderIndex: assessmentData.questions.indexOf(question)

          };



          // Add options for MCQ and TRUE_FALSE questions

          if (question.type === 'multiple-choice' && question.options) {

            questionData.options = question.options.map((option: string, index: number) => ({
              optionText: option,
              isCorrect: index === question.correctAnswer
            }));

          } else if (question.type === 'true-false') {

            questionData.options = [
              { optionText: 'true', isCorrect: question.correctAnswer === 'true' },
              { optionText: 'false', isCorrect: question.correctAnswer === 'false' }
            ];

          } else if (question.type === 'short-answer') {

            questionData.options = [
              { optionText: question.correctAnswer.toString(), isCorrect: true }
            ];

          }



          console.log('Creating question with data:', questionData);



          const questionResponse = await fetch(`${API_BASE_URL}/assessments/${data.assessment.id}/questions`, {

            method: 'POST',

            headers: getHeaders(),

            body: JSON.stringify(questionData),

          });



          console.log('Question creation response status:', questionResponse.status);

          console.log('Question creation response ok:', questionResponse.ok);



          if (questionResponse.ok) {

            const questionResult = await questionResponse.json();

            console.log('Question created successfully:', questionResult.question);

            // Options are created automatically by the backend when creating the question

          } else {

            console.error('Failed to create question:', await questionResponse.text());

          }

        }

      }



      return data.assessment;

    } catch (error) {

      console.error('Create assessment error:', error);

      throw new Error('Failed to create assessment');

    }

  },



  async updateAssessment(assessmentId: string, assessmentData: Partial<AssessmentFormData>): Promise<any> {

    try {

      // Transform data to match backend format

      const backendData = {

        moduleId: assessmentData.moduleId || null,

        title: assessmentData.title,

        description: assessmentData.description || '',

        type: 'QUIZ',

        passMark: assessmentData.passingScore || 70,

        timeLimitMinutes: assessmentData.timeLimit,

        instantFeedback: true,

        status: assessmentData.isPublished ? 'PUBLISHED' : 'DRAFT'

      };



      const response = await fetch(`${API_BASE_URL}/assessments/${assessmentId}`, {

        method: 'PUT',

        headers: getHeaders(),

        body: JSON.stringify(backendData),

      });



      if (!response.ok) {

        throw new Error('Failed to update assessment');

      }



      const data = await response.json();

      return data.assessment;

    } catch (error) {

      console.error('Update assessment error:', error);

      throw new Error('Failed to update assessment');

    }

  },



  // Additional methods for overview page

  async getInstructorModules(): Promise<any[]> {

    try {

      const response = await fetch(`${API_BASE_URL}/instructor/modules`, {

        method: 'GET',

        headers: getHeaders(),

      });



      if (!response.ok) {

        return [];

      }



      const data = await response.json();

      return data.modules || data.data || data;

    } catch (error) {

      // Silently handle the error

      return [];

    }

  },



  async getInstructorLessons(): Promise<any[]> {

    try {

      const response = await fetch(`${API_BASE_URL}/instructor/lessons`, {

        method: 'GET',

        headers: getHeaders(),

      });



      if (!response.ok) {

        return [];

      }



      const data = await response.json();

      return data.lessons || data.data || data;

    } catch (error) {

      // Silently handle the error

      return [];

    }

  },

};

