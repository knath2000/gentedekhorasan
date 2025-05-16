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

## 2. Recent Changes / Milestones

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

1.  **Update Memory Bank & `.clinerules`:** (This step) Reflect both the new API-driven architecture for Quranic text and the comprehensive audio stability refactor.
2.  **Testing (Manual by User):**
    -   **Data Retrieval:** Verify correct fetching and display of Arabic text from API/DB and translations/Surah list from Blob. Test error handling for API/DB issues.
    -   **Audio Playback:** Verify overall audio playback stability, responsiveness of controls, accuracy of UI indicators, and elimination of precision errors across platforms.
    -   **Accessibility:** Test with VoiceOver (iOS) and TalkBack (Android) for both data display and audio controls.
3.  **Address any bugs or UX issues identified during testing (data or audio related).**

## 4. Key Decisions Made

-   **Hybrid Data Model:** Adopted a model where dynamic/core content (Arabic Quran text) is served via an API from a database, while more static assets (translations, Surah list, audio files) are served from Vercel Blob. This provides flexibility for the core text and CDN benefits for static assets.
-   **Serverless Functions for Data Access:** Utilized Vercel Serverless Functions to abstract direct database access from the client, improving security and manageability.
-   **Event-Driven State Synchronization for Audio:** (As before)
-   **Mono-instance 'Play-on-Create' Player Lifecycle:** (As before)
-   **Systematic Rounding for Numeric Precision:** (As before)
-   **Defensive Programming in Components:** (As before)

## 5. Open Questions / Considerations

-   **Thorough Testing of Hybrid Data & New Audio Architecture:** Comprehensive testing is needed across all platforms to confirm:
    -   Correct and reliable data fetching from both API/DB and Vercel Blob.
    -   Stability and correctness of the event-driven audio architecture and mono-instance player.
    -   No new regressions introduced by either architectural change.
-   **API & Database Performance/Reliability:** Monitor performance of Vercel Functions and Neon DB under load. Ensure robust error handling for API/DB unavailability.
-   **Audio Performance:** (As before)

This document reflects the context after the shift to an API-driven model for Arabic text and the implementation of precision fixes for audio playback.