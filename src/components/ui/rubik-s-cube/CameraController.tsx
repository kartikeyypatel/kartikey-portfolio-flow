
import { useThree } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";

function CameraController() {
  const { camera } = useThree();
  
  useFrame(() => {
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

export default CameraController;
