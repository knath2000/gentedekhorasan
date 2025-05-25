# Plan de Resolución: Problema de `pnpm-lock.yaml` en Vercel

## Problema Actual:
El script `build.sh` ahora se ejecuta en Vercel, pero falla durante `pnpm install --frozen-lockfile` con los errores:
-   `WARN Ignoring not compatible lockfile at /vercel/path1/pnpm-lock.yaml`
-   `ERROR Headless installation requires a pnpm-lock.yaml file`

Esto indica que pnpm en Vercel no considera el `pnpm-lock.yaml` del repositorio como válido o compatible.

## Causas Probables:
1.  **Inconsistencia de Versión de pnpm:** La versión de pnpm usada por Vercel podría diferir de la usada para generar/actualizar el `pnpm-lock.yaml` localmente.
2.  **`pnpm-lock.yaml` desactualizado o con formato incorrecto** para la versión de pnpm en Vercel.
3.  **Interferencia del Caché de Build de Vercel.**

## Plan de Acción:

### Paso 1: Asegurar Consistencia de la Versión de pnpm
   - **Objetivo:** Indicar a Vercel explícitamente qué versión de pnpm usar, coincidiendo con el entorno de desarrollo local.
   - **Acción Usuario:**
        1.  Verificar la versión de pnpm local: `pnpm --version` (anotar esta versión, ej. `9.1.4`).
        2.  En el `package.json` **raíz** del monorepo (`/Users/kalyannath/quranexpo2/package.json`), añadir o actualizar el campo `packageManager`.
            ```json
            // package.json (raíz)
            {
              "name": "quran-monorepo",
              // ... otras propiedades ...
              "packageManager": "pnpm@<TU_VERSION_DE_PNPM_LOCAL>" // Reemplazar con la versión real
              // ...
            }
            ```
            Esto instruye a Vercel y a otros entornos sobre qué versión de pnpm utilizar.

### Paso 2: Regenerar `pnpm-lock.yaml` Localmente
   - **Objetivo:** Crear un `pnpm-lock.yaml` limpio y consistente con la versión de pnpm definida.
   - **Acción Usuario:**
        1.  Desde la raíz del monorepo (`/Users/kalyannath/quranexpo2`):
        2.  Eliminar `node_modules` y `pnpm-lock.yaml`:
            ```bash
            rm -rf node_modules
            rm pnpm-lock.yaml
            ```
        3.  Ejecutar `pnpm install`. Esto usará la versión de pnpm especificada en `packageManager` (o la global si `packageManager` no está) y regenerará `pnpm-lock.yaml`.

### Paso 3: Hacer Commit y Push de los Cambios
   - **Objetivo:** Enviar el `package.json` actualizado y el `pnpm-lock.yaml` regenerado al repositorio remoto.
   - **Acción Usuario:**
        1.  Desde la raíz del monorepo:
            ```bash
            git add package.json pnpm-lock.yaml
            git commit -m "Fix: Enforce pnpm version and regenerate lockfile"
            git push
            ```

### Paso 4: Nuevo Deployment en Vercel (CRÍTICO: Sin Caché)
   - **Objetivo:** Realizar un build limpio en Vercel para evitar interferencias de cachés anteriores.
   - **Acción Usuario:**
        1.  Ir al Dashboard de Vercel para el proyecto.
        2.  Iniciar un nuevo deployment.
        3.  **MUY IMPORTANTE:** Buscar y seleccionar la opción para **"Redeploy without Build Cache"** o **"Deploy without cache"**. El texto exacto puede variar, pero es esencial para este paso.
        4.  Observar los logs del deployment.

### Paso 5: Ajustar Configuración de pnpm en Vercel Dashboard (Si es Necesario)
   - **Objetivo:** Si Vercel no respeta automáticamente el `packageManager` del `package.json`.
   - **Acción Usuario (si el Paso 4 falla con el mismo error de lockfile):**
        1.  En Vercel Dashboard -> Tu Proyecto -> Settings -> General.
        2.  Buscar la sección "Package Manager".
        3.  Asegurarse de que "pnpm" esté seleccionado.
        4.  Si hay un campo para especificar la versión de pnpm, intentar configurarlo a la misma versión que tienes localmente y especificada en `packageManager`.

## Qué Esperar:
-   Con la versión de pnpm alineada y un `pnpm-lock.yaml` fresco, el warning sobre "Ignoring not compatible lockfile" debería desaparecer.
-   El comando `pnpm install --frozen-lockfile` dentro de `build.sh` debería ejecutarse correctamente.
-   El build de Astro debería proceder.

## Si el Problema Persiste:
-   Revisar los logs de Vercel para cualquier pista sobre la versión de pnpm que realmente está usando.
-   Considerar si hay alguna variable de entorno en Vercel que pueda estar afectando a pnpm.
-   Simplificar temporalmente el `installCommand` en `build.sh` a solo `pnpm install` (sin `--frozen-lockfile`) para ver si eso permite que la instalación continúe, aunque esto no es ideal para la reproducibilidad.

## Estado:
-   ✅ **PROGRESO:** El script `build.sh` ahora se ejecuta en Vercel.
-   🔴 **NUEVO PROBLEMA:** `pnpm install --frozen-lockfile` falla debido a un `pnpm-lock.yaml` no compatible.
-   ⏳ Proponiendo alinear versiones de pnpm, regenerar `pnpm-lock.yaml`, y desplegar sin caché.