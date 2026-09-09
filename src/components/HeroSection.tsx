'use client';

import React, { Suspense, useEffect, useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { Typewriter } from './ui/typewriter-text';
import { PlaceholdersAndVanishInput } from './ui/placeholders-and-vanish-input';
import { ResumeModal } from './ui/ResumeModal';
import ChatModal from './ui/ChatModal';

const SplineScene = React.lazy(() =>
  import('./ui/spline').then((module) => ({ default: module.SplineScene }))
);

const roles = ['full-stack software engineer', 'software engineer', 'frontend developer', 'backend developer'];

const chatPlaceholders = [
  'Ask about my experience with React and TypeScript...',
  'What projects has Kartikey worked on recently?',
  'Tell me about his technical skills and expertise...',
  'How can I get in touch with Kartikey?',
  'What makes him a great software engineer?',
];

const markAssistantReady = () => {
  const portfolioWindow = window as Window & { __portfolioAssistantReady?: boolean };
  if (portfolioWindow.__portfolioAssistantReady) return;
  portfolioWindow.__portfolioAssistantReady = true;
  window.dispatchEvent(new Event('portfolio-assistant-ready'));
};

const HeroSection = () => {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [initialChatMessage, setInitialChatMessage] = useState<string>();
  const [loadSpline, setLoadSpline] = useState(false);
  const [splineTimedOut, setSplineTimedOut] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [compactLayout, setCompactLayout] = useState(() => window.innerWidth < 1024);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const scheduleLoad = () => {
      setCompactLayout(!desktop.matches);
      setSplineTimedOut(false);
      setSplineLoaded(false);
      setLoadSpline(false);
      return window.setTimeout(() => setLoadSpline(true), desktop.matches ? 350 : 0);
    };
    let timer = scheduleLoad();
    const reevaluate = () => {
      if (timer) window.clearTimeout(timer);
      timer = scheduleLoad();
    };
    desktop.addEventListener('change', reevaluate);
    return () => {
      if (timer) window.clearTimeout(timer);
      desktop.removeEventListener('change', reevaluate);
    };
  }, []);

  useEffect(() => {
    if (!loadSpline || splineLoaded) return;
    const timeout = window.setTimeout(() => {
      setSplineTimedOut(true);
      markAssistantReady();
    }, 25000);
    return () => window.clearTimeout(timeout);
  }, [loadSpline, splineLoaded]);

  const handleSplineLoad = () => {
    setSplineLoaded(true);
    setSplineTimedOut(false);
    markAssistantReady();
  };

  const scrollTo = (selector: string) => {
    window.requestAnimationFrame(() => {
      document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const handleChatSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = event.currentTarget.querySelector<HTMLInputElement>('input[type="text"]');
    setInitialChatMessage(input?.value.trim() || undefined);
    setIsChatModalOpen(true);
  };

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(1,3,3,0.76)_0%,rgba(2,5,5,0.64)_68%,rgba(7,10,10,0.2)_100%)]"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto grid min-h-screen max-w-[1400px] items-center px-5 pb-20 pt-24 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(440px,0.8fr)] lg:gap-10 lg:px-10 xl:gap-16 xl:px-12">
          <div className="min-w-0 max-w-3xl">
            <div className="mb-6 flex w-fit max-w-full items-start gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.055] px-3 py-2 font-mono text-[9px] uppercase leading-4 tracking-[0.09em] text-emerald-300 sm:items-center sm:rounded-full sm:py-1.5">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 sm:mt-0" aria-hidden="true" />
              <span className="min-w-0">Based in New York · Hybrid + remote</span>
            </div>

            <h1 className="font-['Fraunces'] text-[clamp(3.15rem,8.2vw,7.15rem)] font-medium leading-[0.92] tracking-[-0.045em] text-portfolio-text">
              Kartikey
              <br />
              Patel<span className="text-portfolio-cyan">.</span>
            </h1>

            <p className="mt-7 w-full max-w-2xl break-words font-sans text-[15px] font-normal normal-case tracking-normal leading-7 text-portfolio-text-muted sm:text-base">
              I&apos;m a{' '}
              <span className="mt-1 flex min-w-0 items-baseline font-semibold text-portfolio-cyan sm:mt-0 sm:inline-flex sm:min-w-[17.5rem]">
                <span className="mr-1 font-mono text-[0.8em] font-medium" aria-hidden="true">&gt;</span>
                <Typewriter
                  text={roles}
                  speed={58}
                  deleteSpeed={32}
                  delay={1700}
                  loop
                  cursor="_"
                  className="whitespace-nowrap"
                />
              </span>{' '}
              building reliable digital products with React, Spring Boot, and AWS. I turn complex requirements into scalable systems and thoughtful user experiences.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => scrollTo('#projects')}
                className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-[10px] border border-portfolio-cyan bg-portfolio-cyan px-6 text-sm font-semibold text-black transition-transform hover:-translate-y-px sm:w-auto"
              >
                View my work <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsResumeModalOpen(true)}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-[10px] border border-white/15 bg-black/25 px-6 text-sm font-semibold text-portfolio-text backdrop-blur-md transition-colors hover:border-portfolio-cyan/50 hover:bg-portfolio-cyan/[0.06] sm:w-auto"
              >
                View résumé
              </button>
              <button
                type="button"
                onClick={() => scrollTo('#contact')}
                className="hidden min-h-12 items-center px-3 text-sm font-medium text-portfolio-text-muted underline decoration-white/20 underline-offset-4 transition-colors hover:text-portfolio-text lg:inline-flex"
              >
                Connect
              </button>
            </div>

            {compactLayout && <div className="relative mx-auto mt-10 max-w-sm">
              <div className="relative h-[430px] w-full overflow-visible">
                {loadSpline && !splineTimedOut ? (
                  <Suspense fallback={<div className="h-full w-full" />}>
                    <SplineScene
                      scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                      className="absolute -left-[8%] top-0 !h-full !w-[116%]"
                      onLoad={handleSplineLoad}
                      pauseAfterLoad
                    />
                  </Suspense>
                ) : splineTimedOut ? (
                  <img
                    src="/portfolio-assistant-mobile.jpg"
                    alt="Kartikey's portfolio AI assistant"
                    width="480"
                    height="408"
                    loading="eager"
                    decoding="async"
                    onLoad={markAssistantReady}
                    onError={markAssistantReady}
                    className="h-full w-full object-contain"
                  />
                ) : null}
              </div>
              <div className="relative -mt-10 rounded-2xl border border-white/10 bg-black/80 p-2 shadow-2xl">
                <p className="mb-2 text-center font-mono text-[9px] uppercase tracking-[0.12em] text-portfolio-text-muted">Ask the portfolio assistant</p>
                <PlaceholdersAndVanishInput placeholders={chatPlaceholders} onChange={() => undefined} onSubmit={handleChatSubmit} />
              </div>
            </div>}
          </div>

          {!compactLayout && <div className="relative h-[min(78vh,720px)] min-h-[590px] w-full self-center overflow-visible">
            <div className="absolute inset-x-[8%] inset-y-[5%] rounded-full bg-black/25 blur-3xl" />
            {loadSpline && !splineTimedOut ? (
              <Suspense fallback={<div className="h-full w-full" />}>
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="absolute -left-[10%] top-0 !h-full !w-[120%] -translate-y-4 xl:-left-[12%] xl:!w-[124%] xl:-translate-y-5"
                  onLoad={handleSplineLoad}
                />
              </Suspense>
            ) : splineTimedOut ? (
              <img
                src="/portfolio-assistant-mobile.jpg"
                alt=""
                width="480"
                height="408"
                loading="eager"
                decoding="async"
                onLoad={markAssistantReady}
                onError={markAssistantReady}
                className="absolute left-1/2 top-1/2 h-auto w-[88%] -translate-x-1/2 -translate-y-1/2 object-contain"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <div className="h-10 w-10 animate-spin rounded-full border border-white/10 border-t-portfolio-cyan" />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 z-20 mx-auto max-w-[560px] px-3 xl:px-0">
              <p className="mb-3 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-portfolio-text-muted">
                Ask the portfolio assistant
              </p>
              <div className="rounded-2xl border border-white/10 bg-black/55 p-2 shadow-2xl backdrop-blur-xl">
                <PlaceholdersAndVanishInput
                  placeholders={chatPlaceholders}
                  onChange={() => undefined}
                  onSubmit={handleChatSubmit}
                />
              </div>
            </div>
          </div>}
        </div>

      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => {
          setIsChatModalOpen(false);
          setInitialChatMessage(undefined);
        }}
        initialMessage={initialChatMessage}
      />
    </section>
  );
};

export default HeroSection;
