import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Simple local vector store with cosine similarity
export class LocalVectorStore {
  constructor(indexPath) {
    this.indexPath = indexPath;
    this.index = { documents: [], vectors: [] };
    if (fs.existsSync(indexPath)) {
      try {
        this.index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
      } catch {}
    }
  }

  save() {
    fs.mkdirSync(path.dirname(this.indexPath), { recursive: true });
    fs.writeFileSync(this.indexPath, JSON.stringify(this.index));
  }

  addDocument(doc) {
    this.index.documents.push(doc);
  }

  addVector(vector) {
    this.index.vectors.push(vector);
  }

  // cosine similarity
  static similarity(a, b) {
    const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
    const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
    const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
    return dot / (magA * magB + 1e-8);
  }

  search(queryVector, k = 5) {
    const scores = this.index.vectors.map((vec, i) => ({
      i,
      score: LocalVectorStore.similarity(queryVector, vec),
    }));
    scores.sort((a, b) => b.score - a.score);
    const results = scores.slice(0, k).map(({ i, score }) => ({
      score,
      document: this.index.documents[i],
    }));
    return results;
  }
}

// Embedding helper using Gemini text-embedding-004
export async function embedTexts(texts) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const batches = [];
  const batchSize = 32;
  for (let i = 0; i < texts.length; i += batchSize) {
    batches.push(texts.slice(i, i + batchSize));
  }
  const vectors = [];
  for (const batch of batches) {
    const res = await embeddingModel.embedContent({
      content: batch.join('\n\n'),
    });
    // The API returns a single embedding; for simplicity we split evenly per text
    const full = res.embedding.values;
    const per = Math.floor(full.length / batch.length) || full.length;
    for (let i = 0; i < batch.length; i++) {
      vectors.push(full.slice(i * per, (i + 1) * per));
    }
  }
  return vectors;
}

// Chunk text into manageable pieces
export function chunkText(text, chunkSize = 1000, overlap = 200) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(text.length, start + chunkSize);
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap;
  }
  return chunks;
}

