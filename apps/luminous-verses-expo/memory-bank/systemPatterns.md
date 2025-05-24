# System Patterns: Luminous Verses (Expo App)

<<<<<<< HEAD
**Version:** 0.9.5 (Reflects Prisma ORM Integration & Native-Only Focus)
**Date:** 2025-05-23
**Related Brief:** `memory-bank/projectbrief.md`
=======
**Version:** 0.9.5 (Reflects Database-Driven Translations & Metadata)
**Date:** 2025-05-15
**Related Brief:** `docs/projectbrief.md`
>>>>>>> 6782f209f2ec1abb8fff5d8bb212e5ef19bceef8
**Original iOS Native Port Patterns:** (This document adapts system patterns for the current Expo-based project.)

## 1. Overall Architecture (Expo - MVVM-like with Hooks & API Integration)

```mermaid
graph TD
    AppEntry[Expo App Entry (`app/_layout.tsx`)] --> SafeAreaProv[SafeAreaProvider (`react-native-safe-area-context`)]
    SafeAreaProv --> ThemeProv[ThemeProvider (`styled-components`)]
    ThemeProv --> FontLoader[Font Loading (`expo-font`)]
    FontLoader --> SupabaseInit([Supabase Client Init (`src/lib/supabaseClient.ts`)]) %% For dynamic data (User Data)
    FontLoader --> ExpoRouter[Expo Router (`SplashScreen`, `Stack`)]

    ExpoRouter --> TabNav[Tab Navigator (`app/(tabs)/_layout.tsx`)]
    TabNav --> HomeScreen[Home Screen (`app/(tabs)/index.tsx`)]
    TabNav --> SurahsScreen[Surahs Screen (`app/(tabs)/surahs.tsx`)]
    TabNav --> ReaderScreen[Reader Screen (`app/(tabs)/reader.tsx`)]
    TabNav --> BookmarksScreen[Bookmarks Screen (`app/(tabs)/bookmarks.tsx`)]
    TabNav --> SettingsScreen[Settings Screen (`app/(tabs)/settings.tsx`)]

    subgraph Screens & Components
        HomeScreen --> AnimBG[AnimatedBackground (`src/components/AnimatedBackground.tsx`)]
        HomeScreen --> ScreenBGComp[ScreenBackground (`src/components/ScreenBackground.tsx`)] %% For web
        HomeScreen -- Uses --> VerseOfTheDayComp[VerseOfTheDay (`src/components/VerseOfTheDay.tsx`)]

        VerseOfTheDayComp -- Fetches Random Verse --> SurahService[Surah Service (`src/services/surahService.ts`)]
<<<<<<< HEAD
=======
        HomeScreen --> ScreenBGComp[ScreenBackground (`src/components/ScreenBackground.tsx`)] %% For web
        HomeScreen -- Uses --> VerseOfTheDayComp[VerseOfTheDay (`src/components/VerseOfTheDay.tsx`)]

        VerseOfTheDayComp -- Fetches Random Verse --> SurahService[Surah Service (`src/services/surahService.ts`)]

>>>>>>> 6782f209f2ec1abb8fff5d8bb212e5ef19bceef8
        SurahsScreen -- Uses --> SurahCard[SurahCard (`src/components/SurahCard.tsx`)]
        SurahsScreen -- Fetches List --> SurahService
        SurahsScreen -- Uses --> ScreenBGComp
        SurahsScreen -- Uses Insets --> SafeAreaContext[useSafeAreaInsets]
        SurahsScreen -- Uses Dimensions --> RNDimensions[Dimensions API]
        
        ReaderScreen -- Fetches Data --> SurahService
        ReaderScreen -- Uses Hook --> AudioPlayerHook[useAudioPlayer (`src/hooks/useAudioPlayer.ts`)]
        ReaderScreen -- Uses Component --> AudioCtrlBar[AudioControlBar (`src/components/AudioControlBar.tsx`)]
        ReaderScreen -- Uses Component --> VerseCardComp[VerseCard (`src/components/VerseCard.tsx`)]
        ReaderScreen -- Uses --> ScreenBGComp
        
        BookmarksScreen -- Uses --> ScreenBGComp
        SettingsScreen -- Uses --> ScreenBGComp
        
        GenericScreenComponent --> ReusableComponent[Reusable UI Components (e.g., ThemedText, ThemedView)]
    end

    subgraph "Services & Data Layer"
<<<<<<< HEAD
        SurahService -- Uses --> QuranMetadataService[Quran Metadata Service (`src/services/quranMetadataService.ts`)]
        SurahService -- Uses --> ApiClient[API Client (`src/services/apiClient.ts`)]
        
        QuranMetadataService -- Fetches Metadata --> EdgeConfig[Vercel Edge Config (Metadata Cache)]
        QuranMetadataService -- Fallback to API --> ApiClient %% For metadata if Edge Config fails
        
        ApiClient -- Calls API for Arabic Text --> GetVersesFunc[Vercel Serverless (`api/get-verses.ts`)]
        ApiClient -- Calls API for Single Arabic Verse --> GetVerseFunc[Vercel Serverless (`api/get-verse.ts`)]
        ApiClient -- Calls API for Translations --> GetTranslationVersesFunc[Vercel Serverless (`api/get-translation-verses.ts`)]
        ApiClient -- Calls API for Single Translated Verse --> GetSingleTranslatedVerseFunc[Vercel Serverless (`api/get-translated-verse.ts`)]
        ApiClient -- Calls API for Metadata --> GetMetadataFunc[Vercel Serverless (`api/get-metadata.ts`)]

        GetVersesFunc -- Queries --> NeonDB[Neon PostgreSQL Database (quran_text table)]
        GetVerseFunc -- Queries --> NeonDB
        GetTranslationVersesFunc -- Queries --> NeonDBTrans[Neon PostgreSQL Database (en_yusufali table)]
        GetSingleTranslatedVerseFunc -- Queries Arabic --> NeonDB
        GetSingleTranslatedVerseFunc -- Queries Translation --> NeonDBTrans
        GetMetadataFunc -- Queries --> NeonDBMetadata[Neon PostgreSQL Database (quran_surahs, quran_juzs etc.)]
=======
        SurahService -- Uses --> QuranMetadataService[Quran Metadata Service (`src/services/quranMetadataService.ts`)]
        SurahService -- Uses --> ApiClient[API Client (`src/services/apiClient.ts`)]
        
        QuranMetadataService -- Fetches Metadata --> EdgeConfig[Vercel Edge Config (Metadata Cache)]
        QuranMetadataService -- Fallback to API --> ApiClient %% For metadata if Edge Config fails
        
        ApiClient -- Calls API for Arabic Text --> GetVersesFunc[Vercel Serverless (`api/get-verses.ts`)]
        ApiClient -- Calls API for Single Arabic Verse --> GetVerseFunc[Vercel Serverless (`api/get-verse.ts`)]
        ApiClient -- Calls API for Translations --> GetTranslationVersesFunc[Vercel Serverless (`api/get-translation-verses.ts`)]
        ApiClient -- Calls API for Single Translated Verse --> GetSingleTranslatedVerseFunc[Vercel Serverless (`api/get-translated-verse.ts`)]
        ApiClient -- Calls API for Metadata --> GetMetadataFunc[Vercel Serverless (`api/get-metadata.ts`)]

        GetVersesFunc -- Queries --> NeonDB[Neon PostgreSQL Database (quran_text table)]
        GetVerseFunc -- Queries --> NeonDB
        GetTranslationVersesFunc -- Queries --> NeonDBTrans[Neon PostgreSQL Database (en_yusufali table)]
        GetSingleTranslatedVerseFunc -- Queries Arabic --> NeonDB
        GetSingleTranslatedVerseFunc -- Queries Translation --> NeonDBTrans
        GetMetadataFunc -- Queries --> NeonDBMetadata[Neon PostgreSQL Database (quran_surahs, quran_juzs etc.)]
>>>>>>> 6782f209f2ec1abb8fff5d8bb212e5ef19bceef8
        
        SupabaseInit --> SupabaseClient[Supabase Client Instance (User Data)]
        %% AppServices -- Fetches Dynamic (Planned) --> SupabaseClient %% e.g., user data (Placeholder for future)
        
        AudioPlayerHook -- Uses Service --> AudioService[Audio Service (`src/services/audioService.ts`)]
        AudioService -- Uses SDK --> ExpoAudio[Expo Audio (`expo-audio`)]
        AudioService -- Constructs URLs for --> VercelBlobAudio[Vercel Blob (Audio Files)]
    end

    subgraph Styling & Theme
        ThemeProv --> AppTheme[App Theme (`src/theme/theme.ts`)]
        GenericScreenComponent -- Uses Theme --> AppTheme
        ReusableComponent -- Uses Theme --> AppTheme
        ScreenBGComp -- May Use Theme --> AppTheme
    end
    
    subgraph Platform Integration
        SafeAreaProv --> SafeAreaContext
        GenericScreenComponent --> RNDimensions
        AudioPlayerHook -- Uses SDK --> ExpoAudio
    end

    style AppEntry fill:#f9f,stroke:#333,stroke-width:2px
    style ExpoRouter fill:#ccf,stroke:#333,stroke-width:2px
    style TabNav fill:#cdf,stroke:#333,stroke-width:2px
    style VercelBlobAudio fill:#dff,stroke:#333,stroke-width:2px
    style EdgeConfig fill:#dfd,stroke:#333,stroke-width:2px
    style ApiClient fill:#aef,stroke:#333,stroke-width:2px
    style GetVersesFunc fill:#f96,stroke:#333,stroke-width:1px
    style GetVerseFunc fill:#f96,stroke:#333,stroke-width:1px
    style GetTranslationVersesFunc fill:#f96,stroke:#333,stroke-width:1px
    style GetSingleTranslatedVerseFunc fill:#f96,stroke:#333,stroke-width:1px
    style GetMetadataFunc fill:#f96,stroke:#333,stroke-width:1px
    style NeonDB fill:#69b,stroke:#333,stroke-width:2px
    style NeonDBTrans fill:#69b,stroke:#333,stroke-width:2px
    style NeonDBMetadata fill:#69b,stroke:#333,stroke-width:2px
    style SupabaseClient fill:#fdb,stroke:#333,stroke-width:1px
    style SurahService fill:#bdc,stroke:#333,stroke-width:2px
    style QuranMetadataService fill:#bde,stroke:#333,stroke-width:2px
    style SafeAreaProv fill:#cfc,stroke:#333,stroke-width:2px
    style AudioPlayerHook fill:#fcf,stroke:#333,stroke-width:2px
    style ExpoAudio fill:#fcf,stroke:#333,stroke-width:1px
```

