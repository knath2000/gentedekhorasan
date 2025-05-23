# System Patterns: Luminous Verses (Expo App)

**Version:** 0.9.4 (Reflects API-Driven Architecture & Ongoing Review)
**Date:** 2025-05-19
**Related Brief:** `memory-bank/projectbrief.md`
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
        SurahsScreen -- Uses --> SurahCard[SurahCard (`src/components/SurahCard.tsx`)]
        SurahsScreen -- Fetches List --> AppServices[App Services (`src/services/surahService.ts`)]
        SurahsScreen -- Uses --> ScreenBGComp
        SurahsScreen -- Uses Insets --> SafeAreaContext[useSafeAreaInsets]
        SurahsScreen -- Uses Dimensions --> RNDimensions[Dimensions API]
        
        ReaderScreen -- Fetches Data --> AppServices
        ReaderScreen -- Uses Hook --> AudioPlayerHook[useAudioPlayer (`src/hooks/useAudioPlayer.ts`)]
        ReaderScreen -- Uses Component --> AudioCtrlBar[AudioControlBar (`src/components/AudioControlBar.tsx`)]
        ReaderScreen -- Uses Component --> VerseCardComp[VerseCard (`src/components/VerseCard.tsx`)]
        ReaderScreen -- Uses --> ScreenBGComp
        
        BookmarksScreen -- Uses --> ScreenBGComp
        SettingsScreen -- Uses --> ScreenBGComp
        
        GenericScreenComponent --> ReusableComponent[Reusable UI Components (e.g., ThemedText, ThemedView)]
    end

    subgraph "Services & Data Layer"
        AppServices -- Uses --> ApiClient[API Client (`src/services/apiClient.ts`)]
        %% AppServices -- Fetches Translations --> VercelBlob[Vercel Blob (JSON files)] %% This is now via APIClient
        ApiClient -- Calls --> VercelFunctions[Vercel Serverless Functions (`api/*.ts`)]
        VercelFunctions -- Queries --> NeonDB[Neon PostgreSQL Database (Quran Text)]
        
        SupabaseInit --> SupabaseClient[Supabase Client Instance (User Data)]
        AppServices -- Fetches Dynamic (Planned) --> SupabaseClient %% e.g., user data
        
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
    style VercelBlob fill:#dff,stroke:#333,stroke-width:2px
    style VercelBlobAudio fill:#dff,stroke:#333,stroke-width:2px
    style ApiClient fill:#aef,stroke:#333,stroke-width:2px
    style VercelFunctions fill:#f96,stroke:#333,stroke-width:2px
    style NeonDB fill:#69b,stroke:#333,stroke-width:2px
    style SupabaseClient fill:#fdb,stroke:#333,stroke-width:1px
    style AppServices fill:#bdc,stroke:#333,stroke-width:2px
    style SafeAreaProv fill:#cfc,stroke:#333,stroke-width:2px
    style AudioPlayerHook fill:#fcf,stroke:#333,stroke-width:2px
    style ExpoAudio fill:#fcf,stroke:#333,stroke-width:1px
```

-   **Client-Side Application:** Expo (React Native) app targeting iOS and Android.
-   **Quranic Content Data Sources:**
    -   **Arabic Text:** Fetched from a Neon PostgreSQL database via Vercel Serverless Functions. Accessed through `src/services/apiClient.ts` which calls endpoints like `/api/get-verses`.
    -   **Surah List:** Fetched via API (through `quranMetadataService` which uses `apiClient.ts`).
    -   **English Translations (Yusuf Ali):** Fetched via API (through `surahService.ts` which uses `apiClient.ts`).
    -   **Audio Files:** Hosted on Vercel Blob, URLs constructed by `src/services/audioService.ts`.
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
-   **Data Fetching Pattern (Hybrid Model):**
    -   **Arabic Verse Text:** Fetched from Vercel Serverless Functions (which query PostgreSQL) via `src/services/apiClient.ts` and then integrated by `src/services/surahService.ts`.
    -   **Translations (Dynamic):** Fetched via API (through `surahService.ts` which uses `apiClient.ts`).
    -   **Surah List (Dynamic):** Fetched via API (through `quranMetadataService`).
    -   **Audio Files:** URLs constructed by `src/services/audioService.ts` pointing to Vercel Blob.
    -   **Dynamic User Content (Planned):** `@supabase/supabase-js` client.
    -   `async/await` with `useEffect` hook in components for data loading.
-   **API-Driven Content & Hybrid Retrieval:**
    -   The application employs a hybrid data retrieval strategy. Core Quranic text (Arabic) is served dynamically via an API layer (Vercel Serverless Functions backed by PostgreSQL) to allow for more flexible data management and potential future enhancements (e.g., different Qira'at, advanced search).
    -   Supporting static content like audio files are still fetched from Vercel Blob for simplicity and CDN benefits. Quranic text, Surah list, and translations are now fetched via API.
    -   The `src/services/surahService.ts` acts as an orchestrator, combining data from API sources (Arabic text, Surah list metadata, and translations) to form complete `Verse` objects for the UI.
    -   Error handling for API requests is managed within `src/services/apiClient.ts`, with further handling in `src/services/surahService.ts`.
    -   A cache-first strategy is not yet explicitly implemented but could be a future enhancement for API-fetched data.
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
    -   **Mono-instance, Play-on-Create:** A single `AudioPlayer` instance is active at any time. New playback requests for a different verse result in the current player (if any) being removed and a new one created and played immediately. This prevents issues related to managing multiple or stale player instances.
    -   **Direct Player Creation:** The implementation uses `createAudioPlayer` directly rather than the library-provided `useAudioPlayer` hook, giving fine-grained control over player lifecycle and state management.
    -   **Comprehensive Error Handling:** The implementation includes retry logic for network errors, stall detection with timeouts, and detailed error tracking to provide a robust playback experience.
    -   **Event-Driven State Updates:** UI state (playing, paused, buffering, current time, duration) is updated strictly based on events received from the `AudioPlayer` instance via its `onPlaybackStatusUpdate` listener. User actions (e.g., tap to play/pause) dispatch 'intent' actions to a reducer. The reducer may update an 'intent' status (e.g., `loading_requested`, `pausing_requested`), but the definitive transition to states like `playing` or `paused` only occurs after the corresponding player event is processed by the reducer. This ensures the UI accurately reflects the true state of the audio player.
    -   **Resolution of Past Issues:** This event-driven pattern, combined with the mono-instance player, has resolved previous issues related to stuck buffering UI, desynchronized playback controls (like sliders), and unreliable play/pause/resume toggle behavior.
    -   **Best Practice Alignment:** This approach aligns with `expo-audio` community best practices for robust audio state management and UI synchronization (e.g., insights from Expo GitHub issues like expo/expo#19788 and community forums regarding event-driven state).
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

-   **Platform-Specific Code:** Using `Platform.OS`.
-   **Expo Modules:** Utilizing Expo SDK APIs (e.g., `expo-font`, `expo-splash-screen`, `expo-audio`).
-   **`react-native-safe-area-context`:** For safe area insets.
-   **`Dimensions` API:** For screen dimensions.
-   **Metro Bundler Configuration:** Customizations in `metro.config.js`.
-   **TypeScript Integration:** Strong typing.

This structure aims for a maintainable, scalable, native application (iOS and Android) using Expo and React Native best practices. It now incorporates a hybrid data model with API-driven content for core Quranic text and a stable, robust audio playback system.