export default function DiscussionTab() {
  return (
    <div className="py-10 text-center text-gray-400-">
      <div className="text-[32px] mb-3">💬</div>
      <div className="font-['Syne'] text-base font-semibold text-gray-900 mb-2">Discussion Board</div>
      <p className="text-[13px] max-w-xs mx-auto mb-5">
        Ask questions, share insights, and engage with your cohort peers and instructors about this lesson.
      </p>
      <button className="px-4 py-2 rounded-lg text-[13px] font-medium bg-[#63b3ed] text-[#0a0b0f] hover:bg-[#90cdf4] transition">
        Start a Discussion
      </button>
    </div>
  );
}