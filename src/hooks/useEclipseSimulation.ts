import { useEffect, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { gsap } from 'gsap';
import { CameraView, HOTSPOTS, SCALE } from '../simulation/constants';

const disposeMaterial = (material: THREE.Material | THREE.Material[]) => {
  if (Array.isArray(material)) {
    material.forEach((item) => item.dispose());
    return;
  }

  material.dispose();
};

const disposeScene = (scene: THREE.Scene) => {
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
      object.geometry.dispose();
    }

    if ('material' in object && object.material) {
      disposeMaterial(object.material as THREE.Material | THREE.Material[]);
    }
  });
};

export function useEclipseSimulation(mountRef: RefObject<HTMLDivElement>) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [currentView, setCurrentView] = useState<CameraView>('free');
  const [activeFact, setActiveFact] = useState<number | null>(null);
  const [phenomenon, setPhenomenon] = useState('Normal Orbit');
  const [showHotspots, setShowHotspots] = useState(false);
  const [hotspotScreenPos, setHotspotScreenPos] = useState<Record<string, { x: number; y: number }>>({});

  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speed);
  const currentViewRef = useRef(currentView);
  const showHotspotsRef = useRef(showHotspots);
  const hotspotScreenPosRef = useRef(hotspotScreenPos);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);

  const earthGroupRef = useRef<THREE.Group | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const moonMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const atmosphereRef = useRef<THREE.Mesh | null>(null);
  const atmosphereMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const moonRef = useRef<THREE.Mesh | null>(null);
  const starFieldRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const orbitParams = useRef({ earthAngle: 0, moonAngle: 0 });
  const moonInUmbraRef = useRef(false);

  const moonShadowColor = new THREE.Color('#661100');
  const moonBaseEmissive = new THREE.Color('#000000');
  const atmosphereBlue = new THREE.Color('#4aa3ff');
  const atmosphereOrange = new THREE.Color('#ff8a3d');

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    currentViewRef.current = currentView;
  }, [currentView]);

  useEffect(() => {
    showHotspotsRef.current = showHotspots;
  }, [showHotspots]);

  useEffect(() => {
    hotspotScreenPosRef.current = hotspotScreenPos;
  }, [hotspotScreenPos]);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 30, 45);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.cursor = 'grab';
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableRotate = true;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.screenSpacePanning = false;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 0.9;
    controls.panSpeed = 0.8;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    const handleControlsStart = () => {
      renderer.domElement.style.cursor = 'grabbing';
    };

    const handleControlsEnd = () => {
      renderer.domElement.style.cursor = 'grab';
    };

    controls.addEventListener('start', handleControlsStart);
    controls.addEventListener('end', handleControlsEnd);

    const sunLight = new THREE.PointLight(0xffffff, 800, 400, 1.2);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 100;
    sunLight.shadow.bias = -0.0001;
    scene.add(sunLight);

    scene.add(new THREE.AmbientLight(0x9fb4c8, 0.05));
    scene.add(new THREE.HemisphereLight(0xa8c9ff, 0x090b12, 0.04));

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(SCALE.SUN, 64, 64),
      new THREE.MeshStandardMaterial({ emissive: 0xffaa00, emissiveIntensity: 2.5, color: 0xffaa00 })
    );
    scene.add(sun);

    const earthGroup = new THREE.Group();
    scene.add(earthGroup);
    earthGroupRef.current = earthGroup;

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(SCALE.EARTH, 64, 64),
      new THREE.MeshStandardMaterial({ color: 0x1a4a99, roughness: 0.7, metalness: 0.2 })
    );
    earth.castShadow = true;
    earth.receiveShadow = true;
    earthGroup.add(earth);
    earthRef.current = earth;

    const atmosphereUniforms = {
      uTime: { value: 0 },
      uIntensity: { value: 0.35 },
      uBlue: { value: atmosphereBlue.clone() },
      uOrange: { value: atmosphereOrange.clone() },
    };

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(SCALE.EARTH * 1.08, 64, 64),
      new THREE.ShaderMaterial({
        uniforms: atmosphereUniforms,
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vWorldPosition;

          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
          }
        `,
        fragmentShader: `
          uniform float uIntensity;
          uniform vec3 uBlue;
          uniform vec3 uOrange;
          varying vec3 vNormal;
          varying vec3 vWorldPosition;

          void main() {
            vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
            float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDirection), 0.0), 2.2);
            vec3 glow = mix(uBlue, uOrange, smoothstep(0.15, 0.9, fresnel));
            float alpha = fresnel * uIntensity;
            gl_FragColor = vec4(glow, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      })
    );
    atmosphere.renderOrder = 2;
    earthGroup.add(atmosphere);
    atmosphereRef.current = atmosphere;
    atmosphereMaterialRef.current = atmosphere.material as THREE.ShaderMaterial;

    const moonSystem = new THREE.Group();
    moonSystem.rotation.x = SCALE.MOON_TILT;
    earthGroup.add(moonSystem);

    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(SCALE.MOON, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0x9a9a9a, roughness: 0.9, emissive: moonBaseEmissive.clone(), emissiveIntensity: 0.25 })
    );
    moon.castShadow = true;
    moon.receiveShadow = true;
    moonSystem.add(moon);
    moonRef.current = moon;
    moonMaterialRef.current = moon.material as THREE.MeshStandardMaterial;

    const earthOrbitCurve = new THREE.EllipseCurve(0, 0, SCALE.EARTH_ORBIT_X, SCALE.EARTH_ORBIT_Z);
    const earthOrbitPoints = earthOrbitCurve.getPoints(200);
    const earthOrbitGeom = new THREE.BufferGeometry().setFromPoints(
      earthOrbitPoints.map((point) => new THREE.Vector3(point.x, 0, point.y))
    );
    const earthOrbitLine = new THREE.Line(
      earthOrbitGeom,
      new THREE.LineBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.15 })
    );
    scene.add(earthOrbitLine);

    const starCount = 8000;
    const starGeom = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let index = 0; index < starCount * 3; index += 3) {
      const radius = 200 + Math.random() * 600;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPos[index] = radius * Math.sin(phi) * Math.cos(theta);
      starPos[index + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPos[index + 2] = radius * Math.cos(phi);

      const radiance = 0.4 + Math.random() * 0.6;
      starColors[index] = radiance;
      starColors[index + 1] = radiance;
      starColors[index + 2] = radiance;
    }

    starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeom.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const stars = new THREE.Points(
      starGeom,
      new THREE.PointsMaterial({ size: 0.6, vertexColors: true, transparent: true, opacity: 0.8 })
    );
    scene.add(stars);
    starFieldRef.current = stars;

    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.2, 0.4, 0.85);
    bloomPass.threshold = 0.15;
    bloomPass.strength = 1.0;
    bloomPass.radius = 0.5;

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    composerRef.current = composer;

    const clock = new THREE.Clock();
    let animationId = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (isPlayingRef.current) {
        orbitParams.current.earthAngle += delta * 0.05 * speedRef.current;
        orbitParams.current.moonAngle += delta * 0.4 * speedRef.current;

        earthGroup.position.x = Math.cos(orbitParams.current.earthAngle) * SCALE.EARTH_ORBIT_X;
        earthGroup.position.z = Math.sin(orbitParams.current.earthAngle) * SCALE.EARTH_ORBIT_Z;

        moon.position.x = Math.cos(orbitParams.current.moonAngle) * SCALE.MOON_ORBIT;
        moon.position.z = Math.sin(orbitParams.current.moonAngle) * SCALE.MOON_ORBIT;

        earth.rotation.y += delta * 0.5;
        moon.rotation.y += delta * 0.2;
      }

      if (atmosphereMaterialRef.current) {
        atmosphereMaterialRef.current.uniforms.uTime.value += delta;
      }

      if (earthRef.current && moonRef.current && moonMaterialRef.current && atmosphereMaterialRef.current) {
        const earthWorldPosition = new THREE.Vector3();
        const moonWorldPosition = new THREE.Vector3();
        earthRef.current.getWorldPosition(earthWorldPosition);
        moonRef.current.getWorldPosition(moonWorldPosition);

        const sunToEarth = earthWorldPosition.clone();
        const sunToEarthDistance = sunToEarth.length();
        const shadowAxis = sunToEarth.clone().normalize();
        const moonProjection = moonWorldPosition.dot(shadowAxis);
        const behindEarthDistance = moonProjection - sunToEarthDistance;
        const moonOffset = moonWorldPosition.clone().sub(shadowAxis.clone().multiplyScalar(moonProjection)).length();
        const umbraHalfAngle = Math.atan2(Math.max(SCALE.SUN - SCALE.EARTH, 0.01), Math.max(sunToEarthDistance, 0.01));
        const umbraLength = SCALE.EARTH / Math.tan(Math.max(umbraHalfAngle, 0.0001));
        const umbraRadius = Math.max(0, SCALE.EARTH - Math.max(behindEarthDistance, 0) * Math.tan(umbraHalfAngle));
        const moonInUmbra = behindEarthDistance > 0 && behindEarthDistance < umbraLength && moonOffset < umbraRadius + SCALE.MOON * 0.45;

        if (moonInUmbra !== moonInUmbraRef.current) {
          moonInUmbraRef.current = moonInUmbra;

          gsap.to(moonMaterialRef.current.emissive, {
            r: moonInUmbra ? moonShadowColor.r : moonBaseEmissive.r,
            g: moonInUmbra ? moonShadowColor.g : moonBaseEmissive.g,
            b: moonInUmbra ? moonShadowColor.b : moonBaseEmissive.b,
            duration: 0.9,
            ease: 'power2.out',
          });

          gsap.to(moonMaterialRef.current, {
            emissiveIntensity: moonInUmbra ? 1.25 : 0.25,
            roughness: moonInUmbra ? 0.98 : 0.9,
            duration: 0.9,
            ease: 'power2.out',
          });

          gsap.to(atmosphereMaterialRef.current.uniforms.uIntensity, {
            value: moonInUmbra ? 1.05 : 0.35,
            duration: 1.1,
            ease: 'power2.out',
          });
        }
      }

      if (showHotspotsRef.current && cameraRef.current && earthGroupRef.current) {
        const nextScreenPos: Record<string, { x: number; y: number }> = {};
        const tempVector = new THREE.Vector3();

        HOTSPOTS.forEach((hotspot) => {
          const sunPosition = new THREE.Vector3(0, 0, 0);
          const earthPosition = earthGroupRef.current!.position.clone();
          const direction = new THREE.Vector3().subVectors(earthPosition, sunPosition).normalize();

          if (hotspot.id === 'umbra') {
            tempVector.copy(earthPosition).add(direction.multiplyScalar(4));
          } else {
            tempVector.copy(earthPosition).add(direction.multiplyScalar(3)).add(new THREE.Vector3(0, 2, 0));
          }

          tempVector.project(cameraRef.current!);

          if (tempVector.z <= 1) {
            nextScreenPos[hotspot.id] = {
              x: (tempVector.x * 0.5 + 0.5) * window.innerWidth,
              y: (-(tempVector.y * 0.5 - 0.5) * window.innerHeight),
            };
          }
        });

        setHotspotScreenPos(nextScreenPos);
      } else if (!showHotspotsRef.current && Object.keys(hotspotScreenPosRef.current).length > 0) {
        setHotspotScreenPos({});
      }

      if (starFieldRef.current) {
        starFieldRef.current.rotation.y += delta * 0.005;
        starFieldRef.current.position.x = THREE.MathUtils.lerp(starFieldRef.current.position.x, mouseRef.current.x * 4, 0.06);
        starFieldRef.current.position.y = THREE.MathUtils.lerp(starFieldRef.current.position.y, -mouseRef.current.y * 4, 0.06);
        starFieldRef.current.position.z = THREE.MathUtils.lerp(starFieldRef.current.position.z, mouseRef.current.x * -1.5, 0.03);
      }

      if (!controlsRef.current) return;

      if (currentViewRef.current === 'earth') {
        controlsRef.current.target.lerp(earthGroup.position, 0.1);
      } else if (currentViewRef.current === 'moon') {
        const moonWorldPosition = new THREE.Vector3();
        moon.getWorldPosition(moonWorldPosition);
        controlsRef.current.target.lerp(moonWorldPosition, 0.1);
      } else {
        controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.05);
      }

      controlsRef.current.update();
      composer.render();
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      controls.removeEventListener('start', handleControlsStart);
      controls.removeEventListener('end', handleControlsEnd);
      cancelAnimationFrame(animationId);
      disposeScene(scene);
      composer.dispose();
      controls.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
      composerRef.current = null;
      earthGroupRef.current = null;
      earthRef.current = null;
      moonMaterialRef.current = null;
      atmosphereRef.current = null;
      atmosphereMaterialRef.current = null;
      moonRef.current = null;
      starFieldRef.current = null;
    };
  }, [mountRef]);

  const syncOrbitalPosition = () => {
    if (!earthGroupRef.current || !moonRef.current) return;

    earthGroupRef.current.position.x = Math.cos(orbitParams.current.earthAngle) * SCALE.EARTH_ORBIT_X;
    earthGroupRef.current.position.z = Math.sin(orbitParams.current.earthAngle) * SCALE.EARTH_ORBIT_Z;
    moonRef.current.position.x = Math.cos(orbitParams.current.moonAngle) * SCALE.MOON_ORBIT;
    moonRef.current.position.z = Math.sin(orbitParams.current.moonAngle) * SCALE.MOON_ORBIT;
  };

  const goToSolarEclipse = () => {
    setIsPlaying(false);
    setPhenomenon('Solar Eclipse Alignment');
    setShowHotspots(true);

    gsap.to(orbitParams.current, {
      earthAngle: Math.PI,
      moonAngle: 0,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: syncOrbitalPosition,
    });

    if (cameraRef.current) {
      gsap.to(cameraRef.current.position, {
        x: -45,
        y: 10,
        z: 10,
        duration: 2,
        ease: 'power2.inOut',
      });
    }
  };

  const goToLunarEclipse = () => {
    setIsPlaying(false);
    setPhenomenon('Lunar Eclipse Alignment');
    setShowHotspots(true);

    gsap.to(orbitParams.current, {
      earthAngle: Math.PI,
      moonAngle: Math.PI,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: syncOrbitalPosition,
    });

    if (cameraRef.current) {
      gsap.to(cameraRef.current.position, {
        x: -60,
        y: 5,
        z: 0,
        duration: 2,
        ease: 'power2.inOut',
      });
    }
  };

  const resumeOrbit = () => {
    setIsPlaying(true);
    setPhenomenon('Normal Orbit');
    setShowHotspots(false);
  };

  return {
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
  };
}