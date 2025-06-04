---
<<<<<<< HEAD
Date: 2025-04-06
TaskRef: "Fix Surah Description Modal z-index and implement dimming/blurring effect"

Learnings:
- Understanding React/Preact usage in Astro: Vite aliases (`astro.config.mjs`) and `jsxImportSource` (`tsconfig.json`) are critical for determining the actual runtime UI library, even if both React and Preact dependencies are present. `preact/compat` enables seamless use of React ecosystem libraries with Preact.
- Modals and Z-index: For modals that need to appear above all content, using a Portal (like `preact/compat`'s `createPortal`) is the most robust solution. This lifts the modal out of restrictive stacking contexts created by parent elements (e.g., `position: relative`, `transform`, `filter`).
- Backdrop styling: `backdrop-blur` CSS property (via Tailwind's `backdrop-blur-Xl` classes) is effective for blurring content behind a translucent element. The visibility and intensity of this blur are highly dependent on the background color's opacity. A very low opacity (e.g., `bg-white/5`) makes the blur subtle, while a higher opacity (e.g., `bg-black/70`) provides more dimming.
- `replace_in_file` precision: `replace_in_file` requires exact `SEARCH` block matches. Auto-formatting or subtle changes can cause mismatches. `write_to_file` is a reliable fallback for such scenarios.

Difficulties:
- Initial `z-index` issue due to modal being rendered in-place without a portal.
- Iterative refinement of backdrop opacity and blur effect based on user feedback ("glassmorphic", "subtle", "dim by a lot"). This required multiple `replace_in_file` attempts and eventually a `write_to_file` fallback.
- Typo in `focusableElements` (`focusableableElements`) in `SurahDescriptionModal.tsx` which caused a TypeScript error.
- Repeated `replace_in_file` failures due to `SEARCH` block mismatches, indicating a need for more frequent file re-reads or direct `write_to_file` when the exact content is uncertain.

Successes:
- Successfully identified and implemented the Portal solution for the modal's z-index.
- Successfully adjusted the backdrop's appearance to meet user's evolving requirements (from blurred to subtly dimmed to heavily dimmed).
- Corrected the TypeScript typo.
- The overall task of fixing the modal's display and styling its backdrop was completed.
---
=======
Date: 2025-06-03
TaskRef: "Implementar característica de traducción de IA y resolver problemas de despliegue/renderizado"

Learnings:
- La implementación de nuevas características puede introducir errores de tiempo de ejecución y de hidratación si no se manejan correctamente los Hooks y el renderizado SSR/CSR.
- La ubicación de los `useEffect` es crucial; deben estar en el nivel superior de los componentes o Hooks personalizados.
- Los errores de hidratación (`Expected a DOM node of type "div" but found ""`) a menudo se deben a discrepancias entre el DOM renderizado por el servidor y el cliente. Asegurar que el componente principal maneje su propio estado de carga y esqueleto puede resolver esto.
- Los errores de TypeScript "Cannot find module" pueden ser engañosos si las rutas de importación son correctas. A veces, son falsos positivos o problemas de resolución del entorno de desarrollo.
- La resolución de conflictos de fusión de Git es esencial, especialmente cuando los archivos han sido eliminados en el remoto y modificados localmente. Es necesario usar `git add` para indicar qué versión se quiere mantener, luego `git commit` y `git push`.

Difficulties:
- Diagnosticar y resolver el error "Hook can only be invoked from render methods" debido a la colocación incorrecta de un `useEffect`.
- Resolver el error de hidratación, que requirió modificar la lógica de renderizado en `ClientOnlyReaderContainer.tsx`.
- Manejar los conflictos de fusión de Git causados por la eliminación de archivos en el repositorio remoto mientras se modificaban localmente.
- El problema persistente de que la lista de versos no se muestra en la página del lector, a pesar de las correcciones de Hooks y hidratación. Esto sugiere un problema más profundo en la lógica de carga de datos o en las condicionales de renderizado.

Successes:
- La característica de traducción de IA ha sido implementada en el frontend y backend.
- Se creó la ruta API para la traducción de IA.
- Se añadió el toggle de traducción de IA en la página de configuración.
- Se resolvió el error de invocación de Hooks.
- Se resolvió el error de hidratación.
- Se resolvieron los conflictos de fusión de Git y los cambios se empujaron exitosamente.

Improvements_Identified_For_Consolidation:
- Protocolo de depuración para errores de Hooks y hidratación: Verificar la ubicación de los `useEffect` y la consistencia del DOM SSR/CSR.
- Estrategia de resolución de conflictos de Git para archivos modificados/eliminados.
- La necesidad de un `console.log` estratégico para depurar el estado de carga y renderizado de componentes complejos.
---
>>>>>>> b519158c56c807d0aca03b25983aad5609f1f230
