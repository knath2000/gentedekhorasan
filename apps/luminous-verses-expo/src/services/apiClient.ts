// src/services/apiClient.ts
import Constants from 'expo-constants';
import { Verse } from '../types/quran'; // Assuming Verse type is defined here

// Ensure API_BASE_URL is set in app.json extra, e.g., "https://your-vercel-deployment.vercel.app"
const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL || '/api/v2'; // Default to /api/v2

if (!API_BASE_URL) {
  console.warn(
    'API_BASE_URL is not defined in app.json (extra.API_BASE_URL). ' +
    'API calls will likely fail. Please set it to your Vercel deployment URL.'
  );
}

/**
 * Fetches all verses for a given Surah from the Vercel API.
 * @param surahId The number of the Surah (1-based).
 * @returns A Promise resolving to an array of Verse objects (without translations).
 */
export async function fetchVersesFromAPI(surahId: number): Promise<Omit<Verse, 'translation'>[]> {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured. Cannot fetch verses.');
  }
  try {
    const response = await fetch(`${API_BASE_URL}/get-verses?surah=${surahId}`);
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`API error fetching verses for Surah ${surahId}: ${response.status}`, errorData);
      throw new Error(`Failed to fetch verses for Surah ${surahId}. Status: ${response.status}`);
    }
    // The API already returns data in the Omit<Verse, 'translation'>[] structure
    return await response.json() as Omit<Verse, 'translation'>[];
  } catch (error) {
    console.error(`Error in fetchVersesFromAPI for Surah ${surahId}:`, error);
    throw error; // Re-throw to be handled by the caller
  }
}

/**
 * Fetches a single verse by Surah and Ayah number from the Vercel API.
 * @param surahId The number of the Surah (1-based).
 * @param ayahId The number of the Ayah within the Surah.
 * @returns A Promise resolving to a Verse object (without translation) or null if not found (API returns 404).
 */
export async function fetchVerseFromAPI(surahId: number, ayahId: number): Promise<Omit<Verse, 'translation'> | null> {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured. Cannot fetch verse.');
  }
  try {
    const response = await fetch(`${API_BASE_URL}/get-verse?surah=${surahId}&ayah=${ayahId}`);
    if (response.status === 404) {
      console.warn(`Verse ${surahId}:${ayahId} not found via API.`);
      return null;
    }
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`API error fetching verse ${surahId}:${ayahId}: ${response.status}`, errorData);
      throw new Error(`Failed to fetch verse ${surahId}:${ayahId}. Status: ${response.status}`);
    }
    // The API already returns data in the Omit<Verse, 'translation'> structure
    return await response.json() as Omit<Verse, 'translation'>;
  } catch (error) {
    console.error(`Error in fetchVerseFromAPI for ${surahId}:${ayahId}:`, error);
    throw error; // Re-throw to be handled by the caller
  }
}
/**
 * Fetches metadata from the API.
 * @param type The type of metadata to fetch: 'surah-list', 'sajdas', etc.
 * @returns A Promise resolving to the requested metadata or null if there was an error.
 */
export async function fetchMetadataFromAPI<T>(type: string): Promise<T | null> {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured. Cannot fetch metadata.');
  }
  try {
    const response = await fetch(`${API_BASE_URL}/get-metadata?type=${type}`);
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`API error fetching metadata (${type}): ${response.status}`, errorData);
      throw new Error(`Failed to fetch metadata. Status: ${response.status}`);
    }
    return await response.json() as T;
  } catch (error) {
    console.error(`Error in fetchMetadataFromAPI (${type}):`, error);
    throw error; // Re-throw to be handled by the caller
  }
}

/**
 * Fetches all translation verses for a given Surah and translator from the Vercel API.
 * @param surahId The number of the Surah (1-based).
 * @param translator The key for the translator (e.g., "en.yusufali").
 * @returns A Promise resolving to an array of objects containing translation text.
 */
export async function fetchTranslationVersesBySurah(surahId: number, translator: string): Promise<Pick<Verse, 'id' | 'surahId' | 'numberInSurah' | 'translation'>[]> {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured. Cannot fetch translation verses.');
  }
  try {
    const response = await fetch(`${API_BASE_URL}/get-translation-verses?surah=${surahId}&translator=${translator}`);
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`API error fetching translation verses for Surah ${surahId} (translator: ${translator}): ${response.status}`, errorData);
      throw new Error(`Failed to fetch translation verses for Surah ${surahId}, translator ${translator}. Status: ${response.status}`);
    }
    // The API returns data in Pick<Verse, 'id' | 'surahId' | 'numberInSurah' | 'translation'>[] structure
    return await response.json() as Pick<Verse, 'id' | 'surahId' | 'numberInSurah' | 'translation'>[];
  } catch (error) {
    console.error(`Error in fetchTranslationVersesBySurah for Surah ${surahId} (translator: ${translator}):`, error);
    throw error; // Re-throw to be handled by the caller
  }
}

/**
 * Fetches a single verse with its translation from the Vercel API.
 * @param surahId The number of the Surah (1-based).
 * @param ayahId The number of the Ayah within the Surah.
 * @param translator The key for the translator (e.g., "en.yusufali").
 * @returns A Promise resolving to a Verse object (with Arabic text and translation) or null if not found.
 */
export async function fetchSingleTranslatedVerse(surahId: number, ayahId: number, translator: string): Promise<Verse | null> {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured. Cannot fetch translated verse.');
  }
  try {
    const response = await fetch(`${API_BASE_URL}/get-translated-verse?surah=${surahId}&ayah=${ayahId}&translator=${translator}`);
    if (response.status === 404) {
      console.warn(`Translated verse ${surahId}:${ayahId} (translator: ${translator}) not found via API.`);
      return null;
    }
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`API error fetching translated verse ${surahId}:${ayahId} (translator: ${translator}): ${response.status}`, errorData);
      throw new Error(`Failed to fetch translated verse ${surahId}:${ayahId}, translator ${translator}. Status: ${response.status}`);
    }
    return await response.json() as Verse; // API returns the full Verse object
  } catch (error) {
    console.error(`Error in fetchSingleTranslatedVerse for ${surahId}:${ayahId} (translator: ${translator}):`, error);
    throw error; // Re-throw to be handled by the caller
  }
}
