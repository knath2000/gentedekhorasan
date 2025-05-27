# activeContext.md

## Enfoque de trabajo actual
- Se ha completado la depuración y verificación de las animaciones y la navegación en la aplicación web Quran Expo.
- Se ha asegurado que las animaciones secuenciales de fade-in funcionan correctamente en la página de inicio, la lista de Surahs y la lista de versos.
- Se ha confirmado que la navegación entre las páginas principales (`/`, `/surahs`, `/reader/[surahId]`) funciona sin la barra de navegación inferior.
- **El `AudioControlsPopup` ha sido renombrado a `BottomControlPanel.tsx` y refactorizado para combinar los controles de audio y paginación en un solo componente persistente en la parte inferior de la pantalla.**
- **El `BottomControlPanel.tsx` ahora se expande verticalmente cuando el audio está activo para mostrar los controles de audio, y se contrae para mostrar solo los controles de paginación cuando el audio no está activo. Tiene un `z-index` de `z-[999]` y su posición en `bottom-4`.**
- **Se ha ajustado el orden de los elementos dentro de `BottomControlPanel.tsx` para que los controles de audio se muestren por encima de los controles de paginación, resolviendo el conflicto visual.**
- Se ha verificado que el botón de retroceso (`BackButton.tsx`) funciona correctamente utilizando `history.back()` y su `z-index` ha sido ajustado para estar por encima de las tarjetas de versos.
- Se ha implementado la paginación híbrida en la página del lector (`ReaderContainer.tsx`) para manejar Surahs largas, incluyendo el hook `usePagination` y los controles de paginación.
- **Se ha resuelto el problema de la visibilidad de los controles de audio para suras con 7 o menos versos: el `BottomControlPanel` ahora se muestra solo durante la reproducción de audio para estas suras, mostrando únicamente los controles de audio y ocultando los botones de navegación.**

## Cambios recientes
- Se actualizó `src/pages/index.astro` para corregir el "parpadeo" de las animaciones.
- Se actualizó `src/components/SurahListContainer.tsx` para implementar animaciones secuenciales en la lista de Surahs.
- Se actualizó `src/components/ReaderContainer.tsx` para aplicar animaciones secuenciales a la lista de versos.
- Se actualizó `src/styles/global.css` para definir las clases de animación secuencial (`animate-list-item`, `animate-item-X`) y los keyframes necesarios.
- Se actualizó `memory-bank/raw_reflection_log.md` con los aprendizajes y éxitos de las últimas tareas.
- Se actualizó `memory-bank/consolidated_learnings.md` para incluir patrones de animación y flujo de trabajo, así como el patrón de navegación con `history.back()`.
- Se actualizó `memory-bank/progress.md` para reflejar el estado actual del proyecto.
- Se actualizó `.clinerules/systemPatterns.md` para eliminar la referencia a la navegación inferior.
- **Se modificó `src/components/BottomControlPanel.tsx` para reordenar los controles de audio y paginación.**
- **Se modificó `src/components/ReaderContainer.tsx` y `src/components/BottomControlPanel.tsx` para implementar la lógica de visibilidad de los controles de audio para suras cortas.**
- Se actualizó `src/services/apiClient.ts` para usar la API de `quran-api-data` desplegada en Vercel (`https://gentedekhorasan.vercel.app/api/v1`).
- **🚨 PROBLEMA CRÍTICO ACTUAL:** Migración de base de datos de Neon a Turso bloqueada por error persistente de TypeScript en `quran-data-api`. Error `Property 'startIndex' is missing` causado por duplicación del cliente de Prisma en dos ubicaciones.

## Próximos pasos
**URGENTE - Resolver duplicación de cliente Prisma:**
1. **Detener procesos activos** (incluyendo `vercel dev`)
2. **Eliminar forzadamente** `apps/quran-data-api/api/generated/` (ubicación duplicada)
3. **Limpiar cache de TypeScript** y regenerar cliente
4. **Verificar build local exitoso** antes de desplegar
5. **Cambiar al modo Code** para ejecutar plan de eliminación forzada

## Decisiones y consideraciones activas
- La eliminación de la barra de navegación inferior ha simplificado la interfaz y resuelto problemas de renderizado.
- La estandarización de las animaciones secuenciales de TailwindCSS ha mejorado la coherencia visual y el rendimiento.
- El uso de `history.back()` para el botón de retroceso proporciona una navegación más intuitiva.
- Se ha adoptado un enfoque de paginación híbrida (paginación tradicional + scroll virtual) para optimizar el rendimiento y la UX en Surahs largas.
- **Se ha resuelto el conflicto visual entre los controles de audio y paginación al combinarlos en un solo componente y ajustar su orden de renderizado.**
- **La visibilidad condicional del `BottomControlPanel` para suras cortas asegura una experiencia de usuario limpia y funcional, mostrando los controles de audio solo cuando son relevantes.**

## Aprendizajes y conocimientos del proyecto
- La importancia de asegurar que los contenedores padres tengan alturas definidas para componentes con scroll interno o posicionamiento absoluto.
- La necesidad de usar clases de animación consistentes de TailwindCSS (`animate-*`, `animation-delay-*`) y centralizar su definición.
- La utilidad de verificar los procesos en ejecución antes de intentar iniciarlos.
- La preferencia de `history.back()` sobre rutas fijas para la navegación de retroceso.
- **La implementación de lógica de renderizado condicional basada en el estado de audio y el número de versos para optimizar la visibilidad de los controles de UI.**
- **Vercel Monorepo Functions Deployment:** Se aprendió que para desplegar funciones de API en un subdirectorio de un monorepo en Vercel, es necesario:
    -   Configurar `tsconfig.json` para compilar TypeScript a JavaScript en un directorio `dist` (`"outDir": "dist"`) y permitir la emisión (`"noEmit": false`).
    -   Asegurarse de que el script `build` del `package.json` de la aplicación de la API ejecute esta compilación (`tsc -p api/tsconfig.json`).
    -   Mover la configuración de `functions` y `routes` al `vercel.json` de la **raíz del monorepo**, apuntando a los archivos JavaScript compilados en el directorio `dist` dentro del subdirectorio de la aplicación (ej. `"apps/quran-data-api/dist/api/v1/get-metadata.js"`).
    -   El `vercel.json` anidado en el subdirectorio de la API debe ser mínimo (solo `{"version": 2}`).
