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

# Copiar dist a la raíz como Vercel espera
echo "Copiando dist a la raíz para Vercel..."
cp -r apps/quranexpo-web/dist ./dist

echo ">>> build.sh COMPLETADO <<<"