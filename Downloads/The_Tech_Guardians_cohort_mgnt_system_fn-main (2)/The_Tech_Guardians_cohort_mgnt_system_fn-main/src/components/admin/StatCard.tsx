import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  color?: string;
}

export default function StatCard({ title, value, icon: Icon, trend, color = "blue" }: StatCardProps) {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-600",
    green: "from-blue-50 to-blue-100 border-blue-200 text-blue-600",
    amber: "from-blue-50 to-blue-100 border-blue-200 text-blue-600",
    red: "from-blue-50 to-blue-100 border-blue-200 text-blue-600",
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue} border rounded-lg p-6 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-white/50`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
