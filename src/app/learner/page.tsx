"use client";

import { useEffect, useState } from "react";
import { authAPI } from "@/lib/auth";
import {
BarChart,
Bar,
CartesianGrid,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
} from "recharts";

type Cohort = {
id: string;
title: string;
description?: string;
};

const PRODUCTIVITY = [
{ day: "Mon", Mentoring: 40, SelfImprove: 60, Student: 30 },
{ day: "Tue", Mentoring: 30, SelfImprove: 50, Student: 40 },
{ day: "Wed", Mentoring: 50, SelfImprove: 70, Student: 45 },
{ day: "Thu", Mentoring: 35, SelfImprove: 55, Student: 60 },
{ day: "Fri", Mentoring: 60, SelfImprove: 80, Student: 50 },
];

export default function LearnerDashboardPage() {
const [availableCohorts, setAvailableCohorts] = useState<Cohort[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
const fetchCohorts = async () => {
try {
const response = await authAPI.getAvailableCohorts();


    if (response.success) {
      setAvailableCohorts(response.data || []);
    } else {
      setError("Failed to load cohorts");
    }
  } catch (err) {
    console.error(err);
    setError("Network error");
  } finally {
    setLoading(false);
  }
};

fetchCohorts();


}, []);

return ( <div className="p-6 space-y-8">
{/* PAGE HEADER */} <div> <h1 className="text-2xl font-bold text-gray-900">
Learner Dashboard </h1> <p className="text-sm text-gray-500">
Track your learning progress and available cohorts. </p> </div>


  {/* ERROR MESSAGE */}
  {error && (
    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
      {error}
    </div>
  )}

  {/* AVAILABLE COHORTS */}
  <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h2 className="text-lg font-semibold mb-4">
      Available Cohorts
    </h2>

    {loading ? (
      <p className="text-sm text-gray-500">Loading cohorts...</p>
    ) : availableCohorts.length === 0 ? (
      <p className="text-sm text-gray-500">
        No cohorts available right now.
      </p>
    ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableCohorts.map((cohort) => (
          <div
            key={cohort.id}
            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
          >
            <h3 className="font-semibold text-gray-800">
              {cohort.title}
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              {cohort.description || "No description"}
            </p>

            <button className="mt-4 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg">
              Join Cohort
            </button>
          </div>
        ))}
      </div>
    )}
  </section>

  {/* PRODUCTIVITY CHART */}
  <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h2 className="text-lg font-semibold mb-4">
      Weekly Productivity
    </h2>

    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={PRODUCTIVITY}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />

          <Bar dataKey="Mentoring" />
          <Bar dataKey="SelfImprove" />
          <Bar dataKey="Student" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </section>
</div>


);
}
