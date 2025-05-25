# System Patterns: Gente de Khorasan Monorepo

**Version:** 1.0.0
**Date:** 2025-05-24
**Related Brief:** `memory-bank/projectbrief.md`

## 1. Overall Monorepo Architecture

```mermaid
graph TD
    MonorepoRoot[Gente de Khorasan Monorepo] --> pnpm[pnpm Workspaces]
    MonorepoRoot --> TurboRepo[TurboRepo]

    pnpm --> LuminousVersesApp[apps/luminous-verses-expo (Mobile App)]
    pnpm --> QuranDataAPI[apps/quran-data-api (API Service)]
    pnpm --> QuranTypesPkg[packages/quran-types (Shared Types)]

    LuminousVersesApp -- Consumes --> QuranDataAPI
    LuminousVersesApp -- Uses --> QuranTypesPkg
    QuranDataAPI -- Uses --> QuranTypesPkg
    QuranDataAPI -- Interacts with --> NeonDB[Neon PostgreSQL Database]
    QuranDataAPI -- Interacts with --> VercelEdgeConfig[Vercel Edge Config]

    subgraph Luminous Verses App (Expo)
        LVApp[Expo App] --> LVComponents[UI Components]
        LVApp --> LVHooks[Custom Hooks]
        LVApp --> LVServices[Client Services]
        LVServices -- Calls --> QuranDataAPI
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
    style LuminousVersesApp fill:#dff,stroke:#333,stroke-width:2px
    style QuranDataAPI fill:#dfd,stroke:#333,stroke-width:2px
    style QuranTypesPkg fill:#aef,stroke:#333,stroke-width:2px
    style NeonDB fill:#69b,stroke:#333,stroke-width:2px
    style VercelEdgeConfig fill:#fdb,stroke:#333,stroke-width:2px