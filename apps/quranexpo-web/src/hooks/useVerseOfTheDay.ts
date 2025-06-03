// src/hooks/useVerseOfTheDay.ts
import { useEffect, useState } from 'preact/hooks';
import { fetchRandomVerse } from '../services/surahService';
import type { DisplayVerse } from '../types/quran';
import { logger } from '../utils/logger';

// Cache key constants
const CACHE_KEY = 'verseOfTheDay';
const CACHE_TIMESTAMP_KEY = 'verseOfTheDayTimestamp';

interface UseVerseOfTheDayResult {
  verse: DisplayVerse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useVerseOfTheDay = (): UseVerseOfTheDayResult => {
  const [verse, setVerse] = useState<DisplayVerse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [triggerRefetch, setTriggerRefetch] = useState(0); // Para forzar un refetch

  const refetch = () => {
    setTriggerRefetch(prev => prev + 1);
  };

  useEffect(() => {
    const getVerse = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const today = new Date().toDateString();
        
        // Check localStorage for cached data if available
        if (typeof window !== 'undefined') {
          // Use environment variable to control caching in development
          const disableCache = import.meta.env.PUBLIC_DISABLE_VERSE_CACHE === 'true';
          const cachedTimestamp = disableCache ? null : localStorage.getItem(CACHE_TIMESTAMP_KEY);
          
          if (cachedTimestamp === today && !disableCache) {
            const cachedVerseData = localStorage.getItem(CACHE_KEY);
            if (cachedVerseData) {
              try {
                const parsedData = JSON.parse(cachedVerseData);
                setVerse(parsedData);
                setLoading(false);
                logger.info('Verse of the Day loaded from cache.');
                return;
              } catch (parseError) {
                logger.error("Failed to parse cached verse data:", parseError);
                // Continue to fetch new verse
              }
            }
          }
        }

        // Fetch a new verse if cache is not available or expired
        const fetchedVerse = await fetchRandomVerse();
        
        if (fetchedVerse && fetchedVerse.surahNumber !== 0) {
          logger.info("Fetched new verse:", fetchedVerse);
          setVerse(fetchedVerse);
          
          // Cache the verse if localStorage is available
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(CACHE_KEY, JSON.stringify(fetchedVerse));
              localStorage.setItem(CACHE_TIMESTAMP_KEY, today);
              logger.info('Verse of the Day cached successfully.');
            } catch (storageError) {
              logger.warn("Could not cache verse:", storageError);
              // Continue without caching
            }
          }
        } else {
          // If we got a malformed response, set an error
          setError('Could not fetch a verse. Please try again later.');
          logger.error('Malformed response when fetching random verse.');
        }
      } catch (e) {
        logger.error('Failed to fetch or cache verse of the day:', e);
        if (e instanceof Error) {
          setError(`Error fetching verse: ${e.message}`);
        } else {
          setError('An error occurred while fetching the verse. Please try again later.');
        }
        setVerse(null);
      } finally {
        setLoading(false);
      }
    };

    getVerse();
  }, [triggerRefetch]); // Dependencia para forzar refetch

  return { verse, loading, error, refetch };
};

export default useVerseOfTheDay;