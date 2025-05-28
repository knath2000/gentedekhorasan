# quranexpo-web Option B Implementation

## Objective
Force the correct pnpm version using Corepack to resolve the version mismatch and HTTP request errors.

## The Problem
- Lockfile was generated with pnpm@10.x
- Project specifies pnpm@9.1.4
- This mismatch is causing pnpm to ignore the lockfile and fetch fresh packages
- HTTP requests are failing with ERR_INVALID_THIS errors

## Solution: Modified build.sh with Corepack

```bash
#!/bin/bash
set -e # Salir inmediatamente si un comando falla

PNPM_VERSION="9.1.4"

echo ">>> INICIANDO build.sh para quranexpo-web (con Corepack) <<<"
echo "Asegurando pnpm version $PNPM_VERSION con Corepack..."
corepack enable
corepack prepare pnpm@$PNPM_VERSION --activate
echo "Versión de pnpm activa: $(pnpm --version)"

# Navegar a la raíz del monorepo
echo "Cambiando al directorio raíz del monorepo: $(cd ../.. && pwd)"
cd ../..

echo "Directorio actual: $(pwd)"
echo "Listando contenido del directorio actual (raíz monorepo):"
ls -la

echo "Verificando lockfile..."
if [ -f "pnpm-lock.yaml" ]; then
    echo "pnpm-lock.yaml encontrado"
    head -n 10 pnpm-lock.yaml
else
    echo "WARNING: pnpm-lock.yaml no encontrado!"
fi

echo "Ejecutando install command desde la raíz del monorepo..."
pnpm install --frozen-lockfile

echo "Ejecutando build de Astro para quranexpo-web usando pnpm --filter..."
pnpm --filter @quran-monorepo/quranexpo-web run build

echo ">>> build.sh para quranexpo-web COMPLETADO <<<"
```

## Implementation Steps

1. **Switch to Code mode** to modify `apps/quranexpo-web/build.sh`
2. **Replace the entire content** with the script above
3. **Commit the change**:
   ```bash
   git add apps/quranexpo-web/build.sh
   git commit -m "fix: add Corepack to ensure pnpm@9.1.4 in build.sh"
   git push origin main
   ```
4. **Deploy in Vercel** with "Deploy without cache"
5. **Monitor logs** for:
   - Successful pnpm version activation
   - Successful dependency installation
   - Successful Astro build

## Alternative Solutions if Option B Fails

### Option C: Regenerate lockfile with correct pnpm version
1. Locally, ensure you have pnpm@9.1.4:
   ```bash
   corepack prepare pnpm@9.1.4 --activate
   ```
2. Delete the current lockfile:
   ```bash
   rm pnpm-lock.yaml
   ```
3. Regenerate with correct version:
   ```bash
   pnpm install
   ```
4. Commit and push the new lockfile

### Option D: Use Vercel's native monorepo support
Instead of custom build.sh, configure in vercel.json:
```json
{
  "buildCommand": "cd ../.. && pnpm install && pnpm --filter @quran-monorepo/quranexpo-web run build",
  "outputDirectory": "dist"
}
```

### Option E: Temporary npm fallback
If pnpm continues to fail, temporarily switch to npm:
1. Create `apps/quranexpo-web/package-lock.json`
2. Modify build.sh to use `npm install` and `npm run build`
3. This is a temporary workaround until pnpm issues are resolved

## Success Indicators
- No "Ignoring not compatible lockfile" warnings
- No HTTP request errors (ERR_INVALID_THIS)
- Successful dependency installation
- Successful Astro build
- Deployment completes without errors