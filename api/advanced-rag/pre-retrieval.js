import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export class PreRetrievalProcessor {
  constructor() {
    this.model = model;
  }

  // Question Rewriting - Rephrase the question for better retrieval
  async rewriteQuestion(originalQuestion) {
    try {
      const prompt = `Rewrite the following question to be more specific and clear for document retrieval. 
      Keep the core meaning but make it more searchable and specific:

      Original: "${originalQuestion}"

      Rewritten:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error rewriting question:', error);
      return originalQuestion; // Fallback to original
    }
  }

  // Question Expansion - Add synonyms and related terms
  async expandQuestion(question) {
    try {
      const prompt = `Expand the following question with synonyms, related terms, and alternative phrasings that might appear in documents. 
      Return 3-5 variations separated by "|||":

      Question: "${question}"

      Expanded variations:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const expanded = response.text().trim();
      
      // Split by ||| and clean up
      const variations = expanded.split('|||').map(v => v.trim()).filter(v => v.length > 0);
      return [question, ...variations]; // Include original question
    } catch (error) {
      console.error('Error expanding question:', error);
      return [question]; // Fallback to original
    }
  }

  // Main pre-retrieval processing
  async process(originalQuestion) {
    console.log('[Pre-Retrieval] Processing question:', originalQuestion);
    
    // Step 1: Rewrite the question
    const rewrittenQuestion = await this.rewriteQuestion(originalQuestion);
    console.log('[Pre-Retrieval] Rewritten:', rewrittenQuestion);
    
    // Step 2: Expand with variations
    const expandedQuestions = await this.expandQuestion(rewrittenQuestion);
    console.log('[Pre-Retrieval] Expanded variations:', expandedQuestions.length);
    
    return {
      original: originalQuestion,
      rewritten: rewrittenQuestion,
      expanded: expandedQuestions,
      processed: expandedQuestions // Use all variations for retrieval
    };
  }
}