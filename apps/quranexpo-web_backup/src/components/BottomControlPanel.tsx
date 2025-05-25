import { h } from 'preact';
import { StopIcon, SkipIcon } from './icons/AudioIcons';
import { ChevronLeft, ChevronRight } from 'lucide-preact'; // Importar iconos de paginación

interface BottomControlPanelProps {
  onStop: () => void;
  onSkip: () => void;
  isAudioActive: boolean; // Renombrado de isVisible para mayor claridad
  currentSurahName?: string;
  currentSurahNumber?: number;
  currentVerseNumber?: number;
  totalVerses?: number;
  
  // Props de paginación
  currentPage: number;
  totalPages: number;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  showNavigation?: boolean; // Nueva prop para controlar la visibilidad de la navegación
}

const BottomControlPanel = ({
  onStop,
  onSkip,
  isAudioActive,
  currentSurahName,
  currentSurahNumber,
  currentVerseNumber,
  totalVerses,
  currentPage,
  totalPages,
  goToPreviousPage,
  goToNextPage,
  showNavigation = true, // Asignar valor por defecto directamente en la desestructuración
}: BottomControlPanelProps) => {
  // Determinar la altura del panel basada en si el audio está activo o si la navegación está visible
  const panelHeightClass = isAudioActive ? 'h-48' : 'h-16'; // Aumentado a 192px para un espacio adicional en la parte inferior
  const audioControlsVisibility = isAudioActive ? 'flex' : 'hidden';

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[999] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl py-5 px-4 min-w-[320px] w-[calc(100%-2rem)] max-w-md flex flex-col justify-center items-center shadow-2xl transition-all duration-300 ease-in-out ${panelHeightClass}`}>
      {/* Controles de audio (condicionalmente visibles) */}
      <div className={`${audioControlsVisibility} flex-col items-center justify-between w-full mb-4`}>
        {/* Información contextual y estado de reproducción */}
        <div className="flex items-center justify-between text-sm text-white/80 mb-3 w-full">
          <div className="flex items-center space-x-2 font-englishMedium text-base">
            <span>📖</span>
            <span>Surah {currentSurahName} ({currentSurahNumber})</span>
          </div>
          <div className="text-desertHighlightGold font-englishMedium text-base">
            Verse {currentVerseNumber}/{totalVerses}
          </div>
        </div>
        
        {/* Controles de audio principales */}
        <div className="flex items-center justify-between w-full mb-4">
          <span className="text-white text-lg font-englishBold animate-pulse">
            Currently Playing
          </span>
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

      {/* Controles de paginación (condicionalmente visibles) */}
      {showNavigation && totalPages > 1 && (
        <div className="flex items-center space-x-6 text-white w-full justify-center pt-2 border-t border-white/10">
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
