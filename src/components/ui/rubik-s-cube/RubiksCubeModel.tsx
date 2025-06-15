
import React, { useRef, useState, useEffect, forwardRef, useMemo, useCallback } from "react";
import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three';
import { Vector3, Matrix4, Quaternion } from "three";
import { RubiksCubeModelProps, RubiksCubeRef, CubeData, Move } from "./types";
import { useDeviceSettings } from "./useDeviceSettings";
import {
  initializeCubes,
  createRotationMatrix,
  easeInOutQuad,
  matrixToQuaternion,
  normalizePositions,
  checkCubeIntegrity,
  updateCubes,
  generatePossibleMoves,
  getCubeColors
} from "./utils";

const RubiksCubeModel = forwardRef<RubiksCubeRef, RubiksCubeModelProps>((props, ref) => {
  const ANIMATION_DURATION = 1.2;
  const GAP = 0.01;
  const RADIUS = 0.075;
  
  const mainGroupRef = useRef<THREE.Group>(null);
  const isAnimatingRef = useRef(false);
  const currentRotationRef = useRef(0);
  const lastMoveAxisRef = useRef<string | null>(null);
  const currentMoveRef = useRef<Move | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const [size, setSize] = useState(0.8);
  const [cubes, setCubes] = useState<CubeData[]>([]);
  
  const reusableVec3 = useMemo(() => new Vector3(), []);
  const reusableMatrix4 = useMemo(() => new Matrix4(), []);
  const reusableQuaternion = useMemo(() => new Quaternion(), []);

  const resetCube = useCallback(() => {
    setCubes(initializeCubes());
    if (mainGroupRef.current) {
      mainGroupRef.current.rotation.set(0, 0, 0);
    }
    isAnimatingRef.current = false;
    currentRotationRef.current = 0;
    lastMoveAxisRef.current = null;
    currentMoveRef.current = null;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const { deviceSettings, isVisible, isMountedRef, isResizingRef } = useDeviceSettings(resetCube);
  
  React.useImperativeHandle(ref, () => ({
    reset: resetCube,
    group: mainGroupRef.current
  }), [resetCube]);

  useEffect(() => {
    setCubes(initializeCubes());
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, []);

  const possibleMoves = useMemo(() => generatePossibleMoves(), []);

  const selectNextMove = useCallback(() => {
    if (!isAnimatingRef.current && isVisible && isMountedRef.current && !isResizingRef.current) {
      const availableMoves = possibleMoves.filter(
        (move) => move.axis !== lastMoveAxisRef.current
      );
      
      const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      const rotationAngle = Math.PI / 2;
            
      currentMoveRef.current = { ...move, rotationAngle };
      lastMoveAxisRef.current = move.axis;
      isAnimatingRef.current = true;
      currentRotationRef.current = 0;
    }
  }, [possibleMoves, isVisible]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const scheduleNextMove = () => {
      if (isVisible && isMountedRef.current && !isResizingRef.current) {
        const delay = isAnimatingRef.current ? ANIMATION_DURATION * 1000 : 200;
        
        timeoutId = setTimeout(
          () => {
            selectNextMove();
            if (isMountedRef.current) {
              scheduleNextMove();
            }
          },
          delay
        );
      } else {
        if (isResizingRef.current && isVisible && isMountedRef.current) {
          setTimeout(() => {
            if (isMountedRef.current) {
              scheduleNextMove();
            }
          }, 500);
        }
      }
    };

    scheduleNextMove();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isVisible, selectNextMove]);

  useFrame((state, delta) => {
    if (!isVisible || !isMountedRef.current) return;

    if (mainGroupRef.current) {
      mainGroupRef.current.rotation.x += delta * 0.3;
      mainGroupRef.current.rotation.y += delta * 0.5;
      mainGroupRef.current.rotation.z += delta * 0.2;
    }

    if (isResizingRef.current && isAnimatingRef.current) {
      resetCube();
      return;
    }

    if (isAnimatingRef.current && currentMoveRef.current) {
      const move = currentMoveRef.current;
      const targetRotation = move.rotationAngle || 0;
      const rotation = delta / ANIMATION_DURATION;

      if (currentRotationRef.current < 1) {
        const newRotation = Math.min(currentRotationRef.current + rotation, 1);
        const prevRotation = currentRotationRef.current;
        currentRotationRef.current = newRotation;

        const easedProgress = easeInOutQuad(newRotation);
        const prevEasedProgress = easeInOutQuad(prevRotation);
        const currentAngle = easedProgress * targetRotation;
        const prevAngle = prevEasedProgress * targetRotation;
        const stepRotation = currentAngle - prevAngle;

        const stepRotationMatrix = createRotationMatrix(
          move.axis,
          stepRotation * move.direction,
          reusableMatrix4,
          reusableQuaternion,
          reusableVec3
        );

        if (isMountedRef.current && !isResizingRef.current) {
          setCubes((prevCubes) => {
            const updatedCubes = updateCubes(prevCubes, move, stepRotationMatrix);
            
            if (newRotation >= 1) {
              const normalizedCubes = normalizePositions(updatedCubes);
              
              if (!checkCubeIntegrity(normalizedCubes)) {
                console.warn("Found a cube out of bounds");
                if (isMountedRef.current) {
                  setTimeout(() => resetCube(), 0);
                }
              }
              
              isAnimatingRef.current = false;
              currentRotationRef.current = 0;
              currentMoveRef.current = null;
              
              return normalizedCubes;
            }
            
            return updatedCubes;
          });
        }
      }
    }
  });

  const cubeColors = useMemo(() => getCubeColors(), []);

  return (
    <group ref={mainGroupRef} {...props}>
      {cubes.map((cube, index) => (
        <group
          key={cube.id}
          position={[
            cube.position.x * (size + GAP),
            cube.position.y * (size + GAP),
            cube.position.z * (size + GAP),
          ]}
          quaternion={matrixToQuaternion(cube.rotationMatrix, reusableQuaternion)}
        >
          <RoundedBox
            args={[size, size, size]}
            radius={RADIUS}
            smoothness={deviceSettings.smoothness}
            castShadow={deviceSettings.castShadow}
            receiveShadow={deviceSettings.receiveShadow}
          >
            <meshPhysicalMaterial 
              color={cubeColors[index % cubeColors.length]}
              metalness={0.7}
              roughness={0.3}
              clearcoat={0.2}
              clearcoatRoughness={0.1}
              reflectivity={0.8}
              envMapIntensity={1.5}
            />
          </RoundedBox>
        </group>
      ))}
    </group>
  );
});

export default RubiksCubeModel;
