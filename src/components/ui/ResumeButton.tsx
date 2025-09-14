"use client"

import * as React from "react"
import { motion } from "framer-motion"

export const ResumeButton = () => {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <a 
      href="https://drive.google.com/file/d/1iDxnX1RcRGaX9_MRDuNrx-jcC-S4n9_U/view?usp=drive_link"
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex items-center justify-center"
      aria-label="View Resume"
    >
      <motion.div
        initial={{ width: 48, height: 48 }}
        whileHover={{ width: 120 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-portfolio-cyan flex items-center justify-center overflow-hidden relative rounded-full"
      >
        <motion.div
          className="absolute"
          animate={{ 
            opacity: isHovered ? 0 : 1,
            scale: isHovered ? 0.8 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        </motion.div>

        <motion.div
          className="w-full flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2, delay: isHovered ? 0.2 : 0 }}
        >
          <span className="text-black text-sm font-bold whitespace-nowrap">
            Resume
          </span>
        </motion.div>
      </motion.div>
    </a>
  )
}
