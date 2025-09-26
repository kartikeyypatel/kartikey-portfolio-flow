// Vercel serverless function for RAG chatbot
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, conversationHistory = [], options = {} } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    console.log(`[Vercel Chat] Processing message: "${message}"`);
    
    // Include comprehensive information about Kartikey Patel directly in the code
    const relevantContext = `Kartikey Patel
Software Engineer | Full Stack Developer

Location: New York, NY
Phone: +1 (862) 423-7020
Email: kartikeypatelwork@gmail.com
LinkedIn: https://www.linkedin.com/in/patel-kartikey/

SUMMARY
Results-driven Software Engineer with experience in full-stack development, cloud computing, and DevOps. Skilled in designing scalable web applications and microservices using JavaScript, TypeScript, Python, Java, C#, React.js, Angular, Node.js, Spring Boot, Django, and RESTful/GraphQL APIs. Strong background in database design and optimization with PostgreSQL, MySQL, MongoDB, and Redis. Experienced in leveraging AWS, Azure, and GCP for performance improvements and cost reduction. Proficient in CI/CD automation, test-driven development, and Agile methodologies. Delivered AI-driven document intelligence systems and secure web applications, optimizing workflows, reducing manual interventions, and enhancing user experience.

TECHNICAL SKILLS
Programming Languages: JavaScript (ES6+), TypeScript, Python, Java, C#
Frontend Development: React.js, Angular, Next.js, Redux, HTML5, CSS3, SASS, Tailwind CSS
Backend Development: Node.js, Express.js, Django, Spring Boot, .NET Core, RESTful APIs, GraphQL
Databases & Storage: PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch
Cloud & DevOps: AWS (EC2, S3, Lambda, RDS, EKS), Azure, GCP, Docker, Kubernetes, Jenkins, GitHub Actions, GitLab CI
Testing & Tools: Jest, Mocha, Cypress, Selenium, Postman, Git, GitHub, GitLab, Bitbucket, Agile/Scrum

PROFESSIONAL EXPERIENCE

HP | Software Engineer Intern | Sep 2024 – May 2025
Engineered Java microservices for internal tools, improving API response times by 25%.
Authored Python automation scripts saving 30+ hours of manual testing monthly.
Built a React.js dashboard to visualize system metrics, reducing bottleneck resolution time by ~40%.
Spearheaded CI/CD pipeline integration (Jenkins, GitHub Actions), cutting deployment time from days to under 2 hours.
Achieved 95%+ test coverage using JUnit and PyTest.

Public Service Enterprise Group (PSE&G) | IT Intern | May 2024 – Aug 2024
Ensured NERC, GDPR, & HIPAA compliance; remediated 95% of vulnerabilities across AWS, Azure, GCP.
Reduced deployment risk by 40% and mitigated 300+ vulnerabilities using 100+ Veracode scans integrated with CI/CD.
Built a React/TypeScript/Node.js portal and SQL-backed dashboard, improving internal efficiency by 25%.
Automated IT operations for 200+ endpoints using PowerShell, saving 10+ hours monthly.

Tata Consultancy Services (TCS) | Software Engineer | May 2021 – May 2023
Improved data reliability for 205M VIL users; automated monitoring processes, cutting manual interventions by 80%.
Developed 150+ Java RESTful APIs for incident workflows, reducing troubleshooting times by up to 90 minutes.
Architected Tableau dashboards for 10TB of reports, reducing data retrieval from 15 mins to under 3 mins.
Improved issue resolution time by 15% for 200+ endpoints with proactive monitoring and escalation.
Contributed to 20% improvement in system availability by migrating legacy applications.

Epsilon | Software Engineer | Apr 2020 – Apr 2021
Enhanced UX and cut page load times by 30% via scalable web apps using Java, Spring Boot, Angular, RESTful APIs.
Optimized database schemas and queries, improving data retrieval speed by 25%.
Deployed microservices with Docker/Kubernetes, improving deployment efficiency by 20%.
Delivered 4+ full-cycle projects on time at a 98% success rate.
Supported 5,000+ daily active users by integrating APIs for payments, authentication, and marketing.
Increased test coverage to 85%, reducing production defects by 15%.

PROJECTS
Consumer Safety Application (Capstone Project) | May 2025
Built with React Native, TypeScript, Node.js, Express, Puppeteer. Automated FDA MedWatch form submission via Google Cloud backend.

Enterprise Document Intelligence Assistant | Apr 2025
Developed a RAG-based AI Q&A system with 89% accuracy on 10k+ documents using LangChain, Pinecone, AWS Fargate, and Docker.

Secure Web Sign-Up System | Published May 2020
Developed using Java, OAuth 2.0, MySQL, XML. Created a secure signup system with hashed codes and encrypted database.

EDUCATION
Master of Science in Computer Science | New Jersey Institute of Technology | Newark, NJ, US | Sep 2023 – May 2025
Bachelor of Science in Computer Science | University of Mumbai | Mumbai, India | Aug 2016 – May 2020`;
    
    console.log(`[Vercel Chat] Context length: ${relevantContext.length} characters`);
    
    // Create the prompt for Gemini
    const prompt = `You are Kartikey Patel's AI assistant. Use the following information to answer questions accurately and professionally.

Context from documents:
${relevantContext}

Guidelines:
- Always speak in first person as Kartikey
- Be specific about technologies, projects, and achievements mentioned in the context
- If the context doesn't contain relevant information, politely say you don't have that specific information
- Keep responses concise but informative (2-4 sentences typically)
- Highlight key achievements and technical skills
- Be enthusiastic about technology and problem-solving
- Reference specific projects, technologies, or metrics when relevant

User Question: ${message}

Answer:`;

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    // Calculate simple confidence score
    const confidence = relevantContext.length > 0 ? 0.8 : 0.3;

    res.status(200).json({
      response: aiResponse,
      confidence: confidence,
      contextUsed: relevantContext.length > 0,
      followUpQuestions: [],
      metadata: {
        originalQuestion: message,
        contextLength: relevantContext.length,
        model: 'gemini-2.5-flash',
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Vercel Chat] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      apiKeyExists: !!process.env.GEMINI_API_KEY
    });
    res.status(500).json({ 
      error: 'Sorry, I encountered an error while processing your question. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}