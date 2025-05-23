# Active Context: Luminous Verses (Expo App)

<<<<<<< HEAD
**Version:** 0.9.5 (Prisma ORM Migration Completed)
**Date:** 2025-05-23
**Related Brief:** `memory-bank/projectbrief.md`
**Related Progress:** `memory-bank/progress.md`
=======
**Version:** 0.9.5 (Database-Driven Translations & Metadata, CORS Fixes)
**Date:** 2025-05-15
**Related Brief:** `docs/projectbrief.md`
**Related Progress:** `docs/progress.md`
>>>>>>> 6782f209f2ec1abb8fff5d8bb212e5ef19bceef8

## 1. Current Focus & State

-   **Focus:**
<<<<<<< HEAD
    1.  Finalización de la migración a Prisma ORM y eliminación de endpoints antiguos.
    2.  Testing exhaustivo de la aplicación completa con la nueva arquitectura de datos.
    3.  Finalización de las actualizaciones de Memory Bank para reflejar la arquitectura nativa-only y la integración de Prisma.
-   **State:**
    -   **Project Direction:** Nativo-only (iOS y Android). El soporte web ha sido completamente eliminado.
    -   **Memory Bank:** Actualizado a la versión 0.9.5 para reflejar la integración de Prisma y el enfoque nativo-only.
    -   **Application Core (Native):** Funcionalidades clave (obtención de datos, audio, componentes de UI) estables para plataformas nativas.
        -   Expo Router, theming, fuentes personalizadas, `react-native-safe-area-context` integrados.
        -   **Data Sources (API-Driven con Prisma):**
            -   **Arabic Text, Surah List, Translations:** Ahora servidos a través de Vercel Serverless Functions utilizando Prisma ORM con Neon Adapter. **Status: Implementado y probado.**
            -   **Audio Files:** Alojados en Vercel Blob. **Status: Estable.**
    -   **`src/hooks/useAudioPlayer.ts`**: Estable.
    -   **UI Components (Versiones Nativas)**: `PlatformSlider.tsx` (ahora solo nativo), `VerseCard.tsx`, `AudioControlBar.tsx` estables para nativo.
    -   **Vercel API Functions (`api/v2/*.ts`):** Los endpoints antiguos (`api/*`) han sido eliminados. Los nuevos (`api/v2/*`) están implementados con Prisma. **Status: Implementado y probado.**

## 2. Recent Changes / Milestones

-   **Migración a Prisma ORM + Neon Completada (2025-05-23):**
    -   **Fase 1 (Preparación y Setup):** Dependencias instaladas, `prisma/schema.prisma` configurado e introspeccionado, cliente Prisma generado con `binaryTargets` para Vercel.
    -   **Fase 2 (Migración de Endpoints):** Cliente Prisma centralizado creado (`api/lib/prisma.ts`), nuevos endpoints `/api/v2/get-verses.ts`, `/api/v2/get-metadata.ts`, `/api/v2/get-translated-verse.ts` implementados con Prisma.
    -   **Fase 3 (Actualización del Frontend):** `src/services/apiClient.ts` modificado para usar los nuevos endpoints `/api/v2/`.
    -   **Fase 4 (Testing y Deprecación):** Endpoints `/api/v2/` probados y confirmados como funcionales. Endpoints antiguos (`api/*.ts`) eliminados del proyecto.
    -   **Correcciones de Despliegue:** Resueltos problemas de "Cannot find module" y errores de tipo `TS7006` en Vercel.
-   **Eliminación Completa de la Plataforma Web (2025-05-19):**
    -   Configuraciones, dependencias y código específicos de la web eliminados.
    -   Confirmado que la aplicación iOS sigue funcionando.
-   **Actualización Integral del Memory Bank (En curso - 2025-05-23):**
    -   Todos los documentos del Memory Bank están siendo revisados y actualizados para reflejar la arquitectura nativa-only y la integración de Prisma.
-   **Corrección de Enrutamiento API y Build (Previa - Estable):** (Resuelto, como se documentó previamente)
-   **Cambio Arquitectónico a Contenido Impulsado por API (Previa - Estable):** (Estable, como se documentó previamente)
-   **Refactorización Integral de Estabilidad de Audio (Previa - Estable):** (Estable, como se documentó previamente)

## 3. Próximos Pasos Inmediatos

