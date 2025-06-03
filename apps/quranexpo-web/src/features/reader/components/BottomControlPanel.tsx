import { SkipIcon, StopIcon } from '../../../components/icons/AudioIcons';

interface BottomControlPanelProps {
  onStop: () => void;
  onSkip: () => void;
  isAudioActive: boolean;
  currentSurahName?: string;
  currentSurahNumber?: number;
  currentVerseNumber?: number;
  totalVerses?: number;
  isModalOpen?: boolean;
}

const BottomControlPanel = ({ onStop, onSkip, isAudioActive, isModalOpen = false, currentSurahName, currentSurahNumber, currentVerseNumber, totalVerses }: BottomControlPanelProps) => {
  const panelHeightClass = isAudioActive ? 'h-64' : 'h-28'; // Keep existing logic if necessary, or refactor for modularity

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
          <div className={`flex items-center justify-center w-full mb-4`}>
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
    </div>
  );
};

export default BottomControlPanel;
