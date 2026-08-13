// Vercel serverless function for RAG chatbot
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export default async function handler(req, res) {
  // Enable CORS
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

Harlem Children's Zone | Data Analyst | Jan 2026 – Present
Architected high-volume data pipelines using Node.js and Azure Data Fabric, cutting event processing latency by 40%.
Designed scalable frontend frameworks with React and Next.js, elevating UI performance metrics by 35%.
Mentored junior engineering teams, raising technical standards and boosting throughput by 30%.
Built reliable asynchronous workflows with BullMQ, sustaining 100% uptime for mission-critical processes.
Optimized NoSQL database queries, driving a 25% increase in retrieval speeds.

Capital One | Software Engineer | Jul 2025 – Jan 2026
Engineered high-performance backend microservices using Node.js and NestJS, scaling distributed platforms to support over 2M client transactions daily.
Orchestrated resilient, event-driven CI/CD pipelines deploying to Azure App Services, cutting deployment times by 50%.
Built server-side rendering components and state management patterns, reducing frontend latency by 40%.
Integrated scalable REST APIs with modern component-driven designs, boosting application throughput by 35%.
Resolved production incidents under pressure, sustaining 99% reliability.

Public Service Enterprise Group (PSE&G) | IT Intern | May 2024 – Aug 2024
Fortified mission-critical cloud infrastructure across complex Linux environments, remediating 95% of system anomalies.
Analyzed large-scale messaging queue architectures, cutting deployment risks by 40%.
Advanced distributed system workflows using TypeORM and complex SQL queries, ensuring 100% event integrity across SQL platforms.

Epsilon | Software Engineer | Apr 2020 – May 2023
Spearheaded the complete software development lifecycle for scalable real-time systems, improving platform performance by 25% and reducing latency by 30%.
Partnered with cross-functional stakeholders to deliver 10+ distributed solutions on schedule.
Streamlined event-driven infrastructure pipelines, cutting manual service configuration effort by 40%.
Optimized Kafka streaming data processes, yielding 20% faster query execution and message flow.

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

    // Format prior turns so the model has conversational memory
    const historyText = conversationHistory
      .map((turn) => `${turn.sender === 'user' ? 'User' : 'Assistant'}: ${turn.content}`)
      .join('\n');

    // Create the prompt for Gemini
    const prompt = `You are Kartikey Patel's AI assistant. Use the following information to answer questions accurately and professionally.

Context from documents:
${relevantContext}
${historyText ? `\nConversation so far:\n${historyText}\n` : ''}
Guidelines:
- Always speak in first person as Kartikey
- Be specific about technologies, projects, and achievements mentioned in the context
- If the context doesn't contain relevant information, politely say you don't have that specific information
- Keep responses concise but informative (2-4 sentences typically)
- Highlight key achievements and technical skills
- Be enthusiastic about technology and problem-solving
- Reference specific projects, technologies, or metrics when relevant
- Use the conversation so far to keep continuity with earlier questions and answers

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