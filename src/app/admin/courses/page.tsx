import React from "react";
import DataTable from "../../../components/admin/DataTable";

interface CourseType {
  id: number;
  name: string;
  description: string;
}

const sampleTypes: CourseType[] = [
  { id: 1, name: "Coding", description: "Programming and development" },
  { id: 2, name: "Content Creation", description: "Video and text production" },
];

export default function CoursesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Course & Content Management</h1>
        <button className="px-4 py-2 bg-green-600 rounded">New Course Type</button>
      </div>
      <DataTable
        data={sampleTypes}
        columns={[
          { header: "Name", accessor: "name" },
          { header: "Description", accessor: "description" },
          {
            header: "Actions",
            accessor: "id",
            render: (row) => (
              <button className="px-2 py-1 bg-blue-600 rounded text-sm">
                Edit
              </button>
            ),
          },
        ]}
      />
      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Structure (placeholder)</h2>
        <p className="text-gray-400">Modules and lessons editor coming soon.</p>
      </div>
    </div>
  );
}
