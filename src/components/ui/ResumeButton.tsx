"use client"

import * as React from "react"

interface ResumeButtonProps {
  onClick: () => void;
}

export const ResumeButton: React.FC<ResumeButtonProps> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[10px] border border-portfolio-cyan/50 bg-portfolio-cyan/[0.06] px-[18px] text-[13px] font-semibold text-portfolio-text transition-[border-color,background,transform] duration-200 hover:-translate-y-px hover:border-portfolio-cyan hover:bg-portfolio-cyan/[0.1]"
      aria-label="View Resume"
    >
      <span>Resume</span>
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
    </button>
  )
}
