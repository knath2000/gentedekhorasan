# Technical Context: Luminous Verses (Expo App)

**Version:** 0.9.5 (Reflects Database-Driven Translations & Metadata)
**Date:** 2025-05-15
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

-   **API-Driven Quran Data (Arabic Text & Translations):**
    -   **Backend:** Vercel Serverless Functions (`api/*.ts`) connecting to a Neon PostgreSQL database.
        -   `api/get-verses.ts`: Fetches Arabic verses for a Surah.
        -   `api/get-verse.ts`: Fetches a single Arabic verse.
        -   `api/get-translation-verses.ts`: Fetches translation verses for a Surah (e.g., Yusuf Ali).
        -   `api/get-translated-verse.ts`: Fetches a single verse with its translation.
    -   **Database:** Neon PostgreSQL. Tables include `quran_text` (Arabic), `en_yusufali` (Yusuf Ali translation), and metadata tables like `quran_surahs`.
    -   **Database Client (Serverless Functions):** `pg` (Node-postgres).
    -   **Fetching (Client-side):** Via HTTPS GET requests to Vercel Function endpoints.
    -   **Client Service Layer:**
        -   `src/services/apiClient.ts`: Makes `fetch` calls to all API endpoints.
        -   `src/services/surahService.ts`: Orchestrates fetching of verse data (Arabic and translations) using `apiClient.ts`, and Surah list/metadata using `quranMetadataService.ts`.
-   **Quranic Metadata (Surah List, Juz Info, etc.):**
    -   **Primary Source:** Vercel Edge Config (item: `quranMetadata`). Data is shaped by `scripts/convertQuranData.js` from `quran-data.xml`.
    -   **Fallback Source:** Vercel Serverless Function (`api/get-metadata.ts`) querying Neon PostgreSQL metadata tables (e.g., `quran_surahs`).
    -   **Client Service Layer:** `src/services/quranMetadataService.ts` handles fetching from Edge Config with API/DB fallback.
-   **Audio Data & Playback:**
    -   **Audio File Hosting:** Vercel Blob. URLs constructed by `src/services/audioService.ts`.
    -   **Audio Library:** `expo-audio` (Bundled version `~0.4.5` as per docs).
        -   Managed primarily via the `useAudioPlayer` custom hook ([`src/hooks/useAudioPlayer.ts`](src/hooks/useAudioPlayer.ts:1)).
        -   `src/services/audioService.ts` constructs audio URLs.
    -   **Key `expo-audio` APIs in use:** `createAudioPlayer` (used directly in hook), `AudioPlayer` instance methods, `AudioStatus`, `AudioModule.setAudioModeAsync`.
-   **Dynamic User Data (User Accounts, Bookmarks - Planned):**
    -   **Backend:** Supabase (PostgreSQL).
    -   **Client:** `@supabase/supabase-js` - Initialized in [`src/lib/supabaseClient.ts`](src/lib/supabaseClient.ts:1).
-   **HTTP Client (for Vercel Functions, Supabase & future APIs):**
    -   Native `fetch` API, used in `src/services/apiClient.ts`.
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
-   **Data Processing & Migration Scripts (Node.js):**
    -   Located in `scripts/` directory.
    -   `scripts/convertQuranData.js`: Parses `quran-data.xml` to generate `edge-config-data.json` and `quran_metadata_schema.sql`.
    -   `scripts/migrateYusufaliDumpToNeon.js`: Migrates Yusuf Ali translation data from a MySQL dump (`dump4.sql`) to the `en_yusufali` table in Neon DB.
    -   Dependencies: `xml2js`, `dotenv`, `pg`.

## 3. Development Environment & Tools

-   **Package Manager:** npm
-   **Version Control:** Git
-   **IDE:** Visual Studio Code
-   **Linters/Formatters:** ESLint (configured in [`eslint.config.js`](eslint.config.js:1)), Prettier.
-   **Debugging:** React Native Debugger, Chrome DevTools, `console.log`.
-   **Local Development Server for APIs:** `vercel dev` (optional, for testing serverless functions locally).

## 4. Technical Constraints & Considerations (Expo Project)

-   **Cross-Platform Compatibility.**
-   **Performance:** Lottie animation performance. Efficient data fetching from API/DB and Edge Config.
-   **`expo-audio` Playback Reliability.**
-   **iOS Audio Configuration.**
-   **Device Testing.**
-   **Bundle Size.**
-   **Arabic RTL Layout.**
-   **API Rate Limiting (Vercel Functions & External Services).**
-   **Database Connection Management (Serverless Functions):** Efficient use of connection pooling (`pg` library configuration in API routes).
-   **CORS Configuration:** Vercel API functions require CORS headers (e.g., `Access-Control-Allow-Origin`) to be accessible from the web app running on a different origin (like `localhost` during development).
-   **Offline Capabilities (Considerations for API data & Edge Config).**
-   **Expo SDK Version.**
-   **State Synchronization (Audio).**
-   **Environment Variable Management:**
    -   `NEON_DATABASE_URL`: For Vercel functions (set in Vercel project) and local scripts (via `.env.local`).
    -   `API_BASE_URL`: For Expo app (in `app.json`, can be overridden by `.env.local` for local `vercel dev` testing).
    -   `EDGE_CONFIG`: For `quranMetadataService.ts` (in `.env.local` for local `vercel dev` or live Edge Config, and in Vercel project for deployed app).
    -   `VERCEL_BLOB_URL_BASE`: For audio file URLs (in `app.json`).

## 5. Asset Management

-   **Lottie Animations:** `.json` file in `assets/animations/`.
-   **Fonts:** `.ttf` files in `assets/fonts/`.
-   **Images:** Stored in `assets/images/`.
-   **Theme Colors/Styles:** Defined in [`src/theme/theme.ts`](src/theme/theme.ts:1).
-   **Audio Files:** Hosted on Vercel Blob.
-   **Core Data Sources (Not client-side assets but foundational):**
    -   `quran-data.xml`: Master source for Quranic structural metadata.
    -   `dump4.sql`: Source for Yusuf Ali English translations.

This technical context outlines the stack and considerations for building the Luminous Verses Expo app, featuring an API-driven model for Quranic text and translations, and an Edge-Config-first approach for metadata.