
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import locales from '../locales/en.json';

const MyWorkSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="my-work" className="min-h-screen bg-portfolio-gray/30 relative overflow-hidden">
      <div className="container-custom h-full flex items-center" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left Column - Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <motion.h2 
                className="text-6xl md:text-7xl font-bold text-portfolio-text mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {locales.myWork.title}
              </motion.h2>
              
              <motion.p 
                className="text-lg text-portfolio-text-muted leading-relaxed mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {locales.myWork.description}
              </motion.p>
              
              <motion.p 
                className="text-lg text-portfolio-text-muted leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                From developing consumer safety applications to creating AI-powered solutions, I bring ideas to life through clean, efficient code and thoughtful user experiences.
              </motion.p>
            </div>
          </motion.div>

          {/* Right Column - Phone Mockup */}
          <motion.div
            className="flex flex-col items-center justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              className="relative"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Phone Frame */}
              <div className="relative w-64 h-96 bg-portfolio-gray-lighter rounded-3xl p-2 shadow-2xl border border-portfolio-gray">
                <div className="w-full h-full bg-portfolio-black rounded-2xl overflow-hidden relative">
                  {/* Phone Screen Content */}
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: "url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-portfolio-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-4 right-4">
                      <h3 className="text-white font-semibold text-sm mb-1">Consumer Safety App</h3>
                      <p className="text-gray-300 text-xs">Real-time safety monitoring</p>
                    </div>
                  </div>
                  
                  {/* Phone notch/camera */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-portfolio-gray rounded-full"></div>
                </div>
              </div>
            </motion.div>

            {/* Featured Project Info */}
            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <p className="text-sm text-portfolio-cyan font-mono mb-2">
                {locales.myWork.featuredProject}
              </p>
              <h4 className="text-xl font-semibold text-portfolio-text mb-4">
                Consumer Safety Application
              </h4>
              <motion.button
                className="inline-flex items-center space-x-2 text-portfolio-cyan hover:text-white transition-colors duration-200 group"
                whileHover={{ x: 5 }}
              >
                <span>{locales.myWork.viewProject}</span>
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MyWorkSection;
