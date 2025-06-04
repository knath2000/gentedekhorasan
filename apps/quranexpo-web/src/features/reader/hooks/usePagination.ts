import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import type { Verse } from '../../../types/quran'; // Ruta actualizada

interface PaginationState {
  currentPage: number;
  totalPages: number;
  versesPerPage: number;
  currentVerses: Verse[];
  firstVerseIndex: number;
  lastVerseIndex: number;
}

const getVersesPerPage = (totalVerses: number): number => {
  if (totalVerses <= 7) {
    return totalVerses; // No pagination for short surahs
  }
  return 7; // Limit to 7 verses per page
};

export const usePagination = (verses: Verse[], initialPage = 1) => {
  const totalVerses = verses.length;
  const versesPerPage = useMemo(() => getVersesPerPage(totalVerses), [totalVerses]);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(() => {
    if (versesPerPage === 0) return 1; // Avoid division by zero
    return Math.ceil(totalVerses / versesPerPage);
  }, [totalVerses, versesPerPage]);

  // Ensure currentPage is always valid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (currentPage < 1 && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const currentVerses = useMemo(() => {
    if (versesPerPage === 0) return verses; // No pagination
    const start = (currentPage - 1) * versesPerPage;
    const end = start + versesPerPage;
    return verses.slice(start, end);
  }, [verses, currentPage, versesPerPage]);

  const firstVerseIndex = useMemo(() => (currentPage - 1) * versesPerPage, [currentPage, versesPerPage]);
  const lastVerseIndex = useMemo(() => Math.min(currentPage * versesPerPage - 1, totalVerses - 1), [currentPage, versesPerPage, totalVerses]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const goToPreviousPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  return {
    currentPage,
    totalPages,
    versesPerPage,
    currentVerses,
    firstVerseIndex,
    lastVerseIndex,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    totalVerses,
  };
};