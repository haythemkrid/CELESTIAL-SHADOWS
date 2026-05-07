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
    <div className="absolute top-8 right-8 z-20 flex flex-col gap-4">
      {facts.map((fact, index) => (
        <motion.div key={fact.title} className="group pointer-events-auto" onClick={() => onToggleFact(index)}>
          <div className={`glass p-4 rounded-2xl w-72 transition-all cursor-pointer ${activeFact === index ? 'bg-white/20' : 'hover:bg-white/15'}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{fact.title}</h3>
              <Info className={`w-4 h-4 transition-transform ${activeFact === index ? 'rotate-180 opacity-100' : 'opacity-40'}`} />
            </div>

            <AnimatePresence>
              {activeFact === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-xs text-white/70 mt-3 leading-relaxed">{fact.description}</p>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-[10px] font-mono text-yellow-200/60 leading-tight">{fact.detail}</p>
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