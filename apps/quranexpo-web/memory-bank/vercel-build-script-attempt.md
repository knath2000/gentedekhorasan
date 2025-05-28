# Intento de Solución: `vercel.json` con Script `build.sh` Dedicado

   ## Problema Persistente:
   El build de `quranexpo-web` en Vercel sigue completándose en ~7-8ms, resultando en un 404. Los `buildCommand` especificados en `vercel.json` no parecen ejecutarse correctamente.

   ## Estrategia:
   Crear un script `build.sh` dentro de `apps/quranexpo-web/` que se encargue explícitamente de ejecutar el build de Astro. Modificar `vercel.json` para que use este script como el punto de entrada para el build de `quranexpo-web`. Esto da un control más directo y aísla el proceso de build.

   ### Paso 1: Crear `apps/quranexpo-web/build.sh`
   Contenido:
   ```bash
   #!/bin/bash
   set -e # Salir inmediatamente si un comando falla

   echo ">>> INICIANDO build.sh para quranexpo-web <<<"

   # Navegar a la raíz del monorepo para asegurar que pnpm --filter funcione correctamente
   # Vercel clona el repo en /vercel/path0
   # El script se encuentra en /vercel/path0/apps/quranexpo-web/build.sh
   # Necesitamos subir dos niveles para estar en la raíz del monorepo.
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

   ### Paso 2: Modificar `vercel.json` (en la raíz del monorepo)
   ```json
   {
     "version": 2,
     // "installCommand" global se puede omitir si el build.sh lo maneja,
     // o mantenerlo como pnpm install --frozen-lockfile para el setup inicial.
     // Por ahora, lo comentaremos para dejar que el build.sh maneje su propia instalación si es necesario,
     // o asumimos que el Install Command del Dashboard se ejecuta primero.
     // Mejor aún, lo dejamos explícito en el build.sh para asegurar el contexto.
     // "installCommand": "pnpm install --frozen-lockfile", // Opcional aquí si el build.sh instala

     "builds": [
       {
         "src": "apps/quranexpo-web/build.sh", // Apunta al nuevo script de build
         "use": "@vercel/static-build",       // Sigue usando static-build
         "config": {
           // "buildCommand" ya no es necesario aquí, porque el "src" es un script ejecutable.
           // Vercel ejecutará el script apuntado por "src".
           // El script build.sh ahora contiene la lógica de build.
           "distDir": "apps/quranexpo-web/dist" // Vercel buscará el output aquí después de que build.sh termine.
                                                 // Esta ruta es relativa a la raíz del monorepo.
         }
       }
     ],
     "rewrites": [
       { "source": "/(.*)", "destination": "/apps/quranexpo-web/dist/$1" }
     ]
   }
   ```

   ### Explicación de los Cambios:
   -   **`apps/quranexpo-web/build.sh`**:
       -   Este script ahora es el responsable único del build de `quranexpo-web`.
       -   Navega explícitamente a la raíz del monorepo (`cd ../..`) para asegurar que `pnpm --filter` funcione correctamente desde el contexto esperado por pnpm workspaces y Turborepo.
       -   Ejecuta `pnpm install --frozen-lockfile` para asegurar que las dependencias estén actualizadas en el contexto de este build.
       -   Luego ejecuta `pnpm --filter @quran-monorepo/quranexpo-web run build`.
       -   Los `echo` ayudarán a depurar en los logs de Vercel.
   -   **`vercel.json`**:
       -   `"src": "apps/quranexpo-web/build.sh"`: Ahora le decimos a Vercel que el "origen" de este build es el script `build.sh`. Vercel ejecutará este script.
       -   `"use": "@vercel/static-build"`: Seguimos usando este builder porque esperamos que `build.sh` genere archivos estáticos en `distDir`.
       -   `"config": { "distDir": "apps/quranexpo-web/dist" }`: `buildCommand` se elimina de aquí porque Vercel ejecutará el script `src`. `distDir` sigue siendo crucial para que Vercel sepa dónde encontrar los artefactos generados por `build.sh`.
       -   El `installCommand` global en `vercel.json` (o en el Dashboard) se ejecutaría antes, pero tener uno en `build.sh` asegura que las dependencias correctas estén listas para ese build específico.

   ### Configuración del Vercel Dashboard:
   -   **Root Directory**: Dejar **VACÍO**.
   -   **Framework Preset**: `Other`.
   -   **Build Command**: **BORRAR/DEJAR VACÍO**.
   -   **Output Directory**: **BORRAR/DEJAR VACÍO**.
   -   **Install Command**: `pnpm install --frozen-lockfile` (Este se ejecutará primero desde la raíz. El `build.sh` también puede ejecutarlo para mayor seguridad o si el global falla en el contexto correcto).
   -   **"Ignored Build Step"**: `Automatic`.

   ## Pasos de Implementación:
   1.  **Crear el archivo `apps/quranexpo-web/build.sh`** con el contenido especificado. (Se necesitará Code mode).
   2.  **Hacerlo ejecutable**: `chmod +x apps/quranexpo-web/build.sh`. (El usuario deberá hacerlo localmente y hacer commit).
   3.  **Modificar el archivo `vercel.json`** en la raíz del monorepo con el nuevo contenido. (Se necesitará Code mode).
   4.  **Asegurar que la Configuración del Proyecto en Vercel Dashboard esté "limpia"** como se detalló.
   5.  **Realizar un nuevo deployment** en Vercel.
   6.  **Analizar los logs de Vercel** con mucha atención a los `echo` del `build.sh` y el tiempo total de build.

   ## Estado:
   -   🔴 **FALLO CRÍTICO EXTREMO** (build de ~8ms, 404). Los `buildCommand` en `vercel.json` no se ejecutan.
   -   🟡 Hipótesis: Vercel no interpreta/ejecuta los `buildCommand` como se espera en este monorepo.
   -   ⏳ Proponiendo un script `build.sh` dedicado y actualizando `vercel.json` para ejecutarlo.