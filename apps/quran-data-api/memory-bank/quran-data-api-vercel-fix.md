# Fix: quran-data-api Vercel Deployment Error

**Date:** 2025-05-26
**Error:** `No Output Directory named "public" found after the Build completed`

## Problem Analysis

Vercel está detectando automáticamente TurboRepo y ejecutando:
1. Build desde la raíz del monorepo con TurboRepo
2. Buscando un output directory "public" que no existe
3. Para un proyecto de API serverless NO debe buscar ningún output directory

## Root Cause

Los logs muestran:
```
• Packages in scope: @quran-monorepo/quran-data-api
• Running build in 1 packages
WARNING no output files found for task @quran-monorepo/quran-data-api#build
Error: No Output Directory named "public" found
```

**El problema:** Vercel está usando configuración de framework incorrecto y buscando output directory cuando no debería.

## Solution: Configuración Corregida para Dashboard Vercel

### Build & Development Settings (CORRECTED)

**Framework Preset:** Other
**Root Directory:** `apps/quran-data-api`
**Build Command:** (leave EMPTY - no build needed for serverless)
**Output Directory:** `.` ← CRITICAL: Use current directory (this worked before)
**Install Command:** `pnpm install`
**Development Command:** (leave EMPTY)

### Key Points:

1. **Framework Preset = Other:** No debe autodetectar como TurboRepo
2. **Root Directory = `apps/quran-data-api`:** Aisla el proyecto de la raíz del monorepo
3. **Build Command = EMPTY:** Las funciones serverless no necesitan build command
4. **Output Directory = EMPTY:** Las APIs no generan directorio de output

### Expected Behavior:

1. Vercel entra a `apps/quran-data-api`
2. Ejecuta `pnpm install` (instala dependencias + postinstall hook)
3. El postinstall ejecuta `prisma generate` automáticamente
4. Vercel detecta las funciones en `/api/v1/` y las despliega como serverless functions
5. NO busca ningún output directory

## Alternative Solution (if the above fails):

Si el enfoque de directory-specific falla, usar override manual:

### Build & Development Settings (Alternative)
**Framework Preset:** Other
**Root Directory:** (empty - use repo root)
**Build Command:** `cd apps/quran-data-api && pnpm install && pnpm run build`
**Output Directory:** (leave EMPTY - critical for APIs)
**Install Command:** `pnpm install`

## Environment Variables (No changes)
```
DATABASE_URL=postgresql://[connection-string]
EDGE_CONFIG=https://edge-config.vercel.com/[token]
ALLOWED_ORIGINS=https://quranexpo-web.vercel.app,http://localhost:3000
```

## Status
- ❌ Original configuration caused TurboRepo interference  
- 🔧 New configuration targets specific directory
- ⏳ Testing required with corrected settings