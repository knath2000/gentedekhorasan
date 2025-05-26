# Active Context

## Current Status: QuranExpo Web Deployment

### ✅ Deployment Configuration Fixed
- Root `vercel.json` cleaned up (removed `builds`, `rewrites`, `installCommand`).
- `apps/quranexpo-web/build.sh` deleted.
- `apps/quranexpo-web/vercel.json` deleted.
- `apps/quranexpo-web/package.json` build script simplified.
- Vercel Dashboard configuration confirmed:
    - Root Directory: `apps/quranexpo-web`
    - Build Command: `cd ../.. && npx pnpm@9.1.4 install && npx pnpm@9.1.4 --filter @quran-monorepo/quranexpo-web run build`
    - Output Directory: `dist`
    - Install Command: Empty
    - "Include files outside the root directory": Enabled

### 🛠️ Application-Level Errors Addressed

#### 1. Edge Config Error (`@vercel/edge-config: No connection string provided`)
- **Fix Applied**: Modified `apps/quranexpo-web/src/pages/api/transliterations.ts` to gracefully handle missing Edge Config connection string during build time by returning an empty object.

#### 2. Preact Hooks Error (`Cannot read properties of undefined (reading '__H')`)
- **Fix Applied**: Added Vite `resolve.alias` configuration in `apps/quranexpo-web/astro.config.mjs` to alias `react` and `react-dom` to `preact/compat`. This is a common solution for Preact hooks compatibility issues in SSR environments.

## Next Steps

1.  **Manual Deployment on Vercel**:
    *   Perform a new deployment on Vercel for the `quranexpo-web` project.
    *   Ensure to **deploy without cache** to pick up all the latest changes.
2.  **Monitor Build Logs**: Carefully review the build logs for any new errors or warnings.
3.  **Verify Functionality**: Once deployed, thoroughly test the `quranexpo-web` application, especially the reader page and any features relying on Edge Config.

## Summary
The deployment configuration is now robust, and initial application-level build errors have been addressed. The next step is to re-deploy and verify the fixes.