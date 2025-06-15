
import React from "react";
import { Canvas } from "@react-three/fiber";
import SceneContent from "./SceneContent";

const Scene = () => {
  console.log("Scene: Rendering Rubik's Cube Scene");
  
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      style={{ 
        background: 'transparent',
      }}
      onCreated={(state) => {
        console.log("Scene: Canvas created successfully", state);
      }}
      onError={(error) => {
        console.error("Scene: Canvas error:", error);
      }}
    >
      <React.Suspense fallback={null}>
        <SceneContent />
      </React.Suspense>
    </Canvas>
  );
};

export default Scene;
export { Scene };
