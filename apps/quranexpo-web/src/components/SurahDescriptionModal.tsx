import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { fetchSurahDescription } from '../services/apiClient';
import type { Surah } from '../types/quran';
<<<<<<< HEAD
import Portal from './Portal'; // Importar Portal
=======
import { logger } from '../utils/logger';
>>>>>>> b519158c56c807d0aca03b25983aad5609f1f230

interface SurahDescriptionModalProps {
  surah: Surah;
  isOpen: boolean;
  onClose: () => void;
}

const SurahDescriptionModal = ({ surah, isOpen, onClose }: SurahDescriptionModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to get ordinal suffix (e.g., 1st, 2nd, 3rd)
  function getOrdinalSuffix(n: number) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  }

  // Cargar la descripción de la API
  const loadDescription = useCallback(async () => {
    if (!surah) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchSurahDescription(surah.number);
      setDescription(data);
      logger.info(`Description for Surah ${surah.number} loaded.`);
    } catch (err) {
      logger.error("Failed to fetch surah description:", err);
      setError("Failed to load description.");
    } finally {
      setIsLoading(false);
    }
  }, [surah?.number]);

  useEffect(() => {
    if (isOpen) {
      loadDescription();
      // Focus the modal or close button when opened
      closeButtonRef.current?.focus();
      // Disable body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Enable body scroll
      document.body.style.overflow = '';
    }
  }, [isOpen, loadDescription]);

  useEffect(() => {
    if (isOpen) {
      // Focus the modal or close button when opened
      closeButtonRef.current?.focus();
      // Disable body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Enable body scroll
      document.body.style.overflow = '';
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Focus trap logic (simplified for now, can be enhanced)
  useEffect(() => {
    const handleTabKey = (event: KeyboardEvent) => {
      if (!isOpen || !modalRef.current || event.key !== 'Tab') return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  // Renderizar el modal solo si isOpen es true, pero siempre con la misma estructura DOM
  // La visibilidad se controla con clases CSS
  if (!isOpen) {
    return null; // No renderizar nada si no está abierto, el Portal manejará la inserción/eliminación
  }

  return (
    <Portal> {/* Envolver con Portal */}
      <div // Backdrop mejorado
<<<<<<< HEAD
        className={`fixed inset-0 bg-black/70 z-40 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
=======
        className={`fixed inset-0 bg-skyDeepBlue/40 backdrop-blur-2xl z-90 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        style={{ backdropFilter: 'blur(5px)' }}
>>>>>>> b519158c56c807d0aca03b25983aad5609f1f230
        onClick={onClose}
        aria-hidden={!isOpen} // Ocultar del árbol de accesibilidad cuando no está visible
      />
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
        // Asegurarse de que el modal no sea navegable por teclado cuando está invisible
        aria-hidden={!isOpen}
      >
        <button className="absolute top-4 right-4 text-white/70 hover:text-desertHighlightGold text-2xl font-bold transition-colors duration-200" onClick={onClose} aria-label="Close modal" ref={closeButtonRef}>
          ×
        </button>
        <h2 id="modal-title" className="text-desertHighlightGold font-arabicBold text-3xl text-center mb-1">
          {surah.name}
        </h2>
        <h3 className="text-white font-englishBold text-xl text-center mb-1">
          {surah.transliterationName}
        </h3>
        <div className="text-center text-sm text-white/60 mb-4">
          Surah {surah.number}
        </div>
        <div className="text-white/90 text-base text-center mt-2 overflow-y-auto max-h-64 leading-relaxed">
          {isLoading && <p className="text-white/70">Loading description...</p>}
          {error && <p className="text-red-400">{error}</p>}
          {!isLoading && !error && !description && <p className="text-white/50">No description available.</p>}
          {!isLoading && !error && description && (
            <p className="leading-relaxed">{description}</p>
          )}
        </div>
      </div>
    </Portal>
  );
};

export default SurahDescriptionModal;
