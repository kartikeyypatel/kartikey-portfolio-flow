
'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { BackgroundPaths } from './ui/background-paths';
import { AnimatedText } from './ui/animated-hero';
import { TextPressure } from './ui/interactive-text-pressure';
import { SplineScene } from './ui/spline';
import { Spotlight } from './ui/spotlight';

const HeroSection = () => {
  const scrollToSkills = () => {
    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
      skillsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const roles = ["Software Engineer", "Full Stack Developer", "Frontend Developer", "Backend Developer"];

  return (
    <section id="home" className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <BackgroundPaths />

      {/* Content */}
      <div className="relative w-full container mx-auto px-4 flex items-center justify-start h-screen">
        
        {/* Robot on the right, partially behind */}
        <div className="absolute top-0 right-0 w-full md:w-3/5 h-full flex items-center justify-center z-0 opacity-30 md:opacity-40 pointer-events-none">
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
              className="h-32 md:h-40 flex items-center justify-center md:justify-start mb-6"
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
            
            <motion.p 
              className="text-3xl md:text-5xl text-portfolio-text mb-12 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <AnimatedText texts={roles} className="h-12 md:h-16" />
            </motion.p>
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

