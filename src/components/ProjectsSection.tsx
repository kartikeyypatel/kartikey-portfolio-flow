'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, X, Github, ChevronLeft, ChevronRight, ExternalLink, Search, Star } from 'lucide-react';
import locales from '../locales/en.json';
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
  liveUrl?: string;
  account?: string;
  language?: string;
  stars?: number;
  updatedAt?: string;
  problem?: string;
  approach?: string;
  outcome?: string;
}

interface GitHubRepository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  fork: boolean;
  archived: boolean;
  pushed_at: string;
  owner: { login: string };
  stargazers_count: number;
}

const GITHUB_ACCOUNTS = ['kartikeyypatel', 'senseikartikey'] as const;
const HIDDEN_REPOSITORIES = new Set(
  (import.meta.env.VITE_HIDDEN_GITHUB_REPOSITORIES ?? '')
    .split(',')
    .map((name: string) => name.trim().toLowerCase())
    .filter(Boolean),
);

const titleFromRepositoryName = (name: string) =>
  name
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());

const categoryFromRepository = (repository: GitHubRepository): Project['category'] => {
  const searchable = `${repository.name} ${repository.description ?? ''} ${repository.language ?? ''} ${repository.topics.join(' ')}`.toLowerCase();
  const categories: string[] = [];
  if (/ai|ml|rag|llm|gemini|openai|data.?mining|machine.?learning|langgraph|llama/.test(searchable)) categories.push('AI/ML');
  if (/react|next|web|frontend|backend|api|django|spring|node|typescript|javascript/.test(searchable)) categories.push('Web Development');
  if (/mobile|android|ios|expo|react.?native|app/.test(searchable)) categories.push('App Development');
  if (/security|oauth|encrypt|auth/.test(searchable)) categories.push('Security');
  return categories.length > 1 ? categories : categories[0] ?? 'Web Development';
};

const formatTopic = (topic: string) =>
  topic
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const repositoryToProject = (repository: GitHubRepository): Project => ({
  id: `gh-${repository.id}`,
  title: titleFromRepositoryName(repository.name),
  category: categoryFromRepository(repository),
  date: new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(repository.pushed_at)),
  image: '',
  description: repository.description || 'Explore the source code, implementation details, and latest development activity on GitHub.',
  client: `GitHub · @${repository.owner.login}`,
  technologies: Array.from(new Set([repository.language, ...repository.topics.map(formatTopic)].filter(Boolean) as string[])).slice(0, 8),
  gallery: [],
  size: 'normal',
  githubUrl: repository.html_url,
  liveUrl: repository.homepage || undefined,
  account: repository.owner.login,
  language: repository.language || undefined,
  stars: repository.stargazers_count,
  updatedAt: repository.pushed_at,
});

