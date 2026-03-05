import { CheckCircle } from "lucide-react";

const RecentActivity = () => {
  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8 text-gray-500">
          <p>No recent activity available.</p>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;