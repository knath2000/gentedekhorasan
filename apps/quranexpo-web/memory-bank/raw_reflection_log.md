---
Date: 2025-05-24
TaskRef: "Cambiar el título de la tarjeta de sura a transliteración inglesa"

Learnings:
- La modificación de la visualización de datos en un componente requiere verificar la interfaz de datos (`Surah` en `quran.ts`) para asegurar que el campo deseado (`transliterationName`) esté disponible.
- La actualización de la documentación del banco de memoria es crucial para reflejar los cambios en la UI y la experiencia del usuario.

:start_line:9
-------
Difficulties:
- Se encontró que la API `get-metadata?type=surah-list` no devuelve el campo `tname` (nombre transliterado), lo que causó que la transliteración no se mostrara. Se resolvió añadiendo un fallback a `item.ename` en `apiClient.ts`.

Successes:
- Se modificó con éxito `src/components/SurahCard.tsx` para mostrar el nombre de la sura en transliteración inglesa como título y el nombre en inglés simple como subtítulo.
- Los archivos relevantes del banco de memoria se actualizaron para reflejar este cambio.

:start_line:16
-------
Improvements_Identified_For_Consolidation:
- Proceso: Verificar siempre la interfaz de datos y la respuesta real de la API antes de asumir la disponibilidad de un campo.
- API: Manejo de campos de API faltantes con fallbacks.
---
Date: 2025-05-24
TaskRef: "Error de despliegue en Vercel: 'pipeline' vs 'tasks' en Turborepo"

Learnings:
- Turborepo en versiones recientes requiere el campo `"tasks"` en lugar de `"pipeline"` en `turbo.json` para definir las configuraciones de las tareas de build.
- El error de Vercel `Found 'pipeline' field instead of 'tasks'` indica una incompatibilidad de sintaxis con la versión de Turborepo utilizada en el entorno de build de Vercel.

Difficulties:
- El despliegue inicial en Vercel falló debido a un error de configuración de Turborepo, lo que impidió que el comando `npm run build` se ejecutara correctamente.

Successes:
- Se identificó y corrigió la sintaxis de `turbo.json` cambiando `"pipeline"` a `"tasks"`.

Improvements_Identified_For_Consolidation:
- Patrón: Sintaxis de configuración de Turborepo (`tasks` vs `pipeline`).
---
