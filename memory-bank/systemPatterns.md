# System Patterns: Gente de Khorasan Monorepo

**Version:** 1.0.0
**Date:** 2025-05-24
**Related Brief:** `memory-bank/projectbrief.md`

## 1. Overall Monorepo Architecture

```mermaid
graph TD
    MonorepoRoot[Gente de Khorasan Monorepo] --> pnpm[pnpm Workspaces]
    MonorepoRoot --> TurboRepo[TurboRepo]

    pnpm --> QuranExpoWebApp[apps/quranexpo-web (Web App)]
    pnpm --> QuranDataAPI[apps/quran-data-api (API Service)]
    pnpm --> QuranTypesPkg[packages/quran-types (Shared Types)]

    QuranExpoWebApp -- Consumes --> QuranDataAPI
    QuranExpoWebApp -- Uses --> QuranTypesPkg
    QuranDataAPI -- Uses --> QuranTypesPkg
    QuranDataAPI -- Interacts with --> NeonDB[Neon PostgreSQL Database]

    subgraph QuranExpo Web App (Astro)
        WebApp[Astro App] --> WebComponents[UI Components]
        WebApp --> WebHooks[Custom Hooks]
        WebApp --> WebServices[Client Services]
        WebServices -- Calls --> QuranDataAPI
    end

    subgraph Quran Data API (Vercel Serverless)
        APIEndpoints[API Endpoints (e.g., /api/v1/get-verses)] --> PrismaORM[Prisma ORM]
        PrismaORM -- Queries --> NeonDB
        APIEndpoints -- Reads from --> VercelEdgeConfig
    end

    subgraph Shared Packages
        QuranTypesPkg --> TypeScript[TypeScript Definitions]
    end

    style MonorepoRoot fill:#f9f,stroke:#333,stroke-width:2px
    style pnpm fill:#ccf,stroke:#333,stroke-width:2px
    style TurboRepo fill:#cdf,stroke:#333,stroke-width:2px
    style QuranExpoWebApp fill:#dff,stroke:#333,stroke-width:2px
    style QuranDataAPI fill:#dfd,stroke:#333,stroke-width:2px
    style QuranTypesPkg fill:#aef,stroke:#333,stroke-width:2px
    style NeonDB fill:#69b,stroke:#333,stroke-width:2px
    style VercelEdgeConfig fill:#fdb,stroke:#333,stroke-width:2px