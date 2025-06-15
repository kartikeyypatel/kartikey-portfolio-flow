
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import locales from '../locales/en.json';

interface Project {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  description: string;
  client: string;
  technologies: string[];
  gallery: string[];
  size?: 'normal' | 'large';
}

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      id: '1',
      title: 'Consumer Safety Application',
      category: 'App Development',
      date: '2024',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'A comprehensive mobile application designed to enhance consumer safety through real-time monitoring, incident reporting, and safety recommendations. Features include location-based alerts, emergency contacts, and safety score tracking.',
      client: 'Academic Project',
      technologies: ['React Native', 'Node.js', 'MongoDB', 'Firebase', 'Google Maps API'],
      gallery: [
        'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      size: 'large'
    },
    {
      id: '2',
      title: 'AI-Powered Analytics Dashboard',
      category: 'AI/ML',
      date: '2024',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Machine learning-powered dashboard that provides intelligent insights and predictive analytics for business decision making.',
      client: 'Enterprise Client',
      technologies: ['Python', 'TensorFlow', 'React', 'D3.js', 'PostgreSQL'],
      gallery: [
        'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      id: '3',
      title: 'E-Commerce Platform',
      category: 'Web Development',
      date: '2023',
      image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Full-stack e-commerce solution with modern design, payment integration, and inventory management.',
      client: 'Startup Client',
      technologies: ['Next.js', 'TypeScript', 'Stripe', 'Prisma', 'PostgreSQL'],
      gallery: [
        'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      id: '4',
      title: 'Smart Home IoT System',
      category: 'App Development',
      date: '2023',
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'IoT-based home automation system with mobile app control and voice integration.',
      client: 'Personal Project',
      technologies: ['Flutter', 'Arduino', 'Firebase', 'Google Assistant API'],
      gallery: [
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ]
    }
  ];

  const filters = locales.projects.filters;

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer ${
                  project.size === 'large' ? 'md:col-span-2' : ''
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => openProject(project)}
                whileHover={{ y: -5 }}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-portfolio-black via-portfolio-black/20 to-transparent"></div>
                  
                  {/* Project Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-portfolio-cyan text-sm font-mono mb-2">{project.category}</p>
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
                Projects / {selectedProject.category} / {selectedProject.title}
              </div>

              {/* Project Title */}
              <h1 className="text-4xl md:text-6xl font-bold text-portfolio-text mb-2">
                {selectedProject.title}
              </h1>
              <p className="text-portfolio-cyan mb-8">{selectedProject.category} • {selectedProject.date}</p>

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
