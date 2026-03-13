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
        console.warn('Cohorts API unavailable:', response.status);
        return {
          cohorts: [],
          pagination: {
            page,
            limit,
            total: 0,
            pages: 0,
          },
        };
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
      return {
        cohorts: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0,
        },
      };
    }
  },


  // ... (rest of functions from earlier read - abbreviated for brevity)
  
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

  async joinCohort(cohortId: string): Promise<{ message: string; data: { cohortId: string; cohortName: string } }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/cohorts/join`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cohort_id: cohortId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join cohort');
      }

      const data = await response.json();
      return {
        message: data.message,
        data: data.data,
      };
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message || 'Failed to join cohort');
    }
  },

  // Include all other methods if needed...
};

