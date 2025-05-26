# Active Context: Gente de Khorasan Monorepo

**Version:** 1.0.1
**Date:** 2025-05-26
**Related Brief:** `memory-bank/projectbrief.md`
**Related Progress:** `memory-bank/progress.md`
**Implementation Guide:** `memory-bank/deployment-fixes-implementation-guide.md`

## 1. Current Focus & State

-   **Focus:**
    1.  **IMMEDIATE:** Ejecutar fixes de deployment para `quran-data-api` y `quranexpo-web` siguiendo la guía en `deployment-fixes-implementation-guide.md`.
    2.  Verificación de la integración y funcionalidad de los subproyectos dentro del monorepo.
    3.  Preparación para el desarrollo continuo de nuevas características y mejoras.
-   **State:**
    -   **Monorepo Structure:** Establecida con `apps/luminous-verses-mobile`, `apps/quran-data-api`, `apps/quranexpo-web`, y `packages/quran-types`.
    -   **`apps/quran-data-api` (API Serverless):**
        -   **Estado:** ❌ **Deployment fallando** debido a conflictos de archivos Prisma.
        -   **Funcionalidad:** Sirve datos del Corán (texto, traducciones, metadatos) desde Neon PostgreSQL y Vercel Edge Config.
        -   **Problemas Resueltos Recientemente:** Errores de compilación de TypeScript, problemas de generación de Prisma Client, y errores de enrutamiento `404` en Vercel (antes del nuevo error).
    -   **`apps/quranexpo-web` (Aplicación Web):**
        -   **Estado:** ❌ **Deployment fallando** debido a problemas de configuración de TurboRepo.
    -   **`apps/luminous-verses-mobile` (Aplicación Móvil):**
        -   **Estado:** El proyecto móvil se construye localmente sin errores.
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

## 3. Problemas Críticos de Deployment (Activos)

### 3.1. `quran-data-api` (Prioridad: URGENTE - Bloqueador Principal)
-   **Error:** `Two or more files have conflicting paths or names` (conflicto entre `query_engine_bg.js` y `query_engine_bg.wasm`).
-   **Causa Raíz:** Prisma genera archivos con el mismo nombre base pero diferentes extensiones, lo que Vercel interpreta como un conflicto.
-   **Solución Implementada:** Se creó el archivo `apps/quran-data-api/.vercelignore` con el siguiente contenido para excluir los archivos problemáticos:
    ```
    # Ignore Prisma WASM and native binaries that conflict with Vercel deployment
    api/generated/prisma/*.wasm
    api/generated/prisma/libquery_engine-*.node
    api/generated/prisma/*.dylib.node
    api/generated/prisma/*.so.node
    ```
-   **Estado:** ✅ **FIX IMPLEMENTADO.** Pendiente de re-deployment en Vercel para verificación.

### 3.2. `quranexpo-web` (Prioridad: ALTA - Bloqueador Secundario)
-   **Error Anterior:** Build de ~7ms y 404 debido a que `apps/quranexpo-web` era un submódulo de Git no integrado, y luego `build.sh` no se ejecutaba.
-   **Progreso:**
    -   `apps/quranexpo-web` ha sido integrado como un directorio regular en el monorepo.
    -   El script `apps/quranexpo-web/build.sh` ahora **SÍ SE EJECUTA** en Vercel.
-   **Error Actual (Persistente):** El script `build.sh` falla durante `pnpm install --frozen-lockfile` con:
    -   `WARN Ignoring not compatible lockfile at /vercel/path0/pnpm-lock.yaml` (el path puede variar path0/path1)
    -   `ERROR Headless installation requires a pnpm-lock.yaml file`
    Esto ocurre incluso después de alinear versiones de Node/pnpm, regenerar lockfile y desplegar sin caché.
-   **Causa Raíz Sospechada:** Problema persistente con la interpretación/compatibilidad del `pnpm-lock.yaml` en el entorno de Vercel que no se resuelve con los pasos estándar. Podría estar relacionado con el caché interno de Vercel a pesar de "desplegar sin caché", o una interacción sutil con la forma en que Vercel maneja los workspaces de pnpm.
-   **Próximos Pasos al Reanudar (Pausado por el usuario):**
    1.  **Intento A:** Modificar `build.sh` para usar `pnpm install` (sin `--frozen-lockfile`).
    2.  **Intento B (si A falla):** Modificar `build.sh` para forzar la versión de pnpm con Corepack.
    3.  **Consideración:** Investigar la discrepancia en el número de workspaces (Vercel detecta 6, nosotros contamos 4-5). Mover/ignorar `apps/quranexpo-web_backup/`.
-   **Estado:** ⏸️ **PAUSADO POR EL USUARIO.** El problema principal es el fallo de `pnpm install --frozen-lockfile` en Vercel debido a un lockfile "no compatible".
    -   Plan de reanudación documentado en [`memory-bank/vercel-pnpm-lockfile-resumption-plan.md`](memory-bank/vercel-pnpm-lockfile-resumption-plan.md).

## 4. Dependencias de Arquitectura (Actualmente Afectadas)
```mermaid
graph TD
    A[quran-data-api] -- API Calls --> B[quranexpo-web]
    B -- Shared Types --> C[luminous-verses-mobile]

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#f9f,stroke:#333,stroke-width:2px
    style C fill:#f9f,stroke:#333,stroke-width:2px

    linkStyle 0 stroke:red,stroke-width:2px,fill:none;
    linkStyle 1 stroke:red,stroke-width:2px,fill:none;
```
-   La falla en `quran-data-api` impacta directamente a `quranexpo-web`.
-   `luminous-verses-mobile` depende de `quran-data-api` para datos, por lo que también está afectado indirectamente.

## 5. Plan de Acción Inmediato (2025-05-26)
1.  **PRIORIDAD 1:** Re-desplegar `quran-data-api` en Vercel para verificar que el archivo `.vercelignore` resuelve el conflicto de Prisma.
    - Archivo `.vercelignore` ya creado y listo
    - Acción: Redeploy en Vercel Dashboard
2.  **PRIORIDAD 2:** Implementar Option A para `quranexpo-web` - modificar `build.sh` para remover `--frozen-lockfile`.
    - Ver instrucciones detalladas en `deployment-fixes-implementation-guide.md`
    - Si falla, proceder con Option B (Corepack)
3.  **PRIORIDAD 3:** Verificar la funcionalidad completa de `quranexpo-web` y `luminous-verses-mobile` una vez que ambos deployments estén operativos.

## 6. Soluciones Técnicas Listas para Pruebas
-   **`quran-data-api`:** Archivo `apps/quran-data-api/.vercelignore` creado.
-   **`quranexpo-web`:** Comando de build de TurboRepo y `ignoreCommand` en `vercel.json` corregidos.

## 7. Próximos Pasos (Después de la Resolución de Deployment)
-   **Optimización de la Integración de TurboRepo:** Explorar más a fondo las capacidades de TurboRepo para optimizar los builds y el caching entre proyectos.
-   **Estrategia de Versionado del Monorepo:** Definir una estrategia clara para el versionado de los paquetes y aplicaciones dentro del monorepo.
-   **CI/CD para el Monorepo:** Configurar pipelines de CI/CD que manejen los builds y despliegues de los diferentes proyectos del monorepo de manera eficiente.
-   **Pruebas de Rendimiento:** Realizar pruebas de rendimiento exhaustivas en la API y las aplicaciones.