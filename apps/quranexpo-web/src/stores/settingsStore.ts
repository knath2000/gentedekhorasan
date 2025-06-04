import { persistentAtom } from '@nanostores/persistent';

export type SurahSortOrder = 'canonical' | 'revelation' | 'length-asc' | 'length-desc' | 'revelation-location';

<<<<<<< HEAD
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
=======
export interface AppSettings {
  autoplayEnabled: boolean;
  showTranslation: boolean;
  audioActive: boolean;
  surahSortOrder: SurahSortOrder;
  showAITranslation: boolean; // Nueva propiedad
}

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  autoplayEnabled: false,
  showTranslation: true,
  audioActive: false,
  surahSortOrder: 'canonical', // Default sort order
  showAITranslation: false, // Valor por defecto
};

// Create persistent atoms for each setting
export const autoplayEnabled = persistentAtom<boolean>(
  'settings.autoplayEnabled', 
  DEFAULT_SETTINGS.autoplayEnabled,
  {
    encode: JSON.stringify,
    decode: JSON.parse
  }
);

export const showTranslation = persistentAtom<boolean>(
  'settings.showTranslation', 
  DEFAULT_SETTINGS.showTranslation,
  {
    encode: JSON.stringify,
    decode: JSON.parse
  }
);

// Helper functions
export function toggleAutoplay() {
  autoplayEnabled.set(!autoplayEnabled.get());
}

export const audioActive = persistentAtom<boolean>(
  'settings.audioActive', 
  DEFAULT_SETTINGS.audioActive,
  {
    encode: JSON.stringify,
    decode: JSON.parse
  }
);

export function toggleTranslation() {
  showTranslation.set(!showTranslation.get());
}

export const surahSortOrder = persistentAtom<SurahSortOrder>(
  'settings.surahSortOrder',
  DEFAULT_SETTINGS.surahSortOrder,
  {
    encode: JSON.stringify,
    decode: JSON.parse
  }
);

export function setSurahSortOrder(order: SurahSortOrder) {
  surahSortOrder.set(order);
}

export function setAudioActive(active: boolean) {
  audioActive.set(active);
}

export const showAITranslation = persistentAtom<boolean>(
  'settings.showAITranslation',
  DEFAULT_SETTINGS.showAITranslation,
  {
    encode: JSON.stringify,
    decode: JSON.parse
  }
);

export function toggleAITranslation() {
  showAITranslation.set(!showAITranslation.get());
}
>>>>>>> b519158c56c807d0aca03b25983aad5609f1f230