-   **Client-Side Application:** Expo (React Native) app targeting iOS and Android.
-   **Quranic Content Data Sources:**
<<<<<<< HEAD
    -   **Arabic Text:** Fetched from a Neon PostgreSQL database (`quran_text` table) via Vercel Serverless Functions (e.g., `api/get-verses.ts`, `api/get-verse.ts`). Accessed through `src/services/apiClient.ts`.
    -   **English Translations (Yusuf Ali):** Fetched from a Neon PostgreSQL database (`en_yusufali` table) via Vercel Serverless Functions (e.g., `api/get-translation-verses.ts`, `api/get-translated-verse.ts`). Accessed through `src/services/apiClient.ts`.
    -   **Surah List & Other Metadata (Juz, Page Info, Sajdas):**
        -   Primarily fetched from Vercel Edge Config (item: `quranMetadata`).
        -   If Edge Config is unavailable or data is missing, it falls back to Vercel Serverless Functions (`api/get-metadata.ts`) which query Neon PostgreSQL database tables (e.g., `quran_surahs`, `quran_juzs`).
        -   This process is managed by `src/services/quranMetadataService.ts`.
=======
    -   **Arabic Text:** Fetched from a Neon PostgreSQL database (`quran_text` table) via Vercel Serverless Functions (e.g., `api/get-verses.ts`, `api/get-verse.ts`). Accessed through `src/services/apiClient.ts`.
    -   **English Translations (Yusuf Ali):** Fetched from a Neon PostgreSQL database (`en_yusufali` table) via Vercel Serverless Functions (e.g., `api/get-translation-verses.ts`, `api/get-translated-verse.ts`). Accessed through `src/services/apiClient.ts`.
    -   **Surah List & Other Metadata (Juz, Page Info, Sajdas):**
        -   Primarily fetched from Vercel Edge Config (item: `quranMetadata`).
        -   If Edge Config is unavailable or data is missing, it falls back to Vercel Serverless Functions (`api/get-metadata.ts`) which query Neon PostgreSQL database tables (e.g., `quran_surahs`, `quran_juzs`).
        -   This process is managed by `src/services/quranMetadataService.ts`.
