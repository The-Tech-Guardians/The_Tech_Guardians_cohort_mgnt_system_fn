export default function PBar({progress,gradient}){
  return(
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[11.5px] text-slate-500 font-medium">Your progress</span>
        <span className="text-[11.5px] font-bold text-slate-700">{progress}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={"h-full rounded-full bg-gradient-to-r "+gradient} style={{width:progress+"%"}}/>
      </div>
    </div>
  );
}