
import { useRef, useEffect } from "react";
import { SpotLight } from "@react-three/drei";
import * as THREE from 'three';

function EnhancedSpotlight(props: any) {
  const light = useRef<THREE.SpotLight>(null);
  
  useEffect(() => {
    if (light.current) {
      light.current.target.position.set(0, 0, 0);
      light.current.target.updateMatrixWorld();
    }
  }, []);
  
  return (
    <SpotLight 
      castShadow={false}
      ref={light} 
      {...props} 
    />
  );
}

export default EnhancedSpotlight;
