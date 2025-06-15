
'use client';

import { Float, Sphere } from '@react-three/drei';

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

export default CyanDot;
