import { useState } from "react";

export default function AssignmentTab() {
  const [checks, setChecks] = useState([true, true, false, false, false]);

  return (
    <div className="bg-[#111318] border border-white/[0.07] rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between">
        <div className="font-['Syne'] text-[15px] font-bold">Build a Weather App with Fetch API</div>
        <div className="flex items-center gap-1.5 text-xs text-[#f6ad55] bg-[#f6ad55]/[0.08] border border-[#f6ad55]/20 px-2.5 py-1 rounded-full">
          ⏰ Due in 3 days
        </div>
      </div>
      <div className="p-5">
        <p className="text-[13px] text-gray-400 leading-relaxed mb-4">
          In this assignment, you&apos;ll build a small weather application that fetches real-time data from a public API. You&apos;ll demonstrate your understanding of async/await, error handling, and DOM manipulation.
        </p>

        <div className="font-['Syne'] text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">Requirements Checklist</div>
        <ul className="flex flex-col gap-2 mb-5">
          {['Fetch weather data using async/await syntax', 'Handle loading and error states properly', 'Display temperature, humidity, and conditions', 'Allow searching by city name', 'Include responsive CSS styling'].map((req, i) => (
            <li key={i} className="flex items-center gap-2.5 text-[13px] text-gray-400">
              <div
                onClick={() => setChecks(prev => prev.map((c, idx) => idx === i ? !c : c))}
                className={`w-[18px] h-[18px] rounded border-[1.5px] grid place-items-center text-[10px] cursor-pointer transition flex-shrink-0 ${
                  checks[i] ? 'bg-[#68d391]/15 border-[#68d391] text-[#68d391]' : 'border-white/[0.07]'
                }`}
              >
                {checks[i] && '✓'}
              </div>
              {req}
            </li>
          ))}
        </ul>

        <div className="border-2 border-dashed border-white/[0.07] rounded-xl p-8 text-center cursor-pointer hover:border-[#63b3ed] hover:bg-[#63b3ed]/[0.03] transition mb-4">
          <div className="text-[28px] text-gray-400 mb-2">⬆</div>
          <div className="text-[13px] text-gray-400">Drag & drop your files here, or <span className="text-[#63b3ed] cursor-pointer">browse</span></div>
          <div className="text-[11px] text-gray-400 mt-1.5">Accepted: .zip, .html, .js — Max 10MB</div>
        </div>

        <div className="flex gap-2.5">
          <button className="flex-1 px-4 py-2 rounded-lg text-[13px] font-medium bg-[#63b3ed] text-[#0a0b0f] hover:bg-[#90cdf4] transition">
            Submit Assignment
          </button>
          <button className="px-4 py-2 rounded-lg text-[13px] font-medium border border-white/[0.07] text-gray-400 hover:bg-[#181c24] hover:text-white transition">
            Save Draft
          </button>
        </div>
      </div>
    </div>
  );
}