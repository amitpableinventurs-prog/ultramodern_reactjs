import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // BASE_PATH=/ultramodern/ builds the GitHub Pages preview; the real site uses '/'
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  build: { chunkSizeWarningLimit: 1500 },
  ssr: { noExternal: ['react-helmet-async'] },
  server: {
    // the PHP CMS API (npm run api) during local development
    proxy: { '/api': 'http://127.0.0.1:8091' },
  },
});