>>>>>>> 6782f209f2ec1abb8fff5d8bb212e5ef19bceef8
    -   **Audio Files:** Hosted on Vercel Blob, URLs constructed by `src/services/audioService.ts`.
-   **Data Orchestration:** `src/services/surahService.ts` orchestrates the fetching of Surah lists (via `quranMetadataService.ts`) and verse data (Arabic text and translations via `apiClient.ts`), combining them as needed for UI components.
-   **Dynamic User Data (User Accounts, Bookmarks - Planned):** Supabase (PostgreSQL).
-   **UI Framework:** React Native with custom components.
-   **Architectural Pattern (Loosely):** MVVM-like, where:
    -   **Models:** Data structures/types (e.g., `Surah`, `Verse` type in `src/types/quran.ts`).
    -   **Views:** React Native components (JSX/TSX files in `app/` and `src/components/` like `SurahCard.tsx`).
    -   **ViewModels (Logic):** Primarily handled by React Hooks within screen components and custom hooks.
-   **Dependency Management:** npm (via `package.json`).
-   **Global State/Context:**
    -   `SafeAreaProvider` from `react-native-safe-area-context`.
    -   `ThemeProvider` from `styled-components`.

## 2. Key Design Patterns (Expo Project)

-   **State Management Pattern:**
    -   React Hooks (`useState`, `useEffect`, `useContext`, `useTheme`, `useSafeAreaInsets`, `useRef`, `useReducer`).
    -   React Context API for global state.
    -   **Custom Hooks for Complex Logic:**
        -   `useAudioPlayer` in `src/hooks/useAudioPlayer.ts` manages audio playback state using `createAudioPlayer` from `expo-audio` directly, coupled with a `useReducer` pattern for robust state transitions. It enforces a mono-instance 'play-on-create' audio player lifecycle. UI state is strictly synchronized via player events (`onPlaybackStatusUpdate`) to ensure reliability, as per `expo-audio` best practices.
