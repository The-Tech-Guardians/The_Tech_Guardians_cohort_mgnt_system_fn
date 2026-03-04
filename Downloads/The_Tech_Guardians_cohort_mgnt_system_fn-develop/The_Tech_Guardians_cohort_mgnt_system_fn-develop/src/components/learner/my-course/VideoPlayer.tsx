'use client';

import { Pause, Play } from 'lucide-react';
import { useState } from 'react';

export default function VideoPlayer() {
  const [playing, setPlaying] = useState(false);

  return (
    <div>
      <div className="bg-black aspect-video relative overflow-hidden max-h-[55vh] w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117]">
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
          {playing ? (
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 m-auto w-[72px] h-[72px] rounded-full bg-[#63b3ed]/15 border-2 border-[#63b3ed]/40 grid place-items-center text-2xl text-[#63b3ed] hover:bg-[#63b3ed]/25 hover:border-[#63b3ed] hover:scale-105 transition backdrop-blur-sm z-10"
            >
               <Play/>
            
            </button>
          ):(<button
              onClick={() => setPlaying(false)}
              className="absolute inset-0 m-auto w-[72px] h-[72px] rounded-full bg-[#63b3ed]/15 border-2 border-[#63b3ed]/40 grid place-items-center text-2xl text-[#63b3ed] hover:bg-[#63b3ed]/25 hover:border-[#63b3ed] hover:scale-105 transition backdrop-blur-sm z-10"
            >
               <Pause/>
            
            </button>)}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-4 pt-8 bg-gradient-to-t from-black/80 to-transparent">
            <div className="font-mono text-[11px] text-white/40 mb-1">MODULE 2 · LESSON 3</div>
            <div className="font-['Syne'] text-lg font-bold text-white">Async JavaScript & Promises</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 px-6 py-2.5 bg-[#08090d] border-b border-white/[0.07]">
        <button className="p-1 px-2 text-lg text-gray-400 hover:text-white hover:bg-[#181c24] rounded transition" title="Previous">⏮</button>
        <button className="p-1 px-2 text-lg text-gray-400 hover:text-white hover:bg-[#181c24] rounded transition" title="Play" onClick={()=> setPlaying(prev => !prev)}>{playing ? "▶" : <Pause/>}</button>
        <button className="p-1 px-2 text-lg text-gray-400 hover:text-white hover:bg-[#181c24] rounded transition" title="Next">⏭</button>
        <span className="font-mono text-[11px] text-gray-400 ml-2">8:45</span>
        <div className="flex-1 h-1 bg-[#181c24] rounded cursor-pointer group">
          <div className="relative h-full w-[35%] bg-[#63b3ed] rounded">
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#63b3ed] opacity-0 group-hover:opacity-100 transition" />
          </div>
        </div>
        <span className="font-mono text-[11px] text-gray-400">25:10</span>
        <button className="p-1 px-2 text-lg text-gray-400 hover:text-white hover:bg-[#181c24] rounded transition" title="Captions">CC</button>
        <button className="p-1 px-2 text-lg text-gray-400 hover:text-white hover:bg-[#181c24] rounded transition" title="Speed">1×</button>
        <button className="p-1 px-2 text-lg text-gray-400 hover:text-white hover:bg-[#181c24] rounded transition" title="Fullscreen">⛶</button>
      </div>
    </div>
  );
}
