
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    // Remove proxy for Vercel deployment - API routes will be handled by Vercel
  },
  plugins: [react()],
  optimizeDeps: {
    include: ['@splinetool/react-spline'],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
