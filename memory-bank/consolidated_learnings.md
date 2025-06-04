## API Development & Integration
**Pattern: Frontend-Backend Parameter Consistency**
- Ensure that parameters sent from the frontend (e.g., in URL queries or request bodies) precisely match what the backend API expects. Mismatches can lead to silent failures or incorrect data handling.
- *Rationale:* Prevents debugging headaches related to data not reaching the backend correctly.

**Pattern: API Response Consistency for CRUD Operations**
- For `PUT` (update) operations, it is often beneficial for the API to return the full updated object rather than just a success message.
- *Rationale:* Simplifies frontend state management, as the frontend can directly use the returned object to update its local store, ensuring consistency and reducing the need for additional `GET` requests.

## Frontend Development & Debugging
**Pattern: Hook Invocation and Hydration Errors**
- `useEffect` and other Hooks must always be called at the top level of a functional component or a custom Hook. Nesting Hooks inside conditional statements, loops, or other functions will lead to runtime errors like "Hook can only be invoked from render methods."
- Hydration errors (`Expected a DOM node of type "div" but found ""`) occur when the server-rendered HTML (SSR) does not exactly match the client-rendered DOM. To resolve this, ensure that the component responsible for rendering (e.g., `ReaderContainer`) handles its own loading states and skeletons, and avoid conditional rendering of entire component trees based on `isClient` flags in wrapper components (e.g., `ClientOnlyReaderContainer`).

**Pattern: Debugging Component Rendering Issues**
- When components fail to render or display data, strategically placed `console.log` statements can be invaluable. Log the state of `loading`, `error`, and data arrays (`verses.length`) just before conditional rendering blocks to pinpoint why content is not being displayed.

## Project Specifics
**QuranExpo - Bookmark Notes Functionality:**
- The existing `UserBookmark` model in Prisma already supports a `notes` field.
- The API endpoints for bookmark CRUD operations were largely functional, but required minor adjustments for parameter consistency and response format.
- **Fixes Applied:**
    - Corrected URL parameter in `apps/quranexpo-web/src/services/apiClient.ts` for `updateBookmark` to use `id` instead of `userId` and `bookmarkId`.
    - Modified `apps/quran-data-api/api/v1/user-bookmarks.ts` (PUT method) to return the updated `UserBookmark` object instead of a generic success message.
- *Outcome:* The notes functionality on the bookmarks page is now fully operational, leveraging existing infrastructure with minimal code changes.

<<<<<<< HEAD
## Gestión de Estado Global Persistente
**Patrón: Uso de `nanostores/persistent` para almacenamiento de estado global persistente**
- Para funcionalidades que requieren que el estado persista a través de las sesiones del usuario (ej. configuraciones, marcadores), `nanostores/persistent` es una solución efectiva. Permite almacenar y recuperar datos del `localStorage` de forma reactiva.
- *Consideraciones:* Definir interfaces claras para los datos almacenados y proporcionar funciones auxiliares para interactuar con el store (añadir, eliminar, actualizar).

## Componentes de Iconos SVG Reutilizables
**Patrón: Creación de componentes de iconos SVG reutilizables con propiedades para estilización condicional**
- Encapsular el código SVG de los iconos en componentes de Preact (o el framework UI que se esté usando) permite una fácil reutilización, tipado y estilización dinámica (ej. cambiar color o relleno basado en props como `filled`).
- *Beneficios:* Reduce la duplicación de código, mejora la mantenibilidad y facilita la coherencia visual.

## Estrategias de Deployment en Vercel para Monorepos
**Patrón: Aislamiento de Proyectos en Vercel Dashboard**
- Para monorepos, configurar `Root Directory` en Vercel Dashboard para apuntar directamente al subproyecto (ej. `apps/quranexpo-web`).
- *Razón:* Evita que Vercel intente construir todo el monorepo, previene conflictos de `postinstall` hooks de otros proyectos (ej. `prisma: command not found`), y aísla la instalación de dependencias.

**Patrón: Gestión de Versiones de Node.js en Vercel**
- Asegurar que la versión de Node.js configurada en Vercel Dashboard (`Project Settings -> General -> Node.js Version`) coincida con los requisitos del proyecto (ej. `22.x`).
- *Razón:* Evita errores de `Found invalid Node.js Version`.

**Patrón: Elección del Gestor de Paquetes para Deployment**
- Si `pnpm` presenta problemas de compatibilidad con la versión de Node.js en Vercel (ej. `ERR_INVALID_THIS` con Node.js 22.x y pnpm 6.x), considerar cambiar a `npm` para el `Install Command` y `Build Command` del proyecto en Vercel Dashboard.
- *Razón:* `npm` puede ofrecer mayor estabilidad y compatibilidad en ciertos entornos de Vercel, especialmente cuando hay conflictos de `engine` o `lockfile` con `pnpm`.

