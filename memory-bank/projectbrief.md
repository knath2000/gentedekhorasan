# Project Brief: Luminous Verses (Expo App)

**Version:** 0.9.3 (Reflects API-Driven Architecture)
**Date:** 2025-05-15
**Original iOS Native Port Brief:** (This document adapts the vision of the original iOS native port for the current Expo-based cross-platform project.)

## 1. Project Name

Luminous Verses (Expo App for iOS, Android, and Web)

## 2. Core Goal

To develop a cross-platform Quran application using Expo (React Native) that provides a modern, engaging, and aesthetically pleasing way for users, particularly tech-savvy individuals aged 15-21, to connect with the Quran. The app aims to deliver a high-quality user experience on iOS, Android, and Web.

**Primary Objectives for this Expo Project:**
-   **Preserve Visual Aesthetics:** Recreate the "Desert Oasis at Night" theme with high fidelity across platforms.
-   **Ensure Smooth Animations & Performance:** Deliver a responsive and fluid user experience using Lottie for animations.
-   **Maintain Core Functionality (adapted for Expo):**
    -   Quranic text display (Arabic, with English translations).
    -   Verse-by-verse audio playback using `expo-audio`.
    -   Intuitive navigation using Expo Router.
-   **Cross-Platform Reach:** Target iOS, Android, and Web from a single codebase.
-   **Data Management (Hybrid Model):**
    -   **Arabic Verse Text:** Served dynamically from a Neon PostgreSQL database via Vercel Serverless Functions.
    -   **Surah List & Yusuf Ali Translations:** Static JSON files served from Vercel Blob.
    -   **Audio Files:** Hosted on Vercel Blob.
    -   **User Data (Planned):** Supabase for features like user accounts and bookmarks.

## 3. Target Audience

-   **Primary Demographic:** Tech-savvy individuals aged 15-21.
-   **Characteristics:** Appreciative of modern, vibrant aesthetics, responsive design, and interactive experiences. Expect a high-quality experience across supported platforms.

## 4. Key Features (Current & MVP for Expo Port)

-   **Quranic Text Display:**
    -   Clear, legible Arabic text (Uthmani script) - *Fetched from Neon PostgreSQL DB via Vercel Serverless Functions.*
    -   Display of corresponding English translations (Yusuf Ali) - *Fetched from Vercel Blob.*
    -   Accurate verse numbering - *Sourced from API (DB) for Arabic text, and Blob for translations.*
    -   Proper Right-to-Left (RTL) support for Arabic - *Implemented.*
-   **Audio Playback (using `expo-audio`):**
    -   Individual audio playback functionality for each Quranic verse - *Implemented using a robust 'play-on-create' (mono-instance) pattern with event-driven UI state synchronization. This ensures reliable playback, pause, resume, and stop behaviors. UI (verse highlight, controls, buffering indicators, slider) accurately reflects actual player status, adhering to `expo-audio` best practices.*
    -   Clear and accessible playback controls - *Implemented and refined, with UI state consistently synchronized with the player.*
    -   Verse highlight correctly syncs with playback state (playing, paused, buffering) and clears on stop.
    -   Background audio support - *Planned (relies on `expo-audio` capabilities).*
-   **Navigation:**
    -   Tab-based main navigation (Home, Surahs, Reader, Bookmarks, Settings) - *Implemented using Expo Router.*
    -   Intuitive browsing by Surah (Chapter) - *Implemented in [`app/(tabs)/surahs.tsx`](app/(tabs)/surahs.tsx:1), fetches and displays Surah list from Vercel Blob.*
    -   Ability to navigate to specific verses - *Implemented.*
-   **Visual Experience:**
    -   Implementation of the "Desert Oasis at Night" theme - *Theme file created ([`src/theme/theme.ts`](src/theme/theme.ts:1)), colors defined. Shared background component [`src/components/ScreenBackground.tsx`](src/components/ScreenBackground.tsx:1) implemented for consistent web background.*
    -   Lottie-based animated background on Home screen (native iOS) - *Implemented ([`src/components/AnimatedBackground.tsx`](src/components/AnimatedBackground.tsx:1)), plays once and freezes.*\
    -   Static image background on Home screen (web) - *Implemented in [`app/(tabs)/index.tsx`](app/(tabs)/index.tsx:1) using `assets/images/webtest.png`.*\
    -   Consistent static image background (`assets/images/webtest.png` for web, `assets/images/iOSbackground.png` for native) on Surahs, Reader, Bookmarks, and Settings screens via `ScreenBackground.tsx`.
    -   Smooth UI animations and transitions - *Ongoing.*
