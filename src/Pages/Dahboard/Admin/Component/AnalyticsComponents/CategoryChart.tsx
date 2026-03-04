import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CategoryData {
  _id: string;
  categoryName: string;
  count: number;
}

interface Props {
  data: CategoryData[];
}

const CategoryChart = ({ data }: Props) => {
  const chartData = data.map(item => ({
    name: item.categoryName,
    count: item.count,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Requests by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#3B82F6" name="Requests" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
