# Vercel Deployment Guide

## Environment Variables Required

You need to set these environment variables in your Vercel dashboard:

1. **EMAIL_USER** - Your Gmail address (e.g., your-email@gmail.com)
2. **EMAIL_PASS** - Your Gmail App Password (not your regular password)

### How to get Gmail App Password:
1. Go to your Google Account settings
2. Enable 2-Factor Authentication if not already enabled
3. Go to Security → App passwords
4. Generate a new app password for "Mail"
5. Use this 16-character password as EMAIL_PASS

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from your project directory:**
   ```bash
   vercel
   ```

4. **Set environment variables:**
   ```bash
   vercel env add EMAIL_USER
   vercel env add EMAIL_PASS
   ```

5. **Redeploy with environment variables:**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub Integration

1. **Push your code to GitHub** (if not already done)

2. **Go to [vercel.com](https://vercel.com)** and sign in

3. **Click "New Project"**

4. **Import your GitHub repository**

5. **Configure the project:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

6. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add `EMAIL_USER` and `EMAIL_PASS`

7. **Deploy**

## Important Notes

- The API endpoint `/api/send-email` will be automatically available at `https://your-domain.vercel.app/api/send-email`
- Make sure your frontend code is calling the correct API endpoint
- Vercel provides automatic HTTPS and global CDN
- The serverless function has a 10-second timeout limit

## Testing

After deployment, test your contact form to ensure emails are being sent correctly.

## Cleanup

After successful deployment, you can remove:
- `render.yaml`
- `server.js` (if you want to keep it for local development, you can keep it)