# Plan para Corregir el Problema de Z-Index del Modal de Descripción de Surah

## Objetivo
Solucionar el problema donde el modal de descripción de surah se muestra detrás de los versos en la página del lector, asegurando que el modal y su backdrop se rendericen por encima de todos los elementos.

## Análisis del Problema
- El modal de descripción de surah (`SurahDescriptionModal.tsx`) tiene un `z-index` de 50 para el modal y 40 para el backdrop.
- Las tarjetas de verso (`ReaderVerseCard.tsx`) tienen un `z-index` relativo de 10, lo que debería ser más bajo que el modal.
- Una búsqueda de elementos con `z-index` superior a 50 no arrojó resultados, lo que sugiere que el problema puede estar relacionado con la estructura de DOM o el orden de renderizado.

## Solución Propuesta
Aumentar el `z-index` del modal y su backdrop a valores más altos para asegurar que se muestren por encima de otros elementos en la página. Específicamente:
- Cambiar el `z-index` del modal de `z-50` a `z-100`.
- Cambiar el `z-index` del backdrop de `z-40` a `z-90`.

## Pasos de Implementación
1. **Modificar `SurahDescriptionModal.tsx`**:
   - Localizar la línea donde se define el `className` del backdrop (alrededor de la línea 99) y cambiar `z-40` a `z-90`.
   - Localizar la línea donde se define el `className` del modal (alrededor de la línea 104) y cambiar `z-50` a `z-100`.

2. **Probar la Solución**:
   - Abrir la página del lector (`/reader/[surahId]`) y hacer clic en el título de la surah para abrir el modal.
   - Verificar que el modal y su backdrop se muestren por encima de los versos y otros elementos de la página.

## Código de Cambio Propuesto
A continuación, se muestra el cambio exacto que se debe aplicar en `SurahDescriptionModal.tsx`:

```diff
<<<<<<< SEARCH
       <div // Backdrop mejorado
         className={`fixed inset-0 bg-skyDeepBlue/85 backdrop-blur-2xl z-40 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
         onClick={onClose}
       />
=======
       <div // Backdrop mejorado
         className={`fixed inset-0 bg-skyDeepBlue/85 backdrop-blur-2xl z-90 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
         onClick={onClose}
       />
>>>>>>> REPLACE

<<<<<<< SEARCH
       <div
         className={`fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2
           glassmorphism-strong shadow-2xl p-6 w-full max-w-lg max-h-[80vh]
           flex flex-col items-center transition-all duration-300 ease-out
           ${isOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'}
         `}
         role="dialog"
         aria-modal="true"
         aria-labelledby="modal-title"
         tabIndex={-1}
         ref={modalRef}
       >
=======
       <div
         className={`fixed top-1/2 left-1/2 z-100 transform -translate-x-1/2 -translate-y-1/2
           glassmorphism-strong shadow-2xl p-6 w-full max-w-lg max-h-[80vh]
           flex flex-col items-center transition-all duration-300 ease-out
           ${isOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'}
         `}
         role="dialog"
         aria-modal="true"
         aria-labelledby="modal-title"
         tabIndex={-1}
         ref={modalRef}
       >
>>>>>>> REPLACE
```

## Siguientes Pasos
- Una vez que este plan sea revisado y aprobado, se debe cambiar al modo `Code` para implementar los cambios en el archivo `SurahDescriptionModal.tsx`.
- Después de la implementación, probar la solución en la página del lector para confirmar que el modal se muestra correctamente.

## Diagrama de Flujo de la Solución
```mermaid
flowchart TD
    A[Problema: Modal detrás de versos] --> B[Análisis: z-index y estructura DOM]
    B --> C[Búsqueda de z-index altos: Sin resultados]
    C --> D[Solución: Aumentar z-index del modal y backdrop]
    D --> E[Implementación: Modificar SurahDescriptionModal.tsx]
    E --> F[Prueba: Verificar visibilidad del modal]
    F --> G[Solución Confirmada]