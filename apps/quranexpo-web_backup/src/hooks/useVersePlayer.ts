import { useRef, useState, useEffect, useCallback, useReducer } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { getVerseAudioUrl } from '../utils/audioUtils';
import { autoplayEnabled, setAudioActive, audioActive } from '../stores/settingsStore';
import type { Verse } from '../types/quran';

interface AudioState {
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'error';
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
  | { type: 'RESET' }
  | { type: 'SET_VERSE_KEY'; verseKey: string | null };

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
      return { ...state, status: 'idle', currentTime: 0 }; // Reset currentTime on ended
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
    case 'SET_VERSE_KEY':
      return { ...state, currentVerseKey: action.verseKey };
    default:
      return state;
  }
};



class AudioPool {
  private pool: HTMLAudioElement[] = [];
  private activeAudio: HTMLAudioElement | null = null;
  private audioIdCounter = 0; // Contador interno para IDs

  getAudioInstance(): HTMLAudioElement {
    if (this.pool.length > 0) {
      const audio = this.pool.pop()!;
      console.log(`[AudioPool] Reutilizando instancia de audio. Pool size: ${this.pool.length}`);
      return audio;
    }
    const audio = new Audio();
    audio.id = `audio-${++this.audioIdCounter}`; // Asignar un ID único
    console.log(`[AudioPool] Creando nueva instancia de audio: ${audio.id}. Pool size: ${this.pool.length}`);
    return audio;
  }

  releaseAudioInstance(audio: HTMLAudioElement) {
    if (audio) {
      console.log(`[AudioPool] Liberando instancia de audio: ${audio.id}.`);
      audio.pause();
      audio.removeAttribute('src');
      audio.src = '';
      audio.load();
      audio.currentTime = 0;
      if (this.pool.length < 5) { // Limitar el tamaño del pool para no acumular demasiadas instancias
        this.pool.push(audio);
      } else {
        console.log(`[AudioPool] Pool lleno, descartando instancia: ${audio.id}.`);
      }
    }
  }

  stopAllAndReleaseActive() {
    console.log(`[AudioPool] stopAllAndReleaseActive: Limpiando ${this.pool.length} instancias en pool y activa.`);
    if (this.activeAudio) {
      this.releaseAudioInstance(this.activeAudio);
      this.activeAudio = null;
    }
    // Limpiar el pool también
    this.pool.forEach(audio => {
      audio.pause();
      audio.removeAttribute('src');
      audio.src = '';
      audio.load();
      audio.currentTime = 0;
    });
    this.pool = []; // Vaciar el pool
  }

  setActiveAudio(audio: HTMLAudioElement) {
    if (this.activeAudio && this.activeAudio !== audio) {
      this.releaseAudioInstance(this.activeAudio);
    }
    this.activeAudio = audio;
  }

  getActiveAudio(): HTMLAudioElement | null {
    return this.activeAudio;
  }
}

