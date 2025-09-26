# Vercel Deployment Guide for RAG Chatbot

## Prerequisites
- GitHub repository with your code
- Vercel account
- Gemini API key

## Step 1: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a Vite project
5. Click "Deploy"

### Option B: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

## Step 2: Add Environment Variables

In your Vercel dashboard:
1. Go to your project
2. Click "Settings" → "Environment Variables"
3. Add the following variables:

### Required Environment Variables:
```
GEMINI_API_KEY=your_gemini_api_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
```

### For Production:
- Set `GEMINI_API_KEY` for Production, Preview, and Development
- Set `EMAIL_USER` and `EMAIL_PASS` for Production, Preview, and Development

## Step 3: Redeploy

After adding environment variables:
1. Go to "Deployments" tab
2. Click "Redeploy" on the latest deployment
3. Or push a new commit to trigger automatic deployment

## Step 4: Add Documents to Vercel

Since the `documents/` folder is in `.gitignore` for privacy, you need to manually add it to your Vercel deployment:

### Option A: Via Vercel CLI
```bash
# Create documents folder in your project root
mkdir documents
# Add your kartikey-info.txt file to the documents folder
# Then deploy
vercel --prod
```

### Option B: Via Vercel Dashboard
1. Go to your project in Vercel dashboard
2. Go to "Settings" → "Functions"
3. Upload your `documents/kartikey-info.txt` file
4. Redeploy your project

### Option C: Add to Git temporarily (NOT RECOMMENDED)
```bash
# Only if you want to include documents in Git (not recommended for privacy)
git add documents/
git commit -m "Add documents for deployment"
git push
```

## Step 5: Test Your Deployment

1. Visit your Vercel URL (e.g., `https://your-project.vercel.app`)
2. Test the chat functionality
3. Test the contact form

## File Structure for Vercel

```
your-project/
├── api/
│   ├── simple-chat.js          # RAG chatbot API
│   └── send-email.js           # Contact form API
├── documents/
│   └── kartikey-info.txt       # Your information
├── src/
│   └── components/
│       └── ui/
│           └── ChatModal.tsx   # Chat interface
├── vercel.json                 # Vercel configuration
├── package.json
└── vite.config.ts
```

## Important Notes

### API Routes
- `/api/simple-chat` - RAG chatbot endpoint
- `/api/send-email` - Contact form endpoint

### Documents Folder
- The `documents/` folder is in `.gitignore` for privacy
- You need to manually add your documents to Vercel for deployment
- See "Adding Documents to Vercel" section below

### CORS
- CORS is configured for all origins (`*`)
- This allows your frontend to call the API endpoints

### Timeout Settings
- API functions have 30-second timeout
- This should be sufficient for Gemini API calls

## Troubleshooting

### Common Issues:

1. **JSX Build Errors (TS17004)**
   - ✅ **FIXED**: Updated TypeScript configuration with proper JSX settings
   - ✅ **FIXED**: Added `jsx: "react-jsx"` and `jsxImportSource: "react"` to tsconfig
   - ✅ **FIXED**: Created `.vercelignore` to exclude unnecessary files
   - If still failing, check Vercel build logs for specific error details

2. **Environment Variables Not Working**
   - Make sure variables are set for the correct environment (Production/Preview/Development)
   - Redeploy after adding variables

3. **API Routes Not Found**
   - Check that `vercel.json` is in the root directory
   - Ensure API files are in the `api/` folder

4. **Documents Not Found**
   - Verify `documents/` folder is manually added to Vercel deployment
   - Check that `kartikey-info.txt` exists in the deployed documents folder
   - Use Vercel CLI or dashboard to add documents

5. **Build Failures**
   - Check Vercel build logs
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript configuration is correct

### Debug Steps:
1. Check Vercel function logs
2. Test API endpoints directly
3. Verify environment variables are set
4. Check file paths in serverless functions

## Success Indicators

✅ Chat input opens modal
✅ Chat responses are generated
✅ Contact form sends emails
✅ No console errors
✅ Fast response times (< 5 seconds)

## Next Steps

After successful deployment:
1. Update your domain settings if using custom domain
2. Set up monitoring and analytics
3. Consider adding rate limiting for production use
4. Monitor API usage and costs