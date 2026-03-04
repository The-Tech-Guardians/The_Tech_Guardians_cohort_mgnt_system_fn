import { useEffect, useState } from "react"
import { Users, FileText, MessageSquare, TrendingUp, Clock, RefreshCw, Calendar } from "lucide-react"
import StatCard from "../shares/ui/statCart"
import analyticsService from "./Dahboard/Admin/Services/Analyticsservice"
import CategoryChart from "./Dahboard/Admin/Component/AnalyticsComponents/CategoryChart"
import ActivityChart from "./Dahboard/Admin/Component/AnalyticsComponents/ActivityChart"
import ResolutionMetrics from "./Dahboard/Admin/Component/AnalyticsComponents/ResolutionMetrics"
import ActiveUsersTable from "./Dahboard/Admin/Component/AnalyticsComponents/ActiveUsersTable"
import ExportSection from "./Dahboard/Admin/Component/AnalyticsComponents/ExportSection"

const DashboardHome = () => {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [activityData, setActivityData] = useState<any[]>([])
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [timeRange, setTimeRange] = useState(7)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      
      const [dashboard, activity] = await Promise.all([
        analyticsService.getComprehensiveDashboard(),
        analyticsService.getTimeBasedActivity(timePeriod, timeRange),
      ])

      setDashboardData(dashboard)
      setActivityData(activity.data || activity)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [timePeriod, timeRange])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-600">No data available</p>
      </div>
    )
  }

  const { requestsByCategory, mostActiveUsers, resolutionRates, systemUsage } = dashboardData

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Real-time analytics and platform management.</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          <RefreshCw className="w-5 h-5" />
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={systemUsage?.users?.total || 0}
          icon={<Users className="w-6 h-6" />}
          color="bg-blue-500"
          subtitle={`${systemUsage?.users?.newThisMonth || 0} new this month`}
        />
        <StatCard
          title="Active Users"
          value={systemUsage?.users?.activeUsers || 0}
          icon={<TrendingUp className="w-6 h-6" />}
          color="bg-green-500"
          subtitle="Last 30 days"
        />
        <StatCard
          title="Total Requests"
          value={systemUsage?.requests?.total || 0}
          icon={<FileText className="w-6 h-6" />}
          color="bg-purple-500"
          subtitle={`${resolutionRates?.pendingRequests || 0} pending`}
        />
        <StatCard
          title="Total Responses"
          value={systemUsage?.responses?.total || 0}
          icon={<MessageSquare className="w-6 h-6" />}
          color="bg-indigo-500"
          subtitle="All time"
        />
        <StatCard
          title="Resolution Rate"
          value={`${resolutionRates?.resolutionRate || 0}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="bg-emerald-500"
          subtitle={`${resolutionRates?.approvedRequests || 0} approved`}
        />
        <StatCard
          title="Avg Resolution Time"
          value={`${resolutionRates?.averageResolutionTime?.days?.toFixed(1) || 0} days`}
          icon={<Clock className="w-6 h-6" />}
          color="bg-orange-500"
          subtitle={`${resolutionRates?.averageResolutionTime?.hours?.toFixed(1) || 0} hours`}
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700 font-medium">Time Period:</span>
          <div className="flex gap-2">
            {(['daily', 'weekly', 'monthly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-4 py-2 rounded-lg transition ${
                  timePeriod === period
                    ? 'bg-blue-600 text-white'
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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>Last 7</option>
            <option value={14}>Last 14</option>
            <option value={30}>Last 30</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart data={activityData} />
        </div>

        <CategoryChart data={requestsByCategory || []} />
        <ResolutionMetrics data={resolutionRates || { totalRequests: 0, approvedRequests: 0, rejectedRequests: 0, pendingRequests: 0, resolutionRate: 0, averageResolutionTime: { hours: 0, days: 0 } }} />

        <div className="lg:col-span-2">
          <ActiveUsersTable data={mostActiveUsers || []} />
        </div>

        <div className="lg:col-span-2">
          <ExportSection />
        </div>
      </div>

    </div>
  )
}

export default DashboardHome
