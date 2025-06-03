import { createContext } from 'preact';
import { useCallback, useContext, useEffect, useReducer, useRef } from 'preact/hooks';
import { audioActive, setAudioActive } from '../../../stores/settingsStore';
import { getVerseAudioUrl } from '../../../utils/audioUtils';

interface AudioState {
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'error' | 'ended';
  error: string | null;
  duration: number;
  currentTime: number;
  currentVerseKey: string | null;
}

type AudioAction =
  | { type: 'LOAD_START' }
  | { type: 'LOADED_METADATA'; duration: number }
  | { type: 'PLAYING' }
  | { type: 'PAUSE' }
  | { type: 'ENDED' }
  | { type: 'ERROR'; message: string }
  | { type: 'TIME_UPDATE'; time: number }
  | { type: 'SEEK'; time: number }
  | { type: 'RESET' };

const audioReducer = (state: AudioState, action: AudioAction): AudioState => {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, status: 'loading', error: null };
    case 'LOADED_METADATA':
      return { ...state, duration: action.duration, status: 'loading' };
    case 'PLAYING':
      return { ...state, status: 'playing' };
    case 'PAUSE':
      return { ...state, status: 'paused' };
    case 'ENDED':
      return { ...state, status: 'ended', currentTime: 0 };
    case 'ERROR':
      return { ...state, status: 'error', error: action.message };
    case 'TIME_UPDATE':
      return { ...state, currentTime: action.time };
    case 'SEEK':
      return { ...state, currentTime: action.time };
    case 'RESET':
      return {
        status: 'idle',
        error: null,
        duration: 0,
        currentTime: 0,
        currentVerseKey: null,
      };
    // Removed 'SET_VERSE_KEY' action as it's redundant with other state management
    default:
      return state;
  }
};

class AudioPool {
  private pool: HTMLAudioElement[] = [];
  private activeAudio: HTMLAudioElement | null = null;
  private audioIdCounter = 0;
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== 'undefined';
  }

  getAudioInstance(): HTMLAudioElement | null {
    if (!this.isClient) {
      console.warn("[AudioPool] Attempted to get audio instance on server. Returning null.");
      return null;
    }
    if (this.pool.length > 0) {
      const audio = this.pool.pop()!;
      console.log(`[AudioPool] Reusing audio instance. Pool size: ${this.pool.length}`);
      return audio;
    }
    const audio = new Audio();
    audio.id = `audio-${++this.audioIdCounter}`;
    console.log(`[AudioPool] Creating new audio instance: ${audio.id}. Pool size: ${this.pool.length}`);
    return audio;
  }

  releaseAudioInstance(audio: HTMLAudioElement | null) {
    if (!this.isClient || !audio) return;

    console.log(`[AudioPool] Releasing audio instance: ${audio.id}.`);
    audio.pause();
    audio.removeAttribute('src');
    audio.src = '';
    audio.load();
    audio.currentTime = 0;
    if (this.pool.length < 5) {
      this.pool.push(audio);
    } else {
      console.log(`[AudioPool] Pool full, discarding instance: ${audio.id}.`);
    }
  }

  stopAllAndReleaseActive() {
    if (!this.isClient) return;

    console.log(`[AudioPool] stopAllAndReleaseActive: Clearing ${this.pool.length} instances in pool and active.`);
    if (this.activeAudio) {
      this.releaseAudioInstance(this.activeAudio);
      this.activeAudio = null;
    }
    this.pool.forEach(audio => {
      audio.pause();
      audio.removeAttribute('src');
      audio.src = '';
      audio.load();
      audio.currentTime = 0;
    });
    this.pool = [];
  }

  setActiveAudio(audio: HTMLAudioElement | null) {
    if (!this.isClient) return;
    if (this.activeAudio && this.activeAudio !== audio) {
      this.releaseAudioInstance(this.activeAudio);
    }
    this.activeAudio = audio;
  }

  getActiveAudio(): HTMLAudioElement | null {
    if (!this.isClient) return null;
    return this.activeAudio;
  }
}

