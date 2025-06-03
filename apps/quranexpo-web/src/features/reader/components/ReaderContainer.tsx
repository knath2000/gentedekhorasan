import { useStore } from '@nanostores/preact';
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { showTranslation } from '../../../stores/settingsStore';
import type { Verse } from '../../../types/quran';
import { getVerseKey } from '../../../utils/audioUtils';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { useCustomPagination } from '../hooks/useCustomPagination';
import { useSurahData } from '../hooks/useSurahData';
import BottomControlPanel from './BottomControlPanel';
import PaginationControls from './PaginationControls';
import ReaderSurahHeader from './ReaderSurahHeader';
import ReaderVerseCardErrorBoundary from './ReaderVerseCardErrorBoundary';

interface ReaderContainerProps {
  surahId: number;
}

const ReaderContainer = ({ surahId }: ReaderContainerProps) => {
  const { surah, verses, loading, error: dataError } = useSurahData(surahId);

  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

  const handleModalStateChange = (isOpen: boolean) => {
    setIsDescriptionModalOpen(isOpen);
  };

  const $showTranslation = useStore(showTranslation);

  // Solo usar useAudioPlayer en el cliente
  const {
    status,
    error: audioError,
    duration,
    currentTime,
    currentVerseKey,
    playVerse,
    pauseVerse,
    resumeVerse,
    seek,
    stopAndUnload,
    togglePlayPause,
    onSeekChange: onSeekChangeFunction, // Renombrar para claridad, asume que maneja un número
    formatTime,
  } = useAudioPlayer();

  const isPlaying = status === 'playing';
  const isLoadingAudio = status === 'loading';
  const isAudioActive = status !== 'idle' && status !== 'error';

  const currentVerse = useMemo(() => {
    if (!verses || !currentVerseKey) return null;
    return verses.find((v: Verse) => getVerseKey(v.surahId, v.numberInSurah) === currentVerseKey);
  }, [verses, currentVerseKey]);

  // Extracted pagination logic to a separate component or hook for better modularity
  const { currentPage, totalPages, currentVerses, goToPage, goToNextPage, goToPreviousPage, versesPerPage } = useCustomPagination(verses);

  const verseRefs = useRef(new Map<number, HTMLDivElement>());

  const setVerseRef = useCallback((index: number, element: HTMLDivElement | null) => {
    if (element) {
      verseRefs.current.set(index, element);
    } else {
      verseRefs.current.delete(index);
    }
  }, []);

  const autoScrollProps = {
    activeVerseIndex: currentVerse ? verses.indexOf(currentVerse) : null,
    verses,
    currentPage,
    versesPerPage,
    goToPage,
    verseRefs: verseRefs.current, // Pass the current value of the ref
  };

  const { scrollToVerse } = useAutoScroll(autoScrollProps);

  useEffect(() => {
    if (currentVerse) {
      const activeIndex = verses.indexOf(currentVerse);
      if (activeIndex !== -1) {
        scrollToVerse(activeIndex);
      }
    }
  }, [currentVerse, verses, scrollToVerse]);

  const handleVerseAudioToggle = (verse: Verse) => {
    const verseKey = getVerseKey(verse.surahId, verse.numberInSurah);
    const isCurrentVerse = verseKey === currentVerseKey;

    if (!isCurrentVerse) {
      playVerse(verse.surahId, verse.numberInSurah);
    } else {
      togglePlayPause();
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <ReaderSurahHeader surah={null} />
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-desertWarmOrange"></div>
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="w-full">
        <ReaderSurahHeader surah={surah} />
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
          <div className="flex items-center">
            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <p>{dataError}</p>
          </div>
          <div className="mt-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!surah || verses.length === 0) {
    return (
      <div className="w-full">
        <ReaderSurahHeader surah={surah} />
        <div className="bg-skyPurple/30 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
          <p className="text-textSecondary font-englishRegular">
            {surah ? 'No verses found for this Surah.' : 'Surah data not available.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col relative h-full">
      <div className={`flex-1 overflow-y-auto space-y-4 pb-40 relative verse-container`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="opacity-0 animate-fade-in animation-delay-[100ms] relative">
          <ReaderSurahHeader
            surah={surah}
            onModalStateChange={handleModalStateChange}
          />
        </div>
        {currentVerses.map((verse: Verse, index: number) => {
          const verseKey = getVerseKey(verse.surahId, verse.numberInSurah);
          const isActiveAudio = currentVerseKey === verseKey;

          return (
            <div key={verse.id} className={`animate-list-item animate-item-${Math.min(index, 19)}`}>
              <ReaderVerseCardErrorBoundary
                ref={(el: HTMLDivElement | null) => setVerseRef(index, el)} // Maintain as is for indexing
                verse={verse}
                showTranslation={$showTranslation}
                isActiveAudio={isActiveAudio}
                isPlayingAudio={isActiveAudio && status === 'playing'}
                isLoadingAudio={isLoadingAudio}
                audioError={audioError}
                onAudioPress={() => handleVerseAudioToggle(verse)}
                currentTime={currentTime}
                duration={duration}
                onSeek={onSeekChangeFunction} // Debe coincidir con el tipo en ReaderVerseCard, que ahora maneja el evento internamente
                className="last:mb-0" // Ensure firstVerseIndex is handled if still used
              />
            </div>
          );
        })}
        <div className="h-4"></div>
      </div>

      {/* Controles de audio y navegación */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4">
        {(totalPages > 1 || isAudioActive) && ( // Keep the logic consistent
          <BottomControlPanel
            isModalOpen={isDescriptionModalOpen}
            isAudioActive={isAudioActive}
            onStop={stopAndUnload}
            onSkip={() => {
              const currentVerseIdx = currentVerse ? verses.indexOf(currentVerse) : -1;
              const nextIndex = currentVerseIdx + 1;
              if (nextIndex < verses.length) {
                playVerse(verses[nextIndex].surahId, verses[nextIndex].numberInSurah);
              } else {
                stopAndUnload();
              }
            }}
            currentSurahName={surah?.englishName}
            currentSurahNumber={surah?.number}
            currentVerseNumber={currentVerse?.numberInSurah}
            totalVerses={surah?.numberOfAyahs}
          />
        )}
        <PaginationControls
          currentPage={currentPage} // Ensure it's used correctly
          totalPages={totalPages}
          goToPreviousPage={goToPreviousPage}
          goToNextPage={goToNextPage}
          showNavigation={totalPages > 1} // Maintain consistent navigation logic
        />
      </div>
    </div>
  );
};

export default ReaderContainer;
