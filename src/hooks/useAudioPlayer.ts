// src/hooks/useAudioPlayer.ts
import { Audio, AVPlaybackStatus, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { useCallback, useEffect, useReducer, useRef } from 'react';

// --- Constants ---
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;
const DEBUG = false; // Debug mode toggle

// --- Helper Functions ---
const isNetworkError = (error: any): boolean => {
  const errorMessage = error?.message?.toLowerCase() || '';
  return errorMessage.includes('network') || errorMessage.includes('connection') || errorMessage.includes('timeout');
};

const formatAudioUrl = (surahId: number, verseNumber: number) => {
  const formattedSurah = surahId.toString().padStart(3, '0');
  const formattedVerse = verseNumber.toString().padStart(3, '0');
  return `https://everyayah.com/data/Alafasy_128kbps/${formattedSurah}${formattedVerse}.mp3`;
};

const getVerseKey = (surah: number, verse: number) => `${surah}-${verse}`;
const parseVerseKey = (key: string | null): { surah: number; verse: number } | null => {
  if (!key) return null;
  const parts = key.split('-');
  if (parts.length !== 2) return null;
  const surah = parseInt(parts[0], 10);
  const verse = parseInt(parts[1], 10);
  if (isNaN(surah) || isNaN(verse)) return null;
  return { surah, verse };
};


// --- State, Actions, Reducer ---
type AudioPlayerStatus =
  | 'idle'
  | 'loading_requested' // User requested play, about to load
  | 'loading_audio'     // Audio is actively loading
  | 'buffering'
  | 'playing'
  | 'pausing_requested' // User requested pause
  | 'paused'
  | 'resuming_requested'// User requested resume
  | 'stopping_requested'// User requested stop
  | 'stopped'           // Playback completed naturally
  | 'seeking_requested' // User requested seek
  | 'error';

type AudioState = {
  activeVerseKey: string | null; // Verse user intends to play or is interacting with
  loadedVerseKey: string | null; // Verse currently loaded/loading in sound object
  status: AudioPlayerStatus;
  positionMillis: number;
  durationMillis: number;
  error: string | null;
  autoplayEnabled: boolean;
  surahNumber: number;
  totalVersesInSurah: number;
  retryCount: number; // For retrying a specific verse load
  pendingSeekPosition: number | null; // Store seek position when requested
};

type AudioAction =
  | { type: 'REQUEST_PLAY'; surah: number; verse: number }
  | { type: 'REQUEST_PAUSE' }
  | { type: 'REQUEST_RESUME' }
  | { type: 'REQUEST_STOP' }
  | { type: 'REQUEST_SEEK'; positionMillis: number }
  | { type: 'AUDIO_LOADING_INITIATED'; key: string } // Sound object is about to load
  | { type: 'AUDIO_LOADED_AND_PLAYING'; key: string; durationMillis: number }
  | { type: 'AUDIO_PAUSE_INITIATED' } // Sound object is about to pause
  | { type: 'AUDIO_PAUSED_SUCCESS' }
  | { type: 'AUDIO_RESUME_INITIATED' } // Sound object is about to resume
  | { type: 'AUDIO_RESUMED_SUCCESS' }
  | { type: 'AUDIO_STOP_INITIATED' } // Sound object is about to stop/unload
  | { type: 'AUDIO_STOPPED_OR_COMPLETED'; didJustFinish: boolean } // Stopped (manual) or completed (natural)
  | { type: 'AUDIO_SEEK_INITIATED'; positionMillis: number }
  | { type: 'AUDIO_SEEK_COMPLETED'; positionMillis: number }
  | { type: 'AUDIO_BUFFERING_UPDATE'; isBuffering: boolean }
  | { type: 'AUDIO_POSITION_UPDATE'; positionMillis: number; durationMillis?: number }
  | { type: 'AUDIO_ERROR'; error: string; key?: string }
  | { type: 'SET_AUTOPLAY'; enabled: boolean }
  | { type: 'SET_SURAH_CONTEXT'; surah: number; totalVerses: number }
  | { type: 'RESET_PLAYER' }
  | { type: 'INCREMENT_RETRY'; key: string }
  | { type: 'CLEAR_RETRY'; key: string };


const initialStateFactory = (
  initialSurahNumber: number,
  initialTotalVerses: number,
  initialAutoplayEnabled: boolean
): AudioState => ({
  activeVerseKey: null,
  loadedVerseKey: null,
  status: 'idle',
  positionMillis: 0,
  durationMillis: 0,
  error: null,
  autoplayEnabled: initialAutoplayEnabled,
  surahNumber: initialSurahNumber,
  totalVersesInSurah: initialTotalVerses,
  retryCount: 0,
  pendingSeekPosition: null,
});

function audioReducer(state: AudioState, action: AudioAction): AudioState {
  if (DEBUG) console.log(`[Reducer] Action: ${action.type}`, action, 'Current State:', state);
  switch (action.type) {
    case 'SET_AUTOPLAY':
      return { ...state, autoplayEnabled: action.enabled };
    case 'SET_SURAH_CONTEXT':
      if (state.surahNumber !== action.surah) {
        return {
          ...initialStateFactory(action.surah, action.totalVerses, state.autoplayEnabled),
          surahNumber: action.surah,
          totalVersesInSurah: action.totalVerses,
        };
      }
      return { ...state, surahNumber: action.surah, totalVersesInSurah: action.totalVerses };

    case 'REQUEST_PLAY': {
      const key = getVerseKey(action.surah, action.verse);
      if (state.status === 'loading_requested' || state.status === 'loading_audio') {
        if (DEBUG) console.log(`[Reducer] Play request for ${key} while already loading ${state.activeVerseKey}. Ignoring.`);
        return state; // Already processing a load
      }
      if (state.loadedVerseKey === key && state.status === 'paused') {
        return { ...state, status: 'resuming_requested', activeVerseKey: key };
      }
      return {
        ...state,
        activeVerseKey: key,
        status: 'loading_requested',
        error: null,
        positionMillis: 0,
        durationMillis: 0,
        retryCount: 0,
        loadedVerseKey: null, // Will be set by AUDIO_LOADING_INITIATED
      };
    }
    case 'REQUEST_PAUSE':
      if (state.status === 'playing') {
        return { ...state, status: 'pausing_requested' };
      }
      return state;
    case 'REQUEST_RESUME':
      if (state.status === 'paused' && state.loadedVerseKey) {
        return { ...state, status: 'resuming_requested' };
      }
      return state;
    case 'REQUEST_STOP':
      if (state.status !== 'idle' && state.status !== 'stopped' && state.status !== 'stopping_requested') {
        return { ...state, status: 'stopping_requested' };
      }
      return state;
    
    case 'REQUEST_SEEK':
      if (state.status === 'playing' || state.status === 'paused' || state.status === 'buffering') {
        return { ...state, status: 'seeking_requested', pendingSeekPosition: action.positionMillis };
      }
      return state;

    case 'AUDIO_LOADING_INITIATED':
      return { ...state, status: 'loading_audio', loadedVerseKey: action.key, error: null, retryCount: 0 };

    case 'AUDIO_LOADED_AND_PLAYING':
      return {
        ...state,
        status: 'playing',
        loadedVerseKey: action.key,
        activeVerseKey: action.key,
        durationMillis: action.durationMillis,
        positionMillis: 0,
        error: null,
        retryCount: 0,
      };
    case 'AUDIO_PAUSE_INITIATED':
      return { ...state, status: 'buffering' }; // Or a more specific 'pausing_audio' if needed
    case 'AUDIO_PAUSED_SUCCESS':
      return { ...state, status: 'paused' };
    case 'AUDIO_RESUME_INITIATED':
      return { ...state, status: 'buffering' }; // Or a more specific 'resuming_audio'
    case 'AUDIO_RESUMED_SUCCESS':
      return { ...state, status: 'playing' };
    case 'AUDIO_STOP_INITIATED':
      return { ...state, status: 'buffering' }; // Or 'stopping_audio'

    case 'AUDIO_STOPPED_OR_COMPLETED':
      const baseNextState: AudioState = {
        ...state,
        positionMillis: 0,
        loadedVerseKey: action.didJustFinish ? null : state.loadedVerseKey,
        activeVerseKey: action.didJustFinish ? null : state.activeVerseKey,
        // status will be set below
      };

      if (action.didJustFinish && state.autoplayEnabled && state.loadedVerseKey) {
        const current = parseVerseKey(state.loadedVerseKey);
        if (current && current.verse < state.totalVersesInSurah) {
          const nextVerse = current.verse + 1;
          return {
            ...baseNextState,
            activeVerseKey: getVerseKey(current.surah, nextVerse),
            status: 'loading_requested', // Trigger autoplay
            retryCount: 0,
            loadedVerseKey: null, // Important to reset for next load
          };
        } else {
           if (DEBUG) console.log(`[Reducer] Autoplay: End of surah or invalid current verse.`);
           return { ...baseNextState, status: 'idle', activeVerseKey: null, loadedVerseKey: null };
        }
      } else if (action.didJustFinish) { // Finished and no autoplay, or manual stop that completed
        return { ...baseNextState, status: 'idle', activeVerseKey: null, loadedVerseKey: null };
      } else { // Manual stop that didn't "finish" a track (e.g. stopped mid-play)
        return { ...baseNextState, status: 'idle' };
      }

    case 'AUDIO_SEEK_INITIATED':
        // When seek is initiated, we often go into a buffering state until seek is complete.
        // The actual sound object's status will confirm via onPlaybackStatusUpdate.
        return { ...state, status: 'buffering', pendingSeekPosition: action.positionMillis };
    case 'AUDIO_SEEK_COMPLETED':
        // After seek, determine if it should be playing or paused.
        // This might depend on whether it was playing before the seek.
        // For now, assume if a seek was pending, it should attempt to play.
        // onPlaybackStatusUpdate will provide the definitive status.
        // If it was paused and seeked, it should remain paused unless explicitly played.
        // Let's assume it was playing or intended to play if a seek was done.
        // A better approach might be to store preSeekStatus in state.
        const statusBeforeSeek = state.status; // This is 'seeking_requested' or 'buffering'
                                              // We need to know the status *before* 'seeking_requested'
                                              // For now, if a seek happened, assume it should be playing or paused based on prior state.
                                              // This is tricky. Let's simplify: if it was playing/buffering, it's playing. Else paused.
                                              // This logic is better handled by the effect calling this.
                                              // The reducer should just update based on action.
        return {
          ...state,
          // If it was playing or buffering (implying it wanted to play), set to playing. Else, paused.
          // This is still not perfect. The effect that calls setPositionAsync should decide the next state.
          // For now, let's assume it goes to 'paused', and onPlaybackStatusUpdate will correct to 'playing' if needed.
          status: 'paused', // Tentative, onPlaybackStatusUpdate will confirm.
          positionMillis: action.positionMillis,
          pendingSeekPosition: null
        };


    case 'AUDIO_BUFFERING_UPDATE':
      if (action.isBuffering) {
        // Only transition to 'buffering' if we are in a state that can buffer
        if (state.status === 'playing' || state.status === 'loading_audio' || state.status === 'paused' || state.status === 'resuming_requested' || state.status === 'seeking_requested' || state.status === 'pausing_requested') {
          return { ...state, status: 'buffering' };
        }
      } else { // action.isBuffering is false (buffering stopped)
        if (state.status === 'buffering') {
          // If buffering stops, what was the intended state?
          // If a seek was pending, it might now be 'playing' or 'paused'.
          // If loading, it might be 'playing'.
          // If resuming, it might be 'playing'.
          // If pausing, it might be 'paused'.
          // This is best determined by onPlaybackStatusUpdate.
          // Tentatively set to 'paused'; onPlaybackStatusUpdate will clarify.
          return { ...state, status: 'paused' };
        }
      }
      return state;

    case 'AUDIO_POSITION_UPDATE':
      let resolvedStatus = state.status;
      // If we are buffering (and not because of a pending seek operation),
      // and we receive a position update, it implies playback is happening or has resumed.
      if (state.status === 'buffering' && state.pendingSeekPosition === null) {
          resolvedStatus = 'playing';
      }
      return {
        ...state,
        positionMillis: action.positionMillis,
        durationMillis: action.durationMillis !== undefined ? action.durationMillis : state.durationMillis,
        status: resolvedStatus,
      };

    case 'AUDIO_ERROR':
      return {
        ...state,
        status: 'error',
        error: action.error,
        retryCount: action.key === state.activeVerseKey ? state.retryCount : 0,
        pendingSeekPosition: null, // Clear any pending seek on error
      };
    
    case 'INCREMENT_RETRY':
      if (state.activeVerseKey === action.key && state.status === 'loading_audio') { // Only increment if actively loading this key
        return { ...state, retryCount: state.retryCount + 1 };
      }
      return state;
    case 'CLEAR_RETRY':
      // Clear retry if the key matches the currently loaded/active one and we are no longer in an error or loading state for it.
      if ((state.loadedVerseKey === action.key || state.activeVerseKey === action.key) && state.status !== 'error' && state.status !== 'loading_audio') {
        return { ...state, retryCount: 0 };
      }
      return state;

    case 'RESET_PLAYER':
      return initialStateFactory(state.surahNumber, state.totalVersesInSurah, state.autoplayEnabled);

    default:
      // https://github.com/typescript-eslint/typescript-eslint/issues/6505
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const exhaustiveCheck: never = action; // Ensures all actions are handled
      return state;
  }
}

// --- Main Hook ---
export function useAudioPlayer(
  initialSurahNumber: number,
  initialTotalVersesInSurah: number,
  initialAutoplayEnabled: boolean = false
) {
  const [state, dispatch] = useReducer(
    audioReducer,
    initialStateFactory(initialSurahNumber, initialTotalVersesInSurah, initialAutoplayEnabled)
  );

  const soundRef = useRef<Audio.Sound | null>(null);
  // Ref to track if an operation (load, stop, pause, resume) is in progress to prevent race conditions
  const operationLockRef = useRef<boolean>(false); 
  const lastPlayedVerseKeyRef = useRef<string | null>(null);


  // Update surah context from props
  useEffect(() => {
    dispatch({ type: 'SET_SURAH_CONTEXT', surah: initialSurahNumber, totalVerses: initialTotalVersesInSurah });
  }, [initialSurahNumber, initialTotalVersesInSurah]);

  // Update autoplay from props
  useEffect(() => {
    dispatch({ type: 'SET_AUTOPLAY', enabled: initialAutoplayEnabled });
  }, [initialAutoplayEnabled]);


  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!soundRef.current) return; // Sound might have been unloaded

    if (!status.isLoaded) {
      if (status.error) {
        if (DEBUG) console.error(`[onPlaybackStatusUpdate] Playback Error: ${status.error} for ${state.loadedVerseKey}`);
        dispatch({ type: 'AUDIO_ERROR', error: status.error, key: state.loadedVerseKey || undefined });
      } else {
        // Sound unloaded, e.g. after stopAsync or if it failed to load.
        if (state.status === 'playing' || state.status === 'loading_audio' || state.status === 'buffering' || state.status === 'pausing_requested' || state.status === 'resuming_requested' || state.status === 'stopping_requested' || state.status === 'seeking_requested' ) {
            if (DEBUG) console.log(`[onPlaybackStatusUpdate] Sound unloaded unexpectedly for ${state.loadedVerseKey}. Current status: ${state.status}`);
            // If we were trying to do something, and it unloaded, it's an error or an implicit stop.
            // dispatch({ type: 'AUDIO_STOPPED_OR_COMPLETED', didJustFinish: false }); // Or an error
        }
      }
      return;
    }

    dispatch({
      type: 'AUDIO_POSITION_UPDATE',
      positionMillis: status.positionMillis,
      durationMillis: status.durationMillis,
    });

    if (status.isBuffering && state.status !== 'loading_audio' && state.status !== 'loading_requested') {
      if (state.status !== 'buffering') dispatch({ type: 'AUDIO_BUFFERING_UPDATE', isBuffering: true });
    } else if (!status.isBuffering && state.status === 'buffering') {
      dispatch({ type: 'AUDIO_BUFFERING_UPDATE', isBuffering: false });
    }
    
    if (status.isPlaying && state.status !== 'playing') {
        if (state.status === 'loading_audio' || state.status === 'buffering' || state.status === 'resuming_requested') {
            if (state.loadedVerseKey) {
                 dispatch({ type: 'AUDIO_LOADED_AND_PLAYING', key: state.loadedVerseKey, durationMillis: status.durationMillis || 0 });
            }
        } else if (state.status === 'paused') { // This case should be handled by REQUEST_RESUME -> resuming_requested
            dispatch({ type: 'AUDIO_RESUMED_SUCCESS' });
        }
    } else if (!status.isPlaying && (state.status === 'playing' || state.status === 'buffering' || state.status === 'pausing_requested')) {
        if (!status.isBuffering && !status.didJustFinish) { // if it's not buffering and didn't just finish, it's paused.
            dispatch({ type: 'AUDIO_PAUSED_SUCCESS' });
        }
    }

    if (status.didJustFinish) {
      if (DEBUG) console.log(`[onPlaybackStatusUpdate] Verse ${state.loadedVerseKey} finished.`);
      lastPlayedVerseKeyRef.current = state.loadedVerseKey;
      dispatch({ type: 'AUDIO_STOPPED_OR_COMPLETED', didJustFinish: true });
    }
  }, [state.status, state.loadedVerseKey, state.autoplayEnabled, state.totalVersesInSurah, state.surahNumber]);

  // Effect to manage Audio.Sound object based on state
  useEffect(() => {
    const loadPlayAudio = async (keyToLoad: string) => {
      if (operationLockRef.current) {
        if (DEBUG) console.log(`[Effect LoadPlay] Operation lock active for ${keyToLoad}, skipping.`);
        return;
      }
      operationLockRef.current = true;
      if (DEBUG) console.log(`[Effect LoadPlay] Attempting to load: ${keyToLoad}, current sound: ${soundRef.current ? 'exists' : 'null'}`);

      // Unload previous sound if it exists and is for a different verse
      if (soundRef.current && state.loadedVerseKey && state.loadedVerseKey !== keyToLoad) {
        if (DEBUG) console.log(`[Effect LoadPlay] Unloading previous sound for ${state.loadedVerseKey}`);
        try {
          soundRef.current.setOnPlaybackStatusUpdate(null);
          await soundRef.current.unloadAsync();
        } catch (e) {
          if (DEBUG) console.error('[Effect LoadPlay] Error unloading previous sound:', e);
        }
        soundRef.current = null;
      } else if (soundRef.current && !state.loadedVerseKey) { // Sound exists but no loadedVerseKey (e.g. after manual stop)
         if (DEBUG) console.log(`[Effect LoadPlay] Unloading existing sound as loadedVerseKey is null.`);
        try {
          soundRef.current.setOnPlaybackStatusUpdate(null);
          await soundRef.current.unloadAsync();
        } catch (e) {
          if (DEBUG) console.error('[Effect LoadPlay] Error unloading sound (no loadedVerseKey):', e);
        }
        soundRef.current = null;
      }


      const parsedKey = parseVerseKey(keyToLoad);
      if (!parsedKey) {
        dispatch({ type: 'AUDIO_ERROR', error: `Invalid verse key: ${keyToLoad}` });
        operationLockRef.current = false;
        return;
      }

      dispatch({ type: 'AUDIO_LOADING_INITIATED', key: keyToLoad });
      const audioUrl = formatAudioUrl(parsedKey.surah, parsedKey.verse);
      if (DEBUG) console.log(`[Effect LoadPlay] Loading URL: ${audioUrl}`);

      try {
        const newSound = new Audio.Sound();
        newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        await newSound.loadAsync({ uri: audioUrl }, { shouldPlay: true, progressUpdateIntervalMillis: 250 });
        soundRef.current = newSound;
        // onPlaybackStatusUpdate will dispatch AUDIO_LOADED_AND_PLAYING
        if (DEBUG) console.log(`[Effect LoadPlay] ${keyToLoad} load initiated.`);
      } catch (err: any) {
        if (DEBUG) console.error(`[Effect LoadPlay] Error loading ${keyToLoad}:`, err);
        if (state.retryCount < MAX_RETRY_ATTEMPTS && isNetworkError(err) && state.status === 'loading_audio' && state.activeVerseKey === keyToLoad) {
          dispatch({ type: 'INCREMENT_RETRY', key: keyToLoad });
          // No need for setTimeout and re-check, the effect will re-run due to retryCount change if status is still loading_audio
        } else {
          dispatch({ type: 'AUDIO_ERROR', error: `Failed to load ${keyToLoad}: ${err.message}`, key: keyToLoad });
        }
      } finally {
        operationLockRef.current = false;
      }
    };
    
    const pauseAudio = async () => {
      if (operationLockRef.current) return;
      if (soundRef.current && state.status === 'pausing_requested') {
        operationLockRef.current = true;
        dispatch({ type: 'AUDIO_PAUSE_INITIATED' });
        try {
          await soundRef.current.pauseAsync();
          // onPlaybackStatusUpdate will dispatch AUDIO_PAUSED_SUCCESS
        } catch (e) {
          dispatch({ type: 'AUDIO_ERROR', error: 'Failed to pause' });
        } finally {
          operationLockRef.current = false;
        }
      }
    };

    const resumeAudio = async () => {
      if (operationLockRef.current) return;
      if (soundRef.current && state.status === 'resuming_requested') {
        operationLockRef.current = true;
        dispatch({ type: 'AUDIO_RESUME_INITIATED' });
        try {
          await soundRef.current.playAsync();
          // onPlaybackStatusUpdate will dispatch AUDIO_RESUMED_SUCCESS
        } catch (e) {
          dispatch({ type: 'AUDIO_ERROR', error: 'Failed to resume' });
        } finally {
          operationLockRef.current = false;
        }
      }
    };

    const stopAudioInternal = async () => {
        if (operationLockRef.current) return;
        if (soundRef.current && state.status === 'stopping_requested') {
            operationLockRef.current = true;
            dispatch({ type: 'AUDIO_STOP_INITIATED' });
            try {
                soundRef.current.setOnPlaybackStatusUpdate(null); // Detach listener before unload
                await soundRef.current.unloadAsync();
                soundRef.current = null;
                dispatch({ type: 'AUDIO_STOPPED_OR_COMPLETED', didJustFinish: false }); // Manual stop
            } catch (e) {
                dispatch({ type: 'AUDIO_ERROR', error: 'Failed to stop/unload audio' });
            } finally {
                operationLockRef.current = false;
            }
        } else if (state.status === 'stopping_requested' && !soundRef.current) {
            // If trying to stop but no sound, just go to idle
            dispatch({ type: 'AUDIO_STOPPED_OR_COMPLETED', didJustFinish: false });
        }
    };
    
    const seekAudioInternal = async () => {
        if (operationLockRef.current) return;
        if (soundRef.current && state.status === 'seeking_requested' && state.pendingSeekPosition !== null) {
            operationLockRef.current = true;
            const seekPos = state.pendingSeekPosition;
            dispatch({ type: 'AUDIO_SEEK_INITIATED', positionMillis: seekPos });
            try {
                await soundRef.current.setPositionAsync(seekPos);
                // onPlaybackStatusUpdate will handle the transition to playing/paused
                // We can dispatch AUDIO_SEEK_COMPLETED here to clear pendingSeekPosition
                dispatch({ type: 'AUDIO_SEEK_COMPLETED', positionMillis: seekPos });
            } catch (e) {
                dispatch({ type: 'AUDIO_ERROR', error: 'Failed to seek audio' });
            } finally {
                operationLockRef.current = false;
            }
        }
    };


    // Main logic based on state.status
    if (state.status === 'loading_requested' && state.activeVerseKey) {
        loadPlayAudio(state.activeVerseKey);
    } else if (state.status === 'loading_audio' && state.activeVerseKey && state.retryCount > 0 && state.retryCount <= MAX_RETRY_ATTEMPTS) {
        // This handles retries. If INCREMENT_RETRY was dispatched, and status is still loading_audio, this effect re-runs.
        if (DEBUG) console.log(`[Effect Main] Retrying load for ${state.activeVerseKey}, attempt ${state.retryCount}`);
        loadPlayAudio(state.activeVerseKey); // Will use existing soundRef if it's for the same key
    } else if (state.status === 'pausing_requested') {
        pauseAudio();
    } else if (state.status === 'resuming_requested') {
        resumeAudio();
    } else if (state.status === 'stopping_requested') {
        stopAudioInternal();
    } else if (state.status === 'seeking_requested') {
        seekAudioInternal();
    } else if (state.status === 'playing' && state.activeVerseKey && state.activeVerseKey !== state.loadedVerseKey) {
        // User requested a new verse while another was playing.
        // REQUEST_PLAY should have changed status to 'loading'. This indicates a potential state mismatch.
        if (DEBUG) console.warn(`[Effect Main] State mismatch: Playing ${state.loadedVerseKey} but active is ${state.activeVerseKey}. Requesting play for active.`);
        const parsedKey = parseVerseKey(state.activeVerseKey);
        if (parsedKey) {
            dispatch({ type: 'REQUEST_PLAY', surah: parsedKey.surah, verse: parsedKey.verse });
        }
    }

    // Cleanup effect for when the hook is unmounted or surah changes
    return () => {
      if (soundRef.current) {
        if (DEBUG) console.log('[Effect Cleanup] Unloading sound on unmount/surah change.');
        operationLockRef.current = true;
        soundRef.current.setOnPlaybackStatusUpdate(null);
        soundRef.current.unloadAsync()
          .catch(e => { if (DEBUG) console.error('Error unloading sound on cleanup:', e); })
          .finally(() => {
            soundRef.current = null;
            operationLockRef.current = false;
          });
      }
    };
  }, [state.status, state.activeVerseKey, state.loadedVerseKey, state.retryCount, onPlaybackStatusUpdate]); // Dependencies are crucial

  // Audio Mode Setup
  useEffect(() => {
    if (DEBUG) console.log(`useAudioPlayer: Setting up audio mode for surah ${state.surahNumber}`);
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
    }).then(() => { if (DEBUG) console.log("Audio mode set."); })
      .catch(e => {
        console.error("Error setting audio mode:", e);
        dispatch({ type: 'AUDIO_ERROR', error: 'Failed to set audio mode' });
      });
    // No specific cleanup for audio mode needed here, it's a global setting.
  }, []); // Runs once

  // --- Control Functions ---
  const toggleAudio = useCallback(async (verseNumber: number) => {
    if (DEBUG) console.log(`[toggleAudio] Verse: ${verseNumber}, Current Surah: ${state.surahNumber}`);
    const targetKey = getVerseKey(state.surahNumber, verseNumber);

    if (operationLockRef.current) {
        if (DEBUG) console.log(`[toggleAudio] Operation lock active for ${targetKey}, ignoring.`);
        return;
    }

    if (state.loadedVerseKey === targetKey) {
      if (state.status === 'playing') {
        if (DEBUG) console.log(`[toggleAudio] Requesting PAUSE for ${targetKey}`);
        operationLockRef.current = true;
        try {
            // No direct dispatch here, onPlaybackStatusUpdate handles AUDIO_PAUSED_SUCCESS
            if(soundRef.current) await soundRef.current.pauseAsync();
        } catch(e) { dispatch({type: 'AUDIO_ERROR', error: 'Failed to pause'})}
        finally { operationLockRef.current = false; } // Release lock after async op

      } else if (state.status === 'paused') {
        if (DEBUG) console.log(`[toggleAudio] Dispatching REQUEST_RESUME for ${targetKey}`);
        dispatch({ type: 'REQUEST_RESUME' }); // Reducer will change status to 'resuming_requested'
      } else if (state.status === 'stopped' || state.status === 'idle' || state.status === 'error') {
        if (DEBUG) console.log(`[toggleAudio] Dispatching REQUEST_PLAY for ${targetKey} (was ${state.status})`);
        dispatch({ type: 'REQUEST_PLAY', surah: state.surahNumber, verse: verseNumber });
      }
    } else {
      // Different verse or no verse loaded
      if (DEBUG) console.log(`[toggleAudio] Dispatching REQUEST_PLAY for new verse ${targetKey}`);
      dispatch({ type: 'REQUEST_PLAY', surah: state.surahNumber, verse: verseNumber });
    }
  }, [state.surahNumber, state.status, state.loadedVerseKey, state.activeVerseKey]);

  const stopAudio = useCallback(() => {
    if (DEBUG) console.log(`[stopAudio] Dispatching REQUEST_STOP for ${state.loadedVerseKey}`);
    // No direct async sound manipulation here. Dispatch an action.
    // The effect listening to 'stopping_requested' will handle the sound object.
    if (state.status !== 'idle' && state.status !== 'stopped' && state.status !== 'stopping_requested') {
        dispatch({ type: 'REQUEST_STOP' });
    }
  }, [state.status, state.loadedVerseKey]);

  const seekAudio = useCallback((newPositionMillis: number) => {
    if (DEBUG) console.log(`[seekAudio] Dispatching REQUEST_SEEK to ${newPositionMillis} for ${state.loadedVerseKey}`);
    // No direct async sound manipulation here. Dispatch an action.
    // The effect listening to 'seeking_requested' will handle the sound object.
    if (state.status === 'playing' || state.status === 'paused' || state.status === 'buffering') {
        dispatch({ type: 'REQUEST_SEEK', positionMillis: newPositionMillis });
    }
  }, [state.status, state.loadedVerseKey]);
  
  const resetActiveVerse = useCallback(() => {
    // This function's purpose might change. If it's about UI highlighting,
    // it might be separate from player state.
    // For now, let's assume it means to clear any 'active' (but not necessarily playing) verse.
    // This is more of a UI concern than a player state concern with the new model.
    // If it means "stop playing and clear active verse", then:
    // stopAudio(); // then dispatch to clear activeVerseKey if needed.
    // This function might be deprecated or rethought.
    if (DEBUG) console.log("[resetActiveVerse] Called. Consider purpose with new state model.");
  }, []);


  // Derived state for UI
  const currentVerseDetails = parseVerseKey(state.activeVerseKey);
  const playingVerseNumber = currentVerseDetails?.verse || 0;
  const activeVerseNumber = currentVerseDetails?.verse || 0; // Or a separate UI state for "selected"

  return {
    // State values from reducer
    playingVerseNumber, // Derived from activeVerseKey
    activeVerseNumber,  // Derived from activeVerseKey (or could be separate UI concern)
    isLoading: state.status === 'loading_requested' || state.status === 'loading_audio',
    isBuffering: state.status === 'buffering',
    // isPlaying should be true if status is 'playing' or 'resuming_requested' (optimistic)
    // or even 'seeking_requested' if it was playing before.
    // For simplicity now, just 'playing'. onPlaybackStatusUpdate is the source of truth.
    isPlaying: state.status === 'playing',
    error: state.error,
    durationMillis: state.durationMillis,
    positionMillis: state.positionMillis,
    autoplayEnabled: state.autoplayEnabled, // From prop, reflected in state

    // Control functions
    toggleAudio,
    stopAudio,
    seekAudio, // New seek function
    resetActiveVerse, // Review purpose
  };
}