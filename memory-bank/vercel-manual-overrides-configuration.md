# Configuraciones Manuales de Vercel Dashboard

**Date:** 2025-05-26
**Related:** `memory-bank/vercel-dashboard-configuration-solution.md`

## 1. apps/quran-data-api (✅ FUNCIONANDO)

### Vercel Dashboard Settings

**Project Name:** `quran-data-api`

#### Build & Development Settings ⚠️ CORRECTED
- **Framework Preset:** Other
- **Root Directory:** `apps/quran-data-api` ← CRITICAL: isolate from monorepo
- **Build Command:** (leave EMPTY - no build needed for serverless)
- **Output Directory:** (leave EMPTY - APIs don't generate output dirs)
- **Install Command:** `pnpm install`
- **Development Command:** (leave EMPTY)

⚠️ **CRITICAL FIX:**
- Setting Root Directory to `apps/quran-data-api` prevents TurboRepo autodetection
- EMPTY Build/Output commands prevent "No Output Directory named 'public' found" error
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

## 2. apps/quranexpo-web (🔧 NEEDS CONFIGURATION)

### Vercel Dashboard Settings

**Project Name:** `quranexpo-web`

#### Build & Development Settings
- **Framework Preset:** Other (or Astro if available)
- **Root Directory:** (leave empty - use repository root)
- **Build Command:** 
  ```bash
  cd apps/quranexpo-web && pnpm install && pnpm run build
  ```
  
  **Alternative Build Command (Monorepo-aware):**
  ```bash
  pnpm install && pnpm run build --filter=quranexpo-web
  ```

- **Output Directory:** `apps/quranexpo-web/dist`
- **Install Command:** `pnpm install`
- **Development Command:** `cd apps/quranexpo-web && pnpm run dev`

#### Node.js Version
- **Node.js Version:** `18.x`

#### Corepack Configuration (CRITICAL)
**Custom Environment Variables:**
```
ENABLE_EXPERIMENTAL_COREPACK=1
PNPM_VERSION=9.1.4
```

#### Environment Variables
```
# API Configuration (Currently hardcoded in apiClient.ts)
# Current API URL: https://gentedekhorasan.vercel.app/api/v1
# Note: API_BASE_URL is hardcoded in apps/quranexpo-web/src/services/apiClient.ts line 4
# If you want to make it configurable via environment variables, uncomment below:
# PUBLIC_API_BASE_URL=https://gentedekhorasan.vercel.app/api/v1
# PUBLIC_API_VERSION=v1

# Vercel Edge Config (if needed)
EDGE_CONFIG=https://edge-config.vercel.com/[token]

# Build Configuration
NODE_ENV=production
```

### Alternative Build Approach (if pnpm issues persist)

If the monorepo pnpm approach continues to fail, use directory-specific approach:

#### Build & Development Settings (Alternative)
- **Root Directory:** `apps/quranexpo-web`
- **Build Command:** `pnpm run build`
- **Output Directory:** `dist`
- **Install Command:** `pnpm install`

### Key Files Configuration

#### astro.config.mjs (Current Working Config)
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

#### package.json Scripts (Key Scripts)
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

**Solutions (in order of preference):**
1. **Set Corepack environment variables:**
   ```
   ENABLE_EXPERIMENTAL_COREPACK=1
   PNPM_VERSION=9.1.4
   ```

2. **Use directory-specific build:**
   - Set Root Directory to `apps/quranexpo-web`
   - Use `pnpm run build` instead of monorepo commands

3. **Alternative build command with npx:**
   ```bash
   npx pnpm@9.1.4 install && npx pnpm@9.1.4 run build
   ```

#### Issue 2: SSR Component Errors
**Error:** `Cannot read properties of undefined (reading '__H')`

**Solution:** Use Client-Only wrappers for Preact components with hooks:
- `ClientOnlyReaderContainer.tsx` for audio player
- `ClientOnlySettingsToggle.tsx` for settings toggles

#### Issue 3: TurboRepo Interference
**Error:** Vercel automatically detects TurboRepo and ignores configurations

**Solution:** Use specific build commands that bypass TurboRepo autodetection:
```bash
cd apps/quranexpo-web && pnpm run build
```

### Deployment Verification Checklist

#### For quran-data-api:
- [ ] API endpoints respond correctly
- [ ] CORS headers present
- [ ] Database connection working
- [ ] Prisma Client generated correctly

#### For quranexpo-web:
- [ ] Static site builds successfully
- [ ] All 114 surah pages generated
- [ ] Client-side components hydrate correctly
- [ ] Audio player works after hydration
- [ ] Settings toggles work after hydration

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
# Required for pnpm compatibility
ENABLE_EXPERIMENTAL_COREPACK=1
PNPM_VERSION=9.1.4

# Application configuration
PUBLIC_API_BASE_URL=https://quran-data-api.vercel.app
PUBLIC_API_VERSION=v1
NODE_ENV=production

# Optional
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
1. Navigate to homepage
2. Test surah navigation
3. Test reader page with audio
4. Test settings toggles
5. Verify responsive design
6. Check network requests to API

---

## Status
- ✅ quran-data-api: Successfully deployed and working
- 🔧 quranexpo-web: Configuration documented, deployment pending
- 📋 Both projects: Environment variables and troubleshooting guide provided