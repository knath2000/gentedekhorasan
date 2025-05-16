# Active Context: Luminous Verses (Expo App)

**Version:** 0.9.4 (API Routes Stable)
**Date:** 2025-05-15
**Related Brief:** `docs/projectbrief.md`
**Related Progress:** `docs/progress.md`

## 1. Current Focus & State

-   **Focus:**
    1.  Confirming stability of Vercel API routes after routing and TypeScript configuration fixes.
    2.  Thorough testing of data fetching from API and Vercel Blob.
    3.  Updating documentation to reflect the API fixes and current architecture.
-   **State:**
    -   **Memory Bank:** Core documents are being updated to version 0.9.4.
    -   **Application Core:**
        -   Expo Router, theming, custom fonts, `react-native-safe-area-context` are integrated.
        -   **Data Sources (Hybrid Model):**
            -   **Arabic Text:** Neon PostgreSQL DB via Vercel Serverless Functions (e.g., `api/get-verses.ts`), accessed by `src/services/apiClient.ts`. **Status: Stable.**
            -   **Translations & Surah List:** Static JSON files from Vercel Blob, accessed by `src/services/surahService.ts`. **Status: Stable.**
            -   **Audio Files:** Hosted on Vercel Blob, URLs managed by `src/services/audioService.ts`. **Status: Stable.**
    -   **`src/hooks/useAudioPlayer.ts`**: Stable (as previously documented).
    -   **UI Components (`PlatformSlider.tsx`, `VerseCard.tsx`, `AudioControlBar.tsx`)**: Stable (as previously documented).
    -   **Vercel API Functions (`api/*.ts`):**
        -   **Resolved:** Previous module syntax and routing issues causing 404 errors have been fixed.
        -   API functions are now correctly built using a specialized `api/tsconfig.json` (CommonJS modules).
        -   API functions use ES Module `import` syntax, which is correctly transpiled.
        -   Vercel routing in `vercel.json` now correctly maps requests to the `.ts` source files (e.g., `dest: "/api/get-metadata.ts"`).
        -   Environment variables (`EDGE_CONFIG`, `NEON_DATABASE_URL`) are confirmed to be correctly set in Vercel.

## 2. Recent Changes / Milestones

-   **API Routing and Build Fix (2025-05-15):**
    -   Successfully resolved persistent 404 errors for Vercel API routes.
    -   **Key Fixes:**
        1.  Created a specialized `api/tsconfig.json` with `"module": "commonjs"` and `"esModuleInterop": true`.
        2.  Updated API source files (`api/get-metadata.ts`, `api/get-verse.ts`, `api/get-verses.ts`) to use ES Module `import` syntax.
        3.  Modified `vercel.json` `routes` to explicitly point the `dest` to the `.ts` source files (e.g., `"dest": "/api/get-metadata.ts"`), and removed the generic wildcard as the primary resolver for these specific routes.
    -   This multi-step solution ensured correct TypeScript compilation for the Vercel Node.js environment and proper request routing to the deployed serverless functions.
-   **API Module Syntax Issue Investigation (2025-05-15):** (Details as before, now part of the resolved history)
-   **Architectural Shift to API-Driven Content (Approx. 2025-05-15 or prior):** (Stable)
-   **Comprehensive Audio Stability Refactor (2025-05-14):** (Stable)

## 3. Next Immediate Steps

1.  **Thorough Testing (Manual by User & Automated if possible):**
    -   **API Endpoints:** Systematically test all API endpoints (`/api/get-metadata`, `/api/get-verse`, `/api/get-verses`) with various valid and invalid parameters to ensure they return correct data and handle errors gracefully.
    -   **Application Data Flow:** Verify in-app that Arabic text (from API/DB), translations (from Blob), and Surah lists (from API via Edge Config/DB or Blob) are fetched and displayed correctly on all relevant screens.
    -   **Audio Playback:** Re-verify overall audio playback stability.
    -   **Accessibility:** Continue testing with VoiceOver/TalkBack.
2.  **Update Memory Bank & `.clinerules`:** Complete documentation updates for the API fixes and current architecture.
3.  **Address any bugs or UX issues identified during testing.**
4.  **Consider re-adding a well-tested wildcard route to `vercel.json`** if needed for future API endpoints, ensuring it doesn't conflict with the explicit routes. For now, explicit routes are preferred for stability.

## 4. Key Decisions Made

-   **Vercel API Routing Strategy:** Explicitly defining `dest` paths in `vercel.json` routes to point directly to the `.ts` source files (e.g., `dest: "/api/get-metadata.ts"`) was crucial for resolving 404 errors, after ensuring correct TypeScript compilation.
-   **API TypeScript Configuration:** Using a specialized `api/tsconfig.json` with `"module": "commonjs"` and `"esModuleInterop": true` for the API directory, while API source files use ES Module `import` syntax.
-   **Edge Config with API Fallback:** (Stable)
-   **Hybrid Data Model:** (Stable)
-   **Serverless Functions for Data Access:** (Stable)
-   **Event-Driven State Synchronization for Audio:** (Stable)

## 5. Open Questions / Considerations

-   **Vercel Routing Nuances:** The exact interaction between `vercel.json` builds, `routes`, and TypeScript compilation for serverless functions required careful iteration. Explicit `dest` paths to `.ts` files proved effective.
-   **Wildcard Route Reintroduction:** If a general wildcard route (e.g., `{"src": "/api/([^/]+)", "dest": "/api/$1.ts"}`) is added back to `vercel.json`, it needs to be placed *after* the explicit routes and tested thoroughly to ensure it doesn't override them or cause new issues.
-   **Thorough Testing of Hybrid Data & New Audio Architecture:** (Still relevant)
-   **API & Database Performance/Reliability:** (Still relevant)

This document reflects the context after successfully resolving the Vercel API 404 errors. The application's data fetching capabilities should now be operational.