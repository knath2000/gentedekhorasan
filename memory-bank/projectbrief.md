# Project Brief: Luminous Verses (Expo App)

**Version:** 0.4 (Robust Audio & Slider Fixes)
**Date:** 2025-05-11 (Reflecting current development state)
**Original iOS Native Port Brief:** (This document adapts the vision of the original iOS native port for the current Expo-based cross-platform project.)

## 1. Project Name

Luminous Verses (Expo App for iOS, Android, and Web)

## 2. Core Goal

To develop a cross-platform Quran application using Expo (React Native) that provides a modern, engaging, and aesthetically pleasing way for users, particularly tech-savvy individuals aged 15-21, to connect with the Quran. The app aims to deliver a high-quality user experience on iOS, Android, and Web.

**Primary Objectives for this Expo Project:**
-   **Preserve Visual Aesthetics:** Recreate the "Desert Oasis at Night" theme with high fidelity across platforms.
-   **Ensure Smooth Animations & Performance:** Deliver a responsive and fluid user experience using Lottie for animations.
-   **Maintain Core Functionality (adapted for Expo):**
    -   Quranic text display (Arabic, with English translations planned).
    -   Verse-by-verse audio playback (planned).
    -   Intuitive navigation using Expo Router.
-   **Cross-Platform Reach:** Target iOS, Android, and Web from a single codebase.
-   **Data Management:** Utilize Supabase for backend data storage and retrieval (e.g., Quranic text).

## 3. Target Audience

-   **Primary Demographic:** Tech-savvy individuals aged 15-21.
-   **Characteristics:** Appreciative of modern, vibrant aesthetics, responsive design, and interactive experiences. Expect a high-quality experience across supported platforms.

## 4. Key Features (Current & MVP for Expo Port)

-   **Quranic Text Display:**
    -   Clear, legible Arabic text (Uthmani script) - *Implemented for Surah 1 on Reader screen.*
    -   Display of corresponding English translations - *Planned.*
    -   Accurate verse numbering - *Implemented for Surah 1.*
    -   Proper Right-to-Left (RTL) support for Arabic - *Implemented for Surah 1.*
-   **Audio Playback:**
    -   Individual audio playback functionality for each Quranic verse - *Partially implemented (Surah 1 on Reader screen, controls refined).*
    -   Clear and accessible playback controls - *Partially implemented (Reader screen controls refined).*
    -   Background audio support - *Planned.*
-   **Navigation:**
    -   Tab-based main navigation (Home, Surahs, Reader, Bookmarks, Settings) - *Implemented using Expo Router.*
    -   Intuitive browsing by Surah (Chapter) - *Implemented in [`app/(tabs)/surahs.tsx`](app/(tabs)/surahs.tsx:1), fetches and displays Surah list.*
    -   Ability to navigate to specific verses - *Partially implemented (Reader screen shows Surah 1).*\
-   **Visual Experience:**
    -   Implementation of the "Desert Oasis at Night" theme - *Theme file created ([`src/theme/theme.ts`](src/theme/theme.ts:1)), colors defined.*\
    -   Lottie-based animated background on Home screen (native iOS) - *Implemented ([`src/components/AnimatedBackground.tsx`](src/components/AnimatedBackground.tsx:1)), plays once and freezes.*\
    -   Static image background on Home screen (web) - *Implemented in [`app/(tabs)/index.tsx`](app/(tabs)/index.tsx:1) using `@/assets/images/webtest.png`.*\
    -   Static image background (`assets/images/iOSbackground.png`) on Surahs screen - *Implemented in [`app/(tabs)/surahs.tsx`](app/(tabs)/surahs.tsx:1).*
    -   Smooth UI animations and transitions - *Ongoing.*
-   **Core Screens (Expo Router):**
    -   `app/(tabs)/index.tsx` (HomeScreen): Displays Lottie/static background and title.
    -   `app/(tabs)/surahs.tsx` (SurahListScreen): Fetches and displays the list of Surahs from Supabase, with "Desert Oasis at Night" theme background (`assets/images/iOSbackground.png`). Layout adjusted for proper display above tab bar.
    -   `app/(tabs)/reader.tsx` (ReaderScreen): Displays Surah 1 Arabic text from Supabase table `surah1_text`, with audio playback controls.
    -   `app/(tabs)/bookmarks.tsx` (BookmarksScreen): Placeholder.
    -   `app/(tabs)/settings.tsx` (SettingsScreen): Placeholder.
-   **Data Backend:**
    -   Supabase for storing and fetching Quranic text. - *Implemented for Surah 1 in [`app/(tabs)/reader.tsx`](app/(tabs)/reader.tsx:1) using client from [`src/lib/supabaseClient.ts`](src/lib/supabaseClient.ts:1).*

## 5. Design Aesthetic & User Experience (UX) Principles

-   **Core Theme:** "Desert Oasis at Night" – Maintain the serene, dark Arabian night sky (deep blues, purples) with a prominent moon, contrasted by warm desert landscape glows (sandy golds, warm oranges) and vibrant, jewel-like colors for interactive elements.
-   **Visual Style (Cross-Platform Adaptation):**
    -   Modern, clean interface.
    -   Highly animated with smooth, performant Lottie animations and React Native transitions.
    -   Rich color palette balancing dark, calming backgrounds with bright, energetic accents.
-   **User Experience Goals:**
    -   Intuitive and easy to use across iOS, Android, and Web.
    -   Engaging and delightful, encouraging exploration and regular use.
    -   Visually immersive, creating a unique and memorable experience.
    -   Respectful and appropriate for the sacred nature of the content.
    -   Optimized for cross-platform performance.

## 6. Technical Foundation (Expo Project)

-   **Platform:** Expo (React Native for iOS, Android, Web)
-   **Language:** TypeScript
-   **UI Framework:** React Native with custom components styled using `styled-components`.
-   **Navigation:** Expo Router
-   **Animation:** Lottie (`lottie-react-native`, `@lottiefiles/dotlottie-react`)
-   **Backend/Data:** Supabase (`@supabase/supabase-js`)
-   **Fonts:** Noto Naskh Arabic (Arabic), Montserrat (English) - *Loaded via [`app/_layout.tsx`](app/_layout.tsx:1).*\
-   **Bundler:** Metro (with custom polyfills for Node.js core modules: `readable-stream`, `events`, `https-browserify`, `stream-http`, `crypto-browserify`, `url`, `react-native-tcp-socket`, `path-browserify`, `os-browserify`, `assert`, `vm-browserify`, `browserify-zlib` configured in [`metro.config.js`](metro.config.js:1)).

## 7. Success Metrics (for Expo Port)

-   High visual fidelity to the "Desert Oasis at Night" theme across platforms.
-   Smooth, jank-free animations and UI interactions.
-   Positive user feedback regarding the cross-platform experience, performance, and usability.
-   Successful and accurate delivery of Quranic text (and eventually translation and audio).
-   Successful bundling and operation on iOS, (Android to be tested), and Web.

## 8. Future Considerations (Post-MVP Port)
*(Adapted from original iOS brief)*
-   Full Surah list and navigation.
-   English translations on Reader screen.
-   Verse-by-verse audio playback.
-   Multiple reciter and translation options.
-   Advanced search functionality.
-   User accounts for personalization (bookmarks, reading progress sync).
-   Widget support (platform-dependent).
-   Offline access improvements.