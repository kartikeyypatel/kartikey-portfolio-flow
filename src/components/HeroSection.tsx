
'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import locales from '../locales/en.json';
import AnimatedBackground from './AnimatedBackground';
import { AnimatedText } from './ui/animated-hero';

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
      {/* Animated 3D Background */}
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1 
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-portfolio-text mb-6 tracking-wider mix-blend-difference"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {locales.hero.title}
          </motion.h1>
          
          <motion.p 
            className="text-3xl md:text-5xl text-portfolio-text mb-12 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <AnimatedText texts={roles} className="h-14" />
          </motion.p>
        </motion.div>
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
          <span className="text-sm mb-2 font-mono">{locales.hero.scrollDown}</span>
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