1.  **Testing Exhaustivo de la Aplicación Completa:**
    -   Realizar pruebas exhaustivas de todas las funcionalidades de la aplicación (lectura, audio, navegación, etc.) en iOS y Android con la nueva arquitectura de datos basada en Prisma.
    -   Monitorear el rendimiento y la estabilidad.
2.  **Limpieza Final del Proyecto:**
    -   Guía al usuario para eliminar archivos y directorios temporales/obsoletos (`.expo`, `node_modules` y reinstalar dependencias).
    -   Considerar `npx expo prebuild --clean` si es necesario.
3.  **Finalizar Documentación del Memory Bank:**
    -   Asegurar que todos los documentos del Memory Bank (`projectbrief.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `activeContext.md`, `progress.md`, `.clinerules`) reflejen completamente la arquitectura nativa-only y la integración de Prisma.

## 4. Decisiones Clave Tomadas

-   **Migración a Prisma ORM + Neon Completada (2025-05-23):** Se ha completado la migración a Prisma ORM con el adaptador Neon, mejorando el type safety, la experiencia del desarrollador y la mantenibilidad. Los endpoints antiguos han sido eliminados.
-   **Transición a Enfoque Nativo-Only (iOS/Android) (2025-05-19):** Se ha eliminado completamente el soporte de la plataforma web para optimizar el desarrollo y enfocar los recursos en la calidad de la aplicación nativa.
-   **Datos Impulsados por API para Contenido Central (2025-05-19):** Las listas de Surahs y las traducciones ahora son completamente impulsadas por API a través de Prisma ORM.
-   **Estrategia de Enrutamiento de API de Vercel:** (Estable, como se documentó previamente)
-   **Configuración de TypeScript de API:** (Estable, como se documentó previamente)
-   **Sincronización de Estado Impulsada por Eventos para Audio:** (Estable, como se documentó previamente)

## 5. Preguntas Abiertas / Consideraciones

-   **Testing Exhaustivo:** La prioridad principal es el testing completo de la aplicación para asegurar la estabilidad y el rendimiento con la nueva arquitectura de datos.
-   **Revisión de Polyfills:** Reevaluar los polyfills de `metro.config.js` para determinar si alguno puede eliminarse de forma segura ahora que el soporte web ha desaparecido.
-   **`tsconfig.json` `"dom"` lib:** Reevaluar si la biblioteca `"dom"` puede eliminarse de `compilerOptions.lib` del `tsconfig.json` raíz.
-   **Plataforma Android:** Confirmar si el soporte de Android es un objetivo activo para el testing y desarrollo.
-   **Matices de Enrutamiento de Vercel y Ruta Comodín:** (Sigue siendo relevante si la estructura de la API evoluciona)
-   **Rendimiento/Fiabilidad de la API y la Base de Datos para Nativo:** (Sigue siendo relevante)

Este documento refleja el contexto activo después de la finalización de la migración a Prisma ORM + Neon y la transición a una aplicación nativa-only (iOS y Android).
=======
    1.  Finalizing Memory Bank updates to reflect the new data architecture (API/DB for translations and metadata, Edge Config for metadata caching).
    2.  Ensuring stability and correctness of the Verse of the Day feature after recent fixes (CORS, caching logic).
    3.  Preparing for thorough testing of all data fetching paths.
-   **State:**
    -   **Memory Bank:** Core documents are being updated to version 0.9.5.
    -   **Application Core:**
        -   Expo Router, theming, custom fonts, `react-native-safe-area-context` are integrated.
        -   **Data Sources (API-Driven & Edge-Config Enhanced):**
            -   **Arabic Text:** Neon PostgreSQL DB (`quran_text` table) via Vercel Serverless Functions (e.g., `api/get-verses.ts`), accessed by `src/services/apiClient.ts`. **Status: Stable.**
            -   **English Translations (Yusuf Ali):** Neon PostgreSQL DB (`en_yusufali` table) via Vercel Serverless Functions (e.g., `api/get-translation-verses.ts`), accessed by `src/services/apiClient.ts`. **Status: Implemented, requires testing.**
            -   **Surah List & Other Metadata:** Vercel Edge Config (primary, item `quranMetadata`) / Neon PostgreSQL DB (fallback, e.g., `quran_surahs` table) via `api/get-metadata.ts`. Accessed by `src/services/quranMetadataService.ts`. **Status: Implemented, requires testing.**
            -   **Audio Files:** Hosted on Vercel Blob, URLs managed by `src/services/audioService.ts`. **Status: Stable.**
    -   **Service Layer:**
        -   `src/services/apiClient.ts`: Handles all direct calls to Vercel API functions.
        -   `src/services/quranMetadataService.ts`: Fetches metadata (Surah list, etc.) from Edge Config with API/DB fallback.
        -   `src/services/surahService.ts`: Orchestrates data fetching using `apiClient.ts` and `quranMetadataService.ts`.
        -   `src/services/quranDbService.ts`: Deprecated.
    -   **`src/hooks/useAudioPlayer.ts`**: Stable.
    -   **UI Components (`PlatformSlider.tsx`, `VerseCard.tsx`, `AudioControlBar.tsx`, `VerseOfTheDay.tsx`)**: VerseOfTheDay recently debugged for caching and data fetching.
    -   **Vercel API Functions (`api/*.ts`):**
        -   All endpoints (`get-metadata`, `get-verse`, `get-verses`, `get-translation-verses`, `get-translated-verse`) now include CORS headers.
        -   Build configuration and routing in `vercel.json` are stable.
        -   Environment variables (`EDGE_CONFIG`, `NEON_DATABASE_URL`) are critical.

## 2. Recent Changes / Milestones

-   **Verse of the Day Fix (2025-05-15):**
    -   Resolved "error loading verse text" by:
        -   Implementing a new API endpoint `api/get-translated-verse.ts` to fetch Arabic text and translation for a single verse.
        -   Updating `apiClient.ts` and `surahService.ts` (`fetchRandomVerse`) to use this new endpoint.
        -   Correcting client-side caching logic in `VerseOfTheDay.tsx` to prevent caching of error states and ensure proper cache invalidation.
        -   Adding CORS headers to all Vercel API functions to resolve cross-origin issues when running the web app locally against deployed APIs.
-   **Data Migration for Translations (2025-05-15):**
    -   Successfully migrated Yusuf Ali English translations from a MySQL dump (`dump4.sql`) to the `en_yusufali` table in Neon PostgreSQL DB using `scripts/migrateYusufaliDumpToNeon.js`.
-   **API Routing and Build Fix (Prior - Stable):**
    -   Resolved 404 errors for Vercel API routes.

## 3. Next Immediate Steps

1.  **Complete Memory Bank Update:** Ensure all memory bank documents accurately reflect the current architecture (API/DB for translations, Edge Config/API/DB for metadata, service roles, CORS).
2.  **Thorough Testing (Manual & Automated if possible):**
    -   **Verse of the Day:** Confirm it loads correctly on all platforms (iOS, Android, Web) after cache clearing and on subsequent loads (testing cache).
    -   **Reader Screen:** Verify Arabic text and translations load correctly for various Surahs/verses.
    -   **Surah List Screen:** Verify Surah list loads correctly.
    -   **API Endpoints:** Systematically test all API endpoints with valid/invalid parameters.
    -   **Edge Config:** Test behavior when Edge Config is available vs. when it falls back to API.
    -   **Audio Playback:** Re-verify overall audio playback stability.
3.  **Address any bugs or UX issues identified during testing.**

## 4. Key Decisions Made

-   **API-Driven Translations:** Yusuf Ali translations are now served from the database via API, replacing Vercel Blob JSON files for this purpose.
-   **Edge Config for Metadata:** Quranic structural metadata (Surah list, etc.) is primarily served from Vercel Edge Config, with API/DB as a fallback, replacing Vercel Blob JSON files.
-   **Dedicated API for Single Translated Verse:** Created `api/get-translated-verse.ts` for efficient fetching for features like Verse of the Day.
-   **CORS Configuration for APIs:** Implemented to support web app development and access.
-   **Vercel API Routing Strategy:** Explicit `dest` paths in `vercel.json` (Stable).
-   **API TypeScript Configuration:** Specialized `api/tsconfig.json` (Stable).

## 5. Open Questions / Considerations

-   **Edge Config Population & Management:** Ensure the `edge-config-data.json` (generated by `scripts/convertQuranData.js`) is correctly uploaded to the Vercel Edge Config store associated with `process.env.EDGE_CONFIG`.
-   **Performance of API vs. Edge Config:** Monitor and compare performance once Edge Config is fully utilized.
-   **Error Handling & Resilience:** Continue to refine error handling in data fetching services and UI components.
-   **Testing on Android:** Needs to be prioritized.

This document reflects the context after significant architectural changes to data fetching and recent debugging of the Verse of the Day feature.
>>>>>>> 6782f209f2ec1abb8fff5d8bb212e5ef19bceef8
