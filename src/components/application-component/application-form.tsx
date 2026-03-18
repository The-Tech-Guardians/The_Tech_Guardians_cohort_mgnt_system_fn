import { educationOptions } from "@/app/application_process/page";
import { Label } from "./lable";
import { Textarea } from "./textarrea";
import { Input } from "./input";
import { CheckCircle, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Btn } from "../instructor/ui/SharedUI";

export function ApplicationForm() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    education: "",
    timeCommitment: "",
    teamwork: "",
    technicalTeamship: "",
    communityProblem: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="border border-gray-200 rounded-lg p-8 bg-white text-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-6 h-6 text-blue-500" />
        </div>
        <h3 className="text-base font-semibold text-gray-800 mb-2">
          Application Submitted!
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Thank you,{" "}
          <span className="font-medium text-gray-700">{form.name}</span>. We&apos;ve
          received your application and our team will review it personally. Expect a
          response within <strong>2 weeks</strong> at{" "}
          <span className="text-blue-600">{form.email}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800">The Application Form</h3>
        <p className="text-xs text-gray-500 mt-1">
          Answer honestly — we want to understand who you are, not just what you&apos;ve
          done. This takes about 5–10 minutes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-5 space-y-5">

        {/* Name + Age */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label required>Full Name</Label>
            <Input
              id="name"
              placeholder="e.g. Freddy Bijanja"
              value={form.name}
              onChange={set("name")}
              required
            />
          </div>
          <div className="sm:w-24">
            <Label required>Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="e.g. 21"
              value={form.age}
              onChange={set("age")}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <Label required>Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={set("email")}
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            We&apos;ll send your decision to this address.
          </p>
        </div>

        {/* Education */}
        <div>
          <Label required>Education Level</Label>
          <select
            id="education"
            value={form.education}
            onChange={set("education")}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
          >
            <option value="" disabled>Select your current level…</option>
            {educationOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <hr className="border-gray-100" />

        {/* Q1 */}
        <div>
          <Label required>
            How much time can you realistically commit to this cohort per week?
          </Label>
          <p className="text-xs text-gray-400 mb-2">
            Be honest — there&apos;s no wrong answer. We just want to plan around your life.
          </p>
          <Textarea
            id="timeCommitment"
            placeholder=""
            value={form.timeCommitment}
            onChange={set("timeCommitment")}
            required
            rows={3}
          />
        </div>

        {/* Q2 */}
        <div>
          <Label required>
            How do you feel about working with strangers or like-minded youth towards a common goal?
          </Label>
          <p className="text-xs text-gray-400 mb-2">
            Tell us about a time you collaborated, or how you generally approach group work.
          </p>
          <Textarea
            id="teamwork"
            placeholder=""
            value={form.teamwork}
            onChange={set("teamwork")}
            required
            rows={4}
          />
        </div>

        {/* Q3 */}
        <div>
          <Label required>
            How do you think technical skills and teamwork can help in entrepreneurship?
          </Label>
          <p className="text-xs text-gray-400 mb-2">
            Share your own perspective — no textbook answer expected here.
          </p>
          <Textarea
            id="technicalTeamship"
            placeholder=""
            value={form.technicalTeamship}
            onChange={set("technicalTeamship")}
            required
            rows={4}
          />
        </div>

        {/* Q4 */}
        <div>
          <Label required>
            What is one specific problem you&apos;ve seen in your community that requires a team to solve through entrepreneurship?
          </Label>
          <p className="text-xs text-gray-400 mb-2">
            Think local and specific. The more concrete, the better.
          </p>
          <Textarea
            id="communityProblem"
            placeholder=""
            value={form.communityProblem}
            onChange={set("communityProblem")}
            required
            rows={4}
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          {/* <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Submit Application
           
          </button> */}
          <Btn>
            Sumit Application
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