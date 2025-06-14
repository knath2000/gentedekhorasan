import { $authStore } from '@clerk/astro/client';
import { useStore } from '@nanostores/react';
import { forwardRef, type Ref } from 'preact/compat'; // Import forwardRef and type Ref from 'preact/compat'
import { useRef } from 'preact/hooks';
import { fetchSurahById } from '../services/apiClient';
import { addBookmark, isBookmarked, removeBookmark } from '../stores/bookmarkStore';
import type { Verse } from '../types/quran';
import { ErrorIcon } from './icons/AudioIcons';

interface ReaderVerseCardProps {
  verse: Verse;
  showTranslation: boolean;
<<<<<<< HEAD
  useAiTranslation?: boolean;
=======
  showAITranslation: boolean; // Nueva prop
  aiTranslation?: string; // Nueva prop
  isLoadingAITranslation?: boolean; // Nueva prop
  aiTranslationError?: string | null; // Nueva prop
>>>>>>> b519158c56c807d0aca03b25983aad5609f1f230
  isActiveAudio?: boolean;
  isPlayingAudio?: boolean;
  isLoadingAudio?: boolean;
  audioError?: string | null;
  onAudioPress?: () => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (value: number) => void; // CAMBIADO: Aceptar un número directamente
  className?: string;
}

