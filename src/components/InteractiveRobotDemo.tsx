'use client';

import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { SplineScene } from './ui/spline';
import { Sparkles, Zap, Play, Music, RotateCcw } from 'lucide-react';

const InteractiveRobotDemo = () => {
  return (
    <section className="min-h-screen bg-portfolio-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-portfolio-black via-portfolio-gray to-portfolio-black opacity-50" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
          
          {/* Left Column - Text Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <motion.h1
                className="text-5xl md:text-6xl font-bold text-portfolio-text mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Interactive
                <span className="text-portfolio-cyan block">3D Robot</span>
              </motion.h1>
              
              <motion.p
                className="text-xl text-portfolio-text-muted leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Experience the future of web interaction with our AI-powered 3D robot. 
                Click the controls to see it wave, dance, spin, and more!
              </motion.p>
            </div>

            {/* Feature List */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-portfolio-text">Wave Animation - Gentle swaying motion</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Music className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-portfolio-text">Dance Mode - Bouncy movement with spin</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-portfolio-text">Spin Animation - Smooth 360° rotation</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-yellow-400" />
                </div>
                <span className="text-portfolio-text">Auto Mode - Random animations</span>
              </div>
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              className="bg-portfolio-gray/20 rounded-lg p-6 border border-portfolio-gray-lighter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <h3 className="text-portfolio-cyan text-lg font-semibold mb-3">Powered by</h3>
              <div className="flex flex-wrap gap-2">
                {['Spline 3D', 'React', 'TypeScript', 'Framer Motion', 'Three.js'].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-portfolio-cyan/10 text-portfolio-cyan text-sm rounded-full border border-portfolio-cyan/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Interactive Robot */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative w-full h-[600px] lg:h-[700px] bg-gradient-to-br from-portfolio-gray/10 to-portfolio-cyan/5 rounded-2xl border border-portfolio-gray-lighter overflow-hidden">
              
              {/* Robot Scene */}
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
                showControls={true}
              />
              
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-portfolio-cyan/30 rounded-full"
                />
              </div>
              
              <div className="absolute bottom-4 right-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-4 h-4 bg-portfolio-cyan/40 rounded-full"
                />
              </div>
            </div>

            {/* Instructions Card */}
            <motion.div
              className="mt-6 bg-portfolio-black/60 backdrop-blur-sm rounded-lg p-4 border border-portfolio-gray-lighter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-portfolio-cyan" />
                <h4 className="text-portfolio-cyan font-semibold">How to Interact</h4>
              </div>
              <p className="text-portfolio-text-muted text-sm">
                Use the control panel in the bottom-left corner to trigger different animations. 
                The robot will respond with smooth, engaging movements that showcase advanced 3D web technology.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-portfolio-cyan/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default InteractiveRobotDemo;