
'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

const FloatingCube = ({ position, scale, rotationSpeed }: { 
  position: [number, number, number]; 
  scale: number; 
  rotationSpeed: [number, number, number] 
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed[0];
      meshRef.current.rotation.y += rotationSpeed[1];
      meshRef.current.rotation.z += rotationSpeed[2];
    }
  });

  return (
    <Float
      speed={0.5}
      rotationIntensity={0.1}
      floatIntensity={0.2}
      floatingRange={[-0.1, 0.1]}
    >
      <Box ref={meshRef} position={position} scale={scale}>
        <meshStandardMaterial 
          color="#1a365d"
          metalness={0.1}
          roughness={0.8}
        />
      </Box>
    </Float>
  );
};

const PulsingSphere = () => {
  const lightRef = useRef<THREE.PointLight>(null!);
  const sphereRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const intensity = 0.5 + Math.sin(time * 1.5) * 0.3;
    
    if (lightRef.current) {
      lightRef.current.intensity = intensity;
    }
    
    if (sphereRef.current) {
      (sphereRef.current.material as THREE.MeshStandardMaterial).emissive.setScalar(intensity * 0.3);
    }
  });

  return (
    <group position={[2, 1, 0]}>
      <Sphere ref={sphereRef} args={[0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#ff6b35"
          emissive="#ff6b35"
          emissiveIntensity={0.3}
        />
      </Sphere>
      <pointLight 
        ref={lightRef}
        position={[0, 0, 0]}
        color="#ff6b35"
        intensity={0.5}
        distance={10}
        decay={2}
      />
    </group>
  );
};

const CyanDot = () => {
  return (
    <Float
      speed={0.3}
      rotationIntensity={0}
      floatIntensity={0.1}
      floatingRange={[-0.05, 0.05]}
    >
      <Sphere args={[0.02]} position={[-1.5, -0.5, 1]}>
        <meshStandardMaterial 
          color="#00bcd4"
          emissive="#00bcd4"
          emissiveIntensity={0.5}
        />
      </Sphere>
    </Float>
  );
};

const Particles = () => {
  const particlesRef = useRef<THREE.Points>(null!);
  
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(50 * 3);
    for (let i = 0; i < 50; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return positions;
  }, []);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0005;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += Math.sin(state.clock.getElapsedTime() + i) * 0.001;
        positions[i + 1] += Math.cos(state.clock.getElapsedTime() + i) * 0.001;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={50}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.02}
        color="#ffffff"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
};

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

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ 
          background: 'linear-gradient(180deg, #1a202c 0%, #000000 100%)',
        }}
      >
        <Scene />
      </Canvas>
      <div className="absolute inset-0 bg-portfolio-black/40"></div>
    </div>
  );
};

export default AnimatedBackground;
