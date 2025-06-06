---
Date: 2025-05-29
TaskRef: "Migración de styled-components y resolución de errores en monorepo"

Learnings:
- La incompatibilidad de `styled-components/native` con Hermes Engine es un problema recurrente y difícil de resolver con configuraciones.
- La unificación de versiones de React en un monorepo con pnpm hoisting es crucial para evitar conflictos de versiones.
- La eliminación completa de `styled-components` y la migración a `StyleSheet` nativo es la solución más robusta para problemas de compatibilidad con Hermes.
- Es fundamental verificar todas las importaciones y usos de la librería a migrar en todo el codebase.
- Los errores de TypeScript relacionados con tipos de tema (`radii`, `shadows`, `textPrimary`, `cardBackground`, `desertHighlightGold`, `white`, `desertSandGold`) surgen cuando la estructura del tema en `src/theme/theme.ts` no coincide con el tema simple definido en `src/theme/nativeTheme.js` y usado por `ThemeContext.js`.
- Los errores de `JSX element class does not support attributes` y `Cannot find name 'TouchableOpacity'` ocurren cuando los componentes estilizados (`styled.Text`, `styled.TouchableOpacity`) se convierten a componentes nativos (`Text`, `TouchableOpacity`) pero no se actualiza su uso en el JSX para pasar las props `style` y `children` correctamente.
- La definición duplicada de componentes (`AnimatedBackground`) en el mismo archivo causa errores de `Cannot redeclare block-scoped variable`.
- La importación de `Head` de `next/head` y el contenido HTML/web en componentes de React Native (`_layout.tsx`) causan errores de runtime en la aplicación nativa.

Difficulties:
- La persistencia de las referencias a `styled-components` a pesar de los intentos de eliminación.
- La complejidad de depurar errores de runtime en Hermes debido a su estricta validación.
- La necesidad de una limpieza profunda de cachés y `node_modules` para asegurar que los cambios se apliquen correctamente.
- La necesidad de migrar manualmente cada componente que usaba `styled-components` a `StyleSheet` nativo.

Successes:
- Se identificó la causa raíz de los problemas de compatibilidad con Hermes y `styled-components`.
- Se unificaron las versiones de React en el monorepo a React 18.
- Se corrigieron los problemas de `_layout.tsx` relacionados con importaciones web y typos en variables de entorno.
- Se inició la migración de componentes de `styled-components` a `StyleSheet` nativo.

Improvements_Identified_For_Consolidation:
- Protocolo de migración de librerías de estilo: Incluir pasos para búsqueda exhaustiva, eliminación de dependencias, limpieza de caché y migración de componentes.
- Guía de compatibilidad de Hermes: Documentar problemas comunes y soluciones para el motor Hermes en React Native.
- Estructura de temas en monorepos: Definir una estrategia clara para la gestión de temas y tipos en proyectos con múltiples plataformas.
---
---
Date: 2025-05-06
TaskRef: "Persistent API Errors (CORS & 500)"

Learnings:
- Vercel's `vercel.json` does NOT support environment variable substitution in the `headers` block. Headers must be set programmatically in the serverless function.
- Vercel's default behavior for serverless functions (placing them in `api/` directory) does not require a `vercel.json` file for basic routing. The presence of a `vercel.json` with `routes` can interfere with default routing.
- Vercel's Deployment Protection's 'OPTIONS Allowlist' is crucial for allowing CORS preflight requests to reach protected deployments. The path should be set to cover the API endpoints (e.g., `/api/v1`).
- `@prisma/client` must be in `dependencies` (not `devDependencies`) for production builds on Vercel to ensure the Prisma client is included.

Difficulties:
- Persistent CORS errors despite multiple attempts with `vercel.json` and in-function headers, due to misunderstanding `vercel.json`'s limitations and Vercel's routing precedence.
- Persistent 500 Internal Server Error on Quran API, initially misdiagnosed as a `vercel.json` routing issue, then as a `devDependencies` issue for `@prisma/client`.
- The current 500 error on the Quran API (`/get-metadata?type=surah-list`) persists even after moving `@prisma/client` to `dependencies` and removing `vercel.json`. This indicates a deeper server-side issue, possibly with database connection, Prisma client generation/usage, or unhandled exceptions within the API logic.

Successes:
- Confirmed that `vercel.json` is not needed for basic serverless function routing.
- Confirmed that CORS headers must be set programmatically in the function.
- Identified the importance of the 'OPTIONS Allowlist' for CORS preflight requests.
- Corrected `@prisma/client` dependency type.

Improvements_Identified_For_Consolidation:
- Vercel deployment best practices for monorepos (no `vercel.json` for simple APIs, programmatic CORS, OPTIONS Allowlist).
- Prisma deployment best practices on Vercel (dependencies, `postinstall` script).\n- Systematic debugging approach for persistent API errors.
---
---
Date: 2025-05-06
TaskRef: "Persistent API Errors (CORS & 500) - Attempt 2"

Learnings:
- Moving `prisma` to `dependencies` and adding `installCommand`/`buildCommand` to root `vercel.json` did NOT resolve the `Prisma client did not initialize yet` or CORS issues.
- The issue persists, indicating a deeper problem with the API deployment or configuration on Vercel.

Difficulties:
- The root cause of the persistent 500 error and CORS issue remains elusive.

Successes:
- Confirmed that the previous proposed solution was not effective.

Improvements_Identified_For_Consolidation:
- Further investigation into Vercel deployment logs, environment variables, and Prisma setup for monorepos is required.
- Need to re-evaluate Vercel's build process for `pnpm` monorepos and how `postinstall` scripts are handled.
---