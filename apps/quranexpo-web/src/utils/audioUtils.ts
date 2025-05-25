/**
 * Utils for audio handling in the Quran Reader
 */

/**
 * Generates a properly formatted URL for a verse audio file
 * Based on the pattern used in the native app
 * 
 * @param surahId - The Surah number (1-114)
 * @param verseNumber - The verse number within the Surah
 * @returns A complete URL to the verse audio file
 */
export const getVerseAudioUrl = (surahId: number, verseNumber: number): string => {
  const surahStr = surahId.toString().padStart(3, '0');
  const verseStr = verseNumber.toString().padStart(3, '0');
  return `https://h2zfzwpeaxcsfu9s.public.blob.vercel-storage.com/quran-audio/alafasy128/${surahStr}${verseStr}.mp3`;
};

/**
 * Formats seconds into a mm:ss display
 * 
 * @param seconds - Time in seconds
 * @returns Formatted time string (mm:ss)
 */
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) {
    return '0:00';
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Creates a unique key for a verse
 */
export const getVerseKey = (surahId: number, verseNumber: number): string => {
  return `${surahId}-${verseNumber}`;
};