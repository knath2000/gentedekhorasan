# Plan para Corregir el Problema de Contexto de Apilamiento del Modal de Descripción de Surah

## Objetivo
Solucionar el problema donde el modal de descripción de surah se muestra detrás de los versos en la página del lector, ajustando el contexto de apilamiento y asegurando que el modal se renderice por encima de todos los elementos.

## Análisis del Problema
- El modal de descripción de surah (`SurahDescriptionModal.tsx`) tiene un `z-index` de 100 para el modal y 90 para el backdrop, lo cual debería ser suficiente para colocarlo por encima de otros elementos.
- Sin embargo, el modal está siendo renderizado dentro de `ReaderSurahHeader.tsx`, que a su vez está dentro de `ReaderContainer.tsx`, y finalmente dentro de un elemento `main` con `relative z-10` en `reader/[surahId].astro`.
- Esto crea un contexto de apilamiento donde el modal, aunque es `fixed`, puede estar limitado por el `z-index` del contenedor `main` (z-10), haciendo que otros elementos con `z-index` más alto o en un contexto de apilamiento superior lo cubran.
- Las tarjetas de verso (`ReaderVerseCard.tsx`) tienen un `z-index` relativo de 10, y otros elementos en la página podrían estar interfiriendo debido a su posición en el DOM.

## Solución Propuesta
Mover el modal de descripción de surah fuera del contenedor `main` o de cualquier contenedor con un `z-index` definido que pueda limitar su contexto de apilamiento. Esto se puede lograr mediante un portal (usando un componente React que renderice el modal en un nodo DOM diferente, como directamente en `body`), o ajustando la estructura de DOM para que el modal no esté anidado dentro de elementos con `position: relative` o `z-index` definidos.

Alternativamente, si mover el modal no es factible de inmediato, se puede intentar aumentar el `z-index` del contenedor `main` o eliminar el `z-index` de `main` para que no cree un contexto de apilamiento que limite al modal.

### Opción 1: Mover el Modal a un Portal
- Crear un componente de portal en React que renderice el modal directamente como hijo de `body`, evitando cualquier contexto de apilamiento definido por contenedores superiores.
- Modificar `ReaderSurahHeader.tsx` para usar este portal para renderizar `SurahDescriptionModal`.

### Opción 2: Ajustar el Contexto de Apilamiento
- Modificar `reader/[surahId].astro` para eliminar o aumentar el `z-index` del elemento `main` (actualmente `z-10`), permitiendo que el modal `fixed` con `z-100` se muestre por encima de otros elementos.
- Asegurarse de que no haya otros elementos con `position: relative` o `z-index` alto que puedan interferir con el modal.

## Pasos de Implementación
1. **Intentar Opción 2 (Más Rápida)**:
   - Modificar `reader/[surahId].astro` para eliminar el `z-index` del elemento `main` o aumentarlo a un valor muy alto (por ejemplo, `z-1000`) para que no limite el modal.
   - Probar si esto resuelve el problema.

2. **Si Opción 2 No Funciona, Proceder con Opción 1**:
   - Crear un componente `Portal.tsx` que use `createPortal` de React para renderizar el modal directamente en `body`.
   - Modificar `ReaderSurahHeader.tsx` para usar este portal para renderizar `SurahDescriptionModal.tsx`.
   - Asegurarse de que el modal siga funcionando correctamente con los eventos y el estado.

## Código de Cambio Propuesto para Opción 2
A continuación, se muestra el cambio exacto que se debe aplicar en `reader/[surahId].astro` como primer intento:

```diff
<<<<<<< SEARCH
<main class="relative z-10 flex flex-col items-center flex-1 px-4 pt-4 h-full overflow-hidden" style="padding-bottom: env(safe-area-inset-bottom, 0px); padding-top: env(safe-area-inset-top, 20px);">
=======
<main class="relative flex flex-col items-center flex-1 px-4 pt-4 h-full overflow-hidden" style="padding-bottom: env(safe-area-inset-bottom, 0px); padding-top: env(safe-area-inset-top, 20px);">
>>>>>>> REPLACE
```

## Siguientes Pasos
- Una vez que este plan sea revisado y aprobado, se debe cambiar al modo `Code` para implementar los cambios en el archivo `reader/[surahId].astro` como primer intento.
- Si el cambio en `reader/[surahId].astro` no resuelve el problema, se procederá con la implementación de un portal en React para mover el modal fuera de los contenedores restrictivos.
- Después de la implementación, probar la solución en la página del lector para confirmar que el modal se muestra correctamente.

## Diagrama de Flujo de la Solución
```mermaid
flowchart TD
    A[Problema: Modal detrás de versos] --> B[Análisis: Contexto de apilamiento]
    B --> C[z-index ya ajustado a 100/90]
    C --> D[Problema persiste: Contexto de apilamiento en main z-10]
    D --> E[Opción 2: Eliminar z-index de main]
    E --> F[Probar solución]
    F -->|No funciona| G[Opción 1: Mover modal a portal en body]
    G --> H[Implementar y probar]
    F -->|Funciona| I[Solución Confirmada]
    H -->|Funciona| I