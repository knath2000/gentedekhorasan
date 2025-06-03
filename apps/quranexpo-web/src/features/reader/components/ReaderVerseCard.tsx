import { $authStore } from '@clerk/astro/client';
import { useStore } from '@nanostores/react';
import { forwardRef, type Ref } from 'preact/compat';
import { useState } from 'preact/hooks';
import { ErrorIcon } from '../../../components/icons/AudioIcons';
import { BookmarkIcon } from '../../../components/icons/BookmarkIcon';
import Portal from '../../../components/Portal';
import ToastNotification from '../../../components/ToastNotification';
import { fetchSurahById } from '../../../services/apiClient';
import { addBookmark, isBookmarked, removeBookmark } from '../../../stores/bookmarkStore';
import type { Verse } from '../../../types/quran';

interface ReaderVerseCardProps {
  verse: Verse;
  showTranslation: boolean;
  isActiveAudio?: boolean;
  isPlayingAudio?: boolean;
  isLoadingAudio?: boolean;
  audioError?: string | null;
  onAudioPress?: () => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void; // Acepta un número, manejado internamente en el componente
  className?: string;
}

export const ReaderVerseCard = forwardRef<HTMLDivElement, ReaderVerseCardProps>(({
  verse,
  showTranslation = true,
  isActiveAudio = false,
  isPlayingAudio = false,
  isLoadingAudio = false,
  audioError = null,
  onAudioPress = () => {},
  currentTime = 0,
  duration = 0,
  onSeek = (time: number) => {}, // Llama a onSeek con el tiempo extraído del evento
  className,
}: ReaderVerseCardProps, ref: Ref<HTMLDivElement>) => {
  const auth = useStore($authStore);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const currentIsBookmarked = isBookmarked(verse.surahId, verse.numberInSurah);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleBookmarkToggle = async (e: Event) => {
    e.stopPropagation(); // Prevent triggering audio play
    if (!auth.userId) {
      showNotification('Please sign in to add bookmarks.', 'info');
      return;
    }

    const verseKey = `${verse.surahId}-${verse.numberInSurah}`;
    if (currentIsBookmarked) {
      await removeBookmark(auth.userId, verseKey);
      showNotification('Bookmark removed!', 'info');
    } else {
      const surahData = await fetchSurahById(verse.surahId);
      const surahName = surahData?.englishName || `Surah ${verse.surahId}`;
      await addBookmark(auth.userId, verse, surahName);
      showNotification('Bookmark added!', 'success');
    }
  };

  const handleAudioClick = (e: Event) => {
    e.stopPropagation(); // Prevent triggering bookmark toggle if clicked on audio controls
    onAudioPress();
  };

  const handleSeekChange = (e: Event) => {
    if (e.target instanceof HTMLInputElement) {
      const time = parseFloat(e.target.value);
      onSeek(time); // Llama a onSeek con el número extraído
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const getCardClassNames = () => {
    let dynamicClasses = "verse-card";

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
      onClick={handleAudioClick} // Clic normal para audio
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 glassmorphism z-0"></div>
      
      {/* Verse number in circle */}
      <div className="verse-number-circle">
        <span className="text-skyDeepBlue font-englishBold text-sm">
          {verse.numberInSurah}
        </span>
      </div>
      
      {/* Text container */}
      <div className={`verse-text-container ${isPlayingAudio ? 'verse-body-gradient-shift' : ''}`}>
        {/* Arabic text */}
        <p
          className="arabic-text"
          dir="rtl"
        >
          {verse.verseText}
        </p>
        
        {/* English translation (if enabled) */}
        {showTranslation && verse.translation && (
          <p className="english-translation">
            {verse.translation}
          </p>
        )}

        {isActiveAudio && (
          <div className="audio-controls">
            <span className="audio-time">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onInput={handleSeekChange} // Usar handleSeekChange para manejar el evento
              step="0.01" // Ajustado para una granularidad más fina
              className="audio-progress-bar"
              style={{
                background: `linear-gradient(to right, var(--tw-colors-desertWarmOrange) ${((currentTime / duration) * 100) || 0}%, var(--tw-colors-desertHighlightGold) ${((currentTime / duration) * 100) || 0}%)`,
              }}
            />
            <span className="audio-time">{formatTime(duration)}</span>
          </div>
        )}
        
        {/* Error indicator (only if there's an error and this verse is active) */}
        {isActiveAudio && audioError && (
          <div className="audio-error">
            <ErrorIcon size={12} className="text-red-500 mr-1" />
            <span>Error playing audio</span>
          </div>
        )}
      </div>

      {/* Bookmark Icon */}
      <button
        type="button"
        onClick={handleBookmarkToggle}
        className={`absolute top-2 right-2 p-2 rounded-full transition-colors duration-200 ${currentIsBookmarked ? 'text-desertHighlightGold bg-skyDeepBlue/50' : 'text-white/50 hover:text-desertHighlightGold hover:bg-skyDeepBlue/30'} z-20`}
        aria-label={currentIsBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        <BookmarkIcon size={20} />
      </button>

      {showToast && (
        <Portal>
          <ToastNotification
            message={toastMessage}
            type={toastType}
            onClose={() => setShowToast(false)}
          />
        </Portal>
      )}
    </div>
  );
});
