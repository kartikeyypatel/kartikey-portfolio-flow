
import { Vector3, Matrix4, Quaternion } from "three";
import { CubeData, Move } from "./types";

export const initializeCubes = (): CubeData[] => {
  console.log("Utils: Initializing cubes");
  try {
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
    console.log("Utils: Created", initial.length, "cubes");
    return initial;
  } catch (error) {
    console.error("Utils: Error initializing cubes:", error);
    return [];
  }
};

export const isInLayer = (position: Vector3, axis: string, layer: number): boolean => {
  if (!position || typeof position.x === 'undefined' || typeof position.y === 'undefined' || typeof position.z === 'undefined') {
    console.warn("Utils: Invalid position in isInLayer");
    return false;
  }
  
  try {
    const coord = axis === "x" ? position.x : axis === "y" ? position.y : position.z;
    return Math.abs(coord - layer) < 0.1;
  } catch (error) {
    console.error("Utils: Error in isInLayer:", error);
    return false;
  }
};

export const createRotationMatrix = (axis: string, angle: number, reusableMatrix4: Matrix4, reusableQuaternion: Quaternion, reusableVec3: Vector3): Matrix4 => {
  if (!reusableMatrix4 || !reusableQuaternion || !reusableVec3) {
    console.error("Utils: Missing reusable objects in createRotationMatrix");
    return new Matrix4().identity();
  }
  
  try {
    reusableMatrix4.identity();
    reusableQuaternion.identity();
    reusableVec3.set(0, 0, 0);
    
    if (axis === 'x') reusableVec3.x = 1;
    else if (axis === 'y') reusableVec3.y = 1;
    else reusableVec3.z = 1;
    
    reusableQuaternion.setFromAxisAngle(reusableVec3, angle);
    return reusableMatrix4.makeRotationFromQuaternion(reusableQuaternion);
  } catch (error) {
    console.error("Utils: Error creating rotation matrix:", error);
    return new Matrix4().identity();
  }
};

export const easeInOutQuad = (t: number): number => {
  if (typeof t !== 'number' || isNaN(t)) {
    console.warn("Utils: Invalid input to easeInOutQuad:", t);
    return 0;
  }
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
};

export const matrixToQuaternion = (matrix: Matrix4, reusableQuaternion: Quaternion): Quaternion => {
  if (!matrix || !reusableQuaternion) {
    console.error("Utils: Invalid parameters in matrixToQuaternion");
    return new Quaternion();
  }
  
  try {
    reusableQuaternion.setFromRotationMatrix(matrix);
    return reusableQuaternion.clone();
  } catch (error) {
    console.error("Utils: Error in matrixToQuaternion:", error);
    return new Quaternion();
  }
};

export const normalizePositions = (cubes: CubeData[]): CubeData[] => {
  if (!Array.isArray(cubes)) {
    console.error("Utils: Invalid cubes array in normalizePositions");
    return [];
  }
  
  try {
    return cubes.map(cube => {
      if (!cube || !cube.position || typeof cube.position.x === 'undefined') {
        console.warn("Utils: Invalid cube in normalizePositions:", cube);
        return cube;
      }
      
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
  } catch (error) {
    console.error("Utils: Error normalizing positions:", error);
    return cubes;
  }
};

export const checkCubeIntegrity = (cubes: CubeData[]): boolean => {
  if (!Array.isArray(cubes)) {
    console.error("Utils: Invalid cubes array in checkCubeIntegrity");
    return false;
  }
  
  try {
    if (cubes.length !== 27) {
      console.warn("Incorrect number of cubes:", cubes.length);
      return false;
    }

    for (const cube of cubes) {
      if (!cube || !cube.position || typeof cube.position.x === 'undefined') {
        console.warn("Invalid cube in integrity check:", cube);
        return false;
      }
      
      const { x, y, z } = cube.position;
      if (Math.abs(x) > 1.1 || Math.abs(y) > 1.1 || Math.abs(z) > 1.1) {
        console.warn("Cube out of range:", cube.id, x, y, z);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Utils: Error in checkCubeIntegrity:", error);
    return false;
  }
};

export const updateCubes = (prevCubes: CubeData[], move: Move, stepRotationMatrix: Matrix4): CubeData[] => {
  if (!Array.isArray(prevCubes) || !move || !stepRotationMatrix) {
    console.error("Utils: Invalid parameters in updateCubes");
    return prevCubes || [];
  }
  
  try {
    return prevCubes.map((cube) => {
      if (!cube || !cube.position || !cube.rotationMatrix || typeof cube.position.x === 'undefined') {
        console.warn("Utils: Invalid cube in updateCubes:", cube);
        return cube;
      }
      
      if (isInLayer(cube.position, move.axis, move.layer)) {
        const tempVec3 = new Vector3();
        tempVec3.copy(cube.position);
        tempVec3.applyMatrix4(stepRotationMatrix);

        const newRotationMatrix = new Matrix4();
        newRotationMatrix.multiplyMatrices(stepRotationMatrix, cube.rotationMatrix);

        return {
          ...cube,
          position: tempVec3,
          rotationMatrix: newRotationMatrix,
        };
      }
      return cube;
    });
  } catch (error) {
    console.error("Utils: Error updating cubes:", error);
    return prevCubes;
  }
};

export const generatePossibleMoves = (): Move[] => {
  try {
    const moves: Move[] = [];
    for (let axis of ['x', 'y', 'z'] as const) {
      for (let layer of [-1, 0, 1]) {
        for (let direction of [1, -1]) {
          moves.push({ axis, layer, direction });
        }
      }
    }
    console.log("Utils: Generated", moves.length, "possible moves");
    return moves;
  } catch (error) {
    console.error("Utils: Error generating possible moves:", error);
    return [];
  }
};

export const getCubeColors = (): string[] => {
  try {
    return [
      '#22D3EE', // Primary cyan
      '#0891b2', // Darker cyan
      '#0e7490', // Even darker cyan
      '#67e8f9', // Lighter cyan
      '#374151', // Medium gray
      '#888888'  // Muted gray
    ];
  } catch (error) {
    console.error("Utils: Error getting cube colors:", error);
    return ['#22D3EE']; // fallback
  }
};
