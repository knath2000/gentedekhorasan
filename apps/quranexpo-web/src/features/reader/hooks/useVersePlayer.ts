import { useStore } from '@nanostores/preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { autoplayEnabled } from '../../../stores/settingsStore'; // Ruta actualizada
import type { Verse } from '../../../types/quran'; // Ruta actualizada
import { useAudioPlayer } from './useAudioPlayer'; // Continúa siendo una ruta relativa dentro de hooks

export const useVersePlayer = (verses?: Verse[]) => {
  const isClient = typeof window !== 'undefined';
  const $autoplayEnabled = useStore(autoplayEnabled);

  const [currentVerseIndex, setCurrentVerseIndex] = useState<number | null>(null);
  const [playingVerseIndex, setPlayingVerseIndex] = useState<number | null>(null);

  const {
    status,
    error: audioError,
    duration,
    currentTime,
    currentVerseKey,
    playVerse: playVerseFunction,
    pauseVerse,
    resumeVerse,
    seek,
    stopAndUnload,
    togglePlayPause,
    onSeekChange,
    formatTime,
  } = useAudioPlayer();

  const skipToNextVerse = useCallback(() => {
    if (!isClient) return;
    if (verses && playingVerseIndex !== null) {
      const nextIndex = playingVerseIndex + 1;
      if (nextIndex < verses.length) {
        const nextVerse = verses[nextIndex];
        playVerseFunction(nextVerse.surahId, nextVerse.numberInSurah);
        setPlayingVerseIndex(nextIndex);
      } else {
        stopAndUnload();
        setPlayingVerseIndex(null);
      }
    }
  }, [verses, playingVerseIndex, playVerseFunction, stopAndUnload, isClient]);

  // Efecto para manejar el autoplay al finalizar un verso
  useEffect(() => {
    if (!isClient || status !== 'ended' || !$autoplayEnabled || !verses || playingVerseIndex === null) {
      return;
    }

    const nextIndex = playingVerseIndex + 1;
    if (nextIndex < verses.length) {
      const nextVerse = verses[nextIndex];
      playVerseFunction(nextVerse.surahId, nextVerse.numberInSurah);
      setPlayingVerseIndex(nextIndex);
    } else {
      stopAndUnload();
      setPlayingVerseIndex(null);
    }
  }, [status, $autoplayEnabled, verses, playingVerseIndex, playVerseFunction, stopAndUnload, isClient]);

  // Sincronizar currentVerseKey con playingVerseIndex
  useEffect(() => {
    if (currentVerseKey && verses) {
      const [surahId, verseNumber] = currentVerseKey.split('-').map(Number);
      const index = verses.findIndex((v) => v.surahId === surahId && v.numberInSurah === verseNumber);
      if (index !== -1) {
        setPlayingVerseIndex(index);
      }
    } else if (!currentVerseKey) {
      setPlayingVerseIndex(null);
    }
  }, [currentVerseKey, verses]);

  // Manejo de errores para audio
  useEffect(() => {
    if (audioError) {
      console.error('Audio error occurred:', audioError);
      // Opcionalmente, notificar al usuario o manejar el error de otra manera, e.g., mediante un estado global o UI feedback
    }
  }, [audioError]);

  return {
    status,
    error: audioError,
    duration,
    currentTime,
    currentVerseKey,
    activeVerseIndex: playingVerseIndex,
    togglePlayPause,
    stopAndUnload,
    seek,
    setVerseIndex: setCurrentVerseIndex, // Exponer para que ReaderContainer pueda establecer el índice
    skipToNextVerse,
    onSeekChange,
    formatTime,
    playVerse: useCallback((surahId: number, verseNumber: number) => {
      const index = verses?.findIndex((v) => v.surahId === surahId && v.numberInSurah === verseNumber) ?? null;
      setCurrentVerseIndex(index);
      setPlayingVerseIndex(index);
      playVerseFunction(surahId, verseNumber);
    }, [verses, playVerseFunction]),
  };
};
