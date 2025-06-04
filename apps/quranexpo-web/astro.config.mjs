import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import clerk from '@clerk/astro';
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [
    tailwind(),
    react(),
    clerk()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://gentedekhorasan.vercel.app/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
      },
    },
  },
  vite: {
    ssr: {
      noExternal: ['@tanstack/react-virtual']
    },
    resolve: {
      alias: {
        // Eliminar alias de Preact
      },
    },
  }
});
