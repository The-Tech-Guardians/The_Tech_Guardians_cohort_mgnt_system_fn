import { CheckCircle } from "lucide-react";

 const recentActivity = [
    { action: 'Completed', item: 'Async JavaScript & Promises', type: 'Lesson', date: '2 hours ago' },
    { action: 'Submitted', item: 'Weather App Assignment', type: 'Assignment', date: '1 day ago' },
    { action: 'Scored 92%', item: 'JavaScript Quiz', type: 'Quiz', date: '2 days ago' },
    { action: 'Completed', item: 'React Hooks', type: 'Lesson', date: '3 days ago' },
  ];
const RecentActivity = () => {
  return (
    <div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 grid place-items-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600 truncate">{activity.item}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
    </div>
  )
}

export default RecentActivity