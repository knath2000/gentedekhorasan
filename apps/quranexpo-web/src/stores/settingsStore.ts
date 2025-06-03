import { persistentAtom } from '@nanostores/persistent';

// Settings interface
export type SurahSortOrder = 'canonical' | 'revelation' | 'length-asc' | 'length-desc' | 'revelation-location';

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
