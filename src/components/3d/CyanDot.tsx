
'use client';

import { Float } from '@react-three/drei';

const CyanDot = () => {
  return (
    <Float
      speed={0.3}
      rotationIntensity={0}
      floatIntensity={0.1}
      floatingRange={[-0.05, 0.05]}
    >
      <mesh position={[-1.5, -0.5, 1]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial 
          color="#00bcd4"
          emissive="#00bcd4"
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
};

export default CyanDot;
