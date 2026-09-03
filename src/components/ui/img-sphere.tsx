import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface Position3D { x: number; y: number; z: number }
export interface SphericalPosition { theta: number; phi: number; radius: number }
export interface WorldPosition extends Position3D {
  scale: number;
  zIndex: number;
  isVisible: boolean;
  fadeOpacity: number;
  originalIndex: number;
}
export interface ImageData {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
}
export interface SphereImageGridProps {
  images?: ImageData[];
  containerSize?: number;
  sphereRadius?: number;
  dragSensitivity?: number;
  momentumDecay?: number;
  maxRotationSpeed?: number;
  baseImageScale?: number;
  hoverScale?: number;
  perspective?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  highlightedImageIds?: string[];
  className?: string;
}

type Rotation = { x: number; y: number };
type Velocity = { x: number; y: number };

const normalizeAngle = (angle: number) => ((angle + 180) % 360 + 360) % 360 - 180;
const toRadians = (degrees: number) => degrees * (Math.PI / 180);

const SphereImageGrid: React.FC<SphereImageGridProps> = ({
  images = [],
  containerSize = 400,
  sphereRadius = 200,
  dragSensitivity = 0.5,
  momentumDecay = 0.95,
  maxRotationSpeed = 5,
  baseImageScale = 0.12,
  hoverScale = 1.2,
  perspective = 1000,
  autoRotate = false,
  autoRotateSpeed = 0.3,
  highlightedImageIds = [],
  className = '',
}) => {
  const [rotation, setRotation] = useState<Rotation>({ x: 12, y: 18 });
  const [dragging, setDragging] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const velocityRef = useRef<Velocity>({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const frameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const positions = useMemo<SphericalPosition[]>(() => {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    return images.map((_, index) => {
      const y = images.length === 1 ? 0 : 1 - (index / (images.length - 1)) * 2;
      return {
        theta: (goldenAngle * index * 180) / Math.PI,
        phi: (Math.acos(y) * 180) / Math.PI,
        radius: sphereRadius,
      };
    });
  }, [images, sphereRadius]);

  const worldPositions = useMemo<WorldPosition[]>(() => {
    const rotX = toRadians(rotation.x);
    const rotY = toRadians(rotation.y);
    return positions.map((position, index) => {
      const theta = toRadians(position.theta);
      const phi = toRadians(position.phi);
      const sourceX = position.radius * Math.sin(phi) * Math.cos(theta);
      const sourceY = position.radius * Math.cos(phi);
      const sourceZ = position.radius * Math.sin(phi) * Math.sin(theta);
      const x = sourceX * Math.cos(rotY) + sourceZ * Math.sin(rotY);
      const z1 = -sourceX * Math.sin(rotY) + sourceZ * Math.cos(rotY);
      const y = sourceY * Math.cos(rotX) - z1 * Math.sin(rotX);
      const z = sourceY * Math.sin(rotX) + z1 * Math.cos(rotX);
      const depth = (z + sphereRadius) / (sphereRadius * 2);
      const fadeOpacity = Math.max(0.12, Math.min(1, depth * 1.35));
      return {
        x,
        y,
        z,
        scale: 0.58 + depth * 0.62,
        zIndex: Math.round(1000 + z),
        isVisible: z > -sphereRadius * 0.78,
        fadeOpacity,
        originalIndex: index,
      };
    });
  }, [positions, rotation, sphereRadius]);

  const clampSpeed = useCallback(
    (speed: number) => Math.max(-maxRotationSpeed, Math.min(maxRotationSpeed, speed)),
    [maxRotationSpeed],
  );

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: '120px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || (!autoRotate && Math.abs(velocityRef.current.x) < 0.01 && Math.abs(velocityRef.current.y) < 0.01)) {
      return;
    }
    const animate = () => {
      if (!draggingRef.current) {
        const velocity = velocityRef.current;
        velocityRef.current = { x: velocity.x * momentumDecay, y: velocity.y * momentumDecay };
        setRotation((current) => ({
          x: normalizeAngle(current.x + clampSpeed(velocity.x)),
          y: normalizeAngle(current.y + clampSpeed(velocity.y) + (autoRotate ? autoRotateSpeed : 0)),
        }));
      }
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [autoRotate, autoRotateSpeed, clampSpeed, isVisible, momentumDecay]);

  const startDrag = (clientX: number, clientY: number) => {
    draggingRef.current = true;
    setDragging(true);
    velocityRef.current = { x: 0, y: 0 };
    pointer.current = { x: clientX, y: clientY };
  };
  const moveDrag = useCallback((clientX: number, clientY: number) => {
    if (!draggingRef.current) return;
    const deltaX = clientX - pointer.current.x;
    const deltaY = clientY - pointer.current.y;
    const next = { x: clampSpeed(-deltaY * dragSensitivity), y: clampSpeed(deltaX * dragSensitivity) };
    setRotation((current) => ({ x: normalizeAngle(current.x + next.x), y: normalizeAngle(current.y + next.y) }));
    velocityRef.current = next;
    pointer.current = { x: clientX, y: clientY };
  }, [clampSpeed, dragSensitivity]);

  useEffect(() => {
    const mouseMove = (event: MouseEvent) => moveDrag(event.clientX, event.clientY);
    const touchMove = (event: TouchEvent) => {
      if (!draggingRef.current) return;
      const touch = event.touches[0];
      if (touch) moveDrag(touch.clientX, touch.clientY);
    };
    const end = () => {
      draggingRef.current = false;
      setDragging(false);
    };
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', end);
    document.addEventListener('touchmove', touchMove, { passive: true });
    document.addEventListener('touchend', end);
    return () => {
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', end);
      document.removeEventListener('touchmove', touchMove);
      document.removeEventListener('touchend', end);
    };
  }, [moveDrag]);

  const imageSize = containerSize * baseImageScale;
  const highlightedIds = useMemo(() => new Set(highlightedImageIds), [highlightedImageIds]);
  const hasActiveFilter = highlightedIds.size > 0;

  return (
    <>
      <div
        ref={containerRef}
        className={`relative cursor-grab select-none touch-pan-y active:cursor-grabbing ${className}`}
        style={{ width: containerSize, height: containerSize, perspective }}
        onMouseDown={(event) => startDrag(event.clientX, event.clientY)}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          if (touch) startDrag(touch.clientX, touch.clientY);
        }}
        role="group"
        aria-label="Interactive sphere of technologies. Drag to rotate."
      >
        <div className="pointer-events-none absolute inset-[16%] rounded-full border border-portfolio-cyan/10 shadow-[inset_0_0_80px_rgba(34,211,238,0.025),0_0_80px_rgba(34,211,238,0.035)]" />
        {images.map((image, index) => {
          const position = worldPositions[index];
          if (!position?.isVisible) return null;
          const hovered = hoveredIndex === index;
          const isDimmed = hasActiveFilter && !highlightedIds.has(image.id);
          return (
            <div
              key={image.id}
              className="group absolute rounded-full outline-none transition-[transform,opacity] duration-200 focus-visible:ring-2 focus-visible:ring-portfolio-cyan"
              style={{
                width: imageSize,
                height: imageSize,
                left: containerSize / 2 + position.x,
                top: containerSize / 2 + position.y,
                opacity: position.fadeOpacity * (isDimmed ? 0.2 : 1),
                zIndex: hovered ? 4000 : position.zIndex,
                transform: `translate(-50%, -50%) scale(${position.scale * (hovered ? hoverScale : 1)})`,
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              role="img"
              tabIndex={0}
              aria-label={image.title ?? image.alt}
            >
              <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-white/15 bg-[#111718]/95 p-[18%] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_28px_rgba(0,0,0,0.42)] backdrop-blur-md">
                <img src={image.src} alt="" className={`h-full w-full object-contain transition-[filter] duration-300 ${isDimmed ? 'grayscale' : ''}`} draggable={false} loading="lazy" decoding="async" />
              </span>
              <span className="pointer-events-none absolute left-1/2 top-[calc(100%+8px)] z-[2000] -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#080c0d]/95 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-portfolio-text opacity-0 shadow-xl backdrop-blur-md transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                {image.title ?? image.alt}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SphereImageGrid;
