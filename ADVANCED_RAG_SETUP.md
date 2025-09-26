# Advanced RAG System Setup Guide

## Overview
This implementation provides a comprehensive Advanced RAG (Retrieval-Augmented Generation) system following the architecture shown in the diagram. The system includes all four stages: Pre-Retrieval, Retrieval, Post-Retrieval, and Generation.

## Architecture Components

### 1. Pre-Retrieval Stage (`api/advanced-rag/pre-retrieval.js`)
- **Question Rewriting**: Rephrases questions for better retrieval
- **Question Expansion**: Adds synonyms and related terms
- **Query Optimization**: Improves search effectiveness

### 2. Embedding Model (`api/advanced-rag/embedding-model.js`)
- **Gemini text-embedding-004**: High-quality vector embeddings
- **Batch Processing**: Efficient handling of multiple texts
- **Similarity Calculation**: Cosine similarity for vector matching

### 3. Vector Database (`api/advanced-rag/vector-database.js`)
- **Local Storage**: JSON-based vector index
- **Semantic Search**: Vector similarity search
- **Multi-Query Support**: Handles expanded question variations
- **Metadata Tracking**: Document source and chunk information

### 4. Post-Retrieval Stage (`api/advanced-rag/post-retrieval.js`)
- **Re-ranking**: LLM-based relevance scoring
- **Context Compression**: Intelligent content summarization
- **Token Management**: Optimizes context length

### 5. Generation Stage (`api/advanced-rag/generation.js`)
- **Gemini 1.5 Flash**: Fast, high-quality responses
- **Confidence Scoring**: Response quality assessment
- **Follow-up Questions**: Suggests related queries
- **Conversation Context**: Maintains chat history

## Setup Instructions

### 1. Environment Variables
Add to your Vercel project settings:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Dependencies
Add to `package.json`:
```json
{
  "dependencies": {
    "mammoth": "^1.6.0",
    "pdf-parse": "^1.1.1",
    "@google/generative-ai": "^0.2.1"
  }
}
```

### 3. Document Structure
Create your documents directory:
```
kartikey-portfolio-flow/
├── documents/           ← Put your files here
│   ├── resume.pdf
│   ├── experience.docx
│   ├── skills.txt
│   ├── projects.md
│   └── education.pdf
├── .cache/
│   └── vector-db.json  ← Generated vector index
├── api/
│   └── advanced-rag/
└── ...
```

### 4. Build the Vector Index
```bash
# Build the advanced vector index
npm run rag:build

# Or run directly
node api/advanced-rag/build-index.js
```

### 5. API Endpoints

#### Advanced Chat API: `/api/chat-advanced`
**Request Format:**
```json
{
  "message": "What are Kartikey's technical skills?",
  "conversationHistory": [
    {"role": "user", "content": "Previous question"},
    {"role": "assistant", "content": "Previous answer"}
  ],
  "options": {
    "topK": 5,
    "similarityThreshold": 0.7,
    "maxContextTokens": 2000,
    "includeFollowUps": true
  }
}
```

