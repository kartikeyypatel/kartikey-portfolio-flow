'use client';

import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { BackgroundPaths } from './ui/background-paths';
import { AnimatedText } from './ui/animated-hero';
import { TextPressure } from './ui/interactive-text-pressure';
import { SplineScene } from './ui/spline';
import { Spotlight } from './ui/spotlight';
import { HeroResumeButton } from './ui/HeroResumeButton';

const HeroSection = () => {
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

  const roles = ["Software Engineer", "Full Stack Developer", "Frontend Developer", "Backend Developer"];

  return (
    <section id="home" className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <BackgroundPaths />

      {/* Content */}
      <div className="relative w-full container mx-auto px-4 flex items-center justify-start h-screen">
        
        {/* Robot on the right, partially behind */}
        <div className="absolute top-0 right-0 w-full md:w-3/5 h-full flex items-center justify-center z-0 opacity-40 md:opacity-50 pointer-events-auto">
          <Spotlight
            className="-top-20 left-0 md:left-20 md:-top-10"
            fill="white"
          />
          <div className="w-full h-full">
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            />
          </div>
        </div>

        {/* Text on the left, on top */}
        <div className="relative z-10 w-full md:w-3/5 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="h-32 md:h-40 flex items-center justify-center md:justify-start mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <TextPressure
                text="Kartikey Patel"
                flex={true}
                textColor="#E0E0E0"
                className="mix-blend-difference"
                minFontSize={100}
              />
            </motion.div>
            
            <div className="flex flex-col items-center md:items-start">
              <motion.p 
                className="text-2xl md:text-4xl text-portfolio-text mb-8 font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <AnimatedText texts={roles} className="h-12 md:h-16" />
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <motion.button
                  onClick={scrollToProjects}
                  className="inline-flex items-center space-x-3 bg-transparent border-2 border-portfolio-cyan text-portfolio-cyan hover:bg-portfolio-cyan hover:text-portfolio-black px-6 py-3 rounded-full text-base font-semibold transition-all duration-300 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>View My Work</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </motion.button>
                <HeroResumeButton />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToSkills}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-portfolio-cyan hover:text-white transition-colors duration-200 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2 font-mono">Skills</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="h-6 w-6" />
          </motion.div>
        </div>
      </motion.button>
    </section>
  );
};

export default HeroSection;
