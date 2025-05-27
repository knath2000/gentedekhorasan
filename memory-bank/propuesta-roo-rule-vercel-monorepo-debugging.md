---
description: Guía y lista de verificación para diagnosticar y resolver problemas comunes de deployment de monorepos pnpm en Vercel, incluyendo la configuración de Vercel Functions.
author: Roo Architect AI
version: 1.1
tags: ["vercel", "pnpm", "monorepo", "deployment", "debugging", "roorules-suggestion", "vercel-functions"]
globs: ["vercel.json", "pnpm-lock.yaml", "turbo.json", "apps/**/build.sh", "apps/**/vercel.json", "apps/**/package.json", "apps/**/tsconfig.json"]
---

# Propuesta de Nueva `.roo/rule`: `vercel-monorepo-pnpm-debugging.md`

**Objetivo:** Proporcionar una guía y lista de verificación para diagnosticar y resolver problemas comunes de deployment de monorepos pnpm en Vercel, incluyendo la configuración de Vercel Functions.

## 1. Verificación Inicial del Build en Vercel

*   **Síntoma Común:** El build se completa demasiado rápido (ej. < 10-30 segundos para un proyecto con dependencias) y la aplicación desplegada muestra un 404 o no funciona.
*   **Diagnóstico:** El `buildCommand` (de `vercel.json` o Dashboard) o el script de build (`build.sh` referenciado en `vercel.json`) **NO se está ejecutando**.
*   **Pasos de Verificación:**
    1.  **Configuración de Proyecto en Vercel Dashboard (CRÍTICO para Monorepos):**
        *   **Root Directory:** Para proyectos dentro de un monorepo, configurar el "Root Directory" en el Dashboard de Vercel para apuntar directamente al subproyecto (ej. `apps/quranexpo-web`). Esto aísla el build y la instalación de dependencias.
        *   **Framework Preset:** `Other` o el framework específico (ej. `Astro`).
        *   **Build Command, Output Directory, Install Command:** Si se usa `vercel.json` en la raíz o un `build.sh` personalizado, estos campos en el Dashboard deben estar **VACÍOS**. Si no, configurarlos explícitamente para el subproyecto.
        *   **Node.js Version:** Asegurar que la versión de Node.js seleccionada en el Dashboard (ej. `22.x`) coincida con los requisitos del proyecto.
        *   "Ignored Build Step" debe estar en `Automatic`.
        *   *Nota:* Vercel mostrará un warning: `WARN! Due to builds existing in your configuration file, the Build and Development Settings defined in your Project Settings will not apply.` Esto es **ESPERADO Y CORRECTO** si usas `vercel.json` para la configuración del build.
    2.  **Script `build.sh` (si se usa):**
        *   Añadir `echo` al inicio y fin del script, y antes de comandos clave. Ejemplo:
            ```bash
            #!/bin/bash
            set -e
            echo ">>> INICIANDO build.sh para [MI_PROYECTO] <<<"
            # ... comandos ...
            echo ">>> build.sh para [MI_PROYECTO] COMPLETADO <<<"
            ```
        *   Verificar en los logs de Vercel si estos `echo` aparecen. Si no, el script no se ejecuta.
    3.  **Permisos del `build.sh` en Git:**
        *   El script DEBE tener permisos de ejecución (`+x`).
        *   Verificar localmente: `ls -l path/to/build.sh`.
        *   Asegurar que Git rastrea los permisos: `git update-index --chmod=+x path/to/build.sh`, luego `git commit` y `git push`.
    4.  **Existencia del `build.sh` en el Repositorio:**
        *   Verificar que el `build.sh` se añadió (`git add`), se hizo commit y push al repositorio. Un `git status` local o el error `fatal: pathspec '...' did not match any files` durante `git rm --cached` pueden indicar que no estaba rastreado.
    5.  **Submódulos de Git:**
        *   Si el proyecto afectado está en un directorio que es un **submódulo de Git**, esta es una causa raíz muy probable.
        *   **Síntoma:** `git add path/to/file/in/submodule` falla con `fatal: Pathspec '...' is in submodule '...'`.
        *   **Solución Recomendada:** Integrar/aplanar el submódulo en el repositorio principal. Esto implica `git submodule deinit -f ...`, `git rm -f ...`, borrar de `.git/modules/...`, copiar los archivos del proyecto al directorio, y luego `git add`/`commit`/`push` del contenido como parte del repo principal. **HACER BACKUP ANTES.**
        *   Si se mantiene como submódulo: asegurar que todos los cambios (incluyendo `build.sh` `+x`) estén commiteados y pusheados *dentro* del submódulo, y que la referencia del submódulo esté actualizada en el repo principal.

