
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three';
import React, { Suspense, useRef, useState, useEffect, useMemo } from "react";

function SimpleCube({ position, color }: { position: [number, number, number], color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function RubiksCubeModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.002;
      groupRef.current.rotation.y += 0.003;
    }
  });

  const cubePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          positions.push([x, y, z]);
        }
      }
    }
    return positions;
  }, []);

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

  return (
    <group ref={groupRef}>
      {cubePositions.map((position, index) => (
        <SimpleCube 
          key={`cube-${position[0]}-${position[1]}-${position[2]}`}
          position={position}
          color={colors[index % colors.length]}
        />
      ))}
    </group>
  );
}

function CameraController() {
  const { camera } = useThree();
  
  useFrame(() => {
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.8}
        color="#ffffff"
      />
      <pointLight
        position={[3, 3, 2]}
        intensity={0.5}
        color="#aaaace"
        distance={20}
        decay={2}
      />
      
      <PerspectiveCamera
        makeDefault
        fov={50}
        position={[0, 0, 7]}
        near={0.1}
        far={1000}
      />

      <CameraController />

      <Suspense fallback={null}>
        <RubiksCubeModel />
      </Suspense>
    </>
  );
}

export function Scene() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  return (
    <div className="h-svh w-screen relative bg-black">
      <Canvas
        shadows={false}
        gl={{
          antialias: isDesktop,
          preserveDrawingBuffer: isDesktop,
          powerPreference: isDesktop ? "high-performance" : "default",
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1,
        }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
