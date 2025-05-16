# Active Context: Luminous Verses (Expo App)

**Version:** 0.9.3 (Reflects API-Driven Architecture & Audio Stability)
**Date:** 2025-05-15
**Related Brief:** `docs/projectbrief.md`
**Related Progress:** `docs/progress.md`
**Previous Refactoring Plan (Tap-to-Play):** `docs/updated_audio_playback_refactoring_plan.md`
**Current Refactoring Plan (Precision):** `docs/audio_playback_refactoring_strategy.md` (or similar, assuming a new plan doc was mentally noted)

## 1. Current Focus & State

-   **Focus:** Consolidating and documenting:
    1.  The architectural shift to an API-driven model for Arabic Quranic text (Vercel Serverless Functions + Neon PostgreSQL DB).
    2.  The comprehensive audio playback stability achieved through recent refactoring (mono-instance player, event-driven UI sync, precision fixes).
    3.  **Fixing module syntax errors in Vercel API functions** that are preventing metadata loading and causing the surah page to fail.
-   **State:**
    -   **Memory Bank:** Core documents are being updated to version 0.9.3 to reflect both architectural and audio system changes.
    -   **Application Core:**
        -   Expo Router, theming, custom fonts, `react-native-safe-area-context` are integrated.
        -   **Data Sources (Hybrid Model):**
            -   **Arabic Text:** Neon PostgreSQL DB via Vercel Serverless Functions (e.g., `api/get-verses.ts`), accessed by `src/services/apiClient.ts`.
            -   **Translations & Surah List:** Static JSON files from Vercel Blob, accessed by `src/services/surahService.ts`.
            -   **Audio Files:** Hosted on Vercel Blob, URLs managed by `src/services/audioService.ts`.
    -   **`src/hooks/useAudioPlayer.ts` (formerly `useQuranAudioPlayer.ts` - name standardized):**
        -   **Refactored:** Implements a 'play-on-create' (mono-instance) audio player lifecycle using `expo-audio`'s library-provided `useAudioPlayer`.
        -   **Refactored:** UI state (playing, paused, buffering, time, duration) is now strictly synchronized via player events (`onPlaybackStatusUpdate`) dispatched to a reducer, ensuring UI accurately reflects true player state. This resolved previous issues with stuck buffering icons and desynchronized controls.
        -   **Refactored:** Toggle logic (play/pause/resume) is robust and aligns with `expo-audio` best practices.
        -   **Enhanced:** Includes numeric precision fixes (rounding `durationMillis`, `positionMillis`, and `seekAudio` inputs) as part of the overall stability effort.
    -   **`src/components/PlatformSlider.tsx`:**
        -   **Modified:** All numeric props (`value`, `minimumValue`, `maximumValue`) passed to the native `SliderIOS` are now rounded using `Math.round()`.
        -   **Modified:** `accessibilityValue` fields (`min`, `max`, `now`) are also rounded before being passed to `SliderIOS`.
        -   **Modified:** For the web `input type="range"`, `min`, `max`, and `value` attributes are rounded. `aria-valuemin`, `aria-valuemax`, `aria-valuenow` are also rounded.
        -   **Modified:** Values from `onChange` and `onSlidingComplete` for the web slider are rounded before being passed to the callback.
    -   **`src/components/VerseCard.tsx`:**
        -   **Modified:** `positionMillis` and `durationMillis` props are rounded using `Math.round()` before being used to calculate `currentPositionMillis` and `currentDurationMillis`.
        -   **Modified:** These rounded values are then used for the `PlatformSlider` props (`value`, `maximumValue`, `accessibilityValue.max`, `accessibilityValue.now`) and in the `formatTime` function.
        -   **Modified:** The `onSlidingComplete` callback now passes a rounded value to `onSeek`.
        -   **Modified:** `formatTime` function now rounds its input `millis` argument.
    -   **`src/components/AudioControlBar.tsx`:**
        -   **Verified:** No changes needed as its `formatTime` function already handles rounding appropriately, and it receives already-rounded props from `useQuranAudioPlayer.ts`.
    -   **Vercel API Functions:**
        -   **Issue Identified:** Module syntax errors in `api/get-metadata.ts` causing failures when the client tries to fetch metadata.
        -   **Root Cause:** TypeScript configuration mismatch - global `tsconfig.json` set to `"module": "esnext"` but Vercel serverless functions require CommonJS syntax.
        -   **Proposed Solution:** Created a plan for a specialized TypeScript configuration for the API directory to ensure proper CommonJS module output.

## 2. Recent Changes / Milestones

-   **API Module Syntax Issue Investigation (2025-05-15):**
    -   Identified "Unexpected token 'export'" error in Vercel logs when the client attempts to fetch metadata.
    -   Discovered TypeScript configuration using ES modules (`"module": "esnext"`) which conflicts with Vercel serverless function requirements.
    -   Identified missing Edge Config connection string in environment variables.
    -   Created a detailed solution plan in `memory-bank/solution-vercel-api-module-syntax.md` involving specialized TypeScript configuration for API routes.
