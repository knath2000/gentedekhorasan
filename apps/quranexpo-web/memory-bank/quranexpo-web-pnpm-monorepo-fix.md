# Fix: quranexpo-web pnpm Monorepo Install Issue

**Date:** 2025-05-26
**Error:** `sh: line 1: prisma: command not found` during postinstall

## Problem Analysis

When deploying `quranexpo-web` with:
- Root Directory: (empty - repo root)
- Install Command: `pnpm install`

The error occurs:
```
devDependencies: skipped because NODE_ENV is set to production
apps/quran-data-api postinstall$ prisma generate --schema=./prisma/schema.prisma
sh: line 1: prisma: command not found
```

**Root Cause:** 
1. Vercel sets `NODE_ENV=production` 
2. pnpm skips devDependencies in production
3. `prisma` CLI is in devDependencies of `quran-data-api`
4. The postinstall hook of `quran-data-api` tries to run `prisma generate` but prisma CLI is not installed

## Solution Options

### Option 1: Directory-Specific Approach (RECOMMENDED)
Isolate `quranexpo-web` from monorepo install issues:

**Vercel Dashboard Settings:**
- **Root Directory:** `apps/quranexpo-web`
- **Build Command:** `pnpm run build`
- **Output Directory:** `dist`
- **Install Command:** `pnpm install`
- **Node.js Version:** `22.x` ← NEW: Fix "Found invalid Node.js Version: 18.x" error

This approach:
- ✅ Avoids monorepo postinstall hooks
- ✅ Only installs dependencies for quranexpo-web
- ✅ No Prisma interference

### Option 2: Custom Install Command
Use npm instead of pnpm to avoid workspace interference:

**Vercel Dashboard Settings:**
- **Root Directory:** (empty)
- **Build Command:** `cd apps/quranexpo-web && npm run build`
- **Output Directory:** `apps/quranexpo-web/dist`
- **Install Command:** `cd apps/quranexpo-web && npm install`

### Option 3: Fix Prisma in Production
Move `prisma` from devDependencies to dependencies in `quran-data-api`:

**In apps/quran-data-api/package.json:**
```json
{
  "dependencies": {
    "prisma": "^6.8.2",  // Move from devDependencies
    // ... other deps
  }
}
```

But this is not recommended for a pure API project.

## Recommended Solution: Option 1

**New Vercel Configuration for quranexpo-web:**

### Build & Development Settings
- **Framework Preset:** Astro (or Other)
- **Root Directory:** `apps/quranexpo-web`
- **Build Command:** `pnpm run build`
- **Output Directory:** `dist`
- **Install Command:** `pnpm install`

### Environment Variables (No Changes)
```
ENABLE_EXPERIMENTAL_COREPACK=1
PNPM_VERSION=9.1.4
NODE_ENV=production
```

## Expected Behavior

1. Vercel enters `apps/quranexpo-web` directory
2. Runs `pnpm install` only for quranexpo-web dependencies
3. No postinstall hooks from other workspace projects
4. Runs `pnpm run build` (Astro build)
5. Outputs static files to `dist/`
6. Deployment succeeds

## Status
- ✅ quran-data-api: Working with Output Directory = "."
- 🔧 quranexpo-web: Needs directory-specific configuration to avoid monorepo install conflicts