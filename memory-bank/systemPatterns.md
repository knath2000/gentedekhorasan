# System Patterns: Luminous Verses (Expo App)

**Version:** 0.4 (Robust Audio & Slider Fixes)
**Date:** 2025-05-11
**Related Brief:** `docs/projectbrief.md`
**Original iOS Native Port Patterns:** (This document adapts system patterns for the current Expo-based project.)

## 1. Overall Architecture (Expo - MVVM-like with Hooks)

```mermaid
graph TD
    AppEntry[Expo App Entry (`app/_layout.tsx`)] --> SafeAreaProv[SafeAreaProvider (`react-native-safe-area-context`)]
    SafeAreaProv --> ThemeProv[ThemeProvider (`styled-components`)]
    ThemeProv --> FontLoader[Font Loading (`expo-font`)]
    FontLoader --> SupabaseInit([Supabase Client Init (`src/lib/supabaseClient.ts`)])
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
        SurahsScreen -- Fetches List --> SupabaseServices[Supabase Services (`src/services/surahService.ts`)]
        SurahsScreen -- Uses Insets --> SafeAreaContext[useSafeAreaInsets]
        SurahsScreen -- Uses Dimensions --> RNDimensions[Dimensions API]
        ReaderScreen -- Fetches Data --> SupabaseDB[(Supabase `surah1_text` table)]
        ReaderScreen -- Uses Hook --> AudioPlayerHook[useAudioPlayer (`src/hooks/useAudioPlayer.ts`)]
        ReaderScreen -- Uses Component --> AudioCtrlBar[AudioControlBar (`src/components/AudioControlBar.tsx`)]
        ReaderScreen -- Uses Component --> VerseCardComp[VerseCard (`src/components/VerseCard.tsx`)]
        GenericScreenComponent --> ReusableComponent[Reusable UI Components (e.g., ThemedText, ThemedView)]
    end

    subgraph Services & Data
        SupabaseInit --> SupabaseClient[Supabase Client Instance]
        SupabaseServices --> SupabaseClient
        ReaderScreen --> SupabaseClient
        AudioPlayerHook -- Uses Service --> AudioService[Audio Service (`src/services/audioService.ts`)]
    end

    subgraph Styling & Theme
        ThemeProv --> AppTheme[App Theme (`src/theme/theme.ts`)]
        GenericScreenComponent -- Uses Theme --> AppTheme
        ReusableComponent -- Uses Theme --> AppTheme
    end
    
    subgraph Platform Integration
        SafeAreaProv --> SafeAreaContext
        GenericScreenComponent --> RNDimensions
        AudioPlayerHook -- Uses SDK --> ExpoAV[Expo AV (`expo-av`)]
    end

    style AppEntry fill:#f9f,stroke:#333,stroke-width:2px
    style ExpoRouter fill:#ccf,stroke:#333,stroke-width:2px
    style TabNav fill:#cdf,stroke:#333,stroke-width:2px
    style SupabaseDB fill:#fdb,stroke:#333,stroke-width:2px
    style SupabaseServices fill:#fdb,stroke:#333,stroke-width:2px
    style SafeAreaProv fill:#cfc,stroke:#333,stroke-width:2px
    style AudioPlayerHook fill:#fcf,stroke:#333,stroke-width:2px
```

-   **Client-Side Application:** Expo (React Native) app targeting iOS, Android, and Web.
-   **API Driven Content (Data):**
    -   Quranic Text & Surah List: Supabase (PostgreSQL) - tables like `surah1_text` and a table for the Surah list (e.g., `surahs`). Data fetched via `src/services/surahService.ts`.
-   **UI Framework:** React Native with custom components.
-   **Architectural Pattern (Loosely):** MVVM-like, where:
    -   **Models:** Data structures/types (e.g., `Surah` type in `src/types/quran.ts`).
    -   **Views:** React Native components (JSX/TSX files in `app/` and `src/components/` like `SurahCard.tsx`).
    -   **ViewModels (Logic):** Primarily handled by React Hooks (`useState`, `useEffect`, `useTheme`, `useSafeAreaInsets`, `useRef`, custom hooks) within screen components for managing state, side effects (data fetching), and presentation logic.
-   **Dependency Management:** npm (via `package.json`).
-   **Global State/Context:**
    -   `SafeAreaProvider` from `react-native-safe-area-context` provides safe area insets globally.
    -   `ThemeProvider` from `styled-components` provides theme globally.
    -   React Context API can be used for other global states (e.g., authentication, user preferences).

## 2. Key Design Patterns (Expo Project)

