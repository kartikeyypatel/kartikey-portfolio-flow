
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import locales from '../locales/en.json';
import { Typewriter } from './ui/typewriter-text';
import { ResumeButton } from './ui/ResumeButton';
import { ResumeModal } from './ui/ResumeModal';

const names = [
  'Kartikey Patel',
  '卡蒂克帕特尔',
  'कार्तिकेय पटेल',
  'كارتيكي باتل',
  'Картикей Патель',
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { number: '01', label: locales.header.nav.home, href: '#home' },
    { number: '02', label: 'About', href: '#about' },
    { number: '03', label: locales.header.nav.skills, href: '#skills' },
    { number: '04', label: locales.header.nav.projects, href: '#projects' },
    { number: '05', label: 'Education', href: '#education' },
    { number: '06', label: locales.header.nav.experience, href: '#experience' },
    { number: '07', label: locales.header.nav.contact, href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    window.requestAnimationFrame(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    });
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled 
          ? 'bg-[#070a0a]/85 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <button
          type="button"
          onClick={() => scrollToSection('#home')}
          className="flex min-w-[11rem] items-center font-mono text-lg font-semibold tracking-[0.035em] text-portfolio-text sm:min-w-[14rem] sm:text-xl xl:min-w-[15rem] xl:text-2xl"
          aria-label="Go to home"
        >
          <Typewriter
            text={names}
            speed={90}
            loop
            deleteSpeed={45}
            delay={1600}
            cursor=""
          />
          <span className="text-portfolio-cyan">.</span>
        </button>

        {/* Navigation */}
        <nav className="hidden xl:flex justify-center" aria-label="Primary navigation">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => scrollToSection(item.href)}
                  className="group flex items-center gap-1.5 rounded-[10px] px-2.5 py-2 text-[11px] text-portfolio-text-muted transition-colors hover:bg-white/[0.04] hover:text-portfolio-text 2xl:px-3 2xl:text-[12px]"
                >
                  <span className="font-mono text-[9px] text-portfolio-cyan">
                    {item.number}
                  </span>
                  <span className="font-medium capitalize">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Resume Button */}
        <div className="hidden xl:flex items-center justify-end">
          <ResumeButton onClick={() => setIsResumeModalOpen(true)} />
        </div>

        {/* Mobile navigation trigger */}
        <div className="xl:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center border border-white/15 bg-black/70 text-portfolio-text"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-[#080a0b]/95 px-4 py-4 backdrop-blur-xl xl:hidden" aria-label="Mobile navigation">
          <ul className="grid gap-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => scrollToSection(item.href)}
                  className="flex min-h-12 w-full items-center gap-4 px-3 text-left text-portfolio-text hover:bg-white/5 hover:text-portfolio-cyan"
                >
                  <span className="font-mono text-xs text-portfolio-cyan">{item.number}</span>
                  <span className="text-base capitalize">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Resume Modal */}
      <ResumeModal 
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </motion.header>
  );
};

export default Header;
