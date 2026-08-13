'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import locales from '../locales/en.json';

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
  logo: string;
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
      skills: ['Node.js', 'Azure Data Fabric', 'React', 'Next.js', 'BullMQ', 'NoSQL'],
      logo: '/lovable-uploads/harlem-childrens-zone-logo.svg'
    },
    {
      id: '2',
      title: 'Software Engineer',
      company: 'Capital One',
      period: 'Jul 2025 - Jan 2026',
      description: 'Engineered high-performance backend microservices using Node.js and NestJS, scaling distributed platforms to support over 2M client transactions daily. Orchestrated resilient, event-driven CI/CD pipelines deploying to Azure App Services, cutting deployment times by 50%. Built server-side rendering components and state management patterns that reduced frontend latency by 40%, and integrated scalable REST APIs to boost application throughput by 35%. Resolved production incidents under pressure, sustaining 99% reliability.',
      skills: ['Node.js', 'NestJS', 'Azure App Services', 'CI/CD', 'REST APIs'],
      logo: '/lovable-uploads/capital-one-logo.svg'
    },
    {
      id: '3',
      title: 'Information Technology Intern',
      company: 'PSE&G',
      period: 'May 2024 - Aug. 2024',
      description: 'Fortified mission-critical cloud infrastructure across complex Linux environments, remediating 95% of system anomalies and resolving Azure service faults with precision. Analyzed large-scale messaging queue architectures to support technical teams, cutting deployment risks by 40% while translating business needs into clean technical outcomes. Advanced distributed system workflows using TypeORM and complex SQL queries, validating massive datasets to ensure 100% event integrity across SQL platforms.',
      skills: ['Azure', 'Linux', 'Messaging Queues', 'TypeORM', 'SQL'],
      logo: '/lovable-uploads/f4e6c158-e728-46fd-88f4-7f764885e7b7.png'
    },
    {
      id: '4',
      title: 'Software Engineer',
      company: 'Epsilon',
      period: 'Apr 2020 - May 2023',
      description: 'Spearheaded the complete software development lifecycle for scalable real-time systems, improving platform performance by 25% and reducing latency by 30%. Partnered with cross-functional stakeholders to deliver 10+ distributed solutions on schedule, aligning closely with core architectural decisions and enterprise objectives. Streamlined event-driven infrastructure pipelines, cutting manual service configuration effort by 40%, and optimized Kafka streaming data processes for 20% faster query execution and message flow.',
      skills: ['Distributed Systems', 'Event-Driven Architecture', 'Kafka'],
      logo: '/lovable-uploads/epsilon-logo.png'
    },
    {
      id: '5',
      title: 'Software Developer Intern',
      company: 'CRISIL Limited',
      period: 'Jun. 2019 - Jul. 2019',
      description: 'Created a chatbot using IBM Watson, integrating Java and JavaScript APIs with IBM Cloud services to deliver context-aware responses, resulting in a 35% increase in customer satisfaction.',
      skills: ['Chatbot', 'IBM Watson', 'Java API', 'IBM Cloud'],
      logo: '/lovable-uploads/dd039a77-d180-4eb1-8feb-227df0fd9c8b.png'
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
      className="section-padding bg-portfolio-black relative"
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
              className="border border-portfolio-gray-lighter rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleItem(experience.id)}
                className="w-full bg-portfolio-cyan hover:bg-portfolio-cyan/90 transition-colors duration-200 p-6 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4 text-left">
                  <div>
                    <h3 className="text-xl font-semibold text-portfolio-black">
                      {experience.title}
                    </h3>
                    <p className="text-portfolio-black/80">
                      {experience.company} • {experience.period}
                    </p>
                  </div>
                </div>
                
                <motion.div
                  animate={{ rotate: openItem === experience.id ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-portfolio-black"
                >
                  {openItem === experience.id ? (
                    <Minus className="h-6 w-6" />
                  ) : (
                    <Plus className="h-6 w-6" />
                  )}
                </motion.div>
              </button>

              {/* Accordion Content */}
              <motion.div
                initial={false}
                animate={{
                  height: openItem === experience.id ? 'auto' : 0,
                  opacity: openItem === experience.id ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden bg-portfolio-gray/30"
              >
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Description */}
                    <div className="lg:col-span-3">
                      <p className="text-portfolio-text-muted leading-relaxed mb-6">
                        {experience.description}
                      </p>
                      
                      {/* Skills */}
                      <div className="flex flex-wrap gap-2">
                        {experience.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-portfolio-cyan text-portfolio-black text-sm rounded-full font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Company Logo */}
                    <div className="flex items-center justify-center lg:justify-end">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-portfolio-gray-lighter flex items-center justify-center p-2">
                        <img
                          src={experience.logo}
                          alt={`${experience.company} logo`}
                          className="max-w-full max-h-full object-contain"
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
