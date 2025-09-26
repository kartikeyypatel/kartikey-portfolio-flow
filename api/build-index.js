import fs from 'fs';
import path from 'path';
import { LocalVectorStore, embedTexts, chunkText } from './vector-store.js';

// Build a vector index from a directory of text/markdown files
// Usage: call programmatically on deploy or locally to generate index.json

export async function buildIndex({ documentsDir = 'documents', indexPath = '.cache/rag-index.json' } = {}) {
  const absoluteDir = path.resolve(process.cwd(), documentsDir);
  const files = fs.existsSync(absoluteDir) ? fs.readdirSync(absoluteDir) : [];
  const texts = [];
  const docs = [];

  for (const file of files) {
    const full = path.join(absoluteDir, file);
    if (!fs.statSync(full).isFile()) continue;
    const ext = path.extname(file).toLowerCase();
    if (!['.txt', '.md', '.mdx'].includes(ext)) continue;
    const content = fs.readFileSync(full, 'utf-8');
    const chunks = chunkText(content);
    chunks.forEach((chunk, idx) => {
      texts.push(chunk);
      docs.push({ id: `${file}#${idx}`, source: file, content: chunk });
    });
  }

  if (texts.length === 0) {
    console.warn('[build-index] No documents found in', absoluteDir);
  }

  const vectors = await embedTexts(texts);
  const store = new LocalVectorStore(indexPath);
  store.index = { documents: docs, vectors };
  store.save();
  return { count: docs.length, indexPath };
}

// If run as a script
if (process.argv[1] && process.argv[1].includes('build-index.js')) {
  buildIndex().then((res) => {
    console.log('[build-index] Completed:', res);
  }).catch((err) => {
    console.error('[build-index] Error:', err);
    process.exit(1);
  });
}

