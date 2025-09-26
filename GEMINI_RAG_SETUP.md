# Gemini RAG Chatbot Setup Guide

## Overview
This implementation provides a RAG (Retrieval-Augmented Generation) based chatbot using Google's Gemini AI with a fixed set of documents. The system retrieves relevant information from your documents and uses Gemini to generate contextual responses.

## Features
- **Document-Based RAG**: Uses fixed set of documents (resume, portfolio, technical skills)
- **Gemini AI Integration**: Powered by Google's Gemini 1.5 Flash model
- **Intelligent Retrieval**: Finds relevant document sections based on user queries
- **Real-time Chat**: Interactive chat interface with loading states
- **Error Handling**: Graceful error handling with user-friendly messages
- **CORS Support**: Properly configured for cross-origin requests

## Setup Instructions

### 1. Environment Variables
Add the following environment variable to your Vercel project settings:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

**How to get Gemini API Key:**
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Navigate to "Get API Key" section
4. Create a new API key
5. Copy the key and add it to your Vercel environment variables

### 2. API Endpoints

#### Chat API: `/api/chat`
**Request Format:**
```json
{
  "message": "What are Kartikey's technical skills?"
}
```

**Response Format:**
```json
{
  "response": "I have extensive experience with both frontend and backend technologies...",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "contextUsed": "Document-based RAG"
}
```

#### Document Management API: `/api/documents-manage`
**GET Request:** Returns list of available documents
**POST Request:** Add new documents (for future enhancement)

### 3. Document Structure

The system uses three main document types:

#### Resume Document (`resume`)
- Complete professional resume
- Contact information, experience, education
- Technical skills and project details
- Certifications and achievements

#### Portfolio Document (`portfolio`)
- Portfolio overview and philosophy
- Project categories and descriptions
- Development approach and future goals
- Contact and collaboration information

#### Technical Skills Document (`technical_skills`)
- Detailed technical skills breakdown
- Frontend, backend, database technologies
- Cloud, DevOps, and AI/ML expertise
- Tools, practices, and soft skills

### 4. RAG Implementation

#### Document Retrieval Process:
1. **Query Analysis**: User question is analyzed for keywords
2. **Document Search**: Relevant documents are identified using keyword matching
3. **Context Extraction**: Relevant sections are extracted from documents
4. **Context Limiting**: Content is limited to 2000 characters for optimal performance
5. **Gemini Processing**: Context is sent to Gemini with the user question

#### Search Algorithm:
- **Title Matching**: Documents with matching titles get higher scores
- **Content Matching**: Documents with matching content get medium scores
- **Keyword Frequency**: Documents with more keyword occurrences get higher scores
- **Relevance Ranking**: Results are sorted by relevance score

### 5. Usage Examples

#### Sample Questions the Chatbot Can Answer:

**Experience Questions:**
- "What was your role at Epsilon?"
- "Tell me about your internship experience"
- "What projects did you work on at Epsilon?"

**Skills Questions:**
- "What programming languages do you know?"
- "Do you have experience with cloud technologies?"
- "What frontend frameworks are you familiar with?"
- "Tell me about your AI/ML experience"

**Project Questions:**
- "Tell me about your capstone project"
- "What was the Document Intelligence Assistant about?"
- "How did you achieve 92% accuracy in your ML project?"
- "What technologies did you use in your consumer safety app?"

**Education Questions:**
- "Where did you study?"
- "What's your GPA?"
- "What degree are you pursuing?"
- "Tell me about your academic background"

**Technical Questions:**
- "What's your experience with React?"
- "Do you know Docker and Kubernetes?"
- "What databases have you worked with?"
- "Tell me about your AWS experience"

### 6. Customization

#### Adding New Documents:
1. Edit `/api/documents.js`
2. Add new document to the `DOCUMENTS` object
3. Include proper metadata (id, title, type, content)
4. Redeploy the API

#### Modifying Document Content:
1. Update the content in the respective document object
2. Update the `lastUpdated` timestamp
3. Redeploy the API

#### Adjusting RAG Parameters:
- **Context Length**: Modify `maxContextLength` in `getRelevantContext()`
- **Max Results**: Change `maxResults` in `searchDocuments()`
- **Search Algorithm**: Enhance the scoring system in `searchDocuments()`

