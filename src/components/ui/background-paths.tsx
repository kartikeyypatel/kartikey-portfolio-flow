
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function FloatingPaths({ position, animatePaths }: { position: number; animatePaths: boolean }) {
    const paths = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
            380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
            152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
            684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        width: 0.5 + i * 0.03,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg
                className="w-full h-full"
                viewBox="0 0 696 316"
                fill="none"
                preserveAspectRatio="xMidYMid slice"
            >
                <title>Background Paths</title>
                {paths.map((path) => animatePaths ? (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeOpacity={0.08 + path.id * 0.018}
                        initial={{ pathLength: 0.3, opacity: 0.35 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.16, 0.34, 0.16],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: 20 + Math.random() * 10,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    />
                ) : (
                    <path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeOpacity={0.08 + path.id * 0.012}
                    />
                ))}
            </svg>
        </div>
    );
}

export function BackgroundPaths() {
    const [animatePaths, setAnimatePaths] = useState(() =>
        typeof window !== "undefined" &&
        window.innerWidth >= 768 &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    useEffect(() => {
        const viewport = window.matchMedia("(min-width: 768px)");
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setAnimatePaths(viewport.matches && !reducedMotion.matches);
        viewport.addEventListener("change", update);
        reducedMotion.addEventListener("change", update);
        return () => {
            viewport.removeEventListener("change", update);
            reducedMotion.removeEventListener("change", update);
        };
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden text-portfolio-cyan">
            <FloatingPaths position={1} animatePaths={animatePaths} />
            <FloatingPaths position={-1} animatePaths={animatePaths} />
            <div className="absolute inset-0 bg-gradient-to-t from-portfolio-black via-transparent to-portfolio-black/50"></div>
        </div>
    );
}
