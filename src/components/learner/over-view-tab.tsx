export default function OverviewTab() {
  return (
    <div>
      <div className="bg-[#111318] border border-white/[0.07] rounded-xl p-4 mb-4">
        <div className="font-['Syne'] text-xs font-bold uppercase tracking-wider text-[#63b3ed] mb-3">🎯 Learning Objectives</div>
        {[
          'Understand the JavaScript event loop and why async code is necessary',
          'Write and chain Promises to handle asynchronous operations',
          'Use async/await syntax to write cleaner asynchronous code',
          'Handle errors with try/catch in async functions',
        ].map((obj, i) => (
          <div key={i} className="flex items-start gap-2.5 text-[13px] text-gray-400 mb-2">
            <span className="text-[#76e3c4] flex-shrink-0 mt-0.5">→</span>
            {obj}
          </div>
        ))}
      </div>

      <div className="text-sm leading-relaxed text-gray-400 space-y-3">
        <h3 className="font-['Syne'] text-[15px] font-semibold text-white mt-5 mb-2">Introduction</h3>
        <p>JavaScript is single-threaded, meaning it executes one operation at a time. Yet modern web applications must handle network requests, file reads, timers, and more — without freezing the UI. This is where asynchronous programming comes in.</p>
        <p>In this lesson, you&apos;ll master the tools JavaScript gives you to handle async operations: callbacks, Promises, and the elegant async/await syntax built on top of them.</p>

        <h3 className="font-['Syne'] text-[15px] font-semibold text-white mt-5 mb-2">The Event Loop</h3>
        <p>Before Promises existed, developers relied on callbacks. While functional, nested callbacks led to what&apos;s known as `callback hell` — deeply nested, hard-to-read code.</p>
      </div>

      <div className="h-px bg-white/[0.07] my-6" />

      <div className="font-['Syne'] text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Resources</div>
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { icon: '📄', name: 'Async Cheatsheet.pdf', meta: 'PDF · 2.1 MB', color: 'red' },
          { icon: '{ }', name: 'starter-code.zip', meta: 'ZIP · 14 KB', color: 'green' },
          { icon: '📋', name: 'MDN Promise Docs', meta: 'External link', color: 'red' },
          { icon: '▶', name: 'CodeSandbox Demo', meta: 'Interactive', color: 'green' },
        ].map((res, i) => (
          <a key={i} href="#" className="flex items-center gap-2.5 p-3 bg-[#111318] border border-white/[0.07] rounded-lg hover:border-[#63b3ed]/40 hover:bg-[#181c24] transition">
            <div className={`w-8 h-8 rounded-lg grid place-items-center text-[15px] flex-shrink-0 ${
              res.color === 'red' ? 'bg-[#fc8181]/10 text-[#fc8181]' : 'bg-[#76e3c4]/10 text-[#76e3c4]'
            }`}>
              {res.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-white truncate">{res.name}</div>
              <div className="text-[11px] text-gray-400">{res.meta}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}