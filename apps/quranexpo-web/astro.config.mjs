// @ts-check
import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import clerk from '@clerk/astro';
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'server',
  integrations: [
    tailwind(),
    preact(),
    clerk(),
    vercel()
  ],
  vite: {
    ssr: {
      noExternal: ['@tanstack/react-virtual']
    },
    resolve: {
      alias: {
        'react': 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
        'react/jsx-runtime': 'preact/jsx-runtime',
      },
    },
  }
});