const useCrossfadeTransition = (isClient: boolean) => {
  const fadeOut = useCallback((audio: HTMLAudioElement, duration = 200) => {
    return new Promise<void>((resolve) => {
      if (!isClient || !audio || audio.paused) {
        resolve();
        return;
      }
      const startVolume = audio.volume;
      const fadeStep = startVolume / (duration / 50);

      const fadeInterval = setInterval(() => {
        audio.volume = Math.max(0, audio.volume - fadeStep);
        if (audio.volume <= 0) {
          clearInterval(fadeInterval);
          audio.pause();
          audio.volume = startVolume;
          resolve();
        }
      }, 50);
    });
  }, [isClient]);

  const fadeIn = useCallback((audio: HTMLAudioElement, duration = 200) => {
    return new Promise<void>((resolve) => {
      if (!isClient || !audio) {
        resolve();
        return;
      }
      const targetVolume = 1;
      audio.volume = 0;
      audio.play();

      const fadeStep = targetVolume / (duration / 50);

      const fadeInterval = setInterval(() => {
        audio.volume = Math.min(targetVolume, audio.volume + fadeStep);
        if (audio.volume >= targetVolume) {
          clearInterval(fadeInterval);
          resolve();
        }
      }, 50);
    });
  }, [isClient]);

  return { fadeOut, fadeIn };
};