**Patrón: Configuración de Vercel Functions en Monorepos**
- Para que las funciones de API en un subdirectorio de un monorepo (`apps/quran-data-api/api/`) sean desplegadas correctamente, es crucial:
    -   Configurar `tsconfig.json` para compilar TypeScript a JavaScript en un directorio `dist` (`"outDir": "dist"`) y permitir la emisión (`"noEmit": false`).
    -   Asegurarse de que el script `build` del `package.json` de la aplicación de la API ejecute esta compilación (`tsc -p api/tsconfig.json`).
    -   Mover la configuración de `functions` y `routes` al `vercel.json` de la **raíz del monorepo**, apuntando a los archivos JavaScript compilados en el directorio `dist` dentro del subdirectorio de la aplicación (ej. `"apps/quran-data-api/dist/api/v1/get-metadata.js"`).
    -   El `vercel.json` anidado en el subdirectorio de la API (`apps/quran-data-api/vercel.json`) debe ser mínimo (solo `{"version": 2}`).

## Depuración y Estrategias de `apply_diff`
**Depuración: Estrategias para manejar errores de `apply_diff` (reescritura completa del archivo)**
- Cuando `apply_diff` falla repetidamente o introduce errores de sintaxis debido a problemas de contexto o cambios estructurales complejos, una estrategia robusta es reescribir el archivo completo utilizando `write_to_file`.
- *Recomendación:* Siempre verificar el resultado de `apply_diff` y tener el contenido completo del archivo a mano para una reescritura si es necesario.

## Gestión de Monorepos (Turborepo)
**Patrón: Sintaxis de configuración de Turborepo (`tasks` vs `pipeline`)**
- Para versiones recientes de Turborepo (2.0+), el campo para definir las configuraciones de las tareas de build en `turbo.json` debe ser `"tasks"`, no `"pipeline"`.
- *Razón:* El uso de `"pipeline"` resultará en un error de build.

## Proceso: Actualización de la Documentación del Proyecto
**Proceso: Importancia de actualizar la documentación del proyecto al cambiar el alcance o añadir funcionalidades importantes**
- Al introducir nuevas funcionalidades o cambiar el alcance de un proyecto, es fundamental actualizar los archivos de documentación clave (ej. `projectbrief.md`, `productContext.md`, `systemPatterns.md`, `progress.md`).
- *Razón:* Mantiene la coherencia del proyecto, proporciona un registro claro de las decisiones y el estado actual, y facilita la comprensión para futuros desarrolladores o para el propio modelo en sesiones posteriores.

## Interacciones de Usuario Avanzadas
**Patrón: Implementación de eventos de pulsación larga (long press) en componentes UI**
- Para diferenciar entre clics cortos y largos, se puede implementar una lógica manual utilizando `setTimeout` y `clearTimeout` en los eventos `onMouseDown`/`onTouchStart` y `onMouseUp`/`onTouchEnd`.
- *Consideraciones:* Prevenir la propagación de eventos (`e.preventDefault()`, `e.stopPropagation()`) para evitar conflictos con otros manejadores de clics. Asegurar la compatibilidad con dispositivos táctiles y de escritorio.
- *Beneficios:* Permite interacciones de usuario más ricas y contextuales sin saturar la UI con iconos adicionales.

## Depuración de Artefactos Visuales
**Depuración: Enfoque sistemático para depurar artefactos visuales (z-index, overflow, animaciones, componentes de fondo)**
- Al encontrar artefactos visuales inesperados, es crucial inspeccionar la superposición de elementos (`z-index`), el recorte de contenido (`overflow`), y la interacción de animaciones/transiciones.
- *Estrategia:* Revisar los estilos CSS globales y específicos del componente, así como los componentes de fondo que puedan estar contribuyendo al problema. Aislamiento del problema mediante la eliminación temporal de estilos o componentes.
- *Aprendizaje específico:* Los `focus:ring` de TailwindCSS pueden causar artefactos visuales inesperados en ciertos contextos de renderizado. Reemplazarlos con `box-shadow` personalizados puede ser una solución más robusta.
- *Aprendizaje específico:* Los artefactos de texto como `:start_line:XX -------` en el código renderizado son el resultado de un `apply_diff` fallido que inserta metadatos de diff directamente en el archivo. La solución es reescribir el archivo completo con `write_to_file`.

