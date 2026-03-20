"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { tokenManager } from '@/lib/auth';
import { ApplicationForm } from "@/components/application-component/application-form";
import Link from "next/link";

export default function FormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cohortId = searchParams.get('cohortId') || '';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!tokenManager.getUser()) {
      router.replace('/login?redirect=/application_process/form');
      return;
    }
  }, [router]);

  return (
    <div className="mt-44 py-8 sm:py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back link */}
        <Link 
          href="/application_process"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Application Process
        </Link>
        
        <ApplicationForm cohortId={cohortId} />
      </div>
    </div>
  );
}
