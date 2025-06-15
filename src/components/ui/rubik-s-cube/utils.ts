
import { Vector3, Matrix4, Quaternion } from "three";
import { CubeData, Move } from "./types";

export const initializeCubes = (): CubeData[] => {
  const initial: CubeData[] = [];
  const positions = [-1, 0, 1];
  
  for (let x of positions) {
    for (let y of positions) {
      for (let z of positions) {
        initial.push({
          position: new Vector3(x, y, z),
          rotationMatrix: new Matrix4().identity(),
          id: `cube-${x}-${y}-${z}`,
          originalCoords: { x, y, z }
        });
      }
    }
  }
  return initial;
};

export const isInLayer = (position: Vector3, axis: string, layer: number): boolean => {
  const coord = axis === "x" ? position.x : axis === "y" ? position.y : position.z;
  return Math.abs(coord - layer) < 0.1;
};

export const createRotationMatrix = (axis: string, angle: number, reusableMatrix4: Matrix4, reusableQuaternion: Quaternion, reusableVec3: Vector3): Matrix4 => {
  reusableMatrix4.identity();
  reusableQuaternion.identity();
  reusableVec3.set(0, 0, 0);
  
  if (axis === 'x') reusableVec3.x = 1;
  else if (axis === 'y') reusableVec3.y = 1;
  else reusableVec3.z = 1;
  
  reusableQuaternion.setFromAxisAngle(reusableVec3, angle);
  return reusableMatrix4.makeRotationFromQuaternion(reusableQuaternion);
};

export const easeInOutQuad = (t: number): number => {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
};

export const matrixToQuaternion = (matrix: Matrix4, reusableQuaternion: Quaternion): Quaternion => {
  reusableQuaternion.setFromRotationMatrix(matrix);
  return reusableQuaternion.clone();
};

export const normalizePositions = (cubes: CubeData[]): CubeData[] => {
  return cubes.map(cube => {
    const x = Math.round(cube.position.x);
    const y = Math.round(cube.position.y);
    const z = Math.round(cube.position.z);
    
    const newPosition = 
      (Math.abs(cube.position.x - x) > 0.001 || 
       Math.abs(cube.position.y - y) > 0.001 || 
       Math.abs(cube.position.z - z) > 0.001) 
        ? new Vector3(x, y, z) 
        : cube.position;
    
    return {
      ...cube,
      position: newPosition
    };
  });
};

export const checkCubeIntegrity = (cubes: CubeData[]): boolean => {
  if (cubes.length !== 27) {
    console.warn("Incorrect number of cubes:", cubes.length);
    return false;
  }

  for (const cube of cubes) {
    const { x, y, z } = cube.position;
    if (Math.abs(x) > 1.1 || Math.abs(y) > 1.1 || Math.abs(z) > 1.1) {
      console.warn("Cube out of range:", cube.id, x, y, z);
      return false;
    }
  }
  
  return true;
};

export const updateCubes = (prevCubes: CubeData[], move: Move, stepRotationMatrix: Matrix4): CubeData[] => {
  return prevCubes.map((cube) => {
    if (isInLayer(cube.position, move.axis, move.layer)) {
      const tempVec3 = new Vector3(
        cube.position.x,
        cube.position.y,
        cube.position.z
      );

      tempVec3.applyMatrix4(stepRotationMatrix);

      const newRotationMatrix = new Matrix4().multiplyMatrices(
        stepRotationMatrix,
        cube.rotationMatrix
      );

      return {
        ...cube,
        position: tempVec3,
        rotationMatrix: newRotationMatrix,
      };
    }
    return cube;
  });
};

export const generatePossibleMoves = (): Move[] => {
  const moves: Move[] = [];
  for (let axis of ['x', 'y', 'z'] as const) {
    for (let layer of [-1, 0, 1]) {
      for (let direction of [1, -1]) {
        moves.push({ axis, layer, direction });
      }
    }
  }
  return moves;
};

export const getCubeColors = (): string[] => [
  '#22D3EE', // Primary cyan
  '#0891b2', // Darker cyan
  '#0e7490', // Even darker cyan
  '#67e8f9', // Lighter cyan
  '#374151', // Medium gray
  '#888888'  // Muted gray
];