// Hook personalizado para el reproductor de audio, ahora dentro del contexto.
export const useAudioPlayerLogic = () => {
  const isClient = typeof window !== 'undefined';
  const audioPoolRef = useRef<AudioPool | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isClient && !audioPoolRef.current) {
      audioPoolRef.current = new AudioPool();
    }
  }, [isClient]);

  const [state, dispatch] = useReducer(audioReducer, {
    status: 'idle',
    error: null,
    duration: 0,
    currentTime: 0,
    currentVerseKey: null,
  });

  const { fadeOut, fadeIn } = useCrossfadeTransition(isClient);

  const cleanupAudio = useCallback(() => {
    if (!isClient || !audioRef.current) return;
    console.log(`[AUDIO STOP][Audio#${audioRef.current.id}] cleanupAudio: Pausing and unloading audio.`);
    audioPoolRef.current?.releaseAudioInstance(audioRef.current);
    audioRef.current = null;
  }, [isClient]);

  const stopAndUnloadCompletely = useCallback(() => {
    if (!isClient) return;
    console.log('[AUDIO STOP] stopAndUnloadCompletely called. Initiating complete stop and unload process.');
    audioPoolRef.current?.stopAllAndReleaseActive();
    audioRef.current = null;
    
    dispatch({ type: 'RESET' });
    setAudioActive(false);
    console.log('[AUDIO STOP] stopAndUnloadCompletely finished. Audio state reset.');
  }, [isClient]);

  const playVerse = useCallback(async (surahId: number, verseNumber: number) => {
    if (!isClient || !audioPoolRef.current) {
      console.warn("[Audio] Attempted to play verse on server or before AudioPool initialized.");
      return;
    }
    console.log(`[Audio] playVerse: Initiating playback for ${surahId}-${verseNumber}.`);
    const verseKey = `${surahId}-${verseNumber}`;
    setAudioActive(true);

    if (state.currentVerseKey === verseKey && state.status === 'playing' && !state.error) {
      console.log(`[Audio] playVerse: Already playing verse ${verseKey}.`);
      return;
    }

    const currentActiveAudio = audioPoolRef.current.getActiveAudio();
    if (currentActiveAudio && currentActiveAudio.src) {
      console.log(`[Audio#${currentActiveAudio.id}] Initiating fadeOut for current audio.`);
      await fadeOut(currentActiveAudio);
      audioPoolRef.current.releaseAudioInstance(currentActiveAudio);
    }

    const audio = audioPoolRef.current.getAudioInstance();
    if (!audio) {
      console.warn("[Audio] Could not get audio instance. Aborting playback.");
      dispatch({ type: 'ERROR', message: 'Audio not available' });
      return;
    }
    audioPoolRef.current.setActiveAudio(audio);
    audioRef.current = audio;

    dispatch({ type: 'LOAD_START' });
    dispatch({ type: 'SEEK', time: 0 });
    dispatch({ type: 'SET_VERSE_KEY', verseKey: verseKey });

    audio.src = getVerseAudioUrl(surahId, verseNumber);
    audio.load();

    try {
      await fadeIn(audio);
      console.log(`[Audio#${audio.id}] play() successful with fadeIn.`);
    } catch (error: any) {
      console.error(`[Audio#${audio.id}] Error playing audio with fadeIn:`, error);
      dispatch({ type: 'ERROR', message: 'Failed to play audio' });
      cleanupAudio();
    }
  }, [state.currentVerseKey, state.status, state.error, cleanupAudio, fadeOut, fadeIn, isClient]);

  const useAudioEventManager = (audioElement: HTMLAudioElement | null, dispatch: React.Dispatch<AudioAction>, isClient: boolean) => {
    useEffect(() => {
      if (!isClient || !audioElement) return;

      const audio = audioElement;
      const id = audio.id;

      const handleLoadedMetadata = () => {
        console.log(`[Audio#${id}] Event: loadedmetadata. Duration: ${audio.duration}. Network State: ${audio.networkState}. Ready State: ${audio.readyState >= 2}.`);
        dispatch({ type: 'LOADED_METADATA', duration: audio.duration });
      };
      const handleTimeUpdate = () => {
        dispatch({ type: 'TIME_UPDATE', time: audio.currentTime });
      };
      const handlePlaying = () => {
        console.log(`[Audio#${id}] Event: playing. Playing.`);
        dispatch({ type: 'PLAYING' });
      };
      const handlePause = () => {
        console.log(`[Audio#${id}] Event: pause. Paused.`);
        dispatch({ type: 'PAUSE' });
      };
      const handleError = (e: Event) => {
        const error = audio.error;
        let errorMessage = 'Unknown error';
        if (error) {
          switch (error.code) {
            case error.MEDIA_ERR_ABORTED:
              errorMessage = 'Audio playback aborted.';
              break;
            case error.MEDIA_ERR_NETWORK:
              errorMessage = 'Network error during audio download.';
              break;
            case error.MEDIA_ERR_DECODE:
              errorMessage = 'Audio decoding error.';
              break;
            case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMessage = 'Audio format not supported or invalid URL.';
              break;
            default:
              errorMessage = `Audio error: Code ${error.code}.`;
          }
        }
        console.error(`[Audio#${id}] Event: error. ${errorMessage}`, e, error);
        dispatch({ type: 'ERROR', message: errorMessage });
      };
      const handleWaiting = () => {
        console.log(`[Audio#${id}] Event: waiting. Buffering...`);
        dispatch({ type: 'LOAD_START' });
      };
      const handleCanPlay = () => {
        console.log(`[Audio#${id}] Event: canplay. Ready to play. Duration: ${audio.duration}.`);
      };
      const handleCanPlayThrough = () => {
        console.log(`[Audio#${id}] Event: canplaythrough. Can play through to end without interruptions.`);
      };
      const handleLoadStart = () => {
        console.log(`[Audio#${id}] Event: loadstart. Load started.`);
        dispatch({ type: 'LOAD_START' });
      };
      const handleProgress = () => {
        // console.log(`[Audio#${id}] Event: progress. Bytes loaded: ${audio.buffered.length > 0 ? audio.buffered.end(audio.buffered.length - 1) : 0}`);
      };

      const handleEnded = () => {
        console.log(`[Audio#${id}] Event: ended. Audio finished.`);
        dispatch({ type: 'ENDED' });
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('playing', handlePlaying);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      audio.addEventListener('waiting', handleWaiting);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('canplaythrough', handleCanPlayThrough);
      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('progress', handleProgress);

      return () => {
        console.log(`[Audio#${id}] useEffect cleanup: Removing listeners.`);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('playing', handlePlaying);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('waiting', handleWaiting);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
        audio.removeEventListener('loadstart', handleLoadStart);
        audio.removeEventListener('progress', handleProgress);
      };
    }, [audioElement, dispatch, isClient]);
  };

  useAudioEventManager(audioRef.current, dispatch, isClient);

  const pauseVerse = useCallback(() => {
    if (!isClient || !audioRef.current || audioRef.current.paused) return;
    console.log(`[Audio#${audioRef.current.id}] pauseVerse: Pausing.`);
    audioRef.current.pause();
    dispatch({ type: 'PAUSE' });
  }, [isClient]);

  const resumeVerse = useCallback(() => {
    const audio = audioRef.current;
    if (!isClient || !audio || !audio.paused) return;
    console.log(`[Audio#${audio.id}] resumeVerse: Resuming.`);
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
      }).catch(error => {
        console.error(`[Audio#${audio.id}] Error resuming audio:`, error);
        dispatch({ type: 'ERROR', message: 'Failed to resume audio' });
      });
    }
    dispatch({ type: 'PLAYING' });
  }, [isClient]);

  const seek = useCallback((time: number) => {
    if (!isClient || !audioRef.current) return;
    console.log(`[Audio#${audioRef.current.id}] seek: Seeking to ${time} seconds.`);
    audioRef.current.currentTime = time;
    dispatch({ type: 'SEEK', time: time });
  }, [isClient]);

  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${minutes}:${formattedSeconds}`;
  }, []);

  const handleSeekChange = useCallback((event: Event) => {
    const target = event.target as HTMLInputElement;
    const time = parseFloat(target.value);
    seek(time);
  }, [seek]);

  const togglePlayPause = useCallback(() => {
    if (!isClient) {
      console.warn("[togglePlayPause] Attempted to toggle play/pause on server.");
      return;
    }
    console.log('[togglePlayPause] Current status:', {
      status: state.status,
      currentVerseKey: state.currentVerseKey,
      audioRefExists: !!audioRef.current,
      audioSrc: audioRef.current?.src || 'no src'
    });
    
    if (state.status === 'playing') {
      console.log('[togglePlayPause] Audio playing, pausing...');
      pauseVerse();
    } else if (audioRef.current && audioRef.current.src && state.status === 'paused') {
      console.log('[togglePlayPause] Audio paused with src, resuming...');
      resumeVerse();
    } else if (state.currentVerseKey) {
      console.log('[togglePlayPause] No active audio but verse selected, playing...');
      const [surahId, verseNumber] = state.currentVerseKey.split('-').map(Number);
      playVerse(surahId, verseNumber);
    } else {
      console.log('[togglePlayPause] No conditions to play audio');
    }
  }, [state.status, state.currentVerseKey, pauseVerse, resumeVerse, playVerse, isClient]);

  useEffect(() => {
    if (!isClient) return;
    if (state.status === 'idle' && !state.currentVerseKey && audioActive.get()) {
      console.log('[useAudioPlayer] No active or loading audio, forcing setAudioActive(false).');
      setAudioActive(false);
    }
  }, [state.status, state.currentVerseKey, isClient]);

  return {
    status: state.status,
    error: state.error,
    duration: state.duration,
    currentTime: state.currentTime,
    currentVerseKey: state.currentVerseKey,
    playVerse,
    pauseVerse,
    resumeVerse,
    seek,
    stopAndUnload: stopAndUnloadCompletely,
    togglePlayPause,
    onSeekChange: handleSeekChange,
    formatTime,
  };
};

// Definir la interfaz para el contexto de audio
interface AudioContextType {
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'error' | 'ended';
  error: string | null;
  duration: number;
  currentTime: number;
  currentVerseKey: string | null;
  playVerse: (surahId: number, verseNumber: number) => void;
  pauseVerse: () => void;
  resumeVerse: () => void;
  seek: (time: number) => void;
  stopAndUnload: () => void;
  togglePlayPause: () => void;
  onSeekChange: (event: Event) => void;
  formatTime: (seconds: number) => string;
}

// Crear el contexto de audio
const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Proveedor del contexto de audio
interface AudioProviderProps {
  children: preact.ComponentChildren;
}

export const AudioProvider = ({ children }: AudioProviderProps) => {
  const audioPlayer = useAudioPlayerLogic(); // Usar el hook useAudioPlayerLogic

  return (
    <AudioContext.Provider value={audioPlayer}>
      {children}
    </AudioContext.Provider>
  );
};

// Hook personalizado para consumir el contexto de audio
export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};