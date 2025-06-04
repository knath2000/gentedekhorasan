# Plan para Implementar un Portal para el Modal de Descripción de Surah

## Objetivo
Solucionar el problema donde el modal de descripción de surah se muestra detrás de los versos en la página del lector, moviendo el modal fuera de cualquier contexto de apilamiento restrictivo mediante un portal en React.

## Análisis del Problema
- El modal de descripción de surah (`SurahDescriptionModal.tsx`) tiene un `z-index` de 100 para el modal y 90 para el backdrop, lo cual debería ser suficiente para colocarlo por encima de otros elementos.
- Se eliminó el `z-index` del elemento `main` en `reader/[surahId].astro`, pero el problema persiste.
- Esto indica que el modal está siendo afectado por un contexto de apilamiento creado por un ancestro con propiedades CSS como `transform`, `filter`, `perspective`, `will-change`, o `position: relative` con un `z-index` definido, lo que limita el `z-index` del modal al contexto de ese ancestro en lugar del contexto raíz del documento.
- Además, el orden de renderizado del DOM también puede influir, ya que los elementos renderizados más tarde pueden aparecer por encima si no hay control explícito de `z-index`.

## Solución Propuesta
Mover el modal de descripción de surah fuera del contenedor `main` y de cualquier contenedor con un contexto de apilamiento definido, renderizándolo directamente como hijo de `body` mediante un portal en React. Esto asegurará que el modal se renderice en el contexto raíz del documento, evitando cualquier restricción de apilamiento impuesta por ancestros.

### Pasos de Implementación
1. **Crear un Componente de Portal**:
   - Crear un nuevo archivo `Portal.tsx` en `src/components` que use `createPortal` de React para renderizar su contenido directamente en `body`.
   - Este componente será un contenedor genérico que podrá ser usado para renderizar cualquier elemento fuera del flujo normal del DOM.

2. **Modificar `ReaderSurahHeader.tsx`**:
   - Actualizar `ReaderSurahHeader.tsx` para usar el componente `Portal` para renderizar `SurahDescriptionModal.tsx` cuando esté abierto.
   - Asegurarse de que el estado y los eventos del modal sigan funcionando correctamente.

3. **Verificar Estilos y Funcionalidad**:
   - Confirmar que el modal sigue teniendo los estilos correctos (`fixed`, `z-100`, etc.) y que los eventos como cerrar el modal funcionan como se espera.
   - Probar la solución en la página del lector para confirmar que el modal se muestra por encima de todos los elementos.

## Código de Cambio Propuesto
A continuación, se muestra el código para los nuevos archivos y los cambios necesarios:

### Nuevo Archivo: `Portal.tsx`
```typescript
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'preact/hooks';

interface PortalProps {
  children: React.ReactNode;
}

const Portal = ({ children }: PortalProps) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Crear un contenedor div y añadirlo directamente a body
    const portalContainer = document.createElement('div');
    document.body.appendChild(portalContainer);
    setContainer(portalContainer);

    return () => {
      // Limpiar el contenedor al desmontar
      document.body.removeChild(portalContainer);
      setContainer(null);
    };
  }, []);

  return container ? createPortal(children, container) : null;
};

export default Portal;
```

### Cambio en `ReaderSurahHeader.tsx`
```diff
<<<<<<< SEARCH
:start_line:69
-------
       <SurahDescriptionModal surah={surah} isOpen={isModalOpen} onClose={closeModal} />
=======
       {isModalOpen && (
         <Portal>
           <SurahDescriptionModal surah={surah} isOpen={isModalOpen} onClose={closeModal} />
         </Portal>
       )}
>>>>>>> REPLACE
```

### Añadir Importación en `ReaderSurahHeader.tsx`
```diff
<<<<<<< SEARCH
:start_line:3
-------
import type { Surah } from '../types/quran';
import SurahDescriptionModal from './SurahDescriptionModal';
=======
import type { Surah } from '../types/quran';
import SurahDescriptionModal from './SurahDescriptionModal';
import Portal from './Portal';
>>>>>>> REPLACE
```

## Siguientes Pasos
- Una vez que este plan sea revisado y aprobado, se debe cambiar al modo `Code` para implementar los cambios en los archivos `ReaderSurahHeader.tsx` y crear el nuevo archivo `Portal.tsx`.
- Después de la implementación, probar la solución en la página del lector para confirmar que el modal se muestra correctamente por encima de los versos y otros elementos.

## Diagrama de Flujo de la Solución
```mermaid
flowchart TD
    A[Problema: Modal detrás de versos] --> B[Análisis: Contexto de apilamiento]
    B --> C[z-index ya ajustado a 100/90 y z-index de main eliminado]
    C --> D[Problema persiste: Contexto de apilamiento en ancestro]
    D --> E[Mover modal a portal en body]
    E --> F[Crear Portal.tsx]
    F --> G[Modificar ReaderSurahHeader.tsx para usar Portal]
    G --> H[Probar solución]
    H -->|Funciona| I[Solución Confirmada]
    H -->|No funciona| J[Investigar otras propiedades CSS de ancestros]