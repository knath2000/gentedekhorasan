// src/services/audioService.ts
import { AudioPlayer, AudioStatus, createAudioPlayer } from 'expo-audio';
import Constants from 'expo-constants';
import { getAudioPathname } from '../lib/blobClient';

// Define a type for the playback status listener subscription
type PlaybackStatusListener = ReturnType<AudioPlayer['addListener']>;

export interface AudioFile {
  surahNumber: number;
  verseNumber: number;
  url: string;
  player?: AudioPlayer;
  listenerSubscription?: PlaybackStatusListener; // To store and remove listener
  isLoaded: boolean; // This might be redundant if player.isLoaded is used
  isPlaying: boolean; // This will be updated by the status listener
}

// Cache for loaded audio player objects
const audioCache: Record<string, AudioFile> = {};
const UPDATE_INTERVAL_MS_SERVICE = 500; // Update interval for players created by this service

/**
 * Get the URL for a verse audio file from Vercel Blob
 */
export const getAudioUrl = (surahNumber: number, verseNumber: number): string => {
  const pathname = getAudioPathname(surahNumber, verseNumber);
  
  let baseUrl = Constants.expoConfig?.extra?.VERCEL_BLOB_URL_BASE as string;
  
  if (!baseUrl) {
    console.error('VERCEL_BLOB_URL_BASE is not defined in app.json extra. Cannot construct audio URL.');
    return '';
  }

  if (!/^https?:\/\//i.test(baseUrl)) {
    baseUrl = `https://${baseUrl}`;
  }
  
  const fullUrl = `${baseUrl.replace(/\/$/, '')}/${pathname.replace(/^\//, '')}`;
  return fullUrl;
};

/**
 * Load an audio file for a specific verse
 */
export const loadAudio = async (surahNumber: number, verseNumber: number): Promise<AudioFile | null> => {
  const cacheKey = `${surahNumber}-${verseNumber}`;
  
  if (audioCache[cacheKey]?.player?.isLoaded) { // Check player.isLoaded
    return audioCache[cacheKey];
  }
  
  try {
    const url = getAudioUrl(surahNumber, verseNumber);
    if (!url) {
      throw new Error(`Audio URL not found for Surah ${surahNumber}, Verse ${verseNumber}`);
    }

    // If a player exists in cache but isn't loaded (e.g., after error or unload), remove it first
    if (audioCache[cacheKey]?.player) {
        audioCache[cacheKey].listenerSubscription?.remove();
        audioCache[cacheKey].player?.remove(); // Clean up old instance
    }

    const player = createAudioPlayer({ uri: url }, UPDATE_INTERVAL_MS_SERVICE);
    
    const audioFile: AudioFile = {
      surahNumber,
      verseNumber,
      url,
      player,
      isLoaded: player.isLoaded, 
      isPlaying: false,
    };
    
    audioCache[cacheKey] = audioFile;
    return audioFile;
  } catch (error) {
    console.error(`Error loading audio for Surah ${surahNumber}, Verse ${verseNumber}:`, error);
    if (audioCache[cacheKey]) {
        audioCache[cacheKey].listenerSubscription?.remove();
        audioCache[cacheKey].player?.remove();
        delete audioCache[cacheKey];
    }
    return null;
  }
};

/**
 * Play a verse audio
 */
export const playAudio = async (surahNumber: number, verseNumber: number): Promise<void> => {
  try {
    // Explicitly type audioFileEntry to allow for null or undefined initially
    let audioFileEntry: AudioFile | null | undefined = audioCache[`${surahNumber}-${verseNumber}`];
    
    if (!audioFileEntry || !audioFileEntry.player) {
      audioFileEntry = await loadAudio(surahNumber, verseNumber);
    }

    if (!audioFileEntry) {
      console.error(`Failed to load audio for Surah ${surahNumber}, Verse ${verseNumber}. Cannot play.`);
      throw new Error(`Failed to load audio for Surah ${surahNumber}, Verse ${verseNumber}.`);
    }
    
    // At this point, audioFileEntry is guaranteed to be AudioFile, but player might still be undefined if createAudioPlayer failed silently
    // However, createAudioPlayer should throw or player would be an instance.
    const player = audioFileEntry.player;
    if (!player) { 
        throw new Error(`Player instance not found for Surah ${surahNumber}, Verse ${verseNumber} after load attempt.`);
    }

    if (audioFileEntry.listenerSubscription) {
      audioFileEntry.listenerSubscription.remove();
    }

    audioFileEntry.listenerSubscription = player.addListener('playbackStatusUpdate', (status: AudioStatus) => {
      const cachedFile = audioCache[`${surahNumber}-${verseNumber}`]; 
      if (cachedFile) { 
        cachedFile.isPlaying = status.playing;
        cachedFile.isLoaded = status.isLoaded; 
        
        if (status.didJustFinish) {
          cachedFile.isPlaying = false;
        }
      }
    });
    
    player.play(); 
    audioFileEntry.isPlaying = true; 
    audioFileEntry.isLoaded = player.isLoaded;

  } catch (error) {
    console.error(`Error playing audio for Surah ${surahNumber}, Verse ${verseNumber}:`, error);
    throw error;
  }
};

/**
 * Pause the currently playing verse audio
 */
export const pauseAudio = async (surahNumber: number, verseNumber: number): Promise<void> => {
  const cacheKey = `${surahNumber}-${verseNumber}`;
  
  if (audioCache[cacheKey]?.player) {
    try {
      audioCache[cacheKey].player?.pause(); 
      audioCache[cacheKey].isPlaying = false;
    } catch (error) {
      console.error(`Error pausing audio for Surah ${surahNumber}, Verse ${verseNumber}:`, error);
      throw error;
    }
  }
};

/**
 * Stop all currently playing audio
 */
export const stopAllAudio = async (): Promise<void> => {
  try {
    for (const key in audioCache) {
      const audioFile = audioCache[key];
      if (audioFile.player && (audioFile.isPlaying || audioFile.player.playing)) {
        audioFile.player.pause(); 
        await audioFile.player.seekTo(0); 
        audioFile.isPlaying = false;
      }
    }
  } catch (error) {
    console.error('Error stopping all audio:', error);
    throw error;
  }
};

/**
 * Clean up audio resources for a specific surah when leaving the reader screen
 */
export const unloadSurahAudio = async (surahNumber: number): Promise<void> => {
  try {
    const keysToUnload = Object.keys(audioCache).filter(key => key.startsWith(`${surahNumber}-`));
    
    for (const key of keysToUnload) {
      const audioFile = audioCache[key];
      if (audioFile.player) {
        audioFile.listenerSubscription?.remove(); 
        audioFile.player.remove(); 
        delete audioCache[key];
      }
    }
  } catch (error) {
    console.error(`Error unloading audio for Surah ${surahNumber}:`, error);
  }
};