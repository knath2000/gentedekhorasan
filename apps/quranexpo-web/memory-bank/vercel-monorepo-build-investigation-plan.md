# Plan de Investigación y Solución: Vercel Monorepo Build (Astro + pnpm + Turbo)

## Problema Actual:
El deploy de `quranexpo-web` en Vercel "tiene éxito" (logs muestran 8ms de build) pero la página muestra un 404. Esto indica que el comando `astro build` no se está ejecutando correctamente, y Vercel no encuentra los archivos estáticos.

La configuración actual de `vercel.json` es:
```json
// vercel.json (en la raíz del monorepo)
{
  "version": 2,
  "builds": [
    {
      "src": "apps/quranexpo-web/package.json",
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "pnpm turbo run build --filter=@quran-monorepo/quranexpo-web",
        "distDir": "apps/quranexpo-web/dist"
      }
    }
  ]
}
```
Configuración del Dashboard de Vercel:
- Root Directory: (vacío)
- Framework Preset: `Other`
- Build Command: (vacío)
- Output Directory: (vacío)
- Install Command: `pnpm install`

## Resultados de la Investigación Inicial (Perplexity MCP):
La investigación sugiere varios culpables comunes:
1.  **Comando de Build es No-Op**: El `buildCommand` no se ejecuta correctamente o Turborepo lo omite (posiblemente por caché).
2.  **`distDir` Incorrecto**: Vercel no encuentra el output donde se espera.
3.  **Problemas con pnpm Workspaces**: Dependencias no disponibles correctamente en el entorno de build.
4.  **Astro Output/`.gitignore`**: El directorio `dist` podría estar ignorado o no generarse.

## Plan de Acción Detallado:

### Fase 1: Verificación Local y del `package.json`
1.  **Verificar el script `build` en `apps/quranexpo-web/package.json`**:
    *   Asegurarse de que el script `build` en `apps/quranexpo-web/package.json` sea simplemente `astro build` (o el comando correcto para construir el proyecto Astro).
    *   **Acción Roo:** Leer `apps/quranexpo-web/package.json` para confirmar el script de build.
2.  **Ejecutar el `buildCommand` Localmente (Desde la Raíz del Monorepo)**:
    *   Ejecutar `pnpm turbo run build --filter=@quran-monorepo/quranexpo-web` desde la raíz (`/Users/kalyannath/quranexpo2`).
    *   Verificar que se cree el directorio `apps/quranexpo-web/dist` y contenga los archivos HTML, CSS, JS esperados.
    *   **Acción Roo:** Pedir al usuario que ejecute este comando y reporte los resultados y la existencia/contenido del directorio `dist`.
3.  **Ejecutar el `buildCommand` Localmente con `--force`**:
    *   Ejecutar `pnpm turbo run build --filter=@quran-monorepo/quranexpo-web --force` desde la raíz. Esto ignora el caché de Turborepo.
    *   Comparar el output con el paso anterior.
    *   **Acción Roo:** Si el paso anterior no produjo output, pedir al usuario que ejecute este comando.

### Fase 2: Refinar `vercel.json` Basado en Hallazgos

**Escenario A: El build local funciona, pero Vercel no.**
   Esto sugiere un problema con cómo Vercel interpreta/ejecuta el comando o maneja el output.

   **Posible Modificación en `vercel.json` (Opción 1 - Forzar build sin caché de Turbo):**
   ```json
   // vercel.json
   {
     "version": 2,
     "builds": [
       {
         "src": "apps/quranexpo-web/package.json",
         "use": "@vercel/static-build",
         "config": {
           // Añadir --force para el build en Vercel
           "buildCommand": "pnpm turbo run build --filter=@quran-monorepo/quranexpo-web --force",
           "distDir": "apps/quranexpo-web/dist"
         }
       }
     ]
   }
   ```
   *   **Acción Roo:** Si el build local con `--force` funcionó pero el normal no, proponer esta modificación a `vercel.json`.

   **Posible Modificación en `vercel.json` (Opción 2 - Ser más explícito con pnpm y el workspace):**
   A veces, Vercel y pnpm necesitan directivas más específicas.
   ```json
   // vercel.json
   {
     "version": 2,
     "builds": [
       {
         "src": "apps/quranexpo-web/package.json",
         "use": "@vercel/static-build",
         "config": {
           // Comando más explícito, asumiendo que el script 'build' está en el package.json de quranexpo-web
           "buildCommand": "pnpm --filter @quran-monorepo/quranexpo-web run build",
           "distDir": "apps/quranexpo-web/dist"
         }
       }
     ]
     // Asegurarse de que pnpm install se ejecute globalmente
     // "installCommand": "pnpm install --frozen-lockfile" // o simplemente "pnpm install"
   }
   ```
   *   **Acción Roo:** Si la Opción 1 no funciona, o si hay dudas sobre cómo Turbo interactúa, proponer esta. Esta es una forma más directa de decirle a pnpm que ejecute el script de un workspace específico.

**Escenario B: El build local NO funciona o no produce el output esperado.**
   Esto indica un problema en la configuración de Astro, el `package.json` de `quranexpo-web`, o las dependencias del workspace.
   *   **Acción Roo:**
        1. Analizar el `astro.config.mjs` de `apps/quranexpo-web` para verificar la configuración de `outDir` o cualquier otra configuración relevante para el build. (Leer `apps/quranexpo-web/astro.config.mjs`).
        2. Revisar el `package.json` de `apps/quranexpo-web` por dependencias faltantes o scripts incorrectos.
        3. Pedir al usuario que investigue los errores del build local.

### Fase 3: Consideraciones Adicionales
1.  **Verificar `.gitignore` Global y Local**: Asegurarse de que `apps/quranexpo-web/dist` no esté en `.gitignore` de forma que Vercel no pueda acceder a él (aunque `@vercel/static-build` debería construirlo en el servidor).
    *   **Acción Roo:** Leer el `.gitignore` raíz y si existe uno en `apps/quranexpo-web/`.
2.  **Dependencias del Workspace (`pnpm-workspace.yaml`)**: Asegurarse de que `apps/quranexpo-web` esté correctamente listado en `pnpm-workspace.yaml`.
    *   **Acción Roo:** Leer `pnpm-workspace.yaml` (si existe, usualmente está en la raíz). Si no existe, pnpm lo infiere de la estructura de `packages/*` o `apps/*`. El `package.json` raíz actual usa `"workspaces": ["apps/*", "packages/*"]`, lo cual es correcto.
3.  **Output del `installCommand` en Vercel**: Revisar los logs de Vercel para el `Install Command`. ¿Se completa `pnpm install` correctamente sin errores? ¿Menciona los workspaces? (El log actual muestra que pnpm instala desde la raíz: `Scope: all 4 workspace projects`, lo cual parece correcto).

## Plan de Comunicación con el Usuario:
1.  Explicar la sospecha (el build de Astro no se ejecuta).
2.  Solicitar la ejecución de los comandos de build local (pasos 1.2 y 1.3 de la Fase 1) y el contenido del script `build` del `package.json` de `quranexpo-web`.
3.  Basado en los resultados, proponer la modificación más adecuada a `vercel.json` (de la Fase 2) y/o investigar más a fondo (Fase 2 Escenario B).
4.  Si es necesario, pedir revisar `.gitignore`.

Este enfoque metódico nos ayudará a aislar si el problema está en la ejecución del build en sí, en la configuración de Vercel para encontrar el output, o en la interacción de Turborepo/pnpm con el entorno de build de Vercel.