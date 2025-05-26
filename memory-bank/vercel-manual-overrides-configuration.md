# Configuraciones Manuales de Vercel Dashboard

**Date:** 2025-05-26
**Related:** `memory-bank/vercel-dashboard-configuration-solution.md`

## 1. apps/quran-data-api (✅ FUNCIONANDO)

### Vercel Dashboard Settings

**Project Name:** `quran-data-api`

#### Build & Development Settings ✅ WORKING CONFIGURATION
- **Framework Preset:** Other
- **Root Directory:** `apps/quran-data-api`
- **Build Command:** (leave EMPTY - no build needed for serverless)
- **Output Directory:** `.` ← CRITICAL: Use current directory as output
- **Install Command:** `pnpm install`
- **Development Command:** (leave EMPTY)

✅ **PROVEN WORKING SETUP:**
- Root Directory isolates from monorepo TurboRepo detection
- Output Directory = `.` tells Vercel to use current directory (apps/quran-data-api)
- This configuration has worked successfully before
- Serverless functions are deployed from `/api/` folder automatically

#### Node.js Version
- **Node.js Version:** `18.x`

#### Environment Variables
```
# Database Connection
DATABASE_URL=postgresql://[username]:[password]@[host]/[database]?sslmode=require

# Vercel Edge Config (if using)
EDGE_CONFIG=https://edge-config.vercel.com/[token]

# CORS Origins (optional)
ALLOWED_ORIGINS=https://quranexpo-web.vercel.app,http://localhost:3000
```

#### File Structure
```
apps/quran-data-api/
├── api/
│   └── v1/
│       ├── get-metadata.ts
│       ├── get-translated-verse.ts
│       └── get-verses.ts (if exists)
├── vercel.json
├── package.json
└── .vercelignore
```

### Key Files Configuration

#### vercel.json (Current Working Config)
```json
{
  "version": 2,
  "routes": [
    {
      "src": "/api/v1/get-metadata",
      "dest": "v1/get-metadata.js",
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Accept, Authorization"
      }
    },
    {
      "src": "/api/v1/get-translated-verse",
      "dest": "v1/get-translated-verse.js",
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Accept, Authorization"
      }
    },
    {
      "src": "/api/v1/(.*)",
      "dest": "v1/$1.js",
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Accept, Authorization"
      }
    }
  ]
}
```

#### .vercelignore (Critical for Prisma)
```
node_modules
.env*
*.log
.DS_Store
prisma/schema.prisma
prisma/migrations/
```

---

