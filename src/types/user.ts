export interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'LEARNER';
  cohortId?: string;
  twoFaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}






export interface InvitationRequest {
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'LEARNER';
  cohort_id?: string;
}









