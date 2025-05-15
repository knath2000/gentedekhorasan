// src/services/surahService.ts
import Constants from 'expo-constants';
import { Surah, Verse } from '../types/quran';
// import { getVerseFromDb, getVersesBySurahFromDb } from './quranDbService'; // Old DB functions
import { fetchVerseFromAPI, fetchVersesFromAPI } from './apiClient'; // New API client functions

export const fetchSurahList = async (): Promise<Surah[]> => {
  try {
    const vercelBlobBaseUrl = Constants.expoConfig?.extra?.VERCEL_BLOB_URL_BASE as string;
    if (!vercelBlobBaseUrl) {
      console.error('VERCEL_BLOB_URL_BASE is not defined in app.json extra. Cannot fetch Surah list.');
      throw new Error('Application configuration error: Vercel Blob URL base is missing.');
    }
    
    const surahListUrl = `https://${vercelBlobBaseUrl.replace(/\/$/, '')}/quran-data/surahlist.json`;
    console.log(`Fetching Surah list from: ${surahListUrl}`);

    const response = await fetch(surahListUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch Surah list from Vercel Blob. Status: ${response.status}`);
    }

    const data = await response.json() as Surah[];

    return (data || []).map(item => ({
      ...item,
      revelationType: item.revelationType === 'Meccan' || item.revelationType === 'Medinan'
        ? item.revelationType
        : 'Meccan', 
    }));

  } catch (error: any) {
    console.error('Error fetching surah list:', error.message);
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

export const fetchTranslationsBySurahId = async (surahId: number): Promise<Record<number, string>> => {
  try {
    console.log(`Fetching Yusuf Ali translations for surah ${surahId} from Vercel Blob...`);
    const vercelBlobBaseUrl = Constants.expoConfig?.extra?.VERCEL_BLOB_URL_BASE as string;
    if (!vercelBlobBaseUrl) {
      console.error('VERCEL_BLOB_URL_BASE is not defined in app.json extra. Cannot fetch translations.');
      throw new Error('Application configuration error: Vercel Blob URL base is missing.');
    }

    const translationUrl = `https://${vercelBlobBaseUrl.replace(/\/$/, '')}/quran-data/translation/yusufali/${surahId}.json`;
    console.log(`Fetching translations from: ${translationUrl}`);

    const response = await fetch(translationUrl);
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`No Yusuf Ali translation file found for surah ${surahId} at ${translationUrl}. Returning empty translations.`);
        return {};
      }
      throw new Error(`Failed to fetch Yusuf Ali translations for Surah ${surahId} from Vercel Blob. Status: ${response.status}`);
    }

    const translationDataArray = await response.json() as { aya: number; text: string }[];

    if (!translationDataArray || translationDataArray.length === 0) {
      console.warn(`No translation items found in the JSON for surah ${surahId}`);
      return {};
    }

    return translationDataArray.reduce((acc, item) => {
      acc[item.aya] = item.text;
      return acc;
    }, {} as Record<number, string>);
  } catch (error: any) {
    console.error(`Error fetching Yusuf Ali translations for surah ${surahId}:`, error.message);
    throw error; // Re-throw to be handled by the caller, e.g., fetchVersesBySurahId
  }
};

export const fetchVersesBySurahId = async (surahId: number): Promise<Verse[]> => {
  try {
    console.log(`Fetching verses for surah ${surahId} (Arabic from API, Translation from Blob)`);

    // Fetch Arabic text from Vercel API
    const arabicVersesFromAPI = await fetchVersesFromAPI(surahId);

    if (!arabicVersesFromAPI || arabicVersesFromAPI.length === 0) {
      console.warn(`No Arabic verses found for surah ${surahId} from API.`);
      return [];
    }

    // Fetch translations from Vercel Blob (existing logic)
    const translationsData = await fetchTranslationsBySurahId(surahId);

    // Combine Arabic text from API with translations
    return arabicVersesFromAPI.map(apiVerse => ({
      id: apiVerse.id, 
      surahId: apiVerse.surahId, 
      numberInSurah: apiVerse.numberInSurah,
      text: apiVerse.text, 
      translation: translationsData[apiVerse.numberInSurah] || undefined 
    }));
  } catch (error: any) {
    console.error(`Error fetching verses for surah ${surahId}:`, error.message);
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

    // Fetch the English translation for the verse using the existing service function (from Vercel Blob)
    const translationsForSurah = await fetchTranslationsBySurahId(surahNumber);
    const englishText = translationsForSurah[randomAyahNumber] || "Translation not available.";

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