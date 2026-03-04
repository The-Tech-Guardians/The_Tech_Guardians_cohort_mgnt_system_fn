import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ResolutionData {
  totalRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  pendingRequests: number;
  resolutionRate: number;
  averageResolutionTime: {
    hours: number;
    days: number;
  };
}

interface Props {
  data: ResolutionData;
}

const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

const ResolutionMetrics = ({ data }: Props) => {
  const chartData = [
    { name: 'Approved', value: data.approvedRequests },
    { name: 'Rejected', value: data.rejectedRequests },
    { name: 'Pending', value: data.pendingRequests },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Resolution Status</h3>
      
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Resolution Rate</p>
          <p className="text-2xl font-bold text-[#2C7A7B]">{data.resolutionRate}%</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Avg Resolution Time</p>
          <p className="text-2xl font-bold text-[#2C7A7B]">{data.averageResolutionTime?.days?.toFixed(1) || 0} days</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResolutionMetrics;