-   **Navigation Pattern:**
    -   **Expo Router:** File-system based routing.
    -   Tab-based navigation for main sections.
<<<<<<< HEAD
-   **Data Fetching Pattern (API-Driven & Edge-Config Enhanced):**
    -   **Arabic Verse Text:** Fetched from Vercel Serverless Functions (querying PostgreSQL `quran_text` table) via `src/services/apiClient.ts`.
    -   **Translations (Yusuf Ali):** Fetched from Vercel Serverless Functions (querying PostgreSQL `en_yusufali` table) via `src/services/apiClient.ts`.
    -   **Surah List & Metadata:**
        -   Fetched by `src/services/quranMetadataService.ts`.
        -   Priority 1: Vercel Edge Config.
        -   Priority 2 (Fallback): Vercel Serverless Functions (`api/get-metadata.ts` querying PostgreSQL metadata tables).
    -   **Orchestration:** `src/services/surahService.ts` uses `apiClient.ts` and `quranMetadataService.ts` to gather and combine data for UI presentation.
    -   **Audio Files:** URLs constructed by `src/services/audioService.ts` pointing to Vercel Blob.
    -   **Dynamic User Content (Planned):** `@supabase/supabase-js` client.
    -   `async/await` with `useEffect` hook in components for data loading.
-   **API-Driven Content & Hybrid Retrieval (Updated):**
    -   Core Quranic text (Arabic) and translations (Yusuf Ali) are served dynamically via an API layer (Vercel Serverless Functions backed by PostgreSQL).
    -   Quranic structural metadata (Surah list, Juz info, etc.) is served primarily from Vercel Edge Config for performance, with a fallback to the API/DB.
    -   `src/services/surahService.ts` acts as the primary orchestrator for combining these data sources for the UI.
    -   Error handling for API requests is managed within `src/services/apiClient.ts` and further up the chain in services and components.
=======
-   **Data Fetching Pattern (API-Driven & Edge-Config Enhanced):**
    -   **Arabic Verse Text:** Fetched from Vercel Serverless Functions (querying PostgreSQL `quran_text` table) via `src/services/apiClient.ts`.
    -   **Translations (Yusuf Ali):** Fetched from Vercel Serverless Functions (querying PostgreSQL `en_yusufali` table) via `src/services/apiClient.ts`.
    -   **Surah List & Metadata:**
        -   Fetched by `src/services/quranMetadataService.ts`.
        -   Priority 1: Vercel Edge Config.
        -   Priority 2 (Fallback): Vercel Serverless Functions (`api/get-metadata.ts` querying PostgreSQL metadata tables).
    -   **Orchestration:** `src/services/surahService.ts` uses `apiClient.ts` and `quranMetadataService.ts` to gather and combine data for UI presentation.
    -   **Audio Files:** URLs constructed by `src/services/audioService.ts` pointing to Vercel Blob.
    -   **Dynamic User Content (Planned):** `@supabase/supabase-js` client.
    -   `async/await` with `useEffect` hook in components for data loading.
