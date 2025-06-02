import { useEffect } from 'preact/hooks';
import type { Verse } from '../../../types/quran';

interface UseAutoScrollProps {
  activeVerseIndex: number | null;
  verses: Verse[];
  currentPage: number;
  versesPerPage: number;
  goToPage: (page: number) => void;
  verseRefs: Map<number, HTMLDivElement>;
}

export const useAutoScroll = ({ activeVerseIndex, verses, currentPage, versesPerPage, goToPage, verseRefs }: UseAutoScrollProps) => {
  const scrollToVerse = (index: number) => {
    const element = verseRefs.get(index);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    if (activeVerseIndex === null) return;

    // Calcular la página actual basada en el índice global
    const page = Math.floor(activeVerseIndex / versesPerPage);
    if (page !== currentPage) {
      goToPage(page);
    }

    // Desplazarse al verso activo
    scrollToVerse(activeVerseIndex);
  }, [activeVerseIndex, verses, currentPage, versesPerPage, goToPage, verseRefs, scrollToVerse]);

  return { scrollToVerse };
};