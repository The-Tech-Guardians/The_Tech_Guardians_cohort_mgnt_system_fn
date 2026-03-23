"use client";

import { useState } from "react";
import { Shield } from "lucide-react";

export default function ModerationPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <Shield className="w-8 h-8 text-gray-400" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">Content Moderation</h2>
          <p className="text-gray-600">Coming Soon</p>
        </div>
      </div>
    </div>
  );
}