-   **API-Driven Content & Hybrid Retrieval (Updated):**
    -   Core Quranic text (Arabic) and translations (Yusuf Ali) are served dynamically via an API layer (Vercel Serverless Functions backed by PostgreSQL).
    -   Quranic structural metadata (Surah list, Juz info, etc.) is served primarily from Vercel Edge Config for performance, with a fallback to the API/DB.
    -   `src/services/surahService.ts` acts as the primary orchestrator for combining these data sources for the UI.
    -   Error handling for API requests is managed within `src/services/apiClient.ts` and further up the chain in services and components.
>>>>>>> 6782f209f2ec1abb8fff5d8bb212e5ef19bceef8
-   **View Composition & Layout:**
    -   Reusable UI components.
    -   Flexbox for layout.
    -   Dynamic layout calculation using `Dimensions` API and `useSafeAreaInsets`.
-   **Theming and Styling:**
    -   **`styled-components`**. Theme object provided via `ThemeProvider`.
-   **Animation System:**
    -   **Lottie:** `lottie-react-native`.
-   **Asynchronous Operations:**
    -   `async/await` for Promises.
    -   `useEffect` for side effects and cleanup.
    -   `useCallback` to memoize callbacks.
-   **Polyfills for Node.js module compatibility (configured in `metro.config.js`):**
    -   Metro bundler configured in `metro.config.js`.

-   **Audio Playback & UI Synchronization Pattern:**
    -   (This section remains largely accurate as per previous version 0.9.3, no major changes identified here from the logs/code review related to data source changes)
    -   **Mono-instance, Play-on-Create:** A single `AudioPlayer` instance is active at any time.
    -   **Direct Player Creation:** Uses `createAudioPlayer` directly.
    -   **Comprehensive Error Handling.**
    -   **Event-Driven State Updates.**
    -   **Resolution of Past Issues.**
    -   **Best Practice Alignment.**
    -   ```mermaid
        sequenceDiagram
            participant User
            participant Component
            participant AudioHook
            participant Reducer
            participant ExpoAudioPlayer
            User->>Component: Taps Play/Pause
            Component->>AudioHook: Calls toggleAudio()
            AudioHook->>Reducer: Dispatches INTENT (e.g., REQUEST_PLAY)
            Reducer->>AudioHook: Updates state (e.g., status: 'loading_requested')
            AudioHook->>ExpoAudioPlayer: Creates/Plays/Pauses instance
            ExpoAudioPlayer-->>AudioHook: Emits onPlaybackStatusUpdate event
            AudioHook->>Reducer: Dispatches EVENT_CONFIRMED (e.g., AUDIO_LOADED_AND_PLAYING)
            Reducer->>AudioHook: Updates state (e.g., status: 'playing')
            AudioHook-->>Component: Returns new state
            Component->>User: UI Updates (icon, slider)
        end
        ```

## 3. Component Structure (Illustrative)

-   (This section remains largely accurate as per previous version 0.9.3)
-   **Core App Structure:**
    -   `app/_layout.tsx`: Root layout.
    -   `app/(tabs)/_layout.tsx`: Tab bar structure.
    -   **Screens (Route Components):** Files within `app/(tabs)/`.
    -   **UI Components (Reusable):** Located in `src/components/`.
    -   **Hooks (Custom Logic):** Located in `src/hooks/`.
    -   **Services/Libs:** `src/lib/`, `src/services/`.
    -   **Theme:** `src/theme/theme.ts`, `src/styled.d.ts`.
    -   **Assets:** `assets/`.

## 4. Expo/React Native Specific Patterns

-   (This section remains largely accurate as per previous version 0.9.3)
-   **Platform-Specific Code:** Using `Platform.OS`.
-   **Expo Modules:** Utilizing Expo SDK APIs (e.g., `expo-font`, `expo-splash-screen`, `expo-audio`).
-   **`react-native-safe-area-context`:** For safe area insets.
-   **`Dimensions` API:** For screen dimensions.
-   **Metro Bundler Configuration:** Customizations in `metro.config.js`.
-   **TypeScript Integration:** Strong typing.

<<<<<<< HEAD
This structure aims for a maintainable, scalable, and cross-platform application using Expo and React Native best practices. It now incorporates a more robust data model with API-driven content for core Quranic text and translations, and an Edge-Config-first approach for metadata.
=======
This structure aims for a maintainable, scalable, and cross-platform application using Expo and React Native best practices. It now incorporates a more robust data model with API-driven content for core Quranic text and translations, and an Edge-Config-first approach for metadata.
>>>>>>> 6782f209f2ec1abb8fff5d8bb212e5ef19bceef8
