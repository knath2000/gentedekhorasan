# Active Context: Gente de Khorasan Monorepo

**Date:** 2025-05-26
**Related Brief:** `memory-bank/projectbrief.md`
**Progress:** `memory-bank/progress.md`

## 1. Current Work Focus

The primary focus is on ensuring the correct deployment and routing of API functions within the monorepo on Vercel, and resolving any related frontend issues.

## 2. Recent Changes & Updates

-   **`apps/quran-data-api` Deployment:**
    -   **RESUELTO (2025-05-26):** El despliegue de `quran-data-api` en Vercel ahora es exitoso y las funciones de la API son accesibles.
    -   **Soluciones Clave:**
        -   Configuración de `apps/quran-data-api/api/tsconfig.json` para compilar TypeScript a JavaScript en un directorio `dist` (`"outDir": "dist"`) y permitir la emisión de archivos (`"noEmit": false`).
        -   Modificación del script `build` en `apps/quran-data-api/package.json` para ejecutar la compilación de funciones (`pnpm run build:functions`) y asegurar que `build:functions` use el `tsconfig.json` correcto (`tsc -p api/tsconfig.json`).
        -   Movimiento de la configuración de `functions` y `routes` para `quran-data-api` al `vercel.json` de la **raíz del monorepo**. Las rutas ahora apuntan a los archivos JavaScript compilados en el directorio `dist` dentro de `apps/quran-data-api`.
        -   El archivo `apps/quran-data-api/vercel.json` ahora solo contiene `{"version": 2}` para evitar conflictos.
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

-   **Primary Goal:** Ensure long-term stability of Vercel deployments for both `quran-data-api` and `quranexpo-web`.
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
-   **Vercel Monorepo Functions:** Para que las funciones de la API en un subdirectorio de un monorepo sean desplegadas correctamente, es crucial:
    -   Configurar `tsconfig.json` para compilar TypeScript a JavaScript en un directorio de salida (`"outDir": "dist"`) y permitir la emisión (`"noEmit": false`).
    -   Asegurarse de que el script `build` del `package.json` de la aplicación de la API ejecute esta compilación (`tsc -p api/tsconfig.json`).
    -   Mover la configuración de `functions` y `routes` al `vercel.json` de la **raíz del monorepo**, apuntando a los archivos JavaScript compilados en el directorio `dist` dentro del subdirectorio de la aplicación (ej. `"apps/quran-data-api/dist/api/v1/get-metadata.js"`).
    -   El `vercel.json` anidado en el subdirectorio de la API debe ser mínimo (solo `{"version": 2}`).