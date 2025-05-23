# Progress: Luminous Verses (Expo App)

**Version:** 0.9.4 (API Routes Stable - Undergoing Full Memory Bank Review)
**Date:** 2025-05-19
**Related Brief:** `memory-bank/projectbrief.md` (Version 0.9.4)
**Active Context:** `memory-bank/activeContext.md` (Version 0.9.4)

## 1. What Works / Completed (as of 2025-05-23)

-   **Project Setup & Core Dependencies:** (Stable)
-   **Basic App Structure & Navigation:** (Stable)
-   **Theming & Styling:** (Stable)
-   **Font Loading:** (Stable)
-   **Layout Management:** (Stable)
-   **Home Screen (`app/(tabs)/index.tsx`):** (Stable)
-   **Surahs Screen (`app/(tabs)/surahs.tsx`):** (Stable, data loading correctly)
-   **Reader Screen (`app/(tabs)/reader.tsx`):**
    -   **Data Fetching (Hybrid Model):**
        -   Fetches Arabic Quranic text from Neon PostgreSQL DB via Vercel Serverless Functions (using `src/services/apiClient.ts`). **Status: Stable.**
        -   Fetches Surah list and Yusuf Ali translations (both now via API). **Status: Stable.**
        -   `src/services/surahService.ts` orchestrates this hybrid data retrieval. **Status: Stable.**
    -   **Audio Playback & Controls (using `expo-audio` via `useAudioPlayer.ts`):** (Stable, as previously documented)
-   **Prisma ORM Integration (Fase 1 & 2 Completadas):**
    -   Instaladas dependencias `prisma`, `@prisma/client`, `@prisma/adapter-neon`.
    -   Creado `prisma/schema.prisma` con `driverAdapters` y `postgresql` datasource.
    -   Ejecutado `npx prisma db pull` y `npx prisma generate` para introspección y generación del cliente.
    -   Ajustado `prisma/schema.prisma` para renombrar modelos y campos según el plan.
    -   Creado `lib/prisma.ts` para el cliente Prisma centralizado con Neon Adapter.
    -   Implementados nuevos endpoints `/api/v2/get-verses.ts`, `/api/v2/get-metadata.ts`, `/api/v2/get-translated-verse.ts` usando Prisma.
    -   Actualizado `api/tsconfig.json` para permitir importaciones desde `lib/prisma.ts`.
    -   Actualizado `vercel.json` para incluir las nuevas rutas `/api/v2/*` y los archivos necesarios para el build de Prisma.
-   **Frontend API Client Update (Fase 3 Completada):**
    -   Modificado `src/services/apiClient.ts` para usar los nuevos endpoints `/api/v2/`.
-   **Vercel Serverless Functions (`api/*.ts`):**
    -   Implementado `api/get-verses.ts`, `api/get-verse.ts`, y `api/get-metadata.ts`.
    -   **Resuelto:** Los problemas de sintaxis de módulos y enrutamiento que causaban errores 404 están solucionados.
    -   Las funciones se construyen correctamente usando `api/tsconfig.json` (CommonJS) y la sintaxis `import` de módulos ES.
    -   El enrutamiento en `vercel.json` mapea correctamente a los archivos fuente `.ts`.
    -   Configurado con `pg` para la conexión a la base de datos (versiones antiguas).
-   **`src/services/apiClient.ts`:** (Ahora apunta a `/api/v2/` por defecto)
-   **`src/services/quranMetadataService.ts`:** (Estable, obteniendo de la API después de la verificación de Edge Config)
-   **`src/services/surahService.ts`:** (Estable)
-   **`src/services/audioService.ts`:** (Estable)
-   **`src/hooks/useAudioPlayer.ts`:** (Estable)
-   **Componentes de UI (`VerseCard.tsx`, `PlatformSlider.tsx`, `AudioControlBar.tsx`):** (Estable)
-   **`tsconfig.json` y `api/tsconfig.json`:** Las configuraciones son estables y funcionan.
-   **`vercel.json`:** La configuración de enrutamiento es estable y funciona.
-   **Eliminación de la Plataforma Web (Fase 1 - Configuración y Dependencias):** (Completado 2025-05-19)
    -   `app.json` actualizado para eliminar la plataforma "web" y las configuraciones.
    -   `package.json` actualizado para eliminar `react-dom`, `react-native-web` y scripts específicos de la web. Se ejecutó `npm install`.
    -   `tsconfig.json` raíz y `metro.config.js` revisados (enfoque conservador, sin cambios importantes más allá de las implicaciones de las dependencias).
