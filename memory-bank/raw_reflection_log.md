---
Date: 2025-05-26
TaskRef: "Depuración de despliegue de monorepo Vercel y funciones de API"

Learnings:
- El error `Function Runtimes must have a valid version` en Vercel para funciones de Node.js en un monorepo no siempre significa que el `runtime` en `vercel.json` esté mal. A menudo, significa que Vercel no está leyendo la configuración de `functions` del `vercel.json` anidado en un subdirectorio.
- Para que las Vercel Functions en un subdirectorio de un monorepo (`apps/quran-data-api/api/`) sean desplegadas correctamente, la configuración de `functions` y `routes` debe estar en el `vercel.json` de la **raíz del monorepo**.
- Es crucial que el `tsconfig.json` de la API (`apps/quran-data-api/api/tsconfig.json`) esté configurado para emitir archivos JavaScript (`"noEmit": false`) y que el `outDir` apunte a un directorio de salida (ej. `"dist"`).
- El script `build` en el `package.json` de la aplicación de la API (`apps/quran-data-api/package.json`) debe ejecutar explícitamente la compilación de TypeScript (`tsc -p api/tsconfig.json`).
- Las rutas en la sección `functions` y `routes` del `vercel.json` de la raíz deben apuntar a los archivos JavaScript compilados dentro del directorio `dist` del subdirectorio de la aplicación (ej. `"apps/quran-data-api/dist/api/v1/get-metadata.js"`).
- El `vercel.json` anidado en el subdirectorio de la API (`apps/quran-data-api/vercel.json`) debe ser mínimo, conteniendo solo `{"version": 2}`.
- La advertencia de Turborepo `WARNING no output files found for task @quran-monorepo/quran-data-api#build` es un fuerte indicador de que el script de build no está produciendo los artefactos esperados para el despliegue de funciones.

Difficulties:
- Persistencia del error `Function Runtimes must have a valid version` a pesar de las correcciones iniciales en el `vercel.json` anidado, lo que llevó a la hipótesis de que el archivo no estaba siendo reconocido.
- La depuración de problemas de despliegue en monorepos de Vercel es compleja debido a la interacción entre Vercel CLI, Turborepo y las configuraciones de proyectos anidados.

Successes:
- Se logró resolver el problema de despliegue de las funciones de la API (`quran-data-api`), permitiendo que la aplicación web (`quranexpo-web`) cargue los datos correctamente.
- Se confirmó que el endpoint de prueba (`/test/v1/ping`) ahora funciona.
- Se documentó una solución integral para futuros problemas similares en `memory-bank/propuesta-roo-rule-vercel-monorepo-debugging.md`.

Improvements_Identified_For_Consolidation:
- Patrón de configuración de Vercel Functions en monorepos.
- Estrategias de depuración para errores de despliegue en Vercel.
---