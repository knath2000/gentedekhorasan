# quranexpo-web Corepack Issue Analysis

## Problem Discovered
The Corepack commands are not working as expected in Vercel's environment:

```bash
corepack enable
corepack prepare pnpm@9.1.4 --activate
echo "Versión de pnpm activa: $(pnpm --version)"
# Output: 6.35.1 (NOT 9.1.4!)
```

## Root Cause
1. Vercel's build environment has pnpm 6.35.1 pre-installed
2. Corepack is not overriding the system pnpm correctly
3. The lockfile shows `lockfileVersion: '9.0'` which is incompatible with pnpm 6.x

## Solution Options

### Option C: Direct pnpm Installation
Instead of relying on Corepack, install pnpm directly using npm:

```bash
#!/bin/bash
set -e

echo ">>> INICIANDO build.sh para quranexpo-web (instalación directa de pnpm) <<<"

# Instalar pnpm 9.1.4 directamente
echo "Instalando pnpm@9.1.4..."
npm install -g pnpm@9.1.4
echo "Versión de pnpm instalada: $(pnpm --version)"

# Navegar a la raíz del monorepo
cd ../..

echo "Ejecutando install command desde la raíz del monorepo..."
pnpm install --frozen-lockfile

echo "Ejecutando build de Astro..."
pnpm --filter @quran-monorepo/quranexpo-web run build

echo ">>> build.sh COMPLETADO <<<"
```

### Option D: Use npx to run specific pnpm version
```bash
#!/bin/bash
set -e

echo ">>> INICIANDO build.sh para quranexpo-web (usando npx) <<<"

# Navegar a la raíz del monorepo
cd ../..

echo "Ejecutando install con pnpm@9.1.4 via npx..."
npx pnpm@9.1.4 install --frozen-lockfile

echo "Ejecutando build de Astro..."
npx pnpm@9.1.4 --filter @quran-monorepo/quranexpo-web run build

echo ">>> build.sh COMPLETADO <<<"
```

### Option E: Regenerate lockfile with pnpm 6.x
Since Vercel has pnpm 6.35.1, we could regenerate the lockfile locally with this version:

1. Install pnpm 6.35.1 locally
2. Delete current lockfile
3. Run `pnpm install` to generate compatible lockfile
4. Commit and push

### Option F: Remove custom build script
Configure Vercel to use its native monorepo support by removing the custom build.sh and updating vercel.json.

## Recommendation
Try Option D first (using npx) as it's the least invasive and should work with the current lockfile.