// Cohort types matching backend API responses

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