export const useVersePlayer = (verses?: Verse[]) => {
  const audioPoolRef = useRef(new AudioPool()); // Instancia del pool de audio
  const audioRef = useRef<HTMLAudioElement | null>(null); // Referencia al audio activo del pool

  const [state, dispatch] = useReducer(audioReducer, {
    status: 'idle',
    error: null,
    duration: 0,
    currentTime: 0,
    currentVerseKey: null,
  });
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number | null>(null);
  const $autoplayEnabled = useStore(autoplayEnabled);

  // Integrar el preloader
  useVersePreloader(verses, currentVerseIndex);

  const playVerseRef = useRef<(surahId: number, verseNumber: number) => void>();
  const stopAndUnloadCompletelyRef = useRef<() => void>(() => {});
  const skipToNextVerseRef = useRef<() => void>();

  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      console.log(`[AUDIO STOP][Audio#${audioRef.current.id}] cleanupAudio: Pausando y descargando audio.`);
      audioPoolRef.current.releaseAudioInstance(audioRef.current);
      audioRef.current = null;
    }
  }, []);

  stopAndUnloadCompletelyRef.current = useCallback(() => {
    console.log('[AUDIO STOP] stopAndUnloadCompletely called. Iniciando proceso de detención y descarga completa.');
    audioPoolRef.current.stopAllAndReleaseActive();
    audioRef.current = null; // Asegurarse de que la referencia local también se anule
    
    dispatch({ type: 'RESET' });
    setCurrentVerseIndex(null);
    setAudioActive(false);
    console.log('[AUDIO STOP] stopAndUnloadCompletely finalizado. Estado de audio reseteado.');
  }, []);

  const { fadeOut, fadeIn } = useCrossfadeTransition();

  playVerseRef.current = useCallback(async (surahId: number, verseNumber: number) => {
    console.log(`[Audio] playVerse: Iniciando reproducción para ${surahId}-${verseNumber}.`);
    const verseKey = `${surahId}-${verseNumber}`;
    setAudioActive(true);
    const verseIndex = verses?.findIndex(v => v.surahId === surahId && v.numberInSurah === verseNumber) ?? null;
    setCurrentVerseIndex(verseIndex);

    if (state.currentVerseKey === verseKey && state.status === 'playing' && !state.error) {
      console.log(`[Audio] playVerse: Ya reproduciendo el verso ${verseKey}.`);
      return;
    }

    const currentActiveAudio = audioPoolRef.current.getActiveAudio();
    if (currentActiveAudio && currentActiveAudio.src) {
      console.log(`[Audio#${currentActiveAudio.id}] Iniciando fadeOut para el audio actual.`);
      await fadeOut(currentActiveAudio);
      audioPoolRef.current.releaseAudioInstance(currentActiveAudio);
    }

    const audio = audioPoolRef.current.getAudioInstance();
    audioPoolRef.current.setActiveAudio(audio);
    audioRef.current = audio;

    dispatch({ type: 'LOAD_START' });
    dispatch({ type: 'SEEK', time: 0 });
    dispatch({ type: 'SET_VERSE_KEY', verseKey: verseKey });

    audio.src = getVerseAudioUrl(surahId, verseNumber);
    audio.load();

    try {
      await fadeIn(audio);
      console.log(`[Audio#${audio.id}] play() exitoso con fadeIn.`);
    } catch (error: any) {
      console.error(`[Audio#${audio.id}] Error al reproducir audio con fadeIn:`, error);
      dispatch({ type: 'ERROR', message: 'Failed to play audio' });
      cleanupAudio();
    }
  }, [state.currentVerseKey, state.status, state.error, cleanupAudio, verses, fadeOut, fadeIn]);

  // Define skipToNextVerse
  skipToNextVerseRef.current = useCallback(() => {
    console.log(`[Audio#${audioRef.current?.id}] skipToNextVerse called`); // Debug log
    if (verses && currentVerseIndex !== null) {
      const nextIndex = currentVerseIndex + 1;
      if (nextIndex < verses.length) {
        const nextVerse = verses[nextIndex];
        playVerseRef.current?.(nextVerse.surahId, nextVerse.numberInSurah);
      } else {
        stopAndUnloadCompletelyRef.current?.();
      }
    }
  }, [verses, currentVerseIndex]);

  // Nuevo hook para gestionar los event listeners
  const useAudioEventManager = (audioElement: HTMLAudioElement | null, dispatch: React.Dispatch<AudioAction>) => {
    useEffect(() => {
      if (!audioElement) return;

      const audio = audioElement;
      const id = audio.id; // Capturar el ID aquí

      const handleLoadedMetadata = () => {
        console.log(`[Audio#${id}] Event: loadedmetadata. Duración: ${audio.duration}. Estado de red: ${audio.networkState}. Listo para reproducir: ${audio.readyState >= 2}.`);
        dispatch({ type: 'LOADED_METADATA', duration: audio.duration });
      };
      const handleTimeUpdate = () => {
        dispatch({ type: 'TIME_UPDATE', time: audio.currentTime });
      };
      const handlePlaying = () => {
        console.log(`[Audio#${id}] Event: playing. Reproduciendo.`);
        dispatch({ type: 'PLAYING' });
      };
      const handlePause = () => {
        console.log(`[Audio#${id}] Event: pause. Pausado.`);
        dispatch({ type: 'PAUSE' });
      };
      const handleError = (e: Event) => {
        const error = audio.error;
        let errorMessage = 'Error desconocido';
        if (error) {
          switch (error.code) {
            case error.MEDIA_ERR_ABORTED:
              errorMessage = 'La reproducción de audio fue abortada.';
              break;
            case error.MEDIA_ERR_NETWORK:
              errorMessage = 'Error de red al descargar el audio.';
              break;
            case error.MEDIA_ERR_DECODE:
              errorMessage = 'Error de decodificación de audio.';
              break;
            case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMessage = 'El formato de audio no es compatible o la URL es inválida.';
              break;
            default:
              errorMessage = `Error de audio: Código ${error.code}.`;
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
        console.log(`[Audio#${id}] Event: canplay. Listo para reproducir. Duración: ${audio.duration}.`);
      };
      const handleCanPlayThrough = () => {
        console.log(`[Audio#${id}] Event: canplaythrough. Puede reproducir hasta el final sin interrupciones.`);
      };
      const handleLoadStart = () => {
        console.log(`[Audio#${id}] Event: loadstart. Inicio de carga.`);
        dispatch({ type: 'LOAD_START' });
      };
      const handleProgress = () => {
        // console.log(`[Audio#${id}] Event: progress. Bytes cargados: ${audio.buffered.length > 0 ? audio.buffered.end(audio.buffered.length - 1) : 0}`);
      };

      const handleEnded = () => {
        console.log(`[Audio#${id}] Event: ended. Audio finalizado, comprobando estado de autoplay.`);
        dispatch({ type: 'ENDED' });

        console.log(`[Audio#${id}] Autoplay habilitado (desde hook):`, $autoplayEnabled); // Añadir log del valor del hook
        console.log(`[Audio#${id}] Versos disponibles:`, !!verses, verses?.length);
        console.log(`[Audio#${id}] Índice de verso actual (desde el estado):`, currentVerseIndex);

        if ($autoplayEnabled && verses && currentVerseIndex !== null) {
          console.log(`[Audio#${id}] Condición de autoplay CUMPLIDA. Intentando reproducir siguiente verso.`);
          const nextIndex = currentVerseIndex + 1;
          console.log(`[Audio#${id}] Índice de verso actual:`, currentVerseIndex, 'Siguiente índice:', nextIndex);

          if (nextIndex < verses.length) {
            const nextVerse = verses[nextIndex];
            console.log(`[Audio#${id}] Reproduciendo siguiente verso:`, nextVerse.surahId, nextVerse.numberInSurah);
            if (playVerseRef.current) {
              playVerseRef.current(nextVerse.surahId, nextVerse.numberInSurah);
            } else {
              console.error(`[Audio#${id}] playVerseRef.current es undefined`);
            }
          } else {
            console.log(`[Audio#${id}] Alcanzado el final de los versos, deteniendo la reproducción.`);
            if (stopAndUnloadCompletelyRef.current) {
              stopAndUnloadCompletelyRef.current();
            }
            setAudioActive(false);
          }
        } else {
          console.log(`[Audio#${id}] Autoplay deshabilitado o no hay versos disponibles, deteniendo la reproducción.`);
          if (stopAndUnloadCompletelyRef.current) {
            stopAndUnloadCompletelyRef.current();
          }
          setAudioActive(false);
        }
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
        console.log(`[Audio#${id}] useEffect cleanup: Eliminando listeners.`);
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
    }, [audioElement, dispatch, currentVerseIndex, verses, playVerseRef, stopAndUnloadCompletelyRef, autoplayEnabled]);
  };

  useAudioEventManager(audioRef.current, dispatch);

  // Pause currently playing audio
  const pauseVerse = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      console.log(`[Audio#${audioRef.current.id}] pauseVerse: Pausando.`);
      audioRef.current.pause();
      dispatch({ type: 'PAUSE' });
    }
  }, []);

  // Resume playback of the current verse
  const resumeVerse = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.paused) {
      console.log(`[Audio#${audio.id}] resumeVerse: Reanudando.`);
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
        }).catch(error => {
          console.error(`[Audio#${audio.id}] Error al reanudar audio:`, error);
          dispatch({ type: 'ERROR', message: 'Failed to resume audio' });
        });
      }
      dispatch({ type: 'PLAYING' });
    }
  }, []);

  // Seek to a specific time in the audio
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      console.log(`[Audio#${audioRef.current.id}] seek: Buscando a ${time} segundos.`);
      audioRef.current.currentTime = time;
      dispatch({ type: 'SEEK', time: time });
    }
  }, []);

  // Formatea segundos a MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${minutes}:${formattedSeconds}`;
  }, []);

  // Maneja el cambio en la barra de progreso de audio
  const handleSeekChange = useCallback((event: Event) => {
    const target = event.target as HTMLInputElement;
    const time = parseFloat(target.value);
    seek(time);
  }, [seek]);

  // Toggle playback for a verse or current audio
  const togglePlayPause = useCallback(() => {
    console.log('[togglePlayPause] Estado actual:', {
      status: state.status,
      currentVerseKey: state.currentVerseKey,
      audioRefExists: !!audioRef.current,
      audioSrc: audioRef.current?.src || 'no src'
    });
    
    if (state.status === 'playing') {
      console.log('[togglePlayPause] Audio reproduciendo, pausando...');
      pauseVerse();
    } else if (audioRef.current && audioRef.current.src && state.status === 'paused') {
      console.log('[togglePlayPause] Audio pausado con src, reanudando...');
      resumeVerse();
    } else if (state.currentVerseKey) {
      console.log('[togglePlayPause] No hay audio activo pero hay verso seleccionado, reproduciendo...');
      const [surahId, verseNumber] = state.currentVerseKey.split('-').map(Number);
      if (playVerseRef.current) {
        playVerseRef.current(surahId, verseNumber);
      } else {
        console.error('[togglePlayPause] playVerseRef.current es undefined');
      }
    } else {
      console.log('[togglePlayPause] No hay condiciones para reproducir audio');
    }
  }, [state.status, state.currentVerseKey, pauseVerse, resumeVerse, playVerseRef]);

  // Add function to set current verse index
  const setVerseIndex = useCallback((index: number) => {
    setCurrentVerseIndex(index);
  }, []);

  // Efecto para asegurar que audioActive se desactive si no hay audio reproduciéndose o cargándose
  useEffect(() => {
    // Si no hay un verso activo o no se está reproduciendo/cargando, y audioActive está en true, desactívalo.
    // Esto cubre casos donde el audio se detiene por otras razones (ej. usuario cierra la pestaña, error, etc.)
    if (!$autoplayEnabled && state.status === 'idle' && !state.currentVerseKey && audioActive.get()) {
      console.log('[useVersePlayer] No hay audio activo o cargando, forzando setAudioActive(false).');
      setAudioActive(false);
    }
  }, [state.status, state.currentVerseKey, $autoplayEnabled]);

  // Export the functions using their ref.current values
  return {
    status: state.status, // Exponer el estado de status directamente
    error: state.error,
    duration: state.duration,
    currentTime: state.currentTime,
    currentVerseKey: state.currentVerseKey,
    playVerse: playVerseRef.current!,
    pauseVerse,
    resumeVerse,
    seek,
    stopAndUnload: stopAndUnloadCompletelyRef.current!,
    togglePlayPause,
    setVerseIndex,
    skipToNextVerse: skipToNextVerseRef.current!,
    onSeekChange: handleSeekChange,
    formatTime,
  };
};

