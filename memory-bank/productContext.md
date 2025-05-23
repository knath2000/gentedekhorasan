# Product Context: Luminous Verses (Expo App)

**Version:** 0.9.4 (Reflects API-Driven Architecture & Ongoing Review)
**Date:** 2025-05-19
**Related Brief:** `memory-bank/projectbrief.md`
**Original iOS Native Port Context:** (This document adapts the product context of the original iOS native port for the current Expo-based cross-platform project.)

## 1. Why This Project Exists (Expo Cross-Platform App)

This project develops the "Luminous Verses" Quran app using Expo to:
-   **Reach a Wider Audience:** Target iOS and Android users from a single codebase, maximizing accessibility.
-   **Provide a Consistent User Experience:** Offer a familiar and high-quality experience across different platforms, unified by the "Desert Oasis at Night" theme.
-   **Leverage React Native & TypeScript for Rapid Development:** Utilize these for efficient development and iteration on native platforms.
-   **Maintain Core Vision:** The original goal of providing a modern, engaging, and aesthetically pleasing way for young adults (15-21 years old) to connect with the Quran remains central. This Expo version aims to deliver this vision broadly.

## 2. Problems It Solves (for a Cross-Platform Audience)

-   **Accessibility of Quranic Content:** Provides an easy-to-use, modern digital platform for accessing Quranic text. Arabic text is served dynamically from a backend API/database, while translations are served efficiently via API (utilizing `apiClient.ts`) and Surah lists via API (utilizing `quranMetadataService`) for fast global access.
-   **Engagement Gap:** Addresses the potential lack of engagement with Quranic content among younger audiences by offering a visually stimulating and interactive app on their preferred devices.
-   **Cross-Platform Availability:** Ensures users can access the app on iOS and Android devices.
-   **Development Efficiency:** Allows for a single codebase to serve iOS and Android, streamlining development and maintenance efforts.

## 3. How It Should Work (User Experience Goals for Expo App)

-   **Intuitive Cross-Platform Navigation:** Users should effortlessly navigate using familiar patterns adapted for iOS and Android, guided by Expo Router, while experiencing the app's unique theme.
-   **Seamless Reading Experience:** The experience of reading Quranic text should be smooth and clear on all supported screen sizes.
    -   *Arabic text is fetched dynamically from an API (backed by a PostgreSQL database) for flexibility and up-to-date content.*
    -   *Yusuf Ali translations are fetched quickly via API (utilizing `apiClient.ts`).*
    -   *The `surahService.ts` combines these sources to present complete verse information.*
-   **Robust Audio Playback:** Verse-by-verse audio (using `expo-audio`, with files from Vercel Blob) is clear, with intuitive controls. Playback state (playing, paused, buffering, slider position) is now robustly synchronized with the actual player status via an event-driven approach, ensuring a seamless and predictable user experience. This includes correct resume-from-pause and clear visual feedback (e.g., verse highlights, buffering indicators, slider updates) that accurately reflect the audio system's state, aligning with `expo-audio` community best practices.
-   **Visually Delightful & Performant:** The app must be a pleasure to look at and interact with, featuring high-quality Lottie animations (e.g., Home screen background on native) and fluid React Native transitions, performing well across platforms.
    -   *Home screen features a Lottie animation on native. Other tab screens use a consistent shared background component.*
-   **Responsive Design:** The application must adapt gracefully to various screen sizes and orientations on mobile devices.
-   **Respectful Presentation:** The modern aesthetic must continue to present Quranic content respectfully and appropriately.
-   **Accessibility:** Strive to meet platform-specific accessibility guidelines for native (iOS and Android).

## 4. Core User Journey (Expo App - Simplified & Current State)

1.  User opens the app (iOS or Android).
2.  User is greeted by the Home screen:
    -   Native: Animated "Desert Oasis at Night" background (plays once, freezes).
    -   Displays "Luminous Verses" welcome text and a Verse of the Day.
3.  User navigates via the Tab Bar (default Expo Router tab bar) to different sections:
    -   Home: (As described above)
    -   Surahs: Fetches and displays the list of Surahs via API (utilizing `quranMetadataService`). Uses the shared `ScreenBackground` component.
    -   Reader: Displays verses (Arabic text fetched from API/DB, Yusuf Ali translation via API), with robust audio playback controls using `expo-audio`. Content is scrollable. Uses the shared `ScreenBackground` component.
    -   Bookmarks: (Currently a placeholder screen). Uses the shared `ScreenBackground` component.
    -   Settings: (Basic settings for autoplay). Uses the shared `ScreenBackground` component.
4.  User reads Arabic text and translations on the Reader screen.
5.  User can listen to audio for Surah 1, with playback starting promptly, resuming correctly, and all UI elements (verse highlights, playback slider, buffering indicators) updating reliably and accurately in sync with the player's actual state.
6.  (Future) User bookmarks verses, customizes settings (dynamic data via Supabase).
7.  User feels a sense of connection and ease while interacting with the sacred text on their chosen platform, benefiting from fast content delivery via API (for Arabic text, Surah list, and translations) and CDN (for audio).