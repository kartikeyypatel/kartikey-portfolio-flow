
'use client';

import { Canvas } from '@react-three/fiber';
import Scene from './3d/Scene';

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
