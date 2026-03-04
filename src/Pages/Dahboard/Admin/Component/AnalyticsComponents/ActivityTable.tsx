import { FiActivity } from "react-icons/fi";
import type { TimeBasedData } from "../../Services/Types/types";

interface ActivityTableProps {
  data: TimeBasedData[];
  period: "daily" | "weekly" | "monthly";
  range: number;
  onPeriodChange: (period: "daily" | "weekly" | "monthly") => void;
  onRangeChange: (range: number) => void;
}

const ActivityTable = ({ data, period, range, onPeriodChange, onRangeChange }: ActivityTableProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FiActivity className="text-[#2C7A7B]" />
          Activity Over Time
        </h2>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => onPeriodChange(e.target.value as "daily" | "weekly" | "monthly")}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent bg-white"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <select
            value={range}
            onChange={(e) => onRangeChange(Number(e.target.value))}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent bg-white"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-100">
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Date</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Requests</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Responses</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">New Users</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Total Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item) => (
              <tr key={item.date} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.date}</td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-[#2C7A7B]/10 text-[#2C7A7B]">
                    {item.requests}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gray-100 text-gray-700">
                    {item.responses}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gray-100 text-gray-700">
                    {item.newUsers}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-lg font-bold text-gray-900">
                    {item.requests + item.responses + item.newUsers}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityTable;
