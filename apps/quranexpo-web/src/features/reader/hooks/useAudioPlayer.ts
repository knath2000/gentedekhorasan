import { useEffect, useRef, useState } from 'preact/hooks';
import { getVerseAudioUrl } from '../../../utils/audioUtils';

export const useAudioPlayer = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentVerseKey, setCurrentVerseKey] = useState<string | null>(null);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setStatus('ended');
    const handleErrorEvent = (e: ErrorEvent) => {
      setError(e.message);
      setStatus('error');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleErrorEvent);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleErrorEvent);
    };
  }, []);

  const playVerse = (surahId: number, verseNumber: number) => {
    const url = getVerseAudioUrl(surahId, verseNumber);
    audioRef.current.src = url;
    setCurrentVerseKey(`${surahId}-${verseNumber}`);
    setStatus('loading');
    audioRef.current.load();
    audioRef.current.play().then(() => setStatus('playing')).catch((err) => {
      setError(err.message);
      setStatus('error');
    });
  };

  const pauseVerse = () => {
    if (audioRef.current.paused) return;
    audioRef.current.pause();
    setStatus('paused');
  };

  const resumeVerse = () => {
    if (!audioRef.current.paused) return;
    audioRef.current.play().then(() => setStatus('playing')).catch((err) => {
      setError(err.message);
      setStatus('error');
    });
  };

  const togglePlayPause = () => {
    if (status === 'playing') {
      pauseVerse();
    } else if (status === 'paused' || status === 'ended') {
      resumeVerse();
    }
  };

  const seek = (time: number) => {
    audioRef.current.currentTime = time;
  };

  const stopAndUnload = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.removeAttribute('src');
    setStatus('idle');
    setCurrentVerseKey(null);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
  };

  const onSeekChange = (time: number) => {
    seek(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return {
    status,
    error,
    duration,
    currentTime,
    currentVerseKey,
    playVerse,
    pauseVerse,
    resumeVerse,
    seek,
    stopAndUnload,
    togglePlayPause,
    onSeekChange,
    formatTime,
  };
};