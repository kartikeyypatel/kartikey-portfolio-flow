import fs from 'fs';
import path from 'path';
import { processDirectory } from './file-processors.js';

// Simple chunking function
function chunkText(text, chunkSize = 500, overlap = 100) {
  const chunks = [];
  let start = 0;
  
  while (start < text.length) {
    const end = Math.min(text.length, start + chunkSize);
    const chunk = text.slice(start, end);
    
    // Try to break at sentence boundaries
    let actualEnd = end;
    if (end < text.length) {
      const lastSentence = chunk.lastIndexOf('.');
      const lastNewline = chunk.lastIndexOf('\n');
      const breakPoint = Math.max(lastSentence, lastNewline);
      
      if (breakPoint > start + chunkSize * 0.5) {
        actualEnd = start + breakPoint + 1;
      }
    }
    
    chunks.push({
      content: text.slice(start, actualEnd).trim(),
      start,
      end: actualEnd
    });
    
    start = actualEnd - overlap;
    if (start >= text.length) break;
  }
  
  return chunks;
}

// Simple vector store for testing
class SimpleVectorStore {
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
    fs.writeFileSync(this.indexPath, JSON.stringify(this.index, null, 2));
  }

  addDocument(doc) {
    this.index.documents.push(doc);
  }

  addVector(vector) {
    this.index.vectors.push(vector);
  }
}

// Simple embedding function (placeholder - will be replaced with actual embeddings)
function createSimpleEmbedding(text) {
  // Create a simple hash-based "embedding" for testing
  const words = text.toLowerCase().split(/\s+/);
  const embedding = new Array(100).fill(0);
  
  words.forEach(word => {
    const hash = word.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(hash) % 100;
    embedding[index] += 1;
  });
  
  // Normalize
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => magnitude > 0 ? val / magnitude : 0);
}

// Build simple index for testing
export async function buildSimpleIndex({ 
  documentsDir = 'documents', 
  indexPath = '.cache/simple-index.json'
} = {}) {
  console.log('[Simple Build] Starting simple index build');
  
  const absoluteDir = path.resolve(process.cwd(), documentsDir);
  
  if (!fs.existsSync(absoluteDir)) {
    console.warn(`[Simple Build] Documents directory not found: ${absoluteDir}`);
    return { count: 0, indexPath, files: 0 };
  }

  // Process all files in the directory
  const fileResults = await processDirectory(absoluteDir);
  
  if (fileResults.length === 0) {
    console.warn('[Simple Build] No supported documents found');
    return { count: 0, indexPath, files: 0 };
  }

  console.log(`[Simple Build] Processing ${fileResults.length} files`);

  // Initialize simple vector store
  const vectorStore = new SimpleVectorStore(indexPath);
  vectorStore.index = { documents: [], vectors: [] };

  let totalChunks = 0;

  // Process each file and create chunks
  for (const fileResult of fileResults) {
    console.log(`[Simple Build] Processing: ${fileResult.filename}`);
    
    const chunks = chunkText(fileResult.content, 500, 100);
    
    chunks.forEach((chunk, idx) => {
      const doc = {
        id: `${fileResult.filename}#chunk_${idx}`,
        source: fileResult.filename,
        path: fileResult.path,
        content: chunk.content,
        chunkIndex: idx,
        totalChunks: chunks.length,
        startPos: chunk.start,
        endPos: chunk.end,
        size: chunk.content.length,
        metadata: {
          fileSize: fileResult.size,
          chunkSize: chunk.content.length,
          processedAt: new Date().toISOString()
        }
      };
      
      // Create simple embedding
      const embedding = createSimpleEmbedding(chunk.content);
      
      vectorStore.addDocument(doc);
      vectorStore.addVector(embedding);
      totalChunks++;
    });
  }

  console.log(`[Simple Build] Created ${totalChunks} chunks from ${fileResults.length} files`);

  // Save the index
  vectorStore.save();
  
  console.log('[Simple Build] Index build completed successfully');

  return {
    count: totalChunks,
    indexPath,
    files: fileResults.length,
    chunks: totalChunks
  };
}

// If run as a script
if (process.argv[1] && process.argv[1].includes('simple-build-index.js')) {
  buildSimpleIndex().then((result) => {
    console.log('[Simple Build] Completed:', result);
    process.exit(0);
  }).catch((error) => {
    console.error('[Simple Build] Error:', error);
    process.exit(1);
  });
}