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
      className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20"
    >
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tighter text-white drop-shadow-lg flex items-center gap-2 sm:gap-3">
        <Sun className="text-yellow-400 w-6 sm:w-8 h-6 sm:h-8 animate-pulse" />
        <span className="font-semibold">Celestial</span> <span className="hidden sm:inline">Shadows</span>
      </h1>
      <p className="text-white/50 font-mono text-[10px] sm:text-xs uppercase tracking-widest mt-1 sm:mt-2 ml-1">
        {phenomenon}
      </p>
    </motion.div>
  );
}