-   **Architectural Shift to API-Driven Content (Approx. 2025-05-15 or prior):**
    -   Implemented Vercel Serverless Functions (e.g., `api/get-verses.ts`, `api/get-verse.ts`) to serve Arabic Quranic text from a Neon PostgreSQL database.
    -   Integrated `src/services/apiClient.ts` to fetch data from these API endpoints.
    -   Modified `src/services/surahService.ts` to use `apiClient.ts` for Arabic text and continue fetching translations and Surah lists from Vercel Blob, creating a hybrid data model.
    -   The `src/services/quranDbService.ts` (direct client-side DB connection) was effectively deprecated/commented out in favor of the serverless function approach.
-   **Comprehensive Audio Stability Refactor (2025-05-14):**
    -   Implemented a 'play-on-create' (mono-instance) audio player lifecycle within `src/hooks/useAudioPlayer.ts`.
    -   Established strict event-driven UI state synchronization.
    -   Resolved issues with stuck buffering UI and desynchronized controls.
    -   Ensured reliable toggle logic.
    -   Integrated numeric precision fixes.
-   **Previous - Audio Playback Refactoring - Tap-to-Play & Accessibility (2025-05-14):** (Details as before)

## 3. Next Immediate Steps

1.  **Implement API Module Syntax Fix:**
    -   Create a specialized `tsconfig.json` for the `/api` directory that uses CommonJS modules.
    -   Update Vercel configuration in `vercel.json` to specify how API routes should be built.
    -   Configure the Edge Config environment variable in Vercel project settings.
    -   Implement local fallback for Edge Config to ensure the app works in development environments.
2.  **Update Memory Bank & `.clinerules`:** Reflect both the new API-driven architecture for Quranic text and the comprehensive audio stability refactor.
3.  **Testing (Manual by User):**
    -   **Data Retrieval:** Verify correct fetching and display of Arabic text from API/DB and translations/Surah list from Blob. Test error handling for API/DB issues.
    -   **Metadata Loading:** Verify the surah list and other metadata load correctly after implementing the API module syntax fix.
    -   **Audio Playback:** Verify overall audio playback stability, responsiveness of controls, accuracy of UI indicators, and elimination of precision errors across platforms.
    -   **Accessibility:** Test with VoiceOver (iOS) and TalkBack (Android) for both data display and audio controls.
4.  **Address any bugs or UX issues identified during testing (data or audio related).**

## 4. Key Decisions Made

-   **TypeScript Configuration Strategy:** Decided to create a specialized `tsconfig.json` for the API directory to ensure proper CommonJS module output rather than changing the global configuration, which would affect the React Native client app.
-   **Edge Config with API Fallback:** Implemented a layered approach where the app first tries to fetch metadata from Edge Config for performance, then falls back to API requests if Edge Config is unavailable.
-   **Hybrid Data Model:** Adopted a model where dynamic/core content (Arabic Quran text) is served via an API from a database, while more static assets (translations, Surah list, audio files) are served from Vercel Blob. This provides flexibility for the core text and CDN benefits for static assets.
-   **Serverless Functions for Data Access:** Utilized Vercel Serverless Functions to abstract direct database access from the client, improving security and manageability.
-   **Event-Driven State Synchronization for Audio:** (As before)
-   **Mono-instance 'Play-on-Create' Player Lifecycle:** (As before)
-   **Systematic Rounding for Numeric Precision:** (As before)
-   **Defensive Programming in Components:** (As before)

## 5. Open Questions / Considerations

-   **Module System Compatibility:** Maintaining dual module system support (ES modules for the client, CommonJS for serverless functions) adds complexity. Long-term, we may want to standardize on a single approach or improve our build pipeline to handle this automatically.
-   **TypeScript Configuration Management:** Consider refining the build process to automatically apply the right TypeScript configuration based on the target environment (client vs. serverless).
-   **Edge Config vs. API Trade-offs:** Monitor performance differences between Edge Config data access and direct API calls to optimize which data should be stored in each system.
-   **Thorough Testing of Hybrid Data & New Audio Architecture:** Comprehensive testing is needed across all platforms to confirm:
    -   Correct and reliable data fetching from both API/DB and Vercel Blob.
    -   Stability and correctness of the event-driven audio architecture and mono-instance player.
    -   No new regressions introduced by either architectural change.
-   **API & Database Performance/Reliability:** Monitor performance of Vercel Functions and Neon DB under load. Ensure robust error handling for API/DB unavailability.
-   **Audio Performance:** (As before)

This document reflects the context after the shift to an API-driven model for Arabic text, the implementation of precision fixes for audio playback, and our plan to resolve the module syntax errors in Vercel API functions.