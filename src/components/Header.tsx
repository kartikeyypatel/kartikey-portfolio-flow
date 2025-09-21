
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import locales from '../locales/en.json';
import { Typewriter } from './ui/typewriter-text';
import { ResumeButton } from './ui/ResumeButton';
import { ResumeModal } from './ui/ResumeModal';

const names = [
  "KartikeyPatel",    // English
  "卡蒂克帕特尔", // Mandarin Chinese
  "कार्तिकेयपटेल", // Hindi
  "كارتيكي باتل",    // Arabic
  "КартикейПатель"  // Russian
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { number: '01', label: locales.header.nav.home, href: '#home' },
    { number: '02', label: locales.header.nav.skills, href: '#skills' },
    { number: '03', label: locales.header.nav.projects, href: '#projects' },
    { number: '04', label: locales.header.nav.experience, href: '#experience' },
    { number: '05', label: locales.header.nav.contact, href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-portfolio-black/80 backdrop-blur-md border-b border-portfolio-gray-lighter' 
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <motion.div 
          className="flex items-center flex-1 lg:w-80 lg:flex-none"
          whileHover={{ scale: 1.05 }}
        >
          <h1 className="text-3xl font-bold text-portfolio-text flex items-baseline">
            <Typewriter
              text={names}
              speed={100}
              loop={true}
              deleteSpeed={50}
              delay={1500}
              cursor=""
            />
            <span className="text-portfolio-cyan">.</span>
            <span className="animate-blink text-portfolio-cyan">|</span>
          </h1>
        </motion.div>

        {/* Navigation */}
        <nav 
          className="hidden lg:flex justify-center"
          onMouseEnter={() => setIsNavHovered(true)}
          onMouseLeave={() => setIsNavHovered(false)}
        >
          <ul className="flex space-x-10">
            {navItems.map((item, index) => (
              <motion.li 
                key={item.label}
                className={`transition-all duration-300 ${
                  isNavHovered ? 'opacity-60 hover:opacity-100' : 'opacity-100'
                }`}
              >
                <button
                  onClick={() => scrollToSection(item.href)}
                  className="group flex flex-col items-center text-sm hover:text-portfolio-cyan transition-all duration-300 py-2 px-3 rounded-lg hover:bg-portfolio-cyan/10"
                >
                  <span className="text-xs text-portfolio-cyan font-mono mb-1 group-hover:text-white transition-colors duration-300">
                    {item.number}
                  </span>
                  <span className="font-medium group-hover:text-white transition-colors duration-300">{item.label}</span>
                </button>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Resume Button */}
        <div className="hidden lg:flex items-center justify-end lg:w-80">
          <ResumeButton onClick={() => setIsResumeModalOpen(true)} />
        </div>

        {/* Mobile menu placeholder */}
        <div className="lg:hidden">
          <Menu className="h-6 w-6 text-portfolio-text" />
        </div>
      </div>

      {/* Resume Modal */}
      <ResumeModal 
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </motion.header>
  );
};

export default Header;
