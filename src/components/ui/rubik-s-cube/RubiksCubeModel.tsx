
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
  console.log("RubiksCubeModel: Initializing component");
  
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
  
  const reusableVec3 = useMemo(() => {
    console.log("RubiksCubeModel: Creating reusable Vector3");
    return new Vector3();
  }, []);
  
  const reusableMatrix4 = useMemo(() => {
    console.log("RubiksCubeModel: Creating reusable Matrix4");
    return new Matrix4();
  }, []);
  
  const reusableQuaternion = useMemo(() => {
    console.log("RubiksCubeModel: Creating reusable Quaternion");
    return new Quaternion();
  }, []);

  const resetCube = useCallback(() => {
    console.log("RubiksCubeModel: Resetting cube");
    try {
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
    } catch (error) {
      console.error("RubiksCubeModel: Error in resetCube:", error);
    }
  }, []);

  const { deviceSettings, isVisible, isMountedRef, isResizingRef } = useDeviceSettings(resetCube);
  
  React.useImperativeHandle(ref, () => ({
    reset: resetCube,
    group: mainGroupRef.current
  }), [resetCube]);

  useEffect(() => {
    console.log("RubiksCubeModel: Initial effect - initializing cubes");
    try {
      setCubes(initializeCubes());
    } catch (error) {
      console.error("RubiksCubeModel: Error initializing cubes:", error);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, []);

  const possibleMoves = useMemo(() => {
    console.log("RubiksCubeModel: Generating possible moves");
    try {
      return generatePossibleMoves();
    } catch (error) {
      console.error("RubiksCubeModel: Error generating moves:", error);
      return [];
    }
  }, []);

  const selectNextMove = useCallback(() => {
    if (!isAnimatingRef.current && isVisible && isMountedRef.current && !isResizingRef.current) {
      try {
        const availableMoves = possibleMoves.filter(
          (move) => move.axis !== lastMoveAxisRef.current
        );
        
        if (availableMoves.length === 0) {
          console.warn("RubiksCubeModel: No available moves");
          return;
        }
        
        const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        const rotationAngle = Math.PI / 2;
              
        currentMoveRef.current = { ...move, rotationAngle };
        lastMoveAxisRef.current = move.axis;
        isAnimatingRef.current = true;
        currentRotationRef.current = 0;
      } catch (error) {
        console.error("RubiksCubeModel: Error selecting next move:", error);
      }
    }
  }, [possibleMoves, isVisible]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const scheduleNextMove = () => {
      if (isVisible && isMountedRef.current && !isResizingRef.current) {
        const delay = isAnimatingRef.current ? ANIMATION_DURATION * 1000 : 200;
        
        timeoutId = setTimeout(
          () => {
            try {
              selectNextMove();
              if (isMountedRef.current) {
                scheduleNextMove();
              }
            } catch (error) {
              console.error("RubiksCubeModel: Error in scheduleNextMove:", error);
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

    try {
      scheduleNextMove();
    } catch (error) {
      console.error("RubiksCubeModel: Error in move scheduling effect:", error);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isVisible, selectNextMove]);

  useFrame((state, delta) => {
    if (!isVisible || !isMountedRef.current) return;

    try {
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
              try {
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
              } catch (error) {
                console.error("RubiksCubeModel: Error updating cubes:", error);
                return prevCubes;
              }
            });
          }
        }
      }
    } catch (error) {
      console.error("RubiksCubeModel: Error in useFrame:", error);
    }
  });

  const cubeColors = useMemo(() => {
    try {
      return getCubeColors();
    } catch (error) {
      console.error("RubiksCubeModel: Error getting cube colors:", error);
      return ['#22D3EE']; // fallback color
    }
  }, []);

  console.log("RubiksCubeModel: Rendering with", cubes.length, "cubes");

  if (!cubes || cubes.length === 0) {
    console.log("RubiksCubeModel: No cubes to render");
    return null;
  }

  return (
    <group ref={mainGroupRef} {...props}>
      {cubes.map((cube, index) => {
        if (!cube || !cube.position || !cube.rotationMatrix) {
          console.warn("RubiksCubeModel: Invalid cube data at index", index, cube);
          return null;
        }

        try {
          const quaternion = matrixToQuaternion(cube.rotationMatrix, reusableQuaternion);
          
          return (
            <group
              key={cube.id}
              position={[
                cube.position.x * (size + GAP),
                cube.position.y * (size + GAP),
                cube.position.z * (size + GAP),
              ]}
              quaternion={quaternion}
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
          );
        } catch (error) {
          console.error("RubiksCubeModel: Error rendering cube at index", index, error);
          return null;
        }
      })}
    </group>
  );
});

RubiksCubeModel.displayName = 'RubiksCubeModel';

export default RubiksCubeModel;
