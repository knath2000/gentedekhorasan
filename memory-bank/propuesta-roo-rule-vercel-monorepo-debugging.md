---
description: Sugerencia de contenido para una nueva .roo/rule enfocada en el debugging de deployments de monorepos pnpm en Vercel.
author: Roo Architect AI
version: 1.0
tags: ["vercel", "pnpm", "monorepo", "deployment", "debugging", "roorules-suggestion"]
globs: ["vercel.json", "pnpm-lock.yaml", "turbo.json", "apps/**/build.sh"]
---

# Propuesta de Nueva `.roo/rule`: `vercel-monorepo-pnpm-debugging.md`

**Objetivo:** Proporcionar una guía y lista de verificación para diagnosticar y resolver problemas comunes de deployment de monorepos pnpm en Vercel, basada en la experiencia reciente.

## 1. Verificación Inicial del Build en Vercel

*   **Síntoma Común:** El build se completa demasiado rápido (ej. < 10-30 segundos para un proyecto con dependencias) y la aplicación desplegada muestra un 404 o no funciona.
*   **Diagnóstico:** El `buildCommand` (de `vercel.json` o Dashboard) o el script de build (`build.sh` referenciado en `vercel.json`) **NO se está ejecutando**.
*   **Pasos de Verificación:**
    1.  **`vercel.json` vs. Dashboard Settings:**
        *   Asegurar que el "Root Directory" en el Dashboard de Vercel esté **VACÍO** si `vercel.json` está en la raíz del monorepo.
        *   Asegurar que "Framework Preset" sea `Other`.
        *   Los campos "Build Command", "Output Directory", "Install Command" en el Dashboard deben estar **VACÍOS** si se controlan desde `vercel.json` o un `build.sh`.
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

## 2. Problemas con `pnpm-lock.yaml` y `pnpm install`

*   **Síntoma Común:** El `build.sh` (o `buildCommand`) se ejecuta, pero falla durante `pnpm install` (usualmente `pnpm install --frozen-lockfile`).
*   **Errores Típicos:**
    *   `WARN Ignoring not compatible lockfile at /vercel/pathX/pnpm-lock.yaml`
    *   `ERROR Headless installation requires a pnpm-lock.yaml file`
*   **Diagnóstico:** El `pnpm-lock.yaml` en el repositorio es incompatible con el entorno/versión de pnpm en Vercel.
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
        *   En Vercel Dashboard -> Settings -> General -> "Node.js Version", seleccionar la misma versión (ej. "20.x").
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

## 3. Configuración de `vercel.json` para Monorepos pnpm

*   **Recomendación General para un Proyecto Astro (`quranexpo-web`) en Monorepo:**
    ```json
    {
      "version": 2,
      // Opcional: installCommand global si build.sh no lo maneja o para setup inicial
      "installCommand": "pnpm install --frozen-lockfile",
      "builds": [
        {
          // Apuntar "src" al script de build del proyecto específico
          "src": "apps/quranexpo-web/build.sh",
          "use": "@vercel/static-build", // Usar para apps que generan output estático
          "config": {
            // "buildCommand" no es necesario aquí si "src" es un script ejecutable
            // distDir es relativo a la raíz del monorepo
            "distDir": "apps/quranexpo-web/dist"
          }
        }
        // ... otras configuraciones de build para otros apps si es necesario ...
      ],
      "rewrites": [
        // Ejemplo para una Single Page Application (SPA) o un sitio Astro
        { "source": "/(.*)", "destination": "/apps/quranexpo-web/dist/$1" }
        // Podría ser más específico si /apps/quranexpo-web/dist/index.html es el entrypoint:
        // { "source": "/(.*)", "destination": "/apps/quranexpo-web/dist/index.html" }
        // O si Astro maneja el enrutamiento en el servidor de preview (menos común para static-build)
      ]
    }
    ```

## 4. Último Recurso
*   Si después de todos estos pasos el problema persiste, recopilar todos los logs, configuraciones de `vercel.json`, `build.sh`, `package.json`, `pnpm-lock.yaml`, y contactar al **Soporte de Vercel**. Puede haber un problema específico de la plataforma o una configuración no documentada necesaria.