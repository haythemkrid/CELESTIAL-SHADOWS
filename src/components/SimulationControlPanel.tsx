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
    <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 flex flex-col gap-3 sm:gap-6 pointer-events-none z-20">


      <div className="glass-dark p-3 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-wrap gap-2 sm:gap-4 pointer-events-auto justify-center sm:justify-start">
        <button
          onClick={onSolarEclipse}
          className="group relative px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-2xl border border-white/10 hover:border-white/50 transition-colors flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium"
          title="Solar Eclipse"
        >
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-400 group-hover:scale-150 transition-transform" />
          <span className="hidden sm:inline">Solar</span>
          <span className="sm:hidden">☀</span>
        </button>
        <button
          onClick={onLunarEclipse}
          className="group relative px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-2xl border border-white/10 hover:border-white/50 transition-colors flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium"
          title="Lunar Eclipse"
        >
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-400 group-hover:scale-150 transition-transform" />
          <span className="hidden sm:inline">Lunar</span>
          <span className="sm:hidden">🌙</span>
        </button>
        <button
          onClick={onResumeOrbit}
          className="p-2 sm:p-3 rounded-lg sm:rounded-2xl hover:bg-white/10 transition-colors"
          title="Resume Orbit"
        >
          <ArrowRightLeft className="w-4 sm:w-5 h-4 sm:h-5 opacity-60" />
        </button>
      </div>

            <div className="glass-dark p-3 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-8 pointer-events-auto">
        <button
          onClick={onTogglePlay}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform active:scale-95 flex-shrink-0"
        >
          {isPlaying ? <Pause size={20} /> : <Play fill="currentColor" size={20} />}
        </button>

        <div className="flex-1 sm:w-48">
          <div className="flex justify-between text-[9px] sm:text-[10px] font-mono text-white/40 uppercase mb-1 sm:mb-2">
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
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>

        <div className="hidden sm:block h-10 w-px bg-white/10" />

        <div className="flex gap-1 sm:gap-2 flex-wrap sm:flex-nowrap">
          <button onClick={() => onViewChange('free')} className={viewButtonClass(currentView === 'free')} title="Free Camera">
            <Globe className="w-3 sm:w-4 h-3 sm:h-4" />
            <span className="hidden sm:inline">Free</span>
          </button>
          <button onClick={() => onViewChange('earth')} className={viewButtonClass(currentView === 'earth')} title="Earth Focus">
            <Camera className="w-3 sm:w-4 h-3 sm:h-4" />
            <span className="hidden sm:inline">Earth</span>
          </button>
          <button onClick={() => onViewChange('moon')} className={viewButtonClass(currentView === 'moon')} title="Moon Focus">
            <MoonIcon className="w-3 sm:w-4 h-3 sm:h-4" />
            <span className="hidden sm:inline">Moon</span>
          </button>
        </div>
      </div>
    </div>
  );
}