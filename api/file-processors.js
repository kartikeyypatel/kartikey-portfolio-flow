import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';

// File processors for different document types
export const fileProcessors = {
  // Process PDF files (simplified for now - requires pdf-parse to be properly configured)
  async '.pdf'(filePath) {
    try {
      // For now, return a placeholder - PDF processing requires additional setup
      console.warn(`PDF processing not fully configured for ${filePath}`);
      return `[PDF Document: ${path.basename(filePath)} - Content extraction requires additional setup]`;
    } catch (error) {
      console.error(`Error processing PDF ${filePath}:`, error);
      return '';
    }
  },

  // Process DOCX files
  async '.docx'(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (error) {
      console.error(`Error processing DOCX ${filePath}:`, error);
      return '';
    }
  },

  // Process TXT files
  async '.txt'(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error(`Error processing TXT ${filePath}:`, error);
      return '';
    }
  },

  // Process MD files
  async '.md'(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error(`Error processing MD ${filePath}:`, error);
      return '';
    }
  },

  // Process MDX files
  async '.mdx'(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error(`Error processing MDX ${filePath}:`, error);
      return '';
    }
  }
};

// Get supported file extensions
export function getSupportedExtensions() {
  return Object.keys(fileProcessors);
}

// Check if file extension is supported
export function isSupportedFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return getSupportedExtensions().includes(ext);
}

// Process a single file
export async function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const processor = fileProcessors[ext];
  
  if (!processor) {
    console.warn(`Unsupported file type: ${ext} for ${filePath}`);
    return '';
  }

  return await processor(filePath);
}

// Process all files in a directory
export async function processDirectory(dirPath) {
  const files = fs.existsSync(dirPath) ? fs.readdirSync(dirPath) : [];
  const results = [];

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isFile() && isSupportedFile(fullPath)) {
      console.log(`Processing: ${file}`);
      const content = await processFile(fullPath);
      if (content.trim()) {
        results.push({
          filename: file,
          path: fullPath,
          content: content.trim(),
          size: content.length
        });
      }
    }
  }

  return results;
}