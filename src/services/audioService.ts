// src/services/audioService.ts
import { Audio, AVPlaybackStatus } from 'expo-av';
import { supabase } from '../lib/supabaseClient';

export interface AudioFile {
  surahNumber: number;
  verseNumber: number;
  url: string;
  sound?: Audio.Sound;
  isLoaded: boolean;
  isPlaying: boolean;
}

// Cache for loaded audio objects
const audioCache: Record<string, AudioFile> = {};

/**
 * Get the URL for a verse audio file
 */
export const getAudioUrl = (surahNumber: number, verseNumber: number): string => {
  // Format: 001001.mp3 (for Surah 1, Verse 1)
  const surahStr = surahNumber.toString().padStart(3, '0');
  const verseStr = verseNumber.toString().padStart(3, '0');
  const fileName = `${surahStr}${verseStr}.mp3`;
  
  // Construct full public URL to the file in Supabase storage
  const { data } = supabase.storage.from('audiofiles').getPublicUrl('alafasy128/' + fileName);
  if (!data || !data.publicUrl) {
    console.error(`Could not get public URL for audio file: ${fileName}`);
    // Return a placeholder or throw an error, depending on desired handling
    return ''; 
  }
  return data.publicUrl;
};

/**
 * Load an audio file for a specific verse
 */
export const loadAudio = async (surahNumber: number, verseNumber: number): Promise<AudioFile> => {
  const cacheKey = `${surahNumber}-${verseNumber}`;
  
  // Return from cache if already loaded
  if (audioCache[cacheKey] && audioCache[cacheKey].isLoaded) {
    return audioCache[cacheKey];
  }
  
  try {
    const url = getAudioUrl(surahNumber, verseNumber);
    if (!url) {
      throw new Error(`Audio URL not found for Surah ${surahNumber}, Verse ${verseNumber}`);
    }
    const { sound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: false } // Don't play immediately
    );
    
    const audioFile: AudioFile = {
      surahNumber,
      verseNumber,
      url,
      sound,
      isLoaded: true,
      isPlaying: false,
    };
    
    audioCache[cacheKey] = audioFile;
    return audioFile;
  } catch (error) {
    console.error(`Error loading audio for Surah ${surahNumber}, Verse ${verseNumber}:`, error);
    throw error;
  }
};

/**
 * Play a verse audio
 */
export const playAudio = async (surahNumber: number, verseNumber: number): Promise<void> => {
  try {
    const audioFile = await loadAudio(surahNumber, verseNumber);
    
    // Set up playback status update handler
    audioFile.sound?.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      if (status.isLoaded) {
        audioCache[`${surahNumber}-${verseNumber}`].isPlaying = status.isPlaying; // Update cache directly
        
        // When audio finishes playing
        if (status.didJustFinish) {
          audioCache[`${surahNumber}-${verseNumber}`].isPlaying = false; // Update cache
        }
      }
    });
    
    await audioFile.sound?.playAsync();
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
  
  if (audioCache[cacheKey] && audioCache[cacheKey].sound) {
    try {
      await audioCache[cacheKey].sound?.pauseAsync();
      audioCache[cacheKey].isPlaying = false; // Update cache
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
    await Promise.all(
      Object.values(audioCache)
        .filter(audio => audio.sound && audio.isPlaying)
        .map(async (audio) => {
          await audio.sound?.stopAsync();
          audio.isPlaying = false; // Update cache
        })
    );
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
    
    await Promise.all(
      keysToUnload.map(async (key) => {
        if (audioCache[key].sound) {
          await audioCache[key].sound?.unloadAsync();
          delete audioCache[key];
        }
      })
    );
  } catch (error) {
    console.error(`Error unloading audio for Surah ${surahNumber}:`, error);
  }
};