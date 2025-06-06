# Deployment Fixes Implementation Guide

## Overview
This guide provides step-by-step instructions to fix the deployment asdissues for both `quran-data-api` and `quranexpo-web`.

## 🔧 Fix 1: quran-data-api Deployment

### Status: Ready for Deployment
The `.vercelignore` file has already been created at `apps/quran-data-api/.vercelignore`.

### Action Steps:
1. **Trigger Redeployment in Vercel:**
   - Go to Vercel Dashboard → quran-data-api project
   - Click "Redeploy" or push any commit to trigger deployment
   - Select "Deploy without cache" if available

2. **Monitor Deployment:**
   - Watch for any Prisma-related errors
   - Verify the deployment completes successfully
   - Test API endpoints once deployed

3. **Verification:**
   ```bash
   # Test the API endpoint (replace with your actual domain)
   curl https://your-api-domain.vercel.app/api/v1/health
   ```

## 🔧 Fix 2: quranexpo-web Deployment - Option A

### Required Change: Modify build.sh
**File:** `apps/quranexpo-web/build.sh`
**Line:** 15
**Change:** Remove `--frozen-lockfile` flag from pnpm install

### Current Code (Line 15):
```bash
pnpm install --frozen-lockfile
```

### Change To:
```bash
pnpm install
```

### Complete Updated build.sh:
```bash
#!/bin/bash
set -e # Salir inmediatamente si un comando falla

echo ">>> INICIANDO build.sh para quranexpo-web <<<"

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

### Deployment Steps After Change:
1. Make the change to `build.sh`
2. Commit with message: `fix: remove --frozen-lockfile flag from quranexpo-web build`
3. Push to repository
4. In Vercel Dashboard → quranexpo-web project:
   - Click "Redeploy" 
   - **Important:** Select "Deploy without cache"
5. Monitor deployment logs

## 🔧 Fix 3: quranexpo-web Deployment - Option B (If Option A Fails)

### Required Change: Add Corepack to build.sh
**File:** `apps/quranexpo-web/build.sh`

### Add After Line 3:
```bash
PNPM_VERSION="9.1.4"
```

### Add After Line 4 (before first echo):
```bash
echo "Asegurando pnpm version $PNPM_VERSION con Corepack..."
corepack enable
corepack prepare pnpm@$PNPM_VERSION --activate
echo "Versión de pnpm activa: $(pnpm --version)"
```

### Complete Updated build.sh for Option B:
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

echo "Ejecutando install command desde la raíz del monorepo..."
pnpm install --frozen-lockfile

echo "Ejecutando build de Astro para quranexpo-web usando pnpm --filter..."
pnpm --filter @quran-monorepo/quranexpo-web run build

echo ">>> build.sh para quranexpo-web COMPLETADO <<<"
```

## 📋 Deployment Checklist

### For quran-data-api:
- [ ] Verify `.vercelignore` exists at `apps/quran-data-api/.vercelignore`
- [ ] Trigger redeployment in Vercel
- [ ] Monitor deployment logs
- [ ] Test API endpoints after deployment
- [ ] Update status in memory bank

### For quranexpo-web:
- [ ] Apply Option A changes to `build.sh`
- [ ] Commit and push changes
- [ ] Deploy with "Deploy without cache" in Vercel
- [ ] Monitor deployment logs
- [ ] If Option A fails, apply Option B
- [ ] Test web application after deployment
- [ ] Update status in memory bank

## 🚨 Important Notes

1. **Always use "Deploy without cache"** when testing these fixes
2. **Monitor logs carefully** for any new errors
3. **Test thoroughly** after each successful deployment
4. **Document any new issues** that arise

## 📊 Success Criteria

### quran-data-api:
- Deployment completes without Prisma file conflicts
- API endpoints respond correctly
- Database connections work properly

### quranexpo-web:
- Deployment completes without pnpm lockfile errors
- Astro build succeeds
- Web application loads correctly
- Can connect to quran-data-api

## 🔄 Next Steps After Fixes

1. Update `memory-bank/activeContext.md` with deployment status
2. Update `memory-bank/progress.md` with completed fixes
3. Test integration between all applications
4. Plan next phase of improvements