// Hook para precargar el siguiente verso
const useVersePreloader = (verses: Verse[] | undefined, currentVerseIndex: number | null) => {
  const preloadCache = useRef(new Map<string, HTMLAudioElement>());

  useEffect(() => {
    if (verses && currentVerseIndex !== null && currentVerseIndex < verses.length - 1) {
      const nextVerse = verses[currentVerseIndex + 1];
      const nextUrl = getVerseAudioUrl(nextVerse.surahId, nextVerse.numberInSurah);

      if (!preloadCache.current.has(nextUrl)) {
        console.log(`[Preloader] Precargando: ${nextUrl}`);
        const preloadAudio = new Audio();
        preloadAudio.preload = 'auto'; // O 'metadata' si solo necesitas metadatos
        preloadAudio.src = nextUrl;
        preloadCache.current.set(nextUrl, preloadAudio);
      }
    }
  }, [verses, currentVerseIndex]);

  return preloadCache.current;
};

// Hook para transiciones suaves de audio (crossfade)
const useCrossfadeTransition = () => {
  const fadeOut = useCallback((audio: HTMLAudioElement, duration = 200) => {
    return new Promise<void>((resolve) => {
      if (!audio || audio.paused) {
        resolve();
        return;
      }
      const startVolume = audio.volume;
      const fadeStep = startVolume / (duration / 50); // Actualizar cada 50ms

      const fadeInterval = setInterval(() => {
        audio.volume = Math.max(0, audio.volume - fadeStep);
        if (audio.volume <= 0) {
          clearInterval(fadeInterval);
          audio.pause();
          audio.volume = startVolume; // Restaurar volumen para la próxima vez
          resolve();
        }
      }, 50);
    });
  }, []);

  const fadeIn = useCallback((audio: HTMLAudioElement, duration = 200) => {
    return new Promise<void>((resolve) => {
      if (!audio) {
        resolve();
        return;
      }
      const targetVolume = 1;
      audio.volume = 0;
      audio.play();

      const fadeStep = targetVolume / (duration / 50); // Actualizar cada 50ms

      const fadeInterval = setInterval(() => {
        audio.volume = Math.min(targetVolume, audio.volume + fadeStep);
        if (audio.volume >= targetVolume) {
          clearInterval(fadeInterval);
          resolve();
        }
      }, 50);
    });
  }, []);

  return { fadeOut, fadeIn };
};
