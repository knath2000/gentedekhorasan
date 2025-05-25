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
pnpm install --frozen-lockfile

echo "Ejecutando build de Astro para quranexpo-web usando pnpm --filter..."
pnpm --filter @quran-monorepo/quranexpo-web run build

echo ">>> build.sh para quranexpo-web COMPLETADO <<<"