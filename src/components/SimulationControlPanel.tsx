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
  `px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${isActive ? 'bg-white text-black' : 'hover:bg-white/10'}`;

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
    <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row items-end md:items-center justify-between gap-6 pointer-events-none z-20">
      <div className="glass-dark p-6 rounded-3xl flex items-center gap-8 pointer-events-auto">
        <button
          onClick={onTogglePlay}
          className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
        >
          {isPlaying ? <Pause /> : <Play fill="currentColor" />}
        </button>

        <div className="w-48">
          <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase mb-2">
            <span>Time Speed</span>
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

        <div className="h-10 w-px bg-white/10" />

        <div className="flex gap-2">
          <button onClick={() => onViewChange('free')} className={viewButtonClass(currentView === 'free')}>
            <Globe className="w-4 h-4" />
            Free Cam
          </button>
          <button onClick={() => onViewChange('earth')} className={viewButtonClass(currentView === 'earth')}>
            <Camera className="w-4 h-4" />
            Earth Focus
          </button>
          <button onClick={() => onViewChange('moon')} className={viewButtonClass(currentView === 'moon')}>
            <MoonIcon className="w-4 h-4" />
            Moon Focus
          </button>
        </div>
      </div>

      <div className="glass-dark p-6 rounded-3xl flex items-center gap-4 pointer-events-auto">
        <button
          onClick={onSolarEclipse}
          className="group relative px-6 py-3 rounded-2xl border border-white/10 hover:border-white/50 transition-colors flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-yellow-400 group-hover:scale-150 transition-transform" />
          <span className="text-sm font-medium">Solar Eclipse</span>
        </button>
        <button
          onClick={onLunarEclipse}
          className="group relative px-6 py-3 rounded-2xl border border-white/10 hover:border-white/50 transition-colors flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-red-400 group-hover:scale-150 transition-transform" />
          <span className="text-sm font-medium">Lunar Eclipse</span>
        </button>
        <button
          onClick={onResumeOrbit}
          className="p-3 rounded-2xl hover:bg-white/10 transition-colors"
          title="Resume Orbit"
        >
          <ArrowRightLeft className="w-5 h-5 opacity-60" />
        </button>
      </div>
    </div>
  );
}