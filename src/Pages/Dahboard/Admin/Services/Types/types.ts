export interface CategoryData {
  _id: string;
  categoryName: string;
  count: number;
}

export interface ActiveUser {
  userId: string;
  name: string;
  email: string;
  requestCount: number;
  responseCount: number;
  totalActivity: number;
}

export interface ResolutionRates {
  totalRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  pendingRequests: number;
  resolutionRate: string;
  averageResolutionTime: string;
}

export interface SystemUsage {
  users: {
    total: number;
    admins: number;
    regularUsers: number;
    activeUsers: number;
    newThisMonth: number;
  };
  requests: { total: number };
  responses: { total: number };
  abuseReports: { total: number };
}

export interface TimeBasedData {
  date: string;
  requests: number;
  responses: number;
  newUsers: number;
}

export interface DashboardData {
  requestsByCategory: CategoryData[];
  mostActiveUsers: ActiveUser[];
  resolutionRates: {
    totalRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
    resolutionRate: string;
  };
  systemUsage: {
    users: { total: number; activeUsers: number };
    requests: { total: number };
  };
}