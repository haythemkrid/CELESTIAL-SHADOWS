import * as THREE from 'three';

export type CameraView = 'free' | 'earth' | 'moon';

export type FactCard = {
  title: string;
  description: string;
  detail: string;
};

export type Hotspot = {
  id: string;
  label: string;
  desc: string;
};

export const SCALE = {
  SUN: 5,
  EARTH: 1,
  MOON: 0.27,
  EARTH_ORBIT_X: 28,
  EARTH_ORBIT_Z: 24,
  MOON_ORBIT: 4.5,
  MOON_TILT: THREE.MathUtils.degToRad(5.14),
};

export const FACT_CARDS: FactCard[] = [
  {
    title: 'Solar Eclipse',
    description: 'Occurs when the Moon passes between the Sun and Earth, casting a shadow over parts of Earth.',
    detail: 'During a total solar eclipse, the Moon perfectly covers the Sun\'s disc, revealing the solar corona.',
  },
  {
    title: 'Lunar Eclipse',
    description: 'Happens when Earth passes between the Sun and Moon, casting its shadow on the Moon.',
    detail: 'The Moon often turns deep red (Blood Moon) because Earth\'s atmosphere scatters sunlight.',
  },
  {
    title: 'Orbital Tilt',
    description: 'The Moon\'s orbit is tilted at 5.14° relative to Earth\'s orbit around the Sun.',
    detail: 'This tilt is why we do not have eclipses every single month - the alignment must be perfect.',
  },
];

export const HOTSPOTS: Hotspot[] = [
  { id: 'umbra', label: 'Umbra', desc: 'Total shadow cone.' },
  { id: 'penumbra', label: 'Penumbra', desc: 'Partial shadow region.' },
];