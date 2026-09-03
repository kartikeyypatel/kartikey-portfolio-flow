'use client';

import React, { Suspense, useEffect } from 'react';
import Header from '../components/Header';
import SiteBackground from '../components/ui/site-background';

// Lazy load all the sections
const HeroSection = React.lazy(() => import('../components/HeroSection'));
const AboutSection = React.lazy(() => import('../components/AboutSection'));
const SkillsSection = React.lazy(() => import('../components/SkillsSection'));
const ProjectsSection = React.lazy(() => import('../components/ProjectsSection'));
const EducationSection = React.lazy(() => import('../components/EducationSection'));
const ExperienceSection = React.lazy(() => import('../components/ExperienceSection'));
const ContactSection = React.lazy(() => import('../components/ContactSection'));

const SectionLoader = () => (
  <div className="w-full py-20 bg-portfolio-black flex items-center justify-center">
    <div className="animate-pulse">
      <div className="h-8 bg-portfolio-gray-lighter rounded w-64 mb-4"></div>
      <div className="h-4 bg-portfolio-gray-lighter rounded w-48"></div>
    </div>
  </div>
);

const Index = () => {
  useEffect(() => {
    // Smooth scrolling polyfill for older browsers
    if (typeof window !== 'undefined') {
      import('smoothscroll-polyfill').then(smoothscroll => {
        smoothscroll.polyfill();
      });
    }
  }, []);

  return (
    <div className="portfolio-editorial relative bg-portfolio-black">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <SiteBackground />
      <Header />
      <main id="main-content" className="relative z-10">
        <Suspense fallback={<SectionLoader />}>
          <HeroSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <SkillsSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <ProjectsSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <EducationSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <ExperienceSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <ContactSection />
        </Suspense>
      </main>
    </div>
  );
};

export default Index;
