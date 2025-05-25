# Project Brief: Gente de Khorasan Monorepo

**Version:** 1.0.0
**Date:** 2025-05-24

## 1. Project Name

Gente de Khorasan Monorepo

## 2. Core Goal

To develop and maintain a suite of interconnected applications and services related to Quranic content, housed within a single monorepo. This monorepo aims to streamline development, facilitate code sharing, and ensure consistency across different platforms and services.

**Primary Objectives:**
-   **Centralized Data API:** Provide a robust, scalable, and secure API for Quranic text, translations, and metadata, accessible by various client applications.
-   **Cross-Platform Mobile Application:** Develop a modern, engaging, and aesthetically pleasing mobile application (iOS and Android) for users to connect with the Quran.
-   **Efficient Development Workflow:** Leverage monorepo tools (pnpm, TurboRepo) to optimize dependency management, build processes, and code sharing.

## 3. Monorepo Structure

This monorepo currently contains the following key applications/services:

-   **`apps/luminous-verses-expo`**: The cross-platform mobile application (Expo/React Native) for iOS and Android.
-   **`apps/quran-data-api`**: The Vercel Serverless Functions API, responsible for serving Quranic text, translations, and metadata from a Neon PostgreSQL database and Vercel Edge Config.
-   **`packages/quran-types`**: A shared package for TypeScript types and interfaces used across the monorepo.

## 4. Key Features (Monorepo Level)

-   **Unified Data Source:** All Quranic data (Arabic text, translations, metadata) is managed and served through the `quran-data-api`.
-   **Shared Type Definitions:** Consistent data structures across frontend and backend via `packages/quran-types`.
-   **Optimized Build System:** Utilizes pnpm workspaces and TurboRepo for efficient builds and caching.

## 5. Technical Foundation (Monorepo Level)

-   **Monorepo Tooling:** pnpm workspaces, TurboRepo.
-   **API Backend:** Vercel Serverless Functions (TypeScript), Neon PostgreSQL, Prisma ORM, Vercel Edge Config.
-   **Mobile Frontend:** Expo (React Native), TypeScript.
-   **Shared Code:** TypeScript.

## 6. Success Metrics (Monorepo Level)

-   Successful and stable deployment of all applications/services within the monorepo.
-   Efficient development, testing, and deployment cycles facilitated by monorepo tooling.
-   Consistent data integrity and accessibility across all consuming applications.
-   High performance and reliability of the API and mobile application.