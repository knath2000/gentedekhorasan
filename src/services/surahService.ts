// src/services/surahService.ts
import { supabase } from '../lib/supabaseClient';
import { Surah, Verse } from '../types/quran';
// import { DailyVerseData } from '../types/quran'; // Removed DailyVerseData import

export const fetchSurahList = async (): Promise<Surah[]> => {
  try {
    const { data, error } = await supabase
      .from('surahlist')
      .select('*')
      .order('number', { ascending: true });

    if (error) {
      console.error('Supabase error fetching surah list:', error);
      throw error;
    }

    // Ensure the data matches the Surah interface, especially revelationType
    return (data || []).map(item => ({
      number: item.number, // Use 'number' directly as in Surah type
      name: item.name,
      englishName: item.englishName,
      englishNameTranslation: item.englishNameTranslation,
      numberOfAyahs: item.numberOfAyahs,
      revelationType: item.revelationType === 'Meccan' || item.revelationType === 'Medinan'
        ? item.revelationType
        : 'Meccan', // Default or handle error if type is unexpected. Consider throwing an error for unexpected values.
    })) as Surah[];
  } catch (error: any) {
    console.error('Error fetching surah list:', error.message);
    throw error;
  }
};

export const fetchSurahById = async (id: number): Promise<Surah | null> => {
  try {
    const { data, error } = await supabase
      .from('surahlist')
      .select('*')
      .eq('number', id) // Query by the 'number' column in the database
      .single();

    if (error) {
      console.error(`Supabase error fetching surah by id ${id}:`, error);
      if (error.code === 'PGRST116') {
        return null; // "No rows found" is not a critical error for a single fetch
      }
      throw error;
    }

    if (!data) {
      return null;
    }

    // Map the database item to the Surah type
    return {
      number: data.number, // Use 'number' directly
      name: data.name,
      englishName: data.englishName,
      englishNameTranslation: data.englishNameTranslation,
      numberOfAyahs: data.numberOfAyahs,
      revelationType: data.revelationType === 'Meccan' || data.revelationType === 'Medinan'
        ? data.revelationType
        : 'Meccan', // Default or handle error
    };
  } catch (error: any) {
    console.error(`Error fetching surah with id ${id}:`, error.message);
    throw error; // Re-throw the error to be handled by the caller
  }
}

export const fetchTranslationsBySurahId = async (surahId: number): Promise<Record<number, string>> => {
  try {
    console.log(`Fetching translations for surah ${surahId}`);
    const { data, error } = await supabase
      .from('yusufali') // Assuming your translations table is named 'yusufali'
      .select('aya, text') // Select verse number and translation text
      .eq('sura', surahId)
      .order('aya', { ascending: true });

    if (error) throw error;

    if (!data || data.length === 0) {
      console.warn(`No translations found for surah ${surahId}`);
      return {};
    }

    // Create a map of aya number to translation text
    return data.reduce((acc, item) => {
      acc[item.aya] = item.text;
      return acc;
    }, {} as Record<number, string>);
  } catch (error: any) {
    console.error(`Error fetching translations for surah ${surahId}:`, error.message);
    throw error;
  }
};

// Modify fetchVersesBySurahId to include translations
export const fetchVersesBySurahId = async (surahId: number): Promise<Verse[]> => {
  try {
    console.log(`Fetching verses for surah ${surahId}`);

    // Fetch Arabic text and translations in parallel for better performance
    const [verseData, translationsData] = await Promise.all([
      supabase
        .from('surah_all') // Your table for Arabic verses
        .select('sura, aya, text')
        .eq('sura', surahId)
        .order('aya', { ascending: true }),
      fetchTranslationsBySurahId(surahId)
    ]);

    const { data, error } = verseData;

    if (error) throw error;

    if (!data || data.length === 0) {
      console.warn(`No verses found for surah ${surahId}`);
      return [];
    }

    // Map from database columns to our Verse type, including translations
    return data.map(item => ({
      id: parseInt(`${item.sura}${item.aya}`, 10),
      surahId: item.sura,
      numberInSurah: item.aya,
      text: item.text,
      translation: translationsData[item.aya] || undefined
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
    // 1. Get total number of surahs
    const { data: surahs, error: surahsError } = await supabase
      .from('surahlist')
      .select('number, numberOfAyahs, englishName'); // Select only necessary fields

    if (surahsError) throw surahsError;
    if (!surahs || surahs.length === 0) throw new Error('No surahs found');

    // 2. Pick a random surah
    const randomSurahInfo = surahs[Math.floor(Math.random() * surahs.length)];
    const surahNumber = randomSurahInfo.number;
    const numberOfAyahsInSurah = randomSurahInfo.numberOfAyahs;
    const surahEnglishName = randomSurahInfo.englishName;

    // 3. Pick a random ayah number from that surah
    const randomAyahNumber = Math.floor(Math.random() * numberOfAyahsInSurah) + 1;

    // 4. Fetch the Arabic text for the verse
    const { data: verseData, error: verseError } = await supabase
      .from('surah_all')
      .select('text')
      .eq('sura', surahNumber)
      .eq('aya', randomAyahNumber)
      .single();

    if (verseError) throw verseError;
    if (!verseData) throw new Error(`Verse ${surahNumber}:${randomAyahNumber} not found`);
    const arabicText = verseData.text;

    // 5. Fetch the English translation for the verse
    const { data: translationData, error: translationError } = await supabase
      .from('yusufali')
      .select('text')
      .eq('sura', surahNumber)
      .eq('aya', randomAyahNumber)
      .single();

    if (translationError) throw translationError;
    // It's possible a translation might not exist for a specific verse, handle gracefully
    const englishText = translationData ? translationData.text : "Translation not available.";


    return {
      arabic: arabicText,
      english: englishText,
      surahName: surahEnglishName,
      surahNumber: surahNumber,
      verseNumberInSurah: randomAyahNumber,
    };

  } catch (error: any) {
    console.error('Error fetching random verse:', error.message);
    // Fallback or rethrow, depending on how DailyVerse.tsx handles errors
    // For now, let's return a placeholder error object that matches DailyVerseData structure
    return {
      arabic: 'Error loading verse.',
      english: 'Please try again later.',
      surahName: 'Error',
      surahNumber: 0,
      verseNumberInSurah: 0,
    };
  }
};