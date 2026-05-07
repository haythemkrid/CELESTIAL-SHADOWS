export function OrbitStats() {
  return (
    <div className="absolute top-1/2 left-12 -translate-y-1/2 pointer-events-none hidden lg:block z-20">
      <div className="space-y-1">
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">Distance from Sun</p>
        <p className="text-2xl font-light">149.6 Million km</p>
      </div>
      <div className="h-12 w-px bg-gradient-to-b from-white/20 to-transparent my-6 ml-2" />
      <div className="space-y-1">
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">Orbital Velocity</p>
        <p className="text-2xl font-light">29.78 km/s</p>
      </div>
    </div>
  );
}