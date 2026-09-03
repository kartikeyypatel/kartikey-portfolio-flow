
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
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
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
}));