## Migración de Librerías de Estilo (styled-components a StyleSheet)
**Proceso: Migración sistemática de librerías de estilo en React Native**
- Para migrar de librerías CSS-in-JS (ej. `styled-components`) a `StyleSheet` nativo en React Native, es crucial un proceso sistemático:
    1.  **Búsqueda exhaustiva:** Identificar todas las importaciones y usos de la librería a migrar en el codebase (ej. `grep -r "styled-components"`).
    2.  **Eliminación de dependencias:** Desinstalar el paquete de la librería y eliminar archivos de configuración o declaración de tipos relacionados (ej. `styled-config.js`, `styled.d.ts`).
    3.  **Creación de tema y contexto nativos:** Implementar un objeto de tema simple y un `ThemeContext` nativo para gestionar los estilos.
    4.  **Migración de componentes:** Reescribir cada componente estilizado para usar `StyleSheet.create` y consumir el tema a través de `useTheme()`. Asegurarse de tipar correctamente las props `children` y `style`.
    5.  **Limpieza profunda de caché:** Eliminar `node_modules`, cachés de Expo/Metro (`npx expo start --clear`, `npx react-native start --reset-cache`) y reinstalar dependencias (`npm install` o `pnpm install`).
    6.  **Verificación final:** Ejecutar búsquedas (`grep`) para confirmar que no quedan referencias a la librería antigua.
- *Razón:* Evita errores de runtime (`TypeError: Cannot read property 'S' of undefined`, `TypeError: Cannot read property 'default' of undefined`, `Unable to resolve module`) causados por incompatibilidades con Hermes Engine y problemas de resolución de módulos.
- *Aprendizaje específico:* Los errores de TypeScript como `Property 'textPrimary' does not exist` o `Property 'radii' does not exist` después de la migración de temas indican que la estructura del tema en `src/theme/theme.ts` no coincide con el tema simple de `src/theme/nativeTheme.js` usado por `ThemeContext.js`. La solución es ajustar las referencias de propiedades (ej. `theme.colors.textPrimary` a `theme.colors.text`, `theme.radii.md` a `theme.borderRadius.md`).
- *Aprendizaje específico:* Los errores de TypeScript como `JSX element class does not support attributes` y `Cannot find name 'TouchableOpacity'` después de la migración de componentes estilizados indican que los componentes nativos (`Text`, `TouchableOpacity`, `View`) se están usando incorrectamente. La solución es pasar las props `style` y `children` directamente, y no usar la sintaxis de `styled.Component`.
- *Aprendizaje específico:* La definición duplicada de componentes en el mismo archivo (ej. `AnimatedBackground`) causa errores de `Cannot redeclare block-scoped variable`. Asegurarse de que solo haya una definición.
- *Aprendizaje específico:* Los componentes de fondo que usan animaciones (ej. `LottieView`) deben contener la animación y aceptar `children` como props para que el contenido se renderice encima de la animación.
- *Aprendizaje específico:* La importación de `Head` de `next/head` y el contenido HTML/web en componentes de React Native (ej. `_layout.tsx`) causan errores de runtime en la aplicación nativa. Estos deben ser eliminados o condicionales a la plataforma.

## Visualización de Datos
**Patrón: Mostrar nombres de suras en transliteración inglesa en el título de la tarjeta**
- Para mejorar la experiencia del usuario y la coherencia con las expectativas de los usuarios de habla inglesa, el título de la tarjeta de sura en la página de suras ahora muestra el nombre de la sura en transliteración inglesa (`surah.transliterationName`).
- *Consideraciones:* El subtítulo permanece en inglés simple (`surah.englishName`) para proporcionar contexto adicional.
- *Aprendizaje específico:* La API `get-metadata?type=surah-list` no devuelve el campo `tname` (nombre transliterado). Se implementó un fallback a `item.ename` en `apiClient.ts` para asegurar que siempre haya un valor para `transliterationName`.

## Migración de Base de Datos a Turso
**Proceso: Importación de datos a Turso desde un archivo SQL**
- Al importar datos a una base de datos Turso desde un archivo SQL que incluye sentencias `CREATE TABLE` (como un dump de SQLite), es crucial eliminar las tablas existentes previamente.
- *Comando:* `turso db shell <nombre_de_la_base_de_datos> "DROP TABLE IF EXISTS tabla1; DROP TABLE IF EXISTS tabla2;"` antes de `turso db shell <nombre_de_la_base_de_datos> < archivo.sql`.
- *Razón:* Evita el error "table already exists" y asegura una importación limpia.

