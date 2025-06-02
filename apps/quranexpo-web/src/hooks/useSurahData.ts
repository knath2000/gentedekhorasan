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
      setLoading(true);
      setError(null);
      try {
        const surahData = await fetchSurahById(surahId);
        if (surahData) {
          setSurah(surahData);
          const versesData = await fetchVersesForSurah(surahId);
          setVerses(versesData);
        } else {
          setError(`Surah with ID ${surahId} not found.`);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Error loading Surah data.');
        } else {
          setError('An unknown error occurred while loading Surah data.');
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [surahId]);

  return { surah, verses, loading, error };
}