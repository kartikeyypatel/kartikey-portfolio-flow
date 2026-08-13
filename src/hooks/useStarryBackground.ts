import { useMotionValue, useMotionTemplate, animate } from 'framer-motion';
import { useEffect } from 'react';

const COLORS_TOP = ["#22D3EE", "#0EA5E9", "#38BDF8", "#0891B2"];

export const useStarryBackground = () => {
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #000000 50%, ${color})`;

  return { backgroundImage };
}; 