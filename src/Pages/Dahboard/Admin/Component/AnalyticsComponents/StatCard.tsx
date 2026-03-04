import { type FC } from 'react';

interface Props {
  title: string;
  value: string | number;
  icon: FC<{ className?: string }>;
  color: string;
  subtitle?: string;
}

const StatCard = ({ title, value, icon: Icon, color, subtitle }: Props) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
        </div>
        <div className={`${color} p-3 rounded-full`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
