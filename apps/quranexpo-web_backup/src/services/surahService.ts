import type { DisplayVerse } from '../types/quran';
import { fetchSingleTranslatedVerse } from './apiClient';

// Complete list of Surahs with their number of verses
// This provides a comprehensive set for random selection
const SURAHS = [
  { number: 1, englishName: "Al-Fatiha", numberOfAyahs: 7 },
  { number: 2, englishName: "Al-Baqarah", numberOfAyahs: 286 },
  { number: 3, englishName: "Aal-Imran", numberOfAyahs: 200 },
  { number: 4, englishName: "An-Nisa", numberOfAyahs: 176 },
  { number: 5, englishName: "Al-Ma'idah", numberOfAyahs: 120 },
  { number: 6, englishName: "Al-An'am", numberOfAyahs: 165 },
  { number: 7, englishName: "Al-A'raf", numberOfAyahs: 206 },
  { number: 8, englishName: "Al-Anfal", numberOfAyahs: 75 },
  { number: 9, englishName: "At-Tawbah", numberOfAyahs: 129 },
  { number: 10, englishName: "Yunus", numberOfAyahs: 109 },
  { number: 11, englishName: "Hud", numberOfAyahs: 123 },
  { number: 12, englishName: "Yusuf", numberOfAyahs: 111 },
  { number: 13, englishName: "Ar-Ra'd", numberOfAyahs: 43 },
  { number: 14, englishName: "Ibrahim", numberOfAyahs: 52 },
  { number: 15, englishName: "Al-Hijr", numberOfAyahs: 99 },
  { number: 16, englishName: "An-Nahl", numberOfAyahs: 128 },
  { number: 17, englishName: "Al-Isra", numberOfAyahs: 111 },
  { number: 18, englishName: "Al-Kahf", numberOfAyahs: 110 },
  { number: 19, englishName: "Maryam", numberOfAyahs: 98 },
  { number: 20, englishName: "Ta-Ha", numberOfAyahs: 135 },
  { number: 21, englishName: "Al-Anbiya", numberOfAyahs: 112 },
  { number: 22, englishName: "Al-Hajj", numberOfAyahs: 78 },
  { number: 23, englishName: "Al-Mu'minun", numberOfAyahs: 118 },
  { number: 24, englishName: "An-Nur", numberOfAyahs: 64 },
  { number: 25, englishName: "Al-Furqan", numberOfAyahs: 77 },
  { number: 26, englishName: "Ash-Shu'ara", numberOfAyahs: 227 },
  { number: 27, englishName: "An-Naml", numberOfAyahs: 93 },
  { number: 28, englishName: "Al-Qasas", numberOfAyahs: 88 },
  { number: 29, englishName: "Al-Ankabut", numberOfAyahs: 69 },
  { number: 30, englishName: "Ar-Rum", numberOfAyahs: 60 },
  { number: 31, englishName: "Luqman", numberOfAyahs: 34 },
  { number: 32, englishName: "As-Sajdah", numberOfAyahs: 30 },
  { number: 33, englishName: "Al-Ahzab", numberOfAyahs: 73 },
  { number: 34, englishName: "Saba", numberOfAyahs: 54 },
  { number: 35, englishName: "Fatir", numberOfAyahs: 45 },
  { number: 36, englishName: "Ya-Sin", numberOfAyahs: 83 },
  { number: 37, englishName: "As-Saffat", numberOfAyahs: 182 },
  { number: 38, englishName: "Sad", numberOfAyahs: 88 },
  { number: 39, englishName: "Az-Zumar", numberOfAyahs: 75 },
  { number: 40, englishName: "Ghafir", numberOfAyahs: 85 },
  { number: 41, englishName: "Fussilat", numberOfAyahs: 54 },
  { number: 42, englishName: "Ash-Shura", numberOfAyahs: 53 },
  { number: 43, englishName: "Az-Zukhruf", numberOfAyahs: 89 },
  { number: 44, englishName: "Ad-Dukhan", numberOfAyahs: 59 },
  { number: 45, englishName: "Al-Jathiyah", numberOfAyahs: 37 },
  { number: 46, englishName: "Al-Ahqaf", numberOfAyahs: 35 },
  { number: 47, englishName: "Muhammad", numberOfAyahs: 38 },
  { number: 48, englishName: "Al-Fath", numberOfAyahs: 29 },
  { number: 49, englishName: "Al-Hujurat", numberOfAyahs: 18 },
  { number: 50, englishName: "Qaf", numberOfAyahs: 45 },
  { number: 51, englishName: "Adh-Dhariyat", numberOfAyahs: 60 },
  { number: 52, englishName: "At-Tur", numberOfAyahs: 49 },
  { number: 53, englishName: "An-Najm", numberOfAyahs: 62 },
  { number: 54, englishName: "Al-Qamar", numberOfAyahs: 55 },
  { number: 55, englishName: "Ar-Rahman", numberOfAyahs: 78 },
  { number: 56, englishName: "Al-Waqi'ah", numberOfAyahs: 96 },
  { number: 57, englishName: "Al-Hadid", numberOfAyahs: 29 },
  { number: 58, englishName: "Al-Mujadila", numberOfAyahs: 22 },
  { number: 59, englishName: "Al-Hashr", numberOfAyahs: 24 },
  { number: 60, englishName: "Al-Mumtahanah", numberOfAyahs: 13 },
  { number: 61, englishName: "As-Saf", numberOfAyahs: 14 },
  { number: 62, englishName: "Al-Jumu'ah", numberOfAyahs: 11 },
  { number: 63, englishName: "Al-Munafiqun", numberOfAyahs: 11 },
  { number: 64, englishName: "At-Taghabun", numberOfAyahs: 18 },
  { number: 65, englishName: "At-Talaq", numberOfAyahs: 12 },
  { number: 66, englishName: "At-Tahrim", numberOfAyahs: 12 },
  { number: 67, englishName: "Al-Mulk", numberOfAyahs: 30 },
  { number: 68, englishName: "Al-Qalam", numberOfAyahs: 52 },
  { number: 69, englishName: "Al-Haqqah", numberOfAyahs: 52 },
  { number: 70, englishName: "Al-Ma'arij", numberOfAyahs: 44 },
  { number: 71, englishName: "Nuh", numberOfAyahs: 28 },
  { number: 72, englishName: "Al-Jinn", numberOfAyahs: 28 },
  { number: 73, englishName: "Al-Muzzammil", numberOfAyahs: 20 },
  { number: 74, englishName: "Al-Muddathir", numberOfAyahs: 56 },
  { number: 75, englishName: "Al-Qiyamah", numberOfAyahs: 40 },
  { number: 76, englishName: "Al-Insan", numberOfAyahs: 31 },
  { number: 77, englishName: "Al-Mursalat", numberOfAyahs: 50 },
  { number: 78, englishName: "An-Naba", numberOfAyahs: 40 },
  { number: 79, englishName: "An-Nazi'at", numberOfAyahs: 46 },
  { number: 80, englishName: "Abasa", numberOfAyahs: 42 },
  { number: 81, englishName: "At-Takwir", numberOfAyahs: 29 },
  { number: 82, englishName: "Al-Infitar", numberOfAyahs: 19 },
  { number: 83, englishName: "Al-Mutaffifin", numberOfAyahs: 36 },
  { number: 84, englishName: "Al-Inshiqaq", numberOfAyahs: 25 },
  { number: 85, englishName: "Al-Buruj", numberOfAyahs: 22 },
  { number: 86, englishName: "At-Tariq", numberOfAyahs: 17 },
  { number: 87, englishName: "Al-A'la", numberOfAyahs: 19 },
  { number: 88, englishName: "Al-Ghashiyah", numberOfAyahs: 26 },
  { number: 89, englishName: "Al-Fajr", numberOfAyahs: 30 },
  { number: 90, englishName: "Al-Balad", numberOfAyahs: 20 },
  { number: 91, englishName: "Ash-Shams", numberOfAyahs: 15 },
  { number: 92, englishName: "Al-Lail", numberOfAyahs: 21 },
  { number: 93, englishName: "Ad-Duha", numberOfAyahs: 11 },
  { number: 94, englishName: "Ash-Sharh", numberOfAyahs: 8 },
  { number: 95, englishName: "At-Tin", numberOfAyahs: 8 },
  { number: 96, englishName: "Al-Alaq", numberOfAyahs: 19 },
  { number: 97, englishName: "Al-Qadr", numberOfAyahs: 5 },
  { number: 98, englishName: "Al-Bayyinah", numberOfAyahs: 8 },
  { number: 99, englishName: "Az-Zalzalah", numberOfAyahs: 8 },
  { number: 100, englishName: "Al-Adiyat", numberOfAyahs: 11 },
  { number: 101, englishName: "Al-Qari'ah", numberOfAyahs: 11 },
  { number: 102, englishName: "At-Takathur", numberOfAyahs: 8 },
  { number: 103, englishName: "Al-Asr", numberOfAyahs: 3 },
  { number: 104, englishName: "Al-Humazah", numberOfAyahs: 9 },
  { number: 105, englishName: "Al-Fil", numberOfAyahs: 5 },
  { number: 106, englishName: "Quraish", numberOfAyahs: 4 },
  { number: 107, englishName: "Al-Ma'un", numberOfAyahs: 7 },
  { number: 108, englishName: "Al-Kawthar", numberOfAyahs: 3 },
  { number: 109, englishName: "Al-Kafirun", numberOfAyahs: 6 },
  { number: 110, englishName: "An-Nasr", numberOfAyahs: 3 },
  { number: 111, englishName: "Al-Masad", numberOfAyahs: 5 },
  { number: 112, englishName: "Al-Ikhlas", numberOfAyahs: 4 },
  { number: 113, englishName: "Al-Falaq", numberOfAyahs: 5 },
  { number: 114, englishName: "An-Nas", numberOfAyahs: 6 },
];