**Response Format:**
```json
{
  "response": "I have extensive experience with both frontend and backend technologies...",
  "confidence": 0.85,
  "contextUsed": true,
  "followUpQuestions": [
    "What specific projects have you worked on with React?",
    "Do you have experience with cloud technologies?"
  ],
  "metadata": {
    "originalQuestion": "What are Kartikey's technical skills?",
    "rewrittenQuestion": "What technical skills and programming languages does Kartikey Patel have experience with?",
    "expandedQuestions": ["technical skills", "programming languages", "technologies"],
    "originalChunkCount": 8,
    "finalChunkCount": 5,
    "contextLength": 1850,
    "model": "gemini-1.5-flash",
    "timestamp": "2024-01-15T10:30:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Advanced Features

### 1. Question Processing Pipeline
- **Original Question**: "What are your skills?"
- **Rewritten**: "What technical skills and programming languages does Kartikey Patel have experience with?"
- **Expanded**: ["technical skills", "programming languages", "technologies", "expertise", "competencies"]

### 2. Vector Search
- **Multi-Query Search**: Searches with all expanded question variations
- **Similarity Threshold**: Filters results by relevance (default: 0.7)
- **Top-K Retrieval**: Returns most relevant chunks (default: 5)

### 3. Context Optimization
- **Re-ranking**: LLM reorders chunks by relevance to original question
- **Compression**: Summarizes context to fit token limits
- **Source Attribution**: Tracks which documents provided information

### 4. Response Generation
- **Confidence Scoring**: 0.1-0.95 based on context relevance
- **Follow-up Questions**: Suggests related queries
- **Conversation Memory**: Maintains context across multiple questions

## Configuration Options

### Pipeline Parameters
```javascript
const options = {
  topK: 5,                    // Number of chunks to retrieve
  similarityThreshold: 0.7,   // Minimum similarity score
  maxContextTokens: 2000,     // Maximum context length
  includeFollowUps: true,     // Generate follow-up questions
  conversationHistory: []     // Previous conversation
};
```

### Index Building Parameters
```javascript
const buildOptions = {
  documentsDir: 'documents',  // Source directory
  indexPath: '.cache/vector-db.json', // Index location
  chunkSize: 1000,           // Chunk size in characters
  overlap: 200               // Overlap between chunks
};
```

## Performance Optimization

### 1. Embedding Caching
- Vector embeddings are cached in the index
- No re-computation on subsequent searches
- Fast retrieval for similar queries

### 2. Batch Processing
- Documents processed in batches
- Efficient memory usage
- Progress tracking during index build

### 3. Context Management
- Intelligent chunking with sentence boundaries
- Overlap between chunks for context continuity
- Token-aware compression

## Monitoring and Analytics

### 1. Pipeline Statistics
```javascript
const stats = ragPipeline.getStats();
console.log(stats);
// {
//   vectorDB: {
//     totalDocuments: 150,
//     totalChunks: 150,
//     createdAt: "2024-01-15T10:00:00.000Z",
//     updatedAt: "2024-01-15T10:30:00.000Z",
//     indexSize: 2048576
//   },
//   pipeline: {
//     preRetrieval: 'active',
//     retrieval: 'active',
//     postRetrieval: 'active',
//     generation: 'active'
//   }
// }
```

### 2. Response Metadata
- Query processing time
- Chunk retrieval statistics
- Context compression ratios
- Confidence scores

## Troubleshooting

### Common Issues

**1. No Documents Found**
- Check if `documents/` directory exists
- Verify file formats (PDF, DOCX, TXT, MD)
- Ensure files are not empty

**2. Low Confidence Scores**
- Increase `similarityThreshold`
- Add more relevant documents
- Improve document quality and structure

**3. Context Too Long**
- Reduce `maxContextTokens`
- Increase chunk overlap
- Improve compression settings

**4. Slow Performance**
- Reduce `topK` parameter
- Optimize chunk sizes
- Use faster embedding model

## Cost Considerations

### Gemini API Costs
- **text-embedding-004**: ~$0.000075 per 1K tokens
- **gemini-1.5-flash**: ~$0.075 per 1M input tokens, ~$0.30 per 1M output tokens

### Estimated Monthly Costs
- **Index Building**: $1-5 (one-time per document update)
- **Query Processing**: $5-20 (based on usage)
- **Total**: $6-25/month for moderate usage

## Best Practices

### 1. Document Preparation
- Use clear, well-structured documents
- Include relevant keywords and phrases
- Maintain consistent formatting
- Keep documents focused and specific

### 2. Query Optimization
- Ask specific, clear questions
- Use relevant technical terms
- Provide context when needed
- Follow up with related questions

### 3. Performance Tuning
- Monitor confidence scores
- Adjust similarity thresholds
- Optimize chunk sizes
- Regular index updates

## Future Enhancements

### 1. Advanced Features
- **Hybrid Search**: Combine vector and keyword search
- **Multi-Modal**: Support images and documents
- **Real-time Updates**: Live document indexing
- **Analytics Dashboard**: Usage and performance metrics

### 2. Integration Options
- **Vector Databases**: Pinecone, Weaviate, Chroma
- **Document Processing**: Advanced OCR, table extraction
- **Caching**: Redis for response caching
- **Monitoring**: Prometheus, Grafana integration

## Support

For issues or questions:
1. Check the console logs for detailed error messages
2. Verify environment variables are set correctly
3. Test the vector index build process
4. Review the pipeline statistics
5. Check Gemini API quotas and limits