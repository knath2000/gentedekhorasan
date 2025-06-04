import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
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
      '/v1': { // Cambiar la clave del proxy a /v1
        target: 'https://gentedekhorasan.vercel.app/api/v1', // Apuntar directamente a la base de la API
        changeOrigin: true, // Mantener changeOrigin
        // Eliminar rewrite ya que la URL ya contendrá /v1
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
