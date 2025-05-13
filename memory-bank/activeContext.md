# Active Context: Luminous Verses (Expo App)

**Version:** 0.5 (Audio Controls Refinement & Tap-to-Toggle Fix)
**Date:** 2025-05-12
**Related Brief:** `docs/projectbrief.md`
**Related Progress:** `docs/progress.md`

## 1. Current Focus & State

-   **Focus:** Updating Memory Bank files and `.clinerules` after successfully refining audio control UI responsibilities and fixing the tap-to-toggle (play/pause) functionality for verses.
-   **State:**
    -   **Memory Bank:** Core documents are being updated to version 0.5.
    -   **Application Core:**
        -   Expo Router, theming, custom fonts, Supabase client, `react-native-safe-area-context`, and `expo-av` are integrated and functional.
    -   **Home Screen (`app/(tabs)/index.tsx`):**
        -   Displays Lottie animation (native, plays once) or static image (web).
    -   **Surahs Screen (`app/(tabs)/surahs.tsx`):**
        -   Fetches and displays Surah list from Supabase with correct background and layout.
    -   **Reader Screen (`app/(tabs)/reader.tsx`):**
        -   Displays Surah 1 Arabic text.
        -   **Audio Playback:**
            -   Tapping a `VerseCard` now correctly toggles play/pause for that verse.
            -   `AudioControlBar.tsx` displays only a Stop button (fully stops and resets audio) and a Skip Next button, along with time display. It no longer has a play/pause button.
            -   `VerseCard.tsx` contains the playback slider and shows its internal buffering indicator *only* during the initial audio load (`isLoadingAudio`).
        -   Verse highlighting syncs correctly with audio state.
    -   **`useAudioPlayer.ts` Hook:**
        -   Manages audio lifecycle with improved state management for `isLoading`, `isPlaying`, `isBuffering`, `activeVerseNumber`, and `playingVerseNumber`.
        -   Includes robust `stopAudio` logic (via `stopCurrentAudioAndReset`) and cleanup mechanisms.
        -   `toggleAudio` function correctly handles play/pause for the same verse and playing a new verse. The `operationInProgressRef` is now managed correctly to prevent blocking subsequent taps.
    -   **Styled-Components:** CSS syntax errors previously resolved.
    -   **Metro Bundler:** Configured with necessary polyfills.

## 2. Recent Changes / Milestones (Summarized from 2025-05-11 & 2025-05-12 Task Logs)

-   **Audio Control UI Refinement (2025-05-12):**
    -   **`AudioControlBar.tsx`:**
        -   Props updated: `onPlayPause` and `isPlaying` removed. `onStop` is now the primary action prop.
        -   UI changed: Play/pause button replaced with a dedicated Stop button (using `stop-circle-outline` icon).
    -   **`VerseCard.tsx`:**
        -   Buffering indicator logic simplified: now only shows if `isLoadingAudio` is true (i.e., during initial load, not subsequent buffering during playback).
    -   **`ReaderScreen.tsx`:**
        -   Props passed to `AudioControlBar` updated to reflect its new interface (passing `handleStopPress` to `onStop`).
-   **Tap-to-Toggle Playback Fix in `useAudioPlayer.ts` (2025-05-12):**
    -   Diagnosed issue where tapping a playing verse did not pause, or tapping a paused verse did not resume.
    -   The primary cause was `operationInProgressRef` not being reset after `internalPlayVerse` completed, blocking subsequent `toggleAudio` calls.
    -   **Fix:** Added a `finally` block to `internalPlayVerse` to set `operationInProgressRef.current = false` after successful audio loading and initiation.
    -   **Fix:** Ensured `isPlaybackActiveRef.current` is updated immediately within `toggleAudio` after `currentSound.pauseAsync()` or `currentSound.playAsync()` calls to correctly reflect the new state for the next tap.
-   **Previous CSS & Audio Stability Fixes (2025-05-11):**
    -   Resolved CSS syntax errors in `AudioControlBar.tsx` and `VerseCard.tsx`.
    -   Corrected theme path usage.
    -   Strengthened `stopAudio` in `useAudioPlayer.ts` and improved cleanup.
    -   Corrected usage of `expo-av` interruption modes.
    -   Refined `isLoading` state management in `useAudioPlayer.ts`.

## 3. Next Immediate Steps

1.  **Address Lottie Animation on Home Screen (Native):**
    -   Investigate why the Lottie animation in `AnimatedBackground.tsx` plays only once and freezes. Aim for continuous looping.
2.  **Enhance Home Screen Web Background:**
    -   Replace the placeholder `webtest.png` with a more theme-appropriate static image or explore a performant way to represent the Lottie animation concept on the web.
3.  **Expand `ReaderScreen` Functionality:**
    -   Modify `ReaderScreen` to accept a Surah ID/number as a parameter (passed from `SurahsScreen`).
    -   Fetch and display the full text of the selected Surah from Supabase (requires populating more data in Supabase).
    -   Implement English translations display.

## 4. Key Decisions to be Made Soon

-   **Supabase Data Structure (Verses & Translations):** Finalize the schema for all Quranic verses and translations.
-   **Lottie on Web Strategy:** Decide on the best approach for the Home screen background on the web.
-   **State Management for Audio Player:** Current custom hook approach is stable for screen-specific audio. Re-evaluate if global state is needed if audio needs to persist across screens or interact with a global mini-player.
-   **Custom Tab Bar:** Decide if the default Expo Router tab bar is sufficient or if a custom themed tab bar component is required.

## 5. Open Questions / Considerations

-   **Populating Supabase (Full Data):** What is the most efficient and accurate way to populate all Quranic text, translation data, and audio metadata into Supabase?
-   **Performance of Lottie:** Monitor performance of Lottie animations.
-   **Offline Strategy:** How will offline access to Quran text and potentially audio be handled?
-   **Testing Strategy:** How will unit, integration, and end-to-end testing be approached?
-   **Audio Service (`audioService.ts`):** Review if `loadAudio` and other functions in `audioService.ts` need adjustments based on the new `useAudioPlayer` logic (e.g., caching, preloading strategies).

This document reflects the context after refining audio control UI and fixing tap-to-toggle playback.