## 2. Problemas con `pnpm-lock.yaml`, `pnpm install` y `ERR_INVALID_THIS`
 
 *   **Síntoma Común:** El `build.sh` (o `buildCommand`) se ejecuta, pero falla durante `pnpm install` (usualmente `pnpm install --frozen-lockfile`) con errores de registro.
 *   **Errores Típicos:**
     *   `WARN Ignoring not compatible lockfile at /vercel/pathX/pnpm-lock.yaml`
     *   `ERROR Headless installation requires a pnpm-lock.yaml file`
     *   `WARN GET https://registry.npmjs.org/... error (ERR_INVALID_THIS)`
     *   `ERR_PNPM_META_FETCH_FAIL GET https://registry.npmjs.org/...: Value of "this" must be of type URLSearchParams`
     *   `WARN Unsupported engine: wanted: {"node":">=20.0.0 <21.0.0"} (current: {"node":"v22.15.1","pnpm":"6.35.1"})`
 *   **Diagnóstico:** El `pnpm-lock.yaml` en el repositorio es incompatible con el entorno/versión de pnpm en Vercel, o hay una incompatibilidad de Node.js/pnpm que causa fallos en las solicitudes HTTP al registro.
 *   **Pasos de Solución:**
     1.  **Consistencia de Versión de pnpm:**
         *   Verificar versión local: `pnpm --version`.
         *   En `package.json` raíz, especificar `packageManager`:
             ```json
             "packageManager": "pnpm@<TU_VERSION_PNPM>"
             ```
     2.  **Consistencia de Versión de Node.js:**
         *   Verificar versión local de Node.js (usar NVM para gestionar, ej. `nvm use 20`).
         *   En `package.json` raíz, especificar `engines.node`:
             ```json
             "engines": { "node": ">=20.0.0 <21.0.0" } // o una LTS específica
             ```
         *   En Vercel Dashboard -> Settings -> General -> "Node.js Version", seleccionar la misma versión (ej. "22.x").
     3.  **Regenerar `pnpm-lock.yaml`:**
         *   Después de asegurar las versiones de pnpm y Node.js localmente:
             ```bash
             rm -rf node_modules # Opcional pero recomendado para limpieza total
             rm pnpm-lock.yaml
             pnpm install
             ```
         *   Hacer commit y push del `package.json` (si cambió) y el nuevo `pnpm-lock.yaml`.
     4.  **Desplegar en Vercel SIN CACHÉ:**
         *   Crucial para evitar que Vercel use un estado de caché problemático.
     5.  **Verificar `pnpm-workspace.yaml`:**
         *   Asegurar que los patrones (`apps/*`, `packages/*`) sean correctos y no haya workspaces inesperados (ej. directorios de backup con `package.json`).
     6.  **(Si persiste) Modificar `build.sh` - Intento de Diagnóstico 1:**
         *   Cambiar `pnpm install --frozen-lockfile` a solo `pnpm install`. Si esto funciona, indica un problema persistente con el lockfile pero que pnpm puede resolver las dependencias. No es ideal para producción (pierde reproducibilidad).
     7.  **(Si persiste) Modificar `build.sh` - Intento de Diagnóstico 2 (Corepack):**
         *   Usar Corepack para forzar la versión de pnpm dentro del `build.sh`:
             ```bash
             PNPM_VERSION="<TU_VERSION_PNPM>" # Reemplazar
             corepack enable
             corepack prepare pnpm@$PNPM_VERSION --activate
             echo "Versión de pnpm activa: $(pnpm --version)"
             pnpm install --frozen-lockfile # Reintentar con frozen lockfile
             ```
     8.  **(Solución Final Comprobada para `quranexpo-web`): Usar `npm` en lugar de `pnpm` para el proyecto afectado.**
         *   Si los problemas de compatibilidad de pnpm/Node.js persisten, configurar el proyecto en Vercel Dashboard para usar `npm` para la instalación y el build.
         *   **Install Command:** `npm install`
         *   **Build Command:** `npm run build`
 
 ## 3. Problemas con `prisma: command not found` en Producción
 
 *   **Síntoma Común:** Durante el `pnpm install` (o `npm install`) en Vercel, un `postinstall` hook intenta ejecutar `prisma generate` pero falla con `sh: line 1: prisma: command not found`.
 *   **Diagnóstico:** `prisma` CLI está en `devDependencies` y Vercel (con `NODE_ENV=production`) salta la instalación de estas dependencias.
 *   **Pasos de Solución:**
     1.  **Aislar el Proyecto en Vercel Dashboard:**
         *   Configurar el "Root Directory" del proyecto afectado (ej. `apps/quran-data-api` o `apps/quranexpo-web`) en Vercel Dashboard.
         *   Esto asegura que Vercel solo instale las dependencias de ese subproyecto, y no intente ejecutar `postinstall` hooks de otros proyectos del monorepo en un contexto incorrecto.
     2.  **(Menos Recomendado) Mover `prisma` a `dependencies`:**
         *   Si el aislamiento no es suficiente o no es aplicable, mover `prisma` del `devDependencies` a `dependencies` en el `package.json` del proyecto que tiene el `postinstall` hook. Esto forzará su instalación en producción.
         *   *Advertencia:* Esto aumenta el tamaño del bundle y no es ideal para proyectos de API puros.
 
 ## 4. Configuración de Vercel Functions en Monorepos (Solución Comprobada para `quran-data-api`)
 
 *   **Síntoma Común:** Funciones de API en un subdirectorio de monorepo no se despliegan o enrutan correctamente (errores 404, errores de runtime como `Function Runtimes must have a valid version`).
 *   **Diagnóstico:** Vercel no está detectando o compilando correctamente los archivos TypeScript de las funciones, o no está reconociendo la configuración de `functions` en el `vercel.json` anidado.
 *   **Pasos de Solución:**
     1.  **Configurar `tsconfig.json` de la API (`apps/quran-data-api/api/tsconfig.json`):**
         *   Asegurar que `compilerOptions` incluya:
             ```json
             "target": "es2020",
             "outDir": "dist", // Compila a un directorio 'dist' dentro de la carpeta 'api'
             "noEmit": false   // Permitir la emisión de archivos JavaScript
             ```
     2.  **Modificar `package.json` de la API (`apps/quran-data-api/package.json`):**
         *   Añadir un script para compilar las funciones y asegurar que el script `build` principal lo ejecute:
             ```json
             "scripts": {
               "build:functions": "tsc -p api/tsconfig.json",
               "build": "pnpm run build:functions && prisma generate --schema=./prisma/schema.prisma",
               // ... otros scripts ...
             },
             ```
     3.  **Mover la configuración de `functions` y `routes` al `vercel.json` de la RAÍZ del monorepo (`/vercel.json`):**
         *   Este es el paso CRÍTICO para que Vercel reconozca las funciones en un monorepo.
         *   El `vercel.json` de la raíz debe contener las secciones `functions` y `routes` que apunten a los archivos compilados en el directorio `dist` de la aplicación de la API.
         *   Ejemplo de `/vercel.json`:
             ```json
             {
               "version": 2,
               "functions": {
                 "apps/quran-data-api/dist/api/v1/get-metadata.js": {
                   "runtime": "nodejs@20.x"
                 },
                 "apps/quran-data-api/dist/api/v1/get-verses.js": {
                   "runtime": "nodejs@20.x"
                 },
                 "apps/quran-data-api/dist/api/v1/get-translated-verse.js": {
                   "runtime": "nodejs@20.x"
                 },
                 "apps/quran-data-api/dist/api/test/ping.js": {
                   "runtime": "nodejs@20.x"
                 }
               },
               "routes": [
                 {
                   "src": "/api/v1/get-metadata",
                   "dest": "apps/quran-data-api/dist/api/v1/get-metadata.js",
                   "headers": {
                     "Access-Control-Allow-Origin": "*",
                     "Access-Control-Allow-Methods": "GET,OPTIONS",
                     "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Accept, Authorization"
                   }
                 },
                 {
                   "src": "/api/v1/get-verses",
                   "dest": "apps/quran-data-api/dist/api/v1/get-verses.js",
                   "headers": {
                     "Access-Control-Allow-Origin": "*",
                     "Access-Control-Allow-Methods": "GET,OPTIONS",
                     "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Accept, Authorization"
                   }
                 },
                 {
                   "src": "/api/v1/get-translated-verse",
                   "dest": "apps/quran-data-api/dist/api/v1/get-translated-verse.js",
                   "headers": {
                     "Access-Control-Allow-Origin": "*",
                     "Access-Control-Allow-Methods": "GET,OPTIONS",
                     "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Accept, Authorization"
                   }
                 },
                 {
                   "src": "/api/v1/(.*)",
                   "dest": "apps/quran-data-api/dist/api/v1/$1.js",
                   "headers": {
                     "Access-Control-Allow-Origin": "*",
                     "Access-Control-Allow-Methods": "GET,OPTIONS",
                     "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Accept, Authorization"
                   }
                 },
                 {
                   "src": "/test/v1/ping",
                   "dest": "apps/quran-data-api/dist/test/ping.js",
                   "headers": {
                     "Access-Control-Allow-Origin": "*",
                     "Access-Control-Allow-Methods": "GET,OPTIONS",
                     "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Accept, Authorization"
                   }
                 }
               ]
             }
             ```
     4.  **Dejar el `vercel.json` anidado de la API vacío (`apps/quran-data-api/vercel.json`):**
         *   Solo debe contener: `{"version": 2}`.
 
 ## 5. Último Recurso
 *   Si después de todos estos pasos el problema persiste, recopilar todos los logs, configuraciones de `vercel.json`, `build.sh`, `package.json`, `pnpm-lock.yaml`, y contactar al **Soporte de Vercel**. Puede haber un problema específico de la plataforma o una configuración no documentada necesaria.