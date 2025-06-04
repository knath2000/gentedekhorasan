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
-   **Frontend (Mobile App):**
    -   **Platform:** Expo (managed workflow) for iOS and Android.
    -   **Language:** TypeScript.
    -   **UI Framework:** React Native.
    -   **Navigation:** Expo Router.
    -   **Audio:** `expo-audio`.
    -   **Animation:** Lottie (`lottie-react-native`).
-   **Shared Code:**
    -   **Language:** TypeScript.
    -   **Package Manager:** pnpm workspaces.

## 2. Key Technologies & Libraries (Monorepo Level)

-   **AI Translation:**
    -   **Model:** 'google/gemini-2.0-flash-exp:free'
    -   **Endpoint:** `apps/quran-data-api/api/v1/ai-translate.ts`
    -   **Configuration:** API key management and rate limiting
    -   **Integration:** Seamless connection with frontend components

-   **Database Interaction:**
    -   `@prisma/client`: Cliente de Prisma ORM para interactuar con la base de datos.
    -   `@prisma/adapter-neon`: Adaptador de Prisma para Neon Database.
    -   `pg`: Cliente PostgreSQL para Node.js (utilizado directamente en algunas funciones serverless si no se usa Prisma).
-   **Vercel Ecosystem:**
    -   `@vercel/node`: Adaptador para funciones serverless de Node.js en Vercel.
    -   `@vercel/edge-config`: Cliente para interactuar con Vercel Edge Config.
-   **Mobile Development:**
    -   `expo`: Core SDK para el desarrollo de aplicaciones universales.
    -   `react-native`: Framework para construir interfaces de usuario nativas.
    -   `expo-router`: Enrutador basado en el sistema de archivos para Expo.
    -   `styled-components`: Para estilos basados en componentes.
    -   `react-native-safe-area-context`: Para manejar áreas seguras en dispositivos móviles.
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

-   **Cross-Platform Compatibility:** Mantener la compatibilidad y el rendimiento en iOS y Android para la aplicación móvil.
-   **API Performance & Scalability:** Asegurar que la API sea de alto rendimiento y pueda escalar para manejar la demanda.
-   **Database Connection Management:** Gestión eficiente de las conexiones a la base de datos en un entorno serverless (Prisma Connection Pooling).
-   **Edge Config Synchronization:** Mantener los datos de Edge Config sincronizados con la base de datos principal.
-   **Monorepo Build Times:** Optimizar los tiempos de compilación y prueba utilizando TurboRepo.
-   **Shared Code Management:** Asegurar que los cambios en los paquetes compartidos no introduzcan regresiones en los proyectos consumidores.
-   **Environment Variable Management:** Consistencia en la gestión de variables de entorno a través de los diferentes proyectos y entornos de despliegue (Vercel, Expo).
-   **CI/CD Strategy:** Implementar una estrategia de CI/CD que soporte la naturaleza del monorepo, incluyendo builds incrementales y despliegues condicionales.
