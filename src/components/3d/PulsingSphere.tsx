
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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
      <mesh ref={sphereRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial 
          color="#ff6b35"
          emissive="#ff6b35"
          emissiveIntensity={0.3}
        />
      </mesh>
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

export default PulsingSphere;
