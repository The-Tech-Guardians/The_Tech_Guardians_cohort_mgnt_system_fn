// Cohort service for API interactions
const API_BASE_URL = 'http://localhost:3000/api';
console.log('🚀 COHORT SERVICE LOADED - API_BASE_URL:', API_BASE_URL);

export interface BackendCohort {
  _id?: string;
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  enrollmentOpenDate?: string;
  enrollmentCloseDate?: string;
  extensionDate?: string;
  courseType: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  instructorIds?: string[];
  currentStudents?: number;
  maxStudents?: number;
}

export interface Cohort {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  enrollmentOpenDate?: string;
  enrollmentCloseDate?: string;
  extensionDate?: string;
  courseType: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  instructorIds?: string[];
  currentStudents?: number;
  maxStudents?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ApiResponse<T> {
  cohorts?: T[];
  cohort?: T;
  message?: string;
  error?: string;
  pagination?: PaginationInfo;
}

export const cohortService = {
  async getAllCohorts(
    page: number = 1,
    limit: number = 10
  ): Promise<{ cohorts: Cohort[]; pagination: PaginationInfo }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
      throw new Error('Authentication required');
    }

    console.log('🔥 Making request to:', `${API_BASE_URL}/cohorts?page=${page}&limit=${limit}`);

    try {
      const response = await fetch(
        `${API_BASE_URL}/cohorts?page=${page}&limit=${limit}`,
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
        throw new Error(errorData.error || 'Failed to fetch cohorts');
      }

      const data: ApiResponse<BackendCohort> = await response.json();

      const transformedCohorts: Cohort[] = (data.cohorts || []).map((cohort) => ({
        id: cohort.id,
        name: cohort.name,
        startDate: cohort.startDate,
        endDate: cohort.endDate,
        enrollmentOpenDate: cohort.enrollmentOpenDate,
        enrollmentCloseDate: cohort.enrollmentCloseDate,
        extensionDate: cohort.extensionDate,
        courseType: cohort.courseType,
        isActive: cohort.isActive,
        createdAt: cohort.createdAt,
        updatedAt: cohort.updatedAt,
        instructorIds: cohort.instructorIds,
        currentStudents: cohort.currentStudents,
        maxStudents: cohort.maxStudents,
      }));

      return {
        cohorts: transformedCohorts,
        pagination: data.pagination || {
          page,
          limit,
          total: transformedCohorts.length,
          pages: 1,
        },
      };
    } catch (error) {
      const err = error as Error;
      console.error('🚨 Cohort fetch error:', err);
      throw new Error(err.message || 'Failed to fetch cohorts');
    }
  },

  // Get a single cohort by ID
  async getCohortById(cohortId: string): Promise<Cohort | null> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/cohorts/${cohortId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      
      if (!data.cohort) {
        return null;
      }

      const cohort = data.cohort;
      return {
        id: cohort.id,
        name: cohort.name,
        startDate: cohort.startDate,
        endDate: cohort.endDate,
        enrollmentOpenDate: cohort.enrollmentOpenDate,
        enrollmentCloseDate: cohort.enrollmentCloseDate,
        extensionDate: cohort.extensionDate,
        courseType: cohort.courseType,
        isActive: cohort.isActive,
        createdAt: cohort.createdAt,
        updatedAt: cohort.updatedAt,
        instructorIds: cohort.instructorIds,
        currentStudents: cohort.currentStudents,
        maxStudents: cohort.maxStudents,
      };
    } catch (error) {
      console.error('🚨 Get cohort error:', error);
      return null;
    }
  },

  async createCohort(cohortData: {
    name: string;
    startDate: string;
    endDate: string;
    enrollmentOpenDate?: string;
    enrollmentCloseDate?: string;
    extensionDate?: string;
    courseType: string;
  }): Promise<{ cohort: Cohort }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const body: Record<string, string> = {
        name: cohortData.name,
        start_date: cohortData.startDate,
        end_date: cohortData.endDate,
        course_type: cohortData.courseType,
      };

      if (cohortData.enrollmentOpenDate) {
        body.enrollment_open_date = cohortData.enrollmentOpenDate;
      }
      if (cohortData.enrollmentCloseDate) {
        body.enrollment_close_date = cohortData.enrollmentCloseDate;
      }
      if (cohortData.extensionDate) {
        body.extension_date = cohortData.extensionDate;
      }

      const response = await fetch(`${API_BASE_URL}/cohorts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create cohort');
      }

      const data: ApiResponse<BackendCohort> = await response.json();

      if (!data.cohort) {
        throw new Error('Failed to create cohort');
      }

      const transformedCohort: Cohort = {
        id: data.cohort.id,
        name: data.cohort.name,
        startDate: data.cohort.startDate,
        endDate: data.cohort.endDate,
        enrollmentOpenDate: data.cohort.enrollmentOpenDate,
        enrollmentCloseDate: data.cohort.enrollmentCloseDate,
        extensionDate: data.cohort.extensionDate,
        courseType: data.cohort.courseType,
        isActive: data.cohort.isActive,
        createdAt: data.cohort.createdAt,
        updatedAt: data.cohort.updatedAt,
      };

      return { cohort: transformedCohort };
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message || 'Failed to create cohort');
    }
  },

  async updateCohort(
    id: string,
    updates: {
      name?: string;
      startDate?: string;
      endDate?: string;
      enrollmentOpenDate?: string;
      enrollmentCloseDate?: string;
      extensionDate?: string;
      courseType?: string;
      isActive?: boolean;
    }
  ): Promise<{ cohort: Cohort }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const payload: Record<string, string | boolean | undefined> = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.startDate !== undefined) payload.start_date = updates.startDate;
      if (updates.endDate !== undefined) payload.end_date = updates.endDate;
      if (updates.enrollmentOpenDate !== undefined)
        payload.enrollment_open_date = updates.enrollmentOpenDate;
      if (updates.enrollmentCloseDate !== undefined)
        payload.enrollment_close_date = updates.enrollmentCloseDate;
      if (updates.extensionDate !== undefined)
        payload.extension_date = updates.extensionDate;
      if (updates.courseType !== undefined) payload.course_type = updates.courseType;
      if (updates.isActive !== undefined) {
        payload.is_active = updates.isActive;
        payload.status = updates.isActive ? 'active' : 'upcoming';
      }

      const response = await fetch(`${API_BASE_URL}/cohorts/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update cohort');
      }

      const data: ApiResponse<BackendCohort> = await response.json();

      if (!data.cohort) {
        throw new Error('Failed to update cohort');
      }

      const transformedCohort: Cohort = {
        id: data.cohort.id,
        name: data.cohort.name,
        startDate: data.cohort.startDate,
        endDate: data.cohort.endDate,
        enrollmentOpenDate: data.cohort.enrollmentOpenDate,
        enrollmentCloseDate: data.cohort.enrollmentCloseDate,
        extensionDate: data.cohort.extensionDate,
        courseType: data.cohort.courseType,
        isActive: data.cohort.isActive,
        createdAt: data.cohort.createdAt,
        updatedAt: data.cohort.updatedAt,
      };

      return { cohort: transformedCohort };
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message || 'Failed to update cohort');
    }
  },

  async deleteCohort(id: string): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/cohorts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete cohort');
      }
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message || 'Failed to delete cohort');
    }
  },

  async assignLearnerToCohort(learnerId: string, cohortId: string): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/cohorts/AssignLearner`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          learner_id: learnerId,
          cohort_id: cohortId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to assign learner to cohort');
      }
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message || 'Failed to assign learner to cohort');
    }
  },

  // Unenroll from cohort
  async unenrollFromCohort(): Promise<{ message: string; previousCohortId: string; previousCohortName: string }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/cohorts/unenroll`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to unenroll from cohort');
      }

      const data = await response.json();
      return {
        message: data.message,
        previousCohortId: data.data?.previousCohortId,
        previousCohortName: data.data?.previousCohortName,
      };
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message || 'Failed to unenroll from cohort');
    }
  },
};