-   **Eliminación de la Plataforma Web (Fase 2 - Refactorización de Código):** (Completado 2025-05-19)
    -   Se eliminó la lógica condicional `Platform.OS === 'web'` y las implementaciones específicas de la web de los componentes (`ScreenBackground.tsx`, `PlatformSlider.tsx`, `VerseOfTheDay.tsx`, `SurahCard.tsx`, `VerseCard.tsx`, `app/(tabs)/index.tsx`).
    -   Se eliminó `PlatformSlider.css`.
    -   Se confirmó que la aplicación iOS sigue funcionando después de estos cambios.

## 2. What's Left to Build / Fix (High-Level for Expo Port)

-   **Thorough Testing of Hybrid Data Retrieval & Audio System:**
    -   **Data Flow:**
        -   Verify correct fetching and display of Arabic text from API/DB across various Surahs/verses.
        -   Verify correct fetching and display of translations via API.
        -   Test error handling scenarios (API down, DB error, missing Blob files).
    -   **Audio Stability:** (As previously listed - verify stability, controls, UI indicators, precision, accessibility, autoplay)
-   **UI Implementation & Refinement (All Screens - Post Audio Test):** (As before)
    -   Implement proper tab bar icons (currently placeholder text icons as seen in [`app/(tabs)/_layout.tsx`](app/(tabs)/_layout.tsx:8)).
-   **Core Quran Functionality (Post Audio Test):** (As before)
-   **Data Layer Expansion (Supabase for user data):** (As before)
-   **Theming & Styling:** (As before)
-   **Native Platform Polish & Testing (iOS/Android).**
-   **Complete Web Platform Removal (Phase 3 - Cleanup & Testing):**
    -   Perform full project cleanup (clear Metro cache, guide user to delete `node_modules` & `.expo`, then reinstall dependencies).
    -   Consider `npx expo prebuild --clean` if native project directories exist and might contain stale web configurations.
    -   Conduct thorough testing of native iOS (and Android) app.
-   **Finalize Documentation for Native-Only (Phase 4):**
    -   Complete updates to all memory bank documents (`projectbrief.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `activeContext.md`, `progress.md`, `.clinerules`) to reflect native-only architecture.

## 3. Current Status (as of 2025-05-23)

-   **Overall:** The project is actively transitioning to a native-only (iOS/Android) application. Web platform configurations and web-specific code have been largely removed. The Vercel API routes and core native functionalities (data, audio) remain stable.
-   **Resolved Issue:** Persistent 404 errors for API routes have been fixed through a combination of:
    1.  A specialized `api/tsconfig.json` for CommonJS output.
    2.  Using ES Module `import` syntax in API source files.
    3.  Updating `vercel.json` routes to point `dest` to the `.ts` source files (e.g., `dest: "/api/get-metadata.ts"`).
-   **Current Task Group:** Migración a Prisma ORM + Neon (Fases 1, 2 y 3 completadas).
-   **Próximo Enfoque Principal:** Fase 4 - Testing paralelo, migración gradual del frontend y deprecación de endpoints antiguos.

## 4. Known Issues / Blockers / Considerations (Current)

-   **Testing Required (Data & Audio):** (Still the highest priority)
    -   The API-driven data flow needs comprehensive testing.
    -   The audio architecture requires continued thorough testing.
-   **Polyfill Review:** Re-evaluate `metro.config.js` polyfills for removal if exclusively web-related (requires careful checking against native dependencies).
-   **`tsconfig.json` `"dom"` lib:** Re-evaluate if the `"dom"` library can be removed from root `tsconfig.json`.
-   **Android Platform:** Confirm active target status for testing and development focus.
-   **Lottie Animation Loop:** (As before)
-   **ReaderScreen Content:** (As before)
-   **Vercel Routing Nuances:** The solution of pointing `dest` to `.ts` files in `vercel.json` was key. If a wildcard route is re-added, it needs careful placement and testing.

This document will be updated as the project progresses.