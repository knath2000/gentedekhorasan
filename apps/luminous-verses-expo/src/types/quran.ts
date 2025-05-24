export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan'; // Corrected type
}

export interface Verse {
  id: number;
  surahId: number;
  numberInSurah: number;
  text: string;
  translation?: string; // Add translation field
}