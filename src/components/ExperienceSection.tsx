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
      title: 'Information Technology Intern',
      company: 'PSE&G',
      period: 'May 2024 - Aug. 2024',
      description: 'Executed cybersecurity strategies by performing over 15 risk and vulnerability assessments across AWS, Azure, and GCP environments, ensuring alignment with NERC CIP, GDPR, and HIPAA compliance standards. Performed 100+ security scans with Veracode and Dome9, cutting vulnerabilities by 25%. Integrated automated security scans into CI/CD pipelines using Jenkins, identifying and mitigating over 300 vulnerabilities. Contributed to developing an internal portal using React, TypeScript, and Node.js.',
      skills: ['Cybersecurity', 'AWS', 'Veracode', 'Dome9', 'CI/CD', 'Jenkins', 'React', 'Node.js'],
      logo: '/lovable-uploads/f4e6c158-e728-46fd-88f4-7f764885e7b7.png'
    },
    {
      id: '2',
      title: 'Software Engineer',
      company: 'TCS',
      period: 'May 2021 - May 2023',
      description: 'Automated user data monitoring with SQL, reducing manual interventions by 80% for 205M+ users. Built and maintained 150+ Java RESTful APIs for call center dashboards, reducing troubleshooting times. Managed 10 TB+ of business reports using Tableau. Achieved 95% automation of server monitoring with Unix Shell scripts.',
      skills: ['SQL', 'Java', 'RESTful APIs', 'Tableau', 'Unix Shell Scripting'],
      logo: '/lovable-uploads/0a120f1b-970b-4375-9a4a-a1ee89b1e56c.png'
    },
    {
      id: '3',
      title: 'Software Engineer',
      company: 'Parshwa Builders',
      period: 'Jun. 2020 - Apr. 2021',
      description: 'Engineered Python Flask APIs for a real estate application, deployed on AWS Lambda, reducing response times by 30%. Collaborated in an Agile environment to define 15+ technical deliverables for a real estate platform on AWS, accelerating project delivery by 15%.',
      skills: ['Python', 'Flask', 'APIs', 'AWS Lambda'],
      logo: '/lovable-uploads/426dc987-9df8-4652-862a-3892823ced4d.png'
    },
    {
      id: '4',
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
    </motion.section>
  );
};

export default ExperienceSection;
