import type { FunctionalComponent } from 'preact';
import { useMemo } from 'preact/hooks';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  showNavigation: boolean;
}

const PaginationControls: FunctionalComponent<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  goToPreviousPage,
  goToNextPage,
  showNavigation,
}) => {
  const isFirstPage = useMemo(() => currentPage === 1, [currentPage]);
  const isLastPage = useMemo(() => currentPage === totalPages, [currentPage, totalPages]);

  if (!showNavigation) {
    return null;
  }

  return (
    <div className="flex justify-center items-center space-x-2 p-4">
      <button
        onClick={goToPreviousPage}
        disabled={isFirstPage}
        className={`px-4 py-2 rounded-lg font-englishRegular text-textSecondary ${
          isFirstPage ? 'opacity-50 cursor-not-allowed' : 'bg-primaryPurple hover:bg-opacity-80 transition-opacity duration-200'
        }`}
      >
        Previous
      </button>
      <span className="text-textSecondary font-englishRegular">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={goToNextPage}
        disabled={isLastPage}
        className={`px-4 py-2 rounded-lg font-englishRegular text-textSecondary ${
          isLastPage ? 'opacity-50 cursor-not-allowed' : 'bg-primaryPurple hover:bg-opacity-80 transition-opacity duration-200'
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;