**Depuración: Problemas de `prisma generate` con `Datasource provider not known: "libsql"`**
- Si el error `Datasource provider not known: "libsql"` persiste a pesar de tener la versión de Prisma compatible (`>=5.10.0`), el `schema.prisma` configurado correctamente, y `DATABASE_URL` en `.env.local`, el problema puede ser más profundo.
- *Posibles causas:* Problemas con la carga del `@prisma/adapter-libsql` por el motor de validación de Prisma (especialmente la versión WASM), incompatibilidades sutiles con el entorno de Node.js/sistema operativo, o un bug en Prisma/adaptador.
- *Estrategias de depuración agotadas:* Limpieza de caché de pnpm, reinstalación de dependencias, deshabilitación de `postinstall` hook, y ejecución manual de `prisma generate` de varias maneras.
- *Recomendación:* En estos casos, se recomienda buscar soporte en los canales oficiales de Prisma/Turso o considerar una versión anterior de Prisma si se sabe que funciona en el entorno específico.
- *Aprendizaje específico:* Se confirmó que el error "Datasource provider not known: "libsql"" de Prisma se resuelve configurando `provider = "sqlite"` en `schema.prisma` y utilizando `@prisma/adapter-libsql` para la conexión en tiempo de ejecución. La instanciación de `PrismaLibSQL` requiere un objeto de configuración `{ url: LIBSQL_URL, authToken: LIBSQL_AUTH_TOKEN }` directamente.

## Estrategias de Deployment en Vercel para Monorepos
<!-- Existing content from this section will go here -->

**Depuración: Errores de Tipos persistentes en Entornos CI/CD (Vercel)**
- Si un error de TypeScript sobre propiedades faltantes en tipos generados (ej. `PrismaClient` o sus modelos) persiste en despliegues de Vercel a pesar de correcciones de código, regeneraciones locales de Prisma y despliegues sin caché:
    - *Causa probable:* Problemas de caché de Vercel profundos, o dificultades en la resolución de tipos de TypeScript en el entorno de build de Vercel que impiden que los tipos generados se actualicen o reconozcan correctamente.
    - *Estrategias a considerar (si las soluciones de código se han agotado):*
        - **Asegurar la generación de Prisma antes de la compilación:** Incluir `prisma generate` en el script de build que TypeScript usa para compilar las funciones (ej. `prisma generate --schema=./prisma/schema.prisma && tsc -p api/tsconfig.json`). Es crucial que `prisma generate` se ejecute *antes* de `tsc`.
        - **Mover dependencias de Prisma a `dependencies`:** Asegurarse de que `prisma` y `@prisma/client` estén en `dependencies` en lugar de `devDependencies` en `package.json` para entornos de producción como Vercel.
        - **Buscar ayuda externa:** Es probable que el problema requiera soporte directo de Vercel o de la comunidad de Prisma, o una investigación más profunda de incompatibilidades de entorno.
- *Aprendizaje específico:* El error `Property 'startIndex' is missing` en `get-metadata.ts` a pesar de estar presente en el código y el esquema `schema.prisma` es un ejemplo de este tipo de problema.
- *Aprendizaje específico:* Re-habilitar el script `postinstall` en `package.json` para ejecutar `prisma generate` es fundamental para asegurar que el cliente de Prisma se genere después de la instalación de dependencias en entornos de despliegue como Vercel.
- *Aprendizaje específico:* Añadir `paths` explícitos en `tsconfig.json` para los tipos generados por Prisma (ej. `"../generated/prisma": ["./generated/prisma"]`) es una capa adicional para asegurar que TypeScript encuentre los tipos correctamente en monorepos y entornos de despliegue.

## Proceso de Trabajo y Depuración
**Patrón: Verificación del contenido del archivo antes de `apply_diff`**
- Siempre leer el contenido más reciente de un archivo antes de intentar aplicar un `diff` para evitar errores de coincidencia debido a cambios inesperados en el archivo.
- *Razón:* Asegura que el bloque `SEARCH` del `diff` coincida exactamente con el contenido actual del archivo, previniendo fallos en la aplicación de los cambios.

## Configuración de Entorno en Despliegues (Vercel)
**Patrón: Configuración de Variables de Entorno en Plataformas de Despliegue**
- Es crucial configurar las variables de entorno necesarias (ej., URLs de bases de datos, tokens de autenticación API) directamente en el panel de control del proveedor de despliegue (ej., Vercel, Netlify, AWS).
- *Razón:* Las `.env.local` solo funcionan localmente y no son accedidas en entornos de producción.
- *Confirmación:* Los errores de "variable not defined" o problemas de conexión a servicios externos en el despliegue son un fuerte indicador de que las variables de entorno no están configuradas correctamente en la plataforma.

