// Cohort service for API interactions
const API_BASE_URL = 'http://localhost:3000/api';

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
  getCohort(id: string): Promise<{ cohort: Cohort }>;
  createCohort(cohortData: {
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    enrollmentOpenDate?: string;
    enrollmentCloseDate?: string;
    extensionDate?: string;
    courseType: string;
    coordinatorId?: string;
  }): Promise<{ cohort: Cohort }>;
  updateCohort(id: string, updates: {
    name?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    enrollmentOpenDate?: string;
    enrollmentCloseDate?: string;
    extensionDate?: string;
    courseType?: string;
    coordinatorId?: string;
  }): Promise<{ cohort: Cohort }>;
  deleteCohort(id: string): Promise<void>;
  assignLearnerToCohort(learnerId: string, cohortId: string): Promise<void>;
  unenrollFromCohort(): Promise<{ message: string; previousCohortId: string; previousCohortName: string; }>;
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
// Cohorts API unavailable
        return { cohorts: [], pagination: { page, limit, total: 0, pages: 0 } };
      }

      const data: ApiResponse<BackendCohort> = await response.json();
      const cohorts: Cohort[] = (data.cohorts || []).map(cohort => ({
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
        createdAt: cohort.createdAt,
        updatedAt: cohort.updatedAt,
        instructorIds: cohort.instructorIds,
      }));

      return {
        cohorts,
        pagination: data.pagination || { page, limit, total: cohorts.length, pages: 1 },
      };
    } catch (error) {
// Cohort fetch error
      return { cohorts: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
    }
  },

  async getCohort(id: string): Promise<{ cohort: Cohort }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) throw new Error('Authentication required');

    try {
      const response = await fetch(`${API_BASE_URL}/cohorts/${id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch cohort');
      }

      const data: ApiResponse<BackendCohort> = await response.json();

      if (!data.cohort) {
        throw new Error('Cohort not found');
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
        instructorIds: data.cohort.instructorIds,
      };

      return { cohort: transformedCohort };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch cohort');
    }
  },

  async createCohort(cohortData: {
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    enrollmentOpenDate?: string;
    enrollmentCloseDate?: string;
    extensionDate?: string;
    courseType: string;
    coordinatorId?: string;
  }): Promise<{ cohort: Cohort }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
const response = await fetch(`${API_BASE_URL}/cohorts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: cohortData.name,
          start_date: cohortData.startDate,
          end_date: cohortData.endDate,
          enrollment_open_date: cohortData.enrollmentOpenDate,
          enrollment_close_date: cohortData.enrollmentCloseDate,
          extension_date: cohortData.extensionDate,
          course_type: cohortData.courseType,
        }),
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
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create cohort');
    }
  },

  async updateCohort(
    id: string,
    updates: {
      name?: string;
      description?: string;
      startDate?: string;
      endDate?: string;
      enrollmentOpenDate?: string;
      enrollmentCloseDate?: string;
      extensionDate?: string;
      courseType?: string;
      coordinatorId?: string;
    }
  ): Promise<{ cohort: Cohort }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const payload: any = {};
      if (updates.name) payload.name = updates.name;
      if (updates.startDate) payload.start_date = updates.startDate;
      if (updates.endDate) payload.end_date = updates.endDate;
      if (updates.enrollmentOpenDate) payload.enrollment_open_date = updates.enrollmentOpenDate;
      if (updates.enrollmentCloseDate) payload.enrollment_close_date = updates.enrollmentCloseDate;
      if (updates.extensionDate) payload.extension_date = updates.extensionDate;
      if (updates.courseType) payload.course_type = updates.courseType;

const response = await fetch(`${API_BASE_URL}/cohorts/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
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
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update cohort');
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

