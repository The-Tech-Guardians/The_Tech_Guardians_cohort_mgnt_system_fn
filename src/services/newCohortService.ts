// NEW Cohort service for API interactions
const API_BASE_URL = 'http://localhost:3000/api';
console.log('🚀 NEW COHORT SERVICE LOADED - API_BASE_URL:', API_BASE_URL);

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
  status?: string;
  coordinatorId?: string;
  coordinatorName?: string;
  maxStudents?: number;
  currentStudents?: number;
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
  coordinatorId?: string;
  coordinatorName?: string;
  maxStudents?: number;
  currentStudents?: number;
  status?: string;
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

export const newCohortService = {
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
        status: cohort.status,
        coordinatorId: cohort.coordinatorId,
        coordinatorName: cohort.coordinatorName,
        maxStudents: cohort.maxStudents,
        currentStudents: cohort.currentStudents,
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
    } catch (error: any) {
      console.error('🚨 Cohort fetch error:', error);
      throw new Error(error.message || 'Failed to fetch cohorts');
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
        const errorText = await response.text();
        console.error('Backend 500 response:', errorText);
        let errorData;
        try {
          errorData = errorText ? JSON.parse(errorText) : { error: 'Server error' };
        } catch (parseError) {
          errorData = { error: `Server error: ${errorText}` };
        }
        throw new Error(errorData.error || `Failed to create cohort (${response.status})`);
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

  async updateCohort(cohortId: string, cohortData: {
    name?: string;
    startDate?: string;
    endDate?: string;
    enrollmentOpenDate?: string;
    enrollmentCloseDate?: string;
    extensionDate?: string;
    courseType?: string;
    isActive?: boolean;
    status?: string;
    coordinatorId?: string;
  }): Promise<{ cohort: Cohort }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const body: Record<string, any> = {};
      
      if (cohortData.name !== undefined) body.name = cohortData.name;
      if (cohortData.startDate !== undefined) body.start_date = cohortData.startDate;
      if (cohortData.endDate !== undefined) body.end_date = cohortData.endDate;
      if (cohortData.enrollmentOpenDate !== undefined) body.enrollment_open_date = cohortData.enrollmentOpenDate;
      if (cohortData.enrollmentCloseDate !== undefined) body.enrollment_close_date = cohortData.enrollmentCloseDate;
      if (cohortData.extensionDate !== undefined) body.extension_date = cohortData.extensionDate;
      if (cohortData.courseType !== undefined) body.course_type = cohortData.courseType;
      if (cohortData.isActive !== undefined) body.is_active = cohortData.isActive;
      if (cohortData.status !== undefined) body.status = cohortData.status;
      if (cohortData.coordinatorId !== undefined) body.coordinator_id = cohortData.coordinatorId;

      const response = await fetch(`${API_BASE_URL}/cohorts/${cohortId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend update error:', errorText);
        let errorData;
        try {
          errorData = errorText ? JSON.parse(errorText) : { error: 'Server error' };
        } catch (parseError) {
          errorData = { error: `Server error: ${errorText}` };
        }
        throw new Error(errorData.error || `Failed to update cohort (${response.status})`);
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
};