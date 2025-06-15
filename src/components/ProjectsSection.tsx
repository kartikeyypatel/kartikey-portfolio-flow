'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import locales from '../locales/en.json';

interface Project {
  id: string;
  title: string;
  category: string | string[];
  date: string;
  image: string;
  description: string;
  client: string;
  technologies: string[];
  gallery: string[];
  size?: 'normal' | 'large' | 'wide' | 'tall';
}

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      id: '1',
      title: 'Consumer Safety Application (Capstone)',
      category: 'App Development',
      date: 'May 2025',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Designed the "Report a Product" workflow for a consumer safety application. Built a Node.js, Express, and Puppeteer backend to automate a 6-page FDA MedWatch form. Integrated Google Cloud services for reCAPTCHA v3 bypass.',
      client: 'Academic Project',
      technologies: ['React Native', 'TypeScript', 'Puppeteer', 'Expo Go', 'Node.js', 'Express', 'Google Cloud'],
      gallery: [
        'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ],
      size: 'wide'
    },
    {
      id: '2',
      title: 'Enterprise Document Intelligence Assistant',
      category: ['AI/ML', 'Web Development'],
      date: 'April 2025',
      image: 'https://images.unsplash.com/photo-1677756229133-d5d4f0490f23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Developed a RAG-based AI document Q&A system processing 10k+ files with LangChain and Pinecone (89% accuracy). Deployed on AWS Fargate using Docker and Kubernetes. Monitored via Weights & Biases.',
      client: 'Personal Project',
      technologies: ['LangChain', 'OpenAI GPT-4', 'AWS', 'Docker', 'Pinecone', 'Kubernetes', 'Weights & Biases', 'RAG Architecture'],
      gallery: ['https://images.unsplash.com/photo-1677756229133-d5d4f0490f23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'],
      size: 'normal',
    },
    {
      id: '3',
      title: 'Secure Web Sign-Up System',
      category: 'Security',
      date: 'May 2020 (JASC Publication)',
      image: 'https://images.unsplash.com/photo-1550751827-4138d04d405b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Implemented secure web sign-up using OAuth 2.0 and AES encryption. Ensured 100% data protection by generating dummy sign-up details and securing unique access codes via hashing, stored in an encrypted database.',
      client: 'Publication',
      technologies: ['Java', 'OAuth 2.0', 'XML', 'MySQL', 'AES Encryption', 'Hashing', 'Data Protection'],
      gallery: ['https://images.unsplash.com/photo-1550751827-4138d04d405b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'],
      size: 'normal',
    },
    {
      id: '4',
      title: 'Analyzing TV Shows and Movies',
      category: 'AI/ML',
      date: 'Feb 2025',
      image: 'https://images.unsplash.com/photo-1593335937443-45c9a59a721d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Using Python web scraping with Beautiful Soup and Pandas, and mathematical models like Naïve Bayes, K-Nearest Neighbor, and Random Forest, was able to achieve 92% accuracy in prediction of popularity.',
      client: 'Academic Project',
      technologies: ['Python', 'Pandas', 'Beautiful Soup', 'Data Mining', 'Naïve Bayes', 'KNN', 'Random Forest'],
      gallery: ['https://images.unsplash.com/photo-1593335937443-45c9a59a721d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'],
      size: 'normal',
    },
    {
      id: '5',
      title: 'Crime Detection using Machine Learning',
      category: 'AI/ML',
      date: 'Jan 2025',
      image: 'https://images.unsplash.com/photo-1599227694144-a60f5b1d3a5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Developed a crime prediction website leveraging Machine Learning (ML) algorithms including Naïve Bayes and Random Forest; achieved 83% accuracy in forecasted crime occurrences aiding local law enforcement department in resource allocation and crime prevention efforts.',
      client: 'Academic Project',
      technologies: ['Python', 'HTML/CSS', 'Machine Learning', 'Naïve Bayes', 'Random Forest'],
      gallery: ['https://images.unsplash.com/photo-1599227694144-a60f5b1d3a5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'],
      size: 'wide',
    },
    {
      id: '6',
      title: 'Real-Time Sentiment Analysis for Social Media',
      category: 'AI/ML',
      date: 'Dec 2024',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Developed a real-time social media sentiment tracker using Twitter’s API and NLP for topic extraction, with a dashboard displaying sentiment trends and alerts for significant shifts, providing insights on public opinion for brands and topics.',
      client: 'Personal Project',
      technologies: ['Python', 'Tweepy', 'TextBlob', 'NLP', 'MongoDB'],
      gallery: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'],
      size: 'normal',
    },
    {
      id: '7',
      title: 'AI-Powered Personal Finance Dashboard',
      category: 'Web Development',
      date: 'Sep 2024',
      image: 'https://images.unsplash.com/photo-1554224155-1696413565d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      description: 'Developed an AI-driven dashboard to track expenses, analyze spending patterns, and forecast budgets; integrated machine learning for tailored savings recommendations, visualized data with D3.js, and ensured secure user authentication.',
      client: 'Personal Project',
      technologies: ['Python', 'Django', 'React.js', 'Pandas', 'Machine Learning', 'scikit-learn', 'D3.js'],
      gallery: ['https://images.unsplash.com/photo-1554224155-1696413565d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'],
      size: 'normal',
    }
  ];

  const filters = locales.projects.filters;

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => 
        Array.isArray(project.category) 
          ? project.category.includes(activeFilter) 
          : project.category === activeFilter
      );

  const openProject = (project: Project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeProject = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'unset';
  };

  const getNextProject = () => {
    if (!selectedProject) return null;
    const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
    return projects[(currentIndex + 1) % projects.length];
  };

  const getPreviousProject = () => {
    if (!selectedProject) return null;
    const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
    return projects[(currentIndex - 1 + projects.length) % projects.length];
  };

  const getProjectSizeClass = (size?: 'normal' | 'large' | 'wide' | 'tall') => {
    switch (size) {
      case 'large':
        return 'md:col-span-2 md:row-span-2';
      case 'wide':
        return 'md:col-span-2';
      case 'tall':
        return 'md:row-span-2';
      default:
        return 'col-span-1 row-span-1';
    }
  };

  const formatCategory = (category: string | string[]) => {
    return Array.isArray(category) ? category.join(' & ') : category;
  };

  return (
    <>
      <section id="projects" className="section-padding bg-portfolio-black" ref={ref}>
        <div className="container-custom">
          {/* Title */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-portfolio-text mb-8">
              {locales.projects.title}
            </h2>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              {filters.map((filter) => (
                <motion.button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-3 rounded-full border transition-all duration-200 ${
                    activeFilter === filter
                      ? 'bg-portfolio-cyan text-portfolio-black border-portfolio-cyan'
                      : 'text-portfolio-text border-portfolio-gray-lighter hover:border-portfolio-cyan'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {filter}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[25rem] grid-flow-dense"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer ${getProjectSizeClass(project.size)}`}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => openProject(project)}
                whileHover={{ y: -5 }}
              >
                <div className="w-full h-full relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-portfolio-black via-portfolio-black/20 to-transparent"></div>
                  
                  {/* Project Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-portfolio-cyan text-sm font-mono mb-2">{formatCategory(project.category)}</p>
                    <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-portfolio-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <motion.div
                      className="text-white text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                    >
                      <p className="font-semibold">{locales.projects.showProject}</p>
                      <div className="w-12 h-0.5 bg-white mx-auto mt-2"></div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <motion.div
          className="fixed inset-0 z-50 bg-portfolio-black"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <div className="h-full overflow-y-auto">
            <div className="container-custom py-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={closeProject}
                  className="flex items-center space-x-2 text-portfolio-cyan hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-6 w-6" />
                  <span>{locales.projects.backToProjects}</span>
                </button>
                
                <button
                  onClick={closeProject}
                  className="text-portfolio-text hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Breadcrumbs */}
              <div className="text-sm text-portfolio-text-muted mb-4 font-mono">
                Projects / {formatCategory(selectedProject.category)} / {selectedProject.title}
              </div>

              {/* Project Title */}
              <h1 className="text-4xl md:text-6xl font-bold text-portfolio-text mb-2">
                {selectedProject.title}
              </h1>
              <p className="text-portfolio-cyan mb-8">{formatCategory(selectedProject.category)} • {selectedProject.date}</p>

              {/* Project Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <p className="text-lg text-portfolio-text-muted leading-relaxed mb-8">
                    {selectedProject.description}
                  </p>

                  {/* Project Gallery */}
                  <div className="space-y-6">
                    {selectedProject.gallery.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${selectedProject.title} ${index + 1}`}
                        className="w-full rounded-lg"
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Client */}
                  <div>
                    <h3 className="text-xl font-semibold text-portfolio-text mb-4">
                      {locales.projects.client}
                    </h3>
                    <p className="text-portfolio-text-muted">{selectedProject.client}</p>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h3 className="text-xl font-semibold text-portfolio-text mb-4">
                      {locales.projects.technologies}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-portfolio-gray text-portfolio-cyan text-sm rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-16 pt-8 border-t border-portfolio-gray-lighter">
                <button
                  onClick={() => setSelectedProject(getPreviousProject())}
                  className="flex items-center space-x-2 text-portfolio-text hover:text-portfolio-cyan transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>{locales.projects.previousProject}</span>
                </button>

                <button
                  onClick={() => setSelectedProject(getNextProject())}
                  className="flex items-center space-x-2 text-portfolio-text hover:text-portfolio-cyan transition-colors"
                >
                  <span>{locales.projects.nextProject}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ProjectsSection;
