import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, useHelper } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import React, { useRef, useMemo, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";

interface RubiksCubeRef {
  reset: () => void;
}

const FACE_COLORS = {
  front: '#22D3EE',   // Primary cyan (website accent)
  back: '#0891b2',    // Darker cyan
  left: '#111111',    // Dark gray (website secondary)
  right: '#888888',   // Muted gray (website muted text)
  top: '#67e8f9',     // Lighter cyan
  bottom: '#0B0B0B'   // Very dark gray (website background variant)
};

const INITIAL_POSITIONS = [
  // Front face (z = 1)
  [-1, 1, 1], [0, 1, 1], [1, 1, 1],
  [-1, 0, 1], [0, 0, 1], [1, 0, 1],
  [-1, -1, 1], [0, -1, 1], [1, -1, 1],
  
  // Middle layer (z = 0)
  [-1, 1, 0], [0, 1, 0], [1, 1, 0],
  [-1, 0, 0], [1, 0, 0], // No center cube
  [-1, -1, 0], [0, -1, 0], [1, -1, 0],
  
  // Back face (z = -1)
  [-1, 1, -1], [0, 1, -1], [1, 1, -1],
  [-1, 0, -1], [0, 0, -1], [1, 0, -1],
  [-1, -1, -1], [0, -1, -1], [1, -1, -1]
];

const createCubeMaterial = (position: number[]) => {
  const materials = [];
  const [x, y, z] = position;
  
  // Right face (positive X)
  materials.push(new THREE.MeshLambertMaterial({ 
    color: x === 1 ? FACE_COLORS.right : '#1a1a1a' 
  }));
  
  // Left face (negative X) 
  materials.push(new THREE.MeshLambertMaterial({ 
    color: x === -1 ? FACE_COLORS.left : '#1a1a1a' 
  }));
  
  // Top face (positive Y)
  materials.push(new THREE.MeshLambertMaterial({ 
    color: y === 1 ? FACE_COLORS.top : '#1a1a1a' 
  }));
  
  // Bottom face (negative Y)
  materials.push(new THREE.MeshLambertMaterial({ 
    color: y === -1 ? FACE_COLORS.bottom : '#1a1a1a' 
  }));
  
  // Front face (positive Z)
  materials.push(new THREE.MeshLambertMaterial({ 
    color: z === 1 ? FACE_COLORS.front : '#1a1a1a' 
  }));
  
  // Back face (negative Z)
  materials.push(new THREE.MeshLambertMaterial({ 
    color: z === -1 ? FACE_COLORS.back : '#1a1a1a' 
  }));
  
  return materials;
};

const IndividualCube: React.FC<{ position: number[] }> = ({ position }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materials = useMemo(() => createCubeMaterial(position), [position]);
  
  return (
    <mesh 
      ref={meshRef}
      position={[position[0], position[1], position[2]]}
    >
      <boxGeometry args={[0.95, 0.95, 0.95]} />
      {materials.map((material, index) => (
        <primitive key={index} object={material} attach={`material-${index}`} />
      ))}
    </mesh>
  );
};

const RubiksCube = forwardRef<RubiksCubeRef>((props, ref) => {
  const mainGroupRef = useRef<THREE.Group>(null);
  const { Quaternion } = THREE;
  const reusableQuaternion = useMemo(() => new Quaternion(), []);
  
  const resetCube = () => {
    if (mainGroupRef.current) {
      mainGroupRef.current.rotation.set(0, 0, 0);
      mainGroupRef.current.position.set(0, 0, 0);
    }
  };

  useImperativeHandle(ref, () => ({
    reset: resetCube
  }));

  useFrame((state) => {
    if (mainGroupRef.current) {
      const time = state.clock.getElapsedTime();
      mainGroupRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
      mainGroupRef.current.rotation.y = time * 0.1;
      mainGroupRef.current.rotation.z = Math.cos(time * 0.2) * 0.1;
    }
  });

  return (
    <group ref={mainGroupRef}>
      {INITIAL_POSITIONS.map((position, index) => (
        <IndividualCube key={index} position={position} />
      ))}
    </group>
  );
});

const EnhancedSpotlight: React.FC = () => {
  const lightRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (lightRef.current && targetRef.current) {
      lightRef.current.position.x = Math.cos(time) * 10;
      lightRef.current.position.z = Math.sin(time) * 10;
      targetRef.current.position.set(0, 0, 0);
    }
  });

  return (
    <group>
      <object3D ref={targetRef} />
      <spotLight
        ref={lightRef}
        position={[10, 10, 10]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        castShadow
        target={targetRef.current || undefined}
      />
    </group>
  );
};

const SceneContent: React.FC = () => {
  const cubeRef = useRef<RubiksCubeRef>(null);

  return (
    <React.Suspense fallback={null}>
      <group>
        <React.Suspense fallback={null}>
          <RubiksCube ref={cubeRef} />
        </React.Suspense>
        <EnhancedSpotlight />
        <ambientLight intensity={0.4} />
        <directionalLight position={[0, 0, 5]} intensity={0.5} />
      </group>
    </React.Suspense>
  );
};

const Scene: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 75 }}>
        <color attach="background" args={['#1a1a1a']} />
        <SceneContent />
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      </Canvas>
    </div>
  );
};

export { Scene };
