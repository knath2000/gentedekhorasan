import { useRef, useState } from 'preact/hooks';
import type { Surah } from '../types/quran';
import SurahDescriptionModal from './SurahDescriptionModal';

interface ReaderSurahHeaderProps {
  surah: Surah | null;
  onModalStateChange?: (isOpen: boolean) => void;
  isPageInFocusMode?: boolean; // Nueva prop
}

const ReaderSurahHeader = ({ surah, onModalStateChange, isPageInFocusMode = false }: ReaderSurahHeaderProps) => {
  if (!surah) {
    return (
      <div className="py-6 px-4 text-center mb-4">
        <div className="h-8 w-1/2 mx-auto bg-[rgba(255,207,123,0.3)] rounded animate-pulse mb-2"></div>
        <div className="h-6 w-1/3 mx-auto bg-[rgba(32,32,64,0.7)] rounded animate-pulse"></div>
      </div>
    );
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const arabicTitleRef = useRef<HTMLHeadingElement>(null);
  const englishTitleRef = useRef<HTMLHeadingElement>(null);

  const openModal = () => {
    setIsModalOpen(true);
    onModalStateChange?.(true); // Notificar al padre
  };

  const closeModal = () => {
    setIsModalOpen(false);
    onModalStateChange?.(false); // Notificar al padre
    // Restaurar el foco al título árabe por defecto, o al que se considere principal
    arabicTitleRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      openModal();
    }
  };

  return (
    <div className={`py-6 px-4 text-center flex flex-col gap-2 ${isPageInFocusMode ? 'opacity-75 transition-opacity duration-300' : 'opacity-100'}`}>
      <h1
        className="font-arabicBold text-4xl text-desertHighlightGold cursor-pointer"
        dir="rtl"
        onClick={openModal}
        tabIndex={0}
        role="button"
        aria-haspopup="dialog"
        ref={arabicTitleRef}
        onKeyDown={handleKeyDown}
      >
        {surah.name}
      </h1>
      <h2
        className="font-englishBold text-2xl text-white cursor-pointer"
        onClick={openModal}
        tabIndex={0}
        role="button"
        aria-haspopup="dialog"
        ref={englishTitleRef}
        onKeyDown={handleKeyDown}
      >
        {surah.transliterationName}
      </h2>

      <SurahDescriptionModal surah={surah} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default ReaderSurahHeader;