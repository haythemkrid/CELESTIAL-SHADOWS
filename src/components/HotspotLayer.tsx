import { motion } from 'motion/react';

import { HOTSPOTS } from '../simulation/constants';

type HotspotLayerProps = {
  showHotspots: boolean;
  hotspotScreenPos: Record<string, { x: number; y: number }>;
};

export function HotspotLayer({ showHotspots, hotspotScreenPos }: HotspotLayerProps) {
  if (!showHotspots) return null;

  return (
    <>
      {HOTSPOTS.map((hotspot) => {
        const position = hotspotScreenPos[hotspot.id];
        if (!position) return null;

        return (
          <motion.div
            key={hotspot.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute pointer-events-auto z-30"
            style={{ left: position.x, top: position.y }}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2 group">
              <div className="w-4 h-4 bg-white rounded-full animate-ping absolute inset-0 opacity-50" />
              <div className="w-4 h-4 bg-white rounded-full relative z-10 border-2 border-black" />

              <div className="absolute left-6 top-0 glass-dark p-3 rounded-xl w-40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <p className="text-[10px] font-bold uppercase tracking-wider text-yellow-400">{hotspot.label}</p>
                <p className="text-[10px] text-white/70 leading-tight mt-1">{hotspot.desc}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </>
  );
}