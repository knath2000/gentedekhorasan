# quranexpo-web Deployment Fix Plan

## Current Issue
The deployment fails during `pnpm install --frozen-lockfile` in the build.sh script with:
- `WARN Ignoring not compatible lockfile at /vercel/path0/pnpm-lock.yaml`
- `ERROR Headless installation requires a pnpm-lock.yaml file`

## Solution Approach

### Option A: Remove --frozen-lockfile flag
This will allow pnpm to be more flexible with the lockfile during installation.

**Modified build.sh:**
```bash
#!/bin/bash
set -e # Salir inmediatamente si un comando falla

echo ">>> INICIANDO build.sh para quranexpo-web (sin --frozen-lockfile) <<<"

# Navegar a la raíz del monorepo
echo "Cambiando al directorio raíz del monorepo: $(cd ../.. && pwd)"
cd ../..

echo "Directorio actual: $(pwd)"
echo "Listando contenido del directorio actual (raíz monorepo):"
ls -la

echo "Ejecutando install command desde la raíz del monorepo..."
pnpm install

echo "Ejecutando build de Astro para quranexpo-web usando pnpm --filter..."
pnpm --filter @quran-monorepo/quranexpo-web run build

echo ">>> build.sh para quranexpo-web COMPLETADO <<<"
```

### Option B: Force pnpm version with Corepack (if Option A fails)
```bash
#!/bin/bash
set -e # Salir inmediatamente si un comando falla

PNPM_VERSION="9.1.4"

echo ">>> INICIANDO build.sh para quranexpo-web (con Corepack y pnpm install --frozen-lockfile) <<<"
echo "Asegurando pnpm version $PNPM_VERSION con Corepack..."
corepack enable
corepack prepare pnpm@$PNPM_VERSION --activate
echo "Versión de pnpm activa: $(pnpm --version)"

echo "Cambiando al directorio raíz del monorepo: $(cd ../.. && pwd)"
cd ../..

echo "Directorio actual: $(pwd)"
echo "Listando contenido del directorio actual (raíz monorepo):"
ls -la

echo "Ejecutando install command desde la raíz del monorepo..."
pnpm install --frozen-lockfile

echo "Ejecutando build de Astro para quranexpo-web usando pnpm --filter..."
pnpm --filter @quran-monorepo/quranexpo-web run build

echo ">>> build.sh para quranexpo-web COMPLETADO <<<"
```

## Deployment Steps
1. Apply Option A first
2. Commit and push changes
3. Deploy with "Deploy without cache" option in Vercel
4. If Option A fails, apply Option B
5. Monitor logs carefully for any new errors