import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export class PostRetrievalProcessor {
  constructor() {
    this.model = model;
  }

  // Re-rank retrieved chunks based on relevance to the original question
  async rerankChunks(chunks, originalQuestion) {
    try {
      if (chunks.length <= 1) return chunks;

      console.log(`[Post-Retrieval] Re-ranking ${chunks.length} chunks`);
      
      const prompt = `Given the original question and a list of retrieved document chunks, re-rank them by relevance to the question.
      
Original Question: "${originalQuestion}"

Retrieved Chunks:
${chunks.map((chunk, i) => `${i + 1}. [Score: ${chunk.similarity.toFixed(3)}] ${chunk.document.content.substring(0, 200)}...`).join('\n\n')}

Return only the numbers in order of relevance (most relevant first), separated by commas. For example: "3,1,2,4"`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const rankingText = response.text().trim();
      
      // Parse the ranking
      const ranking = rankingText.split(',').map(num => parseInt(num.trim()) - 1).filter(num => !isNaN(num));
      
      // Re-order chunks based on ranking
      const rerankedChunks = ranking.map(index => chunks[index]).filter(Boolean);
      
      // Add any chunks not in the ranking at the end
      const rankedIndices = new Set(ranking);
      const unrankedChunks = chunks.filter((_, index) => !rankedIndices.has(index));
      
      return [...rerankedChunks, ...unrankedChunks];
    } catch (error) {
      console.error('Error re-ranking chunks:', error);
      return chunks; // Return original order if re-ranking fails
    }
  }

  // Compress context to fit within token limits
  async compressContext(chunks, maxTokens = 2000) {
    try {
      if (chunks.length === 0) return '';

      console.log(`[Post-Retrieval] Compressing ${chunks.length} chunks`);
      
      // Calculate approximate token count (rough estimate: 1 token ≈ 4 characters)
      const totalChars = chunks.reduce((sum, chunk) => sum + chunk.document.content.length, 0);
      const estimatedTokens = totalChars / 4;
      
      if (estimatedTokens <= maxTokens) {
        return this.formatContext(chunks);
      }

      // If too long, use LLM to compress
      const contextText = chunks.map(chunk => 
        `[Source: ${chunk.document.source}] ${chunk.document.content}`
      ).join('\n\n');

      const prompt = `Compress the following context while preserving the most relevant information for answering questions. 
      Keep it under ${maxTokens * 4} characters and maintain key facts, numbers, and specific details:

${contextText}

Compressed context:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error compressing context:', error);
      // Fallback: truncate chunks
      return this.truncateContext(chunks, maxTokens);
    }
  }

  // Format context for final use
  formatContext(chunks) {
    return chunks.map(chunk => 
      `[Source: ${chunk.document.source}]\n${chunk.document.content}`
    ).join('\n\n---\n\n');
  }

  // Fallback: truncate context if compression fails
  truncateContext(chunks, maxTokens) {
    const maxChars = maxTokens * 4;
    let result = '';
    let currentLength = 0;

    for (const chunk of chunks) {
      const chunkText = `[Source: ${chunk.document.source}]\n${chunk.document.content}\n\n---\n\n`;
      
      if (currentLength + chunkText.length > maxChars) {
        // Truncate the last chunk
        const remainingChars = maxChars - currentLength;
        if (remainingChars > 100) {
          result += chunkText.substring(0, remainingChars) + '...';
        }
        break;
      }
      
      result += chunkText;
      currentLength += chunkText.length;
    }

    return result;
  }

  // Main post-retrieval processing
  async process(chunks, originalQuestion, maxTokens = 2000) {
    console.log(`[Post-Retrieval] Processing ${chunks.length} chunks`);
    
    if (chunks.length === 0) {
      return '';
    }

    // Step 1: Re-rank chunks by relevance
    const rerankedChunks = await this.rerankChunks(chunks, originalQuestion);
    
    // Step 2: Compress context to fit token limits
    const compressedContext = await this.compressContext(rerankedChunks, maxTokens);
    
    console.log(`[Post-Retrieval] Final context length: ${compressedContext.length} characters`);
    
    return {
      chunks: rerankedChunks,
      context: compressedContext,
      originalChunkCount: chunks.length,
      finalChunkCount: rerankedChunks.length
    };
  }
}