'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X, Github, ChevronLeft, ChevronRight } from 'lucide-react';
import locales from '../locales/en.json';
import { FocusCards } from '@/components/ui/focus-cards';
import { cn } from '@/lib/utils';
import attendanceTracking from '../assets/attendance-tracking.png';
import supplyChainForecaster from '../assets/supply-chain-forecaster.png';
import cicdAnalytics from '../assets/cicd-analytics.png';
import postgresqlAutomation from '../assets/postgresql-automation.png';
import financialMigration from '../assets/financial-migration.png';
import telemetryMonitoring from '../assets/telemetry-monitoring.png';
import microserviceHealth from '../assets/microservice-health.png';
import logisticsMonitoring from '../assets/logistics-monitoring.png';
import membershipUpgrade from '../assets/membership-upgrade.png';
import ecommerceInventory from '../assets/ecommerce-inventory.png';
import financialDashboard from '../assets/financial-dashboard.png';
import mortgageWorkflow from '../assets/mortgage-workflow.png';

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
  githubUrl?: string;
}

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9;

  const projects: Project[] = [
    // Existing Projects
    {
      id: '1',
      title: 'Consumer Safety Application (Capstone)',
      category: 'App Development',
      date: 'May 2025',
      image: '/lovable-uploads/4e145dc9-9986-473d-a061-cc6b95b27460.png',
      description: 'Designed the "Report a Product" workflow for a consumer safety application. Built a Node.js, Express, and Puppeteer backend to automate a 6-page FDA MedWatch form. Integrated Google Cloud services for reCAPTCHA v3 bypass.',
      client: 'Academic Project',
      technologies: ['React Native', 'TypeScript', 'Puppeteer', 'Expo Go', 'Node.js', 'Express', 'Google Cloud'],
      gallery: [
        '/lovable-uploads/4e145dc9-9986-473d-a061-cc6b95b27460.png',
      ],
      size: 'wide',
      githubUrl: 'https://github.com/kartikey-patel'
    },
    {
      id: '2',
      title: 'Enterprise Document Intelligence Assistant',
      category: ['AI/ML', 'Web Development'],
      date: 'April 2025',
      image: '/lovable-uploads/5269f9aa-d080-4608-bdf5-d13a7458b3b9.png',
      description: 'Developed a RAG-based AI document Q&A system processing 10k+ files with LangChain and Pinecone (89% accuracy). Deployed on AWS Fargate using Docker and Kubernetes. Monitored via Weights & Biases.',
      client: 'Personal Project',
      technologies: ['LangChain', 'OpenAI GPT-4', 'AWS', 'Docker', 'Pinecone', 'Kubernetes', 'Weights & Biases', 'RAG Architecture'],
      gallery: ['/lovable-uploads/5269f9aa-d080-4608-bdf5-d13a7458b3b9.png'],
      size: 'normal',
      githubUrl: 'https://github.com/kartikey-patel'
    },
    {
      id: '3',
      title: 'Secure Web Sign-Up System',
      category: 'Security',
      date: 'May 2020 (JASC Publication)',
      image: '/lovable-uploads/66304f36-e0a8-4dd0-a849-e96125c9d07e.png',
      description: 'Implemented secure web sign-up using OAuth 2.0 and AES encryption. Ensured 100% data protection by generating dummy sign-up details and securing unique access codes via hashing, stored in an encrypted database.',
      client: 'Publication',
      technologies: ['Java', 'OAuth 2.0', 'XML', 'MySQL', 'AES Encryption', 'Hashing', 'Data Protection'],
      gallery: ['/lovable-uploads/66304f36-e0a8-4dd0-a849-e96125c9d07e.png'],
      size: 'normal',
      githubUrl: 'https://github.com/kartikey-patel'
    },
    {
      id: '4',
      title: 'Analyzing TV Shows and Movies',
      category: 'AI/ML',
      date: 'Feb 2025',
      image: '/lovable-uploads/Gemini_Generated_Image_tu7kwutu7kwutu7k.png',
      description: 'Using Python web scraping with Beautiful Soup and Pandas, and mathematical models like Naïve Bayes, K-Nearest Neighbor, and Random Forest, was able to achieve 92% accuracy in prediction of popularity.',
      client: 'Academic Project',
      technologies: ['Python', 'Pandas', 'Beautiful Soup', 'Data Mining', 'Naïve Bayes', 'KNN', 'Random Forest'],
      gallery: ['/lovable-uploads/Gemini_Generated_Image_tu7kwutu7kwutu7k.png'],
      size: 'normal',
      githubUrl: 'https://github.com/kartikey-patel'
    },
    {
      id: '5',
      title: 'Crime Detection using Machine Learning',
      category: 'AI/ML',
      date: 'Jan 2025',
      image: '/lovable-uploads/Gemini_Generated_Image_bmxkq2bmxkq2bmxk.png',
      description: 'Developed a crime prediction website leveraging Machine Learning (ML) algorithms including Naïve Bayes and Random Forest; achieved 83% accuracy in forecasted crime occurrences aiding local law enforcement department in resource allocation and crime prevention efforts.',
      client: 'Academic Project',
      technologies: ['Python', 'HTML/CSS', 'Machine Learning', 'Naïve Bayes', 'Random Forest'],
      gallery: ['/lovable-uploads/Gemini_Generated_Image_bmxkq2bmxkq2bmxk.png'],
      size: 'wide',
      githubUrl: 'https://github.com/kartikey-patel'
    },
    {
      id: '6',
      title: 'Real-Time Sentiment Analysis for Social Media',
      category: 'AI/ML',
      date: 'Dec 2024',
      image: '/lovable-uploads/Gemini_Generated_Image_k83scnk83scnk83s.png',
      description: 'Developed a real-time social media sentiment tracker using Twitter\'s API and NLP for topic extraction, with a dashboard displaying sentiment trends and alerts for significant shifts, providing insights on public opinion for brands and topics.',
      client: 'Personal Project',
      technologies: ['Python', 'Tweepy', 'TextBlob', 'NLP', 'MongoDB'],
      gallery: ['/lovable-uploads/Gemini_Generated_Image_k83scnk83scnk83s.png'],
      size: 'normal',
      githubUrl: 'https://github.com/kartikey-patel'
    },
    {
      id: '7',
      title: 'AI-Powered Personal Finance Dashboard',
      category: 'Web Development',
      date: 'Sep 2024',
      image: '/lovable-uploads/Gemini_Generated_Image_t2m44yt2m44yt2m4.png',
      description: 'Developed an AI-driven dashboard to track expenses, analyze spending patterns, and forecast budgets; integrated machine learning for tailored savings recommendations, visualized data with D3.js, and ensured secure user authentication.',
      client: 'Personal Project',
      technologies: ['Python', 'Django', 'React.js', 'Pandas', 'Machine Learning', 'scikit-learn', 'D3.js'],
      gallery: ['/lovable-uploads/Gemini_Generated_Image_t2m44yt2m44yt2m4.png'],
      size: 'normal',
      githubUrl: 'https://github.com/kartikey-patel'
    },
    // New Projects
    {
      id: '8',
      title: 'Program Participation & Attendance Tracking System',
      category: 'App Development',
      date: 'April 2025',
      image: attendanceTracking,
      description: 'Created an automated attendance tracking system that reduced weekly reporting time by 80% by using Advanced Excel (VBA) to process and clean data exported daily from Salesforce.',
      client: 'Enterprise Project',
      technologies: ['VBA', 'SQL', 'Salesforce', 'Excel', 'Data Processing'],
      gallery: [attendanceTracking],
      size: 'normal',
      githubUrl: 'https://github.com/kartikey-patel'
    },
    {
      id: '9',
      title: 'Supply Chain Demand Forecaster',
      category: ['AI/ML', 'Web Development'],
      date: 'July 2025',
      image: supplyChainForecaster,
      description: 'Architected a full-stack forecasting tool, improving accuracy by 15% in tests, by integrating a Python backend with a RAG-based LLM and a React dashboard for supply chain analysis.',
      client: 'Enterprise Project',
      technologies: ['Python', 'React', 'PostgreSQL', 'Docker', 'LLM', 'RAG Architecture'],
      gallery: [supplyChainForecaster],
      size: 'wide',
      githubUrl: 'https://github.com/kartikey-patel'
    },
    {
      id: '10',
      title: 'CI/CD Test Analytics Dashboard',
      category: 'Web Development',
      date: 'July 2025',
      image: cicdAnalytics,
      description: 'Constructed a CI/CD test analytics tool, reducing QA log analysis time by 30%, by building a Python Django API and integrating it with a responsive ReactJS dashboard for test triage.',
      client: 'Enterprise Project',
      technologies: ['Python', 'Django', 'ReactJS', 'PostgreSQL', 'Docker', 'CI/CD'],
      gallery: [cicdAnalytics],
      size: 'normal',
      githubUrl: 'https://github.com/kartikey-patel'
    },
    {
      id: '11',
      title: 'PostgreSQL Lifecycle Automation Tool',
      category: 'Web Development',
      date: 'June 2025',
      image: postgresqlAutomation,
      description: 'Constructed a DBaaS tool, reducing PostgreSQL provisioning time from 1 hour to <5 minutes, by building a Go API backend and a React dashboard for lifecycle management via Docker.',
      client: 'Enterprise Project',
      technologies: ['Go', 'React', 'Docker', 'PostgreSQL', 'API Development'],
      gallery: [postgresqlAutomation],
      size: 'normal',
      githubUrl: 'https://github.com/kartikey-patel'
    },
    {
      id: '12',
      title: 'Cloud-Native Financial Account Migration Service',
      category: 'Web Development',
      date: 'June 2025',
      image: financialMigration,
      description: 'Created a financial account migration service that automated the conversion of 10,000+ accounts, reducing manual processing time by 95%, by building resilient Java Spring Boot microservices on AWS.',
      client: 'Enterprise Project',
      technologies: ['Java', 'Spring Boot', 'AWS', 'Kafka', 'Microservices'],
      gallery: [financialMigration],
      size: 'wide',
      githubUrl: 'https://github.com/kartikey-patel'
    },
    {
      id: '13',
      title: 'Live Service Telemetry & Alerting System',
      category: 'Web Development',
      date: 'May 2025',
      image: telemetryMonitoring,
      description: 'Pioneered a monitoring system for real-time alerts, cutting mean time to detection by 40% in tests, by processing telemetry streams with Python and Kafka to flag service anomalies.',
      client: 'Enterprise Project',
      technologies: ['Python', 'Kafka', 'Prometheus', 'Grafana', 'Monitoring'],
      gallery: [telemetryMonitoring],
      size: 'normal',
      githubUrl: 'https://github.com/kartikey-patel'
    },
    {
      id: '14',
      title: 'Scalable Microservice Health Monitoring System',
      category: 'Web Development',
      date: 'May 2025',
      image: microserviceHealth,
      description: 'Spearheaded a health monitoring system, reducing issue detection time by 50% in simulations, by building fault-tolerant microservices on Azure Service Fabric using C# and .NET.',
      client: 'Enterprise Project',
      technologies: ['C#', '.NET', 'App Insights', 'Azure Service Fabric', 'Microservices'],
      gallery: [microserviceHealth],
      size: 'normal',
      githubUrl: 'https://github.com/kartikey-patel'
    },
    {
      id: '15',
      title: 'Real-Time Logistics Monitoring & Alerting System',
      category: 'Web Development',
      date: 'April 2025',
      image: logisticsMonitoring,
      description: 'Architected a real-time logistics monitoring system, cutting incident response time by 30%, by building a Java Spring Boot backend to process Kafka event streams for a React dashboard.',
      client: 'Enterprise Project',
      technologies: ['Java', 'Spring Boot', 'Kafka', 'React', 'Real-time Processing'],
      gallery: [logisticsMonitoring],
      size: 'normal',
      githubUrl: 'https://github.com/kartikey-patel'
    },
    {
      id: '16',
      title: 'Predictive Membership Upgrade Engine',
      category: 'AI/ML',
      date: 'April 2025',
      image: membershipUpgrade,
      description: 'Constructed a service that boosted member upgrade conversions by 15% by deploying a Java/Spring Boot microservice to process Kafka streams and identify high-potential members.',
      client: 'Enterprise Project',
      technologies: ['Java', 'Spring Boot', 'Kafka', 'CosmosDB', 'Machine Learning'],
      gallery: [membershipUpgrade],
      size: 'normal',
      githubUrl: 'https://github.com/kartikey-patel'
    },
    {
      id: '17',
      title: 'Real-Time E-commerce Inventory Monitor',
      category: 'Web Development',
      date: 'April 2025',
      image: ecommerceInventory,
      description: 'Minimized revenue loss from stockouts by providing real-time alerts with 95% accuracy by developing a React dashboard & Node.js API on GCP that uses an LLM to detect inventory anomalies.',
      client: 'Enterprise Project',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'GCP', 'LLM'],
      gallery: [ecommerceInventory],
      size: 'wide',
      githubUrl: 'https://github.com/kartikey-patel'
    },
    {
      id: '18',
      title: 'Interactive Financial Data Dashboard',
      category: 'Web Development',
      date: 'April 2025',
      image: financialDashboard,
      description: 'Constructed a real-time data visualization tool, reducing data load times by 40%, by integrating Java Microservices with a responsive Angular frontend on OpenShift.',
      client: 'Enterprise Project',
      technologies: ['Angular', 'Java', 'Spring Boot', 'OpenShift', 'Data Visualization'],
      gallery: [financialDashboard],
      size: 'normal',
      githubUrl: 'https://github.com/kartikey-patel'
    },
    {
      id: '19',
      title: 'Mortgage Application & Approval Workflow System',
      category: 'Web Development',
      date: 'March 2025',
      image: mortgageWorkflow,
      description: 'Architected a full-stack mortgage processing system that automated application workflows, reducing approval times by 50%, by building a Node.js backend with AWS Lambda and a React frontend.',
      client: 'Enterprise Project',
      technologies: ['Node.js', 'React', 'Lambda', 'RDS', 'AWS', 'Workflow Automation'],
      gallery: [mortgageWorkflow],
      size: 'normal',
      githubUrl: 'https://github.com/kartikey-patel'
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

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

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
      <motion.section
        id="projects"
        className="section-padding bg-portfolio-black relative"
        ref={ref}
      >
        <div className="container-custom relative z-10">
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
                  onClick={() => handleFilterChange(filter)}
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
            className="mt-16"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
              {currentProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className={cn(
                    "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden transition-all duration-300 ease-out cursor-pointer group",
                    getProjectSizeClass(project.size)
                  )}
                  onClick={() => openProject(project)}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="object-cover absolute inset-0 w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-300 mb-2">
                      {formatCategory(project.category)}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-portfolio-cyan/20 text-portfolio-cyan text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-gray-600/20 text-gray-300 text-xs rounded-full">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 gap-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
                    currentPage === 1
                      ? 'border-portfolio-gray text-portfolio-gray cursor-not-allowed'
                      : 'border-portfolio-cyan text-portfolio-cyan hover:bg-portfolio-cyan hover:text-portfolio-black'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full border transition-all duration-200 ${
                        currentPage === page
                          ? 'bg-portfolio-cyan text-portfolio-black border-portfolio-cyan'
                          : 'border-portfolio-gray-lighter text-portfolio-text hover:border-portfolio-cyan'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
                    currentPage === totalPages
                      ? 'border-portfolio-gray text-portfolio-gray cursor-not-allowed'
                      : 'border-portfolio-cyan text-portfolio-cyan hover:bg-portfolio-cyan hover:text-portfolio-black'
                  }`}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </motion.section>

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
                  {/* Github */}
                  {selectedProject.githubUrl && (
                    <div>
                      <h3 className="text-xl font-semibold text-portfolio-text mb-4">
                        {(locales.projects as any).github}
                      </h3>
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-portfolio-text-muted hover:text-portfolio-cyan transition-colors"
                      >
                        <Github className="h-5 w-5" />
                        <span>View on GitHub</span>
                      </a>
                    </div>
                  )}

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
