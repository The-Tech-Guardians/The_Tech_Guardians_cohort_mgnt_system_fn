// Cohort service for API interactions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface BackendCohort {
  _id?: string;
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  enrollmentOpenDate?: string;
  enrollmentCloseDate?: string;
  extensionDate?: string;
  courseType: string;
  isActive: boolean;
  maxStudents?: number;
  currentStudents?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  instructorIds?: string[];
  coordinatorId?: string | null;
  coordinatorName?: string | null;
}

export interface Cohort {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  enrollmentOpenDate?: string;
  enrollmentCloseDate?: string;
  extensionDate?: string;
  courseType: string;
  isActive: boolean;
  maxStudents?: number;
  currentStudents?: number;
  status?: string;
  coordinatorId?: string | null;
  coordinatorName?: string | null;
  createdAt?: string;
  updatedAt?: string;
  instructorIds?: string[];
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

interface CohortService {
  getAllCohorts(page?: number, limit?: number): Promise<{ cohorts: Cohort[]; pagination: PaginationInfo; }>;
  unenrollFromCohort(cohortId?: string): Promise<{ message: string; previousCohortId: string; previousCohortName: string; }>;
}

export const cohortService: CohortService = {
  async getAllCohorts(page = 1, limit = 10): Promise<{ cohorts: Cohort[]; pagination: PaginationInfo }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) throw new Error('Authentication required');

    try {
      const response = await fetch(`${API_BASE_URL}/cohorts?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return { cohorts: [], pagination: { page, limit, total: 0, pages: 0 } };
      }

      const data: ApiResponse<BackendCohort> = await response.json();
      const cohorts: Cohort[] = (data.cohorts || []).map((cohort: BackendCohort) => ({
        id: cohort.id,
        name: cohort.name,
        description: cohort.description,
        startDate: cohort.startDate,
        endDate: cohort.endDate,
        enrollmentOpenDate: cohort.enrollmentOpenDate,
        enrollmentCloseDate: cohort.enrollmentCloseDate,
        extensionDate: cohort.extensionDate,
        courseType: cohort.courseType,
        isActive: cohort.isActive,
        maxStudents: cohort.maxStudents,
        currentStudents: cohort.currentStudents,
        status: cohort.status,
        coordinatorId: cohort.coordinatorId,
        coordinatorName: cohort.coordinatorName,
        createdAt: cohort.createdAt,
        updatedAt: cohort.updatedAt,
        instructorIds: cohort.instructorIds,
      }));

      return {
        cohorts,
        pagination: data.pagination || { page, limit, total: cohorts.length, pages: 1 },
      };
    } catch (error) {
      return { cohorts: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
    }
  },

  async unenrollFromCohort(cohortId?: string): Promise<{ message: string; previousCohortId: string; previousCohortName: string; }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_BASE_URL}/cohorts/unenroll`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cohort_id: cohortId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (errorText.includes('<!DOCTYPE')) {
        throw new Error('Backend server not responding - check if running on port 3000');
      }
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.error || 'Failed to unenroll');
    }

    return response.json();
  }
};

