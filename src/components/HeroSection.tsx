'use client';

import React, { Suspense, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { BackgroundPaths } from './ui/background-paths';
import { AnimatedText } from './ui/animated-hero';
import { TextPressure } from './ui/interactive-text-pressure';
import { Spotlight } from './ui/spotlight';
import { HeroResumeButton } from './ui/HeroResumeButton';
import { ResumeModal } from './ui/ResumeModal';
import { LinkPreview } from './ui/link-preview';
import { PlaceholdersAndVanishInput } from './ui/placeholders-and-vanish-input';
import ChatModal from './ui/ChatModal';

const SplineScene = React.lazy(() => 
  import('./ui/spline').then(module => ({ default: module.SplineScene }))
);

const HeroSection = () => {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [initialChatMessage, setInitialChatMessage] = useState<string | undefined>(undefined);

  const heroTextRef = useRef<HTMLDivElement>(null);
  const thisGuyRef = useRef<HTMLSpanElement>(null);
  const [nameArrowPath, setNameArrowPath] = useState<string | null>(null);

  // Draw a connector from "This guy" up to the name by measuring their actual
  // rendered positions, since the name's font size (and therefore the gap
  // between the two) changes with viewport width and text-pressure font metrics.
  useEffect(() => {
    const computeArrow = () => {
      const container = heroTextRef.current;
      const guyEl = thisGuyRef.current;
      const nameEl = container?.querySelector<HTMLElement>('.text-pressure-title');
      if (!container || !guyEl || !nameEl) return;

      const containerRect = container.getBoundingClientRect();
      const nameRect = nameEl.getBoundingClientRect();
      const guyRect = guyEl.getBoundingClientRect();

      const startX = guyRect.left - containerRect.left + guyRect.width * 0.2;
      const startY = guyRect.top - containerRect.top - 4;
      const endX = nameRect.left - containerRect.left + Math.min(nameRect.width * 0.06, 24);
      const endY = nameRect.bottom - containerRect.top + 6;

      // Skip drawing if there isn't a clean vertical gap to arc through
      // (e.g. wrapped text on very small screens pushing them close together).
      if (startY - endY < 20) {
        setNameArrowPath(null);
        return;
      }

      const midY = (startY + endY) / 2;
      // Bow the curve out to the left, scaled to the gap so it looks
      // proportional whether the two elements are close or far apart.
      const bow = Math.min(Math.max((startY - endY) * 0.3, 20), 50);
      setNameArrowPath(
        `M ${startX} ${startY} C ${startX - bow} ${midY}, ${endX - bow} ${midY}, ${endX} ${endY}`
      );
    };

    computeArrow();
    // Recompute after the entrance animations settle, since they animate position.
    const settleTimeout = setTimeout(computeArrow, 1700);
    window.addEventListener('resize', computeArrow);
    return () => {
      clearTimeout(settleTimeout);
      window.removeEventListener('resize', computeArrow);
    };
  }, []);

  const chatPlaceholders = [
    "Ask about my experience with React and TypeScript...",
    "What projects has Kartikey worked on recently?",
    "Tell me about his technical skills and expertise...",
    "How can I get in touch with Kartikey?",
    "What makes him a great software engineer?",
  ];

  const handleChatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Chat input:", e.target.value);
  };

  const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputEl = (e.target as HTMLFormElement).querySelector('input[type="text"]') as HTMLInputElement | null;
    const initial = inputEl?.value?.trim();
    setInitialChatMessage(initial || undefined);
    setIsChatModalOpen(true);
  };

  const scrollToSkills = () => {
    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
      skillsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToProjects = () => {
    const projectsSection = document.querySelector('#projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const roles = ["Software Engineer", "Full Stack Developer", "Frontend Developer", "Backend Developer"];

  return (
    <section id="home" className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <BackgroundPaths />

      {/* Two-Column Grid Layout */}
      <div className="relative w-full container mx-auto px-4 h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full items-center">
          
          {/* Left Column - Text Content */}
          <div className="relative z-10 flex flex-col justify-center space-y-8 text-center lg:text-left">
            <motion.div
              ref={heroTextRef}
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
               {/* Animated Name with improved contrast */}
               <motion.div
                 className="h-32 md:h-40 flex items-center justify-center lg:justify-start mb-4"
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 1, delay: 0.5 }}
               >
                 <TextPressure
                   text="Kartikey Patel"
                   fontFamily="Roboto Flex"
                   fontUrl=""
                   italic={false}
                   flex={true}
                   textColor="#FFFFFF"
                   className="drop-shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                   minFontSize={100}
                 />
               </motion.div>
               
                {/* Dynamic Job Titles - Moved closer to name */}
                <motion.div
                  className="text-xl md:text-3xl text-portfolio-text mb-6 font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <AnimatedText texts={roles} className="h-10 md:h-14" />
                </motion.div>

              {/* Professional Tagline with personal callout + curved arrow to name */}
              <motion.p
                className="text-lg md:text-xl text-portfolio-text-muted mb-8 max-w-lg mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <span ref={thisGuyRef} className="inline-block">
                <LinkPreview
                  url="https://github.com/kartikeyp2"
                  className="font-semibold text-portfolio-cyan"
                  isStatic
                  imageSrc="/uploads/kartikey-profile.jpg"
                >
                    This guy
                  </LinkPreview>
                  , is a
                </span>{' '}
                passionate <span className="font-semibold text-portfolio-cyan">full-stack engineer</span> crafting intelligent solutions with{" "}
                <LinkPreview url="https://react.dev" className="font-semibold text-portfolio-cyan">React</LinkPreview>,{" "}
                <LinkPreview url="https://spring.io" className="font-semibold text-portfolio-cyan">Spring Boot</LinkPreview>, and{" "}
                <LinkPreview url="https://aws.amazon.com" className="font-semibold text-portfolio-cyan">AWS</LinkPreview> — building tomorrow's digital innovations through scalable, intelligent web applications.
              </motion.p>

               {/* CTA Buttons with improved alignment */}
               <motion.div
                 className="flex flex-col items-center justify-center lg:items-start gap-6"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, delay: 1.2 }}
               >
                 {/* Primary CTA */}
                 <motion.button
                   onClick={scrollToProjects}
                   className="inline-flex items-center space-x-3 bg-portfolio-cyan text-portfolio-black hover:bg-white hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 group shadow-lg"
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   <span>View My Work</span>
                   <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                 </motion.button>

                  {/* Secondary CTAs - Better spacing and alignment */}
                  <div className="flex flex-row gap-3 items-center justify-center lg:justify-start max-w-[240px]">
                    <motion.button
                      onClick={() => setIsResumeModalOpen(true)}
                      className="inline-flex items-center justify-center bg-transparent border-2 border-portfolio-cyan text-portfolio-cyan hover:bg-portfolio-cyan hover:text-portfolio-black px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex-1"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Resume
                    </motion.button>
                    
                    <motion.button
                      onClick={scrollToContact}
                      className="inline-flex items-center justify-center bg-transparent border-2 border-portfolio-text-muted text-portfolio-text-muted hover:border-portfolio-cyan hover:text-portfolio-cyan px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex-1"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Connect
                    </motion.button>
                  </div>
               </motion.div>

               {/* Curved connector from "This guy" up to the name, measured to fit whatever gap the current layout/viewport produces */}
               {nameArrowPath && (
                 <svg
                   className="pointer-events-none absolute inset-0 w-full h-full text-portfolio-cyan"
                   style={{ overflow: 'visible' }}
                 >
                   <defs>
                     <marker
                       id="hero-name-arrowhead"
                       markerWidth="8"
                       markerHeight="8"
                       refX="4"
                       refY="4"
                       orient="auto-start-reverse"
                     >
                       <path d="M0,0 L8,4 L0,8 Z" fill="currentColor" />
                     </marker>
                   </defs>
                   <path
                     d={nameArrowPath}
                     stroke="currentColor"
                     strokeWidth="2.5"
                     strokeLinecap="round"
                     fill="none"
                     markerEnd="url(#hero-name-arrowhead)"
                   />
                 </svg>
               )}
            </motion.div>
          </div>

          {/* Right Column - Robot Animation with Chat */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <motion.div
              className="w-full relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Spotlight
                className="-top-20 left-0 lg:left-10 lg:-top-10"
                fill="white"
              />
              {/* Constrained wrapper so input matches robot width */}
              <div className="relative mx-auto lg:ml-auto lg:mr-8 w-full max-w-[560px] px-4">
                {/* Robot Canvas */}
                <div className="w-full h-[520px] lg:h-[640px] relative">
                  <Suspense fallback={
                    <div className="w-full h-full bg-gradient-to-br from-portfolio-gray/20 to-portfolio-cyan/10 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 border-4 border-portfolio-cyan/30 border-t-portfolio-cyan rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-portfolio-text-muted text-sm">Loading 3D Scene...</p>
                      </div>
                    </div>
                  }>
                    <SplineScene 
                      scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                    />
                  </Suspense>
                </div>

                {/* Chat Input overlaid on robot */}
                <motion.div
                  className="absolute inset-x-0 bottom-6 w-full px-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  <div className="mb-2 text-center">
                    <p className="text-portfolio-text-muted text-sm font-medium">
                      Ask me anything about my work & experience
                    </p>
                  </div>
                  <div className="relative mx-auto max-w-[520px]">
                    <div className="absolute inset-0 bg-portfolio-black/20 backdrop-blur-sm rounded-lg"></div>
                    <div className="relative z-10">
                      <PlaceholdersAndVanishInput
                        placeholders={chatPlaceholders}
                        onChange={handleChatChange}
                        onSubmit={handleChatSubmit}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Resume Modal */}
      <ResumeModal 
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />

      {/* Chat Modal */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => {
          setIsChatModalOpen(false);
          setInitialChatMessage(undefined);
        }}
        initialMessage={initialChatMessage}
      />

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToSkills}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-portfolio-cyan hover:text-white transition-colors duration-200 z-20 group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Scroll to Skills section"
      >
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2 font-mono group-hover:text-white transition-colors duration-200">Skills</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="group-hover:text-white transition-colors duration-200"
          >
            <ChevronDown className="h-6 w-6" />
          </motion.div>
        </div>
      </motion.button>
    </section>
  );
};

export default HeroSection;
