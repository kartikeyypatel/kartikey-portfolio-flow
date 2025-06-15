
import { Suspense } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import EnhancedSpotlight from "./EnhancedSpotlight";
import CameraController from "./CameraController";
import RubiksCubeModel from "./RubiksCubeModel";

function SceneContent() {
  return (
    <>
      <EnhancedSpotlight 
        color="#22D3EE" 
        position={[3, 3, 2]}
        penumbra={1}
        distance={17}
        angle={0.8}
        intensity={0.8}
        castShadow={true}
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
        <RubiksCubeModel position={[0, 0, 0]} scale={1} />
      </Suspense>
    </>
  );
}

export default SceneContent;
