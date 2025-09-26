import fs from 'fs';
import path from 'path';
import { VectorDatabase } from './vector-database.js';
import { processDirectory } from '../file-processors.js';

// Chunk text into manageable pieces with overlap
function chunkText(text, chunkSize = 1000, overlap = 200) {
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

// Build advanced vector index from documents directory
export async function buildAdvancedIndex({ 
  documentsDir = 'documents', 
  indexPath = '.cache/vector-db.json',
  chunkSize = 500,
  overlap = 100
} = {}) {
  console.log('[Build Index] Starting advanced index build');
  
  const absoluteDir = path.resolve(process.cwd(), documentsDir);
  
  if (!fs.existsSync(absoluteDir)) {
    console.warn(`[Build Index] Documents directory not found: ${absoluteDir}`);
    return { count: 0, indexPath, files: 0 };
  }

  // Process all files in the directory
  const fileResults = await processDirectory(absoluteDir);
  
  if (fileResults.length === 0) {
    console.warn('[Build Index] No supported documents found');
    return { count: 0, indexPath, files: 0 };
  }

  console.log(`[Build Index] Processing ${fileResults.length} files`);

  // Initialize vector database
  const vectorDB = new VectorDatabase(indexPath);
  
  // Clear existing index
  vectorDB.clear();

  const allDocuments = [];

  // Process each file and create chunks
  for (const fileResult of fileResults) {
    console.log(`[Build Index] Processing: ${fileResult.filename}`);
    
    const chunks = chunkText(fileResult.content, chunkSize, overlap);
    
    chunks.forEach((chunk, idx) => {
      allDocuments.push({
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
      });
    });
  }

  console.log(`[Build Index] Created ${allDocuments.length} chunks from ${fileResults.length} files`);

  // Add documents to vector database (this will generate embeddings)
  const addedCount = await vectorDB.addDocuments(allDocuments);

  const stats = vectorDB.getStats();
  
  console.log('[Build Index] Index build completed successfully');
  console.log(`[Build Index] Stats:`, stats);

  return {
    count: addedCount,
    indexPath,
    files: fileResults.length,
    chunks: allDocuments.length,
    stats
  };
}

// If run as a script
if (process.argv[1] && process.argv[1].includes('build-index.js')) {
  buildAdvancedIndex().then((result) => {
    console.log('[Build Index] Completed:', result);
    process.exit(0);
  }).catch((error) => {
    console.error('[Build Index] Error:', error);
    process.exit(1);
  });
}