export const ReaderVerseCard = forwardRef<HTMLDivElement, ReaderVerseCardProps>(({
  verse,
  showTranslation = true,
<<<<<<< HEAD
  useAiTranslation = false,
=======
  showAITranslation = false, // Valor por defecto
  aiTranslation = '', // Valor por defecto
  isLoadingAITranslation = false, // Valor por defecto
  aiTranslationError = null, // Valor por defecto
>>>>>>> b519158c56c807d0aca03b25983aad5609f1f230
  isActiveAudio = false,
  isPlayingAudio = false,
  isLoadingAudio = false,
  audioError = null,
  onAudioPress = () => {},
  currentTime = 0,
  duration = 0,
  onSeek = () => {},
  className,
}: ReaderVerseCardProps, ref: Ref<HTMLDivElement>) => { // Explicitly type props and ref
  const longPressTimer = useRef<number | null>(null);
  const isLongPress = useRef(false);
  const auth = useStore($authStore); // Obtener el estado de autenticación

  const handleTouchStart = (e: TouchEvent) => {
    longPressTimer.current = window.setTimeout(async () => {
      isLongPress.current = true;
      if (!auth.userId) {
        alert('Please sign in to add bookmarks.');
        return;
      }
      const verseKey = `${verse.surahId}-${verse.numberInSurah}`;
      if (isBookmarked(verse.surahId, verse.numberInSurah)) {
        removeBookmark(auth.userId, verseKey);
        alert('Bookmark removed!'); // Notificación simple
      } else {
        const surahData = await fetchSurahById(verse.surahId);
        const surahName = surahData?.englishName || `Surah ${verse.surahId}`;
        addBookmark(auth.userId, verse, surahName);
        alert('Bookmark added!'); // Notificación simple
      }
    }, 500); // 500ms para pulsación larga
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    isLongPress.current = false;
  };

  const handleMouseDown = (e: MouseEvent) => {
    longPressTimer.current = window.setTimeout(async () => {
      isLongPress.current = true;
      if (!auth.userId) {
        alert('Please sign in to add bookmarks.');
        return;
      }
      const verseKey = `${verse.surahId}-${verse.numberInSurah}`;
      if (isBookmarked(verse.surahId, verse.numberInSurah)) {
        removeBookmark(auth.userId, verseKey);
        alert('Bookmark removed!'); // Notificación simple
      } else {
        const surahData = await fetchSurahById(verse.surahId);
        const surahName = surahData?.englishName || `Surah ${verse.surahId}`;
        addBookmark(auth.userId, verse, surahName);
        alert('Bookmark added!'); // Notificación simple
      }
    }, 500); // 500ms para pulsación larga
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    isLongPress.current = false;
  };

  const handleClick = (e: Event) => {
    if (isLongPress.current) {
      e.preventDefault(); // Prevenir el clic si fue una pulsación larga
      return;
    }
    onAudioPress(); // Ejecutar el clic normal (reproducción de audio)
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const getCardClassNames = () => {
    const baseClasses = "relative flex flex-row items-start overflow-hidden p-4 mb-3 rounded-xl cursor-pointer bg-skyPurple/60 backdrop-blur-xl border border-white/10 transition-all duration-300 ease-in-out";
    
    let dynamicClasses = baseClasses;

    if (isActiveAudio) {
      dynamicClasses += ` verse-border-gradient-flow`;
      if (isLoadingAudio) {
        dynamicClasses += ` verse-audio-loading`;
      } else if (isPlayingAudio) {
        dynamicClasses += ` verse-audio-playing`;
      }
    }

    return dynamicClasses;
  };

  return (
    <div
      ref={ref} // Assign the forwarded ref to the div
      id={`verse-${verse.surahId}-${verse.numberInSurah}`} // Añadir ID para scroll
      className={`${getCardClassNames()} ${className || ''}`} // Apply className prop
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Para manejar el caso de arrastrar el ratón fuera
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 glassmorphism z-0"></div>
      
      {/* Verse number in circle */}
      <div className="relative z-10 bg-desertHighlightGold rounded-full w-9 h-9 flex justify-center items-center mr-4 flex-shrink-0">
        <span className="text-skyDeepBlue font-englishBold text-sm">
          {verse.numberInSurah}
        </span>
      </div>
      
      {/* Text container */}
      <div className={`relative z-10 flex-1 ${isPlayingAudio ? 'verse-body-gradient-shift' : ''}`}>
        {/* Arabic text */}
        <p
          className="text-textArabic font-arabicRegular text-3xl text-right mb-2 leading-relaxed"
          dir="rtl"
        >
          {verse.verseText}
        </p>
        
        {/* English translation (if enabled) */}
        {showTranslation && verse.translation && (
<<<<<<< HEAD
          <p className="text-textSecondary font-englishRegular text-base italic text-center">
            {useAiTranslation ? `[AI] ${verse.translation}` : verse.translation}
=======
          <p className="text-textSecondary font-englishRegular text-base italic text-center mb-2">
            {verse.translation}
>>>>>>> b519158c56c807d0aca03b25983aad5609f1f230
          </p>
        )}

        {/* AI Translation (if enabled) */}
        {showAITranslation && (
          <div className="mt-2">
            {isLoadingAITranslation ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-desertWarmOrange"></div>
                <span className="text-textSecondary text-sm ml-2">Generating AI translation...</span>
              </div>
            ) : aiTranslationError ? (
              <div className="text-red-500 flex items-center text-sm">
                <ErrorIcon size={12} className="text-red-500 mr-1" />
                <span>{aiTranslationError}</span>
              </div>
            ) : aiTranslation && (
              <p className="text-textPrimary font-englishRegular text-base text-center border-t border-white/10 pt-2">
                {aiTranslation}
              </p>
            )}
          </div>
        )}

        {isActiveAudio && (
          <div className="w-full flex items-center space-x-2 mt-2">
            <span className="text-xs text-textSecondary bg-skyDeepBlue/40 px-1 rounded">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onInput={(e) => onSeek((e.target as HTMLInputElement).valueAsNumber)} // Extraer el valor numérico
              step="0.01" // Ajustado para una granularidad más fina
              className="flex-1 h-1 bg-skyIndigo/50 rounded-lg appearance-none cursor-pointer range-sm"
              style={{
                background: `linear-gradient(to right, var(--tw-colors-desertWarmOrange) ${((currentTime / duration) * 100) || 0}%, var(--tw-colors-desertHighlightGold) ${((currentTime / duration) * 100) || 0}%)`,
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
                outline: 'none',
                height: '8px',
                borderRadius: '9999px',
                boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.2)',
                transition: 'background 0.1s linear',
              }}
            />
            <span className="text-xs text-textSecondary bg-skyDeepBlue/40 px-1 rounded">{formatTime(duration)}</span>
          </div>
        )}
        
        {/* Error indicator (only if there's an error and this verse is active) */}
        {isActiveAudio && audioError && (
          <div className="mt-2 text-red-500 flex items-center text-xs">
            <ErrorIcon size={12} className="text-red-500 mr-1" />
            <span>Error playing audio</span>
          </div>
        )}
      </div>
    </div>
  );
}); // Close forwardRef
