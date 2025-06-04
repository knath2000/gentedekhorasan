import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import clerk from '@clerk/astro';
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'server',  // Ensure SSR is enabled
  adapter: vercel(),
  integrations: [
    tailwind(),
    preact(),
    clerk()
  ],
  vite: {
    ssr: {
      noExternal: ['@tanstack/react-virtual', '@nanostores/preact']  // Add Nanostores to SSR exclusions if needed
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
