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
  motivationLetter?: string;
  previousExperience?: string;
  portfolioLink?: string;
  appliedAt: string;
  reviewedAt?: string;
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
