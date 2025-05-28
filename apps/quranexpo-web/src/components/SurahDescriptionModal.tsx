import { useEffect, useRef, useState } from 'preact/hooks';
import { fetchSurahDescription } from '../services/apiClient';
import type { Surah } from '../types/quran';

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
  useEffect(() => {
    if (isOpen && surah) {
      setIsLoading(true);
      setError(null);
      fetchSurahDescription(surah.number)
        .then(data => {
          setDescription(data);
        })
        .catch(err => {
          console.error("Failed to fetch surah description:", err);
          setError("Failed to load description.");
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, surah?.number]); // Depende de isOpen y surah.number

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
  return (
    <>
      <div
        className={`fixed inset-0 bg-skyPurple/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-skyPurple/60 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-6 w-full max-w-md flex flex-col items-center transition-opacity duration-300
          ${isOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        ref={modalRef}
      >
        <button className="absolute top-4 right-4 text-white/70 hover:text-desertHighlightGold text-2xl" onClick={onClose} aria-label="Close modal" ref={closeButtonRef}>×</button>
        <h2 id="modal-title" className="text-desertHighlightGold font-arabicBold text-3xl text-center mb-1">
          {surah.name}
        </h2>
        <h3 className="text-white font-englishBold text-xl text-center mb-1">
          {surah.englishName}
        </h3>
        <div className="text-center text-sm text-gray-700 mb-4">
          Surah {surah.number}
        </div>
        <div className="text-white/90 text-base text-center mt-2">
          {isLoading && <p>Loading description...</p>}
          {error && <p className="text-red-400">{error}</p>}
          {!isLoading && !error && !description && <p>No description available.</p>}
          {!isLoading && !error && description &&
          description}
        </div>
      </div>
    </>
  );
};

export default SurahDescriptionModal;