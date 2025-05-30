import { useEffect, useState } from 'preact/hooks';
import { fetchSurahList } from '../services/apiClient';
import { surahSortOrder } from '../stores/settingsStore';
import type { Surah } from '../types/quran';
import { getComparator, sortOptionLabels } from '../utils/sorting';
import ReactSurahCard from './ReactSurahCard';

// Versión simplificada sin virtualización
const SurahListContainer = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState(surahSortOrder.get());
  const [sortedSurahs, setSortedSurahs] = useState<Surah[]>([]);

  useEffect(() => {
    const unsubscribe = surahSortOrder.listen(order => {
      setSortOrder(order);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadSurahs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Solo cargar datos de surah (ya incluye transliterationName correcto)
        const surahData = await fetchSurahList();
        setSurahs(surahData);
      } catch (err: any) {
        console.error('Error loading surahs:', err);
        setError(err.message || 'Failed to load surahs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadSurahs();
  }, []);

  useEffect(() => {
    // Reordenar las suras cuando cambien las suras originales o el orden de ordenación
    const sorted = [...surahs].sort(getComparator(sortOrder));
    setSortedSurahs(sorted);
  }, [surahs, sortOrder]);

  const handleSurahPress = (surah: Surah) => {
    console.log(`Surah ${surah.number} - ${surah.transliterationName} selected`);
    window.location.href = `/reader/${surah.number}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-desertWarmOrange"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
        <div className="flex items-center">
          <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <p>{error}</p>
        </div>
        <div className="mt-3">
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-full px-4 overflow-y-auto scrollbar-hide pt-16"> {/* Contenedor principal con scroll y padding superior */}
      <h1 className="text-3xl font-englishBold text-textPrimary text-center tracking-wide">
        Surahs
      </h1>
      
      {/* Debug info to check if surahs are being loaded */}
      <div className="text-center text-sm text-textSecondary mt-1 mb-4"> {/* Reducir el margen superior y añadir margen inferior */}
        {sortedSurahs.length > 0 ? `${sortedSurahs.length} surahs cargadas. Orden actual: ${sortOptionLabels[sortOrder]}` : 'No surahs loaded'}
      </div>

      {/* Lista normal sin virtualización */}
      <div className="space-y-4"> {/* Ya no es absoluto ni tiene overflow propio */}
        {sortedSurahs.map((surah, index) => (
          <div key={surah.number} className={`animate-list-item animate-item-${Math.min(index, 19)}`}>
            <ReactSurahCard
              surah={surah}
              onPress={handleSurahPress}
              className=""
            />
          </div>
        ))}
      </div>
      
      {/* Extra padding at the bottom to ensure last item is fully visible */}
      <div className="h-4"></div>
    </div>
  );
};

export default SurahListContainer;
