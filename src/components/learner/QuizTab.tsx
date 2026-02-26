import { useState } from "react";

export default function QuizTab() {
  const [selected, setSelected] = useState<number | null>(1);

  return (
    <div className="bg-[#111318] border border-white/[0.07] rounded-xl overflow-hidden">
      <div className="px-5 py-4 bg-[#181c24] border-b border-white/[0.07] flex items-center justify-between">
        <div className="font-['Syne'] text-[15px] font-bold">Async JavaScript — Knowledge Check</div>
        <div className="flex gap-2">
          <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-white/[0.07] text-gray-400">5 Questions</span>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-white/[0.07] text-gray-400">2 Retakes</span>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-white/[0.07] text-gray-400">Pass: 70%</span>
        </div>
      </div>
      <div className="p-5">
        <div className="mb-6">
          <div className="font-mono text-[10px] text-[#63b3ed] mb-1.5">QUESTION 01 / 05</div>
          <div className="text-sm font-medium mb-3">What does a JavaScript Promise represent?</div>
          <div className="flex flex-col gap-2">
            {[
              'A synchronous function that blocks execution',
              'An object representing eventual completion or failure of async operation',
              'A special type of variable for storing errors',
              'A callback function that runs after a timeout',
            ].map((opt, i) => (
              <div
                key={i}
                onClick={() => setSelected(i)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 border-[1.5px] rounded-lg cursor-pointer transition text-[13px] ${
                  selected === i
                    ? 'border-[#63b3ed] bg-[#63b3ed]/[0.08] text-[#63b3ed]'
                    : 'border-white/[0.07] hover:border-[#63b3ed]/30 hover:bg-[#63b3ed]/[0.03]'
                }`}
              >
                <div className={`w-[22px] h-[22px] rounded-full border grid place-items-center font-mono text-[10px] font-semibold flex-shrink-0 transition ${
                  selected === i ? 'bg-[#63b3ed] border-[#63b3ed] text-black' : 'bg-[#181c24] border-white/[0.07]'
                }`}>
                  {String.fromCharCode(65 + i)}
                </div>
                {opt}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-5 py-4 border-t border-white/[0.07] bg-black/20 flex items-center justify-between">
        <span className="text-xs text-gray-400">1 of 5 answered</span>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg text-[13px] font-medium border border-white/[0.07] text-gray-400 hover:bg-[#181c24] hover:text-white transition">
            Save Progress
          </button>
          <button className="px-4 py-2 rounded-lg text-[13px] font-medium bg-[#63b3ed] text-[#0a0b0f] hover:bg-[#90cdf4] transition">
            Submit Quiz →
          </button>
        </div>
      </div>
    </div>
  );
}