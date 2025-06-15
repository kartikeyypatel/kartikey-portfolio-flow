
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Box } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingCubeProps {
  position: [number, number, number];
  scale: number;
  rotationSpeed: [number, number, number];
}

const FloatingCube = ({ position, scale, rotationSpeed }: FloatingCubeProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame(() => {
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

export default FloatingCube;
