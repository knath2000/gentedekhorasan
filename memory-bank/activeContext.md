# Active Context: Luminous Verses (Expo App)

**Version:** 0.9.5 (Database-Driven Translations & Metadata, CORS Fixes)
**Date:** 2025-05-15
**Related Brief:** `docs/projectbrief.md`
**Related Progress:** `docs/progress.md`

## 1. Current Focus & State

-   **Focus:**
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