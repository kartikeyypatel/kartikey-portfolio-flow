'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import SphereImageGrid, { type ImageData } from '@/components/ui/img-sphere';
import locales from '../locales/en.json';

const icon = (name: string, variant = 'original') =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-${variant}.svg`;

const TECHNOLOGIES: ImageData[] = [
  ['typescript', 'TypeScript', 'Primary language for reliable frontend and Node.js applications.'],
  ['javascript', 'JavaScript', 'Modern ES6+ web and server development.'],
  ['react', 'React', 'Component-driven interfaces and interactive product experiences.'],
  ['nextjs', 'Next.js', 'Production React applications with server rendering and routing.'],
  ['nodejs', 'Node.js', 'APIs, services, data pipelines, and asynchronous workflows.'],
  ['python', 'Python', 'Backend services, automation, analytics, and machine learning.'],
  ['java', 'Java', 'Enterprise services and strongly typed backend systems.'],
  ['spring', 'Spring Boot', 'Scalable Java microservices and REST APIs.'],
  ['go', 'Go', 'Efficient services, infrastructure tooling, and automation.'],
  ['csharp', 'C#', '.NET applications and backend development.'],
  ['angularjs', 'Angular', 'Structured enterprise frontend applications.'],
  ['django:plain', 'Django', 'Secure Python web applications and APIs.'],
  ['flask', 'Flask', 'Lightweight Python services and prototypes.'],
  ['tailwindcss', 'Tailwind CSS', 'Consistent responsive design systems.'],
  ['postgresql', 'PostgreSQL', 'Relational modeling, optimization, and production data.'],
  ['mysql', 'MySQL', 'Relational application databases.'],
  ['mongodb', 'MongoDB', 'Document-oriented application storage.'],
  ['redis', 'Redis', 'Caching, queues, and fast ephemeral state.'],
  ['docker', 'Docker', 'Repeatable application packaging and deployment.'],
  ['kubernetes', 'Kubernetes', 'Container orchestration and scalable workloads.'],
  ['amazonwebservices', 'AWS', 'Cloud infrastructure, compute, storage, and managed services.'],
  ['azure', 'Azure', 'Cloud applications, data services, and deployment workflows.'],
  ['googlecloud', 'Google Cloud', 'Cloud-native services and application infrastructure.'],
  ['terraform', 'Terraform', 'Versioned infrastructure as code.'],
  ['apachekafka', 'Apache Kafka', 'Event-driven systems and streaming data pipelines.'],
  ['git', 'Git', 'Version control and collaborative delivery workflows.'],
  ['githubactions', 'GitHub Actions', 'Automated testing and deployment pipelines.'],
  ['pytorch', 'PyTorch', 'Machine learning experimentation and model development.'],
  ['tensorflow', 'TensorFlow', 'Machine learning systems and applied modeling.'],
  ['elasticsearch', 'Elasticsearch', 'Search, indexing, and operational analytics.'],
].map(([iconConfig, title, description], index) => {
  const [slug, configuredVariant] = iconConfig.split(':');
  return {
  id: `technology-${index + 1}`,
  src: icon(slug, configuredVariant ?? (slug === 'amazonwebservices' ? 'plain-wordmark' : 'original')),
  alt: `${title} logo`,
  title,
  description,
  };
});

const SKILL_DIVISIONS = {
  Frontend: ['TypeScript', 'JavaScript', 'React', 'Next.js', 'Angular', 'Tailwind CSS'],
  Backend: ['Node.js', 'Python', 'Java', 'Spring Boot', 'Go', 'C#', 'Django', 'Flask'],
  Cloud: ['AWS', 'Azure', 'Google Cloud', 'Terraform', 'Docker', 'Kubernetes'],
  Data: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Apache Kafka', 'Elasticsearch'],
  'AI/ML': ['Python', 'PyTorch', 'TensorFlow'],
  DevOps: ['Docker', 'Kubernetes', 'Terraform', 'Git', 'GitHub Actions', 'Apache Kafka'],
} as const;

const SkillsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [sphereSize, setSphereSize] = useState(360);
  const [isMobile, setIsMobile] = useState(false);
  const [activeDivision, setActiveDivision] = useState<string>('All');

  const highlightedImageIds = activeDivision === 'All'
    ? []
    : TECHNOLOGIES
        .filter((technology) => (SKILL_DIVISIONS[activeDivision as keyof typeof SKILL_DIVISIONS] as readonly string[]).includes(technology.title ?? ''))
        .map((technology) => technology.id);

  useEffect(() => {
    const resize = () => {
      setSphereSize(Math.min(620, Math.max(280, window.innerWidth - 32)));
      setIsMobile(window.innerWidth < 768);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <section id="skills" className="section-padding relative overflow-hidden" ref={sectionRef}>
      <div className="container-custom relative z-10">
        <motion.div
          className="mx-auto mb-8 max-w-2xl text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-portfolio-cyan">
            Drag to explore &middot; Hover to identify
          </p>
          <h2 className="mb-4 text-5xl font-bold text-portfolio-text md:text-6xl">
            {locales.skills.title}
          </h2>
          <p className="text-lg text-portfolio-text-muted">{locales.skills.subtitle}</p>
        </motion.div>

        <motion.div
          className="relative mx-auto flex justify-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.8, delay: 0.12 }}
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-portfolio-cyan/[0.035] blur-[90px]" />
          <SphereImageGrid
            images={TECHNOLOGIES}
            containerSize={sphereSize}
            sphereRadius={sphereSize * 0.32}
            baseImageScale={sphereSize < 430 ? 0.12 : 0.105}
            dragSensitivity={0.42}
            momentumDecay={0.94}
            maxRotationSpeed={4}
            hoverScale={1.16}
            perspective={1100}
            autoRotate={!isMobile}
            autoRotateSpeed={0.075}
            highlightedImageIds={highlightedImageIds}
          />
        </motion.div>

        <div className="mx-auto mt-8 max-w-4xl border-t border-white/[0.08] pt-6" aria-label="Technology discipline filters">
          <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-portfolio-text-muted">
            Filter by discipline
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {['All', ...Object.keys(SKILL_DIVISIONS)].map((division) => (
              <button
                type="button"
                key={division}
                onClick={() => setActiveDivision(division)}
                aria-pressed={activeDivision === division}
                className={`min-h-11 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${activeDivision === division ? 'border-portfolio-cyan/60 bg-portfolio-cyan/[0.12] text-portfolio-cyan' : 'border-white/[0.1] bg-[#0d1213]/80 text-portfolio-text-muted hover:border-white/20 hover:text-portfolio-text'}`}
              >
                {division}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
