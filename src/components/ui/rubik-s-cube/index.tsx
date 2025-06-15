
import { Canvas } from "@react-three/fiber";
import SceneContent from "./SceneContent";

const Scene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      style={{ 
        background: 'transparent',
      }}
    >
      <SceneContent />
    </Canvas>
  );
};

export default Scene;
export { Scene };
