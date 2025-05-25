# Solución: Configuración Dashboard Vercel para quranexpo-web

## Problema Identificado
- Vercel detecta automáticamente TurboRepo y ejecuta `turbo build` ignorando nuestro `vercel.json`
- Los logs muestran que Turbo solo construye 2 de 3 proyectos (omite quranexpo-web)
- Error: "No Output Directory named 'dist' found"

## Configuración Requerida en Dashboard Vercel

### Settings → General → Build & Development Settings

**Root Directory:** (dejar vacío o no especificar)
- Vercel usará la raíz del repositorio automáticamente
- Esto da acceso a `turbo.json` y `pnpm-workspace.yaml`

**Build Command:** `turbo run build:web --filter=quranexpo-web`
- Usa la tarea específica `build:web` definida en turbo.json
- Filtra por nombre de directorio (no package name)
- Evita construcción innecesaria de otros proyectos

**Output Directory:** `apps/quranexpo-web/dist`
- Ruta relativa desde raíz del monorepo al directorio de salida de Astro

**Install Command:** `pnpm install`
- Comando estándar para monorepo con pnpm

### Configuración Node.js
**Node.js Version:** `18.x`

## Explicación Técnica

### ¿Por qué Root Directory vacío?
- Vercel usa automáticamente la raíz del repositorio
- TurboRepo necesita acceso a archivos de configuración en la raíz
- `turbo.json` define las tareas de build
- `pnpm-workspace.yaml` define la estructura del monorepo

### ¿Por qué usar --filter y build:web?
- Error original: TurboRepo no encontraba `@quran-monorepo/quranexpo-web` como package name
- Solución: Usar nombre de directorio `quranexpo-web` en lugar del package name
- `build:web` es una tarea específica definida en turbo.json
- El filtro garantiza que solo se construya el proyecto específico
- Reduce tiempo de build y recursos

### Resultado Esperado
1. Vercel usa configuración manual (no autodetección)
2. TurboRepo construye solo quranexpo-web
3. Archivos estáticos se generan en `apps/quranexpo-web/dist`
4. Vercel encuentra el output directory correctamente

## Estado
- ✅ Problema diagnosticado
- ⏳ Configuración pendiente en Dashboard Vercel
- ⏳ Prueba de deployment pendiente