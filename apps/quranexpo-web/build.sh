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