// Popular surahs for more relevant random selection
// 60% chance to select from these popular surahs
const POPULAR_SURAHS = [1, 2, 3, 4, 5, 18, 19, 36, 55, 56, 67, 78, 112, 113, 114];

/**
 * Picks a random surah with weighted selection favoring popular surahs
 * @returns A random surah info object
 */
const getRandomSurah = () => {
  // 60% chance to select from popular surahs
  const usePopularList = Math.random() < 0.6;
  
  if (usePopularList) {
    // Select a random index from popular surahs
    const randomPopularIndex = Math.floor(Math.random() * POPULAR_SURAHS.length);
    const surahNumber = POPULAR_SURAHS[randomPopularIndex];
    return SURAHS.find(s => s.number === surahNumber) || SURAHS[0];
  } else {
    // Select a random surah from the complete list
    return SURAHS[Math.floor(Math.random() * SURAHS.length)];
  }
};

/**
 * Fetches a random verse from the Quran
 * @returns A Promise resolving to a DisplayVerse object
 * @throws Error if the API call fails
 */
export const fetchRandomVerse = async (): Promise<DisplayVerse> => {
  // Select a random surah using weighted selection
  const randomSurahInfo = getRandomSurah();
  const surahNumber = randomSurahInfo.number;
  const numberOfAyahsInSurah = randomSurahInfo.numberOfAyahs;
  const surahEnglishName = randomSurahInfo.englishName;

  // Select a random ayah from this surah, avoiding the first ayah for some surahs
  // as they often contain the Bismillah which is repeated
  const minAyah = (surahNumber !== 1 && surahNumber !== 9) ? 2 : 1;
  const randomAyahNumber = Math.floor(Math.random() * (numberOfAyahsInSurah - minAyah + 1)) + minAyah;

  console.log(`Fetching verse ${surahNumber}:${randomAyahNumber}`);

  try {
    // Fetch the verse with translation - let errors propagate to caller
    const translatedVerse = await fetchSingleTranslatedVerse(surahNumber, randomAyahNumber);
    
    // If no verse was found but no error was thrown (returned null)
    if (!translatedVerse) {
      throw new Error(`Verse ${surahNumber}:${randomAyahNumber} could not be retrieved.`);
    }

    // Create DisplayVerse from the API response
    return {
      arabic: translatedVerse.text,
      english: translatedVerse.translation || '',
      surahName: surahEnglishName,
      surahNumber: surahNumber,
      verseNumberInSurah: randomAyahNumber,
      fullReference: `Surah ${surahEnglishName} (${surahNumber}:${randomAyahNumber})`,
    };
  } catch (error) {
    // Log the error for debugging
    console.error('Error in fetchRandomVerse:', error);
    
    // Rethrow the error to be handled by the component
    throw error;
  }
};