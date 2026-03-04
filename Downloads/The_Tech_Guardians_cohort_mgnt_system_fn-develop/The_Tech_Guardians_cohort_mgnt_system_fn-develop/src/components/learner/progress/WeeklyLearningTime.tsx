'use client';

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WeeklyLearningTime = () => {
  const data = [
    { day: 'Mon', hours: 2.5, completed: 3, progress: 75, engagement: 85 },
    { day: 'Tue', hours: 3.2, completed: 4, progress: 80, engagement: 90 },
    { day: 'Wed', hours: 1.8, completed: 2, progress: 65, engagement: 70 },
    { day: 'Thu', hours: 4.0, completed: 5, progress: 95, engagement: 92 },
    { day: 'Fri', hours: 3.5, completed: 4, progress: 88, engagement: 88 },
    { day: 'Sat', hours: 1.2, completed: 1, progress: 45, engagement: 60 },
    { day: 'Sun', hours: 0.8, completed: 1, progress: 30, engagement: 50 },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Weekly Learning Time</h2>
      
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} margin={{ top: 20, right: 60, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="day" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            yAxisId="left"
            label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            domain={[0, 5]}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            label={{ value: '%', angle: 90, position: 'insideRight', style: { fontSize: 12, fill: '#6b7280' } }}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            domain={[0, 100]}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
            iconType="rect"
          />
          <Bar 
            yAxisId="left"
            dataKey="hours" 
            fill="#6366f1" 
            name="Study Hours"
            barSize={30}
          />
          <Bar 
            yAxisId="left"
            dataKey="completed" 
            fill="#f97316" 
            name="Lessons Completed"
            barSize={30}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="progress" 
            stroke="#22c55e" 
            strokeWidth={2}
            name="Progress %"
            dot={{ r: 3 }}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="engagement" 
            stroke="#eab308" 
            strokeWidth={2}
            name="Engagement %"
            dot={{ r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyLearningTime;
