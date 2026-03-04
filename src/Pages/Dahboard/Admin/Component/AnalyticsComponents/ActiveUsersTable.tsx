import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ActiveUser {
  userId: string;
  name: string;
  email: string;
  requestCount: number;
  responseCount: number;
  totalActivity: number;
}

interface Props {
  data: ActiveUser[];
}

const ActiveUsersTable = ({ data }: Props) => {
  const chartData = useMemo(() => 
    data.map(user => ({
      name: user.name,
      requests: user.requestCount,
      responses: user.responseCount,
    })), [data]
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Most Active Users</h3>
      {data.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No active users data available</p>
      ) : (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            type="number" 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={100}
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
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
          <Bar 
            dataKey="requests" 
            fill="#2C7A7B" 
            name="Requests"
            radius={[0, 4, 4, 0]}
          />
          <Bar 
            dataKey="responses" 
            fill="#10b981" 
            name="Responses"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      )}
    </div>
  );
};

export default ActiveUsersTable;
