import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export class GenerationProcessor {
  constructor() {
    this.model = model;
  }

  // Generate response using retrieved context
  async generateResponse(originalQuestion, context, conversationHistory = []) {
    try {
      console.log('[Generation] Generating response with context');
      
      // Build conversation context
      const historyContext = conversationHistory.length > 0 
        ? `\n\nPrevious conversation:\n${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}`
        : '';

      const prompt = `You are Kartikey Patel's AI assistant. Use the provided context to answer the user's question accurately and professionally.

Context from documents:
${context}

${historyContext}

User Question: ${originalQuestion}

Guidelines:
- Always speak in first person as Kartikey
- Be specific about technologies, projects, and achievements mentioned in the context
- If the context doesn't contain relevant information, politely say you don't have that specific information
- Keep responses concise but informative (2-4 sentences typically)
- Highlight key achievements and technical skills
- Be enthusiastic about technology and problem-solving
- Reference specific projects, technologies, or metrics when relevant
- If this is a follow-up question, maintain context from the conversation

Answer:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const answer = response.text().trim();

      console.log('[Generation] Response generated successfully');
      
      return {
        answer,
        contextUsed: context.length > 0,
        contextLength: context.length,
        model: 'gemini-1.5-flash'
      };
    } catch (error) {
      console.error('[Generation] Error generating response:', error);
      throw error;
    }
  }

  // Generate response with confidence scoring
  async generateResponseWithConfidence(originalQuestion, context, conversationHistory = []) {
    try {
      const response = await this.generateResponse(originalQuestion, context, conversationHistory);
      
      // Calculate confidence based on context relevance
      const confidence = this.calculateConfidence(context, originalQuestion);
      
      return {
        ...response,
        confidence,
        metadata: {
          hasContext: context.length > 0,
          contextRelevance: confidence,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('[Generation] Error generating response with confidence:', error);
      throw error;
    }
  }

  // Calculate confidence score based on context relevance
  calculateConfidence(context, question) {
    if (!context || context.length === 0) {
      return 0.3; // Low confidence without context
    }

    // Simple heuristic: longer context with relevant keywords = higher confidence
    const questionWords = question.toLowerCase().split(/\s+/);
    const contextLower = context.toLowerCase();
    
    let relevanceScore = 0;
    questionWords.forEach(word => {
      if (word.length > 3 && contextLower.includes(word)) {
        relevanceScore += 1;
      }
    });

    // Normalize to 0-1 scale
    const maxPossibleScore = questionWords.filter(w => w.length > 3).length;
    const normalizedScore = maxPossibleScore > 0 ? relevanceScore / maxPossibleScore : 0;
    
    // Base confidence on context length and relevance
    const lengthScore = Math.min(context.length / 1000, 1); // Max at 1000 chars
    const finalConfidence = (normalizedScore * 0.7) + (lengthScore * 0.3);
    
    return Math.min(Math.max(finalConfidence, 0.1), 0.95); // Clamp between 0.1 and 0.95
  }

  // Generate follow-up questions
  async generateFollowUpQuestions(originalQuestion, context) {
    try {
      if (!context || context.length === 0) {
        return [];
      }

      const prompt = `Based on the user's question and the available context, suggest 2-3 relevant follow-up questions that the user might want to ask.

Original Question: ${originalQuestion}

Available Context: ${context.substring(0, 500)}...

Suggest follow-up questions that:
- Are related to the original question
- Can be answered with the available context
- Would be valuable for the user to know

Return only the questions, one per line:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const questions = response.text().trim().split('\n').filter(q => q.trim().length > 0);
      
      return questions.slice(0, 3); // Limit to 3 questions
    } catch (error) {
      console.error('[Generation] Error generating follow-up questions:', error);
      return [];
    }
  }
}