# quranexpo-web Output Directory Solution

## Problem Analysis
The deployment has TWO conflicting build configurations:

1. **Custom build.sh** (currently being used)
   - Executed from `apps/quranexpo-web/`
   - Changes directory to monorepo root
   - Builds output to `apps/quranexpo-web/dist/`

2. **vercel.json** (being ignored)
   - Has `buildCommand` and `installCommand` that aren't used
   - Expects output in `dist` relative to project root

## Solution Options

### Option 1: Update vercel.json outputDirectory (RECOMMENDED)
Since we're using the custom build.sh, update the outputDirectory to match where the files actually are:

**File:** `apps/quranexpo-web/vercel.json`
```json
{
  "buildCommand": "./build.sh",
  "outputDirectory": "apps/quranexpo-web/dist",
  "framework": null,
  "nodeVersion": "20.x"
}
```

### Option 2: Remove custom build and use vercel.json commands
Delete `build.sh` and update `vercel.json`:
```json
{
  "buildCommand": "cd ../.. && npx pnpm@9.1.4 install --frozen-lockfile && npx pnpm@9.1.4 --filter @quran-monorepo/quranexpo-web run build",
  "outputDirectory": "dist",
  "framework": null,
  "nodeVersion": "20.x"
}
```

### Option 3: Update build.sh to copy dist
Add to the end of `build.sh`:
```bash
# Ensure dist is in the expected location
echo "Asegurando que dist esté en la ubicación correcta..."
if [ -d "apps/quranexpo-web/dist" ] && [ ! -d "dist" ]; then
    cp -r apps/quranexpo-web/dist ./dist
fi
```

## Immediate Action Required
1. Switch to Code mode
2. Update `apps/quranexpo-web/vercel.json` with Option 1
3. Commit and deploy

## Note on Node Version
The logs show Node.js version changed from 22.x to 20.x. The vercel.json specifies 18.x but should probably be 20.x to match what's working.