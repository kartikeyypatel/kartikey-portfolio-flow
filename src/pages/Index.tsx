'use client';

import React, { Suspense, useEffect } from 'react';
import Header from '../components/Header';

// Lazy load all the sections
const HeroSection = React.lazy(() => import('../components/HeroSection'));
const SkillsSection = React.lazy(() => import('../components/SkillsSection'));
const MyWorkSection = React.lazy(() => import('../components/MyWorkSection'));
const ProjectsSection = React.lazy(() => import('../components/ProjectsSection'));
const EducationSection = React.lazy(() => import('../components/EducationSection'));
const ExperienceSection = React.lazy(() => import('../components/ExperienceSection'));
const ContactSection = React.lazy(() => import('../components/ContactSection'));

const SectionLoader = () => (
  <div className="w-full py-20 bg-portfolio-black" />
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
    <div className="relative bg-portfolio-black">
      <Header />
      <main>
        <Suspense fallback={<SectionLoader />}>
          <HeroSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <SkillsSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <MyWorkSection />
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
