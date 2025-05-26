# Progress: Gente de Khorasan Monorepo

**Version:** 1.0.2
**Date:** 2025-05-26
**Related Brief:** `memory-bank/projectbrief.md`
**Active Context:** `memory-bank/activeContext.md`

## 1. What Works / Completed (as of 2025-05-26)

-   **Monorepo Setup:**
    -   Inicialización del monorepo con pnpm workspaces y TurboRepo.
    -   Configuración de proyectos `apps/luminous-verses-mobile` (renombrado de `luminous-verses-expo`), `apps/quran-data-api`, `apps/quranexpo-web`, y `packages/quran-types`.
-   **`apps/quran-data-api` (API Serverless):**
    -   **Despliegue Exitoso en Vercel:** La API está desplegada y funcionando correctamente, sirviendo datos del Corán.
    -   **Resolución de Errores de Despliegue:** Se resolvieron los problemas de compilación de TypeScript, generación de Prisma Client, y errores de enrutamiento `404` en Vercel.
    -   **Integración con Neon DB y Vercel Edge Config:** La API se conecta y recupera datos de ambas fuentes.
    -   **✅ FIX EXITOSO (2025-05-26):** El archivo `.vercelignore` resolvió completamente los conflictos de archivos Prisma. Deployment exitoso confirmado.
-   **`apps/quranexpo-web` (Aplicación Web):**
    -   **Build Local Exitoso:** El proyecto web ahora se construye localmente sin errores.
    -   **✅ FIX EXITOSO (2025-05-26):** Implementadas las correcciones de SSR para el audio player, resolviendo el error `Cannot read properties of undefined (reading '__H')` durante la generación de rutas estáticas. Esto incluye:
        -   Creación de `useIsClient.ts` para detección de entorno (posteriormente eliminado).
        -   Modificación de `AudioPool` y `useVersePlayer` para ser SSR-safe.
        -   Creación de `ClientOnlyReaderContainer.tsx` para renderizado condicional.
        -   Actualización de `reader/[surahId].astro` para usar el nuevo wrapper.
        -   Verificación de `usePagination` como SSR-safe.
        -   **REVISIÓN (2025-05-26):** Simplificación de la solución SSR en `ClientOnlyReaderContainer.tsx` para usar `typeof window !== 'undefined'` directamente, eliminando la dependencia del hook `useIsClient` y el archivo `useIsClient.ts`.
-   **`apps/luminous-verses-mobile` (Aplicación Móvil):**
    -   **Build Local Exitoso:** El proyecto móvil ahora se construye localmente sin errores después de corregir las dependencias de Next.js y las rutas de imágenes.
-   **`packages/quran-types` (Shared Types):**
    -   Definiciones de tipos compartidas creadas y disponibles para los proyectos del monorepo.
-   **Memory Bank (Nivel Raíz):**
    -   Inicialización y actualización de los archivos `projectbrief.md`, `productContext.md`, `activeContext.md`, `systemPatterns.md`, `techContext.md`, y `deployment-reorganization-plan.md`.

## 2. What's Left to Build / Fix (High-Level for Monorepo)

-   **Deployment de `apps/quranexpo-web` en Vercel:**
    -   **BLOQUEADO:** Resolver el error `Ignoring not compatible lockfile at /vercel/path0/pnpm-lock.yaml` y `Headless installation requires a pnpm-lock.yaml file` que ocurre durante la ejecución de `pnpm install --frozen-lockfile` en el script `build.sh` en Vercel.
    -   El script `build.sh` se está ejecutando, pero la instalación de dependencias falla.
-   **Integración Completa de `apps/luminous-verses-mobile` con la API:**
    -   Actualizar la aplicación móvil para consumir la API desplegada.
    -   Asegurar que todas las funcionalidades de la aplicación móvil (lectura, audio, navegación) funcionen correctamente con los datos de la API.
-   **Testing Exhaustivo del Monorepo:**
    -   Realizar pruebas de extremo a extremo para validar la interacción entre la aplicación web/móvil y la API.
    -   Pruebas de rendimiento y estabilidad.
-   **Optimización de TurboRepo:**
    -   Explorar y aplicar configuraciones avanzadas de TurboRepo para maximizar el caching y la eficiencia de los builds.
-   **CI/CD para el Monorepo:**
    -   Configurar pipelines de integración continua y despliegue continuo para automatizar el flujo de trabajo del monorepo.
-   **Documentación Adicional:**
    -   Crear documentación detallada para la API (endpoints, modelos de datos).
    -   Documentación de la aplicación móvil (características, UX).

## 3. Current Status (as of 2025-05-26)

-   **Overall:** Progreso significativo en deployments. `quran-data-api` ahora desplegado exitosamente. `quranexpo-web` tiene las correcciones de SSR implementadas.
-   **Resolved Issues:**
    -   Problemas de despliegue de la API en Vercel (errores de compilación, Prisma Client, enrutamiento 404).
    -   Errores de build de `luminous-verses-expo` (confusión de Next.js, rutas de imágenes, conflictos de merge).
    -   Configuración de scripts de TurboRepo en el `package.json` raíz.
    -   **Error SSR en Audio Player (`__H`):** Resuelto con la implementación de la estrategia híbrida SSR + Client Hydration, y posterior simplificación.
-   **Current Task Group:** Preparación para el deployment de `quranexpo-web` en Vercel.
-   **Next Major Focus:** Configuración de Vercel para `quranexpo-web` y su deployment.

## 4. Known Issues / Blockers / Considerations (Current)

-   **Deployment de `apps/quranexpo-web`:** **BLOQUEADOR CRÍTICO - NUEVA FASE DEL ERROR.**
    -   **Progreso:** Option A (remover `--frozen-lockfile`) fue implementado exitosamente.
    -   **Nuevo Error:** Corepack no está activando correctamente pnpm@9.1.4 en Vercel.
    -   **Descubrimiento:** Vercel tiene pnpm@6.35.1 pre-instalado y Corepack no lo está sobrescribiendo.
    -   **Causa raíz:** El lockfile tiene `lockfileVersion: '9.0'` pero Vercel usa pnpm 6.x.
    -   **Próximo paso:** Implementar Option D (usar npx) o Option E (regenerar lockfile con pnpm 6.x).
-   **Integración de la Aplicación Móvil:** La aplicación `luminous-verses-mobile` aún no está completamente actualizada para consumir la nueva API desplegada.
-   **Pruebas de Rendimiento:** Necesidad de realizar pruebas de rendimiento exhaustivas en la API y las aplicaciones.
-   **Estrategia de Versionado:** Aún no se ha definido una estrategia clara de versionado para los paquetes y aplicaciones dentro del monorepo.