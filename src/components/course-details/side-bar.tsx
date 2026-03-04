import { useState } from "react";
import { Stars } from "./helper";
import { Clock, Flame, RefreshCw, Trophy, CheckCircle, Link } from "lucide-react";

export function Sidebar({ cohorts }: { cohorts: any[] }) {
  const [selected, setSelected]   = useState(cohorts[0].id);
  const [email, setEmail]         = useState("");
  const [enrolled, setEnrolled]   = useState(false);
  const selectedCohort = cohorts.find((c: any) => c.id === selected);
  

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden">

      {/* Price */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-100">
        <div className="flex items-end gap-2 mb-1">
          <span className="text-[28px] font-black text-slate-900">Free</span>
          <span className="text-slate-400 text-sm mb-1">during enrollment</span>
        </div>
        <Stars rating={4.9} reviews={148} />
      </div>

      <div className="px-6 py-5 space-y-5">

        {/* Cohort selector */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Select Cohort</p>
          <div className="space-y-2">
            {cohorts.map((c: any) => (
              <label key={c.id}
                className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 cursor-pointer transition-all ${
                  selected === c.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}>
                <input
                  type="radio"
                  name="cohort"
                  value={c.id}
                  checked={selected === c.id}
                  onChange={() => setSelected(c.id)}
                  className="accent-blue-600 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className={`text-[13px] font-semibold ${selected === c.id ? "text-blue-700" : "text-slate-700"}`}>
                    {c.name}
                  </span>
                  {c.urgent && (
                    <span className="ml-2 text-[10px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded-full">
                      {c.seats_left} seats left
                    </span>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Seats left warning */}
        {selectedCohort?.urgent && (
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
            <Flame className="w-4 h-4 text-rose-600"/>
            <span className="text-[12px] font-semibold text-rose-700">
              Only {selectedCohort.seats_left} seats remaining in this cohort
            </span>
          </div>
        )}

        {/* Enroll CTA */}
        {enrolled ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3.5 text-center">
            <p className="text-emerald-700 font-bold text-sm flex items-center justify-center gap-1.5"><CheckCircle className="w-4 h-4"/> You&apos;re enrolled!</p>
            <p className="text-emerald-600 text-[12px] mt-0.5">Check your email for next steps.</p>
          </div>
        ) : (
            <Link href="login">
              <button
            
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-[15px] py-4 rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 active:translate-y-0 transition-all duration-200 relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <span className="relative">Enroll Now</span>
          </button>
          </Link>
        
        )}

        {/* Email updates */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Get Course Updates</p>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition min-w-0"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 rounded-xl transition-colors flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="space-y-2 pt-1">
          {[
            { icon: <Clock className="w-4 h-4"/>, text: "Secure enrollment · No payment required" },
            { icon: <RefreshCw className="w-4 h-4"/>, text: "Switch cohort anytime before start date" },
            { icon: <Trophy className="w-4 h-4"/>, text: "Verified certificate on completion" },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-2.5 text-[12px] text-slate-500">
              <span className="leading-none">{b.icon}</span>
              <span>{b.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}