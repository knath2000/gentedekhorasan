# Active Context: Luminous Verses (Expo App)

**Version:** 0.9.2 (Comprehensive Audio Stability & UI Sync)
**Date:** 2025-05-14
**Related Brief:** `docs/projectbrief.md`
**Related Progress:** `docs/progress.md`
**Previous Refactoring Plan (Tap-to-Play):** `docs/updated_audio_playback_refactoring_plan.md`
**Current Refactoring Plan (Precision):** `docs/audio_playback_refactoring_strategy.md` (or similar, assuming a new plan doc was mentally noted)

## 1. Current Focus & State

-   **Focus:** Consolidating and documenting the comprehensive audio playback stability achieved through recent refactoring. This includes the 'play-on-create' (mono-instance) pattern, strict event-driven UI state synchronization (resolving stuck buffering and slider issues), robust toggle logic, and numeric precision fixes.
-   **State:**
    -   **Memory Bank:** Core documents are being updated to version 0.9.2.
    -   **Application Core:** (Largely unchanged, audio system is the focus)
        -   Expo Router, theming, custom fonts, `react-native-safe-area-context` are integrated.
        -   **Static Data Source:** Vercel Blob for Quranic content.
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

-   **Comprehensive Audio Stability Refactor (2025-05-14):**
    -   Implemented a 'play-on-create' (mono-instance) audio player lifecycle within `src/hooks/useAudioPlayer.ts`.
    -   Established strict event-driven UI state synchronization: player events (`onPlaybackStatusUpdate`) now directly drive reducer updates, which in turn update the UI. This ensures the UI (buffering icons, playback slider, play/pause states) accurately reflects the true state of the `expo-audio` player.
    -   Resolved persistent issues with stuck buffering UI and desynchronized playback controls (e.g., slider not appearing or updating correctly).
    -   Ensured reliable and predictable play/pause/resume toggle logic in `toggleAudio`, aligning with `expo-audio` community best practices.
    -   **Numeric Precision Fix (Sub-milestone):**
        -   Updated `src/hooks/useAudioPlayer.ts`: Rounded `durationMillis` and `positionMillis` in the return object; ensured `seekAudio` handles input `positionMillis` by rounding.
        -   Updated `src/components/PlatformSlider.tsx`: Rounded all numeric values and `accessibilityValue` fields.
        -   Updated `src/components/VerseCard.tsx`: Rounded time-based props and values for `PlatformSlider` and `formatTime`.
-   **Previous - Audio Playback Refactoring - Tap-to-Play & Accessibility (2025-05-14):**
    -   Implemented tap-to-play/pause on `VerseCard`.
    -   Enhanced visual feedback and accessibility features.
    -   Relied on `useAudioPlayer.ts` (which uses the library-provided `useAudioPlayer` from `expo-audio`).

## 3. Next Immediate Steps

1.  **Update Memory Bank & `.clinerules`:** (This step) Reflect the comprehensive audio stability refactor, including event-driven patterns, mono-instance player, UI synchronization fixes, and precision enhancements.
2.  **Testing (Manual by User):**
    -   Verify overall audio playback stability, responsiveness of controls (play, pause, resume, seek), and accuracy of UI indicators (buffering, playing state, slider position) across iOS, Android, and Web.
    -   Confirm "loss of precision" errors are eliminated.
    -   Test accessibility with VoiceOver (iOS) and TalkBack (Android).
3.  **Address any bugs or UX issues identified during testing.**

## 4. Key Decisions Made

-   **Event-Driven State Synchronization for Audio:** Adopted a pattern where UI state is updated *only* in response to actual events from the `expo-audio` player. This ensures the UI is a source of truth for the player's status, resolving previous desynchronization issues. This aligns with community best practices for managing AV state in React Native.
-   **Mono-instance 'Play-on-Create' Player Lifecycle:** Enforced a single, active `AudioPlayer` instance. New playback requests for different verses destroy the old player and create a new one, simplifying state management and preventing race conditions.
-   **Systematic Rounding for Numeric Precision:** Applied `Math.round()` to all millisecond-based time values at their source (audio hook) and points of consumption/conversion (slider, verse card) to prevent floating-point errors when bridging to native modules.
-   **Defensive Programming in Components:** Ensured components consuming these values also perform rounding if necessary.

## 5. Open Questions / Considerations

-   **Thorough Testing of New Audio Architecture:** The primary open point is comprehensive testing across all platforms to confirm the stability and correctness of the new event-driven audio architecture and mono-instance player lifecycle, and to ensure no new regressions were introduced.
-   **Performance:** While the current patterns are robust, continue to monitor for any unexpected performance impacts in highly dynamic scenarios.

This document reflects the context after implementing the precision fixes for audio playback.