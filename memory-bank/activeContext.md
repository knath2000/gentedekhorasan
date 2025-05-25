# Active Context: Gente de Khorasan Monorepo

**Version:** 1.0.0
**Date:** 2025-05-24
**Related Brief:** `memory-bank/projectbrief.md`
**Related Progress:** `memory-bank/progress.md`

## 1. Current Focus & State

-   **Focus:**
    1.  Consolidación de la "Memory Bank" a nivel de monorepo.
    2.  Verificación de la integración y funcionalidad de los subproyectos dentro del monorepo.
    3.  Preparación para el desarrollo continuo de nuevas características y mejoras.
-   **State:**
    -   **Monorepo Structure:** Establecida con `apps/luminous-verses-mobile` (renombrado de `luminous-verses-expo`), `apps/quran-data-api`, `apps/quranexpo-web`, y `packages/quran-types`.
    -   **`apps/quran-data-api` (API Serverless):**
        -   **Estado:** Desplegado y funcionando correctamente en Vercel.
        -   **Funcionalidad:** Sirve datos del Corán (texto, traducciones, metadatos) desde Neon PostgreSQL y Vercel Edge Config.
        -   **Problemas Resueltos Recientemente:** Errores de compilación de TypeScript, problemas de generación de Prisma Client, y errores de enrutamiento `404` en Vercel.
    -   **`apps/quranexpo-web` (Aplicación Web):**
        -   **Estado:** El proyecto web ahora se construye localmente sin errores.
    -   **`apps/luminous-verses-mobile` (Aplicación Móvil):**
        -   **Estado:** El proyecto móvil ahora se construye localmente sin errores después de corregir las dependencias de Next.js y las rutas de imágenes.
        -   **Dirección del Proyecto:** Nativo-only (iOS y Android).
    -   **`packages/quran-types` (Tipos Compartidos):**
        -   **Estado:** Definiciones de tipos compartidas disponibles para todos los subproyectos.
    -   **Memory Bank (Nivel Raíz):** Actualizada para reflejar el contexto y el progreso del monorepo.

## 2. Recent Changes / Milestones (2025-05-25)

-   **Completada la Etapa 1: Fixes Críticos del Plan de Reorganización del Monorepo:**
    -   **`apps/luminous-verses-expo` renombrado a `apps/luminous-verses-mobile`:** Se actualizó el nombre del paquete y los scripts en `package.json`.
    -   **Corrección de `apps/luminous-verses-mobile`:** Se eliminaron las dependencias y el código de Next.js (`next/dynamic`, `next/head`) de `app/(tabs)/index.tsx`, `app/(tabs)/reader.tsx`, `app/(tabs)/surahs.tsx`, y `app/_layout.tsx`. Se corrigió la ruta de la imagen en `src/components/ScreenBackground.tsx`.
    -   **Actualización de `turbo.json` (raíz):** Se definieron tareas de build específicas (`build:web`, `build:api`, `build:mobile`) y se ajustaron los `outputs`.
    -   **Actualización de `package.json` (raíz):** Se crearon scripts para invocar los builds específicos de TurboRepo (`build:web`, `build:api`, `build:mobile`).
    -   **Builds Locales Exitosos:** Todos los proyectos (`quran-data-api`, `quranexpo-web`, `luminous-verses-mobile`) ahora se construyen localmente sin errores.

## 3. Próximos Pasos Inmediatos

1.  **Configurar el Deployment de `apps/quranexpo-web` en Vercel:**
    *   Establecer el "Framework Preset" como "Astro".
    *   Configurar el "Root Directory" a `apps/quranexpo-web`.
    *   Asegurar que el "Build Command" sea `pnpm run build` (o `turbo run build --filter=quranexpo-web`).
    *   Configurar el "Output Directory" a `dist`.
2.  **Realizar un Deployment de Prueba en Vercel para `quranexpo-web`.**
3.  **Integrar `apps/luminous-verses-mobile` con la API desplegada:**
    *   Verificar que la aplicación móvil pueda consumir los datos de la API correctamente.
    *   Actualizar `src/services/apiClient.ts` en `luminous-verses-mobile` para apuntar a la URL de la API desplegada si es necesario.

## 4. Decisiones Clave Tomadas

-   **Estructura de Monorepo:** Adopción de pnpm workspaces y TurboRepo para gestionar múltiples proyectos.
-   **Aislamiento de la API:** La funcionalidad de la API se ha aislado en un proyecto separado (`apps/quran-data-api`) para modularidad y despliegue independiente.
-   **Configuración de Despliegue de Vercel para API:** Se optó por configurar el "Framework Preset" como "Other" y el "Output Directory" como `.` en el panel de Vercel para proyectos de solo API.
-   **Separación Clara de Proyectos Web y Móviles:** Se eliminaron las dependencias y la lógica de Next.js del proyecto Expo para mantenerlo puramente móvil, y se estableció `quranexpo-web` como el proyecto web dedicado.

## 5. Preguntas Abiertas / Consideraciones

-   **Optimización de la Integración de TurboRepo:** Explorar más a fondo las capacidades de TurboRepo para optimizar los builds y el caching entre proyectos.
-   **Estrategia de Versionado del Monorepo:** Definir una estrategia clara para el versionado de los paquetes y aplicaciones dentro del monorepo.
-   **CI/CD para el Monorepo:** Configurar pipelines de CI/CD que manejen los builds y despliegues de los diferentes proyectos del monorepo de manera eficiente.
## 🚨 CRITICAL ISSUE DISCOVERED (2025-05-25 11:08 AM)

### DEPLOYMENT BLOCKER: TurboRepo Package Detection Issue

**Status:** CRITICAL - BLOCKS ALL VERCEL DEPLOYMENT OF `quranexpo-web`

**Problem:**
- Vercel deployment fails with: `No Output Directory named "dist" found after the Build completed`
- TurboRepo logs show only: `@quran-monorepo/luminous-verses-mobile, @quran-monorepo/quran-data-api, @quran-monorepo/quran-types`
- **`quranexpo-web` is NOT included in the workspace scope**

**Root Cause:**
```diff
apps/quranexpo-web/package.json:
- "name": "quranexpo-web",           ← INCONSISTENT FORMAT
+ "name": "@quran-monorepo/quranexpo-web",  ← REQUIRED FORMAT
```

### IMMEDIATE ACTION REQUIRED (Code Mode)

1. **Fix Package Name Inconsistency:**
   - Update `apps/quranexpo-web/package.json`
   - Update root `package.json` script filters

2. **Local Validation:**
   - Test `pnpm run build:web`
   - Verify TurboRepo includes `@quran-monorepo/quranexpo-web`

3. **Vercel Re-deployment:**
   - Only attempt after fixing package naming

**Priority:** MÁXIMA - Este fix debe aplicarse antes de cualquier nuevo intento de deployment
-   **Pruebas de Rendimiento:** Necesidad de realizar pruebas de rendimiento exhaustivas en la API y las aplicaciones.