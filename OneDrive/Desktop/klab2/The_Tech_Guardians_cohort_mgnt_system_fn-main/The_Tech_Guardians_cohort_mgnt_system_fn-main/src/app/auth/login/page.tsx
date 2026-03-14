'use client'

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <Link href="/" className="text-2xl font-bold text-blue-600 hover:underline">
          ← Go to Login Homepage
        </Link>
        <p className="text-gray-500 mt-4">Main login is now at <code>/</code></p>
      </div>
    </div>
  );
}

