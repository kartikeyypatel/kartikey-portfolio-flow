import fs from 'fs';
import path from 'path';
import { EmbeddingModel } from './embedding-model.js';

export class VectorDatabase {
  constructor(indexPath = '.cache/vector-db.json') {
    this.indexPath = indexPath;
    this.embeddingModel = new EmbeddingModel();
    this.index = {
      documents: [],
      embeddings: [],
      metadata: {
        createdAt: null,
        updatedAt: null,
        totalDocuments: 0,
        totalChunks: 0
      }
    };
    this.loadIndex();
  }

  // Load existing index from disk
  loadIndex() {
    if (fs.existsSync(this.indexPath)) {
      try {
        const data = fs.readFileSync(this.indexPath, 'utf-8');
        this.index = JSON.parse(data);
        console.log(`[VectorDB] Loaded index with ${this.index.documents.length} documents`);
      } catch (error) {
        console.error('[VectorDB] Error loading index:', error);
        this.index = this.getEmptyIndex();
      }
    }
  }

  // Save index to disk
  saveIndex() {
    try {
      const dir = path.dirname(this.indexPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      this.index.metadata.updatedAt = new Date().toISOString();
      fs.writeFileSync(this.indexPath, JSON.stringify(this.index, null, 2));
      console.log(`[VectorDB] Saved index with ${this.index.documents.length} documents`);
    } catch (error) {
      console.error('[VectorDB] Error saving index:', error);
    }
  }

  // Get empty index structure
  getEmptyIndex() {
    return {
      documents: [],
      embeddings: [],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalDocuments: 0,
        totalChunks: 0
      }
    };
  }

  // Add documents to the vector database
  async addDocuments(documents) {
    console.log(`[VectorDB] Adding ${documents.length} documents`);
    
    // Generate embeddings for all documents
    const texts = documents.map(doc => doc.content);
    const embeddings = await this.embeddingModel.embedTexts(texts);
    
    // Add to index
    for (let i = 0; i < documents.length; i++) {
      this.index.documents.push(documents[i]);
      this.index.embeddings.push(embeddings[i]);
    }
    
    // Update metadata
    this.index.metadata.totalChunks += documents.length;
    this.index.metadata.updatedAt = new Date().toISOString();
    
    this.saveIndex();
    return documents.length;
  }

  // Search for similar documents using vector similarity
  async search(query, topK = 5, threshold = 0.7) {
    if (this.index.documents.length === 0) {
      return [];
    }

    console.log(`[VectorDB] Searching for: "${query}"`);
    
    // Generate embedding for query
    const queryEmbedding = await this.embeddingModel.embedQuery(query);
    
    // Calculate similarities
    const similarities = this.index.embeddings.map((embedding, index) => ({
      index,
      similarity: EmbeddingModel.cosineSimilarity(queryEmbedding, embedding),
      document: this.index.documents[index]
    }));
    
    // Sort by similarity and filter by threshold
    const results = similarities
      .filter(item => item.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
    
    console.log(`[VectorDB] Found ${results.length} relevant documents`);
    return results;
  }

  // Search with multiple queries (for expanded questions)
  async searchMultiple(queries, topK = 5, threshold = 0.7) {
    const allResults = [];
    
    for (const query of queries) {
      const results = await this.search(query, topK, threshold);
      allResults.push(...results);
    }
    
    // Remove duplicates and re-rank
    const uniqueResults = new Map();
    allResults.forEach(result => {
      const key = result.document.id;
      if (!uniqueResults.has(key) || uniqueResults.get(key).similarity < result.similarity) {
        uniqueResults.set(key, result);
      }
    });
    
    // Sort by similarity and return top results
    return Array.from(uniqueResults.values())
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }

  // Get database statistics
  getStats() {
    return {
      totalDocuments: this.index.documents.length,
      totalChunks: this.index.metadata.totalChunks,
      createdAt: this.index.metadata.createdAt,
      updatedAt: this.index.metadata.updatedAt,
      indexSize: fs.existsSync(this.indexPath) ? fs.statSync(this.indexPath).size : 0
    };
  }

  // Clear the database
  clear() {
    this.index = this.getEmptyIndex();
    this.saveIndex();
    console.log('[VectorDB] Database cleared');
  }
}