## Arquitectura de Monorepo y Unificación de Servicios
**Patrón: Unificación de la Base de Datos y la Capa API en Monorepos**
- En monorepos, es una buena práctica unificar la infraestructura de la base de datos y la capa API para evitar duplicación de funcionalidades y asegurar la coherencia de los datos.
- *Razón:* Simplifica la gestión, reduce la superficie de ataque y asegura que todos los proyectos consuman la misma fuente de verdad.
- *Ejemplo:* Migrar proyectos secundarios para usar la misma base de datos central (ej. Turso) y una única API de datos (ej. `quran-data-api`), eliminando conexiones directas a bases de datos duplicadas (ej. Neon) y directorios de API redundantes.

**Patrón: Gestión de Dependencias en Monorepos pnpm**
- Para monorepos que utilizan pnpm, la instalación de dependencias debe realizarse preferentemente ejecutando `pnpm install` desde la raíz del monorepo.
- *Razón:* Esto asegura que pnpm gestione correctamente los enlaces simbólicos y las dependencias compartidas entre los subproyectos, evitando problemas que pueden surgir al intentar ejecutar `npm install` o `yarn install` en subdirectorios individuales.
- *Depuración:* Errores como `Cannot read properties of null (reading 'matches')` al usar `npm install` en un subproyecto de pnpm suelen resolverse ejecutando `pnpm install` desde la raíz.

## Optimización de Renderizado y Experiencia de Usuario
**Patrón: Definición de colores de fondo explícitos para evitar FOUC (Flash of Unstyled Content)**
- Para evitar el "flashing white box" o FOUC, es crucial definir `background-color` explícitamente en `html`, `body` y en los contenedores principales (`main`) de las páginas.
- *Razón:* Esto asegura que el navegador pinte el fondo deseado antes de que se carguen todos los estilos o el contenido dinámico.

**Patrón: Script de tema inline para evitar FOUC en Dark Mode**
- Para aplicaciones con dark mode, un script inline en el `<head>` que aplique la clase `dark` al `document.documentElement` basado en el `localStorage` previene el "flashing" del tema claro antes de que se cargue el JavaScript principal.

**Patrón: Manejo de Skeleton Loaders sin librerías dedicadas**
- Cuando no se utilizan librerías de skeleton loader dedicadas, los indicadores de carga manuales (como spinners) deben estar contenidos en elementos con dimensiones fijas (ej. `min-height`) y sus fondos deben coincidir con el `background-color` del layout para evitar saltos visuales o cambios abruptos.

**Proceso: Adaptación del plan de implementación**
- Es importante ser flexible y adaptar el plan de implementación si las suposiciones iniciales (ej. uso de una librería específica) no se cumplen. La investigación y la adaptación son clave.

## Restauración de Fondo y Gestión de Apariencia
**Proceso: Reversión de cambios para restaurar funcionalidad previa**
- Para restaurar una funcionalidad o apariencia previa, es necesario revertir sistemáticamente los cambios que la modificaron o eliminaron. Esto incluye archivos CSS, configuraciones de TailwindCSS y clases en componentes.

**Patrón: Componentes de fondo dedicados**
- El uso de un componente dedicado (ej. `Background.tsx`) para manejar el fondo visual de la aplicación (gradientes, estrellas, SVGs) permite una fácil gestión y reutilización.

**Depuración: Entender la composición del fondo**
- Cuando se trabaja con fondos, es crucial entender cómo se componen (colores sólidos, gradientes, imágenes, SVGs) y cómo interactúan las capas (z-index) para asegurar la visibilidad deseada.

## Renderizado de Fondos en SSR
**Patrón: Fondos visuales en SSR para evitar FOUC**
- Los fondos visuales (gradientes, imágenes, SVGs) que deben estar presentes durante el Server-Side Rendering (SSR) y la animación de carga (skeleton loading) deben renderizarse siempre en el servidor, no solo en el cliente.
- *Razón:* Esto asegura que el fondo esté presente desde el primer render, eliminando el "flashing white box" y proporcionando una experiencia visual consistente desde el inicio.
- *Implementación:* Eliminar directivas como `client:idle` o `client:only` de los componentes de fondo si no utilizan hooks o lógica específica del cliente.

