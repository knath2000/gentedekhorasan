import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SkipIcon, StopIcon } from './icons/AudioIcons';

interface BottomControlPanelProps {
  onStop: () => void;
  onSkip: () => void;
  isAudioActive: boolean;
  currentSurahName?: string;
  currentSurahNumber?: number;
  currentVerseNumber?: number;
  totalVerses?: number;
  currentPage: number;
  totalPages: number;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  showNavigation?: boolean;
  isModalOpen?: boolean;
}

const BottomControlPanel = ({
  onStop,
  onSkip,
  isAudioActive,
  isModalOpen = false,
  currentSurahName,
  currentSurahNumber,
  currentVerseNumber,
  totalVerses,
  currentPage,
  totalPages,
  goToPreviousPage,
  goToNextPage,
  showNavigation = true,
}: BottomControlPanelProps) => {
  const panelHeightClass = isAudioActive ? 'h-64' : 'h-28';
  const audioControlsVisibility = isAudioActive ? 'flex' : 'hidden';

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40
        bg-slate-800/80 backdrop-blur-sm border border-white/20 rounded-3xl
        py-5 px-6 shadow-2xl
        flex flex-col justify-center items-center
        transition-all duration-300 ease-in-out
        ${panelHeightClass}
        ${isModalOpen ? 'opacity-0 invisible translate-y-4' : 'opacity-100 visible translate-y-0'}
      `}
    >
      {/* Información contextual */}
      {isAudioActive && (
        <div className="flex flex-col items-center justify-center text-white mb-4">
          <div className="flex items-center space-x-2 font-englishMedium text-base mb-1">
            <span>📖</span>
            <span>Surah {currentSurahName} ({currentSurahNumber})</span>
          </div>
          <div className="text-desertHighlightGold font-englishMedium text-base mb-4">
            Verse {currentVerseNumber}/{totalVerses}
          </div>
          
          {/* Botones de audio */}
          <div className={`flex items-center ${showNavigation ? 'justify-between' : 'justify-center'} w-full mb-4`}>
            <div className="flex items-center space-x-4">
              <button
                onClick={onStop}
                className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-desertWarmOrange to-desertHighlightGold text-white shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out transform-gpu"
                aria-label="Stop audio"
              >
                <StopIcon size={28} />
              </button>
              <button
                onClick={onSkip}
                className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-skyDeepBlue to-skyLightBlue text-white shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out transform-gpu"
                aria-label="Skip to next verse"
              >
                <SkipIcon size={28} />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showNavigation && totalPages > 1 && (
        <div className="flex items-center space-x-6 text-white pt-2 border-t border-white/10">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-40 transition-all duration-200 active:scale-90"
            aria-label="Previous page"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-englishBold text-xl text-white/90 drop-shadow-md">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-40 transition-all duration-200 active:scale-90"
            aria-label="Next page"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default BottomControlPanel;
