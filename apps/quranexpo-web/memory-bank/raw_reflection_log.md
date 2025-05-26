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
Date: 2025-05-26
TaskRef: "Deployment de quranexpo-web - Problema: prisma: command not found"

Learnings:
- Vercel ejecuta `pnpm install` desde la raíz del monorepo, lo que activa el postinstall hook de `quran-data-api`.
- `NODE_ENV=production` hace que pnpm salte las `devDependencies`, donde se encuentra `prisma`.
- La solución es aislar el proyecto `quranexpo-web` en Vercel Dashboard.

Difficulties:
- El error `sh: line 1: prisma: command not found` ocurrió durante el `pnpm install` para `quranexpo-web` debido a la ejecución del postinstall de `quran-data-api` en un entorno de producción sin `prisma` instalado.

Successes:
- Se identificó la causa raíz del problema.
- Se propuso y aplicó la solución de aislamiento de proyecto en Vercel Dashboard.

Improvements_Identified_For_Consolidation:
- Patrón: Aislamiento de proyectos en Vercel para evitar conflictos de `postinstall` hooks en monorepos.
---
Date: 2025-05-26
TaskRef: "Deployment de quranexpo-web - Problema: Node.js Version 18.x"

Learnings:
- Vercel detecta Node.js 18.x por defecto o por una configuración previa, pero el proyecto requiere 22.x.
- La versión de Node.js debe ser explícitamente configurada en Vercel Dashboard.

Difficulties:
- El error `Error: Found invalid Node.js Version: "18.x". Please set Node.js Version to 22.x` bloqueó el despliegue.

Successes:
- Se identificó la necesidad de actualizar la versión de Node.js.
- Se actualizó la configuración en Vercel Dashboard a 22.x.

Improvements_Identified_For_Consolidation:
- Patrón: Configuración explícita de la versión de Node.js en Vercel para evitar incompatibilidades.
---
Date: 2025-05-26
TaskRef: "Deployment de quranexpo-web - Problema: pnpm Registry ERR_INVALID_THIS"

Learnings:
- Incompatibilidad entre Node.js 22.x y pnpm 6.35.1 (versión preinstalada en Vercel).
- El `package.json` raíz tenía una restricción de `engines` (`">=20.0.0 <21.0.0"`) que causaba advertencias.
- Los errores `ERR_INVALID_THIS` y `ERR_PNPM_META_FETCH_FAIL` indican problemas de contexto en las solicitudes HTTP de pnpm.
- `npm` es más compatible y estable en este escenario.

Difficulties:
- Múltiples errores de fetch del registro npm que bloqueaban la instalación de dependencias.
- La advertencia de `Unsupported engine` indicaba un problema de compatibilidad subyacente.

Successes:
- Se diagnosticó la incompatibilidad de pnpm/Node.js.
- Se decidió cambiar el gestor de paquetes de `pnpm` a `npm` para `quranexpo-web` en Vercel.
- El despliegue final fue exitoso con `npm`.

Improvements_Identified_For_Consolidation:
- Patrón: Considerar `npm` como alternativa a `pnpm` en Vercel si surgen problemas de compatibilidad de versión o errores de registro.
- Patrón: Revisar `engines` en `package.json` raíz para evitar conflictos de versión de Node.js.
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
