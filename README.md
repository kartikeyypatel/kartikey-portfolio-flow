# Kartikey Patel — Portfolio

Personal portfolio site for Kartikey Patel, Software Engineer. Built as a single-page React app with an AI chatbot (RAG over resume/project data via Gemini) and an email-backed contact form.

**Live site:** [kartikeypatel.com](https://kartikeypatel.com/)

## Features

- Interactive hero, experience, projects, education, and achievements sections
- AI chat assistant that answers questions about my background using retrieval-augmented generation
- Contact form that sends email via Nodemailer
- Resume viewer/downloader
- Responsive design with Tailwind CSS and shadcn/ui components

## Tech Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Express](https://expressjs.com/) (local dev server) / [Vercel serverless functions](https://vercel.com/docs/functions) (production)
- [Google Gemini](https://ai.google.dev/) for the chat assistant
- [Nodemailer](https://nodemailer.com/) for the contact form

## Getting Started

Requires Node.js and npm.

```sh
# Clone the repository
git clone https://github.com/kartikeyypatel/kartikey-portfolio-flow.git
cd kartikey-portfolio-flow

# Install dependencies
npm install

# Start the frontend dev server
npm run dev

# In a separate terminal, start the API server (contact form + chat)
node server.js
```

The app runs at `http://localhost:8080` by default.

### Environment Variables

Create a `.env` file in the project root with:

```
GEMINI_API_KEY=your_google_gemini_api_key
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint
- `npm run rag:build` — rebuild the RAG document index used by the chat assistant

## Deployment

Deployed on [Vercel](https://vercel.com/). Pushes to `main` build automatically via `vercel.json`, with `api/simple-chat.js` and `api/send-email.js` running as serverless functions.

## License

This is a personal portfolio project. Feel free to browse the code for reference, but please don't reuse the content/branding as your own.
