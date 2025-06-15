
import { Vector3, Matrix4, Group } from "three";

export interface CubeData {
  position: Vector3;
  rotationMatrix: Matrix4;
  id: string;
  originalCoords: { x: number; y: number; z: number };
}

export interface Move {
  axis: 'x' | 'y' | 'z';
  layer: number;
  direction: number;
  rotationAngle?: number;
}

export interface DeviceSettings {
  smoothness: number;
  castShadow: boolean;
  receiveShadow: boolean;
}

export interface RubiksCubeModelProps {
  position?: [number, number, number];
  scale?: number;
}

export interface RubiksCubeRef {
  reset: () => void;
  group: Group | null;
}
