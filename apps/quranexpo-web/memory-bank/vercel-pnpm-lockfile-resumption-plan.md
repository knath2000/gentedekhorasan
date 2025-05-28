# Plan de Reanudación: Debugging Problema `pnpm-lock.yaml` en Vercel

## Contexto al Pausar (2025-05-25):
El deployment de `quranexpo-web` en Vercel falla durante la ejecución del script `apps/quranexpo-web/build.sh`. Específicamente, el comando `pnpm install --frozen-lockfile` dentro del script genera los siguientes errores:
-   `WARN Ignoring not compatible lockfile at /vercel/path0/pnpm-lock.yaml`
-   `ERROR Headless installation requires a pnpm-lock.yaml file`

Esto ocurre a pesar de haber:
1.  Integrado `apps/quranexpo-web` como un directorio regular (eliminando el submódulo).
2.  Asegurado permisos de ejecución para `build.sh` y que esté en Git.
3.  Confirmado que `build.sh` se ejecuta en Vercel.
4.  Alineado versiones de Node.js (`engines.node`) y pnpm (`packageManager`) en `package.json` y en el Dashboard de Vercel.
5.  Regenerado `pnpm-lock.yaml` localmente.
6.  Desplegado sin caché en Vercel.

Los archivos `pnpm-workspace.yaml` y `turbo.json` parecen correctos y no indican que Turborepo esté cacheando `node_modules`.

## Próximos Pasos Planificados para la Reanudación:

**Objetivo Principal:** Resolver la incompatibilidad del `pnpm-lock.yaml` en el entorno de Vercel.

**Intento A: Modificar `build.sh` para Usar `pnpm install` (Menos Estricto)**
   - **Razón:** Para diagnosticar si el problema es la adherencia estricta al lockfile (`--frozen-lockfile`) o si `pnpm install` en general falla en Vercel.
   - **Acción:**
        1.  Modificar `apps/quranexpo-web/build.sh` para cambiar la línea `pnpm install --frozen-lockfile` por `pnpm install`.
            ```diff
            - pnpm install --frozen-lockfile
            + pnpm install
            ```
        2.  Hacer commit y push de este cambio.
        3.  Desplegar en Vercel, **asegurándose de seleccionar "Deploy without cache"**.
        4.  Analizar los logs.

**Si el Intento A falla (especialmente si el error de lockfile persiste o cambia a un error de resolución de dependencias):**

**Intento B: Forzar Versión de pnpm con Corepack en `build.sh`**
   - **Razón:** Para asegurar que Vercel utilice la versión exacta de pnpm especificada, eliminando cualquier ambigüedad de versión en el entorno de Vercel.
   - **Acción (requiere conocer la versión exacta de pnpm del usuario, ej. 9.1.4):**
        1.  Revertir el cambio del Intento A (volver a `pnpm install --frozen-lockfile` en `build.sh`).
        2.  Modificar `apps/quranexpo-web/build.sh` para añadir los comandos de Corepack ANTES de `cd ../..` y `pnpm install`.
            ```diff
            #!/bin/bash
            set -e # Salir inmediatamente si un comando falla

            + PNPM_VERSION="<REEMPLAZAR_CON_VERSION_PNPM_USUARIO>" 
            +
            echo ">>> INICIANDO build.sh para quranexpo-web (con Corepack y pnpm install --frozen-lockfile) <<<"
            + echo "Asegurando pnpm version $PNPM_VERSION con Corepack..."
            + corepack enable
            + corepack prepare pnpm@$PNPM_VERSION --activate
            + echo "Versión de pnpm activa: $(pnpm --version)"

            echo "Cambiando al directorio raíz del monorepo: $(cd ../.. && pwd)"
            cd ../..
            # ... resto del script ...
            pnpm install --frozen-lockfile
            # ... resto del script ...
            ```
        3.  Hacer commit y push de este cambio.
        4.  Desplegar en Vercel, **asegurándose de seleccionar "Deploy without cache"**.
        5.  Analizar los logs.

**Consideración Adicional Pendiente:**
-   **Número de Workspaces:** Vercel detectó "6 workspace projects". Se identificaron 4 activos (`apps/luminous-verses-expo`, `apps/quran-data-api`, `apps/quranexpo-web`, `packages/quran-types`). El directorio `apps/quranexpo-web_backup/` podría ser el quinto si tiene un `package.json`. Se desconoce el sexto.
    -   **Acción Recomendada al Reanudar:** Mover `apps/quranexpo-web_backup/` fuera del monorepo o añadirlo al `.gitignore` raíz para evitar que pnpm lo considere un workspace.

**Si Ninguno de los Intentos Anteriores Funciona:**
-   Revisar la documentación de Vercel para cualquier configuración específica de pnpm v8/v9 (la que esté usando el usuario) o problemas conocidos con la invalidación de `pnpm-lock.yaml`.
-   Considerar contactar al soporte de Vercel con un resumen detallado de todos los pasos y logs.

## Estado al Pausar:
-   🔴 **FALLO PERSISTENTE:** `pnpm install --frozen-lockfile` en `build.sh` falla en Vercel debido a "lockfile no compatible".
-   🟡 Pendiente de ejecutar los Intento A y B.
-   🟡 Pendiente de clarificar y potencialmente limpiar el número de workspaces detectados (revisar `apps/quranexpo-web_backup/`).