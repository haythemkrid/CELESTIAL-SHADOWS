import { Sun } from 'lucide-react';
import { motion } from 'motion/react';

type SimulationHeaderProps = {
  phenomenon: string;
};

export function SimulationHeader({ phenomenon }: SimulationHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-8 left-8 z-20"
    >
      <h1 className="text-4xl font-light tracking-tighter text-white drop-shadow-lg flex items-center gap-3">
        <Sun className="text-yellow-400 w-8 h-8 animate-pulse" />
        <span className="font-semibold">Celestial</span> Shadows
      </h1>
      <p className="text-white/50 font-mono text-xs uppercase tracking-widest mt-2 ml-1">
        System State: {phenomenon}
      </p>
    </motion.div>
  );
}