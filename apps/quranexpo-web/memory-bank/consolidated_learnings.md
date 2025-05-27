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