const ProjectSignal = ({ project, large = false }: { project: Project; large?: boolean }) => {
  const seed = Number(project.id) || 1;
  const category = Array.isArray(project.category) ? project.category[0] : project.category;
  const bars = Array.from({ length: large ? 18 : 12 }, (_, index) =>
    22 + ((seed * 17 + index * 29) % 68)
  );

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-white/[0.07] bg-[#090d0e] ${large ? 'min-h-[360px]' : 'h-32'}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_25%,rgba(34,211,238,0.12),transparent_38%)]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(226,250,250,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(226,250,250,0.12)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute inset-x-5 top-4 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.12em] text-portfolio-text-muted">
        <span>{category}</span>
        <span className="text-portfolio-cyan">PRJ-{project.id.padStart(2, '0')}</span>
      </div>
      <div className={`absolute inset-x-5 bottom-5 flex items-end gap-1 ${large ? 'top-20' : 'top-12'}`}>
        {bars.map((height, index) => (
          <span
            key={index}
            className="flex-1 rounded-t-[2px] border-t border-portfolio-cyan/55 bg-gradient-to-t from-portfolio-cyan/[0.025] to-portfolio-cyan/20"
            style={{ height: `${height}%`, opacity: 0.45 + (index % 4) * 0.12 }}
          />
        ))}
      </div>
      <div className="absolute bottom-5 left-5 h-1.5 w-1.5 rounded-full bg-portfolio-cyan shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
    </div>
  );
};

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [githubProjects, setGithubProjects] = useState<Project[]>([]);
  const [githubSyncState, setGithubSyncState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [repositorySearch, setRepositorySearch] = useState('');
  const [repositoryLanguage, setRepositoryLanguage] = useState('All');
  const [repositorySort, setRepositorySort] = useState<'updated' | 'stars'>('updated');
  const [repositoryPage, setRepositoryPage] = useState(1);
  const lockedScrollY = useRef(0);
  const projectDialogRef = useRef<HTMLDivElement>(null);
  const projectBackButtonRef = useRef<HTMLButtonElement>(null);
  const lastProjectTriggerRef = useRef<HTMLButtonElement | null>(null);
  const projectsPerPage = 9;

  useEffect(() => {
    const controller = new AbortController();

    const syncRepositories = async () => {
      try {
        const responses = await Promise.all(
          GITHUB_ACCOUNTS.map((account) =>
            fetch(`https://api.github.com/users/${account}/repos?per_page=100&sort=pushed&direction=desc`, {
              headers: { Accept: 'application/vnd.github+json' },
              signal: controller.signal,
            }),
          ),
        );

        if (responses.some((response) => !response.ok)) throw new Error('GitHub repository sync failed');
        const repositories = (await Promise.all(responses.map((response) => response.json()))) as GitHubRepository[][];
        const projects = repositories
          .flat()
          .filter((repository) => !repository.fork && !repository.archived)
          .filter((repository) => !HIDDEN_REPOSITORIES.has(repository.name.toLowerCase()))
          .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
          .map(repositoryToProject);

        setGithubProjects(projects);
        setGithubSyncState('ready');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') setGithubSyncState('error');
      }
    };

    syncRepositories();
    return () => controller.abort();
  }, []);

  const curatedProjects: Project[] = [
    // Existing Projects
    {
      id: '1',
      title: 'Consumer Safety Application (Capstone)',
      category: 'App Development',
      date: 'May 2025',
      image: '/uploads/4e145dc9-9986-473d-a061-cc6b95b27460.png',
      description: 'Designed the "Report a Product" workflow for a consumer safety application. Built a Node.js, Express, and Puppeteer backend to automate a 6-page FDA MedWatch form. Integrated Google Cloud services for reCAPTCHA v3 bypass.',
      client: 'Academic Project',
      technologies: ['React Native', 'TypeScript', 'Puppeteer', 'Expo Go', 'Node.js', 'Express', 'Google Cloud'],
      gallery: [
        '/uploads/4e145dc9-9986-473d-a061-cc6b95b27460.png',
      ],
      size: 'wide',
      githubUrl: 'https://github.com/kartikeyypatel/urrecalls-server-automation'
      ,problem: 'Consumer safety reporting required users to complete a long, multi-page FDA MedWatch workflow.',
      approach: 'Built a React Native experience backed by Node.js, Express, and Puppeteer automation, with Google Cloud services supporting the submission flow.',
      outcome: 'Reduced a complex six-page reporting process to a guided application workflow.'
    },
    {
      id: '2',
      title: 'Enterprise Document Intelligence Assistant',
      category: ['AI/ML', 'Web Development'],
      date: 'April 2025',
      image: '/uploads/5269f9aa-d080-4608-bdf5-d13a7458b3b9.png',
      description: 'Developed a RAG-based AI document Q&A system processing 10k+ files with LangChain and Pinecone (89% accuracy). Deployed on AWS Fargate using Docker and Kubernetes. Monitored via Weights & Biases.',
      client: 'Personal Project',
      technologies: ['LangChain', 'OpenAI GPT-4', 'AWS', 'Docker', 'Pinecone', 'Kubernetes', 'Weights & Biases', 'RAG Architecture'],
      gallery: ['/uploads/5269f9aa-d080-4608-bdf5-d13a7458b3b9.png'],
      size: 'normal',
      githubUrl: 'https://github.com/kartikeyypatel/enterprise-doc-assistant-gemini-rag-app'
      ,problem: 'Large document collections were difficult to search and use as reliable organizational knowledge.',
      approach: 'Implemented retrieval-augmented generation with LangChain and Pinecone, containerized for cloud deployment on AWS.',
      outcome: 'Processed more than 10,000 files with reported evaluation accuracy of 89%.'
    },
    {
      id: '3',
      title: 'Secure Web Sign-Up System',
      category: 'Security',
      date: 'May 2020 (JASC Publication)',
      image: '/uploads/66304f36-e0a8-4dd0-a849-e96125c9d07e.png',
      description: 'Implemented secure web sign-up using OAuth 2.0 and AES encryption. Ensured 100% data protection by generating dummy sign-up details and securing unique access codes via hashing, stored in an encrypted database.',
      client: 'Publication',
      technologies: ['Java', 'OAuth 2.0', 'XML', 'MySQL', 'AES Encryption', 'Hashing', 'Data Protection'],
      gallery: ['/uploads/66304f36-e0a8-4dd0-a849-e96125c9d07e.png'],
      size: 'normal',
      githubUrl: 'https://github.com/kartikey-patel'
    },
    {
      id: '4',
      title: 'Analyzing TV Shows and Movies',
      category: 'AI/ML',
      date: 'Feb 2025',
      image: '/uploads/Gemini_Generated_Image_tu7kwutu7kwutu7k.png',
      description: 'Using Python web scraping with Beautiful Soup and Pandas, and mathematical models like Naïve Bayes, K-Nearest Neighbor, and Random Forest, was able to achieve 92% accuracy in prediction of popularity.',
      client: 'Academic Project',
      technologies: ['Python', 'Pandas', 'Beautiful Soup', 'Data Mining', 'Naïve Bayes', 'KNN', 'Random Forest'],
      gallery: ['/uploads/Gemini_Generated_Image_tu7kwutu7kwutu7k.png'],
      size: 'normal',
      githubUrl: 'https://github.com/kartikey-patel'
    },
    {
      id: '5',
      title: 'Crime Detection using Machine Learning',
      category: 'AI/ML',
      date: 'Jan 2025',
      image: '/uploads/Gemini_Generated_Image_bmxkq2bmxkq2bmxk.png',
      description: 'Developed a crime prediction website leveraging Machine Learning (ML) algorithms including Naïve Bayes and Random Forest; achieved 83% accuracy in forecasted crime occurrences aiding local law enforcement department in resource allocation and crime prevention efforts.',
      client: 'Academic Project',
      technologies: ['Python', 'HTML/CSS', 'Machine Learning', 'Naïve Bayes', 'Random Forest'],
      gallery: ['/uploads/Gemini_Generated_Image_bmxkq2bmxkq2bmxk.png'],
      size: 'wide',
      githubUrl: 'https://github.com/kartikey-patel'
    },
    {
      id: '6',
      title: 'Real-Time Sentiment Analysis for Social Media',
      category: 'AI/ML',
      date: 'Dec 2024',
      image: '/uploads/Gemini_Generated_Image_k83scnk83scnk83s.png',
      description: 'Developed a real-time social media sentiment tracker using Twitter\'s API and NLP for topic extraction, with a dashboard displaying sentiment trends and alerts for significant shifts, providing insights on public opinion for brands and topics.',
      client: 'Personal Project',
      technologies: ['Python', 'Tweepy', 'TextBlob', 'NLP', 'MongoDB'],
      gallery: ['/uploads/Gemini_Generated_Image_k83scnk83scnk83s.png'],
      size: 'normal',
      githubUrl: 'https://github.com/kartikey-patel'
    },
    {
      id: '7',
      title: 'AI-Powered Personal Finance Dashboard',
      category: 'Web Development',
      date: 'Sep 2024',
      image: '/uploads/Gemini_Generated_Image_t2m44yt2m44yt2m4.png',
      description: 'Developed an AI-driven dashboard to track expenses, analyze spending patterns, and forecast budgets; integrated machine learning for tailored savings recommendations, visualized data with D3.js, and ensured secure user authentication.',
      client: 'Personal Project',
      technologies: ['Python', 'Django', 'React.js', 'Pandas', 'Machine Learning', 'scikit-learn', 'D3.js'],
      gallery: ['/uploads/Gemini_Generated_Image_t2m44yt2m44yt2m4.png'],
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
      githubUrl: 'https://github.com/kartikeyypatel/Mortgage-Application-Approval-Workflow-System'
      ,problem: 'Manual mortgage application processing created slow, repetitive approval workflows.',
      approach: 'Combined a React interface with a Node.js backend, AWS Lambda, and RDS to automate workflow stages.',
      outcome: 'Reduced simulated approval time by 50%.'
    },
    {
      id: '20',
      title: 'Okada Leasing Agent AI',
      category: ['AI/ML', 'Web Development'],
      date: '2024',
      image: '/uploads/hackathon-winner.jpg',
      description: 'Built an intelligent leasing agent chatbot combining a FastAPI backend with a hybrid RAG pipeline (semantic + BM25 search) to answer property listing questions. Features a MongoDB-based CRM for user profiles and conversation history, CSV document ingestion, and Google Calendar-integrated viewing scheduling. Winner, Okada & Co. hackathon.',
      client: 'Hackathon Project',
      technologies: ['FastAPI', 'Python', 'LlamaIndex', 'Google Gemini', 'MongoDB', 'RAG Architecture'],
      gallery: ['/uploads/hackathon-winner.jpg'],
      size: 'normal',
      githubUrl: 'https://github.com/kartikeyypatel/okada-leasing-agent'
      ,problem: 'Prospective tenants needed faster answers and a simpler way to schedule property viewings.',
      approach: 'Built a FastAPI conversational agent with hybrid semantic and BM25 retrieval, MongoDB CRM storage, and Google Calendar scheduling.',
      outcome: 'Delivered the winning project at the Okada & Co. hackathon.'
    },
    {
      id: '21',
      title: 'Okada Voice Conversational Agent',
      category: ['AI/ML', 'Web Development'],
      date: '2025',
      image: '/uploads/okada-voice-agent.png',
      description: 'Built a bi-directional voice and text conversational AI agent using FastAPI, LangGraph, and Gemini 2.5 Flash, with RAG over user-uploaded documents (PDF, DOCX, CSV) backed by ChromaDB, toggleable live web search via Tavily, and Redis-backed chat history. Frontend built with React 19, Vite, and Tailwind CSS.',
      client: 'Hackathon Project',
      technologies: ['FastAPI', 'LangGraph', 'Gemini 2.5 Flash', 'React', 'ChromaDB', 'Redis'],
      gallery: ['/uploads/okada-voice-agent.png'],
      size: 'wide',
      githubUrl: 'https://github.com/senseikartikey/Okada_hackathon_voice_conversational_agent'
      ,problem: 'Document-based assistants often separate voice, text, retrieval, and current web information into disconnected experiences.',
      approach: 'Created a bidirectional voice and text agent with FastAPI, LangGraph, Gemini, ChromaDB, Redis, and optional Tavily search.',
      outcome: 'Unified uploaded-document retrieval, live web search, and persistent conversations in one React application.'
    },
    {
      id: '22',
      title: 'Raisin Variety Classification (Data Mining)',
      category: 'AI/ML',
      date: 'Nov 2024',
      image: '/uploads/Gemini_Generated_Image_1bbqxw1bbqxw1bbq.png',
      description: 'Performed binary classification on a raisin varieties dataset, comparing KNN, LSTM, and Random Forest models for prediction accuracy, achieving an average accuracy of around 92% across models.',
      client: 'Academic Project',
      technologies: ['Python', 'KNN', 'LSTM', 'Random Forest', 'Data Mining'],
      gallery: ['/uploads/Gemini_Generated_Image_1bbqxw1bbqxw1bbq.png'],
      size: 'normal',
      githubUrl: 'https://github.com/kartikeyypatel/FinalTerm_DataMining_Project'
    }
  ];

  const curatedUrls = new Set(curatedProjects.map((project) => project.githubUrl?.toLowerCase()));
  const unmatchedGithubProjects = githubProjects.filter(
    (project) => !project.githubUrl || !curatedUrls.has(project.githubUrl.toLowerCase()),
  );
  const projects = [...curatedProjects, ...unmatchedGithubProjects];
  const featuredProjects = curatedProjects.filter((project) => ['1', '2', '19', '20', '21'].includes(project.id));
  const repositoryLanguages = Array.from(new Set(githubProjects.map((project) => project.language).filter(Boolean) as string[])).sort();
  const visibleRepositories = githubProjects
    .filter((project) => repositoryLanguage === 'All' || project.language === repositoryLanguage)
    .filter((project) => `${project.title} ${project.description} ${project.technologies.join(' ')}`.toLowerCase().includes(repositorySearch.toLowerCase()))
    .sort((a, b) => repositorySort === 'stars'
      ? (b.stars ?? 0) - (a.stars ?? 0)
      : new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime());
  const repositoriesPerPage = 9;
  const repositoryPageCount = Math.max(1, Math.ceil(visibleRepositories.length / repositoriesPerPage));
  const paginatedRepositories = visibleRepositories.slice(
    (repositoryPage - 1) * repositoriesPerPage,
    repositoryPage * repositoriesPerPage,
  );

  useEffect(() => {
    setRepositoryPage(1);
  }, [repositorySearch, repositoryLanguage, repositorySort]);

  const filters = locales.projects.filters;

  const filteredProjects = activeFilter === 'All' 
    ? featuredProjects
    : featuredProjects.filter(project =>
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

  const openProject = (project: Project, trigger: HTMLButtonElement) => {
    lastProjectTriggerRef.current = trigger;
    setSelectedProject(project);
  };

  const closeProject = () => {
    setSelectedProject(null);
  };

  const isProjectOpen = selectedProject !== null;

  useEffect(() => {
    if (!isProjectOpen) return;

    lockedScrollY.current = window.scrollY;
    const body = document.body;
    const root = document.documentElement;
    const previousBodyStyles = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    const previousRootOverflow = root.style.overflow;

    const mobileViewport = window.matchMedia('(max-width: 767px)').matches;
    if (!mobileViewport) {
      body.style.position = 'fixed';
      body.style.top = `-${lockedScrollY.current}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
    }
    body.style.overflow = 'hidden';
    root.style.overflow = 'hidden';

    window.requestAnimationFrame(() => projectBackButtonRef.current?.focus({ preventScroll: true }));

    const handleDialogKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedProject(null);
        return;
      }
      if (event.key !== 'Tab' || !projectDialogRef.current) return;
      const focusable = Array.from(
        projectDialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleDialogKeyboard);

    return () => {
      document.removeEventListener('keydown', handleDialogKeyboard);
      Object.assign(body.style, previousBodyStyles);
      root.style.overflow = previousRootOverflow;
      if (!mobileViewport) window.scrollTo(0, lockedScrollY.current);
      window.requestAnimationFrame(() => lastProjectTriggerRef.current?.focus({ preventScroll: true }));
    };
  }, [isProjectOpen]);

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

  const formatCategory = (category: string | string[]) => {
    return Array.isArray(category) ? category.join(' & ') : category;
  };

  return (
    <>
      <motion.section
        id="projects"
        className="section-padding relative"
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
            <h2 className="mb-8 font-['Fraunces'] text-[clamp(2.8rem,6vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-portfolio-text">
              Featured Projects
              <span className="italic text-portfolio-cyan">.</span>
            </h2>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-2">
              {filters.map((filter) => (
                <motion.button
                  key={filter}
                  onClick={() => handleFilterChange(filter)}
                  className={`rounded-[10px] border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.08em] transition-all duration-200 ${
                    activeFilter === filter
                      ? 'border-portfolio-cyan/60 bg-portfolio-cyan/[0.1] text-portfolio-cyan'
                      : 'border-white/[0.09] bg-white/[0.02] text-portfolio-text-muted hover:border-portfolio-cyan/35 hover:text-portfolio-text'
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentProjects.map((project, index) => (
                <motion.button
                  type="button"
                  key={project.id}
                  className="group relative flex min-h-[330px] flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0d1213]/95 p-4 text-left shadow-[inset_0_1px_0_rgba(226,250,250,0.055),0_18px_55px_rgba(0,0,0,0.25)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-portfolio-cyan/35 hover:shadow-[inset_0_1px_0_rgba(226,250,250,0.075),0_24px_70px_rgba(0,0,0,0.38)]"
                  onClick={(event) => openProject(project, event.currentTarget)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProjectSignal project={project} />

                  <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
                    <span className="mb-3 w-fit rounded-md border border-portfolio-cyan/20 bg-portfolio-cyan/[0.07] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-portfolio-cyan">Case study</span>
                    <div className="mb-3 flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.08em] text-portfolio-text-muted">
                      <span>{project.client}</span>
                      <span>{project.date}</span>
                    </div>
                    <h3 className="line-clamp-2 text-xl font-semibold leading-tight text-portfolio-text transition-colors group-hover:text-white">
                      {project.title}
                    </h3>
                    <div className="mt-auto flex items-end justify-between gap-4 pt-5">
                      <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                            className="rounded-md border border-white/[0.07] bg-white/[0.025] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.04em] text-portfolio-text-muted"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                          <span className="rounded-md px-2 py-1 font-mono text-[9px] text-portfolio-cyan">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-portfolio-cyan transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.button>
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

                <div className="hidden items-center gap-2 sm:flex">
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

                <span className="min-w-[72px] text-center font-mono text-xs text-portfolio-text-muted sm:hidden">
                  {currentPage} / {totalPages}
                </span>

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

          <div className="mt-24 border-t border-white/[0.09] pt-16">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-portfolio-cyan">Connected repositories</p>
                <h3 className="font-['Fraunces'] text-4xl font-semibold tracking-[-0.03em] text-portfolio-text sm:text-5xl">Live from GitHub<span className="italic text-portfolio-cyan">.</span></h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-portfolio-text-muted">Public, non-fork repositories from both active accounts, refreshed whenever this page loads.</p>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-portfolio-text-muted" aria-live="polite">
                <span className={`h-2 w-2 rounded-full ${githubSyncState === 'ready' ? 'bg-emerald-400' : githubSyncState === 'error' ? 'bg-amber-400' : 'animate-pulse bg-portfolio-cyan'}`} />
                {githubSyncState === 'ready' ? `${githubProjects.length} public repositories` : githubSyncState === 'error' ? 'Curated work remains available' : 'Loading repositories'}
              </div>
            </div>

            <div className="mt-8 grid gap-3 rounded-2xl border border-white/[0.08] bg-[#0d1213]/75 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-[minmax(260px,1fr)_auto_auto]">
              <label className="relative sm:col-span-2 lg:col-span-1">
                <span className="sr-only">Search repositories</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-portfolio-text-muted" />
                <input value={repositorySearch} onChange={(event) => setRepositorySearch(event.target.value)} placeholder="Search repositories" className="h-11 w-full border-white/[0.1] pl-10 text-sm" />
              </label>
              <label>
                <span className="sr-only">Filter by language</span>
                <select value={repositoryLanguage} onChange={(event) => setRepositoryLanguage(event.target.value)} className="h-11 w-full rounded-lg border border-white/[0.1] bg-[#090d0e] px-3 text-sm text-portfolio-text sm:w-auto">
                  <option>All</option>
                  {repositoryLanguages.map((language) => <option key={language}>{language}</option>)}
                </select>
              </label>
              <label>
                <span className="sr-only">Sort repositories</span>
                <select value={repositorySort} onChange={(event) => setRepositorySort(event.target.value as 'updated' | 'stars')} className="h-11 w-full rounded-lg border border-white/[0.1] bg-[#090d0e] px-3 text-sm text-portfolio-text sm:w-auto">
                  <option value="updated">Recently updated</option>
                  <option value="stars">Most starred</option>
                </select>
              </label>
            </div>

            {githubSyncState === 'loading' && (
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading GitHub repositories">
                {Array.from({ length: 6 }, (_, index) => <div key={index} className="h-52 animate-pulse rounded-2xl border border-white/[0.07] bg-white/[0.025]" />)}
              </div>
            )}

            {githubSyncState === 'ready' && visibleRepositories.length === 0 && (
              <div className="mt-6 rounded-2xl border border-dashed border-white/[0.12] p-10 text-center text-sm text-portfolio-text-muted">No repositories match these filters.</div>
            )}

            {githubSyncState === 'ready' && visibleRepositories.length > 0 && (
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {paginatedRepositories.map((project) => (
                  <article key={project.id} className="flex min-h-56 flex-col rounded-2xl border border-white/[0.08] bg-[#0d1213]/90 p-5 transition-colors hover:border-portfolio-cyan/30">
                    <div className="flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.08em] text-portfolio-text-muted">
                      <span>@{project.account}</span>
                      <span className="inline-flex items-center gap-1"><Star className="h-3 w-3" />{project.stars ?? 0}</span>
                    </div>
                    <button type="button" onClick={(event) => openProject(project, event.currentTarget)} className="mt-4 text-left">
                      <h4 className="text-lg font-semibold leading-tight text-portfolio-text hover:text-portfolio-cyan">{project.title}</h4>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-portfolio-text-muted">{project.description}</p>
                    </button>
                    <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                      <span className="font-mono text-[10px] text-portfolio-cyan">{project.language ?? 'Repository'}</span>
                      <div className="flex gap-2">
                        {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-emerald-400/25 px-3 text-xs text-emerald-300 hover:bg-emerald-400/10">Live <ExternalLink className="h-3.5 w-3.5" /></a>}
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-white/[0.1] px-3 text-xs text-portfolio-text hover:border-portfolio-cyan/30"><Github className="h-3.5 w-3.5" />Source</a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {githubSyncState === 'ready' && visibleRepositories.length > repositoriesPerPage && (
              <nav className="mt-8 flex items-center justify-center gap-4" aria-label="GitHub repository pages">
                <button type="button" onClick={() => setRepositoryPage((page) => Math.max(1, page - 1))} disabled={repositoryPage === 1} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/[0.1] px-4 text-sm text-portfolio-text transition-colors hover:border-portfolio-cyan/40 disabled:cursor-not-allowed disabled:opacity-35">
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <span className="min-w-20 text-center font-mono text-xs text-portfolio-text-muted">{repositoryPage} / {repositoryPageCount}</span>
                <button type="button" onClick={() => setRepositoryPage((page) => Math.min(repositoryPageCount, page + 1))} disabled={repositoryPage === repositoryPageCount} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/[0.1] px-4 text-sm text-portfolio-text transition-colors hover:border-portfolio-cyan/40 disabled:cursor-not-allowed disabled:opacity-35">
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
            )}
          </div>
        </div>
      </motion.section>

      {/* Project Detail Modal */}
      {selectedProject && createPortal((
        <motion.div
          ref={projectDialogRef}
          className="fixed inset-0 z-[100] isolate bg-[#070a0a]"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedProject.title} project details`}
        >
          <div className="h-full overflow-y-auto">
            <div className="container-custom pb-8">
              {/* Header */}
              <div className="sticky top-0 z-30 mb-8 flex items-center justify-between border-b border-white/[0.08] bg-[#070a0a]/95 py-4 backdrop-blur-xl">
                <button
                  ref={projectBackButtonRef}
                  type="button"
                  onClick={closeProject}
                  className="inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-portfolio-cyan/35 bg-portfolio-cyan/[0.08] px-4 text-sm font-semibold text-portfolio-cyan transition-colors hover:border-portfolio-cyan hover:bg-portfolio-cyan hover:text-black"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{locales.projects.backToProjects}</span>
                </button>
                
                <button
                  type="button"
                  onClick={closeProject}
                  className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-white/[0.1] text-portfolio-text-muted transition-colors hover:border-portfolio-cyan/40 hover:text-white"
                  aria-label="Close project details"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Breadcrumbs */}
              <div className="text-sm text-portfolio-text-muted mb-4 font-mono">
                Projects / {formatCategory(selectedProject.category)} / {selectedProject.title}
              </div>

              {/* Project Title */}
              <h1 className="mb-2 max-w-5xl font-['Fraunces'] text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-portfolio-text md:text-6xl">
                {selectedProject.title}
              </h1>
              <p className="text-portfolio-cyan mb-8">{formatCategory(selectedProject.category)} • {selectedProject.date}</p>

              <div className="mb-10 flex flex-wrap gap-3">
                {selectedProject.liveUrl && (
                  <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/[0.08] px-4 text-sm font-semibold text-emerald-300 hover:bg-emerald-400/[0.14]">
                    View live project <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/[0.12] px-4 text-sm font-semibold text-portfolio-text hover:border-portfolio-cyan/40">
                    View source <Github className="h-4 w-4" />
                  </a>
                )}
              </div>

              {/* Project Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <p className="text-lg text-portfolio-text-muted leading-relaxed mb-8">
                    {selectedProject.description}
                  </p>

                  {selectedProject.problem && selectedProject.approach && selectedProject.outcome && (
                    <div className="mb-10 grid gap-3 sm:grid-cols-3">
                      {[
                        ['Problem', selectedProject.problem],
                        ['Approach', selectedProject.approach],
                        ['Outcome', selectedProject.outcome],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-5">
                          <h2 className="font-mono text-[10px] uppercase tracking-[0.12em] text-portfolio-cyan">{label}</h2>
                          <p className="mt-3 text-sm leading-6 text-portfolio-text-muted">{value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <ProjectSignal project={selectedProject} large />
                </div>

                <div className="space-y-8">
                  {/* Github */}
                  {selectedProject.githubUrl && (
                    <div>
                      <h3 className="text-xl font-semibold text-portfolio-text mb-4">
                        {locales.projects.github}
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
                          className="rounded-md border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.05em] text-portfolio-cyan"
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
      ), document.body)}
    </>
  );
};

export default ProjectsSection;