-   **Core Screens (Expo Router):**
    -   `app/(tabs)/index.tsx` (HomeScreen): Displays Lottie/static background and title.
    -   `app/(tabs)/surahs.tsx` (SurahListScreen): Fetches and displays the list of Surahs from Vercel Blob.
    -   `app/(tabs)/reader.tsx` (ReaderScreen): Displays Arabic text (from API/DB) and Yusuf Ali translations (from Vercel Blob), with audio playback controls using `expo-audio`.
    -   `app/(tabs)/bookmarks.tsx` (BookmarksScreen): Placeholder, uses shared background.
    -   `app/(tabs)/settings.tsx` (SettingsScreen): Basic settings (e.g., autoplay toggle), uses shared background.
-   **Data Backend (Hybrid):**
    -   **Neon PostgreSQL Database (via Vercel Serverless Functions):** Primary store for Arabic Quranic text. Accessed via `src/services/apiClient.ts`.
    -   **Vercel Blob:** Store for static assets: Surah list (JSON), Yusuf Ali translations (JSON), and audio files. Accessed via `src/services/surahService.ts` and `src/services/audioService.ts`.
    -   **Supabase (Planned):** For dynamic user data (user accounts, bookmarks, etc.).

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
    -   Optimized for cross-platform performance, leveraging CDN for static data.

## 6. Technical Foundation (Expo Project)

-   **Platform:** Expo (React Native for iOS, Android, Web)
-   **Language:** TypeScript
-   **UI Framework:** React Native with custom components styled using `styled-components`.
-   **Navigation:** Expo Router
-   **Animation:** Lottie (`lottie-react-native`, `@lottiefiles/dotlottie-react`)
-   **Audio:** `expo-audio` (migrated from `expo-av`)
-   **Quranic Text Data (Arabic):** Neon PostgreSQL database, accessed via Vercel Serverless Functions (`api/*.ts`) using the `pg` library.
-   **Static Assets (Translations, Surah List, Audio):** Vercel Blob (JSON files, audio files).
-   **Dynamic User Data (Planned):** Supabase (`@supabase/supabase-js`).
-   **Fonts:** Noto Naskh Arabic (Arabic), Montserrat (English) - *Loaded via [`app/_layout.tsx`](app/_layout.tsx:1).*\
-   **Bundler:** Metro (with custom polyfills for Node.js core modules configured in [`metro.config.js`](metro.config.js:1)).

## 7. Success Metrics (for Expo Port)

-   High visual fidelity to the "Desert Oasis at Night" theme across platforms.
-   Smooth, jank-free animations and UI interactions.
-   Positive user feedback regarding the cross-platform experience, performance, and usability.
-   Successful and accurate delivery of Quranic text (from API/DB), translations (from Vercel Blob), and audio (from Vercel Blob).
-   Highly reliable and responsive audio playback, with UI state (including buffering, playing, paused, slider position) consistently synchronized with the actual player status, adhering to community best practices for `expo-audio`.
-   Successful bundling and operation on iOS, (Android to be tested), and Web.
-   Efficient data loading from API (for Arabic text) and CDN (Vercel Blob for translations, Surah list, audio).

## 8. Future Considerations (Post-MVP Port)
*(Adapted from original iOS brief)*
-   Full Surah list and navigation (Surah list implemented, full navigation to all Surahs pending).
-   Additional English translations and other languages (potentially also migrated to Vercel Blob).
-   Verse-by-verse audio playback for all Surahs.
-   Multiple reciter options.
-   Advanced search functionality (may require Supabase or other search service).
-   User accounts for personalization (bookmarks, reading progress sync) using Supabase.
-   Widget support (platform-dependent).
-   Offline access improvements (caching strategies for Blob data).