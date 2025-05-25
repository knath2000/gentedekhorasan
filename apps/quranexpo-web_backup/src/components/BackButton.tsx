import { h } from 'preact';
import { ArrowLeftIcon } from './icons/NavigationIcons';

interface BackButtonProps {
  className?: string;
}

const BackButton = ({ className }: BackButtonProps) => {
  const handleClick = () => {
    console.log('Back button clicked, navigating back in history');
    if (typeof window !== 'undefined') { // Asegurarse de que el código se ejecuta en el cliente
      if (window.history.length > 1) {
        window.history.back();
      } else {
        // Fallback: navegar a la página de Surahs si no hay historial
        window.location.href = '/surahs';
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed left-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity duration-300 ease-in-out z-50 ${className}`}
      aria-label="Go back to Surahs"
    >
      <ArrowLeftIcon size={32} className="text-textPrimary" />
    </button>
  );
};

export default BackButton;
