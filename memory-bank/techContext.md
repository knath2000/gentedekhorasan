# Technical Context: Gente de Khorasan Monorepo

**Version:** 1.0.0
**Date:** 2025-05-24
**Related Brief:** `memory-bank/projectbrief.md`

## 1. Core Frameworks & Platforms (Monorepo Level)

-   **Monorepo Tooling:**
    -   `pnpm`: Gestor de paquetes para monorepos, optimiza la instalación de dependencias y el uso del espacio en disco.
    -   `TurboRepo`: Sistema de compilación para monorepos, optimiza la ejecución de tareas y el caching.
-   **Backend (API):**
    -   **Platform:** Vercel Serverless Functions (Node.js runtime).
    -   **Language:** TypeScript.
    -   **Database:** Neon PostgreSQL (serverless-first PostgreSQL).
    -   **ORM:** Prisma ORM (con `@prisma/adapter-neon` para Neon).
    -   **Edge Caching:** Vercel Edge Config.
-   **Frontend (Web App):**
    -   **Framework:** Astro.
    -   **Language:** TypeScript.
    -   **UI Frameworks:** Preact, React.
    -   **Styling:** Tailwind CSS.
-   **Shared Code:**
    -   **Language:** TypeScript.
    -   **Package Manager:** pnpm workspaces.

## 2. Key Technologies & Libraries (Monorepo Level)

-   **Database Interaction:**
    -   `@prisma/client`: Cliente de Prisma ORM para interactuar con la base de datos.
    -   `@prisma/adapter-neon`: Adaptador de Prisma para Neon Database.
    -   `pg`: Cliente PostgreSQL para Node.js (utilizado directamente en algunas funciones serverless si no se usa Prisma).
-   **Vercel Ecosystem:**
    -   `@vercel/node`: Adaptador para funciones serverless de Node.js en Vercel.
    -   `@vercel/edge-config`: Cliente para interactuar con Vercel Edge Config.
-   **Web Development:**
    -   `astro`: Framework for building content-driven websites.
    -   `preact`: Fast 3kB alternative to React with the same modern API.
    -   `react`: A JavaScript library for building user interfaces.
    -   `tailwindcss`: A utility-first CSS framework for rapid UI development.
-   **Shared Utilities:**
    -   `typescript`: Para tipado estático.
    -   `eslint`: Para linting de código.
    -   `prettier`: Para formato de código.

## 3. Development Environment & Tools (Monorepo Level)

-   **Package Manager:** `pnpm`.
-   **Version Control:** Git.
-   **IDE:** Visual Studio Code (con extensiones para TypeScript, React Native, Prisma, ESLint, Prettier).
-   **Debugging:** Herramientas de depuración específicas para Node.js (API) y React Native (aplicación móvil).
-   **Local Development:** `vercel dev` para probar funciones serverless localmente.
-   **Monorepo Task Runner:** `turbo` CLI.

## 4. Technical Constraints & Considerations (Monorepo Level)

-   **Web Performance:** Optimizing the web application for fast load times and a smooth user experience.
-   **API Performance & Scalability:** Ensuring the API is high-performance and can scale to meet demand.
-   **Database Connection Management:** Efficiently managing database connections in a serverless environment (Prisma Connection Pooling).
-   **Monorepo Build Times:** Optimizing build and test times using TurboRepo.
-   **Shared Code Management:** Ensuring that changes to shared packages do not introduce regressions in consuming projects.
-   **Environment Variable Management:** Consistent management of environment variables across different projects and deployment environments (Vercel).
-   **CI/CD Strategy:** Implementing a CI/CD strategy that supports the monorepo's nature, including incremental builds and conditional deployments.