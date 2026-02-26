const Logo = () => {
  return (
    <div>
        <div className="  flex items-center gap-3">
            <div className="w-13 h-13 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
                <circle cx="14" cy="10" r="5" fill="#4F46E5" />
                <circle cx="26" cy="10" r="5" fill="#2563EB" />
                <circle cx="20" cy="6" r="5" fill="#06B6D4" />
                <path d="M4 28 Q20 18 36 28" stroke="#4F46E5" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M6 33 Q20 23 34 33" stroke="#2563EB" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M9 38 Q20 30 31 38" stroke="#06B6D4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex flex-col">
               <span className="text-white font-bold text-xl tracking-tight">CohortLMS</span>
                <span className="text-white font-bold text-sm tracking-tight">Platform</span>
            </div>
           
          </div>
    </div>
  )
}

export default Logo