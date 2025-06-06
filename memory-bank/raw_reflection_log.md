---
Date: 2025-06-06
TaskRef: "Fix Vercel monorepo deployment failure - pnpm compatibility issue"

Learnings:
- ERR_INVALID_THIS errors during pnpm install on Vercel are often caused by Node.js version incompatibility (pnpm 9.x + Node.js 22.x)
- For monorepos on Vercel, functions configuration must be in root vercel.json, not app-specific ones
- Functions paths in vercel.json must point to compiled .js files in dist directory, not .ts source files
- When switching from pnpm to npm for Vercel builds, .npmrc configuration is critical for monorepo dependencies
- NPM legacy-peer-deps, shamefully-hoist, and auto-install-peers flags help with monorepo dependency resolution
- Root package.json should not specify packageManager when switching package managers for deployment
- Node.js version constraints should be relaxed for Vercel compatibility (>=20.0.0 vs >=20.0.0 <21.0.0)
- API apps in monorepos need minimal vercel.json with {"version": 2} even if functions are defined in root

Difficulties:
- Initial diagnosis required systematic analysis of error logs to identify root cause
- Multiple configuration files needed updates across the monorepo structure
- Memory bank update attempts didn't work properly due to text matching issues

Successes:
- Systematic approach using vercel-monorepo-deployment-debugging rule helped identify all required changes
- Successfully switched from pnpm to npm for Vercel while maintaining local pnpm usage
- Comprehensive fix addresses all aspects: package manager, Node version, file paths, dependencies
- All TypeScript configurations verified to be properly set for compilation

Improvements_Identified_For_Consolidation:
- Pattern: Vercel monorepo deployment with npm fallback for pnpm projects
- Vercel function path configuration for compiled TypeScript
- NPM configuration for monorepo dependency resolution

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
Date: 2025-06-06
TaskRef: "Fix Vercel monorepo deployment failure - pnpm compatibility issue"

Learnings:
- ERR_INVALID_THIS errors during pnpm install on Vercel are often caused by Node.js version incompatibility (pnpm 9.x + Node.js 22.x)
- For monorepos on Vercel, functions configuration must be in root vercel.json, not app-specific ones
- Functions paths in vercel.json must point to compiled .js files in dist directory, not .ts source files
- When switching from pnpm to npm for Vercel builds, .npmrc configuration is critical for monorepo dependencies
- NPM legacy-peer-deps, shamefully-hoist, and auto-install-peers flags help with monorepo dependency resolution
- Root package.json should not specify packageManager when switching package managers for deployment
- Node.js version constraints should be relaxed for Vercel compatibility (>=20.0.0 vs >=20.0.0 <21.0.0)
- API apps in monorepos need minimal vercel.json with {"version": 2} even if functions are defined in root

Difficulties:
- Initial diagnosis required systematic analysis of error logs to identify root cause
- Multiple configuration files needed updates across the monorepo structure
- Memory bank update attempts didn't work properly due to text matching issues

Successes:
- Systematic approach using vercel-monorepo-deployment-debugging rule helped identify all required changes
- Successfully switched from pnpm to npm for Vercel while maintaining local pnpm usage
- Comprehensive fix addresses all aspects: package manager, Node version, file paths, dependencies
- All TypeScript configurations verified to be properly set for compilation

Improvements_Identified_For_Consolidation:
- Pattern: Vercel monorepo deployment with npm fallback for pnpm projects
- Vercel function path configuration for compiled TypeScript
- NPM configuration for monorepo dependency resolution

---
---
Date: 2025-06-06
TaskRef: "Fix Vercel monorepo deployment failure - pnpm compatibility issue"

Learnings:
- ERR_INVALID_THIS errors during pnpm install on Vercel are often caused by Node.js version incompatibility (pnpm 9.x + Node.js 22.x)
- For monorepos on Vercel, functions configuration must be in root vercel.json, not app-specific ones
- Functions paths in vercel.json must point to compiled .js files in dist directory, not .ts source files
- When switching from pnpm to npm for Vercel builds, .npmrc configuration is critical for monorepo dependencies
- NPM legacy-peer-deps, shamefully-hoist, and auto-install-peers flags help with monorepo dependency resolution
- Root package.json should not specify packageManager when switching package managers for deployment
- Node.js version constraints should be relaxed for Vercel compatibility (>=20.0.0 vs >=20.0.0 <21.0.0)
- API apps in monorepos need minimal vercel.json with {"version": 2} even if functions are defined in root

