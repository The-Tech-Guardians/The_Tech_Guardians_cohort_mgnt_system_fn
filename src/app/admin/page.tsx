import React, { useState } from "react";

export default function AdminHome() {
  // placeholder metrics
  type Flags = { newUI: boolean; betaCourse: boolean };
  const [featureFlags, setFeatureFlags] = useState<Flags>({
    newUI: true,
    betaCourse: false,
  });

  const toggleFlag = (key: keyof Flags) => {
    setFeatureFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-gray-800 rounded shadow">
          <h2 className="text-xl">Enrollments</h2>
          <p className="text-3xl font-semibold">1,243</p>
        </div>
        <div className="p-4 bg-gray-800 rounded shadow">
          <h2 className="text-xl">Completion Rate</h2>
          <p className="text-3xl font-semibold">72%</p>
        </div>
        <div className="p-4 bg-gray-800 rounded shadow">
          <h2 className="text-xl">Active Users</h2>
          <p className="text-3xl font-semibold">389</p>
        </div>
      </div>
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Feature Flags</h2>
        <div className="space-y-2">
          {Object.entries(featureFlags).map(([key, enabled]) => {
          const flagKey = key as keyof Flags;
          return (
            <div key={key} className="flex items-center space-x-3">
              <span className="capitalize">{key}</span>
              <button
                onClick={() => toggleFlag(flagKey)}
                className={`px-3 py-1 rounded-full text-sm font-medium focus:outline-none transition-colors ${
                  enabled
                    ? "bg-green-600 text-white"
                    : "bg-gray-600 text-gray-300"
                }`}
              >
                {enabled ? "On" : "Off"}
              </button>
            </div>
          );
        })}
        </div>
      </section>
    </div>
  );
}
