# Technical Context: Luminous Verses (Expo App)

**Version:** 0.9.2 (Stable Audio Playback & UI Sync)
**Date:** 2025-05-14
**Related Brief:** `docs/projectbrief.md`
**Original iOS Native Port Context:** (This document adapts the technical context of the original iOS native port for the current Expo-based cross-platform project.)

## 1. Core Framework & Platform (Expo)

-   **Platform:** Expo (managed workflow)
-   **Target Runtimes:** iOS, Android, Web
-   **Primary Language:** TypeScript
-   **UI Framework:** React Native
-   **IDE:** Visual Studio Code
-   **Build System:** Expo CLI / EAS Build (for native), Expo CLI (for web)

## 2. Key Technologies & Libraries (Expo Project)

-   **Static Quran Data (Arabic Text, Surah List, Yusuf Ali Translations):**
    -   **Storage:** Vercel Blob (JSON files).
    -   **Fetching:** Via HTTPS GET requests.
    -   **Service Layer:** `src/services/surahService.ts`.
-   **Dynamic Data (User Accounts, Bookmarks - Planned):**
    -   **Backend:** Supabase (PostgreSQL)
    -   **Client:** `@supabase/supabase-js` - Initialized in [`src/lib/supabaseClient.ts`](src/lib/supabaseClient.ts:1).
-   **Audio Data & Playback:**
    -   **Audio File Hosting:** Vercel Blob. Path construction in `src/lib/blobClient.ts` and `src/services/audioService.ts`.
    -   **Audio Library:** `expo-audio` (Bundled version `~0.4.5` as per docs).
        -   Managed primarily via the `useAudioPlayer` custom hook ([`src/hooks/useAudioPlayer.ts`](src/hooks/useAudioPlayer.ts:1)). This hook now implements a stable 'play-on-create' (mono-instance) pattern using `expo-audio`'s library-provided `useAudioPlayer`, with UI state reliably synchronized through player events and a reducer. This aligns with `expo-audio` best practices for robust playback.
        -   `src/services/audioService.ts` constructs audio URLs.
    -   **Key `expo-audio` APIs in use:** `useAudioPlayer` (library hook), `AudioPlayer` instance methods (`play`, `pause`, `seekTo`, `remove`, `addListener`), `AudioStatus`, `AudioModule.setAudioModeAsync`.
-   **HTTP Client (for Vercel Blob, Supabase & future APIs):**
    -   Native `fetch` API.
-   **Navigation:**
    -   **Expo Router:** File-system based routing. Tab navigation implemented in [`app/(tabs)/_layout.tsx`](app/(tabs)/_layout.tsx:1).
-   **Layout & Safe Area Management:**
    -   **`react-native-safe-area-context`**.
    -   **React Native `Dimensions` API**.
-   **State Management:**
    -   React Context API.
    -   Component-level state and logic via React Hooks.
    -   **Custom Hooks:** `src/hooks/useAudioPlayer.ts` for audio logic.
-   **Animation:**
    -   **Lottie:** `lottie-react-native` (native), `@lottiefiles/dotlottie-react` (web).
-   **Styling & Theming:**
    -   **`styled-components`**. Theme provider setup in [`app/_layout.tsx`](app/_layout.tsx:1) using theme from [`src/theme/theme.ts`](src/theme/theme.ts:1).
-   **Typography & Fonts:**
    -   **Custom Fonts:** Noto Naskh Arabic, Montserrat. Loaded via `expo-font`.
-   **Bundler & Polyfills:**
    -   **Metro Bundler.** Custom Polyfills configured in [`metro.config.js`](metro.config.js:1).
-   **Migration Scripts (Node.js):**
    -   Located in `scripts/` directory. Use `dotenv`, `@supabase/supabase-js`, `@vercel/blob`.

## 3. Development Environment & Tools

-   **Package Manager:** npm
-   **Version Control:** Git
-   **IDE:** Visual Studio Code
-   **Linters/Formatters:** ESLint (configured in [`eslint.config.js`](eslint.config.js:1)), Prettier.
-   **Debugging:** React Native Debugger, Chrome DevTools, `console.log`.

## 4. Technical Constraints & Considerations (Expo Project)

-   **Cross-Platform Compatibility.**
-   **Performance:** Lottie animation performance. CDN caching benefits from Vercel Blob.
-   **`expo-audio` Playback Reliability:** Ensuring continued `expo-audio` playback reliability through adherence to event-driven state management and mono-instance player patterns.
-   **iOS Audio Configuration:** `UIBackgroundModes` in `app.json`/`Info.plist` is critical for background audio and sometimes affects foreground playback reliability, especially in managed workflows or simulators.
-   **Device Testing:** Real device testing (especially for iOS audio) is crucial as simulators may not fully replicate device behavior or audio session handling.
-   **Bundle Size.**
-   **Arabic RTL Layout.**
-   **API Rate Limiting.**
-   **Offline Capabilities.**
-   **Expo SDK Version.**
-   **State Synchronization:** Maintaining robust synchronization for audio playback by strictly adhering to event-driven updates from the player to the reducer and UI, a pattern that has resolved previous stability issues.
-   **Environment Variable Management.**

## 5. Asset Management

-   **Lottie Animations:** `.json` file in `assets/animations/`.
-   **Fonts:** `.ttf` files in `assets/fonts/`.
-   **Images:** Stored in `assets/images/`.
-   **Theme Colors/Styles:** Defined in [`src/theme/theme.ts`](src/theme/theme.ts:1).
-   **Static Quran Data (JSON):** Hosted on Vercel Blob.

This technical context outlines the stack and considerations for building the Luminous Verses Expo app, with a now-stable audio playback system based on `expo-audio` best practices.