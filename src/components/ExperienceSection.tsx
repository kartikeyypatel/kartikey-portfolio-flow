
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
  const [openItems, setOpenItems] = useState<string[]>([]);

  const experiences: Experience[] = [
    {
      id: '1',
      title: 'Software Engineer',
      company: 'Tech Solutions Inc.',
      period: '2023 - Present',
      description: 'Leading development of scalable web applications using modern technologies. Responsible for architecture decisions, code reviews, and mentoring junior developers. Successfully delivered multiple high-impact projects improving system performance by 40%.',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'MongoDB'],
      logo: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
      id: '2',
      title: 'Full Stack Developer',
      company: 'Digital Innovations LLC',
      period: '2022 - 2023',
      description: 'Developed and maintained customer-facing applications serving 10,000+ users. Implemented CI/CD pipelines and automated testing processes. Collaborated with cross-functional teams to deliver features on time.',
      skills: ['Vue.js', 'Python', 'Django', 'PostgreSQL', 'Redis', 'Jenkins'],
      logo: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
      id: '3',
      title: 'Junior Developer',
      company: 'StartUp Ventures',
      period: '2021 - 2022',
      description: 'Built responsive web interfaces and RESTful APIs. Participated in agile development processes and contributed to technical documentation. Gained experience in modern development practices and tools.',
      skills: ['JavaScript', 'React', 'Express.js', 'MySQL', 'Git', 'JIRA'],
      logo: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    }
  ];

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section id="experience" className="section-padding bg-portfolio-gray/20" ref={ref}>
      <div className="container-custom">
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
                className="w-full bg-purple-600 hover:bg-purple-700 transition-colors duration-200 p-6 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4 text-left">
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {experience.title}
                    </h3>
                    <p className="text-purple-200">
                      {experience.company} • {experience.period}
                    </p>
                  </div>
                </div>
                
                <motion.div
                  animate={{ rotate: openItems.includes(experience.id) ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-white"
                >
                  {openItems.includes(experience.id) ? (
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
                  height: openItems.includes(experience.id) ? 'auto' : 0,
                  opacity: openItems.includes(experience.id) ? 1 : 0
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
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-portfolio-gray-lighter">
                        <img
                          src={experience.logo}
                          alt={`${experience.company} logo`}
                          className="w-full h-full object-cover"
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
    </section>
  );
};

export default ExperienceSection;
