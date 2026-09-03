import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    setZoom(1);
    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/Kartikey-Patel-Resume.pdf';
    link.download = 'Kartikey-Patel-Resume.pdf';
    link.click();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Close modal when clicking on the backdrop (the dark overlay)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    // Prevent clicks inside the modal from closing it
    e.stopPropagation();
  };

  // Add keyboard event listener for ESC key
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000] flex h-[100dvh] items-center justify-center bg-black/85 p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-dialog-title"
        >
          <motion.div
            className="relative flex h-[min(88dvh,760px)] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleModalClick}
          >
              {/* Header */}
              <div className="relative z-10 flex min-h-14 shrink-0 items-center justify-between border-b bg-gray-50 px-3 py-2 sm:px-4">
                <h2 id="resume-dialog-title" className="truncate pr-2 text-sm font-semibold text-gray-800 sm:text-xl">Resume — Kartikey Patel</h2>
                <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    className="hidden p-2 hover:bg-gray-200 rounded-full transition-colors sm:block"
                    title="Zoom Out"
                  >
                    <ZoomOut className="h-5 w-5" />
                  </button>
                  <span className="hidden min-w-[52px] text-center text-sm text-gray-600 sm:block">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    className="hidden p-2 hover:bg-gray-200 rounded-full transition-colors sm:block"
                    title="Zoom In"
                  >
                    <ZoomIn className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-200"
                    title="Download PDF"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 text-gray-900 transition-colors hover:bg-gray-300"
                    title="Close resume"
                    aria-label="Close resume"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Resume Content */}
              <div 
                className="min-h-0 flex-1 overflow-auto bg-gray-200"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                <div 
                  className="h-full w-full"
                  style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
                >
                  <iframe
                    src="/Kartikey-Patel-Resume.pdf"
                    className="w-full h-full border-0"
                    title="Resume - Kartikey Patel"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
