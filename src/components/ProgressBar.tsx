export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max <= 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm opacity-80 mb-3">
        <span className="font-medium">Session Progress</span>
        <span className="font-semibold text-white">{value}/{max} ({pct}%)</span>
      </div>
      <div className="h-4 w-full rounded-full bg-white/10 overflow-hidden border border-white/20">
        <div 
          className="h-4 rounded-full bg-gradient-to-r from-blue-500/60 to-purple-500/60 transition-all duration-300 ease-out" 
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
