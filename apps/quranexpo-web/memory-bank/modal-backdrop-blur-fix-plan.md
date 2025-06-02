# Plan para Corregir el Efecto de Fondo del Modal de Descripción de Surah

## Objetivo
Solucionar el problema donde el modal de descripción de surah oculta todo lo demás en la página en lugar de mostrarse por encima con un fondo difuminado y atenuado.

## Análisis del Problema
- El modal de descripción de surah (`SurahDescriptionModal.tsx`) se ha movido exitosamente fuera del contexto de apilamiento original mediante un portal, renderizándolo como hijo directo de `body`.
- Sin embargo, el usuario reporta que el modal "oculta todo lo demás en la página", lo que sugiere que el backdrop del modal no está funcionando como se espera (no difumina ni atenúa el fondo, o podría estar completamente opaco).
- Esto podría deberse a que el backdrop no tiene las propiedades CSS adecuadas para difuminar (`backdrop-filter: blur()`) o atenuar (`background-color: rgba(0, 0, 0, 0.5)`), o que el modal en sí no tiene un `z-index` suficientemente alto en comparación con otros elementos en el contexto raíz.
- Además, podría haber otros elementos en la página con `z-index` muy altos que interfieren con la visibilidad del modal y su backdrop.

## Solución Propuesta
Revisar y ajustar las propiedades CSS del backdrop y del modal en `SurahDescriptionModal.tsx` para asegurarse de que el backdrop difumine y atenúe el fondo, y que el modal se muestre claramente por encima de todo. También verificar si hay otros elementos en la página con `z-index` conflictivos y ajustar si es necesario.

### Pasos de Implementación
1. **Revisar y Ajustar CSS del Backdrop y Modal**:
   - Asegurarse de que el backdrop tenga las propiedades CSS correctas para difuminar y atenuar el fondo:
     - `background-color: rgba(0, 0, 0, 0.5)` para atenuar.
     - `backdrop-filter: blur(5px)` para difuminar (con prefijos de navegador si es necesario).
   - Confirmar que el backdrop y el modal tienen `z-index` suficientemente altos (`z-90` para backdrop y `z-100` para modal) para estar por encima de otros elementos.
   - Asegurarse de que el backdrop cubra toda la ventana (`top: 0; left: 0; width: 100vw; height: 100vh;`).

2. **Verificar Otros Elementos con `z-index` Alto**:
   - Buscar en el código de la página del lector (`reader/[surahId].astro` y componentes relacionados) cualquier elemento con `z-index` alto que pueda estar interfiriendo con el modal.
   - Si se encuentran, reducir sus `z-index` para que estén por debajo del backdrop del modal (`z-90`).

3. **Probar la Solución**:
   - Después de aplicar los cambios, probar la página del lector para confirmar que el modal se muestra por encima de los versos y otros elementos, con un fondo difuminado y atenuado.

## Código de Cambio Propuesto
A continuación, se muestra el cambio necesario en `SurahDescriptionModal.tsx` para asegurar que el backdrop tenga las propiedades CSS correctas:

### Cambio en `SurahDescriptionModal.tsx`
```diff
<<<<<<< SEARCH
:start_line:42
-------
  return (
    <div
      className="fixed inset-0 z-90 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
=======
  return (
    <div
      className="fixed top-0 left-0 w-[100vw] h-[100vh] z-90 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
      style={{ backdropFilter: 'blur(5px)' }}
      onClick={onClose}
    >
>>>>>>> REPLACE
```

## Siguientes Pasos
- Una vez que este plan sea revisado y aprobado, se debe cambiar al modo `Code` para implementar los cambios en el archivo `SurahDescriptionModal.tsx`.
- Después de la implementación, probar la solución en la página del lector para confirmar que el modal se muestra correctamente por encima de los versos y otros elementos, con un fondo difuminado y atenuado.

## Diagrama de Flujo de la Solución
```mermaid
flowchart TD
    A[Problema: Modal oculta todo lo demás] --> B[Análisis: Backdrop no difumina ni atenúa]
    B --> C[Revisar CSS de backdrop y modal]
    C --> D[Ajustar backdrop: bg-opacity-50, backdrop-filter: blur]
    D --> E[Asegurar z-index altos: backdrop z-90, modal z-100]
    E --> F[Verificar otros elementos con z-index alto]
    F -->|Ajustar si necesario| G[Reducir z-index de otros elementos]
    G --> H[Probar solución]
    H -->|Funciona| I[Solución Confirmada]
    H -->|No funciona| J[Investigar otros elementos o propiedades CSS]