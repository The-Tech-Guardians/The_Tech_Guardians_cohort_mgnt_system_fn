import { Download } from 'lucide-react';
import analyticsService from '../../Services/Analyticsservice';

const ExportSection = () => {
  const handleExport = async (type: 'requests' | 'users' | 'responses' | 'reports', format: 'csv' | 'json') => {
    try {
      if (format === 'csv') {
        await analyticsService.exportToCSV(type);
      } else {
        await analyticsService.exportToJSON(type);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert(`Failed to export ${type}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <Download className="w-5 h-5" />
        Export Data
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(['requests', 'users', 'responses', 'reports'] as const).map((type) => (
          <div key={type} className="border border-gray-200 rounded-lg p-4">
            <p className="font-medium text-gray-700 mb-3 capitalize">{type}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport(type, 'csv')}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                CSV
              </button>
              <button
                onClick={() => handleExport(type, 'json')}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
              >
                JSON
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExportSection;