## 2. apps/quranexpo-web (✅ CONFIGURACIÓN FINAL Y FUNCIONANDO)
 
 ### Vercel Dashboard Settings
 
 **Project Name:** `quranexpo-web`
 
 #### Build & Development Settings ✅ FINAL WORKING SOLUTION
 - **Framework Preset:** Astro (o Other)
 - **Root Directory:** `apps/quranexpo-web` ← CRÍTICO: Aísla del monorepo
 - **Build Command:** `npm run build` ← CAMBIO: Usar npm en lugar de pnpm
 - **Output Directory:** `dist`
 - **Install Command:** `npm install` ← CAMBIO: Usar npm para evitar conflictos de pnpm+Node22
 - **Development Command:** `npm run dev`
 - **Node.js Version:** `22.x`
 
 ✅ **FIXES ALL ISSUES:**
 - Root Directory = `apps/quranexpo-web` previene conflictos de monorepo
 - npm en lugar de pnpm corrige errores de registro "ERR_INVALID_THIS"
 - npm evita conflictos de Node.js engine (el package.json raíz tiene ">=20.0.0 <21.0.0")
 - Node.js 22.x + npm = combinación estable
 - Solo instala las dependencias necesarias para quranexpo-web
 
 #### Node.js Version
 - **Node.js Version:** `22.x` ← ACTUALIZADO: Versión final utilizada
 
 #### Environment Variables
 ```
 # Corepack Configuration (NO NECESARIO con configuración directory-specific)
 # ENABLE_EXPERIMENTAL_COREPACK=1
 # PNPM_VERSION=9.1.4
 
 # API Configuration (Actualmente hardcodeado en apiClient.ts)
 # Current API URL: https://gentedekhorasan.vercel.app/api/v1
 # Note: API_BASE_URL is hardcoded in apps/quranexpo-web/src/services/apiClient.ts line 4
 # If you want to make it configurable via environment variables, uncomment below:
 # PUBLIC_API_BASE_URL=https://gentedekhorasan.vercel.app/api/v1
 # PUBLIC_API_VERSION=v1
 
 # Vercel Edge Config (si es necesario)
 EDGE_CONFIG=https://edge-config.vercel.com/[token]
 
 # Build Configuration
 NODE_ENV=production
 ```
 
 #### Note on Corepack Variables
 **COREPACK NO NECESARIO** con configuración directory-specific (`Root Directory: apps/quranexpo-web`) porque:
 - No hay conflictos de monorepo pnpm
 - Instalación directa de paquetes en el directorio del proyecto
 - Evita problemas de postinstall hooks del workspace
 
 ### Key Files Configuration
 
 #### astro.config.mjs (Configuración Actual Funcionando)
 ```javascript
 import { defineConfig } from 'astro/config';
 import preact from '@astrojs/preact';
 import tailwind from '@astrojs/tailwind';
 
 export default defineConfig({
   output: 'static',
   outDir: './dist',
   integrations: [
     preact({
       include: ['**/*.tsx']
     }),
     tailwind()
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
 ```
 
 #### package.json Scripts (Scripts Clave)
 ```json
 {
   "scripts": {
     "dev": "astro dev",
     "build": "astro build",
     "preview": "astro preview",
     "astro": "astro"
   }
 }
 ```
 
 ---
 
 ## 3. Troubleshooting Guide
 
 ### Common Issues & Solutions
 
 #### Issue 1: pnpm lockfile version incompatibility
 **Error:** `Ignoring not compatible lockfile at /vercel/path0/pnpm-lock.yaml`
 
 **Solutions (en orden de preferencia):**
 1. **Establecer variables de entorno Corepack:**
    ```
    ENABLE_EXPERIMENTAL_COREPACK=1
    PNPM_VERSION=9.1.4
    ```
 
 2. **Usar build específico por directorio:**
    - Establecer Root Directory a `apps/quranexpo-web`
    - Usar `pnpm run build` en lugar de comandos de monorepo
 
 3. **Comando de build alternativo con npx:**
    ```bash
    npx pnpm@9.1.4 install && npx pnpm@9.1.4 run build
    ```
 
 #### Issue 2: SSR Component Errors
 **Error:** `Cannot read properties of undefined (reading '__H')`
 
 **Solution:** Usar wrappers Client-Only para componentes Preact con hooks:
 - `ClientOnlyReaderContainer.tsx` para audio player
 - `ClientOnlySettingsToggle.tsx` para toggles de configuración
 
 #### Issue 3: TurboRepo Interference
 **Error:** Vercel detecta automáticamente TurboRepo e ignora configuraciones
 
 **Solution:** Usar comandos de build específicos que eviten la autodetección de TurboRepo:
 ```bash
 cd apps/quranexpo-web && pnpm run build
 ```
 
 #### Issue 4: Node.js Version Mismatch
 **Error:** `Found invalid Node.js Version: "18.x". Please set Node.js Version to 22.x`
 
 **Solution:** Actualizar `Node.js Version` a `22.x` en Vercel Dashboard.
 
 #### Issue 5: pnpm Registry Fetch Errors
 **Error:** `ERR_INVALID_THIS` / `ERR_PNPM_META_FETCH_FAIL`
 
 **Solution:** Cambiar `Install Command` y `Build Command` a `npm install` y `npm run build` respectivamente en Vercel Dashboard para `quranexpo-web`.
 
 ### Deployment Verification Checklist
 
 #### For quran-data-api:
 - [ ] API endpoints responden correctamente
 - [ ] CORS headers presentes
 - [ ] Conexión a base de datos funcionando
 - [ ] Prisma Client generado correctamente
 
 #### For quranexpo-web:
 - [ ] Static site se construye exitosamente
 - [ ] Todas las 114 páginas de surah generadas
 - [ ] Componentes client-side se hidratan correctamente
 - [ ] Audio player funciona después de la hidratación
 - [ ] Toggles de configuración funcionan después de la hidratación
 
 ---
 
 ## 4. Environment Variables Summary
 
 ### quran-data-api
 ```env
 DATABASE_URL=postgresql://[connection-string]
 EDGE_CONFIG=https://edge-config.vercel.com/[token]
 ALLOWED_ORIGINS=https://quranexpo-web.vercel.app,http://localhost:3000
 ```
 
 ### quranexpo-web
 ```env
 # NO NECESARIO con la solución final de npm
 # ENABLE_EXPERIMENTAL_COREPACK=1
 # PNPM_VERSION=9.1.4
 
 # Configuración de la aplicación
 PUBLIC_API_BASE_URL=https://quran-data-api.vercel.app
 PUBLIC_API_VERSION=v1
 NODE_ENV=production
 
 # Opcional
 EDGE_CONFIG=https://edge-config.vercel.com/[token]
 ```
 
 ---
 
 ## 5. Post-Deployment Testing
 
 ### API Testing (quran-data-api):
 ```bash
 # Test metadata endpoint
 curl https://quran-data-api.vercel.app/api/v1/get-metadata
 
 # Test verse translation endpoint
 curl "https://quran-data-api.vercel.app/api/v1/get-translated-verse?surah=1&verse=1"
 ```
 
 ### Web App Testing (quranexpo-web):
 1. Navegar a la página de inicio
 2. Probar navegación de surah
 3. Probar página del lector con audio
 4. Probar toggles de configuración
 5. Verificar diseño responsivo
 6. Verificar solicitudes de red a la API
 
 ---
 
 ## Status
 - ✅ quran-data-api: Desplegado y funcionando correctamente
 - ✅ quranexpo-web: Desplegado y funcionando correctamente
 - 📋 Ambos proyectos: Variables de entorno y guía de troubleshooting actualizada