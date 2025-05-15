// src/hooks/useAudioPlayer.ts
import { AudioModule, AudioPlayer, AudioStatus, createAudioPlayer } from 'expo-audio';
// AudioModule for setAudioModeAsync.
// AudioPlayer is the class for player instances.
// AudioStatus is the type for playbackStatusUpdate events.
// InterruptionMode is the type for interruption mode string literals.
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { getAudioUrl as getAudioUrlFromService } from '../services/audioService';

// --- Constants ---
const MAX_RETRY_ATTEMPTS = 3;
const DEBUG = true;
const UPDATE_INTERVAL_MS = 250;
const PLAYBACK_STALL_TIMEOUT_MS = 10000; // 10 seconds for playback to start or error

// --- Helper Functions ---
const isNetworkError = (error: any): boolean => {
  const errorMessage = error?.message?.toLowerCase() || '';
  return errorMessage.includes('network') || errorMessage.includes('connection') || errorMessage.includes('timeout');
};

const formatAudioUrl = (surahId: number, verseNumber: number): string => {
  return getAudioUrlFromService(surahId, verseNumber);
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
type AudioPlayerUiStatus =
  | 'idle'
  | 'loading_requested'
  | 'loading_audio'
  | 'buffering'
  | 'playing'
  | 'pausing_requested'
  | 'paused'
  | 'resuming_requested'
  | 'stopping_requested'
  | 'seeking_requested'
  | 'error';

type AudioState = {
  activeVerseKey: string | null;
  loadedVerseKey: string | null;
  status: AudioPlayerUiStatus;
  positionMillis: number;
  durationMillis: number;
  error: string | null;
  autoplayEnabled: boolean;
  surahNumber: number;
  totalVersesInSurah: number;
  retryCount: number;
  pendingSeekPosition: number | null;
};

type AudioAction =
  | { type: 'REQUEST_PLAY'; surah: number; verse: number }
  | { type: 'REQUEST_PAUSE' }
  | { type: 'REQUEST_RESUME' }
  | { type: 'REQUEST_STOP' }
  | { type: 'REQUEST_SEEK'; positionMillis: number }
  | { type: 'AUDIO_LOADING_INITIATED'; key: string }
  | { type: 'AUDIO_LOADED_AND_PLAYING'; key: string; durationMillis: number; positionMillis?: number } 
  | { type: 'AUDIO_PAUSE_INITIATED' }
  | { type: 'AUDIO_PAUSED_SUCCESS'; positionMillis: number } 
  | { type: 'AUDIO_RESUME_INITIATED' }
  | { type: 'AUDIO_RESUMED_SUCCESS' }
  | { type: 'AUDIO_STOP_INITIATED' }
  | { type: 'AUDIO_STOPPED_OR_COMPLETED'; didJustFinish: boolean }
  | { type: 'AUDIO_SEEK_INITIATED'; positionMillis: number }
  | { type: 'AUDIO_SEEK_COMPLETED'; positionMillis: number; currentUiStatusIfBuffering: AudioPlayerUiStatus }
  | { type: 'AUDIO_BUFFERING_UPDATE'; isBuffering: boolean; previousStatusHint?: AudioPlayerUiStatus }
  | { type: 'AUDIO_POSITION_UPDATE'; positionMillis: number; durationMillis?: number }
  | { type: 'AUDIO_ERROR'; error: string; key?: string | null } // Allow key to be null from state
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

// Reducer should be pure and not access playerRef
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
      if (state.loadedVerseKey === key && 
          (state.status === 'paused' || state.status === 'pausing_requested' || 
           (state.status === 'buffering' && state.activeVerseKey === key) 
          )
         ) {
        if (DEBUG) console.log(`[Reducer] REQUEST_PLAY for already loaded/paused key ${key}. Transitioning to resuming_requested.`);
        return { ...state, status: 'resuming_requested', activeVerseKey: key };
      }
      if (state.activeVerseKey === key && state.status === 'playing') {
        if (DEBUG) console.log(`[Reducer] REQUEST_PLAY for already playing key ${key}. No change.`);
        return state;
      }
      if (DEBUG) console.log(`[Reducer] REQUEST_PLAY for new/different key ${key}. Transitioning to loading_requested.`);
      return {
        ...state,
        activeVerseKey: key,
        status: 'loading_requested',
        error: null,
        positionMillis: 0, 
        durationMillis: 0,
        retryCount: 0,
        loadedVerseKey: null, 
      };
    }
    case 'REQUEST_PAUSE':
      if (['playing', 'buffering', 'resuming_requested'].includes(state.status) && state.loadedVerseKey) {
         if (state.status === 'loading_audio' && !state.loadedVerseKey) return state; 
        return { ...state, status: 'pausing_requested' };
      }
      return state;
    case 'REQUEST_RESUME':
      if ((state.status === 'paused' || state.status === 'pausing_requested') && state.loadedVerseKey) {
        return { ...state, status: 'resuming_requested' };
      }
      return state;
    case 'REQUEST_STOP':
      if (!['idle', 'stopping_requested'].includes(state.status)) {
        return { ...state, status: 'stopping_requested' };
      }
      return state;
    case 'REQUEST_SEEK':
      if (['playing', 'paused', 'buffering'].includes(state.status) && state.loadedVerseKey) {
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
        positionMillis: action.positionMillis !== undefined ? action.positionMillis : 0,
        error: null,
        retryCount: 0,
      };
    case 'AUDIO_PAUSE_INITIATED':
      return { ...state, status: 'buffering' }; 
    case 'AUDIO_PAUSED_SUCCESS':
      return { ...state, status: 'paused', positionMillis: action.positionMillis };
    case 'AUDIO_RESUME_INITIATED':
      return { ...state, status: 'buffering' }; 
    case 'AUDIO_RESUMED_SUCCESS': 
      return { ...state, status: 'playing' };
    case 'AUDIO_STOP_INITIATED':
      return { ...state, status: 'buffering' }; 
    case 'AUDIO_STOPPED_OR_COMPLETED':
      if (action.didJustFinish && state.autoplayEnabled && state.loadedVerseKey) {
        const current = parseVerseKey(state.loadedVerseKey);
        if (current && current.verse < state.totalVersesInSurah) {
          const nextVerse = current.verse + 1;
          if (DEBUG) console.log(`[Reducer] Autoplay: Next verse ${nextVerse} in surah ${current.surah}`);
          return {
            ...state,
            activeVerseKey: getVerseKey(current.surah, nextVerse),
            status: 'loading_requested',
            retryCount: 0,
            loadedVerseKey: null,
            positionMillis: 0,
            durationMillis: 0,
            error: null,
          };
        } else {
          if (DEBUG) console.log(`[Reducer] Autoplay: End of surah ${state.surahNumber} or invalid current verse.`);
          return {
            ...state,
            activeVerseKey: null,
            loadedVerseKey: null,
            status: 'idle',
            positionMillis: 0,
            durationMillis: 0,
            error: null,
          };
        }
      } else {
        if (DEBUG) console.log(`[Reducer] Audio stopped (manual or no autoplay). DidJustFinish: ${action.didJustFinish}. Resetting to idle.`);
        return {
          ...state,
          activeVerseKey: null,
          loadedVerseKey: null,
          status: 'idle',
          positionMillis: 0,
          durationMillis: 0, 
          error: null, 
        };
      }
    case 'AUDIO_SEEK_INITIATED':
      return { ...state, status: 'buffering', pendingSeekPosition: action.positionMillis };
    case 'AUDIO_SEEK_COMPLETED':
      return {
        ...state,
        status: action.currentUiStatusIfBuffering, 
        positionMillis: action.positionMillis,
        pendingSeekPosition: null,
      };
    case 'AUDIO_BUFFERING_UPDATE':
      if (action.isBuffering) {
        if (['playing', 'loading_audio', 'paused', 'resuming_requested', 'seeking_requested', 'pausing_requested'].includes(state.status)) {
          return { ...state, status: 'buffering' };
        }
      } else { 
        if (state.status === 'buffering') {
          return { ...state, status: action.previousStatusHint || 'paused' };
        }
      }
      return state;
    case 'AUDIO_POSITION_UPDATE':
      let newPlayerUiStatus = state.status;
      if (state.status === 'buffering' && state.pendingSeekPosition === null && action.positionMillis > 0 ) {
        // Let onPlaybackStatusUpdate determine if it's 'playing'
      }
      return {
        ...state,
        positionMillis: action.positionMillis,
        durationMillis: action.durationMillis !== undefined ? action.durationMillis : state.durationMillis,
        status: newPlayerUiStatus, 
      };
    case 'AUDIO_ERROR':
      return {
        ...state,
        status: 'error',
        error: action.error,
        retryCount: action.key === state.activeVerseKey ? state.retryCount : 0, 
        pendingSeekPosition: null,
      };
    case 'INCREMENT_RETRY':
      if (state.activeVerseKey === action.key && state.status === 'loading_audio') {
        return { ...state, retryCount: state.retryCount + 1 };
      }
      return state;
    case 'CLEAR_RETRY':
      if ((state.loadedVerseKey === action.key || state.activeVerseKey === action.key) && !['error', 'loading_audio', 'loading_requested'].includes(state.status)) {
        return { ...state, retryCount: 0 };
      }
      return state;
    case 'RESET_PLAYER':
      return initialStateFactory(state.surahNumber, state.totalVersesInSurah, state.autoplayEnabled);
    default:
      const exhaustiveCheck: never = action; // eslint-disable-line
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

  const playerRef = useRef<AudioPlayer | null>(null);
  const operationLockRef = useRef<boolean>(false);
  const statusListenerSubscription = useRef<ReturnType<AudioPlayer['addListener']> | null>(null);
  const preSeekStatusRef = useRef<AudioPlayerUiStatus>(state.status);
  const playbackStallTimerRef = useRef<number | null>(null); 

  useEffect(() => {
    dispatch({ type: 'SET_SURAH_CONTEXT', surah: initialSurahNumber, totalVerses: initialTotalVersesInSurah });
  }, [initialSurahNumber, initialTotalVersesInSurah]);

  useEffect(() => {
    dispatch({ type: 'SET_AUTOPLAY', enabled: initialAutoplayEnabled });
  }, [initialAutoplayEnabled]);

  const onPlaybackStatusUpdate = useCallback(async (status: AudioStatus) => {
    const currentKeyForLog = state.loadedVerseKey || state.activeVerseKey || 'unknown_key';
    if (DEBUG) console.log(`[onPlaybackStatusUpdate] Received status update for verse ${currentKeyForLog}:`, JSON.stringify(status, null, 2));

    if (!playerRef.current) {
      if (DEBUG) console.warn("[onPlaybackStatusUpdate] No player ref, returning. This might indicate a race condition or premature cleanup.");
      return;
    }

    // Destructure all relevant properties from the status event
    const {
      isLoaded: eventIsLoaded,
      isBuffering: eventIsBufferingRaw,
      playing: eventIsPlaying,
      didJustFinish: eventDidJustFinish,
      // NOTE: 'error' is not a standard property on AudioStatus from expo-audio docs.
      // Errors are typically caught via try/catch on player methods or specific error events if available.
      // We will rely on try/catch blocks for now.
      // const eventErrorMsg = 'error' in status ? status.error : undefined;
      duration: eventDurationSec,
      currentTime: eventCurrentTimeSec,
      reasonForWaitingToPlay, // This might provide clues for playback issues.
    } = status;

    const eventIsBuffering = eventIsBufferingRaw ?? false; // Ensure boolean

    if (reasonForWaitingToPlay && reasonForWaitingToPlay !== 'PLAYER_IS_NOT_PLAYING') {
        // PLAYER_IS_NOT_PLAYING is normal when paused or stopped. Other reasons might indicate an issue.
        if (DEBUG) console.warn(`[onPlaybackStatusUpdate] ReasonForWaitingToPlay for ${currentKeyForLog}: ${reasonForWaitingToPlay}`);
        // Potentially dispatch an error or a specific status if this indicates a problem (e.g., "NO_ITEM_TO_PLAY", "PLAYER_NOT_READY")
        // For now, just logging. If specific reasons consistently map to errors, they can be handled.
    }
    
    const eventDurationMillis = eventDurationSec !== undefined && eventDurationSec !== null ? eventDurationSec * 1000 : undefined;
    const eventPositionMillis = eventCurrentTimeSec !== undefined && eventCurrentTimeSec !== null ? eventCurrentTimeSec * 1000 : undefined;
    
    const currentDurationMillis = eventDurationMillis ?? (playerRef.current?.isLoaded && playerRef.current.duration ? playerRef.current.duration * 1000 : state.durationMillis);
    const currentPositionMillis = eventPositionMillis ?? (playerRef.current?.isLoaded && playerRef.current.currentTime ? playerRef.current.currentTime * 1000 : state.positionMillis);

    if (DEBUG) console.log(`[onPlaybackStatusUpdate] Calculated Times for ${currentKeyForLog} - Duration: ${currentDurationMillis}, Position: ${currentPositionMillis}. Event raw: durationSec=${eventDurationSec}, currentTimeSec=${eventCurrentTimeSec}`);

    // Check if player became unloaded unexpectedly
    if (!eventIsLoaded &&
        state.status !== 'idle' &&
        state.status !== 'error' &&
        state.status !== 'loading_requested' &&
        state.status !== 'loading_audio' &&
        state.status !== 'stopping_requested' // Allow stopping_requested to lead to unloaded
       ) {
      if (DEBUG) console.warn(`[onPlaybackStatusUpdate] Player for ${currentKeyForLog} reported NOT LOADED (eventIsLoaded=${eventIsLoaded}) unexpectedly. UI status: ${state.status}. Full event:`, JSON.stringify(status, null, 2));
      // Dispatch an error if player becomes unloaded when it shouldn't be.
      dispatch({ type: 'AUDIO_ERROR', error: `Player became unloaded unexpectedly for ${currentKeyForLog} (UI status: ${state.status})`, key: currentKeyForLog });
      return; // Critical state, further processing might be unreliable
    }
    
    dispatch({
      type: 'AUDIO_POSITION_UPDATE',
      positionMillis: currentPositionMillis,
      durationMillis: currentDurationMillis,
    });

    if (eventIsBuffering) {
      if (state.status !== 'buffering') {
        if (DEBUG) console.log(`[onPlaybackStatusUpdate] Buffering started for ${currentKeyForLog}. Previous UI status: ${state.status}`);
        preSeekStatusRef.current = state.status;
        dispatch({ type: 'AUDIO_BUFFERING_UPDATE', isBuffering: true });
      }
    } else {
      if (state.status === 'buffering') {
        // Patch B: Determine next status based on current eventIsPlaying
        let nextStatusAfterBuffering: AudioPlayerUiStatus = eventIsPlaying ? 'playing' : 'paused';
        if (DEBUG) console.log(`[onPlaybackStatusUpdate] Buffering ended for ${currentKeyForLog}. Restoring to UI status: ${nextStatusAfterBuffering}. Event: isLoaded=${eventIsLoaded}, isPlaying=${eventIsPlaying}`);
        dispatch({ type: 'AUDIO_BUFFERING_UPDATE', isBuffering: false, previousStatusHint: nextStatusAfterBuffering });
      }
    }
    
    // Core logic for transitioning to 'playing' state after loading
    // PLAN STEP 1 & 2: Call play() directly when loaded and ready, if a play was requested.
    if (eventIsLoaded && status.playbackState === 'readyToPlay' &&
        (state.status === 'loading_audio' || state.status === 'loading_requested') &&
        state.activeVerseKey === state.loadedVerseKey && // Ensure we are trying to play the correct loaded verse
        playerRef.current && !playerRef.current.playing // Only attempt if not already playing
       ) {
      if (DEBUG) console.log(`[onPlaybackStatusUpdate] Player for ${state.loadedVerseKey} is LOADED & READY_TO_PLAY (eventIsLoaded=${eventIsLoaded}, playbackState=${status.playbackState}). UI state is ${state.status}. Attempting to set mode and play.`);
      
      if (playbackStallTimerRef.current) {
        clearTimeout(playbackStallTimerRef.current);
        playbackStallTimerRef.current = null;
        if (DEBUG) console.log(`[onPlaybackStatusUpdate] Cleared playbackStallTimer for ${state.loadedVerseKey} before attempting play.`);
      }

      // Wrapped in an async IIFE to use await for setAudioModeAsync
      (async () => {
        try {
          if (playerRef.current) { // Double check playerRef still exists
            if (DEBUG) console.log(`[onPlaybackStatusUpdate - IIFE] Setting audio mode for ${state.loadedVerseKey} before direct play()`);
            await AudioModule.setAudioModeAsync({
              allowsRecording: false,
              interruptionMode: 'doNotMix',
              playsInSilentMode: false,
              shouldPlayInBackground: false,
            });
            if (DEBUG) console.log(`[onPlaybackStatusUpdate - IIFE] Audio mode set for ${state.loadedVerseKey}. Calling player.play() directly.`);
            
            playerRef.current.play();
            // Log current player status immediately after calling play to see if it reflects synchronously (it might not)
            if (DEBUG) {
                const p = playerRef.current;
                console.log(`[onPlaybackStatusUpdate - IIFE] player.play() has been called for ${state.loadedVerseKey}. Player ref status: isLoaded=${p?.isLoaded}, playing=${p?.playing}, paused=${p?.paused}, currentTime=${p?.currentTime}, duration=${p?.duration}`);
            }
            // The actual transition to 'playing' state in the reducer will still be driven by the *next* onPlaybackStatusUpdate event that shows eventIsPlaying = true.
            // This direct call here is to ensure the native play command is issued.
          } else {
            if (DEBUG) console.error(`[onPlaybackStatusUpdate - IIFE] CRITICAL: playerRef.current became null before direct play attempt for ${state.loadedVerseKey}.`);
            dispatch({ type: 'AUDIO_ERROR', error: `Player instance lost before direct play for ${state.loadedVerseKey}`, key: state.loadedVerseKey });
          }
        } catch (playAttemptError: any) {
          if (DEBUG) console.error(`[onPlaybackStatusUpdate - IIFE] EXCEPTION during direct setAudioModeAsync or player.play() for ${state.loadedVerseKey}:`, playAttemptError.message, playAttemptError.code, playAttemptError);
          dispatch({ type: 'AUDIO_ERROR', error: `Direct play command or pre-play setup failed for ${state.loadedVerseKey}: ${playAttemptError.message}`, key: state.loadedVerseKey });
        }
      })();
    }

    // This block handles the state transition to 'playing' or 'paused' once the event confirms it.
    // Patch A: Unconditionally dispatch AUDIO_LOADED_AND_PLAYING if event says playing and state is not already playing.
    if (eventIsLoaded && eventIsPlaying && state.status !== 'playing') {
      if (DEBUG) console.log(`[onPlaybackStatusUpdate] Event indicates PLAYING (isLoaded=${eventIsLoaded}, isPlaying=${eventIsPlaying}). Current UI state is ${state.status}. Dispatching AUDIO_LOADED_AND_PLAYING for ${state.loadedVerseKey || currentKeyForLog}.`);
      if (playbackStallTimerRef.current) {
        clearTimeout(playbackStallTimerRef.current);
        playbackStallTimerRef.current = null;
      }
      dispatch({
        type: 'AUDIO_LOADED_AND_PLAYING',
        key: state.loadedVerseKey || currentKeyForLog, // Ensure a key is provided
        durationMillis: currentDurationMillis,
        positionMillis: currentPositionMillis
      });
    } else if (eventIsLoaded && !eventIsPlaying && !eventDidJustFinish) {
      // This handles transitions to paused state if the event says not playing, not finished, and loaded.
      // It's important this doesn't conflict with buffering state.
      if (state.status === 'playing' || state.status === 'pausing_requested' || (state.status === 'buffering' && !eventIsBuffering)) {
        if (DEBUG) console.log(`[onPlaybackStatusUpdate] Event indicates NOT PLAYING (isLoaded=${eventIsLoaded}, isPlaying=${eventIsPlaying}, didJustFinish=${eventDidJustFinish}). Current UI state is ${state.status}. Dispatching AUDIO_PAUSED_SUCCESS for ${state.loadedVerseKey || currentKeyForLog}.`);
        dispatch({ type: 'AUDIO_PAUSED_SUCCESS', positionMillis: currentPositionMillis });
      }
    }

    if (eventDidJustFinish) {
      if (DEBUG) console.log(`[onPlaybackStatusUpdate] Verse ${state.loadedVerseKey} FINISHED (player ended according to event).`);
      if (playbackStallTimerRef.current) {
        clearTimeout(playbackStallTimerRef.current);
        playbackStallTimerRef.current = null;
      }
      dispatch({ type: 'AUDIO_STOPPED_OR_COMPLETED', didJustFinish: true });
    }
  }, [state.status, state.activeVerseKey, state.loadedVerseKey, state.durationMillis, state.positionMillis, state.autoplayEnabled]);


  useEffect(() => {
    const removePlayer = () => { 
        if (playerRef.current) {
            const verseKeyForLog = state.loadedVerseKey || state.activeVerseKey || 'unknown';
            if (DEBUG) console.log(`[removePlayerEffect] Removing existing player for verse key: ${verseKeyForLog}.`);
            if (statusListenerSubscription.current) {
                statusListenerSubscription.current.remove();
                statusListenerSubscription.current = null;
            }
            try {
                playerRef.current.remove();
            } catch (e: any) {
                 if (DEBUG) console.error('[removePlayerEffect] Error removing player:', e.message);
            }
            playerRef.current = null;
        }
        if (playbackStallTimerRef.current) { 
            clearTimeout(playbackStallTimerRef.current);
            playbackStallTimerRef.current = null;
        }
    };

    const loadPlayAudio = async () => { 
      const keyToLoad = state.activeVerseKey;
      if (!keyToLoad) {
        if (DEBUG) console.log(`[Effect LoadPlay] No activeVerseKey to load.`);
        operationLockRef.current = false; 
        return;
      }
      if (DEBUG) console.log(`[Effect LoadPlay] Status: ${state.status}. ActiveKey: ${keyToLoad}. LoadedKey: ${state.loadedVerseKey}`);
      
      if (operationLockRef.current) {
         if (DEBUG) console.log(`[Effect LoadPlay] Operation lock active for ${keyToLoad}, skipping.`);
         return;
      }
      operationLockRef.current = true;
      
      if (DEBUG) console.log(`[Effect LoadPlay] Attempting to load: ${keyToLoad}. Current player: ${playerRef.current ? 'exists' : 'null'}`);

      removePlayer(); 

      const parsedKey = parseVerseKey(keyToLoad);
      if (!parsedKey) {
        dispatch({ type: 'AUDIO_ERROR', error: `Invalid verse key: ${keyToLoad}` });
        operationLockRef.current = false;
        return;
      }

      try {
        if (DEBUG) console.log(`[Effect LoadPlay] Setting audio mode for ${keyToLoad}...`);
        await AudioModule.setAudioModeAsync({
          allowsRecording: false,
          interruptionMode: 'doNotMix',
          playsInSilentMode: false, // Reverted from diagnostic true
          shouldPlayInBackground: false,
        });
        if (DEBUG) console.log(`[Effect LoadPlay] Audio mode set for ${keyToLoad} (playsInSilentMode: false, shouldPlayInBackground: false).`);

        dispatch({ type: 'AUDIO_LOADING_INITIATED', key: keyToLoad });
        const audioUrl = formatAudioUrl(parsedKey.surah, parsedKey.verse);
        if (DEBUG) console.log(`[Effect LoadPlay] Attempting to create player with URL: ${audioUrl}`);

        // Wrap createAudioPlayer in try-catch as it might throw directly
        try {
            playerRef.current = createAudioPlayer({ uri: audioUrl }, UPDATE_INTERVAL_MS);
        } catch (creationError: any) {
            if (DEBUG) console.error(`[Effect LoadPlay] CRITICAL: createAudioPlayer for ${keyToLoad} threw an error:`, creationError.message, creationError.code, creationError);
            dispatch({ type: 'AUDIO_ERROR', error: `Player creation failed for ${keyToLoad}: ${creationError.message}`, key: keyToLoad });
            operationLockRef.current = false;
            return;
        }
        
        if (playerRef.current) {
            if (DEBUG) console.log(`[Effect LoadPlay] Player for ${keyToLoad} created. Adding status listener.`);
            statusListenerSubscription.current = playerRef.current.addListener('playbackStatusUpdate', onPlaybackStatusUpdate);
            
            if (DEBUG) console.log(`[Effect LoadPlay] Listener attached for ${keyToLoad}. Attempting to play immediately.`);

            // Immediately attempt to play
            try {
                // Ensure audio mode is set just before this crucial play call as well
                if (DEBUG) console.log(`[Effect LoadPlay] Setting audio mode for ${keyToLoad} before immediate play().`);
                await AudioModule.setAudioModeAsync({
                    allowsRecording: false,
                    interruptionMode: 'doNotMix',
                    playsInSilentMode: false,
                    shouldPlayInBackground: false,
                });
                if (DEBUG) console.log(`[Effect LoadPlay] Audio mode set. Calling player.play() for ${keyToLoad} immediately after creation.`);
                
                await playerRef.current.play();
                if (DEBUG) console.log(`[Effect LoadPlay] player.play() called for ${keyToLoad}. Waiting for status updates.`);
                
                if (playbackStallTimerRef.current) clearTimeout(playbackStallTimerRef.current);
                playbackStallTimerRef.current = setTimeout(() => {
                    if (playerRef.current && state.activeVerseKey === keyToLoad && !playerRef.current.playing && playerRef.current.isLoaded) {
                        if (DEBUG) console.warn(`[Effect LoadPlay] Playback STALL detected for ${keyToLoad} after immediate play attempt. Player: isLoaded=${playerRef.current.isLoaded}, isPlaying=${playerRef.current.playing}. UI Status: ${state.status}.`);
                        dispatch({ type: 'AUDIO_ERROR', error: `Playback stalled for ${keyToLoad} after play() call`, key: keyToLoad });
                    }
                }, PLAYBACK_STALL_TIMEOUT_MS) as unknown as number;

            } catch (immediatePlayError: any) {
                if (DEBUG) console.error(`[Effect LoadPlay] EXCEPTION during immediate setAudioModeAsync or player.play() for ${keyToLoad}:`, immediatePlayError.message, immediatePlayError.code, immediatePlayError);
                dispatch({ type: 'AUDIO_ERROR', error: `Immediate play/setup failed for ${keyToLoad}: ${immediatePlayError.message}`, key: keyToLoad });
            }
            
        } else {
            if (DEBUG) console.error(`[Effect LoadPlay] CRITICAL: playerRef.current is null after createAudioPlayer call for ${keyToLoad}, cannot attach listener or play.`);
            dispatch({ type: 'AUDIO_ERROR', error: `Player instance is null after creation for ${keyToLoad}`, key: keyToLoad });
        }
      } catch (err: any) { // Catch errors from setAudioModeAsync, createAudioPlayer, or rethrown errors
        const errorMessage = `Setup error for ${keyToLoad}: ${err.message || 'Unknown error'}. Code: ${err.code}. NativeError: ${err.nativeError ? JSON.stringify(err.nativeError) : 'N/A'}`;
        if (DEBUG) console.error(`[Effect LoadPlay] Outer catch block for ${keyToLoad}:`, errorMessage, err, err.code, err.nativeError);
        
        if (playbackStallTimerRef.current) {
            clearTimeout(playbackStallTimerRef.current);
            playbackStallTimerRef.current = null;
        }
        
        if (playerRef.current) { // Cleanup if player was partially created
            if (statusListenerSubscription.current) {
                statusListenerSubscription.current.remove();
                statusListenerSubscription.current = null;
            }
            try {
                if (DEBUG) console.log(`[Effect LoadPlay - Outer Catch] Removing player due to error for ${keyToLoad}`);
                playerRef.current.remove();
            } catch (removeError: any) {
                if (DEBUG) console.error('[Effect LoadPlay - Outer Catch] Error removing player after error:', removeError.message);
            }
            playerRef.current = null;
        }

        if (state.retryCount < MAX_RETRY_ATTEMPTS && isNetworkError(err) && state.status === 'loading_audio' && state.activeVerseKey === keyToLoad) {
          if (DEBUG) console.log(`[Effect LoadPlay - Outer Catch] Network error for ${keyToLoad}. Incrementing retry.`);
          dispatch({ type: 'INCREMENT_RETRY', key: keyToLoad });
        } else {
          if (DEBUG) console.log(`[Effect LoadPlay - Outer Catch] Non-network or max retries for ${keyToLoad}. Dispatching AUDIO_ERROR: ${errorMessage}`);
          dispatch({ type: 'AUDIO_ERROR', error: errorMessage, key: keyToLoad });
        }
      } finally {
        operationLockRef.current = false;
      }
    };

    const pauseAudio = () => {
      if (operationLockRef.current) return;
      if (playerRef.current) {
        operationLockRef.current = true;
        try {
          if (DEBUG) console.log(`[Effect pauseAudio] Attempting to pause player for ${state.loadedVerseKey}`);
          const currentPositionBeforePause = playerRef.current.currentTime; 
          playerRef.current.pause();
          if (playbackStallTimerRef.current) { 
            clearTimeout(playbackStallTimerRef.current);
            playbackStallTimerRef.current = null;
          }
          dispatch({ type: 'AUDIO_PAUSED_SUCCESS', positionMillis: (currentPositionBeforePause || state.positionMillis || 0) * 1000 });
        } catch (e: any) {
          if (DEBUG) console.error(`[Effect pauseAudio] Error pausing player:`, e.message);
          dispatch({ type: 'AUDIO_ERROR', error: 'Failed to pause' });
        } finally {
          operationLockRef.current = false;
        }
      } else if (state.status === 'pausing_requested' && !playerRef.current) {
        if (DEBUG) console.log(`[Effect pauseAudio] No player object to pause. Transitioning to idle/paused.`);
        dispatch({ type: 'AUDIO_STOPPED_OR_COMPLETED', didJustFinish: false });
      }
    };

    const resumeAudio = async () => { 
      if (operationLockRef.current) return;
      if (playerRef.current) {
        operationLockRef.current = true;
        dispatch({ type: 'AUDIO_RESUME_INITIATED' });
        try {
          if (DEBUG) console.log(`[Effect resumeAudio] Setting audio mode for ${state.loadedVerseKey}...`);
          await AudioModule.setAudioModeAsync({
            allowsRecording: false,
            interruptionMode: 'doNotMix',
            playsInSilentMode: false, // Reverted from diagnostic true
            shouldPlayInBackground: false,
          });
          if (DEBUG) console.log(`[Effect resumeAudio] Audio mode set for ${state.loadedVerseKey} (playsInSilentMode: false, shouldPlayInBackground: false). Background play disabled.`);

          if (DEBUG) console.log(`[Effect resumeAudio] Resuming player for ${state.loadedVerseKey} from ${state.positionMillis}ms`);
          const playerCurrentTimeSec = playerRef.current.currentTime || 0;
          const statePositionSec = state.positionMillis / 1000;
          if (Math.abs(playerCurrentTimeSec - statePositionSec) > 0.5 && state.positionMillis > 0 && playerRef.current.isLoaded) { 
             if (DEBUG) console.log(`[Effect resumeAudio] Discrepancy in position. Player at ${playerCurrentTimeSec}s, state at ${statePositionSec}s. Seeking before play.`);
             await playerRef.current.seekTo(statePositionSec); 
          }
          
          if (playbackStallTimerRef.current) clearTimeout(playbackStallTimerRef.current);
          playbackStallTimerRef.current = setTimeout(() => {
              if (playerRef.current && !playerRef.current.playing && (state.status === 'resuming_requested' || state.status === 'buffering')) {
                  if (DEBUG) console.warn(`[Effect resumeAudio] Playback stall detected for ${state.loadedVerseKey} on resume. Player state: isLoaded=${playerRef.current.isLoaded}, isPlaying=${playerRef.current.playing}`);
                  dispatch({ type: 'AUDIO_ERROR', error: `Playback stalled on resume for ${state.loadedVerseKey}`, key: state.loadedVerseKey || undefined });
              }
          }, PLAYBACK_STALL_TIMEOUT_MS) as unknown as number; 

          try {
            await playerRef.current.play();
            if (DEBUG) console.log(`[Effect resumeAudio] ${state.loadedVerseKey} resume play() call promise resolved.`);
          } catch (resumePlayError: any) {
            if (DEBUG) console.error(`[Effect resumeAudio] EXCEPTION during player.play() call for ${state.loadedVerseKey}:`, resumePlayError.message, resumePlayError.code, resumePlayError);
            dispatch({ type: 'AUDIO_ERROR', error: `Resume play command failed for ${state.loadedVerseKey}: ${resumePlayError.message}`, key: state.loadedVerseKey });
          }

        } catch (e: any) {
          if (DEBUG) console.error(`[Effect resumeAudio] Error setting audio mode or resuming player:`, e.message, e.code, e.nativeError, e);
           if (playbackStallTimerRef.current) {
            clearTimeout(playbackStallTimerRef.current);
            playbackStallTimerRef.current = null;
          }
          dispatch({ type: 'AUDIO_ERROR', error: 'Failed to resume' });
        } finally {
          operationLockRef.current = false;
        }
      } else {
         if (DEBUG) console.log(`[Effect resumeAudio] No player to resume. Requesting new play for ${state.activeVerseKey}`);
         if (state.activeVerseKey) {
            const parsed = parseVerseKey(state.activeVerseKey);
            if (parsed) dispatch({type: 'REQUEST_PLAY', surah: parsed.surah, verse: parsed.verse});
         }
      }
    };

    const stopAndResetPlayer = async () => {
      if (DEBUG) console.log(`[stopAndResetPlayer] Called. Status: ${state.status}, Player exists: ${!!playerRef.current}`);
      if (operationLockRef.current && state.status !== 'stopping_requested') return; 
      operationLockRef.current = true;
      dispatch({ type: 'AUDIO_STOP_INITIATED' });
      if (playbackStallTimerRef.current) { 
        clearTimeout(playbackStallTimerRef.current);
        playbackStallTimerRef.current = null;
      }
      try {
        if (playerRef.current) {
          if (DEBUG) console.log(`[stopAndResetPlayer] Pausing and seeking to 0 for ${state.loadedVerseKey}`);
          playerRef.current.pause();
          if (playerRef.current.isLoaded) { 
            await playerRef.current.seekTo(0); 
          }
          dispatch({ type: 'AUDIO_STOPPED_OR_COMPLETED', didJustFinish: false }); 
        } else {
          dispatch({ type: 'AUDIO_STOPPED_OR_COMPLETED', didJustFinish: false });
        }
      } catch (e: any) {
        if (DEBUG) console.error('[stopAndResetPlayer] Error stopping player:', e.message);
        dispatch({ type: 'AUDIO_ERROR', error: 'Failed to stop audio' });
      } finally {
        operationLockRef.current = false;
      }
    };
    
    const seekAudioInternal = async () => {
      if (operationLockRef.current) return;
      if (playerRef.current && state.pendingSeekPosition !== null) {
        operationLockRef.current = true;
        const seekPosSeconds = state.pendingSeekPosition / 1000;
        
        preSeekStatusRef.current = playerRef.current.playing ? 'playing' : (playerRef.current.paused ? 'paused' : state.status);

        dispatch({ type: 'AUDIO_SEEK_INITIATED', positionMillis: state.pendingSeekPosition });
        try {
          // It's good practice to ensure audio mode is set before operations like seek too,
          // though less critical than before play/resume if already playing/paused.
          // For simplicity, we'll assume mode is set if player exists.
          await playerRef.current.seekTo(seekPosSeconds);
          dispatch({ type: 'AUDIO_SEEK_COMPLETED', positionMillis: state.pendingSeekPosition, currentUiStatusIfBuffering: preSeekStatusRef.current });
        } catch (e: any) {
          if (DEBUG) console.error('[Effect seekAudioInternal] Error seeking audio:', e.message);
          dispatch({ type: 'AUDIO_ERROR', error: 'Failed to seek audio' });
          dispatch({ type: 'AUDIO_BUFFERING_UPDATE', isBuffering: false, previousStatusHint: preSeekStatusRef.current });
        } finally {
          operationLockRef.current = false;
        }
      } else if (state.status === 'seeking_requested' && !playerRef.current) {
         if (DEBUG) console.warn(`[Effect seekAudioInternal] Seek requested but no player. Resetting.`);
         dispatch({ type: 'AUDIO_ERROR', error: 'Cannot seek, no player.' });
      }
    };

    if (state.status === 'loading_requested') {
      loadPlayAudio();
    } else if (state.status === 'pausing_requested') {
      pauseAudio();
    } else if (state.status === 'resuming_requested') {
      resumeAudio();
    } else if (state.status === 'stopping_requested') {
      stopAndResetPlayer();
    } else if (state.status === 'seeking_requested') {
      seekAudioInternal();
    }
  }, [state.status, state.activeVerseKey, state.loadedVerseKey, state.retryCount, onPlaybackStatusUpdate, state.pendingSeekPosition, state.positionMillis]); 


  useEffect(() => {
    const playerInstanceToRemove = playerRef.current;
    const listenerToUnsubscribe = statusListenerSubscription.current;
    const stallTimerToClear = playbackStallTimerRef.current;
    return () => {
      if (listenerToUnsubscribe) {
        listenerToUnsubscribe.remove();
      }
      if (playerInstanceToRemove) {
        if (DEBUG) console.log('[Hook Unmount] Removing player.');
        try {
            playerInstanceToRemove.remove();
        } catch (e: any) {
            if (DEBUG) console.error('Error removing player on hook unmount:', e);
        }
      }
      if (stallTimerToClear) {
        clearTimeout(stallTimerToClear);
      }
      playerRef.current = null;
      statusListenerSubscription.current = null;
      playbackStallTimerRef.current = null;
    };
  }, []);

  // Removed the top-level useEffect for AudioModule.setAudioModeAsync
  // It's now handled within loadPlayAudio and resumeAudio

  const toggleAudio = useCallback((verseNumber: number) => {
    if (DEBUG) console.log(`[toggleAudio] Verse tap: ${verseNumber}, Current Surah: ${state.surahNumber}, Current Status: ${state.status}, ActiveKey: ${state.activeVerseKey}, LoadedKey: ${state.loadedVerseKey}, Pos: ${state.positionMillis}`);
    const targetKey = getVerseKey(state.surahNumber, verseNumber);

    if (operationLockRef.current) {
      if (DEBUG) console.log(`[toggleAudio] Operation lock active for ${targetKey}, ignoring tap.`);
      return;
    }

    if (state.activeVerseKey === targetKey && state.loadedVerseKey === targetKey) { 
      if (playerRef.current?.playing) {
        if (DEBUG) console.log(`[toggleAudio] Player is playing. Requesting PAUSE for ${targetKey}`);
        dispatch({ type: 'REQUEST_PAUSE' });
      } else if (playerRef.current?.isLoaded && (playerRef.current?.paused || state.status === 'paused' || state.status === 'pausing_requested')) {
        if (DEBUG) console.log(`[toggleAudio] Player is loaded and paused/pausing. Requesting RESUME for ${targetKey}`);
        dispatch({ type: 'REQUEST_RESUME' });
      } else if (state.status === 'loading_requested' || state.status === 'loading_audio' || state.status === 'buffering') {
        if (DEBUG) console.log(`[toggleAudio] Player is loading/buffering. Requesting STOP for ${targetKey}`);
        dispatch({ type: 'REQUEST_STOP' });
      } else { 
        if (DEBUG) console.log(`[toggleAudio] Fallback for same key ${targetKey} (current status: ${state.status}). Requesting PLAY.`);
        dispatch({ type: 'REQUEST_PLAY', surah: state.surahNumber, verse: verseNumber });
      }
    } else { 
      if (DEBUG) console.log(`[toggleAudio] Different verse or no matching active/loaded. Requesting PLAY for ${targetKey}`);
      dispatch({ type: 'REQUEST_PLAY', surah: state.surahNumber, verse: verseNumber });
    }
  }, [state.surahNumber, state.status, state.activeVerseKey, state.loadedVerseKey, state.positionMillis]);

  const stopAudio = useCallback(() => {
    if (DEBUG) console.log(`[stopAudio] User requested stop. Current Status: ${state.status}. Dispatching REQUEST_STOP.`);
    dispatch({ type: 'REQUEST_STOP' });
  }, []); 

  const seekAudio = useCallback((newPositionMillis: number) => {
    if (DEBUG) console.log(`[seekAudio] Dispatching REQUEST_SEEK to ${newPositionMillis} for ${state.loadedVerseKey}`);
    if (playerRef.current && playerRef.current.isLoaded && state.loadedVerseKey) { 
      dispatch({ type: 'REQUEST_SEEK', positionMillis: newPositionMillis });
    } else {
        if (DEBUG) console.log(`[seekAudio] Cannot seek. Player not loaded or no loaded verse. Status: ${state.status}, Loaded: ${state.loadedVerseKey}`);
    }
  }, [state.loadedVerseKey, state.status]); 

  const resetActiveVerse = useCallback(() => {
    if (DEBUG) console.log("[resetActiveVerse] Called. Current implementation does nothing. Consider purpose.");
  }, []);

  const currentVerseDetails = parseVerseKey(state.activeVerseKey);
  const activeVerseNumber = currentVerseDetails?.verse || 0; 

  const isActuallyPlaying = playerRef.current ? playerRef.current.playing : (state.status === 'playing' && !state.error);
  const currentPosition = playerRef.current?.isLoaded ? (playerRef.current.currentTime * 1000) : state.positionMillis;
  const currentDuration = playerRef.current?.isLoaded ? (playerRef.current.duration * 1000) : state.durationMillis;


  return {
    playingVerseNumber: activeVerseNumber, 
    activeVerseNumber, 
    isLoading: state.status === 'loading_requested' || state.status === 'loading_audio',
    isBuffering: state.status === 'buffering' || (playerRef.current?.isBuffering ?? false),
    isPlaying: isActuallyPlaying,
    error: state.error,
    durationMillis: currentDuration,
    positionMillis: currentPosition,
    autoplayEnabled: state.autoplayEnabled,
    toggleAudio,
    stopAudio,
    seekAudio,
    resetActiveVerse,
  };
}
