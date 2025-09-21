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

const SplineScene = React.lazy(() => 
  import('./ui/spline').then(module => ({ default: module.SplineScene }))
);

const HeroSection = () => {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

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
                className="h-32 md:h-40 flex items-center justify-center lg:justify-start mb-6"
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
              
              {/* Dynamic Job Titles */}
              <motion.div
                className="text-2xl md:text-4xl text-portfolio-text mb-6 font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <AnimatedText texts={roles} className="h-12 md:h-16" />
              </motion.div>

              {/* Professional Tagline */}
              <motion.p
                className="text-lg md:text-xl text-portfolio-text-muted mb-8 max-w-lg mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                Crafting intelligent web applications and building tomorrow's digital solutions
              </motion.p>

              {/* CTA Buttons with proper hierarchy */}
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

                {/* Secondary CTAs - Consistent styling and alignment */}
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <motion.button
                    onClick={() => setIsResumeModalOpen(true)}
                    className="inline-flex items-center justify-center bg-transparent border-2 border-portfolio-cyan/50 text-portfolio-cyan hover:border-portfolio-cyan hover:bg-portfolio-cyan/10 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Resume
                  </motion.button>
                  
                  <motion.button
                    onClick={scrollToContact}
                    className="inline-flex items-center justify-center bg-transparent border-2 border-portfolio-cyan/50 text-portfolio-cyan hover:border-portfolio-cyan hover:bg-portfolio-cyan/10 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Let's Connect
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Robot Animation */}
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
              <div className="w-full h-full">
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
