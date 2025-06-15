
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Linkedin, Github, Twitter, Facebook } from 'lucide-react';
import locales from '../locales/en.json';
import { Boxes } from './ui/background-boxes';

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="contact" className="section-padding bg-portfolio-black relative overflow-hidden" ref={ref}>
      <Boxes />
      <div className="absolute inset-0 w-full h-full bg-portfolio-black z-10 [mask-image:radial-gradient(transparent_30%,white)] pointer-events-none" />
      <div className="container-custom relative z-20 pointer-events-none">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            className="text-portfolio-cyan font-mono text-lg mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {locales.contact.subtitle}
          </motion.p>

          <motion.h2
            className="text-5xl md:text-6xl font-bold text-portfolio-text mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {locales.contact.title}
          </motion.h2>

          <motion.p
            className="text-xl text-portfolio-text-muted leading-relaxed mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {locales.contact.description}
          </motion.p>

          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Say Hello Button */}
            <motion.a
              href="mailto:kartikey.patel@example.com"
              className="inline-flex items-center space-x-3 bg-transparent border-2 border-portfolio-cyan text-portfolio-cyan hover:bg-portfolio-cyan hover:text-portfolio-black px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 group pointer-events-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{locales.contact.sayHello}</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.a>

            {/* Social Links */}
            <motion.div
              className="flex justify-center space-x-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.a
                href="https://linkedin.com/in/kartikey-patel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-portfolio-text-muted hover:text-portfolio-cyan transition-colors duration-200 pointer-events-auto"
                whileHover={{ y: -2 }}
              >
                <span className="sr-only">{locales.contact.social.linkedin}</span>
                <Linkedin className="h-6 w-6" />
              </motion.a>

              <motion.a
                href="https://github.com/kartikey-patel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-portfolio-text-muted hover:text-portfolio-cyan transition-colors duration-200 pointer-events-auto"
                whileHover={{ y: -2 }}
              >
                <span className="sr-only">{locales.contact.social.github}</span>
                <Github className="h-6 w-6" />
              </motion.a>

              <motion.a
                href="https://twitter.com/kartikey_patel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-portfolio-text-muted hover:text-portfolio-cyan transition-colors duration-200 pointer-events-auto"
                whileHover={{ y: -2 }}
              >
                <span className="sr-only">{locales.contact.social.twitter}</span>
                <Twitter className="h-6 w-6" />
              </motion.a>

              <motion.a
                href="https://facebook.com/kartikey.patel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-portfolio-text-muted hover:text-portfolio-cyan transition-colors duration-200 pointer-events-auto"
                whileHover={{ y: -2 }}
              >
                <span className="sr-only">{locales.contact.social.facebook}</span>
                <Facebook className="h-6 w-6" />
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-20 pt-8 border-t border-portfolio-gray-lighter"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <p className="text-portfolio-text-muted">
            © 2024 Kartikey Patel. Built with React & Framer Motion.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
