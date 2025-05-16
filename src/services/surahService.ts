// src/services/surahService.ts
import { Surah, Verse } from '../types/quran';
// import { getVerseFromDb, getVersesBySurahFromDb } from './quranDbService'; // Old DB functions
import { fetchTranslationVersesBySurah, fetchVerseFromAPI, fetchVersesFromAPI } from './apiClient'; // New API client functions
import { getBasicSurahList } from './quranMetadataService'; // Import new service

export const fetchSurahList = async (): Promise<Surah[]> => {
  try {
    console.log('Fetching Surah list using quranMetadataService...');
    const basicSurahList = await getBasicSurahList();

    if (!basicSurahList) {
      console.error('Failed to fetch surah list from quranMetadataService (Edge Config or DB fallback).');
      throw new Error('Failed to retrieve Surah list.');
    }

    // Adapt SurahBasicInfo[] to Surah[]
    return basicSurahList.map(item => ({
      number: item.number,
      name: item.name, // This is arabic_name in quran_surahs table, maps to Surah.name
      englishName: item.ename,
      englishNameTranslation: `Chapter ${item.ename}`, // Assuming this is how it was structured
      numberOfAyahs: item.ayas,
      revelationType: item.type === 'Meccan' || item.type === 'Medinan' ? item.type : 'Meccan', // Validate
      // Fields from quran.ts Surah type that might not be in SurahBasicInfo directly:
      // id: item.number.toString(), // Assuming id is string representation of number
      // transliterationName: item.tname, // Add if needed and available
      // Add other fields if they were part of the original Surah type and are available
      // For example, if the original surahlist.json had more fields, ensure they are mapped or handled.
      // The original mapping had `...item` which implies the old surahlist.json might have had more fields.
      // For now, mapping core fields.
      id: String(item.number), // Ensure id is a string if quran.ts expects it
      arabicName: item.name,
      transliterationName: item.tname,
      // Ensure all fields required by the Surah type in '../types/quran' are present
    }));

  } catch (error: any) {
    console.error('Error fetching surah list via quranMetadataService:', error.message);
    throw error;
  }
};

export const fetchSurahById = async (id: number): Promise<Surah | null> => {
  try {
    const surahList = await fetchSurahList();
    const surah = surahList.find(s => s.number === id);

    if (!surah) {
      console.warn(`Surah with id ${id} not found in fetched list.`);
      return null;
    }
    return surah;

  } catch (error: any) {
    console.error(`Error fetching surah with id ${id}:`, error.message);
    throw error; 
  }
}

// Removed fetchTranslationsBySurahId as translations will now be fetched via API

export const fetchVersesBySurahId = async (surahId: number, translator: string = "en.yusufali"): Promise<Verse[]> => {
  try {
    console.log(`Fetching verses for surah ${surahId} (Arabic and Translation from API)`);

    // Fetch Arabic text from Vercel API
    const arabicVersesFromAPI = await fetchVersesFromAPI(surahId);

    if (!arabicVersesFromAPI || arabicVersesFromAPI.length === 0) {
      console.warn(`No Arabic verses found for surah ${surahId} from API.`);
      // Still try to fetch translations, maybe they exist independently
    }

    // Fetch translations from Vercel API using the new function
    // The new API returns an array of objects like: { id, surahId, numberInSurah, translation }
    const translationVerseObjects = await fetchTranslationVersesBySurah(surahId, translator);
    
    // Create a map for quick lookup of translations by verse numberInSurah
    const translationsMap = translationVerseObjects.reduce((acc, verse) => {
      acc[verse.numberInSurah] = verse.translation;
      return acc;
    }, {} as Record<number, string | undefined>);

    // If arabicVersesFromAPI is empty, but translations exist, map translations
    if ((!arabicVersesFromAPI || arabicVersesFromAPI.length === 0) && translationVerseObjects.length > 0) {
      console.warn(`No Arabic verses from API for Surah ${surahId}, but translations found. Returning translations only.`);
      return translationVerseObjects.map(tVerse => ({
        id: tVerse.id,
        surahId: tVerse.surahId,
        numberInSurah: tVerse.numberInSurah,
        text: '', // No Arabic text
        translation: tVerse.translation,
      }));
    }
    
    // Combine Arabic text from API with translations from API
    return arabicVersesFromAPI.map(apiVerse => ({
      id: apiVerse.id,
      surahId: apiVerse.surahId,
      numberInSurah: apiVerse.numberInSurah,
      text: apiVerse.text,
      translation: translationsMap[apiVerse.numberInSurah] || undefined
    }));
  } catch (error: any) {
    console.error(`Error fetching verses for surah ${surahId} with translator ${translator}:`, error.message);
    throw error;
  }
};

interface DailyVerse {
  arabic: string;
  english: string;
  surahName: string;
  surahNumber: number;
  verseNumberInSurah: number;
}

export const fetchRandomVerse = async (): Promise<DailyVerse> => {
  try {
    const surahs = await fetchSurahList(); // Uses Vercel Blob for surah list
    if (!surahs || surahs.length === 0) throw new Error('No surahs found from Vercel Blob');

    const randomSurahInfo = surahs[Math.floor(Math.random() * surahs.length)];
    const surahNumber = randomSurahInfo.number;
    const numberOfAyahsInSurah = randomSurahInfo.numberOfAyahs;
    const surahEnglishName = randomSurahInfo.englishName;

    const randomAyahNumber = Math.floor(Math.random() * numberOfAyahsInSurah) + 1;

    // Fetch Arabic text for the random verse from Vercel API
    const verseDataItem = await fetchVerseFromAPI(surahNumber, randomAyahNumber);

    if (!verseDataItem) {
      // API client already logs a warning if 404, or throws for other errors
      console.error(`Verse ${surahNumber}:${randomAyahNumber} not found or error fetching from API.`);
      // Return a default error structure or rethrow, depending on desired app behavior
      return {
        arabic: 'Error loading verse text.',
        english: 'Please try again later.',
        surahName: surahEnglishName || 'Error',
        surahNumber: surahNumber || 0,
        verseNumberInSurah: randomAyahNumber || 0,
      };
    }
    const arabicText = verseDataItem.text;

    // Fetch the English translation for the verse using the new API-based function
    // We need to fetch all translations for the surah then pick the one we need.
    // Or, ideally, have a get-translation-verse endpoint. For now, let's fetch all.
    const translationVerseObjects = await fetchTranslationVersesBySurah(surahNumber, "en.yusufali");
    const translationsMap = translationVerseObjects.reduce((acc, verse) => {
      acc[verse.numberInSurah] = verse.translation;
      return acc;
    }, {} as Record<number, string | undefined>);
    const englishText = translationsMap[randomAyahNumber] || "Translation not available.";

    return {
      arabic: arabicText,
      english: englishText,
      surahName: surahEnglishName,
      surahNumber: surahNumber,
      verseNumberInSurah: randomAyahNumber,
    };

  } catch (error: any) {
    console.error('Error fetching random verse:', error.message);
    // Fallback structure in case of any error during the process
    return {
      arabic: 'Error loading verse.',
      english: 'Please try again later.',
      surahName: 'Error',
      surahNumber: 0,
      verseNumberInSurah: 0,
    };
  }
};