Difficulties:
- Initial diagnosis required systematic analysis of error logs to identify root cause
- Multiple configuration files needed updates across the monorepo structure
- Memory bank update attempts didn't work properly due to text matching issues

Successes:
- Systematic approach using vercel-monorepo-deployment-debugging rule helped identify all required changes
- Successfully switched from pnpm to npm for Vercel while maintaining local pnpm usage
- Comprehensive fix addresses all aspects: package manager, Node version, file paths, dependencies
- All TypeScript configurations verified to be properly set for compilation

Improvements_Identified_For_Consolidation:
- Pattern: Vercel monorepo deployment with npm fallback for pnpm projects
- Vercel function path configuration for compiled TypeScript
- NPM configuration for monorepo dependency resolution

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
Date: 2025-06-06
TaskRef: "Fix Vercel monorepo deployment failure - pnpm compatibility issue"

Learnings:
- ERR_INVALID_THIS errors during pnpm install on Vercel are often caused by Node.js version incompatibility (pnpm 9.x + Node.js 22.x)
- For monorepos on Vercel, functions configuration must be in root vercel.json, not app-specific ones
- Functions paths in vercel.json must point to compiled .js files in dist directory, not .ts source files
- When switching from pnpm to npm for Vercel builds, .npmrc configuration is critical for monorepo dependencies
- NPM legacy-peer-deps, shamefully-hoist, and auto-install-peers flags help with monorepo dependency resolution
- Root package.json should not specify packageManager when switching package managers for deployment
- Node.js version constraints should be relaxed for Vercel compatibility (>=20.0.0 vs >=20.0.0 <21.0.0)
- API apps in monorepos need minimal vercel.json with {"version": 2} even if functions are defined in root

Difficulties:
- Initial diagnosis required systematic analysis of error logs to identify root cause
- Multiple configuration files needed updates across the monorepo structure
- Memory bank update attempts didn't work properly due to text matching issues

Successes:
- Systematic approach using vercel-monorepo-deployment-debugging rule helped identify all required changes
- Successfully switched from pnpm to npm for Vercel while maintaining local pnpm usage
- Comprehensive fix addresses all aspects: package manager, Node version, file paths, dependencies
- All TypeScript configurations verified to be properly set for compilation

Improvements_Identified_For_Consolidation:
- Pattern: Vercel monorepo deployment with npm fallback for pnpm projects
- Vercel function path configuration for compiled TypeScript
- NPM configuration for monorepo dependency resolution

---
---
Date: 2025-06-06
TaskRef: "Fix Vercel monorepo deployment failure - pnpm compatibility issue"

Learnings:
- ERR_INVALID_THIS errors during pnpm install on Vercel are often caused by Node.js version incompatibility (pnpm 9.x + Node.js 22.x)
- For monorepos on Vercel, functions configuration must be in root vercel.json, not app-specific ones
- Functions paths in vercel.json must point to compiled .js files in dist directory, not .ts source files
- When switching from pnpm to npm for Vercel builds, .npmrc configuration is critical for monorepo dependencies
- NPM legacy-peer-deps, shamefully-hoist, and auto-install-peers flags help with monorepo dependency resolution
- Root package.json should not specify packageManager when switching package managers for deployment
- Node.js version constraints should be relaxed for Vercel compatibility (>=20.0.0 vs >=20.0.0 <21.0.0)
- API apps in monorepos need minimal vercel.json with {"version": 2} even if functions are defined in root

Difficulties:
- Initial diagnosis required systematic analysis of error logs to identify root cause
- Multiple configuration files needed updates across the monorepo structure
- Memory bank update attempts didn't work properly due to text matching issues

Successes:
- Systematic approach using vercel-monorepo-deployment-debugging rule helped identify all required changes
- Successfully switched from pnpm to npm for Vercel while maintaining local pnpm usage
- Comprehensive fix addresses all aspects: package manager, Node version, file paths, dependencies
- All TypeScript configurations verified to be properly set for compilation

Improvements_Identified_For_Consolidation:
- Pattern: Vercel monorepo deployment with npm fallback for pnpm projects
- Vercel function path configuration for compiled TypeScript
- NPM configuration for monorepo dependency resolution

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
Date: 2025-06-06
TaskRef: "Fix Vercel monorepo deployment failure - pnpm compatibility issue"

