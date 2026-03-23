import { educationOptions } from "@/app/application_process/page";
import { Label } from "./lable";
import { Textarea } from "./textarrea";
import { Input } from "./input";
import { CheckCircle, ChevronRight, Clock, AlertCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Btn } from "../instructor/ui/SharedUI";
import { applicationService, Application } from "@/services/applicationService";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  cohortId: string;
}

export function ApplicationForm({ cohortId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    age: '',
    education: "",
    timeCommitment: "",
    teamworkFeelings: "",
    skillsTeamworkThoughts: "",
    communityProblem: "",
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted' | 'pending' | 'approved' | 'rejected'>('idle');
  const [appStatus, setAppStatus] = useState<Application | null>(null);
  const [error, setError] = useState('');

  const setField = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }, []);

  const checkApplicationStatus = useCallback(async () => {
    if (!cohortId) return;
    try {
      const apps = await applicationService.getMyApplications();
      const app = apps.find(a => a.cohortId === cohortId);
      if (app) {
        setAppStatus(app);
        if (app.status === 'PENDING') {
          setStatus('pending');
        } else if (app.status === 'APPROVED') {
          setStatus('approved');
        } else if (app.status === 'REJECTED') {
          setStatus('rejected');
        }
      }
    } catch (err) {
      console.error('Status check failed:', err);
    }
  }, [cohortId]);

  useEffect(() => {
    if (status === 'submitted') {
      const interval = setInterval(checkApplicationStatus, 5000); // Poll every 5s
      return () => clearInterval(interval);
    }
  }, [status, checkApplicationStatus]);

  useEffect(() => {
    const initialCheck = async () => {
      await checkApplicationStatus();
    };
    initialCheck();
  }, [checkApplicationStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cohortId) {
      setError('No cohort selected');
      return;
    }
    setStatus('submitting');
    setError('');

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    // Debug: Log all form data
    console.log('🔥 Form data being submitted:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    
    try {
      await applicationService.submitApplication(cohortId, formData);
      setStatus('submitted');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Submission failed';
      setError(message);
      setStatus('idle');
    }
  };

  if (status === 'approved' && appStatus) {
    return (
      <div className="border border-green-200 rounded-lg p-8 bg-green-50 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-green-800 mb-3">
          Congratulations!
        </h3>
        <p className="text-lg text-green-700 mb-6 leading-relaxed">
          Your application for this cohort has been <strong>APPROVED</strong>. Welcome to the cohort!
        </p>
        <Link href="/learner" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
          Continue to Learner Dashboard
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="border border-red-200 rounded-lg p-8 bg-red-50 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-red-800 mb-3">
          Application Not Approved
        </h3>
        <p className="text-lg text-red-700 mb-6 leading-relaxed">
          Thank you for applying. Unfortunately, your application for this cohort has been rejected at this time.
        </p>
        <p className="text-sm text-red-600 mb-8">
          Please wait for upcoming opportunities and continue improving your skills.
        </p>
        <Link href="/cohorts" className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
          View Upcoming Cohorts
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="border border-yellow-200 rounded-lg p-8 bg-yellow-50 text-center">
        <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Clock className="w-8 h-8 text-yellow-600" />
        </div>
        <h3 className="text-xl font-bold text-yellow-800 mb-3">
          Application Pending Review
        </h3>
        <p className="text-lg text-yellow-700 mb-6 leading-relaxed">
          Your application has been received and is under review by our team.
        </p>
        <p className="text-sm text-yellow-600 mb-8">
          We&apos;ll notify you within 2 weeks with our decision. Check back here for updates.
        </p>
        <div className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
          Refresh Status
        </div>
      </div>
    );
  }

  // Form
  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800">The Application Form</h3>
        <p className="text-xs text-gray-500 mt-1">
          Answer honestly — we want to understand who you are, not just what you&apos;ve done. This takes about 5–10 minutes.
        </p>
      </div>

      {error && (
        <div className="p-4 border border-red-200 bg-red-50 rounded-b-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-5 space-y-5">
        {/* Name + Age + Education */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Name (Auto-filled)</Label>
            <Input
              id="name"
              type="text"
              value="Auto-filled from profile"
              readOnly
              className="bg-gray-50 text-sm cursor-not-allowed"
            />
          </div>
          <div>
            <Label>Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              placeholder="e.g. 21"
              value={form.age}
              onChange={setField("age")}
              required
            />
          </div>
          <div>
            <Label required>Education Level</Label>
            <select
              id="educationLevel"
              name="educationLevel"
              value={form.education}
              onChange={setField("education")}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
            >
              <option value="" disabled>Select your current level…</option>
              {educationOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Questions */}
        <div>
          <Label required>
            How much time can you realistically commit to this cohort per week?
          </Label>
          <p className="text-xs text-gray-400 mb-2">
            Be honest — there&apos;s no wrong answer. We just want to plan around your life.
          </p>
          <Textarea
            id="timeCommitment"
            name="timeCommitment"
            placeholder="e.g. 'I can commit 10-15 hours per week, mostly evenings and weekends...'"
            value={form.timeCommitment}
            onChange={setField("timeCommitment")}
            required
            rows={3}
          />
        </div>

        <div>
          <Label required>
            How do you feel about working with strangers or like-minded youth towards a common goal?
          </Label>
          <p className="text-xs text-gray-400 mb-2">
            Tell us about a time you collaborated, or how you generally approach group work.
          </p>
          <Textarea
            id="teamworkFeelings"
            name="teamworkFeelings"
            placeholder="e.g. 'I'm excited about group work because I learn from different perspectives...'"
            value={form.teamworkFeelings}
            onChange={setField("teamworkFeelings")}
            required
            rows={4}
          />
        </div>

        <div>
          <Label required>
            How do you think technical skills and teamwork can help in entrepreneurship?
          </Label>
          <p className="text-xs text-gray-400 mb-2">
            Share your own perspective — no textbook answer expected here.
          </p>
          <Textarea
            id="skillsTeamworkThoughts"
            name="skillsTeamworkThoughts"
            placeholder="e.g. 'Technical skills help build the product, but teamwork helps sell it...'"
            value={form.skillsTeamworkThoughts}
            onChange={setField("skillsTeamworkThoughts")}
            required
            rows={4}
          />
        </div>

        <div>
          <Label required>
            What is one specific problem you&apos;ve seen in your community that requires a team to solve through entrepreneurship?
          </Label>
          <p className="text-xs text-gray-400 mb-2">
            Think local and specific. The more concrete, the better.
          </p>
          <Textarea
            id="communityProblem"
            name="communityProblem"
            placeholder="e.g. 'In my neighborhood, many young people struggle with access to computers...'"
            value={form.communityProblem}
            onChange={setField("communityProblem")}
            required
            rows={4}
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Btn type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
            <ChevronRight className="w-4 h-4" />
          </Btn>
          <p className="text-xs text-gray-400 mt-2">
            By submitting, you confirm that all information provided is truthful and accurate.
          </p>
        </div>
      </form>
    </div>
  );
}
