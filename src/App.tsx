import { useRef } from 'react';

import { FactCardsPanel } from './components/FactCardsPanel';
import { HotspotLayer } from './components/HotspotLayer';
import { OrbitStats } from './components/OrbitStats';
import { SimulationControlPanel } from './components/SimulationControlPanel';
import { SimulationHeader } from './components/SimulationHeader';
import { FACT_CARDS } from './simulation/constants';
import { useEclipseSimulation } from './hooks/useEclipseSimulation';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);

  const {
    isPlaying,
    setIsPlaying,
    speed,
    setSpeed,
    currentView,
    setCurrentView,
    activeFact,
    setActiveFact,
    phenomenon,
    showHotspots,
    hotspotScreenPos,
    goToSolarEclipse,
    goToLunarEclipse,
    resumeOrbit,
  } = useEclipseSimulation(mountRef);

  return (
    <div className="relative w-full h-screen font-sans selection:bg-yellow-500/30">
      <div className="absolute inset-0 z-0 scene-backdrop" />
      <div ref={mountRef} className="absolute inset-0 z-10" />

      <SimulationHeader phenomenon={phenomenon} />

      <SimulationControlPanel
        isPlaying={isPlaying}
        speed={speed}
        currentView={currentView}
        onTogglePlay={() => setIsPlaying((value) => !value)}
        onSpeedChange={setSpeed}
        onViewChange={setCurrentView}
        onSolarEclipse={goToSolarEclipse}
        onLunarEclipse={goToLunarEclipse}
        onResumeOrbit={resumeOrbit}
      />
      

      <HotspotLayer showHotspots={showHotspots} hotspotScreenPos={hotspotScreenPos} />

      <FactCardsPanel
        facts={FACT_CARDS}
        activeFact={activeFact}
        onToggleFact={(index) => setActiveFact((current) => (current === index ? null : index))}
      />

      <OrbitStats />
    </div>
  );
}