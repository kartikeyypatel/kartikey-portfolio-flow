'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Header from '../components/Header';
import SiteBackground from '../components/ui/site-background';

// Start loading the application sections immediately and reuse the same
// promises for React.lazy and the boot-progress calculation.
const sectionModules = {
  hero: import('../components/HeroSection'),
  about: import('../components/AboutSection'),
  skills: import('../components/SkillsSection'),
  projects: import('../components/ProjectsSection'),
  education: import('../components/EducationSection'),
  experience: import('../components/ExperienceSection'),
  contact: import('../components/ContactSection'),
};

const HeroSection = React.lazy(() => sectionModules.hero);
const AboutSection = React.lazy(() => sectionModules.about);
const SkillsSection = React.lazy(() => sectionModules.skills);
const ProjectsSection = React.lazy(() => sectionModules.projects);
const EducationSection = React.lazy(() => sectionModules.education);
const ExperienceSection = React.lazy(() => sectionModules.experience);
const ContactSection = React.lazy(() => sectionModules.contact);

const SectionLoader = () => (
  <div className="w-full py-20 bg-portfolio-black flex items-center justify-center">
    <div className="animate-pulse">
      <div className="h-8 bg-portfolio-gray-lighter rounded w-64 mb-4"></div>
      <div className="h-4 bg-portfolio-gray-lighter rounded w-48"></div>
    </div>
  </div>
);

const BootLoader = ({ progress, leaving }: { progress: number; leaving: boolean }) => (
  <div
    className={`fixed inset-0 z-[2000] flex min-h-[100dvh] items-center justify-center bg-[#050707] px-6 transition-opacity duration-500 ${leaving ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
    role="status"
    aria-live="polite"
    aria-label={`Loading portfolio, ${progress}%`}
  >
    <div className="w-full max-w-md">
      <div className="mb-7 flex items-end justify-between gap-6">
        <div>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-portfolio-cyan">Initializing portfolio</p>
          <p className="font-['Fraunces'] text-4xl font-medium leading-none tracking-[-0.04em] text-portfolio-text sm:text-5xl">
            Kartikey Patel<span className="text-portfolio-cyan">.</span>
          </p>
        </div>
        <span className="font-mono text-xl tabular-nums text-portfolio-text" aria-hidden="true">{progress}%</span>
      </div>
      <div className="h-px w-full overflow-hidden bg-white/10">
        <div
          className="h-full bg-portfolio-cyan transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-portfolio-text-muted">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-portfolio-cyan" />
        Loading interface and typography
      </div>
    </div>
  </div>
);

const Index = () => {
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLeaving, setBootLeaving] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const bundleTasks = Object.values(sectionModules);
    const fontsTask = document.fonts?.ready ?? Promise.resolve();
    const pageTask = document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }));
    const portfolioWindow = window as Window & { __portfolioAssistantReady?: boolean };
    const assistantTask = portfolioWindow.__portfolioAssistantReady
      ? Promise.resolve()
      : new Promise<void>((resolve) => window.addEventListener('portfolio-assistant-ready', () => resolve(), { once: true }));
    const tasks: Promise<unknown>[] = [...bundleTasks, fontsTask, pageTask, assistantTask];
    let completed = 0;

    setBootProgress(4);
    tasks.forEach((task) => {
      Promise.resolve(task).finally(() => {
        if (cancelled) return;
        completed += 1;
        setBootProgress(Math.min(94, Math.round((completed / tasks.length) * 90) + 4));
      });
    });

    Promise.allSettled(tasks).then(() => {
      if (cancelled) return;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (cancelled) return;
        setBootProgress(100);
        window.setTimeout(() => {
          if (cancelled) return;
          setBootLeaving(true);
          window.setTimeout(() => {
            if (cancelled) return;
            document.body.style.overflow = previousOverflow;
            setBootComplete(true);
          }, 500);
        }, 180);
      }));
    });

    return () => {
      cancelled = true;
      document.body.style.overflow = previousOverflow;
    };
  }, []);

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
      {!bootComplete && <BootLoader progress={bootProgress} leaving={bootLeaving} />}
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
