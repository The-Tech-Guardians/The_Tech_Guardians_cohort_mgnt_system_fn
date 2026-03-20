// Application service for API interactions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface BackendApplication {
  id: string;
  userId: string;
  cohortId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  name: string;
  age: number;
  email: string;
  educationLevel: string;
  timeCommitment: string;
  teamworkFeelings: string;
  skillsTeamworkThoughts: string;
  communityProblem: string;
  appliedAt: string;
}

export interface Application {
  id: string;
  cohortId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  name: string;
  age: number;
  email: string;
  educationLevel: string;
  timeCommitment: string;
  teamworkFeelings: string;
  skillsTeamworkThoughts: string;
  communityProblem: string;
  appliedAt: string;
}

interface ApiResponse<T> {
  applications?: T[];
  message?: string;
  error?: string;
  applicationId?: string;
}

interface ApplicationService {
  submitApplication(cohortId: string, formData: FormData): Promise<{ applicationId: string; message: string }>;
  getMyApplications(): Promise<Application[]>;
}

export const applicationService: ApplicationService = {
  async submitApplication(cohortId: string, formData: FormData): Promise<{ applicationId: string; message: string }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_BASE_URL}/applications/apply`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cohortId,
        age: Number(formData.get('age')),
        educationLevel: formData.get('education'),
        timeCommitment: formData.get('timeCommitment'),
        teamworkFeelings: formData.get('teamwork'),
        skillsTeamworkThoughts: formData.get('technicalTeamship'),
        communityProblem: formData.get('communityProblem'),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText.includes('<!DOCTYPE') ? 'Backend not responding' : JSON.parse(errorText).error || 'Failed to submit');
    }

    const data: ApiResponse<BackendApplication> = await response.json();
    return { applicationId: data.applicationId || '', message: data.message || 'Success' };
  },

  async getMyApplications(): Promise<Application[]> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_BASE_URL}/applications/my-applications`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return [];
    }

    const data: ApiResponse<BackendApplication> = await response.json();
    return (data.applications || []).map(app => ({
      id: app.id,
      cohortId: app.cohortId,
      status: app.status as Application['status'],
      name: app.name,
      age: app.age,
      email: app.email,
      educationLevel: app.educationLevel,
      timeCommitment: app.timeCommitment,
      teamworkFeelings: app.teamworkFeelings,
      skillsTeamworkThoughts: app.skillsTeamworkThoughts,
      communityProblem: app.communityProblem,
      appliedAt: app.appliedAt,
    }));
  },
};
