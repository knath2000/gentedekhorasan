# Active Context

## Current Status: QuranExpo Web SSR Error Fix

### 🚨 CRITICAL ISSUE IDENTIFIED
**Error:** `Cannot read properties of undefined (reading '__H')`
**Location:** Static route generation for `/reader/1/index.html`
**Root Cause:** `useVersePlayer` hook attempts to create `HTMLAudioElement` instances during SSR where browser APIs are unavailable

### ✅ Previous Deployment Configuration Fixed
- Root `vercel.json` cleaned up (removed `builds`, `rewrites`, `installCommand`).
- `apps/quranexpo-web/build.sh` deleted.
- `apps/quranexpo-web/vercel.json` deleted.
- `apps/quranexpo-web/package.json` build script simplified.
- Vercel Dashboard configuration confirmed:
    - Root Directory: `apps/quranexpo-web`
    - Build Command: `cd ../.. && npx pnpm@9.1.4 install && npx pnpm@9.1.4 --filter @quran-monorepo/quranexpo-web run build`
    - Output Directory: `dist`
    - Install Command: Empty
    - "Include files outside the root directory": Enabled

### ✅ Previous Application-Level Errors Addressed

#### 1. Edge Config Error (`@vercel/edge-config: No connection string provided`)
- **Fix Applied**: Modified `apps/quranexpo-web/src/pages/api/transliterations.ts` to gracefully handle missing Edge Config connection string during build time by returning an empty object.

#### 2. Initial Preact Hooks Error
- **Fix Applied**: Added Vite `resolve.alias` configuration in `apps/quranexpo-web/astro.config.mjs` to alias `react` and `react-dom` to `preact/compat`. This partially resolved SSR compatibility but revealed deeper SSR issues.

### ✅ Current Issue: SSR Audio Player Error - FIX IMPLEMENTADO

#### Problema Resuelto
- **Archivo:** `apps/quranexpo-web/src/hooks/useVersePlayer.ts`
- **Causa:** `new Audio()` y `new AudioPool()` durante SSR
- **Impacto:** Bloqueaba la generación de rutas estáticas y el deployment

#### Solución Implementada: Hybrid SSR + Client Hydration
**Plan:** `memory-bank/ssr-audio-player-fix-plan.md`

1.  **Hook de Detección de Cliente (`useIsClient.ts`):** Creado para determinar el entorno de ejecución.
2.  **`AudioPool` SSR-Safe:** Modificada para inicializar instancias de `HTMLAudioElement` solo en el cliente.
3.  **`useVersePlayer` SSR-Safe:** Actualizado para usar `useIsClient` y asegurar que las operaciones de audio solo se ejecuten en el cliente.
4.  **`ClientOnlyReaderContainer`:** Creado como un wrapper para `ReaderContainer`, renderizando un skeleton en SSR y el componente completo en el cliente.
5.  **Página Reader Actualizada:** `apps/quranexpo-web/src/pages/reader/[surahId].astro` ahora usa `ClientOnlyReaderContainer` con `client:load`.
6.  **`usePagination` Verificado:** Confirmado que es SSR-safe y no requiere cambios.

### 📋 Tareas de Implementación Completadas

- [x] Implementar `useIsClient` hook
- [x] Modificar `AudioPool` class con SSR guards
- [x] Actualizar `useVersePlayer` para ser SSR safety
- [x] Crear `ClientOnlyReaderContainer` wrapper
- [x] Actualizar página reader para usar wrapper
- [x] Verificar `usePagination` hook

## Next Steps

1.  **Manual Deployment on Vercel**:
    *   Perform a new deployment on Vercel for the `quranexpo-web` project.
    *   Ensure to **deploy without cache** to pick up all the latest changes.
2.  **Monitor Build Logs**: Carefully review the build logs for any new errors or warnings.
3.  **Verify Functionality**: Once deployed, thoroughly test the `quranexpo-web` application, especially the reader page and any features relying on Edge Config.

## Technical Context

- **Framework:** Astro with Preact components
- **Issue Type:** Server-Side Rendering (SSR) compatibility
- **Components Affected:** Audio player, Reader page
- **Solution Pattern:** Client-only rendering with skeleton loading

---

**Estado:** Correcciones de SSR implementadas, listo para testing y deployment
**Prioridad:** Crítica - Bloqueo de deployment resuelto
**Estimación:** Testing y verificación de deployment