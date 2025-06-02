import { useState } from 'preact/hooks';
import type { Verse } from '../../../types/quran';

export const useCustomPagination = (verses: Verse[], initialPage = 1) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const versesPerPage = 10; // Or make it configurable based on settings
  const totalPages = Math.ceil(verses.length / versesPerPage);
  const currentVerses = verses.slice((currentPage - 1) * versesPerPage, currentPage * versesPerPage);
  const goToPage = (page: number) => setCurrentPage(page);
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  return { currentPage, totalPages, versesPerPage, currentVerses, goToPage, goToNextPage, goToPreviousPage };
};