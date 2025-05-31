// @ts-check
import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';
import clerk from '@clerk/astro';
:start_line:5
-------
:start_line:5
-------
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

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
