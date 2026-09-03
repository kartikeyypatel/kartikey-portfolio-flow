'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const AboutSection = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" ref={ref} className="section-padding relative">
      <motion.div
        className="container-custom grid gap-8 lg:grid-cols-[0.6fr_1fr] lg:items-start"
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-portfolio-cyan">About</p>
          <h2 className="mt-4">Engineering with intent</h2>
        </div>
        <div className="border-l border-white/[0.1] pl-6 sm:pl-8">
          <p className="text-lg leading-8 text-portfolio-text sm:text-xl">
            I build full-stack products where dependable systems and thoughtful interfaces matter equally.
          </p>
          <p className="mt-5 max-w-3xl text-[15px] leading-7 text-portfolio-text-muted">
            My work spans React applications, Java and Node.js services, cloud infrastructure, data platforms, and retrieval-based AI. I enjoy translating ambiguous requirements into maintainable software, improving performance, and making complex workflows easier for people to use.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
