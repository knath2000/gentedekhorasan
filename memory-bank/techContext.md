# Technical Context: Luminous Verses (Expo App)

**Version:** 0.9.4 (Reflects API-Driven Architecture & Ongoing Review)
**Date:** 2025-05-19
**Related Brief:** `memory-bank/projectbrief.md`
**Original iOS Native Port Context:** (This document adapts the technical context of the original iOS native port for the current Expo-based cross-platform project.)

## 1. Core Framework & Platform (Expo)

-   **Platform:** Expo (managed workflow)
-   **Target Runtimes:** iOS, Android
-   **Primary Language:** TypeScript
-   **UI Framework:** React Native
-   **IDE:** Visual Studio Code
-   **Build System:** Expo CLI / EAS Build (for native)

## 2. Key Technologies & Libraries (Expo Project)

-   **API-Driven Quran Data (Arabic Text, Surah List & Translations):**
    -   **Arabic Text Backend:** Vercel Serverless Functions (`api/*.ts`) connecting to a Neon PostgreSQL database.
    -   **Surah List Backend:** API (via `quranMetadataService.ts`, which utilizes Edge Config and/or database lookups through `apiClient.ts`).
    -   **Database Client (Serverless Functions):** `pg` (Node-postgres) used for all database interactions.
    -   **Fetching (Client-side):**
        -   Arabic Text: Via HTTPS GET requests to Vercel Function endpoints (e.g., `/api/get-verses`).
        -   Surah List: Through `src/services/quranMetadataService.ts`.
    -   **Client Service Layer Integration:**
        -   `src/services/apiClient.ts`: Makes direct API calls for Arabic text, translations, and is used by `quranMetadataService`.
        -   `src/services/quranMetadataService.ts`: Provides the Surah list.
        -   `src/services/surahService.ts`: Orchestrates data, using `quranMetadataService` for the Surah list and `apiClient.ts` for verse text and translations.
-   **Audio Data & Playback:**
    -   **Audio File Hosting:** Vercel Blob. URLs constructed by `src/services/audioService.ts`.
-   **Dynamic User Data (User Accounts, Bookmarks - Planned):**
    -   **Backend:** Supabase (PostgreSQL).
    -   **Client:** `@supabase/supabase-js` - Initialized in [`src/lib/supabaseClient.ts`](src/lib/supabaseClient.ts:1).
-   **Local App Settings Persistence:**
    -   **Mechanism:** `AsyncStorage` (from `@react-native-async-storage/async-storage`).
    -   **Service Layer:** `src/services/settingsService.ts` provides an abstraction for getting/setting local preferences (e.g., autoplay toggle, show translation preference).
    -   **Audio Library:** `expo-audio` (Bundled version `~0.4.5` as per docs).
        -   Managed primarily via the `useAudioPlayer` custom hook ([`src/hooks/useAudioPlayer.ts`](src/hooks/useAudioPlayer.ts:1)). This hook now implements a stable 'play-on-create' (mono-instance) pattern using `createAudioPlayer` directly from `expo-audio`, with UI state reliably synchronized through player events and a reducer. This aligns with `expo-audio` best practices for robust playback.
        -   `src/services/audioService.ts` constructs audio URLs.
    -   **Key `expo-audio` APIs in use:** `createAudioPlayer`, `AudioPlayer` instance methods (`play`, `pause`, `seekTo`, `remove`, `addListener`), `AudioStatus`, `AudioModule.setAudioModeAsync`.
-   **HTTP Client (for Vercel Blob, Vercel Functions, Supabase & future APIs):**
    -   Native `fetch` API, used in `src/services/apiClient.ts` and `src/services/surahService.ts`.
-   **Vercel Platform SDKs:**
    -   `@vercel/blob`: Client for interacting with Vercel Blob storage (primarily used by data migration scripts).
    -   `@vercel/edge-config`: Client for Vercel Edge Config (used by `quranMetadataService.ts`).
    -   `@vercel/node`: Provides types for Vercel Serverless Functions (e.g., `VercelRequest`, `VercelResponse` used in `api/*.ts` files).
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
    -   **Lottie:** `lottie-react-native`.
-   **Styling & Theming:**
    -   **`styled-components`**. Theme provider setup in [`app/_layout.tsx`](app/_layout.tsx:1) using theme from [`src/theme/theme.ts`](src/theme/theme.ts:1).
-   **UI Component Libraries:**
    -   `@react-native-community/slider`: Used for the native slider implementation in `PlatformSlider.tsx`.
-   **Typography & Fonts:**
    -   **Custom Fonts:** Noto Naskh Arabic, Montserrat, SpaceMono. Loaded via `expo-font`.
-   **Bundler & Polyfills:**
    -   **Metro Bundler.** Polyfills for Node.js module compatibility configured in [`metro.config.js`](metro.config.js:1) (if needed by native modules).
-   **Migration Scripts (Node.js):**
    -   Located in `scripts/` directory. Use `dotenv`, `@supabase/supabase-js`, `@vercel/blob`.

## 3. Development Environment & Tools

-   **Package Manager:** npm
-   **Version Control:** Git
-   **IDE:** Visual Studio Code
-   **Linters/Formatters:** ESLint (configured in [`eslint.config.js`](eslint.config.js:1)), Prettier.
-   **Debugging:** React Native Debugger, Chrome DevTools, `console.log`.

## 4. Technical Constraints & Considerations (Expo Project)

-   **Native Cross-Platform Compatibility (iOS/Android).**
-   **Performance:** Lottie animation performance. CDN caching benefits from Vercel Blob.
-   **`expo-audio` Playback Reliability:** Ensuring continued `expo-audio` playback reliability through adherence to event-driven state management and mono-instance player patterns.
-   **iOS Audio Configuration:** `UIBackgroundModes` in `app.json`/`Info.plist` is critical for background audio and sometimes affects foreground playback reliability, especially in managed workflows or simulators.
-   **Device Testing:** Real device testing (especially for iOS audio) is crucial as simulators may not fully replicate device behavior or audio session handling.
-   **Bundle Size.**
-   **Arabic RTL Layout.**
-   **API Rate Limiting (Vercel Functions & External Services).**
-   **Database Connection Management (Serverless Functions):** Efficient use of connection pooling (`pg` library configuration in API routes).
-   **Offline Capabilities (Considerations for API data).**
-   **Expo SDK Version.**
-   **State Synchronization:** Maintaining robust synchronization for audio playback by strictly adhering to event-driven updates from the player to the reducer and UI, a pattern that has resolved previous stability issues.
-   **Environment Variable Management (NEON_DATABASE_URL, API_BASE_URL, VERCEL_BLOB_URL_BASE).**

## 5. Asset Management

-   **Lottie Animations:** `.json` file in `assets/animations/`.
-   **Fonts:** `.ttf` files in `assets/fonts/`.
-   **Images:** Stored in `assets/images/`.
-   **Theme Colors/Styles:** Defined in [`src/theme/theme.ts`](src/theme/theme.ts:1).
-   **Static Assets (Audio):** Audio files are hosted on Vercel Blob. (Translations are now via API).
-   **Surah List Data:** Sourced via API (see "Key Technologies & Libraries" section for details). (Arabic text is also database-driven via API).

This technical context outlines the stack and considerations for building the Luminous Verses Expo app, featuring a hybrid data model (API/DB for Arabic text, Surah list, and translations; Vercel Blob for static audio assets) and a stable audio playback system based on `expo-audio` best practices.