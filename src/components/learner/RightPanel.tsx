export default function RightPanel() {
  return (
    <aside className="hidden xl:block w-[300px] border-l border-white/[0.07] bg-[#111318] overflow-y-auto p-5 h-full scrollbar-hide">
      <div className="mb-6">
        <div className="font-['Syne'] text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">Your Progress</div>
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          {[
            { val: '17', label: 'Lessons Done', color: '#63b3ed' },
            { val: '3', label: 'Assignments', color: '#76e3c4' },
            { val: '85%', label: 'Quiz Avg', color: '#68d391' },
            { val: '9', label: 'Days Left', color: '#f6ad55' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#181c24] border border-white/[0.07] rounded-lg p-3">
              <div className="font-['Syne'] text-[22px] font-extrabold leading-none mb-1" style={{ color: stat.color }}>
                {stat.val}
              </div>
              <div className="text-[11px] text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[11px] text-gray-400 mb-1.5">
          <span>Course completion</span>
          <span>35%</span>
        </div>
        <div className="h-1.5 bg-[#181c24] rounded-full overflow-hidden">
          <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-[#63b3ed] to-[#76e3c4] transition-all duration-500" />
        </div>
      </div>

      <div className="h-px bg-white/[0.07] my-6" />

      <div className="mb-6">
        <div className="font-['Syne'] text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">Your Instructor</div>
        <div className="flex items-center gap-3 p-3 bg-[#181c24] border border-white/[0.07] rounded-lg cursor-pointer hover:border-[#63b3ed]/40 transition">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2b6cb0] to-[#1a365d] grid place-items-center font-['Syne'] text-sm font-bold flex-shrink-0">
            RN
          </div>
          <div>
            <div className="text-[13px] font-medium mb-0.5">Robert N</div>
            <div className="text-[11px] text-gray-400">Senior Web Engineer</div>
            <div className="flex gap-1.5 mt-1">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#63b3ed]/[0.08] border border-[#63b3ed]/15 text-[#63b3ed]">PhD CS</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#63b3ed]/[0.08] border border-[#63b3ed]/15 text-[#63b3ed]">10yr exp</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-white/[0.07] my-6" />

      <div className="mb-6">
        <div className="font-['Syne'] text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">Announcements</div>
        <div className="space-y-2.5">
          <div className="border-l-[3px] border-[#f6ad55] pl-3 pr-2 py-2.5 bg-[#f6ad55]/[0.04] rounded-r-lg">
            <div className="text-xs font-semibold mb-0.5">⚠ Assignment Deadline Extended</div>
            <div className="text-xs text-gray-400 leading-relaxed">Weather App deadline extended by 48h due to API issues.</div>
            <div className="font-mono text-[10px] text-gray-400 mt-1">2 hours ago</div>
          </div>
          <div className="border-l-[3px] border-[#63b3ed] pl-3 pr-2 py-2.5 bg-[#63b3ed]/[0.04] rounded-r-lg">
            <div className="text-xs font-semibold mb-0.5">Week 4 content is live</div>
            <div className="text-xs text-gray-400 leading-relaxed">ES6+ features and DOM Manipulation lessons are now available.</div>
            <div className="font-mono text-[10px] text-gray-400 mt-1">Yesterday</div>
          </div>
          <div className="border-l-[3px] border-[#63b3ed] pl-3 pr-2 py-2.5 bg-[#63b3ed]/[0.04] rounded-r-lg">
            <div className="text-xs font-semibold mb-0.5">Live Q&A Session</div>
            <div className="text-xs text-gray-400 leading-relaxed">Friday at 3 PM UTC — bring your async questions!</div>
            <div className="font-mono text-[10px] text-gray-400 mt-1">3 days ago</div>
          </div>
        </div>
      </div>

      <div className="h-px bg-white/[0.07] my-6" />

      <div>
        <div className="font-['Syne'] text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">Coming Up</div>
        <div className="space-y-3">
          {[
            { dot: '#f6ad55', label: 'Weather App — Due', time: 'Fri, Mar 1 · 11:59 PM' },
            { dot: '#63b3ed', label: 'ES6+ Quiz', time: 'Sat, Mar 2' },
            { dot: '#76e3c4', label: 'Week 5 Content Release', time: 'Mon, Mar 4' },
          ].map((item, i) => (
            <div key={i} className="flex gap-2.5 items-start">
              <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: item.dot }} />
              <div>
                <div className="text-xs font-medium">{item.label}</div>
                <div className="font-mono text-[10px] text-gray-400">{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