-   **State Management Pattern:**
    -   React Hooks (`useState`, `useEffect`, `useContext`, `useTheme`, `useSafeAreaInsets`, `useRef`) for local and shared state.
    -   React Context API for global state (e.g., `SafeAreaProvider`, `ThemeProvider`).
    -   **Custom Hooks for Complex Logic:** Encapsulating complex stateful logic and side effects related to specific features (e.g., `useAudioPlayer` in `src/hooks/useAudioPlayer.ts` manages audio playback state, sound object lifecycle, and interactions with `expo-av`). This promotes reusability and separation of concerns from screen components.
-   **Navigation Pattern:**
    -   **Expo Router:** File-system based routing for screens and navigation structure.
    -   Tab-based navigation for main sections defined in `app/(tabs)/_layout.tsx`.
    -   Stack navigation for drill-down views (default with Expo Router).
-   **Data Fetching Pattern:**
    -   `@supabase/supabase-js` client for interacting with Supabase, initialized in `src/lib/supabaseClient.ts`.
    -   Service layer for data fetching logic (e.g., `src/services/surahService.ts`).
    -   `async/await` with `useEffect` hook in components for fetching data (e.g., in `app/(tabs)/reader.tsx` and `app/(tabs)/surahs.tsx`).
    -   Loading and error states managed within components.
-   **View Composition & Layout:**
    -   Reusable UI components (e.g., `SurahCard.tsx` in `src/components/`).
    -   Flexbox for layout.
    -   **Dynamic Layout Calculation:** Using `Dimensions` API and `useSafeAreaInsets` to calculate available screen space and adjust layout, particularly for `FlatList` containers to avoid overlap with status/tab bars (as seen in `app/(tabs)/surahs.tsx`).
    -   Styled Components (`MainContainer` in `app/(tabs)/surahs.tsx`) for applying safe area padding.
-   **Theming and Styling:**
    -   **`styled-components`:** For creating themed and reusable styled components.
    -   Theme object defined in `src/theme/theme.ts` and provided via `ThemeProvider`.
    -   TypeScript definitions for theme in `src/styled.d.ts`.
-   **Animation System:**
    -   **Lottie:** `lottie-react-native` (native) / `@lottiefiles/dotlottie-react` (web) for complex vector animations (e.g., `AnimatedBackground.tsx`).
    -   **React Native Animated API:** For programmatic animations and transitions.
-   **Asynchronous Operations:**
    -   `async/await` for Promises (e.g., data fetching, font loading, audio operations).
    -   `useEffect` for managing side effects, including cleanup functions for asynchronous operations.
    -   `useCallback` to memoize callbacks, especially those passed to child components or used in `useEffect` dependency arrays, ensuring stable references where needed (e.g., `stopAudio` in `useAudioPlayer`).
-   **Polyfills for Web/Node.js Compatibility:**
    -   Metro bundler configured with `resolver.extraNodeModules` in `metro.config.js` to provide browser/React Native compatible versions of Node.js core modules, essential for libraries like `@supabase/supabase-js` to work across platforms, especially web.

## 3. Component Structure (Illustrative)

-   **Core App Structure:**
    -   `app/_layout.tsx`: Root layout, loads fonts, sets up `SafeAreaProvider` and `ThemeProvider`, initializes Expo Router.
    -   `app/(tabs)/_layout.tsx`: Defines the tab bar structure and screens.
    -   **Screens (Route Components):** Files within `app/(tabs)/` (e.g., `index.tsx`, `reader.tsx`, `surahs.tsx`).
    -   **UI Components (Reusable):** Located in `src/components/` (e.g., `AnimatedBackground.tsx`, `SurahCard.tsx`, `AudioControlBar.tsx`).
    -   **Hooks (Custom Logic):** Located in `src/hooks/` (e.g., `useAudioPlayer.ts`).
    -   **Services/Libs:** `src/lib/supabaseClient.ts`, `src/services/surahService.ts`, `src/services/audioService.ts`.
    -   **Theme:** `src/theme/theme.ts`, `src/styled.d.ts`.
    -   **Assets:** `assets/animations/`, `assets/fonts/`, `assets/images/`.

## 4. Expo/React Native Specific Patterns

-   **Platform-Specific Code:** Using `Platform.OS` (e.g., for `TAB_BAR_HEIGHT` calculation). Aiming for maximum code sharing.
-   **Expo Modules:** Utilizing Expo SDK APIs (e.g., `expo-font`, `expo-splash-screen`, `expo-av`).
-   **`react-native-safe-area-context`:** For handling safe area insets (`SafeAreaProvider`, `useSafeAreaInsets`).
-   **`Dimensions` API:** For getting screen dimensions to aid in layout calculations.
-   **Metro Bundler Configuration:** Customizations in `metro.config.js` for polyfills.
-   **TypeScript Integration:** Strong typing throughout the codebase.

This structure aims for a maintainable, scalable, and cross-platform application using Expo and React Native best practices.