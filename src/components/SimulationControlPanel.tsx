import { ArrowRightLeft, Camera, Globe, Moon as MoonIcon, Pause, Play } from 'lucide-react';

import { CameraView } from '../simulation/constants';

type SimulationControlPanelProps = {
  isPlaying: boolean;
  speed: number;
  currentView: CameraView;
  onTogglePlay: () => void;
  onSpeedChange: (value: number) => void;
  onViewChange: (view: CameraView) => void;
  onSolarEclipse: () => void;
  onLunarEclipse: () => void;
  onResumeOrbit: () => void;
};

const viewButtonClass = (isActive: boolean) =>
  `px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-medium transition-all flex items-center gap-1 sm:gap-2 ${isActive ? 'bg-white text-black' : 'hover:bg-white/10'}`;

export function SimulationControlPanel({
  isPlaying,
  speed,
  currentView,
  onTogglePlay,
  onSpeedChange,
  onViewChange,
  onSolarEclipse,
  onLunarEclipse,
  onResumeOrbit,
}: SimulationControlPanelProps) {
  return (
    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 pointer-events-none z-20">
      <div className="glass-dark p-2 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-center gap-2 sm:gap-3 pointer-events-auto flex-wrap justify-center">
        <button
          onClick={onTogglePlay}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform active:scale-95 flex-shrink-0"
          title="Play/Pause"
        >
          {isPlaying ? <Pause size={16} /> : <Play fill="currentColor" size={16} />}
        </button>

        <div className="w-24 sm:w-32">
          <div className="flex justify-between text-[8px] sm:text-[9px] font-mono text-white/40 uppercase mb-0.5">
            <span>Speed</span>
            <span>{speed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={speed}
            onChange={(event) => onSpeedChange(parseFloat(event.target.value))}
            className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer accent-white"
          />
        </div>

        <div className="hidden sm:block h-6 w-px bg-white/10" />

        <div className="flex gap-1">
          <button onClick={() => onViewChange('free')} className={viewButtonClass(currentView === 'free')} title="Free Cam">
            <Globe className="w-3 h-3" />
          </button>
          <button onClick={() => onViewChange('earth')} className={viewButtonClass(currentView === 'earth')} title="Earth">
            <Camera className="w-3 h-3" />
          </button>
          <button onClick={() => onViewChange('moon')} className={viewButtonClass(currentView === 'moon')} title="Moon">
            <MoonIcon className="w-3 h-3" />
          </button>
        </div>

        <div className="hidden sm:block h-6 w-px bg-white/10" />

        <div className="flex gap-1 order-last sm:order-none w-full sm:w-auto justify-center sm:justify-start">
          <button
            onClick={onSolarEclipse}
            className="px-2 py-1 rounded border border-white/10 hover:border-white/50 transition-colors text-[9px] sm:text-xs font-medium flex items-center gap-1"
            title="Solar Eclipse"
          >
            ☀
          </button>
          <button
            onClick={onLunarEclipse}
            className="px-2 py-1 rounded border border-white/10 hover:border-white/50 transition-colors text-[9px] sm:text-xs font-medium flex items-center gap-1"
            title="Lunar Eclipse"
          >
            🌙
          </button>
          <button
            onClick={onResumeOrbit}
            className="px-2 py-1 rounded hover:bg-white/10 transition-colors"
            title="Resume"
          >
            <ArrowRightLeft className="w-3 h-3 opacity-60" />
          </button>
        </div>
      </div>
    </div>
  );
}