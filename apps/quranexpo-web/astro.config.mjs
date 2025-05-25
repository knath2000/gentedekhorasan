// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind'; // Re-enable Astro Tailwind integration

// https://astro.build/config
export default defineConfig({
  output: 'static',
  outDir: './dist',
  integrations: [
    // Configurar Preact para todos los componentes TSX
    preact({
      include: ['**/*.tsx']
    }),
    
    tailwind()
  ],
  // Configuración adicional para evitar conflictos
  vite: {
    ssr: {
      // Evitar conflictos de hidratación
      noExternal: ['@tanstack/react-virtual']
    }
  }
});
