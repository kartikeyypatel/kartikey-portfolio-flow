'use client';

import React, { Suspense, useState } from 'react';
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

const SplineScene = React.lazy(() => 
  import('./ui/spline').then(module => ({ default: module.SplineScene }))
);

const HeroSection = () => {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

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
    console.log("Chat submitted - RAG implementation coming soon!");
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
                   flex={true}
                   textColor="#FFFFFF"
                   className="drop-shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                   minFontSize={100}
                 />
               </motion.div>
               
               {/* Dynamic Job Titles - Moved closer to name */}
               <motion.div
                 className="text-xl md:text-3xl text-portfolio-text mb-8 font-light"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, delay: 0.8 }}
               >
                 <AnimatedText texts={roles} className="h-10 md:h-14" />
               </motion.div>

              {/* Professional Tagline with Link Preview */}
              <motion.p
                className="text-lg md:text-xl text-portfolio-text-muted mb-8 max-w-lg mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                Passionate <LinkPreview url="https://github.com/kartikeyp2" className="font-semibold text-portfolio-cyan">full-stack engineer</LinkPreview> with expertise in{" "}
                <LinkPreview url="https://react.dev" className="font-semibold text-portfolio-cyan">React</LinkPreview>,{" "}
                <LinkPreview url="https://spring.io" className="font-semibold text-portfolio-cyan">Java Spring Boot</LinkPreview>, and{" "}
                <LinkPreview url="https://aws.amazon.com" className="font-semibold text-portfolio-cyan">AWS</LinkPreview> - transforming ideas into scalable digital experiences
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
                 <div className="flex flex-row gap-4 items-center justify-center lg:justify-start">
                   <motion.button
                     onClick={() => setIsResumeModalOpen(true)}
                     className="inline-flex items-center justify-center bg-transparent border-2 border-portfolio-cyan text-portfolio-cyan hover:bg-portfolio-cyan hover:text-portfolio-black px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 min-w-[120px]"
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                   >
                     Resume
                   </motion.button>
                   
                   <motion.button
                     onClick={scrollToContact}
                     className="inline-flex items-center justify-center bg-transparent border-2 border-portfolio-text-muted text-portfolio-text-muted hover:border-portfolio-cyan hover:text-portfolio-cyan px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 min-w-[120px]"
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                   >
                     Let's Connect
                   </motion.button>
                 </div>
               </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Robot Animation with Chat */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <motion.div
              className="w-full h-[600px] lg:h-[700px] relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Spotlight
                className="-top-20 left-0 lg:left-10 lg:-top-10"
                fill="white"
              />
              <div className="w-full h-full relative">
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
                
                {/* Chat Input Overlay */}
                <motion.div
                  className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.6 }}
                >
                  <div className="mb-3 text-center">
                    <p className="text-portfolio-text-muted text-sm font-medium">
                      Ask me anything about my work & experience
                    </p>
                  </div>
                  <PlaceholdersAndVanishInput
                    placeholders={chatPlaceholders}
                    onChange={handleChatChange}
                    onSubmit={handleChatSubmit}
                  />
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
