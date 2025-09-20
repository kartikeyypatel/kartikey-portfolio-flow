"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface HeroResumeButtonProps {
  onClick: () => void;
}

export const HeroResumeButton: React.FC<HeroResumeButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center"
      aria-label="View Resume"
    >
      <motion.div
        className="bg-portfolio-cyan flex items-center justify-center overflow-hidden relative rounded-full"
        style={{ width: 120, height: 48 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-full flex justify-center items-center space-x-2">
          <span className="text-black text-sm font-bold whitespace-nowrap">
            Resume
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
        </div>
      </motion.div>
    </button>
  );
};