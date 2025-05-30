// @ts-check
import node from '@astrojs/node';
import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';
import clerk from '@clerk/astro';
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  outDir: './dist',
  integrations: [
    preact({
      include: ['**/*.tsx']
    }),
    tailwind(),
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
