# RAG-Based Chatbot Setup

## Overview
This implementation provides a RAG (Retrieval-Augmented Generation) based chatbot that can answer questions about Kartikey Patel's experience, skills, projects, and background using OpenAI's GPT models.

## Features
- **Intelligent Responses**: Uses OpenAI GPT-3.5-turbo to generate contextual responses
- **Resume-Based Knowledge**: Trained on comprehensive resume and portfolio data
- **Real-time Chat**: Interactive chat interface with loading states
- **Error Handling**: Graceful error handling with user-friendly messages
- **CORS Support**: Properly configured for cross-origin requests

## Setup Instructions

### 1. Environment Variables
Add the following environment variable to your Vercel project settings:

```
OPENAI_API_KEY=your_openai_api_key_here
```

**How to get OpenAI API Key:**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your Vercel environment variables

### 2. API Endpoint
The chatbot API is available at: `/api/chat`

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
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 3. Data Sources
The chatbot is trained on the following data:

#### Personal Information
- Name, title, location, contact information
- GitHub and LinkedIn profiles

#### Professional Experience
- Epsilon Software Engineer Intern role
- Key achievements and technologies used
- Project delivery metrics

#### Education
- NJIT Masters in Computer Science (3.85/4.0 GPA)
- University of Mumbai Bachelors (3.8/4.0 GPA)

#### Technical Skills
- **Frontend**: React, TypeScript, JavaScript, Angular, HTML/CSS, Tailwind CSS
- **Backend**: Java, Spring Boot, Node.js, Express, Python, Django
- **Databases**: MySQL, Oracle, PostgreSQL, MongoDB
- **Cloud**: AWS, Docker, Kubernetes, GCP, Azure
- **Tools**: Git, CI/CD, Puppeteer, LangChain, OpenAI GPT-4, Pinecone

#### Projects
1. **Consumer Safety Application (Capstone)**
   - React Native, TypeScript, Puppeteer, Node.js, Express, Google Cloud
   - Automated FDA MedWatch form processing

2. **Enterprise Document Intelligence Assistant**
   - LangChain, OpenAI GPT-4, AWS, Docker, Pinecone, Kubernetes
   - 89% accuracy in document Q&A processing

3. **Secure Web Sign-Up System**
   - Java, OAuth 2.0, XML, MySQL, AES Encryption
   - 100% data protection with secure access codes

4. **TV Shows and Movies Analysis**
   - Python, Pandas, Beautiful Soup, Data Mining
   - 92% accuracy in popularity prediction

## Usage Examples

### Sample Questions the Chatbot Can Answer:

1. **Experience Questions:**
   - "What was your role at Epsilon?"
   - "Tell me about your internship experience"
   - "What projects did you work on?"

2. **Skills Questions:**
   - "What programming languages do you know?"
   - "Do you have experience with cloud technologies?"
   - "What frontend frameworks are you familiar with?"

3. **Project Questions:**
   - "Tell me about your capstone project"
   - "What was the Document Intelligence Assistant about?"
   - "How did you achieve 92% accuracy in your ML project?"

4. **Education Questions:**
   - "Where did you study?"
   - "What's your GPA?"
   - "What degree are you pursuing?"

5. **General Questions:**
   - "What makes you a good software engineer?"
   - "What are your career goals?"
   - "How can I contact you?"

## Technical Implementation

### API Structure (`/api/chat.js`)
- **Input Validation**: Ensures message is provided
- **Context Creation**: Builds comprehensive context from resume data
- **OpenAI Integration**: Uses GPT-3.5-turbo for response generation
- **Error Handling**: Graceful error handling with fallback responses
- **CORS Configuration**: Proper headers for cross-origin requests

### Frontend Integration (`ChatModal.tsx`)
- **Real-time Chat**: Interactive chat interface
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages
- **Message History**: Maintains conversation context

## Customization

### Adding More Data
To add more information to the chatbot's knowledge base:

1. Edit the `KARTIKEY_DATA` object in `/api/chat.js`
2. Add new sections or expand existing ones
3. Update the `createContext()` function if needed
4. Redeploy the API

### Modifying Responses
To change how the AI responds:

1. Edit the `systemPrompt` in `/api/chat.js`
2. Adjust the guidelines and tone
3. Modify the model parameters (temperature, max_tokens)
4. Redeploy the API

### Styling
The chat interface uses the existing portfolio theme:
- Dark background with cyan accents
- Consistent with the overall design
- Responsive layout for mobile and desktop

## Troubleshooting

### Common Issues:

1. **API Key Not Working**
   - Verify the API key is correctly set in Vercel
   - Check that the key has sufficient credits
   - Ensure the key has the correct permissions

2. **CORS Errors**
   - The API includes proper CORS headers
   - If issues persist, check Vercel deployment logs

3. **Slow Responses**
   - GPT-3.5-turbo is optimized for speed
   - Consider upgrading to GPT-4 for better quality (higher cost)
   - Check OpenAI API status

4. **Inaccurate Responses**
   - Review the context data in `KARTIKEY_DATA`
   - Adjust the system prompt for better guidance
   - Consider adding more specific information

## Cost Considerations

- **OpenAI API Costs**: Based on token usage
- **GPT-3.5-turbo**: ~$0.002 per 1K tokens (input/output)
- **Estimated Cost**: $5-20/month for moderate usage
- **Monitoring**: Check OpenAI dashboard for usage and costs

## Future Enhancements

1. **Vector Database**: Implement Pinecone or similar for better document retrieval
2. **File Upload**: Allow users to upload documents for analysis
3. **Conversation Memory**: Maintain context across multiple questions
4. **Analytics**: Track popular questions and user interactions
5. **Multi-language Support**: Support for different languages
6. **Voice Interface**: Add speech-to-text and text-to-speech capabilities

## Security Considerations

1. **API Key Protection**: Never expose API keys in client-side code
2. **Rate Limiting**: Consider implementing rate limiting for production
3. **Input Sanitization**: Validate and sanitize user inputs
4. **Content Filtering**: Monitor for inappropriate content
5. **Data Privacy**: Ensure compliance with privacy regulations

## Support

For issues or questions about the RAG chatbot implementation:
1. Check the Vercel deployment logs
2. Verify environment variables are set correctly
3. Test the API endpoint directly
4. Review the OpenAI API documentation