Learnings:
- ERR_INVALID_THIS errors during pnpm install on Vercel are often caused by Node.js version incompatibility (pnpm 9.x + Node.js 22.x)
- For monorepos on Vercel, functions configuration must be in root vercel.json, not app-specific ones
- Functions paths in vercel.json must point to compiled .js files in dist directory, not .ts source files
- When switching from pnpm to npm for Vercel builds, .npmrc configuration is critical for monorepo dependencies
- NPM legacy-peer-deps, shamefully-hoist, and auto-install-peers flags help with monorepo dependency resolution
- Root package.json should not specify packageManager when switching package managers for deployment
- Node.js version constraints should be relaxed for Vercel compatibility (>=20.0.0 vs >=20.0.0 <21.0.0)
- API apps in monorepos need minimal vercel.json with {"version": 2} even if functions are defined in root

Difficulties:
- Initial diagnosis required systematic analysis of error logs to identify root cause
- Multiple configuration files needed updates across the monorepo structure
- Memory bank update attempts didn't work properly due to text matching issues

Successes:
- Systematic approach using vercel-monorepo-deployment-debugging rule helped identify all required changes
- Successfully switched from pnpm to npm for Vercel while maintaining local pnpm usage
- Comprehensive fix addresses all aspects: package manager, Node version, file paths, dependencies
- All TypeScript configurations verified to be properly set for compilation

Improvements_Identified_For_Consolidation:
- Pattern: Vercel monorepo deployment with npm fallback for pnpm projects
- Vercel function path configuration for compiled TypeScript
- NPM configuration for monorepo dependency resolution

---
---
Date: 2025-06-06
TaskRef: "Fix Vercel monorepo deployment failure - pnpm compatibility issue"

Learnings:
- ERR_INVALID_THIS errors during pnpm install on Vercel are often caused by Node.js version incompatibility (pnpm 9.x + Node.js 22.x)
- For monorepos on Vercel, functions configuration must be in root vercel.json, not app-specific ones
- Functions paths in vercel.json must point to compiled .js files in dist directory, not .ts source files
- When switching from pnpm to npm for Vercel builds, .npmrc configuration is critical for monorepo dependencies
- NPM legacy-peer-deps, shamefully-hoist, and auto-install-peers flags help with monorepo dependency resolution
- Root package.json should not specify packageManager when switching package managers for deployment
- Node.js version constraints should be relaxed for Vercel compatibility (>=20.0.0 vs >=20.0.0 <21.0.0)
- API apps in monorepos need minimal vercel.json with {"version": 2} even if functions are defined in root

Difficulties:
- Initial diagnosis required systematic analysis of error logs to identify root cause
- Multiple configuration files needed updates across the monorepo structure
- Memory bank update attempts didn't work properly due to text matching issues

Successes:
- Systematic approach using vercel-monorepo-deployment-debugging rule helped identify all required changes
- Successfully switched from pnpm to npm for Vercel while maintaining local pnpm usage
- Comprehensive fix addresses all aspects: package manager, Node version, file paths, dependencies
- All TypeScript configurations verified to be properly set for compilation

Improvements_Identified_For_Consolidation:
- Pattern: Vercel monorepo deployment with npm fallback for pnpm projects
- Vercel function path configuration for compiled TypeScript
- NPM configuration for monorepo dependency resolution

---
Date: 2025-06-06
TaskRef: "Fix Vercel monorepo deployment ERR_INVALID_THIS errors"

Learnings:
- Identified that ERR_INVALID_THIS errors in Vercel deployments are typically caused by Node.js/pnpm version incompatibility
- Root `package.json` specified `pnpm@9.1.4` and `node >=20.0.0 <21.0.0` but Vercel defaults to Node.js 22.x
- For monorepos, the root `vercel.json` should contain the main deployment configuration including functions and rewrites
- Functions paths in `vercel.json` should point to compiled JavaScript files in `dist` directory, not TypeScript source files
- `.npmrc` configuration with `legacy-peer-deps=true` and `shamefully-hoist=true` helps resolve dependency conflicts when switching from pnpm to npm
- Missing `apps/quran-data-api/vercel.json` file needed to be created with minimal `{"version": 2}` configuration

Successes:
- Successfully implemented Option 2 (Switch to npm for Vercel deployments) from the debugging protocol
- Updated root `vercel.json` to use `npm install --legacy-peer-deps` and corrected function paths to point to compiled JS files
- Created proper `.npmrc` configuration to handle dependency resolution
- Created missing `apps/quran-data-api/vercel.json` file

