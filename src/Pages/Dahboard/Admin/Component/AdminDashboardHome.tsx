import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Calendar, Users, FileText, MessageSquare,  } from 'lucide-react';
import { FiChevronDown } from 'react-icons/fi';
import analyticsService from '../Services/Analyticsservice';
import StatCard from './AnalyticsComponents/StatCard';
import ActivityChart from './AnalyticsComponents/ActivityChart';
import ResolutionMetrics from './AnalyticsComponents/ResolutionMetrics';
import ActiveUsersTable from './AnalyticsComponents/ActiveUsersTable';

interface ActiveUser {
  userId: string;
  name: string;
  email: string;
  requestCount: number;
  responseCount: number;
  totalActivity: number;
}

interface ResolutionData {
  totalRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  pendingRequests: number;
  resolutionRate: number;
  averageResolutionTime: { hours: number; days: number };
}

interface SystemUsage {
  users?: { total: number; newThisMonth: number };
  requests?: { total: number };
  responses?: { total: number; visible: number; hidden: number };
}

interface ActivityData {
  date: string;
  requests: number;
  responses: number;
  newUsers?: number;
}

interface DashboardData {
  mostActiveUsers: ActiveUser[];
  resolutionRates: ResolutionData;
  systemUsage: SystemUsage;
}

const AdminDashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [timeRange, setTimeRange] = useState(7);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      
      const [dashboard, activity] = await Promise.all([
        analyticsService.getComprehensiveDashboard(),
        analyticsService.getTimeBasedActivity(timePeriod, timeRange),
      ]);

      setDashboardData(dashboard as unknown as DashboardData);
      setActivityData((activity.data || activity) as ActivityData[]);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [timePeriod, timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  const { mostActiveUsers, resolutionRates, systemUsage } = dashboardData;

  const handleExport = async (type: 'requests' | 'users' | 'responses' | 'reports', format: 'csv' | 'json') => {
    try {
      if (format === 'csv') {
        await analyticsService.exportToCSV(type);
      } else {
        await analyticsService.exportToJSON(type);
      }
      setShowExportMenu(false);
    } catch (error) {
      console.error('Export error:', error);
      alert(`Failed to export ${type}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex   justify-between  items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor your platform's performance and activity</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#2C7A7B] text-white rounded-lg hover:bg-[#235E5F] transition shadow-md"
            >
              <FileText className="w-5 h-5" />
              Export
              <FiChevronDown className={`transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-700">Export Data</p>
                </div>
                <div className="p-2">
                  {(['requests', 'users', 'responses', 'reports'] as const).map((type) => (
                    <div key={type} className="mb-2 last:mb-0">
                      <p className="text-xs font-medium text-gray-600 px-3 py-1 capitalize">{type}</p>
                      <div className="flex gap-2 px-3 py-1">
                        <button
                          onClick={() => handleExport(type, 'csv')}
                          className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-sm"
                        >
                          CSV
                        </button>
                        <button
                          onClick={() => handleExport(type, 'json')}
                          className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-sm"
                        >
                          JSON
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2C7A7B] text-white rounded-lg hover:bg-[#235E5F] transition shadow-md"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={systemUsage?.users?.total || 0}
          icon={Users}
          color="bg-[#2C7A7B]"
          subtitle={`${systemUsage?.users?.newThisMonth || 0} new this month`}
        />
        <StatCard
          title="Total Requests"
          value={systemUsage?.requests?.total || 0}
          icon={FileText}
          color="bg-[#2C7A7B]"
          subtitle={`${resolutionRates?.pendingRequests || 0} pending`}
        />
        <StatCard
          title="Total Responses"
          value={systemUsage?.responses?.total || 0}
          icon={MessageSquare}
          color="bg-[#2C7A7B]"
          subtitle={`${systemUsage?.responses?.visible || 0} visible, ${systemUsage?.responses?.hidden || 0} hidden`}
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700 font-medium">Time Period:</span>
          <div className="flex flex-wrap gap-2 ">
            {(['daily', 'weekly', 'monthly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-4 py-2   rounded-lg transition ${
                  timePeriod === period
                    ? 'bg-[#2C7A7B] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C7A7B]"
          >
            <option value={7}>Last 7</option>
            <option value={14}>Last 14</option>
            <option value={30}>Last 30</option>
          </select>
        </div>
      </div>

       <div className="">
          <ActivityChart data={activityData} />
        </div>

      <div className="lg:flex space-y-2 gap-6 ">       
        <div className='lg:w-[40%]'>
           <ResolutionMetrics data={resolutionRates || { totalRequests: 0, approvedRequests: 0, rejectedRequests: 0, pendingRequests: 0, resolutionRate: 0, averageResolutionTime: { hours: 0, days: 0 } }} />
        </div>
        <div className='lg:w-[60%] '>
            <ActiveUsersTable data={mostActiveUsers || []} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
