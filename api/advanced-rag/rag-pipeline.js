import { PreRetrievalProcessor } from './pre-retrieval.js';
import { VectorDatabase } from './vector-database.js';
import { PostRetrievalProcessor } from './post-retrieval.js';
import { GenerationProcessor } from './generation.js';

export class AdvancedRAGPipeline {
  constructor() {
    this.preRetrieval = new PreRetrievalProcessor();
    this.vectorDB = new VectorDatabase();
    this.postRetrieval = new PostRetrievalProcessor();
    this.generation = new GenerationProcessor();
  }

  // Main RAG pipeline execution
  async process(originalQuestion, options = {}) {
    const {
      topK = 5,
      similarityThreshold = 0.7,
      maxContextTokens = 2000,
      includeFollowUps = false,
      conversationHistory = []
    } = options;

    console.log(`[RAG Pipeline] Processing question: "${originalQuestion}"`);
    
    try {
      // Stage 1: Pre-Retrieval
      console.log('[RAG Pipeline] Stage 1: Pre-Retrieval');
      const preRetrievalResult = await this.preRetrieval.process(originalQuestion);
      
      // Stage 2: Retrieval
      console.log('[RAG Pipeline] Stage 2: Retrieval');
      const retrievedChunks = await this.vectorDB.searchMultiple(
        preRetrievalResult.expanded,
        topK,
        similarityThreshold
      );
      
      if (retrievedChunks.length === 0) {
        console.log('[RAG Pipeline] No relevant documents found');
        return {
          answer: "I don't have specific information about that topic in my knowledge base. Could you rephrase your question or ask about my experience, skills, or projects?",
          confidence: 0.1,
          contextUsed: false,
          retrievedChunks: [],
          followUpQuestions: []
        };
      }

      // Stage 3: Post-Retrieval
      console.log('[RAG Pipeline] Stage 3: Post-Retrieval');
      const postRetrievalResult = await this.postRetrieval.process(
        retrievedChunks,
        originalQuestion,
        maxContextTokens
      );

      // Stage 4: Generation
      console.log('[RAG Pipeline] Stage 4: Generation');
      const generationResult = await this.generation.generateResponseWithConfidence(
        originalQuestion,
        postRetrievalResult.context,
        conversationHistory
      );

      // Generate follow-up questions if requested
      let followUpQuestions = [];
      if (includeFollowUps) {
        followUpQuestions = await this.generation.generateFollowUpQuestions(
          originalQuestion,
          postRetrievalResult.context
        );
      }

      const result = {
        answer: generationResult.answer,
        confidence: generationResult.confidence,
        contextUsed: generationResult.contextUsed,
        retrievedChunks: postRetrievalResult.chunks,
        followUpQuestions,
        metadata: {
          originalQuestion,
          rewrittenQuestion: preRetrievalResult.rewritten,
          expandedQuestions: preRetrievalResult.expanded,
          originalChunkCount: postRetrievalResult.originalChunkCount,
          finalChunkCount: postRetrievalResult.finalChunkCount,
          contextLength: postRetrievalResult.context.length,
          model: generationResult.model,
          timestamp: new Date().toISOString()
        }
      };

      console.log('[RAG Pipeline] Processing completed successfully');
      return result;

    } catch (error) {
      console.error('[RAG Pipeline] Error in pipeline:', error);
      return {
        answer: "I'm sorry, I encountered an error while processing your question. Please try again.",
        confidence: 0.1,
        contextUsed: false,
        retrievedChunks: [],
        followUpQuestions: [],
        error: error.message
      };
    }
  }

  // Get pipeline statistics
  getStats() {
    return {
      vectorDB: this.vectorDB.getStats(),
      pipeline: {
        preRetrieval: 'active',
        retrieval: 'active',
        postRetrieval: 'active',
        generation: 'active'
      }
    };
  }

  // Clear all data
  clear() {
    this.vectorDB.clear();
    console.log('[RAG Pipeline] All data cleared');
  }
}