import { $authStore } from '@clerk/astro/client'; // Import for token handling
import { useEffect, useState } from 'preact/hooks';
import { fetchSurahById, fetchVersesForSurah } from '../services/apiClient';
import type { Surah, Verse } from '../types/quran';

export function useSurahData(surahId: number) {
  const [surah, setSurah] = useState<Surah | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const auth = $authStore.get();
      const token = await auth.session?.getToken();
      
      if (!token) {
        setError('Authentication token not available. Please log in.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const surahData = await fetchSurahById(surahId, token);  // Pass token if needed
        if (surahData) {
          setSurah(surahData);
          const versesData = await fetchVersesForSurah(surahId, token);  // Pass token
          setVerses(versesData);
        } else {
          setError(`Surah with ID ${surahId} not found.`);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.message) {
          setError(err.message || 'Error loading Surah data.');
        } else {
          setError('An unknown error occurred while loading Surah data. Please check the console for details.');
        }
        console.error('Error in useSurahData:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [surahId]);

  return { surah, verses, loading, error };
}