
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code, Cpu, Cloud } from 'lucide-react';
import locales from '../locales/en.json';

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const skillCategories = [
    {
      icon: Code,
      title: locales.skills.categories.programming.title,
      skills: locales.skills.categories.programming.skills,
    },
    {
      icon: Cpu,
      title: locales.skills.categories.frameworks.title,
      skills: locales.skills.categories.frameworks.skills,
    },
    {
      icon: Cloud,
      title: locales.skills.categories.technologies.title,
      skills: locales.skills.categories.technologies.skills,
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-skills-pattern bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-portfolio-black/90"></div>
      </div>

      <div className="container-custom relative z-10" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-portfolio-text mb-4">
            {locales.skills.title}
          </h2>
          <p className="text-xl text-portfolio-text-muted">
            {locales.skills.subtitle}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              variants={cardVariants}
              className="group relative bg-portfolio-gray/50 backdrop-blur-sm rounded-2xl p-8 border border-portfolio-gray-lighter hover:border-portfolio-cyan transition-all duration-300 hover:shadow-lg hover:shadow-portfolio-cyan/10"
              whileHover={{ y: -5 }}
            >
              <div className="mb-6">
                <category.icon className="h-12 w-12 text-portfolio-cyan group-hover:scale-110 transition-transform duration-300" />
              </div>
              
              <h3 className="text-xl font-semibold text-portfolio-text mb-6 group-hover:text-portfolio-cyan transition-colors duration-300">
                {category.title}
              </h3>
              
              <ul className="space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <motion.li
                    key={skill}
                    className="flex items-center text-portfolio-text-muted group-hover:text-portfolio-text transition-colors duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.2 + skillIndex * 0.1 }}
                  >
                    <span className="text-portfolio-cyan mr-3 font-mono">▹</span>
                    {skill}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
