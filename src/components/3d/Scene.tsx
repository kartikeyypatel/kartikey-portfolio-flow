
'use client';

import { useMemo } from 'react';
import FloatingCube from './FloatingCube';
import PulsingSphere from './PulsingSphere';
import CyanDot from './CyanDot';
import Particles from './Particles';

const Scene = () => {
  const cubeConfigs = useMemo(() => [
    { position: [0, 0, 0] as [number, number, number], scale: 1, rotationSpeed: [0.001, 0.002, 0.001] as [number, number, number] },
    { position: [1.5, 0.5, -0.5] as [number, number, number], scale: 0.8, rotationSpeed: [0.002, 0.001, 0.003] as [number, number, number] },
    { position: [-1, -0.3, 0.3] as [number, number, number], scale: 0.6, rotationSpeed: [0.003, 0.002, 0.001] as [number, number, number] },
    { position: [0.5, -1, -0.8] as [number, number, number], scale: 0.7, rotationSpeed: [0.001, 0.003, 0.002] as [number, number, number] },
    { position: [-0.8, 1.2, 0.5] as [number, number, number], scale: 0.5, rotationSpeed: [0.002, 0.001, 0.003] as [number, number, number] },
  ], []);

  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.3}
        color="#ffffff"
      />
      
      {cubeConfigs.map((config, index) => (
        <FloatingCube 
          key={index}
          position={config.position}
          scale={config.scale}
          rotationSpeed={config.rotationSpeed}
        />
      ))}
      
      <PulsingSphere />
      <CyanDot />
      <Particles />
      
      {/* Fog for atmospheric effect */}
      <fog attach="fog" args={['#000000', 5, 15]} />
    </>
  );
};

export default Scene;
