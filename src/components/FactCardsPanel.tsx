import { Info } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { FactCard } from '../simulation/constants';

type FactCardsPanelProps = {
  facts: FactCard[];
  activeFact: number | null;
  onToggleFact: (index: number) => void;
};

export function FactCardsPanel({ facts, activeFact, onToggleFact }: FactCardsPanelProps) {
  return (
    <div className="absolute top-4 sm:top-8 right-4 sm:right-8 z-20 flex flex-col gap-2 sm:gap-4 max-w-xs sm:max-w-sm">
      {facts.map((fact, index) => (
        <motion.div key={fact.title} className="group pointer-events-auto" onClick={() => onToggleFact(index)}>
          <div className={`glass p-3 sm:p-4 rounded-xl sm:rounded-2xl w-full transition-all cursor-pointer text-sm ${activeFact === index ? 'bg-white/20' : 'hover:bg-white/15'}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-semibold">{fact.title}</h3>
              <Info className={`w-3 sm:w-4 h-3 sm:h-4 transition-transform flex-shrink-0 ${activeFact === index ? 'rotate-180 opacity-100' : 'opacity-40'}`} />
            </div>

            <AnimatePresence>
              {activeFact === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-[11px] sm:text-xs text-white/70 mt-2 sm:mt-3 leading-relaxed">{fact.description}</p>
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
                    <p className="text-[9px] sm:text-[10px] font-mono text-yellow-200/60 leading-tight">{fact.detail}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </div>
  );
}