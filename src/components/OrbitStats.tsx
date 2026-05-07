export function OrbitStats() {
  return (
    <div className="absolute top-1/2 left-4 sm:left-12 -translate-y-1/2 pointer-events-none hidden lg:block z-20 space-y-6">
      <div className="space-y-1">
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Distance</p>
        <p className="text-xl sm:text-2xl font-light">149.6M km</p>
      </div>
      <div className="h-12 w-px bg-gradient-to-b from-white/20 to-transparent" />
      <div className="space-y-1">
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Velocity</p>
        <p className="text-xl sm:text-2xl font-light">29.78 km/s</p>
      </div>
    </div>
  );
}