### 7. Technical Implementation

#### File Structure:
```
api/
├── chat.js                 # Main chat API with Gemini integration
├── documents.js            # Document storage and retrieval logic
└── documents-manage.js     # Document management API
```

#### Key Functions:

**`searchDocuments(query, maxResults)`**
- Searches through all documents for relevant content
- Returns ranked results based on relevance score

**`getRelevantContext(query, maxContextLength)`**
- Retrieves relevant context from documents
- Limits context length for optimal performance
- Returns formatted context for Gemini

**`handler(req, res)` in chat.js**
- Processes chat requests
- Integrates with Gemini API
- Returns formatted responses

### 8. Performance Considerations

#### Gemini Model Selection:
- **gemini-1.5-flash**: Fast, cost-effective for most use cases
- **gemini-1.5-pro**: Higher quality, more expensive
- **gemini-1.0-pro**: Alternative option

#### Context Management:
- **Optimal Length**: 2000 characters provides good balance
- **Document Limit**: 3 documents max to avoid token limits
- **Response Length**: Gemini responses are naturally concise

#### Caching Strategy:
- Consider implementing response caching for common questions
- Cache document search results for better performance
- Use Redis or similar for production caching

### 9. Cost Considerations

#### Gemini API Costs:
- **gemini-1.5-flash**: ~$0.075 per 1M input tokens, ~$0.30 per 1M output tokens
- **Estimated Cost**: $2-10/month for moderate usage
- **Monitoring**: Check Google AI Studio for usage and costs

#### Optimization Tips:
- Limit context length to essential information
- Use efficient search algorithms
- Implement response caching
- Monitor token usage regularly

### 10. Troubleshooting

#### Common Issues:

**API Key Not Working:**
- Verify the API key is correctly set in Vercel
- Check that the key has sufficient quota
- Ensure the key has the correct permissions

**No Relevant Context Found:**
- Check if documents contain relevant information
- Verify search algorithm is working correctly
- Consider expanding document content

**Slow Responses:**
- Check Gemini API status
- Consider using gemini-1.5-flash for faster responses
- Optimize context length and document selection

**Inaccurate Responses:**
- Review document content for accuracy
- Adjust the prompt for better guidance
- Consider adding more specific information

### 11. Security Considerations

#### API Key Protection:
- Never expose API keys in client-side code
- Use environment variables for all sensitive data
- Regularly rotate API keys

#### Input Validation:
- Validate and sanitize user inputs
- Implement rate limiting for production
- Monitor for inappropriate content

#### Data Privacy:
- Ensure compliance with privacy regulations
- Consider data retention policies
- Implement proper access controls

### 12. Future Enhancements

#### Advanced RAG Features:
1. **Vector Embeddings**: Implement proper vector search using embeddings
2. **Semantic Search**: Use semantic similarity instead of keyword matching
3. **Document Chunking**: Split large documents into smaller, focused chunks
4. **Hybrid Search**: Combine keyword and semantic search

#### Additional Features:
1. **Document Upload**: Allow dynamic document addition
2. **Conversation Memory**: Maintain context across multiple questions
3. **Analytics**: Track popular questions and user interactions
4. **Multi-language Support**: Support for different languages
5. **Voice Interface**: Add speech-to-text and text-to-speech

#### Integration Options:
1. **Vector Database**: Integrate with Pinecone, Weaviate, or Chroma
2. **Document Processing**: Add PDF, Word, or other format support
3. **Real-time Updates**: Implement real-time document updates
4. **Advanced Analytics**: Add detailed usage analytics and insights

### 13. Support

For issues or questions about the Gemini RAG implementation:
1. Check the Vercel deployment logs
2. Verify environment variables are set correctly
3. Test the API endpoints directly
4. Review the Google AI Studio documentation
5. Check Gemini API status and quotas

## Quick Start Checklist

- [ ] Get Gemini API key from Google AI Studio
- [ ] Add `GEMINI_API_KEY` to Vercel environment variables
- [ ] Deploy the updated code to Vercel
- [ ] Test the chat functionality
- [ ] Verify document retrieval is working
- [ ] Monitor API usage and costs
- [ ] Customize documents as needed
- [ ] Set up monitoring and analytics