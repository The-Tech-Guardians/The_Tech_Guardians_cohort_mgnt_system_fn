// Cohort service for API interactions
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
  async getAllCohorts(page: number = 1, limit: number = 10): Promise<{ cohorts: Cohort[]; pagination: PaginationInfo }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/cohorts?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
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
      }));

      return {
        cohorts: transformedCohorts,
        pagination: data.pagination || { page, limit, total: transformedCohorts.length, pages: 1 },
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch cohorts');
    }
  },

  async getCohortById(id: string): Promise<{ cohort: Cohort }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/cohorts/${id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

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
      };

      return { cohort: transformedCohort };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch cohort');
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
      const response = await fetch('http://localhost:3000/api/cohorts', {
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
      startDate?: string;
      endDate?: string;
      enrollmentOpenDate?: string;
      enrollmentCloseDate?: string;
      extensionDate?: string;
      courseType?: string;
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

      const response = await fetch(`http://localhost:3000/api/cohorts/${id}`, {
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

  async deleteCohort(id: string): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`http://localhost:3000/api/cohorts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete cohort');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete cohort');
    }
  },

  async assignLearnerToCohort(learnerId: string, cohortId: string): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch('http://localhost:3000/api/cohorts/learner/assign', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
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
    } catch (error: any) {
      throw new Error(error.message || 'Failed to assign learner to cohort');
    }
  },
};
