import type { Surah } from '../types/quran';

import type { SurahSortOrder } from '../stores/settingsStore';

export type SortOption = SurahSortOrder;

export function getComparator(opt: SortOption): (a: Surah, b: Surah) => number {
  return (a, b) => {
    switch (opt) {
      case 'canonical':
        return a.number - b.number;
      case 'revelation':
        return a.revelationOrder - b.revelationOrder;
      case 'length-asc':
        return a.numberOfAyahs - b.numberOfAyahs;
      case 'length-desc':
        return b.numberOfAyahs - a.numberOfAyahs;
      case 'revelation-location':
        // Priorizar Meccan sobre Medinan o viceversa, o simplemente ordenar alfabéticamente
        // Para una ordenación consistente, podemos asignar un valor numérico
        const typeOrder = { 'Meccan': 1, 'Medinan': 2 };
        return (typeOrder[a.revelationType] || 0) - (typeOrder[b.revelationType] || 0);
      default:
        return 0; // No sorting
    }
  };
}

export const sortOptionLabels: Record<SortOption, string> = {
  canonical: 'Orden Canónico',
  revelation: 'Orden de Revelación',
  'length-asc': 'Longitud (Ascendente)',
  'length-desc': 'Longitud (Descendente)',
  'revelation-location': 'Lugar de Revelación',
};