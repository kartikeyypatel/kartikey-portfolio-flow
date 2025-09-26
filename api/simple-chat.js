// Vercel serverless function for RAG chatbot
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

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
    
    // Read documents from the documents folder
    let relevantContext = '';
    try {
      // In Vercel, we need to use the correct path for serverless functions
      const documentsDir = path.join(process.cwd(), 'documents');
      console.log(`[Vercel Chat] Reading documents from: ${documentsDir}`);
      
      if (fs.existsSync(documentsDir)) {
        const files = fs.readdirSync(documentsDir);
        console.log(`[Vercel Chat] Found ${files.length} files in documents folder`);
        
        for (const file of files) {
          const filePath = path.join(documentsDir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isFile() && (file.endsWith('.txt') || file.endsWith('.md'))) {
            console.log(`[Vercel Chat] Reading file: ${file}`);
            const content = fs.readFileSync(filePath, 'utf-8');
            relevantContext += `\n\n--- ${file} ---\n${content}`;
          }
        }
      } else {
        console.log('[Vercel Chat] Documents folder not found, using fallback');
        relevantContext = 'Kartikey Patel - Software Engineer with experience in React, Spring Boot, and AWS.';
      }
    } catch (error) {
      console.error('[Vercel Chat] Error reading documents:', error);
      relevantContext = 'Kartikey Patel - Software Engineer with experience in React, Spring Boot, and AWS.';
    }
    
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