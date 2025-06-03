# Contexto Activo

## Enfoque de Trabajo Actual
Depuración de la página del lector (`reader page`). La lista de versos no se muestra y se han encontrado errores de tiempo de ejecución relacionados con la hidratación y la invocación de Hooks.

## Cambios Recientes
- Se implementó la característica de traducción de IA:
    - Se añadió el `nanostore` `showAITranslation` en `apps/quranexpo-web/src/stores/settingsStore.ts`.
    - Se agregó el toggle correspondiente en `apps/quranexpo-web/src/pages/settings.astro`.
    - Se actualizó `apps/quranexpo-web/src/components/SettingsToggle.tsx` para manejar el nuevo store.
    - Se creó la ruta API `apps/quran-data-api/api/v1/ai-translate.ts` para la traducción de IA.
    - Se añadió la función `getAITranslation` en `apps/quranexpo-web/src/services/apiClient.ts`.
    - Se modificó `apps/quranexpo-web/src/components/ReaderContainer.tsx` para usar el store `showAITranslation`, llamar a la API de traducción de IA, manejar estados de carga y errores, y pasar las traducciones a `ReaderVerseCard.tsx`.
    - Se actualizó `apps/quranexpo-web/src/components/ReaderVerseCard.tsx` para mostrar la traducción de IA y sus estados de carga/error.
- Se corrigieron errores de tiempo de ejecución:
    - Se movió el `useEffect` de traducción de IA en `apps/quranexpo-web/src/components/ReaderContainer.tsx` al nivel superior para resolver el error "Hook can only be invoked from render methods".
    - Se modificó `apps/quranexpo-web/src/components/ClientOnlyReaderContainer.tsx` para siempre renderizar `ReaderContainer`, resolviendo el problema de hidratación.
- Se resolvieron conflictos de fusión de Git en `ReaderContainer.tsx`, `ReaderVerseCard.tsx` y `apiClient.ts`.

## Próximos Pasos
- Diagnosticar por qué la lista de versos no se muestra en la página del lector.
- Investigar los errores de TypeScript "Cannot find module" en `ReaderContainer.tsx` si persisten y afectan la funcionalidad, aunque las rutas parecen correctas.
- Verificar la lógica de carga de datos (`loadData` function) y las condicionales de renderizado (`loading`, `error`, `verses.length`) en `ReaderContainer.tsx` para asegurar que los versos se estén obteniendo y mostrando correctamente.

## Decisiones y Consideraciones Activas
- Los errores de "Cannot find module" en `ReaderContainer.tsx` parecen ser falsos positivos o problemas de resolución del entorno de TypeScript/VSCode, ya que las rutas de importación son correctas. Se priorizará la depuración del problema de renderizado.
- La eliminación del esqueleto de SSR en `ClientOnlyReaderContainer.tsx` y la delegación de la lógica de carga a `ReaderContainer.tsx` es un cambio arquitectónico intencional para mejorar la hidratación.

## Aprendizajes y Perspectivas del Proyecto
- La importancia de la ubicación correcta de los `Hooks` (`useEffect`) para evitar errores de tiempo de ejecución en Preact/React.
- La necesidad de asegurar que el DOM renderizado en el servidor y el cliente sea idéntico para evitar problemas de hidratación.
- Los errores de "Cannot find module" pueden ser engañosos y requerir una verificación manual de las rutas de archivo y la estructura del proyecto.
- La gestión de conflictos de fusión en un monorepo requiere atención cuidadosa, especialmente cuando los archivos han sido eliminados en el remoto y modificados localmente.