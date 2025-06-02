import { useEffect, useState } from 'preact/hooks';
import { fetchSurahById, fetchVersesForSurah } from '../../../services/apiClient'; // Ruta actualizada
import type { Surah, Verse } from '../../../types/quran'; // Ruta actualizada

interface UseSurahDataResult {
  surah: Surah | null;
  verses: Verse[];
  loading: boolean;
  error: string | null;
}

export const useSurahData = (surahId: number): UseSurahDataResult => {
  const [surah, setSurah] = useState<Surah | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      setSurah(null);
      setVerses([]);

      try {
        const [surahData, versesData] = await Promise.all([
          fetchSurahById(surahId),
          fetchVersesForSurah(surahId)
        ]);

        if (!surahData) {
          throw new Error(`Surah with ID ${surahId} not found.`);
        }

        setSurah(surahData);
        setVerses(versesData);
        console.log('Loading data for Surah:', surahId);
        console.log('Verses after fetch:', versesData.length);
      } catch (err: any) {
        console.error('Error loading Surah data:', err);
        setError(err.message || 'Failed to load Surah data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (surahId > 0 && surahId <= 114) {
      loadData();
    } else {
      setError('Invalid Surah ID. Please enter a number between 1 and 114.');
      setLoading(false);
    }
  }, [surahId]);

  return { surah, verses, loading, error };
};