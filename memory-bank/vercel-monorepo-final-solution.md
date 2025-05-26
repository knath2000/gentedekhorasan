# Vercel Monorepo Deployment - Final Solution

## Problem Analysis

The issue with `quranexpo-web` deployment is that when using `builds` configuration in the root `vercel.json`, Vercel has specific expectations about where the output directory should be located. Even though our build creates the output correctly, Vercel can't find it.

## Root Cause

1. When using `builds` configuration with a custom build command, Vercel expects the output to be in a specific location
2. The `distDir` configuration in `vercel.json` might not be correctly interpreted when using custom builds
3. The `cp` command in our build script might not be placing files where Vercel expects them

## Solution Options

### Option 1: Remove `builds` Configuration (Recommended)

Since Vercel now has better automatic framework detection, we can simplify by removing the `builds` configuration and letting Vercel handle the build process automatically.

1. **Update root `vercel.json`**:
```json
{
  "installCommand": "npx pnpm@9.1.4 install",
  "buildCommand": "npx pnpm@9.1.4 run build",
  "devCommand": "npx pnpm@9.1.4 run dev",
  "ignoreCommand": "npx turbo-ignore"
}
```

2. **Create `apps/quranexpo-web/vercel.json`**:
```json
{
  "outputDirectory": "dist"
}
```

3. **Simplify `apps/quranexpo-web/build.sh`**:
```bash
#!/bin/bash
set -e

echo ">>> Building quranexpo-web with Astro <<<"

# Navigate to project directory
cd "$(dirname "$0")"

# Build with Astro
npx astro build

echo ">>> Build completed <<<"
```

4. **Update `apps/quranexpo-web/package.json`**:
```json
{
  "scripts": {
    "build": "astro build"
  }
}
```

### Option 2: Fix Current Setup with Correct Output Path

If we need to keep the current `builds` configuration:

1. **Update `apps/quranexpo-web/build.sh`**:
```bash
#!/bin/bash
set -e

echo ">>> INICIANDO build.sh para quranexpo-web (usando npx) <<<"

# Cambiar al directorio raíz del monorepo
echo "Cambiando al directorio raíz del monorepo..."
cd ../..
echo "Directorio actual: $(pwd)"

# Verificar si pnpm-lock.yaml existe
echo "Verificando lockfile..."
if [ -f "pnpm-lock.yaml" ]; then
    echo "pnpm-lock.yaml encontrado"
else
    echo "ERROR: pnpm-lock.yaml no encontrado!"
    exit 1
fi

echo "Ejecutando install con pnpm@9.1.4 via npx..."
npx pnpm@9.1.4 install --frozen-lockfile

echo "Ejecutando build de Astro con pnpm@9.1.4..."
npx pnpm@9.1.4 --filter @quran-monorepo/quranexpo-web run build

# Vercel expects the output in a specific location when using builds
echo "Moviendo dist al directorio esperado por Vercel..."
mkdir -p .vercel/output/static
cp -r apps/quranexpo-web/dist/* .vercel/output/static/

echo ">>> build.sh COMPLETADO <<<"
```

### Option 3: Use Vercel Dashboard Configuration

The most reliable approach for monorepos:

1. **Remove all build-related configurations from `vercel.json`**
2. **Configure in Vercel Dashboard**:
   - Root Directory: `apps/quranexpo-web`
   - Build Command: `cd ../.. && npx pnpm@9.1.4 install && npx pnpm@9.1.4 --filter @quran-monorepo/quranexpo-web run build`
   - Output Directory: `dist`
   - Install Command: Leave empty (handled by build command)

## Recommended Approach

Given the complexity and the issues we're facing, I recommend **Option 3** - using Vercel Dashboard configuration. This approach:

1. Simplifies the configuration
2. Leverages Vercel's built-in monorepo support
3. Avoids conflicts between `builds` configuration and Vercel's expectations
4. Is more maintainable and easier to debug

## Implementation Steps

1. **Remove `builds` configuration from root `vercel.json`**
2. **Delete or simplify `apps/quranexpo-web/build.sh`**
3. **Configure the project in Vercel Dashboard** as described above
4. **Deploy without cache** to ensure clean build

## Additional Considerations

- The Edge Config error in the logs (`Error fetching transliterations from Edge Config`) is a separate issue that needs to be addressed by configuring the Edge Config connection string in Vercel environment variables
- Make sure all environment variables required by the app are configured in Vercel Dashboard