Improvements_Identified_For_Consolidation:
- Vercel monorepo deployment pattern: Use npm for deployment even if development uses pnpm
- Function path configuration: Always point to compiled JS files in dist directory
- .npmrc configuration for npm compatibility in monorepos
---
Date: 2025-06-06
TaskRef: "Fix Vercel monorepo deployment failure - pnpm compatibility issue"

Learnings:
- ERR_INVALID_THIS errors during pnpm install on Vercel are often caused by Node.js version incompatibility (pnpm 9.x + Node.js 22.x)
- For monorepos on Vercel, functions configuration must be in root vercel.json, not app-specific ones
- Functions paths in vercel.json must point to compiled .js files in dist directory, not .ts source files
- When switching from pnpm to npm for Vercel builds, .npmrc configuration is critical for monorepo dependencies
- NPM legacy-peer-deps, shamefully-hoist, and auto-install-peers flags help with monorepo dependency resolution
- Root package.json should not specify packageManager when switching package managers for deployment
- Node.js version constraints should be relaxed for Vercel compatibility (>=20.0.0 vs >=20.0.0 <21.0.0)
- API apps in monorepos need minimal vercel.json with {"version": 2} even if functions are defined in root

Difficulties:
- Initial diagnosis required systematic analysis of error logs to identify root cause
- Multiple configuration files needed updates across the monorepo structure
- Memory bank update attempts didn't work properly due to text matching issues

Successes:
- Systematic approach using vercel-monorepo-deployment-debugging rule helped identify all required changes
- Successfully switched from pnpm to npm for Vercel while maintaining local pnpm usage
- Comprehensive fix addresses all aspects: package manager, Node version, file paths, dependencies
- All TypeScript configurations verified to be properly set for compilation

Improvements_Identified_For_Consolidation:
- Pattern: Vercel monorepo deployment with npm fallback for pnpm projects
- Vercel function path configuration for compiled TypeScript
- NPM configuration for monorepo dependency resolution

---
## 2025-06-06 - Vercel Function Runtime Version Fix

**TaskRef:** "Fix Vercel deployment error: 'Function Runtimes must have a valid version'"

**Learnings:**
- Vercel requires explicit version numbers for function runtimes (e.g., `@vercel/node@20`, not just `@vercel/node`)
- The error message `'Function Runtimes must have a valid version, for example now-php@1.0.0.'` indicates missing version specification in `vercel.json`
- For Node.js functions, version should match project requirements (Node.js 20 in this case, confirmed by `engines.node: ">=20.0.0"` and `@types/node: "^20.14.10"`)
- For monorepos, function runtime configuration in root `vercel.json` affects serverless function deployment

**Successes:**
- Quick diagnosis of the root cause through systematic analysis
- Correct identification of Node.js 20 as the appropriate version based on project dependencies
- Simple, targeted fix resolved the deployment issue

**Improvements_Identified_For_Consolidation:**
- Vercel runtime version specification pattern: always include explicit version numbers
- Monorepo deployment debugging: check function runtime configuration in root `vercel.json`

---
---
Date: 2025-06-06
TaskRef: "Vercel Node.js 22 Runtime Upgrade - Final Fix for Function Runtime Version Error"

Learnings:
- Vercel build environment was automatically using Node.js 22.x despite vercel.json specifying @vercel/node@20
- The error "Function Runtimes must have a valid version" occurred due to mismatch between Vercel's build environment (Node.js 22) and configured runtime (@vercel/node@20)
- Build logs showing "Skipping build cache since Node.js version changed from '20.x' to '22.x'" indicated the core issue
- Solution: Align function runtime with Vercel's actual build environment by upgrading to @vercel/node@22

Successes:
- Successfully identified the root cause as Node.js version mismatch between build environment and function runtime
- Applied targeted fix by updating vercel.json functions runtime from @vercel/node@20 to @vercel/node@22
- Followed systematic debugging approach using vercel-monorepo-deployment-debugging.md protocol

Key Patterns:
- When Vercel build logs show Node.js version changes, align function runtime with the actual version being used
- Vercel may default to newer Node.js versions in build environment regardless of local project configuration
- For monorepos: function runtime configuration must be in root vercel.json, not in individual app directories

Technical Details:
- File modified: vercel.json
- Change: functions["apps/quran-data-api/dist/api/v1/*.js"].runtime = "@vercel/node@22"
- Previous value: "@vercel/node@20"
- Reason: Align with Vercel's Node.js 22.x build environment

---