## Skeletons y Placeholders en SSR
**Patrón: Colores de skeletons y placeholders en SSR**
- Los skeletons y placeholders que se renderizan durante el Server-Side Rendering (SSR) deben usar colores base y highlight que combinen con el fondo global de la aplicación.
- *Razón:* Evitar el "flashing white box" o parches de color que no se integran visualmente con el fondo personalizado u oscuro.
- *Implementación:* Utilizar colores semitransparentes o tonos oscuros que se mezclen con el fondo, en lugar de blancos o grises claros por defecto.

## Modales y Accesibilidad
**Patrón: Implementación de Modales Accesibles**
- Para implementar modales accesibles, es crucial utilizar atributos ARIA (`role="dialog"`, `aria-modal="true"`, `aria-labelledby"`), gestionar el foco (focus trap, restauración de foco al cerrar), y permitir el cierre con teclado (ESC) y click en el backdrop.
- **Uso de Portales**: Para asegurar que los modales se muestren correctamente por encima de todo el contenido, independientemente de su posición en el árbol DOM, se debe utilizar un Portal (ej. `preact/compat`'s `createPortal`). Esto saca el modal de contextos de apilamiento restrictivos.

**Patrón: Estilizado de Backdrops de Modal**
- El backdrop de un modal puede atenuar y/o desenfocar el contenido de la página detrás.
- **Atenuación**: Se logra con un color de fondo semitransparente (ej. `bg-black/70`).
- **Desenfoque (`backdrop-blur`)**: Se logra con la propiedad `backdrop-filter: blur()` (ej. Tailwind's `backdrop-blur-2xl`). Para que el desenfoque sea visible, el color de fondo del backdrop debe ser transparente o semitransparente.
- **Eliminación de Efectos**: Para eliminar un efecto de desenfoque o color, se deben quitar las clases de Tailwind CSS correspondientes (ej. `backdrop-blur-2xl` o `bg-color/opacity`).

**Proceso: Creación de componentes modales**
- Es una buena práctica encapsular la lógica y la UI de un modal en un componente separado para mejorar la modularidad y la reutilización.

**Depuración: Verificación de tipos de TypeScript**
- Siempre verificar las propiedades de los tipos de TypeScript (ej. `Surah`) para asegurar que se utilizan las propiedades correctas y evitar errores de compilación.
- **Errores de Tipografía**: Errores como `Cannot find name 'focusableableElements'` indican errores tipográficos en el código que deben ser corregidos directamente.

## Coherencia Visual en Modales
**Patrón: Integración visual de modales con el tema de la aplicación**
- Para que un modal se integre visualmente con el resto de la aplicación, debe replicar los tokens de diseño (colores, tipografía, sombras, bordes, fondos) de los componentes existentes (ej. tarjetas, headers).
- *Razón:* Asegura una experiencia de usuario coherente y premium, evitando que el modal se vea "flotante" o ajeno al tema.
- *Implementación:* Utilizar las mismas clases de utilidad de TailwindCSS o variables CSS ya definidas para otros componentes, y aplicar la misma estructura de `glassmorphism` si es el patrón de diseño de la aplicación.

## Generación de Contenido con LLMs
**Proceso: Generación y almacenamiento de descripciones de suras**
- Para generar descripciones de suras, se puede utilizar la API de OpenRouter con modelos como Gemini 2.5 Flash Preview 5-20, aplicando prompts claros y concisos.
- *Validación:* Es crucial validar y limpiar la salida del LLM (ej. limitar la longitud, eliminar caracteres especiales) para asegurar la calidad del contenido.
- *Almacenamiento:* Los resultados deben guardarse localmente en un formato adecuado para la base de datos de destino (ej. JSON para upsert batch en TursoDB).
- *Consideraciones:* Manejar la clave API como variable de entorno y aplicar retrasos entre llamadas para evitar rate limits.
- *Estructura del script:* Un script de Node.js/TypeScript independiente con su propio `package.json` y `tsconfig.json` es ideal para esta tarea en un monorepo.

## Interacción de Usuario y Accesibilidad
**Patrón: Restricción del área de click en elementos interactivos**
- Para asegurar que el área de click de un elemento interactivo (ej. un título que abre un modal) sea precisa y no se extienda más allá del texto, es crucial aplicar los handlers de eventos y atributos de accesibilidad directamente al elemento de texto (ej. `h1`, `h2`, `span`) en lugar de a un contenedor padre con padding/margen excesivo.
- Utilizar clases de TailwindCSS como `cursor-pointer` y manejar eventos de teclado (`onKeyDown` para `Enter` y `Space`) mejora la accesibilidad y la experiencia de usuario.

**Proceso: Resolución de contradicciones en planes de implementación**
- Cuando un plan contiene instrucciones contradictorias (ej. "trigger en título árabe o inglés" vs "no handler en div padre"), es importante analizar el objetivo final y tomar la decisión más lógica y que cumpla con las mejores prácticas (en este caso, aplicar handlers a ambos elementos de texto individualmente).

## Generación de Contenido con LLMs
**Proceso: Generación y almacenamiento de descripciones de suras**
- Para generar descripciones de suras, se puede utilizar la API de OpenRouter con modelos como Gemini 2.5 Flash Preview 5-20, aplicando prompts claros y concisos.
- *Validación:* Es crucial validar y limpiar la salida del LLM (ej. limitar la longitud, eliminar caracteres especiales) para asegurar la calidad del contenido.
- *Almacenamiento:* Los resultados deben guardarse localmente en un formato adecuado para la base de datos de destino (ej. JSON para upsert batch en TursoDB).
- *Consideraciones:* Manejar la clave API como variable de entorno y aplicar retrasos entre llamadas para evitar rate limits.
- *Estructura del script:* Un script de Node.js/TypeScript independiente con su propio `package.json` y `tsconfig.json` es ideal para esta tarea en un monorepo.

## Interacción de Usuario y Accesibilidad
**Patrón: Restricción del área de click en elementos interactivos**
- Para asegurar que el área de click de un elemento interactivo (ej. un título que abre un modal) sea precisa y no se extienda más allá del texto, es crucial aplicar los handlers de eventos y atributos de accesibilidad directamente al elemento de texto (ej. `h1`, `h2`, `span`) en lugar de a un contenedor padre con padding/margen excesivo.
- Utilizar clases de TailwindCSS como `cursor-pointer` y manejar eventos de teclado (`onKeyDown` para `Enter` y `Space`) mejora la accesibilidad y la experiencia de usuario.

**Proceso: Resolución de contradicciones en planes de implementación**
- Cuando un plan contiene instrucciones contradictorias (ej. "trigger en título árabe o inglés" vs "no handler en div padre"), es importante analizar el objetivo final y tomar la decisión más lógica y que cumpla con las mejores prácticas (en este caso, aplicar handlers a ambos elementos de texto individualmente).

## Importación de Datos a Bases de Datos (TursoDB)
**Proceso: Importación de datos a TursoDB**
- Para importar datos a TursoDB, se puede usar el SDK `@libsql/client`.
- Es crucial usar el `authToken` correcto y la URL de la base de datos.
- La ruta al archivo JSON debe ser precisa, especialmente en entornos de módulos ES y directorios anidados.
- Si las transacciones explícitas (`BEGIN TRANSACTION`, `COMMIT`, `ROLLBACK`) causan problemas inesperados (ej. `cannot rollback - no transaction is active`), se puede optar por ejecutar las consultas individualmente, aunque sea menos eficiente.

**Depuración: Errores de autenticación (401)**
- Un error 401 (`Unauthorized`) al conectar a una base de datos indica un problema con el token de autenticación (inválido o sin permisos). Verificar que el token sea el correcto y esté actualizado.

**Depuración: Errores de ruta de archivo (`ENOENT`)**
- Los errores `ENOENT` (No such file or directory) suelen indicar una ruta incorrecta al archivo. Es importante considerar el `process.cwd()` y la estructura de directorios al construir rutas relativas, especialmente en scripts que se compilan y ejecutan desde un subdirectorio (`dist`).

## Integración de Datos Dinámicos en UI
**Patrón: Integración de API para datos dinámicos**
- Para mostrar datos dinámicos (como descripciones de suras) en la UI, es necesario crear un endpoint de API dedicado que consulte la base de datos.
- En entornos donde Prisma CLI presenta problemas (`Datasource provider not known`), se puede optar por usar el cliente de la base de datos directamente (ej. `@libsql/client`) en el endpoint de la API para modelos específicos.

**Patrón: Manejo de estado de carga y errores en componentes UI**
- Al obtener datos de una API en un componente de Preact (o React), es crucial usar `useState` para gestionar los estados de carga (`isLoading`), error (`error`) y los datos (`description`).
- Utilizar `useEffect` para disparar la llamada a la API cuando el componente se monta o cuando las dependencias relevantes cambian (ej. `isOpen`, `surah.number`).
- Mostrar mensajes de carga, error o "no disponible" en la UI para mejorar la experiencia del usuario.

**Depuración: Problemas de Prisma en monorepos**
- Los errores `Cannot find module 'prisma/build/index.js'` después de instalar Prisma en un monorepo pueden indicar problemas con la resolución de módulos o la ejecución del `postinstall` hook.
- Intentar `pnpm install` desde la raíz del monorepo puede ayudar a resolver problemas de enlaces simbólicos.
- Si los problemas persisten, considerar alternativas como usar el cliente de la base de datos directamente para modelos específicos, evitando la necesidad de `prisma generate` para esos modelos.

## Depuración: Errores de CORS
- Los errores de CORS (`Access to fetch... has been blocked by CORS policy`) ocurren cuando una aplicación web intenta hacer una solicitud a un recurso en un origen diferente (dominio, protocolo o puerto) y el servidor de destino no envía los encabezados `Access-Control-Allow-Origin` adecuados.
- Para resolverlo en funciones de Vercel, se deben añadir los encabezados `response.setHeader('Access-Control-Allow-Origin', '*')` (o un origen específico), `response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')` y `response.setHeader('Access-Control-Allow-Headers', 'Content-Type')`.
- Es crucial manejar las solicitudes `OPTIONS` (preflight) devolviendo un estado 200 y terminando la respuesta (`return response.status(200).end();`).

## Depuración: Errores de Hydration Mismatch en SSR
- El error `"Expected a DOM node of type 'div' but found ''"` indica un mismatch entre el HTML generado por SSR y el renderizado por el cliente.
- Esto ocurre cuando el componente renderiza `null` o un tipo de nodo diferente en el servidor (cuando no está visible) y luego un `div` con contenido en el cliente (cuando se vuelve visible).
- **Solución:** Asegurar que el componente siempre renderice la misma estructura DOM, incluso cuando no esté visible. Esto se logra renderizando el componente pero ocultándolo con CSS (ej. `opacity-0 invisible` en TailwindCSS) en lugar de devolver `null`.
- Mostrar placeholders o skeleton loaders durante la carga de datos asíncronos ayuda a mantener la consistencia del DOM.

## Diseño UI: Redimensionamiento de modales y scroll
- Para redimensionar un modal y permitir que su contenido sea scrollable, se pueden usar clases de TailwindCSS como `max-w-` (para ancho máximo), `max-h-` (para altura máxima) y `overflow-y-auto` (para scroll vertical automático).
- Es importante aplicar `overflow-y-auto` al contenedor del contenido que se espera que sea scrollable, y `max-h-` al contenedor principal del modal para que el scroll funcione correctamente.

## Diseño UI: Control de superposición de elementos (z-index) y efectos de fondo
- Para lograr que un elemento (ej. un panel de navegación) se vea borroso detrás de un modal, es crucial que el `z-index` del backdrop del modal sea mayor que el `z-index` del elemento que se desea desenfocar.
- El `backdrop-blur` de TailwindCSS aplica el efecto de desenfoque solo a lo que está *detrás* del elemento al que se aplica la clase.
- Asegurarse de que el `z-index` del modal principal sea mayor que el de su propio backdrop para que el modal sea visible.
- **Evitar aplicar `backdrop-blur` a elementos que se espera que sean desenfocados por un overlay superior.** El desenfoque debe ser manejado por el overlay, no por los elementos individuales. Esto evita conflictos y asegura que el efecto se aplique correctamente.
=======
**QuranExpo - AI Translation Feature:**
- **Implementation Details:**
    - Added `showAITranslation` nanostore in `apps/quranexpo-web/src/stores/settingsStore.ts`.
    - Integrated a toggle for AI translation in `apps/quranexpo-web/src/pages/settings.astro`.
    - Created a new API route `apps/quran-data-api/api/v1/ai-translate.ts` to interact with OpenRouter.ai (using `openai/gpt-4o-mini` model).
    - Added `getAITranslation` function in `apps/quranexpo-web/src/services/apiClient.ts`.
    - Modified `apps/quranexpo-web/src/components/ReaderContainer.tsx` to conditionally fetch and pass AI translations to `ReaderVerseCard.tsx`.
    - Updated `apps/quranexpo-web/src/components/ReaderVerseCard.tsx` to display AI translations, including loading and error states.
- **Runtime Fixes:**
    - Corrected `useEffect` placement in `ReaderContainer.tsx` to resolve "Hook can only be invoked from render methods" error.
    - Modified `ClientOnlyReaderContainer.tsx` to directly render `ReaderContainer`, resolving hydration issues.
- **Git Conflict Resolution:**
    - Successfully resolved `git merge` conflicts in `ReaderContainer.tsx`, `ReaderVerseCard.tsx`, and `apiClient.ts` by explicitly staging local versions.
- *Current Status:* Feature implemented, but the verse list is not showing on the reader page, indicating a potential data loading or rendering conditional issue.
>>>>>>> b519158c56c807d0aca03b25983aad5609f1f230
