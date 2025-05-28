## Astro/Preact Hydration & State Management
**Patrón: Interacción directa con stores globales para componentes hidratados**
- Para componentes de Preact hidratados por Astro (`client:only`, `client:visible`), es más robusto que interactúen directamente con un store global (ej. `nanostores`) para la gestión del estado.
- *Razón:* Evita problemas de serialización/deserialización de funciones pasadas como props a través de los límites de hidratación, que pueden llevar a que las funciones aparezcan como `null` o `undefined` en el lado del cliente.

**Depuración: Cautela con `console.log` de props en componentes hidratados**
- Los `console.log` de props en componentes hidratados pueden mostrar valores engañosos (ej. `null` para funciones que en realidad existen y se ejecutan).
- *Recomendación:* Priorizar la observación del comportamiento real de la aplicación sobre los logs de valores de props en estos escenarios.

## Gestión de Estado y Reactividad en Hooks
**Patrón: Uso de valores reactivos de stores en `useEffect` con event listeners**
- Cuando se utilizan event listeners dentro de `useEffect` que dependen de valores de stores (o props/estados), es crucial pasar el valor reactivo (ej. `$value` de `useStore($atom)`) directamente a la función de callback del event listener.
- *Razón:* Esto asegura que la función de callback siempre tenga acceso al estado más reciente del store, incluso si el `useEffect` no se re-ejecuta con cada cambio del store. Evita capturar valores obsoletos.

**Depuración: Verificación del árbol de componentes en uso**
- Al depurar problemas en la UI, siempre verificar el árbol de componentes real que se está renderizando.
- *Razón:* Evita distracciones y tiempo invertido en componentes no utilizados o mal configurados que no son relevantes para el problema actual.

## Control de Comportamiento Inicial con Estado Global
**Patrón: Condicionar el comportamiento inicial de los componentes con estado global reactivo**
- Para asegurar que las configuraciones globales (ej. `autoplayEnabled`) se respeten en la carga inicial de un componente, el componente que orquesta el comportamiento (ej. `ReaderContainer.tsx` para la reproducción de audio) debe importar y utilizar el valor reactivo del store (ej. `$autoplayEnabled` de `useStore(autoplayEnabled)`) en el `useEffect` o lógica que inicia dicho comportamiento.
- *Razón:* Esto garantiza que el comportamiento inicial esté alineado con la configuración actual del usuario desde el primer renderizado, evitando reproducciones o acciones no deseadas.

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
**Patrón: Implementación de Modales Accesibles (Glassmorphism)**
- Para implementar modales accesibles, es crucial utilizar atributos ARIA (`role="dialog"`, `aria-modal="true"`, `aria-labelledby"`), gestionar el foco (focus trap, restauración de foco al cerrar), y permitir el cierre con teclado (ESC) y click en el backdrop.
- Los estilos glassmorphism se pueden lograr con `background`, `backdrop-filter`, `border-radius` y `box-shadow`.

**Proceso: Creación de componentes modales**
- Es una buena práctica encapsular la lógica y la UI de un modal en un componente separado para mejorar la modularidad y la reutilización.

**Depuración: Verificación de tipos de TypeScript**
- Siempre verificar las propiedades de los tipos de TypeScript (ej. `Surah`) para asegurar que se utilizan las propiedades correctas y evitar errores de compilación.

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