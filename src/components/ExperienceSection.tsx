'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import locales from '../locales/en.json';

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  summary: string;
  skills: string[];
  logo: string;
  cropLogo?: boolean;
}

const ExperienceSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [openItem, setOpenItem] = useState<string | null>(null);

  const experiences: Experience[] = [
    {
      id: '1',
      title: 'Data Analyst',
      company: 'Harlem Children\'s Zone',
      period: 'Jan 2026 - Present',
      description: 'Architected high-volume data pipelines using Node.js and Azure Data Fabric, cutting event processing latency by 40% while improving cross-functional team collaboration. Designed scalable frontend frameworks with React and Next.js, elevating UI performance metrics by 35% and enabling real-time dashboard analytics for senior stakeholders. Mentored junior engineering teams, raising technical standards and boosting throughput by 30%. Built reliable asynchronous workflows with BullMQ, sustaining 100% uptime for mission-critical processes, and optimized NoSQL queries for a 25% increase in retrieval speeds.',
      summary: 'Built high-volume data and frontend systems that reduced processing latency by 40%, improved UI performance by 35%, and increased team throughput by 30%.',
      skills: ['Node.js', 'Azure Data Fabric', 'React', 'Next.js', 'BullMQ', 'NoSQL'],
      logo: '/uploads/harlem-childrens-zone-logo.svg'
    },
    {
      id: '2',
      title: 'Software Engineer',
      company: 'Capital One',
      period: 'Jul 2025 - Jan 2026',
      description: 'Engineered high-performance backend microservices using Node.js and NestJS, scaling distributed platforms to support over 2M client transactions daily. Orchestrated resilient, event-driven CI/CD pipelines deploying to Azure App Services, cutting deployment times by 50%. Built server-side rendering components and state management patterns that reduced frontend latency by 40%, and integrated scalable REST APIs to boost application throughput by 35%. Resolved production incidents under pressure, sustaining 99% reliability.',
      summary: 'Scaled backend services to support 2M+ daily transactions while cutting deployment time by 50% and sustaining 99% platform reliability.',
      skills: ['Node.js', 'NestJS', 'Azure App Services', 'CI/CD', 'REST APIs'],
      logo: '/uploads/capital-one-logo.svg'
    },
    {
      id: '3',
      title: 'Information Technology Intern',
      company: 'PSE&G',
      period: 'May 2024 - Aug. 2024',
      description: 'Fortified mission-critical cloud infrastructure across complex Linux environments, remediating 95% of system anomalies and resolving Azure service faults with precision. Analyzed large-scale messaging queue architectures to support technical teams, cutting deployment risks by 40% while translating business needs into clean technical outcomes. Advanced distributed system workflows using TypeORM and complex SQL queries, validating massive datasets to ensure 100% event integrity across SQL platforms.',
      summary: 'Strengthened cloud infrastructure by remediating 95% of system anomalies, reducing deployment risk by 40%, and maintaining 100% event integrity.',
      skills: ['Azure', 'Linux', 'Messaging Queues', 'TypeORM', 'SQL'],
      logo: '/uploads/f4e6c158-e728-46fd-88f4-7f764885e7b7.png'
    },
    {
      id: '4',
      title: 'Software Engineer',
      company: 'Epsilon',
      period: 'Apr 2020 - May 2023',
      description: 'Spearheaded the complete software development lifecycle for scalable real-time systems, improving platform performance by 25% and reducing latency by 30%. Partnered with cross-functional stakeholders to deliver 10+ distributed solutions on schedule, aligning closely with core architectural decisions and enterprise objectives. Streamlined event-driven infrastructure pipelines, cutting manual service configuration effort by 40%, and optimized Kafka streaming data processes for 20% faster query execution and message flow.',
      summary: 'Delivered 10+ real-time distributed solutions, improving platform performance by 25%, reducing latency by 30%, and cutting manual configuration effort by 40%.',
      skills: ['Distributed Systems', 'Event-Driven Architecture', 'Kafka'],
      logo: '/uploads/epsilon-logo.png',
      cropLogo: true,
    },
    {
      id: '5',
      title: 'Software Developer Intern',
      company: 'CRISIL Limited',
      period: 'Jun. 2019 - Jul. 2019',
      description: 'Created a chatbot using IBM Watson, integrating Java and JavaScript APIs with IBM Cloud services to deliver context-aware responses, resulting in a 35% increase in customer satisfaction.',
      summary: 'Built an IBM Watson chatbot across Java, JavaScript, and IBM Cloud services that increased customer satisfaction by 35%.',
      skills: ['Chatbot', 'IBM Watson', 'Java API', 'IBM Cloud'],
      logo: '/uploads/dd039a77-d180-4eb1-8feb-227df0fd9c8b.png',
      cropLogo: true,
    }
  ];

  const toggleItem = (id: string) => {
    setOpenItem(prev => 
      prev === id
        ? null
        : id
    );
  };

  return (
    <motion.section
      id="experience"
      className="section-padding relative"
      ref={ref}
    >
      <div className="container-custom relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-portfolio-text mb-4">
            {locales.experience.title}
          </h2>
          <p className="text-xl text-portfolio-text-muted">
            {locales.experience.subtitle}
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto space-y-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              className={`overflow-hidden rounded-2xl border bg-[#0d1213]/92 shadow-[inset_0_1px_0_rgba(226,250,250,0.045),0_16px_45px_rgba(0,0,0,0.2)] transition-colors ${openItem === experience.id ? 'border-portfolio-cyan/35' : 'border-white/[0.09] hover:border-white/[0.16]'}`}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => toggleItem(experience.id)}
                className="flex min-h-[104px] w-full items-center justify-between gap-5 bg-white/[0.018] p-5 text-left transition-colors hover:bg-white/[0.035] sm:p-6"
                aria-expanded={openItem === experience.id}
                aria-controls={`experience-panel-${experience.id}`}
              >
                <div className="flex min-w-0 items-start gap-4 sm:gap-5">
                  <span className="mt-1 font-mono text-[10px] tracking-[0.12em] text-portfolio-cyan">0{index + 1}</span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-portfolio-text sm:text-xl">
                      {experience.title}
                    </h3>
                    <p className="mt-1 text-sm text-portfolio-text-muted sm:text-base">
                      {experience.company} • {experience.period}
                    </p>
                  </div>
                </div>
                
                <motion.div
                  animate={{ rotate: openItem === experience.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.09] text-portfolio-cyan"
                >
                  <ChevronDown className="h-5 w-5" />
                </motion.div>
              </button>

              {/* Accordion Content */}
              <motion.div
                id={`experience-panel-${experience.id}`}
                initial={false}
                animate={{
                  height: openItem === experience.id ? 'auto' : 0,
                  opacity: openItem === experience.id ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden bg-black/20"
              >
                <div className="border-t border-white/[0.07] p-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_180px]">
                    {/* Description */}
                    <div>
                      <p className="mb-6 max-w-3xl text-[15px] leading-7 text-portfolio-text-muted">
                        {experience.summary}
                      </p>
                      
                      {/* Skills */}
                      <div className="flex flex-wrap gap-2">
                        {experience.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md border border-portfolio-cyan/20 bg-portfolio-cyan/[0.065] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.04em] text-portfolio-cyan"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Company Logo */}
                    <div className="flex items-center justify-center lg:justify-end">
                      <div className="flex aspect-[2/1] w-full max-w-[180px] items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-[#f4f6f5] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                        <img
                          src={experience.logo}
                          alt={`${experience.company} logo`}
                          className={`h-full w-full ${experience.cropLogo ? 'scale-[1.08] object-cover' : 'object-contain'}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ExperienceSection;
