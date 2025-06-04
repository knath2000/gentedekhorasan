import { persistentAtom } from '@nanostores/persistent';

export type SurahSortOrder = 'canonical' | 'revelation' | 'length-asc' | 'length-desc' | 'revelation-location';

// Almacenar booleanos como strings 'true' o 'false'
export const showTranslation = persistentAtom<string>('showTranslation', 'true');
export const autoplayEnabled = persistentAtom<string>('autoplayEnabled', 'false');
export const audioActive = persistentAtom<string>('audioActive', 'false');
export const surahSortOrder = persistentAtom<SurahSortOrder>('surahSortOrder', 'canonical');
export const aiTranslationsEnabled = persistentAtom<string>('aiTranslationsEnabled', 'false'); // Nuevo estado para traducciones de IA

export const setShowTranslation = (show: boolean) => showTranslation.set(String(show));
export const setAutoplayEnabled = (enabled: boolean) => autoplayEnabled.set(String(enabled));
export const setAudioActive = (active: boolean) => audioActive.set(String(active));
export const setSurahSortOrder = (order: SurahSortOrder) => surahSortOrder.set(order);
export const setAiTranslationsEnabled = (enabled: boolean) => aiTranslationsEnabled.set(String(enabled)); // Nueva función para actualizar el estado
