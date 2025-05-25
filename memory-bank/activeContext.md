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
    -   **Monorepo Structure:** Establecida con `apps/luminous-verses-expo`, `apps/quran-data-api`, y `packages/quran-types`.
    -   **`apps/quran-data-api` (API Serverless):**
        -   **Estado:** Desplegado y funcionando correctamente en Vercel.
        -   **Funcionalidad:** Sirve datos del Corán (texto, traducciones, metadatos) desde Neon PostgreSQL y Vercel Edge Config.
        -   **Problemas Resueltos Recientemente:** Errores de compilación de TypeScript, problemas de generación de Prisma Client, y errores de enrutamiento `404` en Vercel.
    -   **`apps/luminous-verses-expo` (Aplicación Móvil):**
        -   **Estado:** La aplicación base está en su lugar, con la expectativa de consumir la API recién desplegada.
        -   **Dirección del Proyecto:** Nativo-only (iOS y Android).
    -   **`packages/quran-types` (Tipos Compartidos):**
        -   **Estado:** Definiciones de tipos compartidas disponibles para ambos subproyectos.
    -   **Memory Bank (Nivel Raíz):** En proceso de inicialización y actualización para reflejar el contexto del monorepo.

## 2. Recent Changes / Milestones

-   **Despliegue Exitoso de `apps/quran-data-api` (2025-05-24):**
    -   Se resolvieron los problemas de compilación de TypeScript (`tsconfig.json`, `package.json` scripts).
    -   Se aseguró la correcta generación del cliente Prisma.
    -   Se corrigieron los problemas de enrutamiento `404` en Vercel mediante la configuración del "Output Directory" a `.` en el panel de Vercel.
    -   La API ahora responde correctamente a las solicitudes.
-   **Inicialización de la "Memory Bank" del Monorepo (2025-05-24):**
    -   Creación de `projectbrief.md` y `productContext.md` a nivel raíz.
    -   Este archivo (`activeContext.md`) está siendo creado.

## 3. Próximos Pasos Inmediatos

1.  **Completar la Inicialización de la "Memory Bank" del Monorepo:**
    *   Crear `systemPatterns.md`, `techContext.md`, y `progress.md` a nivel raíz.
    *   Asegurar que todos los archivos de la "Memory Bank" reflejen con precisión la estructura y el estado del monorepo.
2.  **Integrar `apps/luminous-verses-expo` con la API desplegada:**
    *   Verificar que la aplicación móvil pueda consumir los datos de la API correctamente.
    *   Actualizar `src/services/apiClient.ts` en `luminous-verses-expo` para apuntar a la URL de la API desplegada si es necesario.
3.  **Testing Exhaustivo del Monorepo:**
    *   Realizar pruebas de extremo a extremo para asegurar que la aplicación móvil y la API funcionan juntas sin problemas.

## 4. Decisiones Clave Tomadas

-   **Estructura de Monorepo:** Adopción de pnpm workspaces y TurboRepo para gestionar múltiples proyectos.
-   **Aislamiento de la API:** La funcionalidad de la API se ha aislado en un proyecto separado (`apps/quran-data-api`) para modularidad y despliegue independiente.
-   **Configuración de Despliegue de Vercel para API:** Se optó por configurar el "Framework Preset" como "Other" y el "Output Directory" como `.` en el panel de Vercel para proyectos de solo API.

## 5. Preguntas Abiertas / Consideraciones

-   **Optimización de la Integración de TurboRepo:** Explorar más a fondo las capacidades de TurboRepo para optimizar los builds y el caching entre proyectos.
-   **Estrategia de Versionado del Monorepo:** Definir una estrategia clara para el versionado de los paquetes y aplicaciones dentro del monorepo.
-   **CI/CD para el Monorepo:** Configurar pipelines de CI/CD que manejen los builds y despliegues de los diferentes proyectos del monorepo de manera eficiente.