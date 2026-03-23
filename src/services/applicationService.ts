// Application service for API interactions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

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

interface UpdateStatusResponse {
  message: string;
  application: Partial<Application>;
  redirectUrl?: string;
}

interface ApplicationService {
  submitApplication(cohortId: string, formData: FormData): Promise<{ applicationId: string; message: string }>;
  getMyApplications(): Promise<Application[]>;
  getAllApplications(): Promise<Application[]>;
  updateApplicationStatus(applicationId: string, status: 'APPROVED' | 'REJECTED'): Promise<UpdateStatusResponse>;
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
        educationLevel: formData.get('educationLevel'),
        timeCommitment: formData.get('timeCommitment'),
        teamworkFeelings: formData.get('teamworkFeelings'),
        skillsTeamworkThoughts: formData.get('skillsTeamworkThoughts'),
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

  async getAllApplications(): Promise<Application[]> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_BASE_URL}/applications`, {
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

  async updateApplicationStatus(applicationId: string, status: 'APPROVED' | 'REJECTED'): Promise<{ message: string; application: Partial<Application> }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = errorText ? JSON.parse(errorText) : { error: 'Server error' };
      } catch {
        errorData = { error: `Server error: ${errorText}` };
      }
      throw new Error(errorData.error || `Failed to update application status (${response.status})`);
    }

    const data = await response.json();
    const result: UpdateStatusResponse = {
      message: data.message,
      application: data.application,
      redirectUrl: data.redirectUrl
    };
    return result;
  },
};
