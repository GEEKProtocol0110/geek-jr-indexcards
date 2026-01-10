export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max <= 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm opacity-80 mb-2">
        <span>Progress</span>
        <span>{value}/{max} ({pct}%)</span>
      </div>
      <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
        <div className="h-3 rounded-full bg-white/60" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
