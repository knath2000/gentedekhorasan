# Active Context: Luminous Verses (Expo App)

**Version:** 0.9.4 (API Routes Stable - Undergoing Full Memory Bank Review)
**Date:** 2025-05-19
**Related Brief:** `memory-bank/projectbrief.md`
**Related Progress:** `memory-bank/progress.md`

## 1. Current Focus & State

-   **Focus:**
    1.  Systematically removing web platform support from the project (configurations, dependencies, code).
    2.  Ensuring the native iOS (and Android) application remains fully functional and stable throughout the web removal process.
    3.  Comprehensively updating all memory bank documentation to reflect the new native-only (iOS/Android) architecture.
    4.  Thorough testing of the native application post web-removal.
-   **State:**
    -   **Project Direction:** Shifted to native-only (iOS and Android). Web support is actively being removed on branch `feature/remove-web-support`.
    -   **Memory Bank:** Undergoing a full review and update to reflect native-only focus and recent codebase changes. Version 0.9.4.
    -   **Application Core (Native):** Key functionalities (data fetching, audio, UI components) are considered stable for native platforms and must be preserved.
        -   Expo Router, theming, custom fonts, `react-native-safe-area-context` are integrated.
        -   **Data Sources (API-Driven for Native):**
            -   **Arabic Text, Surah List, Translations:** All served via API. **Status: Stable for native.**
            -   **Audio Files:** Hosted on Vercel Blob. **Status: Stable for native.**
    -   **`src/hooks/useAudioPlayer.ts`**: Stable for native.
    -   **UI Components (Native versions)**: `PlatformSlider.tsx` (now native only), `VerseCard.tsx`, `AudioControlBar.tsx` are stable for native.
    -   **Vercel API Functions (`api/*.ts`):** Stable and serving data to the native app.

## 2. Recent Changes / Milestones

-   **Initiation of Web Platform Removal (2025-05-19):**
    -   Decision made to focus exclusively on native iOS and Android platforms.
    -   Created Git branch `feature/remove-web-support`.
    -   Phase 1 (Configuration & Dependency Removal) completed:
        -   `app.json` updated to remove "web" platform and configurations.
        -   `package.json` updated to remove `react-dom`, `react-native-web`, and web-specific scripts. `npm install` run.
        -   Root `tsconfig.json` and `metro.config.js` reviewed (conservative approach taken, no immediate changes beyond what `package.json` dictated).
    -   Phase 2 (Code Removal & Refactoring) completed:
        -   Removed `Platform.OS === 'web'` conditional logic and web-specific implementations from components (`ScreenBackground.tsx`, `PlatformSlider.tsx`, `VerseOfTheDay.tsx`, `SurahCard.tsx`, `VerseCard.tsx`, `app/(tabs)/index.tsx`).
        -   Deleted `PlatformSlider.css`.
    -   User confirmed iOS app remains functional after these changes.
-   **Comprehensive Memory Bank Update (Ongoing - 2025-05-19):**
    -   Updated all core memory bank documents and `.clinerules` to reflect API-driven data sources for Surah Lists and Translations.
    -   Added new patterns to `.clinerules` based on codebase review.
-   **API Routing and Build Fix (2025-05-15):** (Resolved, as previously documented)
-   **Architectural Shift to API-Driven Content (Approx. 2025-05-15 or prior):** (Stable, as previously documented)
-   **Comprehensive Audio Stability Refactor (2025-05-14):** (Stable, as previously documented)

## 3. Next Immediate Steps

1.  **Complete Project Cleanup (Phase 3 of Web Removal Plan):**
    -   Guide user through deleting `node_modules` and `.expo` directories (if they haven't already).
    -   Run `npm install` to ensure a clean dependency state.
    -   Consider `npx expo prebuild --clean` if native project directories (`ios`, `android`) exist and might contain stale web configurations.
2.  **Thorough Native Platform Testing (Phase 3):**
    -   User to conduct comprehensive testing on iOS (and Android if applicable) to confirm all functionalities after web removal and cleanup.
3.  **Finalize Memory Bank Documentation (Phase 4):**
    -   Update this `activeContext.md` and `progress.md` to reflect completion of web removal.
    -   Review and update all other memory bank documents (`projectbrief.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `.clinerules`) to ensure they fully and accurately represent the native-only architecture. Remove any remaining web-specific language or patterns.

## 4. Key Decisions Made

-   **Transition to Native-Only (iOS/Android) Focus (2025-05-19):** Decision to remove web platform support to streamline development and focus resources on native application quality.
-   **API-Driven Data for Core Content (2025-05-19):** Confirmed and documented that Surah Lists and Translations are now fully API-driven, moving away from Vercel Blob for these specific data types.
-   **Vercel API Routing Strategy:** (Stable, as previously documented)
-   **API TypeScript Configuration:** (Stable, as previously documented)
-   **Edge Config with API Fallback for Metadata:** (Stable, as previously documented)
-   **Event-Driven State Synchronization for Audio:** (Stable, as previously documented)

## 5. Open Questions / Considerations

-   **Polyfill Review:** Re-evaluate `metro.config.js` polyfills to determine if any can be safely removed now that web support is gone (requires careful checking against native dependencies).
-   **`tsconfig.json` `"dom"` lib:** Re-evaluate if the `"dom"` library can be removed from the root `tsconfig.json`'s `compilerOptions.lib` now that web is not a target.
-   **Android Platform:** Confirm if Android support is an active target alongside iOS for all future development and testing.
-   **Vercel Routing Nuances & Wildcard Route:** (Still relevant if API structure evolves)
-   **API & Database Performance/Reliability for Native:** (Still relevant)

This document reflects the active context during the transition to a native-only application (iOS and Android) by removing web platform support. Key configuration and code changes for web removal have been applied.