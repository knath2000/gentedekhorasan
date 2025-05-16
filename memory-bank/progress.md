# Progress: Luminous Verses (Expo App)

**Version:** 0.9.4 (API Routes Stable)
**Date:** 2025-05-15
**Related Brief:** `docs/projectbrief.md` (Version 0.9.3)
**Active Context:** `docs/activeContext.md` (Version 0.9.4)

## 1. What Works / Completed (as of 2025-05-15)

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
        -   Fetches Surah list and Yusuf Ali translations (Surah list now via API, translations from Vercel Blob). **Status: Stable.**
        -   `src/services/surahService.ts` orchestrates this hybrid data retrieval. **Status: Stable.**
    -   **Audio Playback & Controls (using `expo-audio` via `useAudioPlayer.ts`):** (Stable, as previously documented)
-   **Vercel Serverless Functions (`api/*.ts`):**
    -   Implemented `api/get-verses.ts`, `api/get-verse.ts`, and `api/get-metadata.ts`.
    -   **Resolved:** Module syntax and routing issues causing 404 errors are fixed.
    -   Functions are correctly built using `api/tsconfig.json` (CommonJS) and ES Module `import` syntax.
    -   Routing in `vercel.json` correctly maps to `.ts` source files.
    -   Configured with `pg` for database connection.
-   **`src/services/apiClient.ts`:** (Stable)
-   **`src/services/quranMetadataService.ts`:** (Stable, fetching from API after Edge Config check)
-   **`src/services/surahService.ts`:** (Stable)
-   **`src/services/audioService.ts`:** (Stable)
-   **`src/hooks/useAudioPlayer.ts`:** (Stable)
-   **UI Components (`VerseCard.tsx`, `PlatformSlider.tsx`, `AudioControlBar.tsx`):** (Stable)
-   **`tsconfig.json` & `api/tsconfig.json`:** Configurations are stable and working.
-   **`vercel.json`:** Routing configuration is stable and working.

## 2. What's Left to Build / Fix (High-Level for Expo Port)

-   **Thorough Testing of Hybrid Data Retrieval & Audio System:**
    -   **Data Flow:**
        -   Verify correct fetching and display of Arabic text from API/DB across various Surahs/verses.
        -   Verify correct fetching and display of translations from Vercel Blob.
        -   Test error handling scenarios (API down, DB error, missing Blob files).
    -   **Audio Stability:** (As previously listed - verify stability, controls, UI indicators, precision, accessibility, autoplay)
-   **UI Implementation & Refinement (All Screens - Post Audio Test):** (As before)
-   **Core Quran Functionality (Post Audio Test):** (As before)
-   **Data Layer Expansion (Supabase for user data):** (As before)
-   **Theming & Styling:** (As before)
-   **Cross-Platform Polish & Testing.** (As before)

## 3. Current Status

-   **Overall:** The application's Vercel API routes are now stable and correctly serving data. The hybrid data model (API/DB for Arabic text & metadata, Blob for translations & audio) is functional. The audio playback system remains stable.
-   **Resolved Issue:** Persistent 404 errors for API routes have been fixed through a combination of:
    1.  A specialized `api/tsconfig.json` for CommonJS output.
    2.  Using ES Module `import` syntax in API source files.
    3.  Updating `vercel.json` routes to point `dest` to the `.ts` source files (e.g., `dest: "/api/get-metadata.ts"`).
-   **Current Task Group:** Finalizing Memory Bank documentation for the API fixes.
-   **Next Major Feature Focus:** Thorough testing of the now-functional API-driven data retrieval and the stable audio system across all platforms.

## 4. Known Issues / Blockers / Considerations (Current)

-   **Testing Required (Data & Audio):** (Still the highest priority)
    -   The API-driven data flow needs comprehensive testing.
    -   The audio architecture requires continued thorough testing.
-   **Web Slider Styling:** (As before)
-   **Lottie Animation Loop:** (As before)
-   **ReaderScreen Content:** (As before)
-   **Vercel Routing Nuances:** The solution of pointing `dest` to `.ts` files in `vercel.json` was key. If a wildcard route is re-added, it needs careful placement and testing.

This document will be updated as the project progresses.