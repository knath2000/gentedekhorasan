# quranexpo-web Final Deployment Solutions

## Current Situation
- **quran-data-api**: ✅ Successfully deployed
- **quranexpo-web**: ❌ Deployment blocked by pnpm version incompatibility
  - Vercel has pnpm 6.35.1 pre-installed
  - Our lockfile requires pnpm 9.x (`lockfileVersion: '9.0'`)
  - Corepack is not successfully overriding the system pnpm

## Solution Options (Prioritized)

### Option D: Use npx to run specific pnpm version (RECOMMENDED)
This is the cleanest solution that works with the existing lockfile.

**File to modify**: `apps/quranexpo-web/build.sh`

```bash
#!/bin/bash
set -e

echo ">>> INICIANDO build.sh para quranexpo-web (usando npx) <<<"

# Navegar a la raíz del monorepo
echo "Cambiando al directorio raíz del monorepo..."
cd ../..

echo "Directorio actual: $(pwd)"
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

echo ">>> build.sh COMPLETADO <<<"
```

### Option C: Direct pnpm Installation
Install pnpm 9.1.4 globally before using it.

```bash
#!/bin/bash
set -e

echo ">>> INICIANDO build.sh para quranexpo-web (instalación directa) <<<"

# Instalar pnpm 9.1.4 directamente
echo "Instalando pnpm@9.1.4 globalmente..."
npm install -g pnpm@9.1.4
echo "Versión de pnpm instalada: $(pnpm --version)"

# Navegar a la raíz del monorepo
cd ../..

echo "Ejecutando install command..."
pnpm install --frozen-lockfile

echo "Ejecutando build de Astro..."
pnpm --filter @quran-monorepo/quranexpo-web run build

echo ">>> build.sh COMPLETADO <<<"
```

### Option E: Regenerate lockfile with pnpm 6.x
Work with Vercel's pre-installed pnpm version.

**Local steps**:
1. Install pnpm 6.35.1 locally:
   ```bash
   npm install -g pnpm@6.35.1
   ```
2. Delete current lockfile:
   ```bash
   rm pnpm-lock.yaml
   ```
3. Regenerate lockfile:
   ```bash
   pnpm install
   ```
4. Commit and push:
   ```bash
   git add pnpm-lock.yaml
   git commit -m "fix: regenerate lockfile with pnpm 6.35.1 for Vercel compatibility"
   git push
   ```

### Option F: Remove custom build script
Let Vercel handle the monorepo build natively.

1. Delete `apps/quranexpo-web/build.sh`
2. Update `apps/quranexpo-web/vercel.json`:
   ```json
   {
     "buildCommand": "cd ../.. && pnpm install && pnpm --filter @quran-monorepo/quranexpo-web run build",
     "outputDirectory": "dist"
   }
   ```
3. Remove the `builds` section if present

### Option G: Use Vercel's PNPM_VERSION environment variable
Add an environment variable in Vercel dashboard:
- Key: `PNPM_VERSION`
- Value: `9.1.4`

Then simplify build.sh:
```bash
#!/bin/bash
set -e

cd ../..
pnpm install --frozen-lockfile
pnpm --filter @quran-monorepo/quranexpo-web run build
```

## Recommendation Priority
1. **Try Option D first** (npx approach) - least invasive, should work immediately
2. **If D fails, try Option G** (environment variable) - Vercel's native support
3. **If both fail, use Option E** (regenerate lockfile) - guaranteed to work but requires local changes
4. **Last resort: Option F** (remove custom script) - simplest but less control

## Success Indicators
- No "Ignoring not compatible lockfile" warnings
- Successful dependency installation
- Successful Astro build
- Deployment completes without errors