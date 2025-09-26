import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import compression from 'compression';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

// Debug environment variables
console.log('[Server] Environment variables after dotenv:');
console.log('  GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
console.log('  GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length || 0);
console.log('  GEMINI_API_KEY first 10 chars:', process.env.GEMINI_API_KEY?.substring(0, 10) || 'undefined');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini AI client
console.log('[Server] Initializing Gemini AI...');
console.log('[Server] API Key exists:', !!process.env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Middleware
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API endpoint for sending emails
app.post('/api/send-email', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).send('All fields are required.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.EMAIL_USER,
    subject: `New message from ${name}: ${subject}`,
    text: `You have received a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `<p>You have received a new message from your portfolio contact form.</p>
           <h3>Contact Details</h3>
           <ul>
             <li><strong>Name:</strong> ${name}</li>
             <li><strong>Email:</strong> ${email}</li>
           </ul>
           <h3>Message</h3>
           <p>${message}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email.');
  }
});

// API endpoint for RAG chatbot
app.post('/api/simple-chat', async (req, res) => {
  const { message, conversationHistory = [], options = {} } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    console.log(`[Server] Processing message: "${message}"`);
    
    // Read documents from the documents folder
    let relevantContext = '';
    try {
      const documentsDir = join(__dirname, 'documents');
      console.log(`[Server] Reading documents from: ${documentsDir}`);
      
      if (fs.existsSync(documentsDir)) {
        const files = fs.readdirSync(documentsDir);
        console.log(`[Server] Found ${files.length} files in documents folder`);
        
        for (const file of files) {
          const filePath = join(documentsDir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isFile() && (file.endsWith('.txt') || file.endsWith('.md'))) {
            console.log(`[Server] Reading file: ${file}`);
            const content = fs.readFileSync(filePath, 'utf-8');
            relevantContext += `\n\n--- ${file} ---\n${content}`;
          }
        }
      } else {
        console.log('[Server] Documents folder not found, using fallback');
        relevantContext = 'Kartikey Patel - Software Engineer with experience in React, Spring Boot, and AWS.';
      }
    } catch (error) {
      console.error('[Server] Error reading documents:', error);
      relevantContext = 'Kartikey Patel - Software Engineer with experience in React, Spring Boot, and AWS.';
    }
    
    console.log(`[Server] Context length: ${relevantContext.length} characters`);
    
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
    console.error('[Server] Error details:', {
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
});

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 