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
