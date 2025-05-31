:start_line:1
-------
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';
import clerk from '@clerk/astro';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [
    tailwind(),
    preact(),
    clerk()
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
