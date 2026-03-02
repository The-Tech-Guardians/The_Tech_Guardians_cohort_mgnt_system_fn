import React from "react";
import Sidebar from "../../components/admin/Sidebar";

export const metadata = {
  title: "Admin Dashboard - CohortLMS",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
