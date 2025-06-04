// apps/quranexpo-web/src/components/Portal.tsx
import { type ComponentChild, type VNode } from 'preact';
import { createPortal } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';

interface PortalProps {
  children: ComponentChild;
  /** Optional CSS selector string for the portal container. Defaults to '#modal-root'. */
  containerSelector?: string;
}

const Portal = ({ children, containerSelector = '#modal-root' }: PortalProps): VNode | null => {
  const [mounted, setMounted] = useState(false);
  const [portalNode, setPortalNode] = useState<Element | null>(null);

  useEffect(() => {
    setMounted(true);
    let node = document.querySelector(containerSelector);
    if (!node) {
      // If the node doesn't exist, create it and append to body.
      node = document.createElement('div');
      node.setAttribute('id', containerSelector.startsWith('#') ? containerSelector.substring(1) : containerSelector);
      document.body.appendChild(node);
    }
    setPortalNode(node);

    return () => {
      // Optional: Cleanup function to remove the dynamically created node if it's empty
      // This part can be tricky if multiple portals use the same dynamic node.
      // For simplicity, we'll leave it to persist or rely on a predefined node in Layout.astro.
    };
  }, [containerSelector]);

  if (!mounted || !portalNode) {
    return null;
  }

  return createPortal(children, portalNode);
};

export default Portal;
