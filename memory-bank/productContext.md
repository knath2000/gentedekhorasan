# Product Context: Luminous Verses (Expo App)

**Version:** 0.4 (Robust Audio & Slider Fixes)
**Date:** 2025-05-11
**Related Brief:** `docs/projectbrief.md`
**Original iOS Native Port Context:** (This document adapts the product context of the original iOS native port for the current Expo-based cross-platform project.)

## 1. Why This Project Exists (Expo Cross-Platform App)

This project develops the "Luminous Verses" Quran app using Expo to:
-   **Reach a Wider Audience:** Target iOS, Android, and Web users from a single codebase, maximizing accessibility.
-   **Provide a Consistent User Experience:** Offer a familiar and high-quality experience across different platforms, unified by the "Desert Oasis at Night" theme.
-   **Leverage Web Technologies for Rapid Development:** Utilize React Native and TypeScript for efficient development and iteration.
-   **Maintain Core Vision:** The original goal of providing a modern, engaging, and aesthetically pleasing way for young adults (15-21 years old) to connect with the Quran remains central. This Expo version aims to deliver this vision broadly.

## 2. Problems It Solves (for a Cross-Platform Audience)

-   **Accessibility of Quranic Content:** Provides an easy-to-use, modern digital platform for accessing Quranic text.
-   **Engagement Gap:** Addresses the potential lack of engagement with Quranic content among younger audiences by offering a visually stimulating and interactive app on their preferred devices.
-   **Cross-Platform Availability:** Ensures users can access the app regardless of their primary device (iOS, Android, or Web browser).
-   **Development Efficiency:** Allows for a single codebase to serve multiple platforms, streamlining development and maintenance efforts compared to fully separate native apps.

## 3. How It Should Work (User Experience Goals for Expo App)

-   **Intuitive Cross-Platform Navigation:** Users should effortlessly navigate using familiar patterns adapted for each platform (iOS, Android, Web), guided by Expo Router, while experiencing the app's unique theme.
-   **Seamless Reading Experience:** The experience of reading Quranic text (initially Arabic, with translations planned) should be smooth and clear on all supported screen sizes.
    -   *Currently, Surah 1 Arabic text is displayed on the Reader screen using data from Supabase, with functional audio playback controls.*
-   **Visually Delightful & Performant:** The app must be a pleasure to look at and interact with, featuring high-quality Lottie animations (e.g., Home screen background on native) and fluid React Native transitions, performing well across platforms.
    -   *Home screen features a Lottie animation on native and a static image background on web.*
-   **Responsive Design:** The application must adapt gracefully to various screen sizes and orientations, particularly for web and different mobile devices.
-   **Respectful Presentation:** The modern aesthetic must continue to present Quranic content respectfully and appropriately.
-   **Accessibility:** Strive to meet accessibility guidelines for each platform (WCAG for web, platform-specific guidelines for native).

## 4. Core User Journey (Expo App - Simplified & Current State)

1.  User opens the app (iOS, Android, or Web).
2.  User is greeted by the Home screen:
    -   Native: Animated "Desert Oasis at Night" background (plays once, freezes).
    -   Web: Static "webtest.png" background.
    -   Displays "Home Screen" title.
3.  User navigates via the Tab Bar (default Expo Router tab bar) to different sections:
    -   Home: (As described above)
    -   Surahs: Fetches and displays the list of Surahs. Uses the "Desert Oasis at Night" theme background (`assets/images/iOSbackground.png`). Layout is adjusted to prevent overlap with the tab bar.
    -   Reader: Displays verses of Surah 1 (Arabic text) fetched from Supabase, with audio playback controls. Content is scrollable.
    -   Bookmarks: (Currently a placeholder screen)
    -   Settings: (Currently a placeholder screen)
4.  User reads Arabic text on the Reader screen.
5.  User can listen to audio for Surah 1. (Future) User bookmarks verses, customizes settings.
6.  User feels a sense of connection and ease while interacting with the sacred text on their chosen platform.