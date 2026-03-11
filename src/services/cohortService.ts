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
  currentStudents?: number;
  maxStudents?: number;
  status?: 'upcoming' | 'active' | 'completed';
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
  coordinatorId?: string | null;
  coordinatorName?: string | null;
  currentStudents?: number;
  maxStudents?: number;
  status?: 'upcoming' | 'active' | 'completed';
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
  async getAllCohorts(page = 1, limit = 10): Promise<{ cohorts: Cohort[]; pagination: PaginationInfo;}> {
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
        console.warn('Cohorts API unavailable:', response.status);
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
        coordinatorId: cohort.coordinatorId,
        coordinatorName: cohort.coordinatorName,
        currentStudents: cohort.currentStudents,
        maxStudents: cohort.maxStudents,
        status: cohort.status,
      }));

      return {
        cohorts,
        pagination: data.pagination || { page, limit, total: cohorts.length, pages: 1 },
      };
    } catch (error) {
      console.error('Cohort fetch error:', error);
      return { cohorts: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
    }
  },

  async getCohort(id: string): Promise<{ cohort: Cohort }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_BASE_URL}/cohorts/${id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Cohort not found');
    const data: ApiResponse<BackendCohort> = await response.json();
    const cohort: Cohort = {
      id: data.cohort!.id,
      name: data.cohort!.name,
      description: data.cohort!.description,
      startDate: data.cohort!.startDate,
      endDate: data.cohort!.endDate,
      enrollmentOpenDate: data.cohort!.enrollmentOpenDate,
      enrollmentCloseDate: data.cohort!.enrollmentCloseDate,
      extensionDate: data.cohort!.extensionDate,
      courseType: data.cohort!.courseType,
      isActive: data.cohort!.isActive,
      createdAt: data.cohort!.createdAt,
      updatedAt: data.cohort!.updatedAt,
      instructorIds: data.cohort!.instructorIds,
      coordinatorId: data.cohort!.coordinatorId,
      coordinatorName: data.cohort!.coordinatorName,
      currentStudents: data.cohort!.currentStudents,
      maxStudents: data.cohort!.maxStudents,
      status: data.cohort!.status,
    };
    return { cohort };
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
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_BASE_URL}/cohorts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: cohortData.name,
        description: cohortData.description || '',
        start_date: cohortData.startDate,
        end_date: cohortData.endDate,
        enrollment_open_date: cohortData.enrollmentOpenDate,
        enrollment_close_date: cohortData.enrollmentCloseDate,
        extension_date: cohortData.extensionDate,
        course_type: cohortData.courseType,
        coordinator_id: cohortData.coordinatorId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to create cohort');
    }
    const data: ApiResponse<BackendCohort> = await response.json();
    const cohort: Cohort = {
      id: data.cohort!.id,
      name: data.cohort!.name,
      description: data.cohort!.description,
      startDate: data.cohort!.startDate,
      endDate: data.cohort!.endDate,
      enrollmentOpenDate: data.cohort!.enrollmentOpenDate,
      enrollmentCloseDate: data.cohort!.enrollmentCloseDate,
      extensionDate: data.cohort!.extensionDate,
      courseType: data.cohort!.courseType,
      isActive: data.cohort!.isActive,
      createdAt: data.cohort!.createdAt,
      updatedAt: data.cohort!.updatedAt,
      instructorIds: data.cohort!.instructorIds,
      coordinatorId: data.cohort!.coordinatorId,
      coordinatorName: data.cohort!.coordinatorName,
      currentStudents: data.cohort!.currentStudents,
      maxStudents: data.cohort!.maxStudents,
      status: data.cohort!.status,
    };
    return { cohort };
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
    if (!token) throw new Error('Authentication required');

    const payload: Record<string, any> = {};
    Object.entries(updates).forEach(([key, value]) => {
      const backendKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      payload[backendKey] = value;
    });

    const response = await fetch(`${API_BASE_URL}/cohorts/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update cohort');
    }
    const data: ApiResponse<BackendCohort> = await response.json();
    const cohort: Cohort = {
      id: data.cohort!.id,
      name: data.cohort!.name,
      description: data.cohort!.description,
      startDate: data.cohort!.startDate,
      endDate: data.cohort!.endDate,
      enrollmentOpenDate: data.cohort!.enrollmentOpenDate,
      enrollmentCloseDate: data.cohort!.enrollmentCloseDate,
      extensionDate: data.cohort!.extensionDate,
      courseType: data.cohort!.courseType,
      isActive: data.cohort!.isActive,
      createdAt: data.cohort!.createdAt,
      updatedAt: data.cohort!.updatedAt,
      instructorIds: data.cohort!.instructorIds,
      coordinatorId: data.cohort!.coordinatorId,
      coordinatorName: data.cohort!.coordinatorName,
      currentStudents: data.cohort!.currentStudents,
      maxStudents: data.cohort!.maxStudents,
      status: data.cohort!.status,
    };
    return { cohort };
  },

  async deleteCohort(id: string): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_BASE_URL}/cohorts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Failed to delete cohort');
  },

  async assignLearnerToCohort(learnerId: string, cohortId: string): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_BASE_URL}/cohorts/AssignLearner`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ learner_id: learnerId, cohort_id: cohortId }),
    });

    if (!response.ok) throw new Error('Failed to assign learner');
  },

  async unenrollFromCohort(): Promise<{ message: string; previousCohortId: string; previousCohortName: string; }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_BASE_URL}/cohorts/unenroll`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Failed to unenroll');
    const data = await response.json();
    return {
      message: data.message || 'Unenrolled successfully',
      previousCohortId: data.previousCohortId || '',
      previousCohortName: data.previousCohortName || '',
    };
  },
};

