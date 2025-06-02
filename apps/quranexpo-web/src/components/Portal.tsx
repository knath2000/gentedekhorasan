import type { VNode } from 'preact'; // Importación de tipo
import { createPortal } from 'preact/compat'; // Importar de preact/compat
import { useEffect, useState } from 'preact/hooks';

interface PortalProps {
  children: VNode | VNode[];
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