# Active Context: Gente de Khorasan Monorepo

**Date:** 2025-05-26
**Related Brief:** `memory-bank/projectbrief.md`
**Progress:** `memory-bank/progress.md`

## 1. Current Work Focus

The primary focus is on resolving deployment issues for the `apps/quranexpo-web` project on Vercel. Specifically, addressing the `pnpm-lock.yaml` incompatibility and Corepack activation issues, and now also the SSR errors in Preact components.

## 2. Recent Changes & Updates

-   **`apps/quran-data-api` Deployment:** Successfully deployed to Vercel. Prisma conflicts resolved by adding `.vercelignore`.
-   **`apps/quranexpo-web` Deployment:**
    -   **RESUELTO (2025-05-26):** El despliegue de `quranexpo-web` en Vercel ahora es exitoso.
    -   **Soluciones Clave:**
        -   Aislamiento del proyecto en Vercel Dashboard (`Root Directory: apps/quranexpo-web`).
        -   Actualización de la versión de Node.js a `22.x`.
        -   Cambio del gestor de paquetes de `pnpm` a `npm` para la instalación y el build.
-   **`apps/quranexpo-web` SSR Audio Player Fix:**
    -   Initial fix implemented using `useIsClient` hook and `ClientOnlyReaderContainer`.
    -   **REVISIÓN (2025-05-26):** La solución de SSR para el audio player ha sido simplificada. Se eliminó el hook `useIsClient` y la verificación de entorno (`typeof window !== 'undefined'`) se realiza directamente dentro de `ClientOnlyReaderContainer.tsx`. Esto evita la ejecución de hooks de Preact durante el SSR, que era la causa raíz del error `Cannot read properties of undefined (reading '__H')`.
    -   El archivo `apps/quranexpo-web/src/hooks/useIsClient.ts` ha sido eliminado.
    -   **CORRECCIÓN (2025-05-26):** Se eliminó la importación de `useIsClient` de `apps/quranexpo-web/src/hooks/useVersePlayer.ts` y se reemplazó la declaración de `isClient` con `typeof window !== 'undefined'`. El hook `useVersePreloader` ha sido deshabilitado temporalmente en `useVersePlayer.ts` para simplificar el debugging.
-   **`apps/quranexpo-web` SSR Settings Toggle Fix:**
    -   **CORRECCIÓN (2025-05-26):** Se identificó que `SettingsToggle` también causaba errores de SSR debido al uso de `useStore`. Se creó `ClientOnlySettingsToggle.tsx` para envolver `SettingsToggle` y asegurar que se renderice solo en el cliente. Se actualizó `apps/quranexpo-web/src/components/SettingsPanel.tsx` para usar `ClientOnlySettingsToggle`.
-   **`apps/luminous-verses-mobile`:** Local build issues resolved.

## 3. Next Steps & Active Decisions

-   **Primary Goal:** Resolve the `pnpm` and Corepack related deployment failures for `apps/quranexpo-web` on Vercel.
    -   **Decision:** The current approach is to investigate why Corepack is not activating `pnpm@9.1.4` and why Vercel defaults to `pnpm@6.35.1`.
    -   **Proposed Solutions (from `vercel-pnpm-lockfile-resumption-plan.md`):**
        -   Option A: Remove `--frozen-lockfile` (already attempted, led to new error).
        -   Option B: Explicitly set `PNPM_HOME` and add to `PATH` (investigar).
        -   Option C: Use `npm install -g pnpm@9.1.4` (investigar).
        -   Option D: Use `npx pnpm@9.1.4 install` directly in `build.sh` (investigar).
        -   Option E: Regenerate `pnpm-lock.yaml` con `pnpm@6.35.1` (último recurso).
-   **Secondary Goal:** Integrate `apps/luminous-verses-mobile` con la API desplegada.

## 4. Important Patterns & Preferences

-   **Monorepo Structure:** Adhering to pnpm workspaces y TurboRepo for efficient dependency management and build caching.
-   **Serverless API:** Utilizing Vercel's serverless functions for the `quran-data-api`.
-   **SSR for Web App:** Implementing SSR where beneficial for performance and SEO, with careful handling of client-side only components.
-   **Memory Bank Usage:** Continuous documentation of progress, decisions, and solutions within the `memory-bank` directory.

## 5. Learnings & Project Insights

-   Vercel's build environment has specific behaviors regarding `pnpm` and `Corepack` that require explicit handling.
-   SSR with Preact/Astro requires careful isolation of client-side specific code to prevent errors during the build process. Direct `typeof window !== 'undefined'` checks are more robust for simple client-only rendering than hooks that might execute during SSR.
-   El `.vercelignore` file is crucial for managing files that can cause conflicts or unnecessary overhead during Vercel deployments, especially with Prisma.
-   Es fundamental asegurarse de que todas las importaciones de archivos eliminados o renombrados se actualicen o eliminen en todo el codebase para evitar errores de resolución de módulos durante el build.
-   Cualquier componente de Preact que utilice hooks (como `useStore` de Nanostores) debe ser envuelto en un componente "Client-Only" para evitar errores de SSR cuando se renderiza en el servidor.