export interface Cohort {
  id: string;
  coordinatorId?: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  enrollmentOpenDate?: string;
  enrollmentCloseDate?: string;
  extensionDate?: string;
  courseType: string;
  isActive: boolean;
  currentStudents?: number;
  maxStudents?: number;
  createdAt?: string;
  updatedAt?: string;
  instructorIds?: string[];
}

