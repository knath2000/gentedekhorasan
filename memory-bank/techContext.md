# Technical Context: Luminous Verses (Expo App)

**Version:** 0.4 (Robust Audio & Slider Fixes)
**Date:** 2025-05-11
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

-   **Quran Data (Text & Surah List):**
    -   **Backend:** Supabase (PostgreSQL)
    -   **Tables:** `surah1_text` (for Surah Al-Fatihah on Reader screen), and a table for the list of Surahs (e.g., `surahs` - used by `app/(tabs)/surahs.tsx`).
    -   **Client:** `@supabase/supabase-js` - Initialized in [`src/lib/supabaseClient.ts`](src/lib/supabaseClient.ts:1).
    -   **Service Layer:** `src/services/surahService.ts` for fetching Surah list and potentially other Quran data, `src/services/audioService.ts` for loading audio files.
-   **HTTP Client (for Supabase & future APIs):**
    -   `@supabase/supabase-js` uses `fetch` internally.
-   **Navigation:**
    -   **Expo Router:** File-system based routing. Tab navigation implemented in [`app/(tabs)/_layout.tsx`](app/(tabs)/_layout.tsx:1).
-   **Layout & Safe Area Management:**
    -   **`react-native-safe-area-context`:** `SafeAreaProvider` in `app/_layout.tsx` and `useSafeAreaInsets` hook in components (e.g., `app/(tabs)/surahs.tsx`) to handle device notches and system UI elements.
    -   **React Native `Dimensions` API:** Used in `app/(tabs)/surahs.tsx` to get window height for precise layout calculations.
-   **State Management:**
    -   React Context API (e.g., for theme, `SafeAreaProvider`, potentially auth).
    -   Component-level state and logic via React Hooks (`useState`, `useEffect`, `useCallback`, `useRef`, `useReducer`, `useTheme`, `useSafeAreaInsets`).
-   **Animation:**
    -   **Lottie:**
        -   `lottie-react-native` for native platforms.
        -   `@lottiefiles/dotlottie-react` for web (or `lottie-web` if direct control needed).
        -   Animated background implemented in [`src/components/AnimatedBackground.tsx`](src/components/AnimatedBackground.tsx:1) using `assets/animations/desertanimation.json`.
    -   **React Native Animated API:** For UI transitions and interactive feedback.
-   **Styling & Theming:**
    -   **`styled-components`:** For CSS-in-JS styling. Theme provider setup in [`app/_layout.tsx`](app/_layout.tsx:1) using theme from [`src/theme/theme.ts`](src/theme/theme.ts:1).
    -   **Theme File:** [`src/theme/theme.ts`](src/theme/theme.ts:1) defines colors, fonts, spacing.
    -   **TypeScript Definitions for Theme:** [`src/styled.d.ts`](src/styled.d.ts:1).
-   **Custom React Hooks:**
    -   `src/hooks/useAudioPlayer.ts`: Manages all audio playback logic, state (playing, loading, buffering, duration, position), and interactions with `expo-av`.
-   **Audio Playback (via `expo-av`):**
    -   **`expo-av`:** Used for audio playback capabilities, managed via the `useAudioPlayer` custom hook.
-   **Typography & Fonts:**
    -   **Custom Fonts:**
        -   Noto Naskh Arabic (for Arabic text)
        -   Montserrat (for English text)
    -   Fonts loaded asynchronously in [`app/_layout.tsx`](app/_layout.tsx:1) using `expo-font`.
-   **Persistence (Local):**
    -   *Planned: `expo-secure-store` or `AsyncStorage` for user preferences, bookmarks.*
-   **Image Handling:**
    -   React Native `<ImageBackground>` and `<Image>` components for local assets (e.g., `assets/images/webtest.png` for web Home background, `assets/images/iOSbackground.png` for Surahs screen background).
-   **Bundler & Polyfills:**
    -   **Metro Bundler:** Default for React Native.
    -   **Custom Polyfills (for Web & Node.js compatibility):** Configured in [`metro.config.js`](metro.config.js:1) to resolve Node.js core module usage by dependencies (e.g., `readable-stream`, `crypto-browserify`, `stream-http`, `url`, etc.). This was crucial for `@supabase/supabase-js` and other libraries to function correctly, especially on web.

## 3. Development Environment & Tools

-   **Package Manager:** npm
-   **Version Control:** Git
-   **IDE:** Visual Studio Code
-   **Linters/Formatters:** ESLint (configured in [`eslint.config.js`](eslint.config.js:1)), Prettier (typically integrated).
-   **Debugging:** React Native Debugger, Chrome DevTools (for web and Hermes JS inspector), extensive `console.log` statements during development.

## 4. Technical Constraints & Considerations (Expo Project)

-   **Cross-Platform Compatibility:** Ensuring features and UI render consistently and performantly across iOS, Android, and Web.
-   **Performance:** Optimizing for each platform, especially with animations and data handling. Lottie animation performance to be monitored.
-   **Bundle Size:** Managing asset sizes and dependencies to keep app bundles reasonable.
-   **Arabic RTL Layout:** Ensuring correct UI adaptation for Right-to-Left text.
-   **Font Rendering:** Ensuring crisp and accurate rendering across platforms.
-   **API Rate Limiting (Supabase):** Be mindful of Supabase usage tiers and limits.
-   **Offline Capabilities:** Plan for offline data access (e.g., caching Quran text).
-   **Expo SDK Version:** Keep Expo SDK updated for latest features and bug fixes.
-   **Native Module Limitations (if not using EAS Build):** Standard Expo Go limitations if not ejecting or using dev builds with native code. (Currently using managed workflow).
-   **State Synchronization:** Ensuring robust synchronization between asynchronous operations (like audio playback) and UI state, managing potential race conditions and effect cleanup timing.

## 5. Asset Management

-   **Lottie Animations:** `.json` file in `assets/animations/`.
-   **Fonts:** `.ttf` files in `assets/fonts/`.
-   **Images:** Stored in `assets/images/`.
-   **Theme Colors/Styles:** Defined in [`src/theme/theme.ts`](src/theme/theme.ts:1).

This technical context outlines the stack and considerations for building the Luminous Verses Expo app.