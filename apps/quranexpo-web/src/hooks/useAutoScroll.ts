import { useCallback, useEffect, useRef } from 'react';

interface UseAutoScrollProps {
  activeVerseIndex: number | null;
  verses: any[]; // Considerar tipar mejor 'Verse'
  currentPage: number;
  versesPerPage: number;
  goToPage: (page: number) => void;
  verseRefs: React.MutableRefObject<Map<number, HTMLDivElement>>;
}

export const useAutoScroll = ({
  activeVerseIndex,
  verses,
  currentPage,
  versesPerPage,
  goToPage,
  verseRefs,
}: UseAutoScrollProps) => {
  const isScrolling = useRef(false);

  const getVersePage = useCallback((verseIndex: number) => {
    return Math.floor(verseIndex / versesPerPage) + 1;
  }, [versesPerPage]);

  const isVerseInCurrentPage = useCallback((verseIndex: number) => {
    const startVerseIndex = (currentPage - 1) * versesPerPage;
    const endVerseIndex = startVerseIndex + versesPerPage - 1;
    return verseIndex >= startVerseIndex && verseIndex <= endVerseIndex;
  }, [currentPage, versesPerPage]);

  const scrollToVerse = useCallback((verseIndex: number) => {
    const verseElement = verseRefs.current.get(verseIndex);
    if (verseElement) {
      isScrolling.current = true;
      verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Reset isScrolling after a short delay to allow scroll to complete
      setTimeout(() => {
        isScrolling.current = false;
      }, 600); // Adjust delay based on scroll-behavior duration
    }
  }, []);

  useEffect(() => {
    if (activeVerseIndex === null || isScrolling.current || !verses.length) return;
    console.log('[AutoScroll] activeVerseIndex:', activeVerseIndex, 'currentPage:', currentPage);

    const targetPage = getVersePage(activeVerseIndex);

    if (targetPage !== currentPage) {
      goToPage(targetPage);
    } else {
      scrollToVerse(activeVerseIndex);
    }
  }, [activeVerseIndex, currentPage, goToPage, getVersePage, scrollToVerse]);

  return {
    isVerseInCurrentPage,
    scrollToVerse,
  };
};