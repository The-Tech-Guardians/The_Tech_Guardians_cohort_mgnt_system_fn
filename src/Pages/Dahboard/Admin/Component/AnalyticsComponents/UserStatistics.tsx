import { FiBarChart2 } from "react-icons/fi";
import type { SystemUsage } from "../../Services/Types/types";

interface UserStatisticsProps {
  systemUsage: SystemUsage;
}

const UserStatistics = ({ systemUsage }: UserStatisticsProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FiBarChart2 className="text-[#2C7A7B]" />
        User Statistics
      </h2>
      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-900">Total Users</p>
            <p className="text-3xl font-bold text-[#2C7A7B]">{systemUsage.users.total}</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-[#2C7A7B] h-3 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-900">Active Users (30d)</p>
            <p className="text-3xl font-bold text-[#2C7A7B]">{systemUsage.users.activeUsers}</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-[#2C7A7B] h-3 rounded-full" style={{ width: `${(systemUsage.users.activeUsers / systemUsage.users.total) * 100}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-2 font-medium">
            {Math.round((systemUsage.users.activeUsers / systemUsage.users.total) * 100)}% engagement rate
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-900">Admin Users</p>
            <p className="text-3xl font-bold text-gray-500">{systemUsage.users.admins}</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gray-500 h-3 rounded-full" style={{ width: `${(systemUsage.users.admins / systemUsage.users.total) * 100}%` }} />
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-900">New This Month</p>
            <p className="text-3xl font-bold text-gray-500">{systemUsage.users.newThisMonth}</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gray-500 h-3 rounded-full" style={{ width: `${(systemUsage.users.newThisMonth / systemUsage.users.total) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatistics;
