# Vercel Root Configuration Solution

## Issue Identified
The deployment is using the root `vercel.json` file which has a `builds` configuration. This overrides any project-specific settings in the Vercel dashboard AND the app-specific `vercel.json`.

## Current Root vercel.json
```json
{
  "version": 2,
  "installCommand": "pnpm install --frozen-lockfile",
  "builds": [
    {
      "src": "apps/quranexpo-web/build.sh",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "apps/quranexpo-web/dist"
      }
    }
  ],
  "rewrites": [
    { "source": "/(.*)", "destination": "/apps/quranexpo-web/dist/$1" }
  ]
}
```

## The Problem
Despite having `distDir` configured, Vercel is still looking for output at the wrong location.

## Solution Options

### Option 1: Update build.sh to create dist at root
Add to the end of `apps/quranexpo-web/build.sh`:
```bash
# Copy dist to root as Vercel expects
echo "Copiando dist a la raíz para Vercel..."
cp -r apps/quranexpo-web/dist ./dist
```

### Option 2: Update root vercel.json (RECOMMENDED)
Change the root `vercel.json` to properly handle the monorepo output:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/quranexpo-web/build.sh", 
      "use": "@vercel/static",
      "config": {
        "outputDirectory": "apps/quranexpo-web/dist"
      }
    }
  ]
}
```

### Option 3: Remove builds config and use Framework Preset
Remove the `builds` array from root `vercel.json` and configure each app in the Vercel dashboard.

## Immediate Fix
Since we need a quick solution, let's update the build.sh to copy the output to where Vercel expects it.