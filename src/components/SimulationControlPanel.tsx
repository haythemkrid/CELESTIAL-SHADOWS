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
  `w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center transition-all font-medium ${isActive ? 'bg-white text-black' : 'hover:bg-white/10'}`;

const eclipseButtonClass = `w-10 h-10 sm:w-11 sm:h-11 rounded-lg border border-white/10 hover:border-white/50 transition-colors flex items-center justify-center text-lg`;

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
    <div className="absolute bottom-3 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 pointer-events-none z-20">
      <div className="glass-dark p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 pointer-events-auto overflow-x-auto">
        <button
          onClick={onTogglePlay}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform active:scale-95 flex-shrink-0"
          title="Play/Pause"
        >
          {isPlaying ? <Pause size={20} /> : <Play fill="currentColor" size={20} />}
        </button>

        <div className="w-28 sm:w-36 flex-shrink-0">
          <div className="flex justify-between text-[8px] sm:text-[9px] font-mono text-white/40 uppercase mb-1">
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
            className="w-full h-2 bg-white/10 rounded appearance-none cursor-pointer accent-white"
          />
        </div>

        <div className="hidden sm:block h-7 w-px bg-white/10 flex-shrink-0" />

        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => onViewChange('free')} className={viewButtonClass(currentView === 'free')} title="Free Cam">
            <Globe className="w-5 h-5" />
          </button>
          <button onClick={() => onViewChange('earth')} className={viewButtonClass(currentView === 'earth')} title="Earth">
            <Camera className="w-5 h-5" />
          </button>
          <button onClick={() => onViewChange('moon')} className={viewButtonClass(currentView === 'moon')} title="Moon">
            <MoonIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="hidden sm:block h-7 w-px bg-white/10 flex-shrink-0" />

        <div className="flex gap-2 flex-shrink-0">
          <button onClick={onSolarEclipse} className={eclipseButtonClass} title="Solar Eclipse">
            ☀
          </button>
          <button onClick={onLunarEclipse} className={eclipseButtonClass} title="Lunar Eclipse">
            🌙
          </button>
          <button
            onClick={onResumeOrbit}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center flex-shrink-0"
            title="Resume"
          >
            <ArrowRightLeft className="w-5 h-5 opacity-60" />
          </button>
        </div>
      </div>
    </div>
  );
}